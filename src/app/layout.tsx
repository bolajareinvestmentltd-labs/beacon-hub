import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import MobileDock from "@/components/MobileDock";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Beacon-Hub | Global Intelligence",
  description: "Your premium source for global news, tech startups, astrology, and verified escrow deals.",
  metadataBase: new URL("https://beacon-hub.vercel.app"),
  openGraph: {
    title: "Beacon-Hub | Global Intelligence",
    description: "Your premium source for global news and verified deals.",
    url: "/",
    siteName: "Beacon-Hub",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Beacon-Hub Cover Image" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon-Hub | Global Intelligence",
    description: "Your premium source for global news and verified deals.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans selection:bg-[#C85A32] selection:text-white flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
