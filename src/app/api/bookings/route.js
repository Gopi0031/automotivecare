import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "automotivecarcare";
const COLLECTION_NAME = "bookings";

// GET - Fetch all bookings
export async function GET() {
  try {
    console.log("✅ GET /api/bookings called");
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const bookings = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Found ${bookings.length} bookings`);
    
    return NextResponse.json({ 
      success: true, 
      bookings 
    });
  } catch (error) {
    console.error("❌ GET bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    console.log("✅ POST /api/bookings called");
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();
    
    console.log("Received booking data:", body);
    
    // ✅ Validate required fields (additionalServices is optional)
    const requiredFields = ['name', 'email', 'phone', 'service', 'vehicleBrand', 'vehicleModel', 'bookingDate', 'bookingTime'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error("Missing fields:", missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // ✅ Create booking document (no price fields)
    const bookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service, // Primary service slug
      serviceName: body.serviceName || "",
      additionalServices: body.additionalServices || [], // Optional array of services
      vehicleBrand: body.vehicleBrand || "",
      vehicleModel: body.vehicleModel || "",
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      notes: body.notes || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log("Inserting booking into database...");
    const result = await db.collection(COLLECTION_NAME).insertOne(bookingData);
    
    const booking = {
      _id: result.insertedId,
      ...bookingData,
    };
    
    console.log("✅ Booking created with ID:", booking._id);
    
    // Send email notifications to both customer and admin
    try {
      console.log("Attempting to send email notifications...");
      const { sendBookingNotification } = await import("@/lib/email");
      await sendBookingNotification(booking);
      console.log("✅ Email notifications sent successfully");
    } catch (emailError) {
      console.error("⚠️ Email error (booking still created):", emailError.message);
      // Continue even if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Booking submitted successfully! Check your email for confirmation."
    });
  } catch (error) {
    console.error("❌ POST booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Accept/Update booking status
export async function PUT(request) {
  try {
    console.log("\n========== PUT /api/bookings called ==========");
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();
    
    const { _id, status } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }
    
    // Validate and convert ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID format" },
        { status: 400 }
      );
    }
    
    const bookingId = new ObjectId(_id);
    
    // Check if booking exists
    const existingBooking = await db.collection(COLLECTION_NAME).findOne({ _id: bookingId });
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: `Booking not found with ID: ${_id}` },
        { status: 404 }
      );
    }
    
    console.log("✅ Existing booking found:", existingBooking.name);
    console.log("Customer email:", existingBooking.email);
    
    // Update booking status
    const updateData = {
      status: status || "confirmed",
      updatedAt: new Date(),
    };
    
    const updateResult = await db.collection(COLLECTION_NAME).updateOne(
      { _id: bookingId },
      { $set: updateData }
    );
    
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update booking" },
        { status: 500 }
      );
    }
    
    // Fetch updated booking
    const updatedBooking = await db.collection(COLLECTION_NAME).findOne({ _id: bookingId });
    console.log("✅ Booking updated to status:", updatedBooking.status);
    
    // Send acceptance email to customer
    let emailSuccess = false;
    let emailError = null;
    
    if (status === "confirmed") {
      try {
        console.log("\n📧 EMAIL SENDING ATTEMPT");
        console.log("To:", updatedBooking.email);
        console.log("From:", process.env.EMAIL_USER);
        
        const { sendAcceptanceEmail } = await import("@/lib/email");
        
        console.log("Calling sendAcceptanceEmail...");
        await sendAcceptanceEmail(updatedBooking);
        
        console.log("✅ Email sent successfully!");
        emailSuccess = true;
        
      } catch (error) {
        emailError = error.message;
        console.error("\n❌ EMAIL FAILED!");
        console.error("Error message:", error.message);
      }
    }
    
    console.log("========== Request completed ==========\n");
    
    return NextResponse.json({ 
      success: true, 
      booking: updatedBooking,
      emailSent: emailSuccess,
      emailError: emailError,
      message: emailSuccess 
        ? "Booking confirmed! Confirmation email sent to customer." 
        : `Booking confirmed, but email failed: ${emailError}`
    });
    
  } catch (error) {
    console.error("❌ PUT booking error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking
export async function DELETE(request) {
  try {
    console.log("✅ DELETE /api/bookings called");
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("Deleting booking ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }
    
    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID format" },
        { status: 400 }
      );
    }
    
    const bookingId = new ObjectId(id);
    
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: bookingId,
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }
    
    console.log("✅ Booking deleted successfully");
    
    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
