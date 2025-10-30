import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos. Please try again later." }, 
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const contentType = request.headers.get("content-type") || "";

    // JSON path: accept metadata after a direct-to-Cloudinary upload
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const title = String(body.title || "Untitled");
      const secureUrl: string | undefined = body.secureUrl;
      const publicId: string | undefined = body.publicId;
      const youtubeUrl: string | undefined = body.youtubeUrl;

      if (youtubeUrl && youtubeUrl.trim().length > 0) {
        const generateUniqueId = () => `youtube_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const created = await Video.create({
          title,
          url: youtubeUrl.trim(),
          publicId: generateUniqueId(),
          sourceType: "youtube",
        });
        return NextResponse.json(created, { status: 201 });
      }

      if (!secureUrl || !publicId) {
        return NextResponse.json({ error: "secureUrl and publicId are required" }, { status: 400 });
      }

      const created = await Video.create({
        title,
        url: secureUrl,
        publicId,
        sourceType: "cloudinary",
      });
      return NextResponse.json(created, { status: 201 });
    }

    // Multipart path (local dev or small files)
    const formData = await request.formData();

  const file = formData.get("file");
  const title = String(formData.get("title") || "Untitled");
  const youtubeUrl = formData.get("youtubeUrl");

  // If a YouTube URL is provided, save it directly without Cloudinary
  if (typeof youtubeUrl === "string" && youtubeUrl.trim().length > 0) {
    // Generate unique ID for YouTube videos to avoid duplicate key errors
    const generateUniqueId = () => `youtube_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const created = await Video.create({
      title,
      url: youtubeUrl.trim(),
      publicId: generateUniqueId(),
      sourceType: "youtube",
    });
    return NextResponse.json(created, { status: 201 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "khalil-studio/testimonials" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });

    const created = await Video.create({
      title,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      sourceType: "cloudinary",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video. Please try again later." }, 
      { status: 503 }
    );
  }
}


