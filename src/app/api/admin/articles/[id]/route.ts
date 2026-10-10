import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { verifyAdminSessionToken } from "@/lib/server-auth";
import { runDbOperation } from "@/lib/db-utils";
import { sanitizeHTML, sanitizeInput } from "@/lib/sanitize";

const EditArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(100),
  author: z.string().trim().min(2).max(100),
  excerpt: z.string().trim().min(1).max(1000),
  content: z.string().trim().min(10).max(50000),
  coverImage: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
});

async function authorizeAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !session || !verifyAdminSessionToken(session, sessionSecret)) {
    return false;
  }

  return true;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const articleId = Number(id);
  if (!articleId || Number.isNaN(articleId)) {
    return NextResponse.json({ error: "Invalid article identifier." }, { status: 400 });
  }

  try {
    const articleRows = await runDbOperation(() =>
      db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          category: articles.category,
          excerpt: articles.excerpt,
          content: articles.content,
          author: articles.author,
          coverImage: articles.coverImage,
        })
        .from(articles)
        .where(eq(articles.id, articleId))
        .limit(1)
    );

    const article = articleRows[0];
    if (!article) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to fetch article details", error);
    return NextResponse.json({ error: "Unable to retrieve article details." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const articleId = Number(id);
  if (!articleId || Number.isNaN(articleId)) {
    return NextResponse.json({ error: "Invalid article identifier." }, { status: 400 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Provide valid article fields." }, { status: 400 });
  }

  const parsed = EditArticleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({
      error: parsed.error.issues[0]?.message || "One or more article fields are invalid.",
      field: parsed.error.issues[0]?.path[0] || null,
    }, { status: 400 });
  }

  const title = sanitizeInput(parsed.data.title).trim();
  const category = sanitizeInput(parsed.data.category).trim();
  const author = sanitizeInput(parsed.data.author).trim();
  const excerpt = sanitizeHTML(parsed.data.excerpt).trim();
  const content = sanitizeHTML(parsed.data.content).trim();
  const coverImage = parsed.data.coverImage ? sanitizeInput(parsed.data.coverImage).trim() : null;

  try {
    const result = await runDbOperation(() =>
      db
        .update(articles)
        .set({
          title,
          category,
          author,
          excerpt,
          content,
          coverImage,
        })
        .where(eq(articles.id, articleId))
        .returning({ id: articles.id, slug: articles.slug })
    );

    const updatedArticle = result[0];
    if (!updatedArticle) {
      return NextResponse.json({ error: "Article not found; no changes were saved." }, { status: 404 });
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/read/${updatedArticle.slug}`);

    return NextResponse.json({ success: true, message: "Article updated successfully.", article: updatedArticle });
  } catch (error) {
    console.error("Failed to update article", error);
    return NextResponse.json({ error: "Unable to update article." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const articleId = Number(id);
  if (!articleId || Number.isNaN(articleId)) {
    return NextResponse.json({ error: "Invalid article identifier." }, { status: 400 });
  }

  try {
    const result = await runDbOperation(() =>
      db
        .delete(articles)
        .where(eq(articles.id, articleId))
    );

    return NextResponse.json({ success: true, message: "Article deleted successfully.", result });
  } catch (error) {
    console.error("Failed to delete article", error);
    return NextResponse.json({ error: "Unable to delete article." }, { status: 500 });
  }
}
