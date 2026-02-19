import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    // Fetch images from specific folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "automotive-carcare/hero-images",
      max_results: 50,
    });

    return NextResponse.json({ images: result.resources || [] });
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
