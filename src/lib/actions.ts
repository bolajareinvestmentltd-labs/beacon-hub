"use server";

import { db } from "../db";
import { articles, subscribers } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";

export async function publishArticle(formData: FormData) {
  // 1. Grab the data from the form
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const author = formData.get("author") as string;
  const content = formData.get("content") as string;

  // 2. Automatically generate a URL-friendly slug from the title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // 3. Save it to the Neon Database
  await db.insert(articles).values({
    title,
    slug,
    category,
    author,
    content,
  });

  // 4. Tell Next.js to update the homepage and category pages instantly
  revalidatePath("/");
  revalidatePath(`/category/${category}`);
  
  // 5. Send the user to look at their newly published article
  redirect(`/read/${slug}`);
}

// --- EMAIL NEWSLETTER ENGINE ---

// Initialize Resend with the key from your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeUser(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) return { error: "Email is required" };

  try {
    // 1. Save to Neon Database
    await db.insert(subscribers).values({ email });

    // 2. Fire the Resend Welcome Email
    await resend.emails.send({
      from: "Beacon-Hub <onboarding@resend.dev>", 
      to: email, // ⚠️ NOTE: On Resend's free tier, you can only send to your OWN verified email address!
      subject: "Welcome to the Beacon-Hub Ecosystem",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">Welcome to the Inner Circle</h2>
          <p>You are officially subscribed to the Daily Architect.</p>
          <p>Expect premium market trends, developer logs, and astrology insights directly in your inbox.</p>
          <br/>
          <p style="font-size: 12px; color: #666;">Engineered by Jare's Choice Labs</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    // Gracefully handle duplicate emails
    if (error.code === '23505') {
      return { error: "You are already on the intelligence list." };
    }
    console.error("Subscription Error:", error);
    return { error: "Failed to connect to the network. Try again later." };
  }
}

// --- ARTICLE DELETION ENGINE ---

export async function deleteArticle(id: number) {
  try {
    await db.delete(articles).where(eq(articles.id, id));
    
    // Instantly refresh the admin page and the homepage so the deleted article vanishes everywhere
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/category/[name]", "page");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete article" };
  }
}