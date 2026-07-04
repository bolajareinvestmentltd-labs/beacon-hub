import * as queries from '@/lib/queries';
import ZodiacCarouselFilter from "@/components/ZodiacCarouselFilter";
import SectionHeaderComponent from "@/components/SectionHeaderComponent";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

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
const fetchHoroscopes =
    queries.getDailyHoroscopes ??
    queries.getHoroscopes ??
    queries.getAllHoroscopes ??
    (async () => []);
  const horoscopes = await fetchHoroscopes();

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4">
      <div className="text-center mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="text-[#E2725B]" size={24} />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A7B7A] dark:text-[#4A9B9A]">
            Daily Celestial Intelligence
          </span>
          <Sparkles className="text-[#E2725B]" size={24} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black font-playfair tracking-tight text-black dark:text-[#F9F6F0] mb-6">
          The Astro Desk
        </h1>
        <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Macro-trends in the cosmos. Select your sign for today's strategic planetary briefing from our master astrologers.
        </p>
        <div className="h-1 w-20 bg-[#E2725B] mx-auto mt-8" />
      </div>

      <div className="mb-12">
        <ZodiacCarouselFilter />
      </div>

      <div className="mb-16">
        <SectionHeaderComponent
          eyebrow="SELECT YOUR SIGN"
          title="Today's Readings"
          description="Comprehensive daily guidance for all 12 zodiac signs"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {ZODIAC_SIGNS.map((sign) => {
            const hasReading = horoscopes.some(
              (r: any) => r.sign?.toLowerCase() === sign.name.toLowerCase()
            );
            const statusClasses = hasReading
              ? 'text-green-600 dark:text-green-400'
              : 'text-amber-600 dark:text-amber-400';

            return (
              <Link
                href={`/horoscopes/${sign.name.toLowerCase()}`}
                key={sign.name}
                className="group relative flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-white/2 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-[#E2725B] hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#E2725B]/0 to-[#E2725B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3 z-10">
                  {sign.element}
                </span>
                <h2 className="text-2xl md:text-3xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-1 z-10 group-hover:text-[#E2725B] transition-colors text-center">
                  {sign.name}
                </h2>
                <span className="text-[10px] md:text-xs font-medium text-slate-700 dark:text-slate-300 z-10 text-center">
                  {sign.date}
                </span>
                <div className="mt-5 flex items-center gap-2 z-10">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      hasReading ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                  />
                  <span
                    className={`text-[9px] uppercase tracking-wider font-bold ${statusClasses}`}
                  >
                    {hasReading ? 'Ready' : 'Computing...'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <svg
                    className="w-5 h-5 text-[#E2725B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold font-playfair text-black dark:text-white mb-3">
              ✨ Deep Readings
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Comprehensive 150+ word daily horoscopes crafted by master astrologers, featuring career, love, and financial guidance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-playfair text-black dark:text-white mb-3">
              🌙 Lunar Phases
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Each reading accounts for current lunar phases and planetary positions to enhance the accuracy of your forecast.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-playfair text-black dark:text-white mb-3">
              💫 Fortune & Luck
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Discover your lucky colors, numbers, and compatible signs. Get daily affirmations to guide your path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

