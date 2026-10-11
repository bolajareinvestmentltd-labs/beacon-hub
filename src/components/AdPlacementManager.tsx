'use client';

import type { ReactNode } from 'react';
import AdSense from './AdSense';

export interface AdZoneConfig {
  id: string;
  format: 'rectangle' | 'vertical' | 'horizontal' | 'responsive';
  slot: string;
  position: 'header' | 'mid-story' | 'sidebar';
  label?: string;
}

export interface AdPlacementManagerProps {
  zone?: 'header' | 'mid-story' | 'sidebar';
  articleContent?: string;
  showHeaderAd?: boolean;
  showMidStoryAd?: boolean;
  showSidebarAd?: boolean;
  customAds?: AdZoneConfig[];
  children?: ReactNode;
}

const DEFAULT_ADS: AdZoneConfig[] = [
  {
    id: 'header-leaderboard',
    format: 'horizontal',
    slot: process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT?.trim() || '',
    position: 'header',
    label: 'Advertisement',
  },
  {
    id: 'mid-story-interstitial',
    format: 'rectangle',
    slot: process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT?.trim() || '',
    position: 'mid-story',
    label: 'Advertisement',
  },
  {
    id: 'sidebar-rectangle',
    format: 'vertical',
    slot: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT?.trim() || '',
    position: 'sidebar',
    label: 'Advertisement',
  },
];

function isConfiguredSlot(slot: string) {
  return /^\d{6,12}$/.test(slot) && !['1234567890', '0987654321', '5555555555', '9999999999'].includes(slot);
}

const AdPlacementManager = ({
  zone,
  articleContent,
  children,
  showHeaderAd = true,
  showMidStoryAd = true,
  showSidebarAd = true,
  customAds,
}: AdPlacementManagerProps) => {
  const adsConfig = customAds || DEFAULT_ADS;

  // ============================================================================
  // MODE 1: STANDALONE ZONE INJECTION (Used by app/page.tsx Grid)
  // ============================================================================
  if (zone) {
    const targetAd = adsConfig.find((ad) => ad.position === zone);
    if (!targetAd || !isConfiguredSlot(targetAd.slot)) return null;

    return (
      <div className="w-full flex flex-col items-center justify-center my-1 overflow-hidden">
        <AdSense
          adSlot={targetAd.slot}
          adFormat={targetAd.format}
          fullWidth={zone === 'header'}
          label={targetAd.label}
        />
      </div>
    );
  };

  // ============================================================================
  // MODE 2: LEGACY WRAPPER LAYOUT (Used by /read/[slug] Article Pages)
  // ============================================================================
  const headerAd = adsConfig.find((ad) => ad.position === 'header');
  const midStoryAd = adsConfig.find((ad) => ad.position === 'mid-story');
  const sidebarAd = adsConfig.find((ad) => ad.position === 'sidebar');

  return (
    <div className="relative w-full">
      {/* 1. HEADER LEADERBOARD */}
      {showHeaderAd && headerAd && isConfiguredSlot(headerAd.slot) && (
        <div className="w-full flex justify-center mb-8 px-4 border-b border-border/40 pb-4">
          <div className="w-full max-w-6xl">
            <AdSense
              adSlot={headerAd.slot}
              adFormat={headerAd.format}
              fullWidth={true}
              label={headerAd.label}
            />
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full max-w-6xl mx-auto px-4">
        
        {/* Editorial Body (75% Width) */}
        <div className="lg:col-span-3">
          <div className="content-area">{children}</div>

          {/* 2. MID-STORY INTERSTITIAL */}
          {showMidStoryAd && midStoryAd && isConfiguredSlot(midStoryAd.slot) && (
            <div className="my-12 py-6 border-y border-border/60 flex justify-center bg-card/30 rounded-xl">
              <AdSense
                adSlot={midStoryAd.slot}
                adFormat={midStoryAd.format}
                label={midStoryAd.label}
              />
            </div>
          )}
        </div>

        {/* 3. STICKY SIDEBAR (25% Width) */}
        {showSidebarAd && sidebarAd && isConfiguredSlot(sidebarAd.slot) && (
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border/80 rounded-xl p-3 text-center shadow-2xs">
              <AdSense
                adSlot={sidebarAd.slot}
                adFormat={sidebarAd.format}
                label={sidebarAd.label}
              />
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}

/**
 * Utility: Calculate optimal mid-story injection paragraph index
 */
export function getMidStoryAdPosition(wordCount: number): number {
  return Math.floor(wordCount / 2);
}

export default AdPlacementManager;