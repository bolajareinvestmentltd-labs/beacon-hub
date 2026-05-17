"use server";

import { db } from "@/db";
import { articles, deals, subscribers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`;
};

// 1. CONTENT ENGINE (Articles) - Stripped return to satisfy TS void constraint
export async function publishArticle(formData: FormData): Promise<void> {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const isBreaking = formData.get("isBreaking") === "on";
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      imageUrl = blob.url;
    }

    const slug = generateSlug(title);

    await db.insert(articles).values({
      title, slug, excerpt, content, category, isBreaking, imageUrl
    });

    revalidatePath("/");
  } catch (error: any) {
    console.error("Failed to publish article:", error);
  }
}

// 2. ESCROW ENGINE (Deals) - Stripped return to satisfy TS void constraint
export async function publishDeal(formData: FormData): Promise<void> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const vendorName = formData.get("vendorName") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      imageUrl = blob.url;
    }

    await db.insert(deals).values({
      title, description, category, price, vendorName, imageUrl, platformFee: 50
    });

    revalidatePath("/deals");
  } catch (error: any) {
    console.error("Failed to list deal:", error);
  }
}

// 3. NETWORK ENGINE (Newsletter Subscribers) - Return kept for client-side modal
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
