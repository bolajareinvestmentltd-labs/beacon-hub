'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DatePickerProps {
  currentDate: Date;
}

export function HoroscopeDatePicker({ currentDate }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayDate, setDisplayDate] = useState<Date>(currentDate);

  useEffect(() => {
    setDisplayDate(currentDate);
  }, [currentDate]);

  const handlePreviousDay = () => {
    const newDate = new Date(displayDate);
    newDate.setDate(newDate.getDate() - 1);
    updateDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(displayDate);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    // Prevent selecting future dates beyond today
    if (newDate <= today) {
      updateDate(newDate);
    }
  };

  const handleToday = () => {
    updateDate(new Date());
  };

  const updateDate = (newDate: Date) => {
    const dateStr = newDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const params = new URLSearchParams(searchParams);
    params.set('date', dateStr);
    router.push(`?${params.toString()}`);
    setDisplayDate(newDate);
  };

  const today = new Date();
  const isToday =
    displayDate.toDateString() === today.toDateString();
  const isFuture = displayDate > today;

  return (
    <div className="flex items-center justify-center gap-4 py-6 mb-8 border-b border-black/5 dark:border-white/5">
      <button
        onClick={handlePreviousDay}
        className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        title="Previous day"
      >
        <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
      </button>

      <div className="flex flex-col items-center min-w-[200px]">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
          Reading Date
        </span>
        <span className="text-lg md:text-xl font-semibold text-black dark:text-[#F9F6F0]">
          {displayDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      <button
        onClick={handleNextDay}
        disabled={isFuture}
        className={`p-2 rounded-lg transition-colors ${
          isFuture
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-slate-100 dark:hover:bg-white/10'
        }`}
        title={isFuture ? 'Cannot view future readings' : 'Next day'}
      >
        <ChevronRight
          size={20}
          className={
            isFuture
              ? 'text-slate-300 dark:text-slate-700'
              : 'text-slate-600 dark:text-slate-400'
          }
        />
      </button>

      {!isToday && (
        <button
          onClick={handleToday}
          className="ml-2 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E2725B] hover:bg-[#E2725B]/10 rounded-lg transition-colors"
        >
          Today
        </button>
      )}
    </div>
  );
}
