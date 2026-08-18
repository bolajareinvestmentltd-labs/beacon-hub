import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { verifyAdminSessionToken } from "@/lib/server-auth";

async function authorizeAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(secret && session && verifyAdminSessionToken(session, secret));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorizeAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid escrow asset identifier." }, { status: 400 });

  await db.delete(deals).where(eq(deals.id, id));
  return NextResponse.json({ success: true, message: "Escrow asset deleted successfully." });
}
