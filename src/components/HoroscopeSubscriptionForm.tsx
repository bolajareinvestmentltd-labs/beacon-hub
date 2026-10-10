'use client';

import { useState } from 'react';
import { BellRing } from 'lucide-react';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export default function HoroscopeSubscriptionForm() {
  const [email, setEmail] = useState('');
  const [sign, setSign] = useState(SIGNS[0]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setSuccess(false);
    try {
      const response = await fetch('/api/horoscope-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sign }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Subscription failed.');
      setMessage(result.message);
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Subscription failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="my-10 rounded-xl border border-border bg-card p-5 sm:my-14 sm:p-7" aria-labelledby="astro-subscribe-title">
      <div className="flex items-center gap-3">
        <BellRing className="text-primary" size={20} />
        <div>
          <h2 id="astro-subscribe-title" className="text-xl font-bold text-foreground">Your daily sign and Tarot note</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a sign to receive its daily reading and Tarot reflection. Unsubscribe anytime.</p>
        </div>
      </div>
      <form onSubmit={subscribe} className="mt-5 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
        <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-w-0 rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary" />
        <select aria-label="Choose your zodiac sign" value={sign} onChange={(event) => setSign(event.target.value)} className="rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary">
          {SIGNS.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button disabled={busy} className="min-h-11 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-50">
          {busy ? 'Saving…' : 'Subscribe'}
        </button>
      </form>
      {message && <p role="status" className={`mt-3 text-sm ${success ? 'text-accent-secondary' : 'text-red-600 dark:text-red-400'}`}>{message}</p>}
    </section>
  );
}