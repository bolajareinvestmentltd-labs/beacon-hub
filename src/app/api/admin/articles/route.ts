import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "secure_jcls_token_active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articleRows = await db
      .select({
        id: articles.id,
        title: articles.title,
        category: articles.category,
        publishedAt: articles.publishedAt,
      })
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(10);

    return NextResponse.json({ articles: articleRows });
  } catch (error) {
    console.error("Failed to load article history", error);
    return NextResponse.json({ error: "Unable to fetch article history." }, { status: 500 });
  }
}
