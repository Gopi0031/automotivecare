// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// // GET all vehicle types
// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("automotivecarcare");
//     const vehicleTypes = await db
//       .collection("vehicleTypes")
//       .find({})
//       .sort({ order: 1 })
//       .toArray();

//     return NextResponse.json({ vehicleTypes });
//   } catch (error) {
//     console.error("Vehicle types error:", error);
//     return NextResponse.json({ vehicleTypes: [] });
//   }
// }

// // POST new vehicle type
// // POST new vehicle type
// export async function POST(request) {
//   try {
//     const vehicleData = await request.json();
    
//     // Auto-generate slug from name if not provided
//     if (!vehicleData.slug) {
//       vehicleData.slug = vehicleData.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, '');
//     }
    
//     const client = await clientPromise;
//     const db = client.db("automotivecarcare");
    
//     const result = await db.collection("vehicleTypes").insertOne({
//       ...vehicleData,
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ 
//       success: true, 
//       id: result.insertedId 
//     });
//   } catch (error) {
//     console.error("Vehicle type creation error:", error);
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }


// // DELETE vehicle type
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
    
//     const client = await clientPromise;
//     const db = client.db("automotivecarcare");
//     const { ObjectId } = require("mongodb");
    
//     await db.collection("vehicleTypes").deleteOne({ _id: new ObjectId(id) });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Vehicle type deletion error:", error);
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }
