'use client';

import { useEffect, useState } from 'react';

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export default function LiveClock() {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const updateTime = () => setTime(formatClock(new Date()));
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <time aria-label={`Current time in Lagos: ${time}`} className="font-mono text-sm font-bold tabular-nums text-foreground">
      {time} <span className="text-muted-foreground">WAT</span>
    </time>
  );
}