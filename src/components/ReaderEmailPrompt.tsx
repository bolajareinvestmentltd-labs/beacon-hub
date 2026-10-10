'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ReaderEmailPrompt() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    fetch('/api/reader-auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((session) => {
        if (cancelled || session.authenticated || sessionStorage.getItem('reader-email-prompt-dismissed')) return;
        timer = window.setTimeout(() => setVisible(true), 45_000);
      })
      .catch(() => undefined);

    const showAfterReading = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.68) {
        if (!sessionStorage.getItem('reader-email-prompt-dismissed')) setVisible(true);
      }
    };
    window.addEventListener('scroll', showAfterReading, { passive: true });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('scroll', showAfterReading);
    };
  }, []);

  async function saveEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/reader-auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not continue with this email.');
      sessionStorage.setItem('reader-email-prompt-dismissed', 'true');
      setVisible(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not continue with this email.');
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-40 mx-auto max-w-xl animate-in slide-in-from-bottom-6 rounded-xl border border-border bg-card p-4 text-foreground shadow-2xl duration-500 sm:inset-x-6 sm:bottom-6 sm:p-5" aria-label="Continue with email">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-primary">KEEP YOUR PLACE</p>
          <h2 className="mt-1 text-lg font-bold">Continue with your email</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">No code required. Your email is not verified or subscribed to marketing.</p>
        </div>
        <button type="button" aria-label="Dismiss email prompt" onClick={() => { sessionStorage.setItem('reader-email-prompt-dismissed', 'true'); setVisible(false); }} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X size={17} />
        </button>
      </div>
      <form onSubmit={saveEmail} className="mt-3 flex gap-2">
        <input aria-label="Email address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
        <button disabled={busy} className="shrink-0 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60">
          {busy ? 'Saving…' : 'Continue'}
        </button>
      </form>
      {message && <p role="status" className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>}
    </aside>
  );
}