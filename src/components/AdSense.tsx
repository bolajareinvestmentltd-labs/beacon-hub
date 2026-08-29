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

  const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID?.trim();
  const isValidClientId = Boolean(PUB_ID && !PUB_ID.includes('xxxxxxxx'));

  useEffect(() => {
    if (typeof window === 'undefined' || !isValidClientId) return;

    let tries = 0;

    const pushAd = () => {
      if (!adRef.current) return;

      const width = adRef.current.offsetWidth || adRef.current.parentElement?.offsetWidth || 0;
      if (width <= 0) {
        tries += 1;
        if (tries < 3) {
          window.setTimeout(pushAd, 200);
        } else {
          console.warn(`[Beacon Hub Ad Engine] Slot ${adSlot} has no width available after retries.`);
          setAdFailed(true);
        }
        return;
      }

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

    const timer = setTimeout(pushAd, 150);
    return () => clearTimeout(timer);
  }, [pathname, adSlot, isValidClientId]);

  if (!isValidClientId) {
    if (typeof window !== 'undefined') {
      console.warn('[Beacon Hub AdSense] Skipping ad rendering because NEXT_PUBLIC_ADSENSE_PUB_ID is missing or invalid.');
    }
    return null;
  }

  if (adFailed) return null;

  const dimensions = AD_DIMENSIONS[adFormat] || AD_DIMENSIONS.auto;

  return (
    <div className={`w-full flex flex-col items-center overflow-hidden my-4 ${className}`}>
      {label && (
        <div className="mb-2 flex w-full items-center justify-between gap-3 rounded-full border border-border/50 bg-background/70 px-3 py-1.5 text-[9px] font-sans font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          <span>{label}</span>
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[8px]">Sponsored</span>
        </div>
      )}

      <div
        className="relative flex min-h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-slate-100/80 via-white to-slate-50/70 shadow-sm backdrop-blur dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-900"
        style={{ ...dimensions, ...style, maxWidth: fullWidth ? '100%' : '100%' }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: fullWidth ? '100%' : '100%',
            maxWidth: '100%',
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