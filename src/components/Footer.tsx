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