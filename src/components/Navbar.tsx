"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin-slow group-hover:border-indigo-400 transition-colors"></div>
          <span className="text-xl font-bold tracking-tight text-white">
            BEACON<span className="text-indigo-500">HUB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
          <Link href="/category/Politics" className="hover:text-indigo-400 transition-colors">Politics</Link>
          <Link href="/category/Tech" className="hover:text-indigo-400 transition-colors">Tech</Link>
          <Link href="/horoscopes" className="hover:text-indigo-400 transition-colors">Astrology</Link>
          <Link href="/deals" className="hover:text-indigo-400 transition-colors">AySmart Deals</Link>
          <Link href="/dev-log" className="hover:text-indigo-400 transition-colors">Dev Log</Link>
        </nav>

        {/* Desktop Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Subscribe
          </button>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 absolute w-full left-0 shadow-xl">
          <nav className="flex flex-col px-4 py-6 gap-4 text-base font-medium text-slate-300">
            <Link href="/category/Politics" onClick={() => setIsOpen(false)} className="hover:text-indigo-400">Politics</Link>
            <Link href="/category/Tech" onClick={() => setIsOpen(false)} className="hover:text-indigo-400">Tech</Link>
            <Link href="/horoscopes" onClick={() => setIsOpen(false)} className="hover:text-indigo-400">Astrology</Link>
            <Link href="/deals" onClick={() => setIsOpen(false)} className="hover:text-indigo-400">AySmart Deals</Link>
            <Link href="/dev-log" onClick={() => setIsOpen(false)} className="hover:text-indigo-400">Dev Log</Link>
            <button className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-semibold mt-4 w-full text-center">
              Subscribe
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
