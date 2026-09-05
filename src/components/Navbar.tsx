"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Terminal } from "lucide-react";
import { TAXONOMY } from "@/config/taxonomy";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="site-navbar fixed top-0 left-0 right-0 z-50 w-screen border-b border-border/70 bg-card/95 shadow-sm backdrop-blur-md transition-colors duration-300">

      {/* TOP TIER: Logo Left, Utilities Right (NO HAMBURGER) */}
      <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto w-full">

        {/* Left: BH Logo firmly anchored */}
        <div className="flex items-center whitespace-nowrap">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Beacon Hub logo" className="h-10 w-10 object-cover rounded-full" />
          </Link>
        </div>

        {/* Right: Meta & CTA */}
        <div className="flex items-center justify-end space-x-2 md:space-x-4">
          <ThemeSwitcher />

          <button className="text-foreground transition-colors hover:text-primary md:hidden">
            <Search size={18} strokeWidth={2} />
          </button>

          <Link
            href="/dev-log"
            className="flex items-center gap-1 rounded-sm border border-border/70 bg-muted/70 px-1.5 py-1 text-[10px] font-mono text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Terminal size={12} className="text-primary" />
            <span className="hidden lg:inline font-bold tracking-widest uppercase">v1.2.0</span>
          </Link>

          <button className="text-[10px] md:text-xs font-bold uppercase tracking-wider border border-primary text-primary px-3 py-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <span className="md:hidden">Get App</span>
            <span className="hidden md:inline">Subscribe</span>
          </button>
        </div>
      </div>

      {/* BOTTOM TIER: Horizontal Categories Array */}
      <div className="w-full border-t border-border/60 bg-muted/90">
        <div className="max-w-7xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="flex items-center px-4 h-12">
            {TAXONOMY.primary.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <li key={cat.name} className="flex-shrink-0">
                  <Link
                    href={cat.href}
                    className={`block px-4 py-3 text-[12px] md:text-[13px] font-bold tracking-wide transition-colors border-b-[3px] ${
                      isActive
                        ? "text-primary border-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    </header>
  );
}
