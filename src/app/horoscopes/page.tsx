import React from "react";
import Link from "next/link";

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function AstrologyDirectory() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans selection:bg-[#C85A32] selection:text-white p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#C85A32] uppercase font-mono block">
            Daily Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white font-medium">
            Executive Astrology
          </h1>
          <p className="text-slate-400 font-mono text-xs max-w-lg mx-auto leading-relaxed">
            Select your alignment for today's strategic outlook, career focus, and energy momentum.
          </p>
        </div>

        {/* 12-Sign Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {signs.map((sign) => (
            <Link 
              key={sign} 
              href={`/horoscopes/${sign.toLowerCase()}`}
              className="group border border-white/5 bg-[#101010] p-6 text-center hover:border-[#C85A32] transition-colors duration-300"
            >
              <div className="text-lg font-serif text-slate-300 group-hover:text-white transition-colors">
                {sign}
              </div>
              <div className="text-[9px] font-mono tracking-widest text-slate-600 mt-2 uppercase group-hover:text-[#C85A32] transition-colors">
                Read Outlook &rarr;
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
