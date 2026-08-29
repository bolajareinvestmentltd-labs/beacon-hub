import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { verifyAdminSessionToken } from "@/lib/server-auth";
import { runDbOperation } from "@/lib/db-utils";
import { ArticleSchema } from "@/lib/validation";
import { sanitizeServerHTML } from "@/lib/server-sanitize";

const generateSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${slug || 'article'}-${Date.now().toString().slice(-4)}`;
};

const getFileFromFormData = (formData: FormData, fieldName: string): File | null => {
  const value = formData.get(fieldName);
  return value instanceof File && value.size > 0 ? value : null;
};

const isValidImageFile = (file: File | null) => {
  if (!file) return false;
  return file.type.startsWith("image/") && file.size > 0 && file.size <= 8 * 1024 * 1024;
};

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !session || !verifyAdminSessionToken(session, sessionSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articleRows = await runDbOperation(() =>
      db
        .select({
          id: articles.id,
          title: articles.title,
          category: articles.category,
          publishedAt: articles.publishedAt,
        })
        .from(articles)
        .orderBy(desc(articles.publishedAt))
        .limit(10)
    );

    return NextResponse.json({ articles: articleRows });
  } catch (error) {
    console.error("Failed to load article history", error);
    return NextResponse.json({ error: "Unable to fetch article history." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !session || !verifyAdminSessionToken(session, sessionSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "Top News").trim();
    const content = String(formData.get("content") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const coverImage = getFileFromFormData(formData, "coverImage");
    const bodyImageFile = getFileFromFormData(formData, "bodyImage");

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: "Please complete all required fields before publishing." }, { status: 400 });
    }

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
      return NextResponse.json({ error: "Please complete all required fields before publishing." }, { status: 400 });
    }

    if (coverImage && !isValidImageFile(coverImage)) {
      return NextResponse.json({ error: "Cover image must be a valid image file under 8MB." }, { status: 400 });
    }

    if (bodyImageFile && !isValidImageFile(bodyImageFile)) {
      return NextResponse.json({ error: "Brief image must be a valid image file under 8MB." }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (coverImage && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`articles/${Date.now()}-${coverImage.name.replace(/\s+/g, '-')}`, coverImage, {
          access: "public",
          addRandomSuffix: true,
        });
        imageUrl = blob.url;
      } catch (error) {
        console.warn("Failed to upload article image", error);
      }
    }

    let bodyImageUrl: string | null = null;
    if (bodyImageFile && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`articles/body-${Date.now()}-${bodyImageFile.name.replace(/\s+/g, '-')}`, bodyImageFile, {
          access: "public",
          addRandomSuffix: true,
        });
        bodyImageUrl = blob.url;
      } catch (error) {
        console.warn("Failed to upload article body image", error);
      }
    }

    const finalContent = bodyImageUrl ? `${sanitizeServerHTML(content)}<p><img src="${bodyImageUrl}" alt="${title}" /></p>` : sanitizeServerHTML(content);

    await runDbOperation(() =>
      db.insert(articles).values({
        title: validatedResult.data.title,
        slug: validatedResult.data.slug,
        category: validatedResult.data.category,
        content: finalContent,
        excerpt: validatedResult.data.excerpt || "",
        coverImage: imageUrl ?? null,
        author: validatedResult.data.author,
        source: "Beacon Hub",
        publishedAt: new Date(),
        createdAt: new Date(),
      })
    );

    return NextResponse.json({
      success: true,
      message: `Article "${validatedResult.data.title}" published successfully.`,
    });
  } catch (error) {
    console.error("Failed to publish article via admin API", error);
    return NextResponse.json({
      success: false,
      error: "We could not publish the article. Please try again.",
    }, { status: 500 });
  }
}
