import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
// Use a raw <script> tag for AdSense to avoid Next.js adding `data-nscript`
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileDock from '@/components/MobileDock';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beacon-hub.vercel.app';
const socialImage = new URL('/beacon-logo.svg', siteUrl).toString();
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID?.trim();

export const metadata: Metadata = {
  title: 'Beacon Hub - Premium News Platform',
  description: 'World-class news journalism with premium editorial design',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Beacon Hub - Premium News Platform',
    description: 'World-class news journalism with premium editorial design',
    url: siteUrl,
    siteName: 'Beacon Hub',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Beacon Hub logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beacon Hub - Premium News Platform',
    description: 'World-class news journalism with premium editorial design',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-background text-foreground antialiased`}>
        {ADSENSE_CLIENT_ID && !ADSENSE_CLIENT_ID.includes('xxxxxxxx') && (
          <script
            id="google-adsense-master"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          ></script>
        )}

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="flex-1 pt-[112px]">{children}</main>
          <Footer />
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
