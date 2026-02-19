// app/api/special-services/route.js
// MongoDB API for Special Services
// Uses the same pattern as your existing /api/services route

import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "automotive-carcare";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection("special-services");
}

// GET all special services
export async function GET() {
  try {
    const collection = await getCollection();
    const services = await collection.find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - create a new special service
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      tagline,
      description,
      content,
      heroImage,
      heroImagePublicId,
      contentImage,
      contentImagePublicId,
      slug,
      order,
    } = body;

    if (!name || !tagline || !description || !content || !heroImage || !contentImage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    const result = await collection.insertOne({
      name,
      tagline,
      description,
      content,
      heroImage,
      heroImagePublicId,
      contentImage,
      contentImagePublicId,
      slug,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - update an existing special service
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Missing _id" }, { status: 400 });
    }

    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
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

// DELETE - remove a special service
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}