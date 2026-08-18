import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { verifyAdminSessionToken } from "@/lib/server-auth";
import { runDbOperation } from "@/lib/db-utils";
import { sanitizeHTML, sanitizeInput } from "@/lib/sanitize";

async function authorizeAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(secret && session && verifyAdminSessionToken(session, secret));
}

export async function GET() {
  if (!(await authorizeAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await runDbOperation(() =>
    db.select().from(deals).orderBy(desc(deals.createdAt)).limit(25)
  );
  return NextResponse.json({ deals: rows });
}

export async function PATCH(request: Request) {
  if (!(await authorizeAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json().catch(() => ({}));
  const id = Number(payload.id);
  const title = sanitizeInput(String(payload.title || "")).trim();
  const vendorName = sanitizeInput(String(payload.vendorName || "")).trim();
  const category = sanitizeInput(String(payload.category || "")).trim();
  const description = sanitizeHTML(String(payload.description || "")).trim();
  const price = Number(payload.price);

  if (!id || !title || !vendorName || !category || !description || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Missing or invalid escrow fields." }, { status: 400 });
  }

  await runDbOperation(() =>
    db.update(deals).set({ title, vendorName, category, description, price }).where(eq(deals.id, id))
  );
  return NextResponse.json({ success: true, message: "Escrow asset updated successfully." });
}
