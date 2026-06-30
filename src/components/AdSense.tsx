'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'responsive';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

const AD_DIMENSIONS: Record<string, React.CSSProperties> = {
  rectangle: { minHeight: '250px', minWidth: '300px' },
  vertical: { minHeight: '600px', minWidth: '300px' },
  horizontal: { minHeight: '90px', minWidth: '728px' },
  auto: { minHeight: '100px', minWidth: '100px' },
  responsive: { minHeight: '150px', width: '100%' },
};

export default function AdSense({
  adSlot,
  adFormat = 'responsive',
  fullWidth = false,
  className = '',
  style,
  label = 'Advertisement',
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pathname = usePathname();
  const [adFailed, setAdFailed] = useState(false);

  // Pulls securely from your .env file, falls back to placeholder safely
  const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-xxxxxxxxxxxxxxxx';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pushAd = () => {
      if (!adRef.current) return;

      // CRITICAL NEXT.JS SPA FAILSAFE: 
      // If Google already injected an iframe into this specific DOM node, abort!
      const isFilled = adRef.current.getAttribute('data-adsbygoogle-status');
      if (isFilled === 'done') return;

      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (err) {
        console.warn(`[Beacon Hub Ad Engine] Slot ${adSlot} failed to hydrate:`, err);
        setAdFailed(true);
      }
    };

    // 150ms debounce gives Next.js App Router time to finish its layout paint
    const timer = setTimeout(pushAd, 150);
    return () => clearTimeout(timer);
  }, [pathname, adSlot]);

  if (adFailed) return null;

  const dimensions = AD_DIMENSIONS[adFormat] || AD_DIMENSIONS.auto;

  return (
    <div className={`w-full flex flex-col items-center overflow-hidden my-2 ${className}`}>
      {label && (
        <span className="text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-muted-foreground mb-1.5 block select-none">
          {label}
        </span>
      )}

      <div 
        className="relative flex items-center justify-center bg-card/40 border border-border/40 rounded-lg overflow-hidden w-full"
        style={{ ...dimensions, ...style }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: fullWidth ? '100%' : 'auto',
          }}
          data-ad-client={PUB_ID}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidth ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}