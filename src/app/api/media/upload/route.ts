import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";

// POST /api/media/upload (placeholder)
export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await requireSessionAndWorkspace();
    const formData = await req.formData();
    // TODO: validate file, store to S3 or local, generate thumb
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    // mock url
    const url = `/uploads/${Date.now()}-${file.name}`;
    const media = await prisma.media.create({
      data: {
        workspaceId,
        url,
        mime: (file as File).type || "application/octet-stream",
        size: (file as any).size ?? 0,
      },
    });
    return NextResponse.json({ data: media }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "unauthorized" ? 401 : msg === "forbidden" ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
