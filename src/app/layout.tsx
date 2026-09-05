import type { Metadata } from 'next';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
// Use a raw <script> tag for AdSense to avoid Next.js adding `data-nscript`
import { ThemeProvider } from '@/components/ThemeProvider';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import BrandSplash from '@/components/BrandSplash';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileDock from '@/components/MobileDock';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import TrafficTracker from '@/components/TrafficTracker';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl?.startsWith('https://')
  ? configuredSiteUrl
  : 'https://www.beacon-hub.com.ng';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID?.trim();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F2F7F3',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Beacon Hub - Premium News Platform',
  description: 'World-class news journalism with premium editorial design',
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Beacon Hub',
  },
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

        <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
          <BrandSplash />
          <Navbar />
          <main className="w-full max-w-screen-xl mx-auto flex-1 overflow-x-hidden px-4 pt-[112px] sm:px-6 lg:px-8">{children}</main>
          <Footer />
          <MobileDock />
          <PwaInstallPrompt />
          <ServiceWorkerRegistration />
          <TrafficTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}
