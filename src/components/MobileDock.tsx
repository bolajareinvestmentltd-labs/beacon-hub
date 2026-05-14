"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Sparkles, Terminal, Menu } from "lucide-react";

export default function MobileDock() {
  const pathname = usePathname();

  // The Navigation Map
  const navItems = [
    { name: "Feed", path: "/", icon: Home },
    { name: "Deals", path: "/deals", icon: LineChart },
    { name: "Astro", path: "/horoscopes/aries", icon: Sparkles },
    { name: "Log", path: "/dev-log", icon: Terminal },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm md:hidden">
      <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          // Logic to check if we are currently on this page
          const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`relative p-2 transition-all duration-300 ${isActive ? "text-[#E2725B]" : "text-slate-400 hover:text-black dark:hover:text-white"}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {/* The little glowing dot indicator for active tabs */}
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E2725B] rounded-full shadow-[0_0_8px_#E2725B]"></span>
              )}
            </Link>
          );
        })}
        
        {/* The Hamburger Menu - Can be wired to a mobile sidebar later */}
        <button className="p-2 text-slate-400 hover:text-black dark:hover:text-white transition-colors">
          <Menu size={22} />
        </button>

      </div>
    </div>
  );
}