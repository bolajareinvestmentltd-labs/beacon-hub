export async function verifyAdminSessionToken(token: string, secret: string) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const expectedRaw = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(encoded));
  const expectedSignature = base64UrlEncode(new Uint8Array(expectedRaw));

  if (!timingSafeEqual(signature, expectedSignature)) {
    return false;
  }

  const payload = parseTokenPayload(encoded);
  return payload?.exp ? payload.exp > Math.floor(Date.now() / 1000) : false;
}

function base64UrlEncode(data: Uint8Array) {
  const binary = String.fromCharCode(...data);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecodeToString(value: string) {
  let input = value.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  const decoded = atob(input);
  return decoded;
}

function parseTokenPayload(encoded: string) {
  try {
    const json = base64UrlDecodeToString(encoded);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
