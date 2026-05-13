"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE;

  if (!ADMIN_PASSPHRASE) {
    throw new Error("SERVER MISCONFIGURATION: Passphrase not set in environment variables.");
  }

  if (password === ADMIN_PASSPHRASE) {
    // Issue a secure, HTTP-only cookie valid for 7 days
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "secure_jcls_token_active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    
    redirect("/admin");
  } else {
    redirect("/login?error=Invalid+Credentials");
  }
}
