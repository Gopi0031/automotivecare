import { NextResponse } from "next/server";

export async function GET() {
  console.log("\n=== CLOUDINARY API DEBUG ===");
  console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING");
  console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING");

  try {
    const cloudinaryModule = await import("cloudinary");
    const cloudinary = cloudinaryModule.v2;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("❌ Missing Cloudinary credentials!");
      return NextResponse.json({ 
        images: [],
        error: "Missing credentials",
        debug: {
          cloudName: cloudName ? "SET" : "MISSING",
          apiKey: apiKey ? "SET" : "MISSING",
          apiSecret: apiSecret ? "SET" : "MISSING"
        }
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    console.log("✅ Cloudinary configured successfully");
    console.log("📁 Fetching from folder: automotive-carcare/hero-images");

    // Try fetching images
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "automotive-carcare/hero-images",
      max_results: 50,
    });

    console.log("✅ Images found:", result.resources?.length || 0);
    
    if (result.resources && result.resources.length > 0) {
      console.log("📷 First image:", result.resources[0].secure_url);
    }

    return NextResponse.json({ 
      images: result.resources || [],
      count: result.resources?.length || 0,
      success: true
    });

  } catch (error) {
    console.error("❌ Cloudinary API Error:", error.message);
    console.error("Full error:", error);
    
    return NextResponse.json({ 
      images: [],
      error: error.message,
      errorType: error.error?.http_code || "unknown"
    });
  }
}
