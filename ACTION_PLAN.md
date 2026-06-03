# 🎯 BEACON-HUB: PRIORITIZED ACTION PLAN

## Quick Overview
**Current Status**: 75% Production-Ready  
**Target**: 95% Enterprise-Ready  
**Timeline**: 6-8 weeks

---

## 🔴 SPRINT 1 (Week 1-2): CRITICAL FIXES

### Issue #1: Email Service Integration ⚠️ BLOCKING
**Priority**: CRITICAL  
**Effort**: 2-3 hours

**Steps**:
1. Install Resend email service
```bash
npm install resend
```

2. Add to `.env.local`:
```
RESEND_API_KEY=your_api_key_here
```

3. Create `src/lib/email.ts`:
```ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  email: string,
  name: string,
  subject: string,
  message: string
) {
  await resend.emails.send({
    from: 'support@beacon-hub.com',
    to: email,
    subject: `We received your message: ${subject}`,
    html: `<h2>Hello ${name}</h2><p>Thank you for contacting us.</p><p>${message}</p>`,
  });

  // Notify admin
  await resend.emails.send({
    from: 'support@beacon-hub.com',
    to: 'admin@beacon-hub.com',
    subject: `New Contact: ${subject}`,
    html: `<p><strong>${name}</strong> (${email})</p><p>${message}</p>`,
  });
}
```

4. Update `src/app/contact/page.tsx`:
- Replace TODO with actual sendContactEmail call
- Add success/error messaging

**Validation**: 
- [ ] Contact form receives email
- [ ] User gets confirmation email
- [ ] Admin notified of new message

---

### Issue #2: Input Validation & Sanitization 🔒 SECURITY
**Priority**: CRITICAL  
**Effort**: 3-4 hours

**Steps**:
1. Install dependencies:
```bash
npm install zod isomorphic-dompurify
```

2. Create `src/lib/validation.ts`:
```ts
import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(10).max(50000),
  category: z.enum(['Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Politics', 'Sports', 'World']),
  author: z.string().min(2).max(100),
  excerpt: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(['Support', 'Partnership', 'Bug Report', 'Feature Request']),
});
```

3. Create `src/lib/sanitize.ts`:
```ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html);
}

export function sanitizeInput(input: string) {
  return input.trim().replace(/[<>]/g, '');
}
```

4. Update `src/lib/actions.ts`:
```ts
import { ArticleSchema } from '@/lib/validation';
import { sanitizeHTML } from '@/lib/sanitize';

export async function publishArticle(formData: FormData): Promise<void> {
  try {
    const validated = ArticleSchema.parse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: sanitizeHTML(formData.get('content') as string),
      category: formData.get('category'),
      author: formData.get('author'),
    });
    // ... rest of function
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors[0].message}`);
    }
    throw error;
  }
}
```

**Validation**:
- [ ] Form rejects invalid input
- [ ] HTML is properly sanitized
- [ ] Type-safe throughout application

---

### Issue #3: Error Tracking Setup 📊 OBSERVABILITY
**Priority**: CRITICAL  
**Effort**: 2 hours

**Steps**:
1. Create Sentry account: https://sentry.io
2. Install Sentry:
```bash
npm install @sentry/nextjs
```

3. Create `sentry.client.config.ts`:
```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

4. Create `sentry.server.config.ts`:
```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

5. Add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your_client_dsn
SENTRY_DSN=your_server_dsn
SENTRY_AUTH_TOKEN=your_auth_token
```

6. Create `src/lib/logger.ts`:
```ts
import * as Sentry from "@sentry/nextjs";

export const logger = {
  error: (message: string, context?: any) => {
    console.error(message, context);
    Sentry.captureException(new Error(message), { extra: context });
  },
  warning: (message: string, context?: any) => {
    console.warn(message, context);
    Sentry.captureMessage(message, 'warning');
  },
  info: (message: string, context?: any) => {
    console.info(message, context);
  },
};
```

**Validation**:
- [ ] Errors appear in Sentry dashboard
- [ ] Error tracking working for API routes
- [ ] Can see error details and context

---

### Issue #4: Rate Limiting Implementation 🛡️ SECURITY
**Priority**: CRITICAL  
**Effort**: 2-3 hours

**Steps**:
1. Create Upstash Redis account: https://upstash.com
2. Install dependencies:
```bash
npm install @upstash/ratelimit @upstash/redis
```

3. Create `src/lib/rateLimit.ts`:
```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 attempts per hour
  analytics: true,
});

const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
  analytics: true,
});

export async function checkAuthLimit(email: string) {
  const { success } = await authLimiter.limit(email);
  return success;
}

export async function checkAPILimit(ip: string) {
  const { success } = await apiLimiter.limit(ip);
  return success;
}
```

4. Update `src/lib/auth-actions.ts`:
```ts
import { checkAuthLimit } from '@/lib/rateLimit';

export async function loginAction(email: string, password: string) {
  const allowed = await checkAuthLimit(email);
  if (!allowed) {
    throw new Error('Too many login attempts. Try again later.');
  }
  // ... rest of auth logic
}
```

5. Update `src/app/api/cron/news/route.ts`:
```ts
import { checkAPILimit } from '@/lib/rateLimit';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const allowed = await checkAPILimit(ip);
  
  if (!allowed) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  // ... rest of cron logic
}
```

**Validation**:
- [ ] Auth endpoint rejects after 5 attempts
- [ ] API endpoints reject after 100 requests/hour
- [ ] Rate limiting visible in Upstash dashboard

---

### Issue #5: Security Headers Configuration 🔐 SECURITY
**Priority**: HIGH  
**Effort**: 1 hour

**Steps**:
1. Update `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
  // ... rest of config
};
```

**Validation**:
- [ ] Headers visible in browser Network tab
- [ ] Security score improved on securityheaders.com

---

## 🟠 SPRINT 2 (Week 3-4): HIGH PRIORITY

### Issue #6: Environment Variable Validation
**Effort**: 1-2 hours

Create `src/lib/env.ts`:
```ts
import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  GNEWS_API_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);
```

---

### Issue #7: Cookie Consent Banner (GDPR Required)
**Effort**: 2-3 hours

```bash
npm install react-cookie-consent
```

Create `src/components/CookieBanner.tsx`:
```tsx
'use client';

import CookieConsent from 'react-cookie-consent';

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="beacon_hub_consent"
      expires={365}
    >
      We use cookies to improve your experience. View our{' '}
      <a href="/privacy">Privacy Policy</a> for more information.
    </CookieConsent>
  );
}
```

Add to `src/app/layout.tsx`:
```tsx
<CookieBanner />
```

---

### Issue #8: Database Backup Strategy
**Effort**: 2 hours

**Steps**:
1. Enable Neon automated backups (console.neon.tech)
2. Create `scripts/backup.ts`:
```ts
import { execSync } from 'child_process';

export async function backupDatabase() {
  const timestamp = new Date().toISOString();
  const filename = `backup_${timestamp}.sql`;
  
  execSync(`pg_dump $DATABASE_URL > backups/${filename}`);
  console.log(`Backup created: ${filename}`);
}
```

3. Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

### Issue #9: API Documentation with Swagger
**Effort**: 3-4 hours

```bash
npm install swagger-jsdoc swagger-ui-express
```

Create `src/lib/swagger.ts` and `src/app/api/docs/route.ts`

---

### Issue #10: Monitoring Dashboard
**Effort**: 2-3 hours

- Set up Vercel Analytics
- Configure real-time monitoring
- Create dashboard with key metrics

---

## 🟡 SPRINT 3 (Week 5-6): MEDIUM PRIORITY

### Issue #11: Automated Testing
- Jest for unit tests
- Cypress for E2E tests
- Target 80% code coverage

### Issue #12: Accessibility (WCAG 2.1)
- Add ARIA labels
- Screen reader testing
- Color contrast validation

### Issue #13: Performance Optimization
- Image optimization
- CSS/JS minification
- Database query caching

---

## 📋 IMPLEMENTATION CHECKLIST

**Week 1**:
- [ ] Email integration complete
- [ ] Input validation implemented
- [ ] Sentry error tracking set up
- [ ] Rate limiting deployed
- [ ] Security headers added

**Week 2**:
- [ ] Environment variables validated
- [ ] Cookie banner implemented
- [ ] Database backups scheduled
- [ ] API documentation started
- [ ] Monitoring dashboard created

**Week 3**:
- [ ] Unit tests written
- [ ] Accessibility audit complete
- [ ] Performance optimizations done
- [ ] Consumer rights forms added

**Week 4**:
- [ ] E2E tests passing
- [ ] SOC 2 audit preparation
- [ ] Documentation finalized
- [ ] Security audit performed

---

## ✅ SUCCESS CRITERIA

Each completed issue should have:
1. Code implemented
2. Tests passing
3. Documentation updated
4. Deployed to staging
5. Team review completed
6. Deployed to production

---

## 📞 RESOURCES

- **Sentry**: https://sentry.io/signup/
- **Upstash**: https://upstash.com
- **Resend**: https://resend.com
- **OWASP Top 10**: https://owasp.org/Top10/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated**: May 30, 2026  
**Status**: Ready for Implementation
