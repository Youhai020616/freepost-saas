import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { handleApiError, errors } from "@/lib/errors";
import { validateRequest } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { patterns } from "@/lib/validation/schemas";

// Schema for creating social account
const createSocialAccountSchema = z.object({
  provider: patterns.platform,
  externalId: z.string().min(1, 'External ID is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

// POST /api/social-accounts - create a social account record (after oauth)
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();

    // Validate request body
    const data = await validateRequest(req, createSocialAccountSchema);

    logger.info('Creating social account', {
      workspaceId,
      provider: data.provider,
      externalId: data.externalId
    });

    // Check if account already exists
    const existing = await prisma.socialAccount.findFirst({
      where: {
        workspaceId,
        provider: data.provider,
        externalId: data.externalId,
      },
    });

    if (existing) {
      // Update existing account instead of creating duplicate
      logger.info('Updating existing social account', {
        accountId: existing.id
      });

      const updated = await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          meta: data.meta ?? null,
        },
      });

      return NextResponse.json({ data: updated }, { status: 200 });
    }

    // Create new account
    const account = await prisma.socialAccount.create({
      data: {
        workspaceId,
        provider: data.provider,
        externalId: data.externalId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? null,
        meta: data.meta ?? null,
      },
    });

    logger.info('Social account created successfully', {
      accountId: account.id,
      provider: account.provider
    });

    return NextResponse.json({ data: account }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/social-accounts
export async function GET() {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();

    logger.debug('Fetching social accounts', { workspaceId });

    // Optimized query - don't expose tokens in list view
    const accounts = await prisma.socialAccount.findMany({
      where: { workspaceId },
      select: {
        id: true,
        provider: true,
        externalId: true,
        meta: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive tokens
      },
      orderBy: { createdAt: "desc" },
    });

    logger.debug('Social accounts fetched', {
      workspaceId,
      count: accounts.length
    });

    return NextResponse.json({ data: accounts });
  } catch (error) {
    return handleApiError(error);
  }
}
