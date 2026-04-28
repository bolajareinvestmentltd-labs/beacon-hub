import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-slate-950 text-slate-100`}>
        
        {/* NEW SMART NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Beacon-Hub. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            </div>
            <p className="text-sm font-semibold text-slate-400 tracking-wide">
              Engineered by <span className="text-indigo-400">Jare's Choice Labs</span>.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
