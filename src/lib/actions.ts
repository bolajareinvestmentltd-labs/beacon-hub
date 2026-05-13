"use server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
};

export async function publishArticle(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const author = formData.get("author") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  
  // 1. Catch the physical file from the form
  const imageFile = formData.get("coverImage") as File | null;
  let coverImageUrl = null;

  // 2. If an image was uploaded, send it to Vercel Blob
  if (imageFile && imageFile.size > 0) {
    const blob = await put(`beacon-hub/${Date.now()}-${imageFile.name}`, imageFile, {
      access: 'public',
    });
    // Grab the permanent cloud URL Vercel generated
    coverImageUrl = blob.url;
  }

  // 3. Save everything to Neon Database
  await db.insert(articles).values({
    title,
    slug: generateSlug(title),
    category,
    author: author || "Beacon-Hub Intelligence",
    content,
    excerpt: excerpt || content.substring(0, 120) + "...",
    coverImage: coverImageUrl, // Save the dynamic URL here!
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteArticle(id: number) {
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}
