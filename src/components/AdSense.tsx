'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidth?: boolean;
  className?: string;
}

/**
 * AdSense Component
 * 
 * Usage:
 * <AdSense adSlot="1234567890" adFormat="rectangle" />
 * 
 * Note: Replace 'pub-xxxxxxxxxxxxxxxx' with your actual Google AdSense Publisher ID
 * Replace ad slot numbers with your actual ad slot IDs from Google AdSense
 */
export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidth = false,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Push ads to the Google AdSense script queue
      if (typeof window !== 'undefined' && 'adsbygoogle' in window) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}
      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidth}
    />
  );
}
