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
    <div ref={splashRef} className="brand-splash fixed inset-0 z-[100] flex items-center justify-center bg-[#070918] px-6 text-white">
      <div className="text-center">
        <Image src="/beacon-hub-lockup.svg" alt="Beacon Hub, News ContextX" width={768} height={768} priority unoptimized className="mx-auto h-auto w-full max-w-[min(76vw,34rem)]" />
      </div>
    </div>
  );
}