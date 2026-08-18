import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from './logger';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasValidRedisConfig = Boolean(
  redisUrl &&
  redisToken &&
  redisUrl.startsWith('https://') &&
  !redisUrl.includes('your_upstash_') &&
  !redisToken.includes('your_upstash_')
);

if (!hasValidRedisConfig) {
  console.warn('Rate limiting disabled: Missing Upstash credentials');
}

const redis = hasValidRedisConfig
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

/**
 * Create a rate limiter instance
 */
function createRateLimiter(maxRequests: number, window: string) {
  if (!redis) {
    return null;
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, window as any),
    analytics: true,
  });
}

// Rate limiters
const authLimiter = createRateLimiter(5, '1h'); // 5 attempts per hour
const apiLimiter = createRateLimiter(100, '1h'); // 100 requests per hour
const contactLimiter = createRateLimiter(3, '1h'); // 3 contact forms per hour
const subscribeLimiter = createRateLimiter(10, '1h'); // 10 subscriptions per hour

/**
 * Check authentication rate limit
 */
export async function checkAuthLimit(email: string): Promise<boolean> {
  if (!authLimiter) return true; // Allow if limiter disabled

  try {
    const { success } = await authLimiter.limit(email);
    if (!success) {
      logger.logRateLimitHit(email, '5 attempts per hour');
    }
    return success;
  } catch (error) {
    logger.error('Rate limit check failed', { type: 'auth', email, error });
    return true; // Allow on error to prevent service disruption
  }
}

/**
 * Check API rate limit by IP
 */
export async function checkAPILimit(ip: string): Promise<boolean> {
  if (!apiLimiter) return true;

  try {
    const { success } = await apiLimiter.limit(ip);
    if (!success) {
      logger.logRateLimitHit(ip, '100 requests per hour');
    }
    return success;
  } catch (error) {
    logger.error('Rate limit check failed', { type: 'api', ip, error });
    return true;
  }
}

/**
 * Check contact form rate limit
 */
export async function checkContactLimit(email: string): Promise<boolean> {
  if (!contactLimiter) return true;

  try {
    const { success } = await contactLimiter.limit(email);
    if (!success) {
      logger.logRateLimitHit(email, '3 contact forms per hour');
    }
    return success;
  } catch (error) {
    logger.error('Rate limit check failed', { type: 'contact', email, error });
    return true;
  }
}

/**
 * Check newsletter subscription rate limit
 */
export async function checkSubscribeLimit(email: string): Promise<boolean> {
  if (!subscribeLimiter) return true;

  try {
    const { success } = await subscribeLimiter.limit(email);
    if (!success) {
      logger.logRateLimitHit(email, '10 subscriptions per hour');
    }
    return success;
  } catch (error) {
    logger.error('Rate limit check failed', { type: 'subscribe', email, error });
    return true;
  }
}
