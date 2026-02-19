import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "automotivecarcare";
const COLLECTION_NAME = "vehicleBrands";

// GET - Fetch all vehicle brands with their models
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const brands = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ name: 1 })
      .toArray();

    console.log("✅ Vehicle brands fetched:", brands.length);
    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("❌ Error fetching vehicle brands:", error);
    return NextResponse.json(
      { success: false, error: error.message, brands: [] },
      { status: 500 }
    );
  }
}

// POST - Add new vehicle brand with models
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    const { name, models } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Brand name is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingBrand = await db.collection(COLLECTION_NAME).findOne({ slug });
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: "Brand already exists" },
        { status: 400 }
      );
    }

    const brandData = {
      name,
      slug,
      models: models || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(brandData);

    console.log("✅ Brand created:", name, "with", models?.length || 0, "models");

    return NextResponse.json({
      success: true,
      brand: { _id: result.insertedId, ...brandData },
    });
  } catch (error) {
    console.error("❌ Error creating vehicle brand:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update vehicle brand
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    const { _id, name, models } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Brand ID is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updateData = {
      name,
      slug,
      models: models || [],
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    console.log("✅ Brand updated:", name);

    return NextResponse.json({ success: true, brand: result.value });
  } catch (error) {
    console.error("❌ Error updating vehicle brand:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete vehicle brand
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Brand ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    console.log("✅ Brand deleted");

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting vehicle brand:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
