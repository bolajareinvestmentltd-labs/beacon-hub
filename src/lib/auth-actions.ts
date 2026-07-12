"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuthLimit } from "./rateLimit";
import { logger } from "./logger";
import { sanitizeInput } from "./sanitize";
import { LoginSchema } from "./validation";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "secure_jcls_token_active";

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim() || "";
    const password = (formData.get("password") as string) || "";
    const rememberMe = formData.get("rememberMe") === "on";
    const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE;

    if (!ADMIN_PASSPHRASE) {
      logger.error("SERVER MISCONFIGURATION: Admin passphrase not set");
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

    if (sanitizedPassword !== ADMIN_PASSPHRASE) {
      logger.logAuthEvent('failed_login', sanitizedEmail, { reason: 'invalid_password' });
      redirect("/login?error=Invalid+credentials.");
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    logger.logAuthEvent('login', email, { success: true, rememberMe });
    redirect("/admin");
  } catch (error) {
    logger.error("Login action failed", { error });
    redirect("/login?error=Unable+to+authenticate+at+this+time.");
  }
}
