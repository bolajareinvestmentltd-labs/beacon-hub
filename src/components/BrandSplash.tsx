'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function BrandSplash() {
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storageKey = 'beacon-hub-splash-seen';
    if (sessionStorage.getItem(storageKey)) {
      splashRef.current?.setAttribute('data-skip', 'true');
      return;
    }

    sessionStorage.setItem(storageKey, 'true');
  }, []);

  return (
    <div ref={splashRef} className="brand-splash fixed inset-0 z-[100] flex items-center justify-center bg-[#07151C] px-6 text-white">
      <div className="text-center">
        <div className="brand-splash-mark mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/10 p-4 shadow-[0_0_80px_rgba(60,214,200,.28)] ring-1 ring-white/20">
          <Image src="/logo-192.png" alt="Beacon Hub" width={192} height={192} priority className="h-full w-full rounded-[1.4rem] object-cover" />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.42em]">Beacon Hub</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D1F36B]">See the signal clearly</p>
        <div className="app-gradient mx-auto mt-6 h-1 w-24 rounded-full" />
      </div>
    </div>
  );
}