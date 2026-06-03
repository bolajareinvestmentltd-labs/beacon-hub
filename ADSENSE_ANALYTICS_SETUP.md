# Google AdSense & Analytics Setup Guide

This document provides instructions for completing Google AdSense and Google Analytics integration for Beacon-Hub.

## ✅ Completed Setup

### 1. AdSense Component Created
- **Location**: `src/components/AdSense.tsx`
- **Purpose**: Reusable component for displaying AdSense ads
- **Usage**:
  ```tsx
  import AdSense from "@/components/AdSense";
  
  <AdSense adSlot="1234567890" adFormat="rectangle" />
  ```

### 2. ads.txt File Created
- **Location**: `public/ads.txt`
- **Status**: Template created (requires AdSense Publisher ID)
- **Purpose**: Declares authorized digital ad sellers

### 3. SEO Configuration Complete
- **robots.txt**: `public/robots.txt` ✓
- **sitemap.xml**: `src/app/sitemap.ts` ✓
- **JSON-LD Structured Data**: Added to `src/app/layout.tsx` ✓
  - Organization schema
  - WebSite schema with SearchAction
- **OpenGraph Tags**: Configured ✓
- **Twitter Card Tags**: Configured ✓
- **Verification Tag**: Added to metadata (needs Google verification code)

### 4. AdSense Integrated Into Pages
- **Homepage**: `src/app/page.tsx`
  - Ad placement after hero section (rectangle ad)
  - Ad placement after every 3 feed articles
  - Full-width responsive ad at bottom
- **Component**: Ready to use on any page

---

## 🔧 Required Manual Setup

### Step 1: Google AdSense Account & Approval

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Create an AdSense account:
   - Enter website URL: `https://beacon-hub.vercel.app`
   - Accept terms and conditions
   - Complete verification
4. Wait for Google's approval (usually 24-48 hours)

### Step 2: Update Publisher ID

Once approved, you'll receive a **Publisher ID** (format: `pub-xxxxxxxxxxxxxxxx`)

**Update the following files:**

1. **`src/components/AdSense.tsx`**
   ```tsx
   data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"  // Replace with your Publisher ID
   ```

2. **`src/app/layout.tsx`**
   ```tsx
   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
   ```

3. **`public/ads.txt`**
   ```
   google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0
   ```

### Step 3: Create Ad Units

In Google AdSense dashboard:

1. Go to **Ads** > **Ad units**
2. Create ad units for each placement type:
   - **Homepage Rectangle Ad**: `1234567890` (300x250 or 336x280)
   - **Homepage Feed Ads**: Use same or different slot
   - **Homepage Bottom Ad**: `0987654321` (responsive)

3. Update ad slots in your code:
   - `src/app/page.tsx`: Update `adSlot` values
   - Any other pages using AdSense

### Step 4: Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://beacon-hub.vercel.app`
3. Verify ownership using Google-provided meta tag:
   - Copy the verification code
   - Update `src/app/layout.tsx`:
   ```tsx
   verification: {
     google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
   }
   ```
   - Redeploy the application
   - Confirm verification in Search Console

4. Submit sitemap:
   - Navigate to Sitemaps in Search Console
   - Add sitemap: `https://beacon-hub.vercel.app/sitemap.xml`
   - Verify crawl status

### Step 5: Google Analytics 4 Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property:
   - Property name: "Beacon-Hub"
   - Website URL: `https://beacon-hub.vercel.app`
   - Timezone: Select your timezone
   - Currency: Select your currency

3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

4. Update `src/app/layout.tsx`:
   ```tsx
   <Script
     src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
     strategy="afterInteractive"
   />
   <Script
     id="google-analytics"
     strategy="afterInteractive"
     dangerouslySetInnerHTML={{
       __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXXX');
       `,
     }}
   />
   ```

5. Verify tracking:
   - Open your website
   - Go to Analytics dashboard
   - Check "Real-time" > "Overview"
   - You should see active users

---

## 📋 Checklist

- [ ] Google AdSense account created and approved
- [ ] Publisher ID added to `AdSense.tsx`
- [ ] Publisher ID added to `layout.tsx`
- [ ] ads.txt updated with Publisher ID
- [ ] Ad units created in AdSense dashboard
- [ ] Ad slot numbers updated in pages
- [ ] Google Search Console verification code added
- [ ] Sitemap submitted to Search Console
- [ ] Google Analytics property created
- [ ] Measurement ID added to `layout.tsx`
- [ ] Analytics tracking verified in real-time dashboard
- [ ] Application redeployed on Vercel
- [ ] All changes verified in production

---

## 🔍 Verification Steps

### Test AdSense
1. Deploy the application
2. Open https://beacon-hub.vercel.app
3. Open browser DevTools (F12)
4. Look for AdSense script loading and ad placeholders
5. Check for any ad-related errors in console

### Test Analytics
1. Visit https://beacon-hub.vercel.app
2. Go to Google Analytics dashboard
3. Navigate to **Real-time** > **Overview**
4. You should see yourself as an active user

### Test Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console)
2. Check **Coverage** to verify indexing
3. Check **Core Web Vitals** for performance data

---

## 📌 Important Notes

- **Ad Approval**: AdSense ads may not show immediately. Google typically reviews content quality before serving ads
- **Content Requirements**: 
  - High-quality, original content
  - Compliance with AdSense policies
  - No excessive ads
- **Testing**: Use `ca-pub-0000000000000000` for testing (won't generate revenue)
- **Earnings**: Minimum ₦100 threshold required before payment
- **Policy Compliance**: Ensure content doesn't violate AdSense policies:
  - No ads on pages with sexual content
  - No ads with copyrighted material
  - No click-baiting headlines
  - No malware/popups

---

## 🚀 Next Steps

1. Complete all Setup steps above
2. Test all integrations thoroughly
3. Monitor Analytics for traffic patterns
4. Optimize ad placements based on performance
5. Create additional content to attract more visitors
6. Monitor AdSense for policy violations
7. Track revenue and CPC metrics

---

## 📞 Support Resources

- [Google AdSense Help Center](https://support.google.com/adsense)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Google Analytics Documentation](https://support.google.com/analytics)
- [Next.js Script Component](https://nextjs.org/docs/basic-features/script)

---

## ⚠️ Security Notes

- Never expose your Publisher ID in client-side comments or documentation (it's okay in code)
- Keep your Google accounts secure with 2FA
- Regularly review AdSense for suspicious activity
- Monitor Search Console for security issues
