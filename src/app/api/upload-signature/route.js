import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cloudinaryModule = await import("cloudinary");
    const cloudinary = cloudinaryModule.v2;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("=== Upload Signature Request ===");
    console.log("Cloud Name:", cloudName || "MISSING");
    console.log("API Key:", apiKey || "MISSING");
    console.log("API Secret:", apiSecret ? "SET" : "MISSING");

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials missing" },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "automotive-carcare/hero-images";

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      apiSecret
    );

    console.log("Signature generated for folder:", folder);

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      apiKey: apiKey,
      cloudName: cloudName,
    });
  } catch (err) {
    console.error("Signature error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
