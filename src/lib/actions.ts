"use server";

import { db } from "@/db";
import { articles, deals } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { articles, deals, subscribers } from "@/db/schema";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`;
};

// ========================================================
// 1. INTELLIGENCE ENGINE (News Override)
// ========================================================
export async function publishArticle(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const imageFile = formData.get("coverImage") as File;

  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(`articles/${imageFile.name}`, imageFile, { access: 'public', addRandomSuffix: true });
    imageUrl = blob.url;
  }

  await db.insert(articles).values({
    title,
    slug: generateSlug(title),
    category,
    content,
    excerpt,
    coverImage: imageUrl,
    author: "JCLs Intelligence",
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

// ========================================================
// 2. ESCROW MARKETPLACE ENGINE (Asset Deployment)
// ========================================================
export async function publishDeal(formData: FormData) {
  const title = formData.get("title") as string;
  const vendorName = formData.get("vendorName") as string;
  const priceString = formData.get("price") as string;
  const price = parseInt(priceString.replace(/,/g, ''), 10); // Strips commas and converts to strict integer
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("coverImage") as File;

  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(`deals/${imageFile.name}`, imageFile, { access: 'public', addRandomSuffix: true });
    imageUrl = blob.url;
  }

  await db.insert(deals).values({
    title,
    vendorName,
    price,
    category,
    description,
    imageUrl,
  });

  revalidatePath("/deals");
  revalidatePath("/admin");
}

export async function subscribeUser(formData: FormData) {
  const email = formData.get("email");
  
  if (!email || typeof email !== "string") {
    return { error: "Invalid email" };
  }

  try {
    console.log("Subscribed:", email);
    return { success: true };
  } catch (error) {
    return { error: "Failed to subscribe. Please try again." };
  }
}

// ========================================================
// 3. NETWORK ENGINE (Newsletter Subscribers)
// ========================================================
export async function subscribeUser(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required." };

  try {
    await db.insert(subscribers).values({ email });
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505' || error.message.includes('unique')) {
      return { error: "You are already connected to the Network." };
    }
    return { error: "Failed to connect to the Network." };
  }
}