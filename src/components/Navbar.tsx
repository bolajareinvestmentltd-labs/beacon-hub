import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#FAFAFA] border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded border-2 border-[#0A1128] flex items-center justify-center group-hover:bg-[#0A1128] transition-colors">
            <span className="font-playfair font-black text-[#0A1128] group-hover:text-[#FAFAFA] transition-colors">B</span>
          </div>
          <span className="text-2xl font-black text-[#0A1128] tracking-tight">
            BEACON<span className="text-slate-400 font-light">HUB</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-bold text-[#0A1128] uppercase tracking-wider">
            <Link href="/category/Politics" className="hover:text-[#D4AF37] transition-colors">Politics</Link>
            <Link href="/category/Tech" className="hover:text-[#D4AF37] transition-colors">Tech</Link>
            <Link href="/deals" className="hover:text-[#D4AF37] transition-colors">Deals</Link>
            <Link href="/horoscopes" className="hover:text-[#D4AF37] transition-colors">Astro</Link>
          </div>
          
          <Link href="#subscribe" className="bg-[#D4AF37] hover:bg-[#b89529] text-[#0A1128] px-6 py-2.5 rounded text-sm font-bold uppercase tracking-widest transition-colors shadow-sm">
            Join Circle
          </Link>
        </div>

      </div>
    </nav>
  );
}
