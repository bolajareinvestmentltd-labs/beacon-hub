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
