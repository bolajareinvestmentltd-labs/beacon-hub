"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
