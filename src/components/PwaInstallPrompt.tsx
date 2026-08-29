'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
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
      setShowPrompt(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.warn('Install prompt could not be shown:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#07151C]/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md md:bottom-8">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        title="Dismiss install prompt"
        className="order-last self-start rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <X size={16} aria-hidden="true" />
      </button>
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