import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all services
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("automotivecarcare");
    const services = await db
      .collection("services")
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Services error:", error);
    return NextResponse.json({ services: [] });
  }
}

// POST new service
export async function POST(request) {
  try {
    const serviceData = await request.json();
    
    // Auto-generate slug from name if not provided
    if (!serviceData.slug) {
      serviceData.slug = serviceData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const client = await clientPromise;
    const db = client.db("automotivecarcare");
    
    const result = await db.collection("services").insertOne({
      ...serviceData,
      image: serviceData.image || null,
      cloudinaryPublicId: serviceData.cloudinaryPublicId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// PUT update service
export async function PUT(request) {
  try {
    const { _id, ...serviceData } = await request.json();
    
    const client = await clientPromise;
    const db = client.db("automotivecarcare");
    
    const result = await db.collection("services").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { 
        ...serviceData, 
        image: serviceData.image || null,
        cloudinaryPublicId: serviceData.cloudinaryPublicId || null,
        updatedAt: new Date() 
      } }
    );

    return NextResponse.json({ 
      success: true,
      modified: result.modifiedCount 
    });
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const client = await clientPromise;
    const db = client.db("automotivecarcare");
    
    await db.collection("services").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service deletion error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}