import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Moon, Sun, Compass } from "lucide-react";

const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

interface PageProps {
  params: Promise<{ sign: string }>;
}

// Function to fetch dynamic horoscope from Gemini directly via REST API
async function getDailyHoroscope(sign: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a professional astrologer. Write a daily horoscope for ${sign}. 
  Return ONLY a raw JSON object with no markdown formatting, no code blocks, and no extra text.
  Format: {"overview": "3 sentences about their career and alignment today.", "lucky_number": "A number between 1 and 99", "power_color": "A highly specific, creative color name like 'Alabaster Gold' or 'Midnight Obsidian'", "trajectory": "1 sentence on professional trajectory", "synergy": "1 sentence on relational synergy"}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
      // CACHE THIS REQUEST FOR 24 HOURS (86400 seconds)
      next: { revalidate: 86400 } 
    });

    const data = await res.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean any accidental markdown the AI might include
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to fetch horoscope:", error);
    return null;
  }
}

export default async function HoroscopeSignPage({ params }: PageProps) {
  const resolvedParams = await params;
  const sign = resolvedParams.sign.toLowerCase();

  if (!ZODIAC_SIGNS.includes(sign)) {
    notFound();
  }

  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);
  const horoscope = await getDailyHoroscope(signName);

  // Fallback text if the AI API fails
  const fallback = {
    overview: "The celestial alignments are currently shifting. Focus on structural dynamics and strategic restraint today.",
    lucky_number: "7",
    power_color: "Neutral Gray",
    trajectory: "Keep negotiations transparent.",
    synergy: "Maintain clear communication channels."
  };

  const data = horoscope || fallback;

  return (
    <main className="min-h-screen bg-[#F9F6F0] dark:bg-[#121212] text-[#121212] dark:text-[#F9F6F0] pt-40 pb-24 px-4 transition-colors duration-300 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-grow">
        
        <Link href="/horoscopes" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#C85A32] mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Constellations
        </Link>

        <div className="border-b-4 border-[#121212] dark:border-[#F9F6F0] pb-8 mb-12">
          <div className="flex items-center gap-3 text-[#C85A32] font-mono text-xs uppercase tracking-[0.2em] mb-3">
            <Sparkles size={16} /> Daily Cosmic Intelligence
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tight uppercase">
            {signName}
          </h1>
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider mt-2">
            Alignment for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <Compass className="text-[#C85A32]" size={20} /> Overview & Outlook
            </h3>
            <p className="font-sans text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {data.overview}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl flex-1">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Lucky Number</span>
              <span className="font-serif text-3xl font-black text-[#C85A32]">{data.lucky_number}</span>
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl flex-1">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Power Color</span>
              <span className="font-sans text-sm font-bold tracking-wide uppercase">{data.power_color}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <Sun size={14} className="text-[#C85A32]" /> Professional Trajectory
            </h4>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {data.trajectory}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <Moon size={14} className="text-indigo-500" /> Relational Synergy
            </h4>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {data.synergy}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}