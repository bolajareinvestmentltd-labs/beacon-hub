"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuthLimit } from "./rateLimit";
import { logger } from "./logger";
import { sanitizeInput } from "./sanitize";

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string) || "admin";
    const password = formData.get("password") as string;
    const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE;

    if (!ADMIN_PASSPHRASE) {
      logger.error("SERVER MISCONFIGURATION: Admin passphrase not set");
      throw new Error("SERVER MISCONFIGURATION: Passphrase not set in environment variables.");
    }

    // Rate limit check (5 attempts per hour)
    const rateLimitOk = await checkAuthLimit(email);
    if (!rateLimitOk) {
      logger.logAuthEvent('failed_login', email, { reason: 'rate_limit_exceeded' });
      redirect("/login?error=Too+many+attempts.+Try+again+later.");
    }

    // Validate input
    if (!password || password.length === 0) {
      logger.logAuthEvent('failed_login', email, { reason: 'empty_password' });
      redirect("/login?error=Invalid+Credentials");
    }

    // Sanitize input to prevent injection
    const sanitizedPassword = sanitizeInput(password);

    // Verify password
    if (sanitizedPassword === ADMIN_PASSPHRASE) {
      // Issue a secure, HTTP-only cookie valid for 7 days
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "secure_jcls_token_active", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      
      logger.logAuthEvent('login', email, { success: true });
      redirect("/admin");
    } else {
      logger.logAuthEvent('failed_login', email, { reason: 'invalid_password' });
      redirect("/login?error=Invalid+Credentials");
    }
  } catch (error) {
    logger.error("Login action failed", { error });
    throw error;
  }
}
