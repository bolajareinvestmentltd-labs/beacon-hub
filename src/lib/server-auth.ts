import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  try {
    return timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

export function createAdminSessionToken(email: string, maxAgeSeconds: number, secret: string) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
    iat: Math.floor(Date.now() / 1000),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(token: string, secret: string) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(encoded).digest('base64url');
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }
  } catch {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { exp?: number };
    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
