"use server";

import { db } from "@/db";
import { articles, deals, subscribers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { ArticleSchema, DealSchema, SubscribeSchema } from "./validation";
import { sanitizeEmail } from "./sanitize";
import { sanitizeServerHTML } from "./server-sanitize";
import { logger } from "./logger";
import { checkSubscribeLimit } from "./rateLimit";
import { getRequiredRuntimeValue } from "./runtime-config";

const generateSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${slug || 'article'}-${Date.now().toString().slice(-4)}`;
};

// ========================================================
// 1. INTELLIGENCE ENGINE (News Override)
// ========================================================
export async function publishArticle(formData: FormData) {
  try {
    getRequiredRuntimeValue("DATABASE_URL");
    getRequiredRuntimeValue("ADMIN_SESSION_SECRET");

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const imageFile = formData.get("coverImage") as File;
    const bodyImageFile = formData.get("bodyImage") as File;

    const validatedResult = ArticleSchema.safeParse({
      title,
      slug: generateSlug(title),
      category,
      content: sanitizeServerHTML(content),
      author: "JCLs Intelligence",
      excerpt,
      coverImage: null,
    });

    if (!validatedResult.success) {
      return {
        success: false,
        message: "Please complete all required fields before publishing.",
      };
    }

    const validated = validatedResult.data;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
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

    let bodyImageUrl: string | null = null;
    if (bodyImageFile && bodyImageFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`articles/body-${bodyImageFile.name}`, bodyImageFile, {
          access: "public",
          addRandomSuffix: true,
        });
        bodyImageUrl = blob.url;
      } catch (error) {
        logger.warning("Failed to upload article body image", { error });
      }
    }

    const contentWithBodyImage = bodyImageUrl
      ? `${content}<p><img src="${bodyImageUrl}" alt="${title}" /></p>`
      : content;
    const sanitizedContent = sanitizeServerHTML(contentWithBodyImage);

    await db.insert(articles).values({
      title: validated.title,
      slug: validated.slug,
      category: validated.category,
      content: sanitizedContent,
      excerpt: validated.excerpt || '',
      coverImage: imageUrl ?? null,
      author: validated.author,
      source: 'Beacon Hub',
      publishedAt: new Date(),
      createdAt: new Date(),
    });

    logger.info("Article published", { title, slug: validated.slug });
    try {
      revalidatePath("/");
      revalidatePath("/admin");
    } catch (error) {
      logger.warning("Article published, but cache revalidation failed", { error });
    }

    return {
      success: true,
      message: `Article "${validated.title}" published successfully.`,
    };
  } catch (error) {
    const runtimeError = error instanceof Error ? error.message : "Unknown runtime error";
    logger.error("Failed to publish article", { error: runtimeError });
    return {
      success: false,
      message: runtimeError.includes("not configured")
        ? runtimeError
        : "We could not publish the article. Please try again.",
    };
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

    const price = parseInt(priceString.replace(/,/g, ""), 10);
    const validatedResult = DealSchema.safeParse({
      title,
      vendorName,
      price,
      category,
      description: sanitizeServerHTML(description),
      imageUrl: null,
      videoUrl: null,
    });

    if (!validatedResult.success) {
      return {
        success: false,
        message: "Please complete the asset details before listing.",
      };
    }

    const validated = validatedResult.data;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
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
    try {
      revalidatePath("/deals");
      revalidatePath("/admin");
    } catch (error) {
      logger.warning("Deal published, but cache revalidation failed", { error });
    }

    return {
      success: true,
      message: `Asset "${validated.title}" was listed successfully.`,
    };
  } catch (error) {
    logger.error("Failed to publish deal", { error });
    return {
      success: false,
      message: "We could not list the asset. Please try again.",
    };
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

