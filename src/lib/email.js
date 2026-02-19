import nodemailer from "nodemailer";

// Send booking notification (when customer submits form)
export async function sendBookingNotification(booking) {
  try {
    console.log("📧 Attempting to send booking notification emails...");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To Customer:", booking.email);
    console.log("To Admin:", process.env.ADMIN_EMAIL);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // Format services - handle both single and multiple
    let servicesText = '';
    let servicesHTML = '';

    if (booking.serviceName) {
      // Primary service
      servicesText = `Service: ${booking.serviceName}`;
      servicesHTML = `
        <tr>
          <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600; width: 35%;">Service:</td>
          <td style="padding: 10px 0; color: #2d3436; font-size: 15px; font-weight: 500;">${booking.serviceName}</td>
        </tr>
      `;
    }

    // Additional services (if any)
    if (booking.additionalServices && booking.additionalServices.length > 0) {
      const additionalNames = booking.additionalServices.map(s => s.name).join(', ');
      servicesText += `\nAdditional Services: ${additionalNames}`;
      servicesHTML += `
        <tr>
          <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600;">Additional Services:</td>
          <td style="padding: 10px 0; color: #2d3436; font-size: 15px; font-weight: 500;">
            ${additionalNames}
          </td>
        </tr>
      `;
    }

    // Email to CUSTOMER
    const customerEmail = {
      from: `"Automotive Car Care" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "🚗 Booking Received - Automotive Car Care",
      text: `Dear ${booking.name},\n\nThank you for your booking!\n\n${servicesText}\nVehicle: ${booking.vehicleBrand} ${booking.vehicleModel}\nDate: ${booking.bookingDate}\nTime: ${booking.bookingTime}\n\nWe will confirm shortly.`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Received</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
                  
                  <!-- Header with gradient -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                          🚗 Automotive Car Care
                        </h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 400;">
                          Premium Vehicle Service
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Status Badge -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding-bottom: 30px;">
                              <span style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); color: #2d3436; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(253,203,110,0.4);">
                                📋 Booking Received
                              </span>
                            </td>
                          </tr>
                        </table>

                        <!-- Greeting -->
                        <h2 style="margin: 0 0 10px 0; color: #2d3436; font-size: 24px; font-weight: 600;">
                          Hello ${booking.name}! 👋
                        </h2>
                        <p style="margin: 0 0 30px 0; color: #636e72; font-size: 16px; line-height: 1.6;">
                          Thank you for choosing <strong>Automotive Car Care</strong>! We've received your booking request and our team will review it shortly.
                        </p>

                        <!-- Booking Details Card -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; border: 2px solid #e8eaff; overflow: hidden;">
                          <tr>
                            <td style="padding: 25px;">
                              <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e8eaff; padding-bottom: 12px;">
                                📋 Booking Details
                              </h3>
                              
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                ${servicesHTML}
                                <tr>
                                  <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600;">Vehicle:</td>
                                  <td style="padding: 10px 0; color: #2d3436; font-size: 15px; font-weight: 500;">${booking.vehicleBrand} ${booking.vehicleModel}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600;">Date:</td>
                                  <td style="padding: 10px 0; color: #2d3436; font-size: 15px; font-weight: 500;">${booking.bookingDate}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600;">Time:</td>
                                  <td style="padding: 10px 0; color: #2d3436; font-size: 15px; font-weight: 500;">${booking.bookingTime}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 10px 0; color: #636e72; font-size: 14px; font-weight: 600;">Booking ID:</td>
                                  <td style="padding: 10px 0;">
                                    <span style="display: inline-block; padding: 6px 12px; background: #667eea; color: #ffffff; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                                      #${booking._id.toString().slice(-8).toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Info Box -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 25px 20px; margin-top: 25px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px;">
                              <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                <strong>⏳ What happens next?</strong><br>
                                Our team will review your booking and send you a confirmation email within 24 hours. You'll receive all the details once approved!
                              </p>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 15px 0; color: #2d3436; font-size: 16px; font-weight: 600;">
                          Need Help? We're Here! 💬
                        </p>
                        <p style="margin: 0; color: #636e72; font-size: 14px; line-height: 1.8;">
                          📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none; font-weight: 500;">${process.env.EMAIL_USER}</a><br>
                          📞 <span style="color: #2d3436; font-weight: 500;">${process.env.CONTACT_PHONE || '+91 XXXXX XXXXX'}</span>
                        </p>
                        <p style="margin: 20px 0 0 0; color: #b2bec3; font-size: 12px;">
                          © 2025 Automotive Car Care. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    // Email to ADMIN
    const adminEmail = {
      from: `"Automotive Car Care" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: "🔔 New Booking - Action Required",
      text: `New booking from ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\n${servicesText}\nVehicle: ${booking.vehicleBrand} ${booking.vehicleModel}\nDate: ${booking.bookingDate}\nTime: ${booking.bookingTime}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking Alert</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f3f5; padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Urgent Header -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          🔔 New Booking Alert!
                        </h1>
                        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.95); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                          Action Required
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 35px 30px;">
                        
                        <p style="margin: 0 0 25px 0; color: #2d3436; font-size: 16px; line-height: 1.6;">
                          You have received a <strong style="color: #e74c3c;">new booking request</strong> that requires your attention.
                        </p>

                        <!-- Customer & Booking Details Card -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef; overflow: hidden;">
                          <tr>
                            <td style="padding: 25px;">
                              
                              <!-- Customer Info -->
                              <h3 style="margin: 0 0 15px 0; color: #2d3436; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                👤 Customer Information
                              </h3>
                              
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600; width: 30%;">Name:</td>
                                  <td style="padding: 8px 0; color: #2d3436; font-size: 15px; font-weight: 600;">${booking.name}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Email:</td>
                                  <td style="padding: 8px 0;">
                                    <a href="mailto:${booking.email}" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">${booking.email}</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Phone:</td>
                                  <td style="padding: 8px 0;">
                                    <a href="tel:${booking.phone}" style="color: #00b894; text-decoration: none; font-size: 15px; font-weight: 600;">${booking.phone}</a>
                                  </td>
                                </tr>
                              </table>

                              <!-- Divider -->
                              <div style="margin: 20px 0; height: 1px; background: #dee2e6;"></div>

                              <!-- Service Details -->
                              <h3 style="margin: 0 0 15px 0; color: #2d3436; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                🔧 Service Details
                              </h3>
                              
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                ${servicesHTML}
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Vehicle:</td>
                                  <td style="padding: 8px 0; color: #2d3436; font-size: 15px; font-weight: 500;">${booking.vehicleBrand} ${booking.vehicleModel}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Date:</td>
                                  <td style="padding: 8px 0; color: #2d3436; font-size: 15px; font-weight: 600;">${booking.bookingDate}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Time:</td>
                                  <td style="padding: 8px 0; color: #e74c3c; font-size: 15px; font-weight: 700;">${booking.bookingTime}</td>
                                </tr>
                                ${booking.notes ? `
                                <tr>
                                  <td colspan="2" style="padding: 15px 0 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Additional Notes:</td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding: 12px; background: #fff; border-left: 3px solid #667eea; border-radius: 6px; color: #2d3436; font-size: 14px; line-height: 1.6; font-style: italic;">
                                    "${booking.notes}"
                                  </td>
                                </tr>
                                ` : ''}
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding-top: 30px; text-align: center;">
                              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard" 
                                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(0,184,148,0.3);">
                                🚀 Go to Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #b2bec3; font-size: 12px;">
                          This is an automated notification from your booking system
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    // Send both emails
    const customerResult = await transporter.sendMail(customerEmail);
    console.log("✅ Customer email sent:", customerResult.messageId);
    
    const adminResult = await transporter.sendMail(adminEmail);
    console.log("✅ Admin email sent:", adminResult.messageId);
    
    console.log("✅ All booking notification emails sent successfully");
    
  } catch (error) {
    console.error("❌ Email error in sendBookingNotification:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

// Send acceptance confirmation (when admin accepts)
export async function sendAcceptanceEmail(booking) {
  console.log("\n🔍 === ACCEPTANCE EMAIL DEBUG START ===");
  console.log("Customer email:", booking.email);
  console.log("From email:", process.env.EMAIL_USER);
  console.log("Password exists:", !!process.env.EMAIL_APP_PASSWORD);
  
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // Format services - handle both single and multiple
    let servicesHTML = '';

    if (booking.serviceName) {
      // Primary service
      servicesHTML = `
        <tr>
          <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600; width: 35%;">Service:</td>
          <td style="padding: 12px 0; color: #2d3436; font-size: 16px; font-weight: 600;">${booking.serviceName}</td>
        </tr>
      `;
    }

    // Additional services (if any)
    if (booking.additionalServices && booking.additionalServices.length > 0) {
      const additionalNames = booking.additionalServices.map(s => s.name).join(', ');
      servicesHTML += `
        <tr>
          <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600;">Additional Services:</td>
          <td style="padding: 12px 0; color: #2d3436; font-size: 16px; font-weight: 500;">
            ${additionalNames}
          </td>
        </tr>
      `;
    }

    const customerEmail = {
      from: `"Automotive Car Care" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "✅ Booking Confirmed - Automotive Car Care",
      text: `Dear ${booking.name},\n\nYour booking has been CONFIRMED!\n\nService: ${booking.serviceName || booking.service}\nVehicle: ${booking.vehicleBrand} ${booking.vehicleModel}\nDate: ${booking.bookingDate}\nTime: ${booking.bookingTime}\n\nSee you soon!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmed</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden;">
                  
                  <!-- Success Header -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); padding: 50px 30px; text-align: center;">
                        <!-- Success Icon -->
                        <div style="width: 80px; height: 80px; background: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                          <span style="font-size: 48px; line-height: 80px;">✅</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                          Booking Confirmed!
                        </h1>
                        <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 500;">
                          You're all set for your appointment
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Confirmation Badge -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding-bottom: 30px;">
                              <span style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: #ffffff; border-radius: 50px; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(0,184,148,0.35);">
                                ✓ CONFIRMED
                              </span>
                            </td>
                          </tr>
                        </table>

                        <!-- Personalized Greeting -->
                        <h2 style="margin: 0 0 10px 0; color: #2d3436; font-size: 26px; font-weight: 700;">
                          Great News, ${booking.name}! 🎉
                        </h2>
                        <p style="margin: 0 0 30px 0; color: #636e72; font-size: 16px; line-height: 1.7;">
                          Your booking has been <strong style="color: #00b894;">officially confirmed</strong> by our team! We're excited to serve you and your vehicle.
                        </p>

                        <!-- Appointment Details Card -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border-radius: 12px; border: 2px solid #00b894; overflow: hidden;">
                          <tr>
                            <td style="padding: 30px;">
                              <h3 style="margin: 0 0 20px 0; color: #00b894; font-size: 18px; font-weight: 700; border-bottom: 2px solid rgba(0,184,148,0.3); padding-bottom: 12px;">
                                📅 Your Appointment
                              </h3>
                              
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                ${servicesHTML}
                                <tr>
                                  <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600;">Vehicle:</td>
                                  <td style="padding: 12px 0; color: #2d3436; font-size: 16px; font-weight: 500;">${booking.vehicleBrand} ${booking.vehicleModel}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600;">Date:</td>
                                  <td style="padding: 12px 0; color: #2d3436; font-size: 16px; font-weight: 700;">${new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600;">Time:</td>
                                  <td style="padding: 12px 0; color: #e74c3c; font-size: 18px; font-weight: 700;">${booking.bookingTime}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 0; color: #636e72; font-size: 14px; font-weight: 600;">Booking ID:</td>
                                  <td style="padding: 12px 0;">
                                    <span style="display: inline-block; padding: 8px 16px; background: #00b894; color: #ffffff; border-radius: 8px; font-size: 14px; font-weight: 700; letter-spacing: 1px;">
                                      #${booking._id.toString().slice(-8).toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- What to Do Next -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 30px 25px 25px; margin-top: 30px; background: #e8f8f5; border-left: 5px solid #00b894; border-radius: 10px;">
                              <h4 style="margin: 0 0 15px 0; color: #00b894; font-size: 17px; font-weight: 700;">
                                ✅ Preparation Checklist
                              </h4>
                              <ul style="margin: 0; padding-left: 20px; color: #2d3436; font-size: 15px; line-height: 2;">
                                <li><strong>Arrive 5-10 minutes early</strong> to ensure timely service</li>
                                <li><strong>Bring this confirmation email</strong> or your Booking ID</li>
                                <li><strong>Have your vehicle ready</strong> for our inspection</li>
                                <li><strong>Contact us</strong> if you need to reschedule</li>
                              </ul>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 35px 30px; text-align: center; border-top: 1px solid #dee2e6;">
                        <h4 style="margin: 0 0 15px 0; color: #2d3436; font-size: 18px; font-weight: 700;">
                          We're Here to Help! 🤝
                        </h4>
                        <p style="margin: 0 0 10px 0; color: #636e72; font-size: 15px; line-height: 1.8;">
                          Questions? Need to reschedule?
                        </p>
                        <p style="margin: 0; color: #636e72; font-size: 15px; line-height: 1.8;">
                          📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #00b894; text-decoration: none; font-weight: 700;">${process.env.EMAIL_USER}</a><br>
                          📞 <a href="tel:${process.env.CONTACT_PHONE}" style="color: #00b894; text-decoration: none; font-weight: 700;">${process.env.CONTACT_PHONE || '+91 XXXXX XXXXX'}</a>
                        </p>
                        <p style="margin: 25px 0 0 0; color: #2d3436; font-size: 16px; font-weight: 600;">
                          See you soon! 🚗✨
                        </p>
                        <p style="margin: 15px 0 0 0; color: #b2bec3; font-size: 12px;">
                          © 2025 Automotive Car Care. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    console.log("Sending acceptance email to:", customerEmail.to);
    const result = await transporter.sendMail(customerEmail);
    
    console.log("✅ Acceptance email sent successfully!");
    console.log("Message ID:", result.messageId);
    console.log("=== ACCEPTANCE EMAIL DEBUG END ===\n");
    
    return result;
    
  } catch (error) {
    console.error("❌ ACCEPTANCE EMAIL SEND FAILED!");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.log("=== ACCEPTANCE EMAIL DEBUG END ===\n");
    throw error;
  }
}
