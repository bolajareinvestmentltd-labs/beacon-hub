'use client';

import { ReactNode } from 'react';

interface HoroscopeData {
  sign: string;
  reading: string;
  lunarPhase?: string;
  fortuneLevel?: number;
  luckyColor?: string;
  luckyNumber?: number;
  compatibleSigns?: string[];
  careerForecast?: string;
  loveForecast?: string;
  financialTip?: string;
  powerAffirmation?: string;
  zodiacIcon?: string;
}

interface AstroColumnarLayoutProps {
  horoscope?: HoroscopeData;
  reading?: HoroscopeData;
  children?: ReactNode;
}

export default function AstroColumnarLayout({
  horoscope,
  reading,
  children,
}: AstroColumnarLayoutProps) {
  const currentHoroscope = horoscope ?? reading;

  if (!currentHoroscope) {
    return null;
  }

  const fortuneLevel = currentHoroscope.fortuneLevel ?? 0;

  return (
    <article className="w-full max-w-4xl mx-auto py-8 md:py-12">
      {/* Premium editorial margins */}
      <div className="px-6 md:px-10 lg:px-16">
        {/* Astro Header */}
        <header className="mb-12 text-center">
          {/* Zodiac Icon */}
          {currentHoroscope.zodiacIcon && (
            <div className="text-5xl md:text-6xl mb-4 inline-block">
              {currentHoroscope.zodiacIcon}
            </div>
          )}

          {/* Sign Name - Serif */}
          <h1 className="text-5xl md:text-6xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-4">
            {currentHoroscope.sign}
          </h1>

          {/* Lunar Phase Badge */}
          {currentHoroscope.lunarPhase && (
            <div className="mb-6 inline-block">
              <span className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-medium">
                ✨ {currentHoroscope.lunarPhase}
              </span>
            </div>
          )}

          {/* Fortune Level Indicator */}
          {fortuneLevel > 0 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fortune Level</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < fortuneLevel
                        ? 'bg-[#E2725B]'
                        : 'bg-slate-300 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Accent line */}
          <div className="h-1 w-16 bg-[#E2725B] mx-auto mt-8 mb-12" />
        </header>

        {/* Main Reading - Deep Content */}
        <div className="prose-editorial max-w-none mb-12">
          <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-loose font-serif whitespace-pre-wrap">
            {currentHoroscope.reading}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-y border-slate-200 dark:border-white/10 mb-12">
          {/* Lucky Color */}
          {currentHoroscope.luckyColor && (
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 border-2 border-slate-300 dark:border-white/20"
                style={{ backgroundColor: currentHoroscope.luckyColor }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Lucky Color</span>
              <span className="text-sm font-semibold text-black dark:text-white mt-1 block">
                {currentHoroscope.luckyColor}
              </span>
            </div>
          )}

          {/* Lucky Number */}
          {currentHoroscope.luckyNumber && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#E2725B] to-[#C25845] flex items-center justify-center text-white font-black text-xl">
                {currentHoroscope.luckyNumber}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Lucky Number</span>
            </div>
          )}

          {/* Compatible Signs - First 2 */}
          {currentHoroscope.compatibleSigns && currentHoroscope.compatibleSigns.slice(0, 2).map((sign) => (
            <div key={sign} className="text-center">
              <div className="text-2xl font-black mb-3">💫</div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Compatible</span>
              <span className="text-sm font-semibold text-black dark:text-white mt-1 block">{sign}</span>
            </div>
          ))}
        </div>

        {/* Detailed Forecasts - Column Layout */}
        <div className="space-y-10 mb-12">
          {/* Career Forecast */}
          {currentHoroscope.careerForecast && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-black dark:text-white mb-4">
                💼 Career Outlook
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {currentHoroscope.careerForecast}
              </p>
            </section>
          )}

          {/* Love Forecast */}
          {currentHoroscope.loveForecast && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-black dark:text-white mb-4">
                💝 Love & Relationships
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {currentHoroscope.loveForecast}
              </p>
            </section>
          )}

          {/* Financial Tip */}
          {currentHoroscope.financialTip && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-black dark:text-white mb-4">
                💰 Financial Guidance
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {currentHoroscope.financialTip}
              </p>
            </section>
          )}
        </div>

        {/* Power Affirmation - Callout Box */}
        {currentHoroscope.powerAffirmation && (
          <div className="bg-gradient-to-r from-[#E2725B]/10 to-[#3A7B7A]/10 dark:from-[#E2725B]/5 dark:to-[#3A7B7A]/5 border-l-4 border-[#E2725B] p-6 md:p-8 my-12 rounded-r-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2725B] block mb-2">
              ✨ Power Affirmation
            </span>
            <p className="text-lg md:text-xl font-serif text-black dark:text-white italic">
              "{currentHoroscope.powerAffirmation}"
            </p>
          </div>
        )}

        {/* Bottom Compatible Signs - Full List */}
        {currentHoroscope.compatibleSigns && currentHoroscope.compatibleSigns.length > 0 && (
          <section className="py-12 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair text-black dark:text-white mb-6">
              Compatible Signs
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {currentHoroscope.compatibleSigns.map((sign) => (
                <div
                  key={sign}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-4 text-center hover:border-[#E2725B] transition-colors"
                >
                  <p className="text-sm font-bold text-black dark:text-white">{sign}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Children - Additional content */}
        {children && <div className="mt-12">{children}</div>}

        {/* Closing Accent */}
        <div className="h-1 w-16 bg-[#E2725B] mx-auto mt-12" />
      </div>
    </article>
  );
}
