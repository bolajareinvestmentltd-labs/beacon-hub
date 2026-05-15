"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tags, Sparkles, Menu } from "lucide-react";

export default function MobileDock() {
  const pathname = usePathname();

  // The Navigation Map (Upgraded with the Tags icon for Deals)
  const navItems = [
    { name: "Feed", path: "/", icon: Home },
    { name: "Deals", path: "/deals", icon: Tags },
    { name: "Astro", path: "/horoscopes/aries", icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm md:hidden">
      <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl px-6 py-3 flex items-center justify-between shadow-2xl">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`relative flex flex-col items-center gap-1 transition-all duration-300 w-12 ${isActive ? "text-[#E2725B]" : "text-slate-400 hover:text-black dark:hover:text-white"}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {/* Native App Label */}
              <span className={`text-[9px] font-bold tracking-wider uppercase ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.name}
              </span>
              
              {/* Glowing Dot Indicator */}
              {isActive && (
                <span className="absolute -top-1 right-1 w-1.5 h-1.5 bg-[#E2725B] rounded-full shadow-[0_0_8px_#E2725B]"></span>
              )}
            </Link>
          );
        })}
        
        {/* The Hamburger Menu */}
        <button className="flex flex-col items-center gap-1 w-12 text-slate-400 hover:text-black dark:hover:text-white transition-colors">
          <Menu size={20} />
          <span className="text-[9px] font-bold tracking-wider uppercase opacity-70">Menu</span>
        </button>

      </div>
    </div>
  );
}