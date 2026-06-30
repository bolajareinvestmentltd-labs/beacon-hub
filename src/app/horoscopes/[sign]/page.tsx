<<<<<<< HEAD
import { getHoroscopeBySign } from "@/lib/queries";
import AstroColumnarLayout from "@/components/AstroColumnarLayout";
import SectionHeaderComponent from "@/components/SectionHeaderComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HoroscopePage({ params }: { params: { sign: string } }) {
  // Fetch the live reading from Neon
  const reading = await getHoroscopeBySign(params.sign);

  if (!reading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4">
        <Link 
          href="/horoscopes" 
          className="flex items-center gap-2 text-[#E2725B] hover:text-[#E2725B]/80 transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={18} />
          Back to All Signs
        </Link>

        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 font-playfair text-lg italic">
            The cosmic intelligence is still computing this reading... please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  // Format reading for the AstroColumnarLayout component
  const formattedReading = {
    sign: reading.sign,
    zodiacSymbol: getZodiacSymbol(reading.sign),
    dateRange: getDateRangeForSign(reading.sign),
    reading: reading.reading || "",
    lunarPhase: reading.lunarPhase || "Unknown Phase",
    fortuneLevel: reading.fortuneLevel || 3,
    luckyColor: reading.luckyColor || "Silver",
    luckyNumber: reading.luckyNumber || 7,
    compatibleSigns: reading.compatibleSigns || [],
    careerForecast: reading.careerForecast || "Focus on steady professional growth.",
    loveForecast: reading.loveForecast || "Relationships flourish through honest communication.",
    financialTip: reading.financialTip || "Review your spending patterns and adjust as needed.",
    powerAffirmation: reading.powerAffirmation || "I embrace my potential and create my destiny.",
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-slate-950">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 pt-6 md:pt-8">
        <Link 
          href="/horoscopes" 
          className="inline-flex items-center gap-2 text-[#E2725B] hover:text-[#E2725B]/80 transition-colors font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          Back to Astro Desk
        </Link>
      </div>

      {/* MAIN HOROSCOPE READING */}
      <AstroColumnarLayout reading={formattedReading} />

      {/* EXPLORE OTHER SIGNS */}
      <div className="max-w-3xl mx-auto px-4 py-16 border-t border-slate-200 dark:border-white/10">
        <SectionHeaderComponent
          eyebrow="EXPLORE"
          title="Other Zodiac Signs"
          description="Discover cosmic intelligence for all 12 signs"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
          ].map((sign) => (
            <Link
              key={sign}
              href={`/horoscopes/${sign.toLowerCase()}`}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 ${
                sign.toLowerCase() === params.sign.toLowerCase()
                  ? "bg-[#E2725B] text-white border-[#E2725B]"
                  : "border-slate-200 dark:border-white/10 hover:border-[#E2725B] hover:shadow-lg"
              }`}
            >
              <span className="text-xs md:text-sm font-bold text-center">
                {sign}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

// Helper functions
function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };
  return symbols[sign] || "✦";
}

function getDateRangeForSign(sign: string): string {
  const dateRanges: Record<string, string> = {
    Aries: "Mar 21 - Apr 19",
    Taurus: "Apr 20 - May 20",
    Gemini: "May 21 - Jun 20",
    Cancer: "Jun 21 - Jul 22",
    Leo: "Jul 23 - Aug 22",
    Virgo: "Aug 23 - Sep 22",
    Libra: "Sep 23 - Oct 22",
    Scorpio: "Oct 23 - Nov 21",
    Sagittarius: "Nov 22 - Dec 21",
    Capricorn: "Dec 22 - Jan 19",
    Aquarius: "Jan 20 - Feb 18",
    Pisces: "Feb 19 - Mar 20",
  };
  return dateRanges[sign] || "Unknown";
}
=======
import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Briefcase, Wallet, ShieldPlus, Orbit } from "lucide-react";

const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

export const revalidate = 600;

export default async function HoroscopePage({ params }: { params: any }) {
  // Unwrap parameters safely for strict Next.js routing
  const { sign: rawSign } = await Promise.resolve(params);
  const sign = rawSign.toLowerCase();
  
  if (!ZODIAC_SIGNS.includes(sign)) return notFound();

  // 1. Connect to Neon Vault
  const sql = neon(process.env.DATABASE_URL || "");
  let readingData = null;
  let readingDate = new Date();

  // 2. Fetch the latest intelligence for this specific sign
  try {
    const result = await sql`
      SELECT content, created_at 
      FROM horoscopes 
      WHERE sign = ${sign} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (result.length > 0) {
      // Parse the JSON string stored by our future cron job
      readingData = typeof result[0].content === 'string' ? JSON.parse(result[0].content) : result[0].content;
      readingDate = new Date(result[0].created_at);
    }
  } catch (err) {
    console.error("Database fetch failed", err);
  }

  // 3. Fallback matrix if the database is empty or still synchronizing
  const insights = readingData || [
    { title: "Romantic Alignment & Love", iconName: "Heart", text: "Awaiting planetary transmission. Database synchronization pending." },
    { title: "Executive Career Strategy", iconName: "Briefcase", text: "Awaiting planetary transmission. Database synchronization pending." },
    { title: "Capital & Wealth Management", iconName: "Wallet", text: "Awaiting planetary transmission. Database synchronization pending." },
    { title: "Vitality & Health Metrics", iconName: "ShieldPlus", text: "Awaiting planetary transmission. Database synchronization pending." },
    { title: "Ruling Astral Intelligence", iconName: "Orbit", text: "Awaiting planetary transmission. Database synchronization pending." }
  ];

  // Map the string icon names from the database to actual Lucide React components
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "Heart": return <Heart className="text-[#C85A32]" size={18} />;
      case "Briefcase": return <Briefcase className="text-[#C85A32]" size={18} />;
      case "Wallet": return <Wallet className="text-[#C85A32]" size={18} />;
      case "ShieldPlus": return <ShieldPlus className="text-[#C85A32]" size={18} />;
      case "Orbit": return <Orbit className="text-[#C85A32]" size={18} />;
      default: return <Orbit className="text-[#C85A32]" size={18} />;
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] pt-28 pb-32">
      {/* Header Profile */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4 border-b border-black/5 dark:border-white/5 pb-12">
        <Link href="/horoscopes" className="inline-flex items-center text-xs font-mono font-bold tracking-widest uppercase text-slate-500 hover:text-[#C85A32] mb-4 transition-colors">
          <ArrowLeft size={14} className="mr-2" />
          All Signs
        </Link>
        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter uppercase text-black dark:text-[#FDFDFB]">
          {sign}
        </h1>
        <p className="text-xs font-mono text-[#C85A32] uppercase tracking-[0.3em] font-bold">
          Executive Daily Briefing • {readingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Dynamic Multi-Column Matrix mapped from Database */}
      <div className="max-w-4xl mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {insights.map((item: any, index: number) => (
          <section 
            key={index} 
            className={`p-6 rounded-sm bg-slate-50 dark:bg-[#121214] border border-black/5 dark:border-white/5 space-y-3 transition-all hover:border-black/20 dark:hover:border-white/10 ${
              index === 4 ? "md:col-span-2 bg-gradient-to-r from-slate-50 to-orange-50/30 dark:from-[#121214] dark:to-[#1a1412]" : ""
            }`}
          >
            <div className="flex items-center gap-2.5 border-b border-black/5 dark:border-white/5 pb-2">
              {getIcon(item.iconName)}
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                {item.title}
              </h3>
            </div>
            <p className="font-serif text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.text}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
>>>>>>> 73f3f1d2fbbee024e1f7160accdfdd2e8eae7d6c
