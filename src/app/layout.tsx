import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileDock from "@/components/MobileDock";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Beacon-Hub | Global Intelligence",
  description: "Your premium source for global news, tech startups, astrology, and verified escrow deals.",
  metadataBase: new URL("https://beacon-hub.vercel.app"),
  openGraph: {
    title: "Beacon-Hub | Global Intelligence",
    description: "Your premium source for global news and verified deals.",
    url: "/",
    siteName: "Beacon-Hub",
    images: [
      {
        url: "/opengraph-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Beacon-Hub Cover Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon-Hub | Global Intelligence",
    description: "Your premium source for global news and verified deals.",
    images: ["/opengraph-image.jpg"],
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE", // Replace with actual verification code from Google Search Console
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Beacon-Hub",
              url: "https://beacon-hub.vercel.app",
              logo: "https://beacon-hub.vercel.app/logo.png",
              description: "Your premium source for global news, tech startups, astrology, and verified escrow deals.",
              sameAs: [],
              contact: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "support@beacon-hub.com",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://beacon-hub.vercel.app",
              name: "Beacon-Hub",
              description: "Global Intelligence Platform - News, Tech, Astrology, Marketplace",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://beacon-hub.vercel.app/search?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Google Analytics */}
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
      <body className="font-sans bg-[#F9F6F0] dark:bg-black text-[#0A1128] dark:text-[#F9F6F0] transition-colors duration-300 pb-20 md:pb-0">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
