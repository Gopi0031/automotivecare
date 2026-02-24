import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DBNAME = "automotivecarcare";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DBNAME);
    const services = await db
      .collection("special-services")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, tagline, description, content, heroImage, heroImagePublicId, contentImage, contentImagePublicId, slug, order } = body;

    if (!name || !tagline || !description || !content || !heroImage || !contentImage) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DBNAME);
    const result = await db.collection("special-services").insertOne({
      name, tagline, description, content,
      heroImage, heroImagePublicId,
      contentImage, contentImagePublicId,
      slug, order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body; // ✅ _id

    if (!_id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DBNAME);
    const result = await db.collection("special-services").updateOne(
      { _id: new ObjectId(_id) }, // ✅ _id
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DBNAME);
    const result = await db.collection("special-services").deleteOne({ _id: new ObjectId(id) }); // ✅ _id

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}