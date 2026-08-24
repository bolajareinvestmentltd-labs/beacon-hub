'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#07151C]/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md md:bottom-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#F4C8BA]">Install App</p>
        <p className="mt-1 text-xs text-slate-200">Use Beacon Hub like a native app.</p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="app-gradient rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:brightness-110"
      >
        Install
      </button>
    </div>
  );
}