import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        
        {/* GLOBAL NAVIGATION BAR */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Spinning Logo Loader */}
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin-slow group-hover:border-indigo-400 transition-colors"></div>
              <span className="text-xl font-bold tracking-tight text-white">
                BEACON<span className="text-indigo-500">HUB</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
              <Link href="/category/politics" className="hover:text-indigo-400 transition-colors">Politics</Link>
              <Link href="/category/tech" className="hover:text-indigo-400 transition-colors">Tech</Link>
              <Link href="/horoscopes" className="hover:text-indigo-400 transition-colors">Astrology</Link>
              <Link href="/deals" className="hover:text-indigo-400 transition-colors">AySmart Deals</Link>
              <Link href="/dev-log" className="hover:text-indigo-400 transition-colors">Dev Log</Link>
            </nav>

            {/* Action Button */}
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Subscribe
            </button>
          </div>
        </header>

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
