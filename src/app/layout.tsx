import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MobileDock from "@/components/MobileDock";
import { ThemeProvider } from "@/components/ThemeProvider";

// Load Inter for standard reading text
const inter = Inter({ subsets: ["latin"] });

// Load Playfair Display for our premium editorial headlines
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Beacon-Hub | News, Investments & Tech",
  description: "The premier portal for market trends, real estate deals, and developer logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col antialiased bg-white dark:bg-[#1C1C1E] text-black dark:text-[#F9F6F0]`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          
          {/* THE FIX: Added pt-[108px] to clear the top nav, and pb-[100px] to clear the bottom dock on mobile */}
          <main className="flex-grow pt-[108px] pb-[100px] md:pb-0 min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* THE FIX: Added pb-24 to the footer so it doesn't get covered by the mobile dock at the absolute bottom of the page */}
          <footer className="border-t border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#141415] mt-auto pb-24 md:pb-8">
            <div className="container mx-auto px-4 py-8 flex flex-col items-center md:items-start gap-6">
              
              {/* Global Authority Branding */}
              <div className="w-full text-center md:text-left border-b border-black/5 dark:border-white/5 pb-4">
                <h3 className="text-lg font-black tracking-tighter uppercase font-playfair text-black dark:text-[#F9F6F0]">
                  Beacon<span className="text-[#E2725B]">-Hub</span> Global Intelligence
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 tracking-[0.2em] uppercase mt-1 font-bold">
                  Lagos &bull; London &bull; New York
                </p>
              </div>

              {/* Bottom Utility Links */}
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium">
                  © 2026 Beacon-Hub. All Rights Reserved.
                </p>
                <div className="flex gap-4 text-xs text-slate-500 font-medium">
                  <Link href="/privacy" className="hover:text-[#E2725B] transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-[#E2725B] transition-colors">Terms of Service</Link>
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">
                  Engineered by <span className="text-[#E2725B]">JCLS• (Jare's Choice Labs)</span>.
                </p>
              </div>
              
            </div>
          </footer>
          <MobileDock />
        </ThemeProvider>
      </body>
    </html>
  );
}