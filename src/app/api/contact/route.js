import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    console.log("📧 === CONTACT FORM EMAIL START ===");
    
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("From:", process.env.EMAIL_USER);
    console.log("To Customer:", email);
    console.log("To Admin:", process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    console.log("Password exists:", !!process.env.EMAIL_APP_PASSWORD);

    // Create transporter - MATCH YOUR BOOKING EMAIL CONFIG
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use EMAIL_APP_PASSWORD not EMAIL_PASS
      },
    });

    // Verify connection
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // Email to ADMIN
    const adminEmail = {
      from: `"Automotive Car Care" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `📩 New Contact - ${name}`,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nMessage: ${message}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f3f5; padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Header -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          📩 New Contact Form
                        </h1>
                        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.95); font-size: 14px; font-weight: 500;">
                          Someone reached out to you
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 35px 30px;">
                        
                        <p style="margin: 0 0 25px 0; color: #2d3436; font-size: 16px; line-height: 1.6;">
                          You have received a new message from your contact form.
                        </p>

                        <!-- Contact Details Card -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef; overflow: hidden;">
                          <tr>
                            <td style="padding: 25px;">
                              
                              <h3 style="margin: 0 0 15px 0; color: #2d3436; font-size: 16px; font-weight: 700; text-transform: uppercase;">
                                👤 Contact Information
                              </h3>
                              
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600; width: 25%;">Name:</td>
                                  <td style="padding: 8px 0; color: #2d3436; font-size: 15px; font-weight: 600;">${name}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Email:</td>
                                  <td style="padding: 8px 0;">
                                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">${email}</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #636e72; font-size: 14px; font-weight: 600;">Phone:</td>
                                  <td style="padding: 8px 0;">
                                    <a href="tel:${phone}" style="color: #00b894; text-decoration: none; font-size: 15px; font-weight: 600;">${phone || "Not provided"}</a>
                                  </td>
                                </tr>
                              </table>

                              <!-- Divider -->
                              <div style="margin: 20px 0; height: 1px; background: #dee2e6;"></div>

                              <!-- Message -->
                              <h3 style="margin: 0 0 12px 0; color: #2d3436; font-size: 16px; font-weight: 700; text-transform: uppercase;">
                                💬 Message
                              </h3>
                              <div style="padding: 15px; background: #ffffff; border-left: 4px solid #667eea; border-radius: 6px; color: #2d3436; font-size: 15px; line-height: 1.7;">
                                ${message}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Reply Button -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding-top: 30px; text-align: center;">
                              <a href="mailto:${email}" 
                                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(102,126,234,0.4);">
                                📧 Reply Now
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
                          Automated notification from Automotive Car Care contact form
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

    // Email to CUSTOMER (Auto-reply)
    const customerEmail = {
      from: `"Automotive Car Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Automotive Car Care",
      text: `Dear ${name},\n\nThank you for reaching out to us! We have received your message and will get back to you shortly.\n\nBest regards,\nAutomotive Car Care Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
                  
                  <!-- Header -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <div style="width: 80px; height: 80px; background: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                          <span style="font-size: 48px; line-height: 80px;">✉️</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                          Message Received!
                        </h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 400;">
                          Thank you for reaching out
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <h2 style="margin: 0 0 10px 0; color: #2d3436; font-size: 24px; font-weight: 600;">
                          Hello ${name}! 👋
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #636e72; font-size: 16px; line-height: 1.7;">
                          We've received your message and want to thank you for getting in touch with <strong>Automotive Car Care</strong>.
                        </p>

                        <!-- Info Box -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; border: 2px solid #e8eaff; overflow: hidden;">
                          <tr>
                            <td style="padding: 25px;">
                              <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px; font-weight: 600;">
                                📋 What happens next?
                              </h3>
                              <ul style="margin: 0; padding-left: 20px; color: #2d3436; font-size: 15px; line-height: 2;">
                                <li>Our team will <strong>review your message</strong> carefully</li>
                                <li>We'll get back to you <strong>within 24 hours</strong></li>
                                <li>You'll receive a <strong>personalized response</strong> to your inquiry</li>
                              </ul>
                            </td>
                          </tr>
                        </table>

                        <!-- Your Message Recap -->
                        <div style="margin-top: 25px; padding: 20px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 8px;">
                          <h4 style="margin: 0 0 10px 0; color: #667eea; font-size: 14px; font-weight: 700; text-transform: uppercase;">
                            Your Message:
                          </h4>
                          <p style="margin: 0; color: #2d3436; font-size: 14px; line-height: 1.6; font-style: italic;">
                            "${message}"
                          </p>
                        </div>

                        <!-- Need immediate help? -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 25px 20px; margin-top: 25px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px;">
                              <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.7;">
                                <strong>🚨 Need immediate assistance?</strong><br>
                                Call us at <a href="tel:${process.env.CONTACT_PHONE}" style="color: #856404; font-weight: 700; text-decoration: none;">${process.env.CONTACT_PHONE }</a>
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
                          Stay Connected! 🤝
                        </p>
                        <p style="margin: 0; color: #636e72; font-size: 14px; line-height: 1.8;">
                          📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none; font-weight: 500;">${process.env.EMAIL_USER}</a><br>
                          📞 <span style="color: #2d3436; font-weight: 500;">${process.env.CONTACT_PHONE}</span><br>
                          📍 <span style="color: #2d3436; font-weight: 500;">Guntur, Andhra Pradesh, India</span>
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

    // Send admin email
    console.log("Sending admin notification...");
    const adminResult = await transporter.sendMail(adminEmail);
    console.log("✅ Admin email sent:", adminResult.messageId);

    // Send customer auto-reply
    console.log("Sending customer auto-reply...");
    const customerResult = await transporter.sendMail(customerEmail);
    console.log("✅ Customer email sent:", customerResult.messageId);

    console.log("✅ All contact form emails sent successfully");
    console.log("=== CONTACT FORM EMAIL END ===\n");

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });

  } catch (error) {
    console.error("❌ CONTACT FORM EMAIL FAILED!");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);
    console.log("=== CONTACT FORM EMAIL END ===\n");

    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
