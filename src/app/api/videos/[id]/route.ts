import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await ctx.params;
  const video = await Video.findById(id);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only attempt Cloudinary delete for cloudinary-sourced videos with a publicId
  const publicId: string | undefined = (video as { publicId?: string }).publicId;
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch {}
  }
  await Video.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}


