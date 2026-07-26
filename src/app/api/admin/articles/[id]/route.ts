import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { verifyAdminSessionToken } from "@/lib/server-auth";
import { runDbOperation } from "@/lib/db-utils";
import { sanitizeHTML, sanitizeInput } from "@/lib/sanitize";

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
        .select()
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

  const payload = await req.json().catch(() => ({}));
  const title = sanitizeInput(String(payload.title || "")).trim();
  const category = sanitizeInput(String(payload.category || "")).trim();
  const author = sanitizeInput(String(payload.author || "")).trim();
  const excerpt = sanitizeHTML(String(payload.excerpt || "")).trim();
  const content = sanitizeHTML(String(payload.content || "")).trim();
  const coverImage = sanitizeInput(String(payload.coverImage || "")).trim() || null;

  if (!title || !category || !excerpt || !content || !author) {
    return NextResponse.json({ error: "Missing required article fields." }, { status: 400 });
  }

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
    );

    return NextResponse.json({ success: true, message: "Article updated successfully.", result });
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
