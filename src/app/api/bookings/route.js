import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DBNAME = "automotivecarcare";
const COLLECTIONNAME = "bookings";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DBNAME);
    const bookings = await db
      .collection(COLLECTIONNAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DBNAME);
    const body = await request.json();

    const requiredFields = ['name', 'email', 'phone', 'service', 'vehicleBrand', 'vehicleModel', 'bookingDate', 'bookingTime'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const bookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      serviceName: body.serviceName || "",
      serviceType: body.serviceType || "general", // ✅ "general" or "special"
      additionalServices: body.additionalServices || [],
      vehicleBrand: body.vehicleBrand || "",
      vehicleModel: body.vehicleModel || "",
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      notes: body.notes || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONNAME).insertOne(bookingData);
    const booking = { id: result.insertedId, ...bookingData };

    try {
      const { sendBookingNotification } = await import("@/lib/email");
      await sendBookingNotification(booking);
    } catch (emailError) {
      console.error("Email error:", emailError.message);
    }

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking submitted successfully! Check your email for confirmation."
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DBNAME);
    const body = await request.json();
    const { _id, status } = body; // ✅ Use _id

    if (!_id) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json({ success: false, error: "Invalid booking ID format" }, { status: 400 });
    }

    const bookingId = new ObjectId(_id); // ✅ Fixed

    const existingBooking = await db.collection(COLLECTIONNAME).findOne({ _id: bookingId }); // ✅ _id
    if (!existingBooking) {
      return NextResponse.json({ success: false, error: `Booking not found` }, { status: 404 });
    }

    await db.collection(COLLECTIONNAME).updateOne(
      { _id: bookingId }, // ✅ _id
      { $set: { status: status || "confirmed", updatedAt: new Date() } }
    );

    const updatedBooking = await db.collection(COLLECTIONNAME).findOne({ _id: bookingId }); // ✅ _id

    let emailSuccess = false;
    let emailError = null;
    if (status === "confirmed") {
      try {
        const { sendAcceptanceEmail } = await import("@/lib/email");
        await sendAcceptanceEmail(updatedBooking);
        emailSuccess = true;
      } catch (error) {
        emailError = error.message;
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      emailSent: emailSuccess,
      emailError: emailError,
      message: emailSuccess
        ? "Booking confirmed! Confirmation email sent."
        : `Booking confirmed, but email failed: ${emailError}`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DBNAME);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid booking ID format" }, { status: 400 });
    }

    const result = await db.collection(COLLECTIONNAME).deleteOne({ _id: new ObjectId(id) }); // ✅ _id

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}