import { z } from 'zod';

/**
 * Environment variable schema - all required vars must be present and valid
 */
const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // APIs
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GNEWS_API_KEY: z.string().min(1, 'GNEWS_API_KEY is required'),
  
  // Email
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().optional(),
  RESEND_ADMIN_EMAIL: z.string().email().optional(),
  
  // Error tracking (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Rate limiting (optional)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Google verification (optional)
  NEXT_PUBLIC_GOOGLE_VERIFICATION: z.string().optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production']).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

/**
 * Validate environment variables at runtime
 */
function validateEnv() {
  try {
    const result = EnvSchema.parse(process.env);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter((e) => e.code === 'invalid_type' || e.code === 'too_small')
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n  ');
      
      console.error('Invalid environment variables:\n  ' + missingVars);
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment configuration');
      }
    }
    throw error;
  }
}

// Validate on import
export const env = validateEnv();

export type Env = z.infer<typeof EnvSchema>;
