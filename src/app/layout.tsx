import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileDock from '@/components/MobileDock';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beacon-hub.vercel.app';
const socialImage = new URL('/beacon-logo.svg', siteUrl).toString();

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
        <Script
          id="google-adsense-master"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

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
