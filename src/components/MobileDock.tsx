"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileDock() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const desks = [
    "Naija Politics",
    "Global Politics",
    "Tech & Startups",
    "Wealth & Real Estate",
    "Sports",
    "Culture",
  ];

  return (
    <>
      {/* THE SLIDE-UP DRAWER */}
      {/* Background Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      
      {/* Drawer Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-6 pb-24">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
          <h3 className="font-serif text-2xl font-black text-slate-900 mb-6">All Desks</h3>
          <ul className="flex flex-col gap-4">
            {desks.map((desk) => (
              <li key={desk}>
                <Link 
                  href={`/category/${desk.replace(/ & /g, '-').replace(/ /g, '-')}`}
                  onClick={() => setIsDrawerOpen(false)}
                  className="block text-lg font-medium text-slate-600 hover:text-slate-900 border-b border-slate-100 pb-3"
                >
                  {desk}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* THE FLOATING PILL DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[320px] md:hidden">
        <div className="bg-slate-900 text-white rounded-full px-6 py-4 shadow-2xl flex justify-between items-center border border-slate-700">
          
          <Link href="/" onClick={() => setIsDrawerOpen(false)} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[9px] uppercase tracking-wider font-bold">Home</span>
          </Link>

          <Link href="/category/Astro-Desk" onClick={() => setIsDrawerOpen(false)} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <span className="text-[9px] uppercase tracking-wider font-bold">Astro</span>
          </Link>

          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex flex-col items-center gap-1 opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span className="text-[9px] uppercase tracking-wider font-bold">Desks</span>
          </button>

        </div>
      </div>
    </>
  );
}