import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch all car brands
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("automotivecarcare");
    const brands = await db.collection("carbrands").find({}).sort({ name: 1 }).toArray();

    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Add new car brand
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, logo, cloudinaryPublicId } = body;

    if (!name || !logo || !cloudinaryPublicId) {
      return NextResponse.json(
        { success: false, error: "Name, logo, and cloudinaryPublicId are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("automotivecarcare");

    const brandSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if brand already exists
    const existingBrand = await db.collection("carbrands").findOne({ brandSlug });
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: "Brand already exists" },
        { status: 400 }
      );
    }

    const newBrand = {
      name,
      brandSlug,
      logo,
      cloudinaryPublicId,
      createdAt: new Date(),
    };

    const result = await db.collection("carbrands").insertOne(newBrand);

    return NextResponse.json({ success: true, brand: { ...newBrand, _id: result.insertedId } });
  } catch (error) {
    console.error("Error adding brand:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Update car brand
export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, name, logo, cloudinaryPublicId } = body;

    if (!_id || !name) {
      return NextResponse.json(
        { success: false, error: "ID and name are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("automotivecarcare");

    const brandSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updateData = {
      name,
      brandSlug,
      updatedAt: new Date(),
    };

    if (logo) updateData.logo = logo;
    if (cloudinaryPublicId) updateData.cloudinaryPublicId = cloudinaryPublicId;

    const result = await db.collection("carbrands").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Delete car brand
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("automotivecarcare");

    const result = await db.collection("carbrands").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
