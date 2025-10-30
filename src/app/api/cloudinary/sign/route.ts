import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // Only sign params that will be sent to Cloudinary in the upload form
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder: "khalil-studio/testimonials",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: paramsToSign.folder,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}


