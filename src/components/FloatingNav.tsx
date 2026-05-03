"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Tags, Sparkles } from "lucide-react";

export default function FloatingNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Desk", href: "/category/Politics", icon: Newspaper },
    { name: "Deals", href: "/deals", icon: Tags },
    { name: "Astro", href: "/horoscopes", icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="bg-[#0A1128] text-slate-400 px-6 py-3 rounded-full flex items-center gap-8 shadow-[0_20px_40px_-15px_rgba(10,17,40,0.5)] border border-[#0A1128]/50 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith("/category") && item.name === "Desk");
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-[#D4AF37]" : "hover:text-[#FAFAFA]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
