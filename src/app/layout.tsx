import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileDock from "@/components/MobileDock";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Beacon-Hub | Global Intelligence",
  description: "A premium decentralized intelligence network and secure escrow marketplace. Get the latest macro-trends, global news, and exclusive asset listings.",
  openGraph: {
    title: "Beacon-Hub | The Architect's Network",
    description: "Premium decentralized intelligence and secure escrow marketplace.",
    url: "https://beacon-hub.vercel.app",
    siteName: "Beacon-Hub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1200&auto=format&fit=crop", // A premium dark-mode architectural placeholder image
        width: 1200,
        height: 630,
        alt: "Beacon-Hub Intelligence Dashboard",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon-Hub | Global Intelligence",
    description: "Premium decentralized intelligence and secure escrow marketplace.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9F6F0] dark:bg-black text-[#0A1128] dark:text-[#F9F6F0] transition-colors duration-300 pb-20 md:pb-0`}>
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
