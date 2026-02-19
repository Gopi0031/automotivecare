import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch all car models or filter by brand
export async function GET(req) {
  try {
    console.log("✅ GET /api/car-models called");
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("carmodels");

    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");

    let query = {};
    if (brand) {
      query.brandSlug = brand;
    }

    const models = await collection.find(query).sort({ brand: 1, name: 1 }).toArray();
    console.log(`Found ${models.length} car models`);

    return NextResponse.json({
      success: true,
      models,
    });
  } catch (error) {
    console.error("❌ Error fetching car models:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new car model
export async function POST(req) {
  try {
    console.log("✅ POST /api/car-models called");
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("carmodels");

    const body = await req.json();
    console.log("Received data:", body);

    const { brand, name, image, cloudinaryPublicId, serviceCount } = body;

    // Validation
    if (!brand || !name || !image || !cloudinaryPublicId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slugs
    const brandSlug = brand
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if model already exists
    const existingModel = await collection.findOne({ brand, name });
    if (existingModel) {
      return NextResponse.json(
        { success: false, error: "This model already exists for this brand" },
        { status: 400 }
      );
    }

    // Create new model
    const newModel = {
      brand,
      brandSlug,
      name,
      slug,
      image,
      cloudinaryPublicId,
      serviceCount: serviceCount || 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newModel);
    console.log("✅ Car model created with ID:", result.insertedId);

    return NextResponse.json({
      success: true,
      model: { ...newModel, _id: result.insertedId },
      message: "Car model added successfully!",
    });
  } catch (error) {
    console.error("❌ Error creating car model:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update car model
export async function PUT(req) {
  try {
    console.log("✅ PUT /api/car-models called");
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("carmodels");

    const body = await req.json();
    const { _id, brand, name, image, cloudinaryPublicId, serviceCount } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Model ID is required" },
        { status: 400 }
      );
    }

    // Generate slugs
    const brandSlug = brand
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updateData = {
      brand,
      brandSlug,
      name,
      slug,
      image,
      cloudinaryPublicId,
      serviceCount,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    console.log("✅ Car model updated");

    return NextResponse.json({
      success: true,
      model: result.value,
      message: "Car model updated successfully!",
    });
  } catch (error) {
    console.error("❌ Error updating car model:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete car model
export async function DELETE(req) {
  try {
    console.log("✅ DELETE /api/car-models called");
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("carmodels");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Model ID is required" },
        { status: 400 }
      );
    }

    const deletedModel = await collection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletedModel.value) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    console.log("✅ Car model deleted");

    // Also delete image from Cloudinary
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cloudinary-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: deletedModel.value.cloudinaryPublicId }),
      });
    } catch (cloudinaryError) {
      console.warn("⚠️ Failed to delete image from Cloudinary:", cloudinaryError);
    }

    return NextResponse.json({
      success: true,
      message: "Car model deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting car model:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
