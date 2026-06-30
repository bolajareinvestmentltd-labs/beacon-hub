import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import MobileDock from '@/components/MobileDock';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Beacon Hub - Premium News Platform',
  description: 'World-class news journalism with premium editorial design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* NOTE: <head> and manual dark-mode scripts removed. 
        Next.js auto-generates the head, and ThemeProvider auto-handles theme hydration.
      */}
      <body className="pb-28 md:pb-0">
        
        {/* MASTER GOOGLE ADSENSE ENGINE */}
        <Script
          id="google-adsense-master"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="relative min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}