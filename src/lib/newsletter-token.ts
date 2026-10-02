import { createHmac, timingSafeEqual } from 'node:crypto';

export function createNewsletterToken(email: string, secret: string) {
  const encodedEmail = Buffer.from(email).toString('base64url');
  const signature = createHmac('sha256', secret).update(encodedEmail).digest('base64url');
  return `${encodedEmail}.${signature}`;
}

export function verifyNewsletterToken(token: string, secret: string) {
  const [encodedEmail, signature] = token.split('.');
  if (!encodedEmail || !signature) return null;

  const expected = createHmac('sha256', secret).update(encodedEmail).digest('base64url');
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  try {
    const email = Buffer.from(encodedEmail, 'base64url').toString('utf8').toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
  } catch {
    return null;
  }
}