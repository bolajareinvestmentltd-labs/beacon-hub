"use server";

import { db } from "@/db";
import { articles, deals, subscribers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { ArticleSchema, DealSchema, SubscribeSchema } from "./validation";
import { sanitizeHTML, sanitizeEmail } from "./sanitize";
import { logger } from "./logger";
import { checkSubscribeLimit } from "./rateLimit";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now().toString().slice(-4)}`;
};

// ========================================================
// 1. INTELLIGENCE ENGINE (News Override)
// ========================================================
export async function publishArticle(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const imageFile = formData.get("coverImage") as File;

    // Validate input
    const validated = ArticleSchema.parse({
      title,
      slug: generateSlug(title),
      category,
      content: sanitizeHTML(content),
      author: "JCLs Intelligence",
      excerpt,
      coverImage: null,
    });

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        const blob = await put(`articles/${imageFile.name}`, imageFile, {
          access: "public",
          addRandomSuffix: true,
        });
        imageUrl = blob.url;
      } catch (error) {
        logger.warning("Failed to upload article image", { error });
        // Continue without image
      }
    }

    await db.insert(articles).values({
      title: validated.title,
      slug: validated.slug,
      category: validated.category,
      content: validated.content,
      excerpt: validated.excerpt || '',
      coverImage: imageUrl ?? null,
      author: validated.author,
      source: 'Beacon Hub',
      publishedAt: new Date(),
      createdAt: new Date(),
    });

    logger.info("Article published", { title, slug: validated.slug });
    revalidatePath("/");
    revalidatePath("/admin");
  } catch (error) {
    logger.error("Failed to publish article", { error });
    throw error;
  }
}

// ========================================================
// 2. ESCROW MARKETPLACE ENGINE (Asset Deployment)
// ========================================================
export async function publishDeal(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const vendorName = formData.get("vendorName") as string;
    const priceString = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("coverImage") as File;

    // Validate and sanitize input
    const price = parseInt(priceString.replace(/,/g, ""), 10);
    const validated = DealSchema.parse({
      title,
      vendorName,
      price,
      category,
      description: sanitizeHTML(description),
      imageUrl: null,
      videoUrl: null,
    });

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        const blob = await put(`deals/${imageFile.name}`, imageFile, {
          access: "public",
          addRandomSuffix: true,
        });
        imageUrl = blob.url;
      } catch (error) {
        logger.warning("Failed to upload deal image", { error });
        // Continue without image
      }
    }

    await db.insert(deals).values({
      title: validated.title,
      vendorName: validated.vendorName,
      price: validated.price,
      category: validated.category,
      description: validated.description,
      imageUrl,
    });

    logger.info("Deal published", { title, vendorName });
    revalidatePath("/deals");
    revalidatePath("/admin");
  } catch (error) {
    logger.error("Failed to publish deal", { error });
    throw error;
  }
}

// 3. NETWORK ENGINE (Newsletter Subscribers)
export async function subscribeUser(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  try {
    // Validate input
    const validated = SubscribeSchema.parse({ email });
    const sanitizedEmail = sanitizeEmail(validated.email);

    // Check rate limit (10 per hour)
    const rateLimitOk = await checkSubscribeLimit(sanitizedEmail);
    if (!rateLimitOk) {
      logger.logRateLimitHit(sanitizedEmail, "10 subscriptions per hour");
      return { error: "Too many subscriptions. Please try again later." };
    }

    await db.insert(subscribers).values({ email: sanitizedEmail });

    logger.info("User subscribed", { email: sanitizedEmail });
    return { success: true };
  } catch (error: any) {
    // Handle duplicate email error
    if (error?.code === "23505" || error?.message?.includes("unique")) {
      logger.info("Duplicate subscription attempt", { error: error?.message });
      return { error: "You are already connected to the Network." };
    }

    logger.error("Failed to subscribe user", { error });
    return { error: "Failed to connect to the Network." };
  }
}

