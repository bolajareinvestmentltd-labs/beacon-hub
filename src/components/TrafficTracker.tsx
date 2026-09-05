'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const visitorStorageKey = 'beacon_hub_visitor_id';

function getVisitorId() {
  const existing = window.localStorage.getItem(visitorStorageKey);
  if (existing) return existing;

  const visitorId = crypto.randomUUID();
  window.localStorage.setItem(visitorStorageKey, visitorId);
  return visitorId;
}

export default function TrafficTracker() {
  const pathname = usePathname() || '/';

  useEffect(() => {
    const visitorId = getVisitorId();

    void fetch('/api/traffic/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Traffic tracking must never affect page navigation.
    });
  }, [pathname]);

  return null;
}