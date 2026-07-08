import { getHoroscopeBySign } from "@/lib/queries";
import AstroColumnarLayout from "@/components/AstroColumnarLayout";
import SectionHeaderComponent from "@/components/SectionHeaderComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HoroscopePage({
  params,
}: {
  params: { sign: string };
}) {
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
    compatibleSigns: Array.isArray(reading.compatibleSigns) ? reading.compatibleSigns : [],
    careerForecast:
      reading.careerForecast ||
      "Focus on steady professional growth.",
    loveForecast:
      reading.loveForecast ||
      "Relationships flourish through honest communication.",
    financialTip:
      reading.financialTip ||
      "Review your spending patterns and adjust as needed.",
    powerAffirmation:
      reading.powerAffirmation ||
      "I embrace my potential and create my destiny.",
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
            "Aries",
            "Taurus",
            "Gemini",
            "Cancer",
            "Leo",
            "Virgo",
            "Libra",
            "Scorpio",
            "Sagittarius",
            "Capricorn",
            "Aquarius",
            "Pisces",
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

