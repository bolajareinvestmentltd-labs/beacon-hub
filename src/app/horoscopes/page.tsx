import { getDailyHoroscopes } from "@/lib/queries";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

// Static array of signs to ensure all 12 always render, even if the DB reading is missing
const ZODIAC_SIGNS = [
  { name: "Aries", date: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", date: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", date: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", date: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", date: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", date: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", date: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", date: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", date: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", date: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", date: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", date: "Feb 19 - Mar 20", element: "Water" },
];

export default async function HoroscopesPage() {
  // Fetch live readings from Neon
  const liveReadings = await getDailyHoroscopes();

  return (
    <div className="w-full max-w-5xl mx-auto py-8 md:py-12">
      
      {/* Astro Header */}
      <div className="text-center mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-[#E2725B]" size={20} />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A7B7A] dark:text-[#4A9B9A]">
            Daily Celestial Intelligence
          </span>
          <Sparkles className="text-[#E2725B]" size={20} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-playfair tracking-tight text-black dark:text-[#F9F6F0]">
          The Astro Desk
        </h1>
        <p className="mt-4 text-slate-500 max-w-lg mx-auto text-sm md:text-base">
          Macro-trends in the cosmos. Select your sign for today's strategic planetary briefing.
        </p>
      </div>

      {/* Zodiac Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {ZODIAC_SIGNS.map((sign) => {
          // Check if we have a live reading for this sign in the database
          const hasReading = liveReadings.some(r => r.sign.toLowerCase() === sign.name.toLowerCase());

          return (
            <Link 
              href={`/horoscopes/${sign.name.toLowerCase()}`} 
              key={sign.name}
              className="group relative flex flex-col items-center p-6 md:p-8 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl hover:border-[#E2725B]/50 hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#E2725B]/0 to-[#E2725B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 z-10">
                {sign.element}
              </span>
              
              <h2 className="text-xl md:text-2xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-1 z-10 group-hover:text-[#E2725B] transition-colors">
                {sign.name}
              </h2>
              
              <span className="text-[10px] md:text-xs font-medium text-slate-500 z-10">
                {sign.date}
              </span>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-1.5 z-10">
                <div className={`w-1.5 h-1.5 rounded-full ${hasReading ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  {hasReading ? 'Briefing Ready' : 'Calculating...'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}