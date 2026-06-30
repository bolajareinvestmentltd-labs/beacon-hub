<<<<<<< HEAD
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#121212] text-[#F9F6F0] py-16 px-6 sm:px-12 border-t-4 border-[#C85A32] pb-36 md:pb-16 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h2 className="font-serif text-3xl font-black tracking-tight mb-4 text-[#F9F6F0]">
            BEACON<span className="text-[#C85A32]">•</span>HUB
          </h2>
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest max-w-sm leading-relaxed mb-6">
            A JCLs• Digital Property. Engineering intelligence for the global market. 
          </p>
        </div>
        
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Directory</h3>
          <ul className="space-y-3 font-medium text-sm text-neutral-300">
            <li><Link href="/category/tech" className="hover:text-[#C85A32] transition-colors">Tech & Startups</Link></li>
            <li><Link href="/category/real-estate" className="hover:text-[#C85A32] transition-colors">Real Estate</Link></li>
            <li><Link href="/category/election-2026" className="hover:text-[#C85A32] transition-colors">Elections 2026</Link></li>
            <li><Link href="/deals" className="hover:text-[#C85A32] transition-colors">Escrow Network</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Trust & Ethics</h3>
          <ul className="space-y-3 font-medium text-sm text-neutral-300">
            <li><Link href="/privacy-policy" className="hover:text-[#C85A32] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#C85A32] transition-colors">Terms of Service</Link></li>
            <li><Link href="/ethics" className="hover:text-[#C85A32] transition-colors">Editorial Policy</Link></li>
            <li><a href="mailto:editor@beaconhub.com" className="hover:text-[#C85A32] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>Secure Tip Line</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono text-neutral-500">
        <p>© {new Date().getFullYear()} Jare's Choice Labs. All rights reserved.</p>
        <p>Google AdSense Network Compliant</p>
      </div>
    </footer>
  );
}
=======
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-[#141415] border-t border-black/5 dark:border-white/5 pt-16 pb-32 md:pb-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Brand Section */}
        <div className="space-y-4 max-w-sm">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black text-black dark:text-[#FDFDFB] tracking-tighter uppercase font-playfair">
              Beacon<span className="text-[#C85A32]">-Hub</span>
            </span>
          </div>
          <p className="text-sm font-serif text-slate-500 dark:text-slate-400 leading-relaxed">
            Your premium source for global intelligence, tech startups, executive astrology, and verified escrow deals.
          </p>
        </div>

        {/* Links Matrix */}
        <div className="flex gap-16 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-black dark:text-white">
              Intelligence
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-[#C85A32] transition-colors">Global News</Link></li>
              <li><Link href="/deals" className="hover:text-[#C85A32] transition-colors">Escrow Market</Link></li>
              <li><Link href="/horoscopes" className="hover:text-[#C85A32] transition-colors">Executive Astro</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-black dark:text-white">
              Legal & Ops
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link href="/privacy-policy" className="hover:text-[#C85A32] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/dev-log" className="hover:text-[#C85A32] transition-colors">System Log</Link></li>
              <li><span className="cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          © {currentYear} Beacon-Hub Operational Intelligence.
        </span>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
