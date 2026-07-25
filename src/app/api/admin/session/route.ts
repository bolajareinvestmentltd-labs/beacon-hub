import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "@/lib/server-auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!sessionSecret || !session || !verifyAdminSessionToken(session, sessionSecret)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
