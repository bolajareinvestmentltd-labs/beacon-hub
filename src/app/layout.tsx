import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import MobileDock from '@/components/MobileDock';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Beacon Hub - Premium News Platform',
  description: 'World-class news journalism with premium editorial design',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  icons: {
    icon: '/beacon-logo.svg',
    apple: '/beacon-logo.svg',
  },
  openGraph: {
    title: 'Beacon Hub - Premium News Platform',
    description: 'World-class news journalism with premium editorial design',
    url: '/',
    siteName: 'Beacon Hub',
    type: 'website',
    images: [{ url: '/beacon-logo.svg', alt: 'Beacon Hub logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beacon Hub - Premium News Platform',
    description: 'World-class news journalism with premium editorial design',
    images: ['/beacon-logo.svg'],
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

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <CategoryBar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileDock />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}