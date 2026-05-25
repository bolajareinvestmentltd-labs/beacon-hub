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
