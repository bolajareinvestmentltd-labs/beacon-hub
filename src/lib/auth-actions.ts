"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { checkAuthLimit } from "./rateLimit";
import { logger } from "./logger";
import { sanitizeInput } from "./sanitize";
import { LoginSchema } from "./validation";
import { verifyPassword, createAdminSessionToken } from "./server-auth";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim() || "";
    const password = (formData.get("password") as string) || "";
    const rememberMe = formData.get("rememberMe") === "on";
    const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

    if (!ADMIN_SESSION_SECRET) {
      logger.error("SERVER MISCONFIGURATION: Admin session secret not set");
      redirect("/login?error=Server+misconfiguration.+Please+check+environment+settings.");
    }

    const validated = LoginSchema.safeParse({ email, password });
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (!validated.success) {
      const firstError = Object.values(validated.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)[0] || "Please provide valid login details.";

      logger.logAuthEvent('failed_login', sanitizedEmail || 'unknown', { reason: 'validation_error' });
      redirect(`/login?error=${encodeURIComponent(firstError)}`);
    }

    const authLimitOk = await checkAuthLimit(sanitizedEmail);
    if (!authLimitOk) {
      logger.logAuthEvent('failed_login', sanitizedEmail, { reason: 'rate_limit' });
      redirect("/login?error=Too+many+login+attempts.+Try+again+later.");
    }

    const sanitizedPassword = sanitizeInput(password);
    const adminRows = await db
      .select()
      .from(admins)
      .where(eq(admins.email, sanitizedEmail))
      .limit(1);

    const admin = adminRows[0];
    if (!admin || !verifyPassword(sanitizedPassword, admin.passwordHash)) {
      logger.logAuthEvent('failed_login', sanitizedEmail, { reason: 'invalid_credentials' });
      redirect("/login?error=Invalid+credentials.");
    }

    const sessionToken = createAdminSessionToken(
      sanitizedEmail,
      rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      ADMIN_SESSION_SECRET
    );

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    logger.logAuthEvent('login', sanitizedEmail, { success: true, rememberMe });
    redirect("/admin");
  } catch (error) {
    logger.error("Login action failed", { error });
    redirect("/login?error=Unable+to+authenticate+at+this+time.");
  }
}
