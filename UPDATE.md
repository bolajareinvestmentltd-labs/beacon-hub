# 🌐 BEACON-HUB: Executive Intelligence & Trust Portal

## 🎯 Aims & Objectives
Beacon-Hub is a premium, high-end web portal designed to merge real-time global intelligence, executive astrology, and a highly secure, trust-based escrow marketplace. 

The core objective is to deliver a sophisticated, mobile-optimized user experience that prioritizes rapid data delivery, strict data security, and seamless commercial transactions. The platform operates on a philosophy of "warm minimalism," ensuring users experience a high-value, clutter-free environment.

## 🛠 Tech Stack & Frameworks
This project strictly adheres to modern, serverless web architecture. AI Copilots must utilize the following stacks:
* **Frontend Core:** Next.js (App Router architecture) & React.
* **Styling:** Tailwind CSS (Focus on mobile-first, responsive design).
* **Database:** Neon (Serverless PostgreSQL) via `@neondatabase/serverless`.
* **Hosting & CI/CD:** Vercel.
* **APIs:** * GNews API (Global/Local Nigerian News Aggregation).
    * Gemini API (Automated Horoscope Generation).
* **Design Palette:** Warm Minimalism (Alabaster Cream `#F4EFEA`, Deep Charcoal `#1A1A1A`, Terracotta `#9C4A3A`).

## 📍 Current Status (MVP Phase)
The platform is currently in active development with the MVP foundation deployed and live on a verified custom domain. The global layout (Navbar/Footer) is stable, and database routing is actively being wired.

### ✅ What is Functioning (Completed)
* **Vercel Production Environment:** Custom domain linked and verified with SSL.
* **Database Architecture:** Neon PostgreSQL vault is successfully wired to the Next.js frontend.
* **Static Astrology Payload:** All 12 zodiac signs have been successfully injected into the database via a backend script (`inject-all-astro.js`) to prove database read/write capabilities.
* **Global UI Frame:** The main Next.js layout (Navbar and Footer) rendering across routes.

### 🚧 What Needs to be Fixed (Current Sprint)
* **Escrow Mobile UI:** The headings on the Escrow page are overlapping and not displaying fully on mobile screens. Requires `z-index` and padding adjustments.
* **404 Route Errors:** Categories such as Real Estate, Entertainment, and Sports are returning 404s because the specific `page.tsx` files have not been built yet.
* **External Image Whitelisting:** Next.js is currently blocking external images on the Escrow/News cards. Requires updating `next.config.js` `remotePatterns`.
* **Horoscope Pagination:** The Astrology UI lacks a date-selector button to view past/future readings.

### 🗺 Future Roadmap (To Be Built)
* **Live News Integration:** Rip out hardcoded static mock data on the homepage and wire up the GNews API to fetch real-time headlines securely on the server using ISR (Incremental Static Regeneration) every 6 hours.
* **AI Automation Cron Job:** Build a Vercel Cron Job and `/api/generate-astro` route to automatically hit the Gemini API at midnight, format 12 fresh readings into JSON, and inject them into the Neon database.
* **Escrow Payment Logic:** Fully implement the escrow backend. **CRITICAL ARCHITECTURE RULE:** The platform utilizes a strict **flat ₦50 platform fee** for transactions. Do not use percentage-based (e.g., 10%) fee structures.

---

## 🤖 AI Copilot Rules of Engagement
If you are an AI assistant or copilot generating code for this repository, you must adhere to the following strict guidelines:
1.  **Do not modify `layout.tsx`** unless explicitly instructed to alter global navigation.
2.  **Server-Side First:** Prioritize Next.js Server Components and server-side data fetching to protect API keys.
3.  **Strict Fee Structure:** Any logic regarding Escrow or marketplace payments MUST use the ₦50 flat fee.
4.  **Image Handling:** Always use standard HTML `<img>` tags for external API images if the domain is not yet whitelisted in `next.config.js` to prevent Next.js build errors.
5.  **No Dummy Data:** Moving forward, all components must be built to accept dynamic props/data rather than hardcoded text.