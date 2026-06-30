"use server";
import { Resend } from "resend";
import { ContactSchema } from "./validation";
import { sanitizeHTML } from "./sanitize";
import { logger } from "./logger";
import { checkContactLimit } from "./rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Map form subject values to proper category names
 */
const subjectToCategoryMap: Record<string, string> = {
  'general': 'Support',
  'technical': 'Support',
  'marketplace': 'Support',
  'partnership': 'Partnership',
  'feedback': 'Feature Request',
};

export async function subscribeToNetwork(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Target email missing." };
  }

  try {
    // The internal alert system to the JCLs Admin
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "YOUR_PERSONAL_EMAIL_HERE@gmail.com", // 🚨 REPLACE THIS WITH YOUR RESEND LOGIN EMAIL
      subject: "JCLs Network: New Subscriber 📡",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0A1128;">
          <h2 style="color: #E2725B;">New Asset Secured</h2>
          <p>A new user has requested access to the JCLs intelligence network.</p>
          <p><strong>Subscriber Email:</strong> ${email}</p>
          <p style="font-size: 10px; color: #888; margin-top: 40px; text-transform: uppercase;">Beacon-Hub Automated Relay</p>
        </div>
      `,
    });

    return { success: "Securely added to the JCLs transmission list." };
  } catch (error) {
    console.error("Resend Pipeline Error:", error);
    return { error: "Transmission failed. Try again later." };
  }
}

/**
 * Send contact form email
 */
export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Validate input
    const category = subjectToCategoryMap[subject] || 'Support';
    const validated = ContactSchema.parse({
      name,
      email,
      subject,
      message,
      category,
    });

    // Rate limit check (3 per hour)
    const rateLimitOk = await checkContactLimit(email);
    if (!rateLimitOk) {
      logger.logRateLimitHit(email, '3 contact forms per hour');
      return { error: "Too many contact submissions. Please try again later." };
    }

    // Sanitize message content
    const sanitizedMessage = sanitizeHTML(message);

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: "support@beacon-hub.com",
      to: email,
      subject: `We received your message: ${validated.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1A1A1A;">
          <h2 style="color: #9C4A3A;">Thank You, ${validated.name}!</h2>
          <p>We have received your inquiry and will get back to you as soon as possible.</p>
          
          <div style="background-color: #F4EFEA; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Subject:</strong> ${validated.subject}</p>
            <p><strong>Your Message:</strong></p>
            <p style="color: #666;">${sanitizedMessage}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Our support team typically responds within 24-48 business hours.
          </p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #999;">
            Beacon-Hub Support Team<br/>
            <a href="https://beacon-hub.com" style="color: #9C4A3A;">Visit our website</a>
          </p>
        </div>
      `,
    });

    if (userEmailResult.error) {
      logger.warning("Failed to send user confirmation email", { email, error: userEmailResult.error });
    }

    // Send notification to admin
    const adminEmailResult = await resend.emails.send({
      from: "support@beacon-hub.com",
      to: "support@beacon-hub.com",
      subject: `New Contact Form: ${validated.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1A1A1A;">
          <h2 style="color: #9C4A3A;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <p><strong>From:</strong> ${validated.name}</p>
            <p><strong>Email:</strong> ${validated.email}</p>
            <p><strong>Category:</strong> ${validated.category}</p>
            <p><strong>Subject:</strong> ${validated.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; color: #333;">${sanitizedMessage}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="mailto:${validated.email}" style="background-color: #9C4A3A; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;">
              Reply to ${validated.name}
            </a>
          </p>
        </div>
      `,
    });

    if (adminEmailResult.error) {
      logger.error("Failed to send admin notification", { email, error: adminEmailResult.error });
      return { error: "Failed to process your request. Please try again." };
    }

    logger.info("Contact form email sent", { name, email, category });
    return { 
      success: "Your message has been sent! We'll get back to you soon.",
      submitted: true,
    };
  } catch (error) {
    logger.error("Failed to send contact email", { error });
    return { error: "Failed to send your message. Please try again later." };
  }
}
