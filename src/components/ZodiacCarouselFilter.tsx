'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ZodiacSign {
  name: string;
  date: string;
  element: string;
  icon?: string; // Unicode emoji or Lucide icon name
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', element: 'Fire', icon: '♈' },
  { name: 'Taurus', date: 'Apr 20 - May 20', element: 'Earth', icon: '♉' },
  { name: 'Gemini', date: 'May 21 - Jun 20', element: 'Air', icon: '♊' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', element: 'Water', icon: '♋' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', element: 'Fire', icon: '♌' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', element: 'Earth', icon: '♍' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', element: 'Air', icon: '♎' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', element: 'Water', icon: '♏' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', element: 'Fire', icon: '♐' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', element: 'Earth', icon: '♑' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', element: 'Air', icon: '♒' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', element: 'Water', icon: '♓' },
];

interface ZodiacCarouselFilterProps {
  selectedSign?: string;
  onSignSelect?: (sign: string) => void;
}

export default function ZodiacCarouselFilter({
  selectedSign,
  onSignSelect,
}: ZodiacCarouselFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full py-6 md:py-12">
      {/* Carousel Container with scroll buttons */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scrollable Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-4 px-0 md:px-8 no-scrollbar"
        >
          {ZODIAC_SIGNS.map((sign) => (
            <Link
              key={sign.name}
              href={`/horoscopes/${sign.name.toLowerCase()}`}
              className={`flex-shrink-0 group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl transition-all duration-300 cursor-pointer
                ${
                  selectedSign?.toLowerCase() === sign.name.toLowerCase()
                    ? 'bg-[#E2725B] text-white shadow-lg scale-105'
                    : 'bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 text-black dark:text-white hover:border-[#E2725B] hover:shadow-lg'
                }`}
              onClick={() => onSignSelect?.(sign.name.toLowerCase())}
            >
              {/* Icon */}
              <span className="text-3xl md:text-4xl mb-2">{sign.icon}</span>

              {/* Sign Name */}
              <h3 className="text-base md:text-lg font-bold font-playfair whitespace-nowrap">{sign.name}</h3>

              {/* Date Range */}
              <span className="text-[10px] md:text-xs font-medium opacity-75 whitespace-nowrap mt-1">
                {sign.date}
              </span>

              {/* Element Badge */}
              <div className="mt-2 px-2 py-0.5 bg-white/20 rounded-full">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider opacity-90">
                  {sign.element}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
