import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import MobileDock from '@/components/MobileDock';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Beacon Hub - Premium News Platform',
  description: 'World-class news journalism with premium editorial design',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
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
    images: [
      {
        url: '/beacon-logo.svg',
        alt: 'Beacon Hub logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beacon Hub - Premium News Platform',
    description: 'World-class news journalism with premium editorial design',
    images: ['/beacon-logo.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="pb-28 md:pb-0">
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