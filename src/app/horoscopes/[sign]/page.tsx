import React from "react";
import { db } from "@/db";
import { astrology } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import Link from "next/link";

interface PageProps {
  params: Promise<{ sign: string }>;
}

export default async function HoroscopePage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentSign = resolvedParams.sign.toLowerCase();
  const todayStr = new Date().toISOString().split("T")[0];

  // Live indexed query lookup for today's specific performance matrix block
  const records = await db
    .select()
    .from(astrology)
    .where(
      and(
        eq(astrology.sign, currentSign),
        eq(astrology.date, todayStr)
      )
    )
    .orderBy(desc(astrology.createdAt))
    .limit(1);

  const reading = records[0];

  // Capitalize current sign name for high-end editorial display headings
  const formattedSign = currentSign.charAt(0).toUpperCase() + currentSign.slice(1);

  // Fallback UI State matching your exact placeholder experience if data is pending sync
  if (!reading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#C85A32] uppercase font-mono block">
            System Synchronization Incomplete
          </span>
          <p className="text-lg md:text-xl font-serif italic text-slate-400 leading-relaxed">
            "Planetary alignments are still being processed for this sign. Check back at the next moon phase."
          </p>
          <Link 
            href="/deals" 
            className="inline-block border border-white/10 hover:border-[#C85A32] text-xs font-mono font-bold tracking-widest uppercase px-6 py-3 text-slate-300 transition-colors duration-300"
          >
            Return to Desk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans selection:bg-[#C85A32] selection:text-white">
      {/* Top Editorial Utility Bar */}
      <div className="border-b border-white/5 px-6 py-4 flex justify-between items-center text-[10px] font-mono tracking-widest text-slate-500">
        <div>ORBITAL INDEX: SYSTEM_ACTIVE</div>
        <div className="uppercase">LOG_DATE: {reading.date}</div>
      </div>

      {/* Main Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-53px)]">
        
        {/* Left Aspect: Strategic Mindset Reading */}
        <section className="lg:col-span-7 p-6 md:p-12 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="space-y-8 max-w-2xl">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C85A32] uppercase font-mono block mb-1">
                Executive Profile Analysis
              </span>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-white font-medium">
                {formattedSign}
              </h1>
            </div>

            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-sm">
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">
                Current Anchor Core:
              </span>
              <span className="text-xs font-mono font-bold text-[#C85A32]">
                {reading.focusToken}
              </span>
            </div>

            {/* Structured Long-Form Content Box */}
            <div className="font-serif text-base md:text-lg leading-relaxed text-slate-300 space-y-6 pt-4 border-t border-white/5 whitespace-pre-line">
              {reading.reading}
            </div>
          </div>

          <div className="pt-12">
            <Link 
              href="/deals" 
              className="text-xs font-mono tracking-wider text-slate-500 hover:text-[#C85A32] transition-colors"
            >
              &larr; Exit Terminal Feed
            </Link>
          </div>
        </section>

        {/* Right Aspect: Vector Performance Dashboard */}
        <section className="lg:col-span-5 bg-[#101010] p-6 md:p-12 lg:p-16 flex flex-col justify-between font-mono">
          <div className="space-y-12 w-full">
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Daily Energy Metrics
              </h2>
              <p className="text-[11px] text-slate-500 font-sans mt-1">
                Your personal alignment and daily energy forecast.
              </p>
            </div>

            {/* Metrics Graph Stack */}
            <div className="space-y-8">
              {/* Metric 1: Focus */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">MENTAL CLARITY & FOCUS</span>
                  <span className="text-[#C85A32] font-bold">{reading.metricFocus}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                  <div 
                    className="bg-[#C85A32] h-full transition-all duration-1000 ease-out"
                    style={{ width: `${reading.metricFocus}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Risk Posture */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">CAREER & LUCK</span>
                  <span className="text-[#C85A32] font-bold">{reading.metricRisk}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                  <div 
                    className="bg-[#C85A32] h-full transition-all duration-1000 ease-out"
                    style={{ width: `${reading.metricRisk}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">ENERGY & MOMENTUM</span>
                  <span className="text-[#C85A32] font-bold">{reading.metricVelocity}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                  <div 
                    className="bg-[#C85A32] h-full transition-all duration-1000 ease-out"
                    style={{ width: `${reading.metricVelocity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Sign-off Footer */}
          <div className="border-t border-white/5 pt-6 mt-12 text-[10px] text-slate-600 space-y-1">
            <div>FIRMWARE: JCLS• CORE_V1.2</div>
            <div>DECRYPTED METRIC FRAME WORK OPERATING SUCCESSFUL.</div>
          </div>
        </section>

      </div>
    </main>
  );
}
