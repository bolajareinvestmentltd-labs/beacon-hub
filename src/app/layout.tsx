import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import MobileDock from "@/components/MobileDock";
import { ThemeProvider } from "@/components/ThemeProvider"

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
    <html lang="en" className="scroll-smooth">
      {/* ⚡ THE GLOBAL SWAP: Alabaster Background, Midnight Navy Text */}
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col antialiased bg-[#FAFAFA] text-[#0A1128]`}>
        
        {/* We keep the old Navbar for right now. We will demolish it in Phase 2 */}
        <Navbar />
        {/*<FloatingNav /> */}

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* GLOBAL FOOTER - Updated to match the new light theme */}
        <footer className="border-t border-slate-200 bg-[#FAFAFA] mt-auto">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Beacon-Hub. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500 font-medium">
              <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
            <p className="text-sm font-semibold text-slate-400 tracking-wide">
              Engineered by <span className="text-[#0A1128]">Jare's Choice Labs</span>.
            </p>
          </div>
        </footer>
        <MobileDock/>

      </body>
    </html>
  );
}
