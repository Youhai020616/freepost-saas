import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { uploadToBucket } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { handleApiError, errors } from "@/lib/errors";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/media/upload
 * Upload media file to Supabase storage
 */
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();

    // Rate limiting (10 uploads per minute)
    const identifier = req.headers.get('x-forwarded-for') || workspaceId;
    const { success, remaining } = await rateLimit(identifier, 'api');

    if (!success) {
      logger.warn('Rate limit exceeded for media upload', { identifier, workspaceId });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'X-RateLimit-Remaining': remaining.toString() }
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Validate file exists and is a File instance
    if (!file || !(file instanceof File)) {
      throw errors.badRequest("File is required", { field: "file" });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw errors.badRequest(
        `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        { size: file.size, maxSize }
      );
    }

    // Validate file type (images and videos only)
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/webm'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw errors.badRequest(
        "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, WebM) are allowed",
        { type: file.type, allowedTypes }
      );
    }

    logger.info('Uploading media file', {
      workspaceId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Generate unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'bin';
    const path = `${workspaceId}/${timestamp}-${randomString}.${extension}`;

    // Upload to Supabase storage
    const bucket = env.SUPABASE_STORAGE_BUCKET || 'media';
    const publicUrl = await uploadToBucket({
      bucket,
      path,
      file,
      contentType: file.type,
    });

    // Create media record in database
    const media = await prisma.media.create({
      data: {
        workspaceId,
        url: publicUrl,
        mime: file.type,
        size: file.size,
      },
    });

    logger.info('Media file uploaded successfully', {
      mediaId: media.id,
      workspaceId,
      url: publicUrl,
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    logger.error('Media upload failed', { error });
    return handleApiError(error);
  }
}
