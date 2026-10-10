'use client';

import { useEffect, useState } from 'react';
import { BellRing, BellOff } from 'lucide-react';

function decodeVapidKey(value: string) {
  const padding = '='.repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export default function PushNotificationOptIn() {
  const [status, setStatus] = useState<'idle' | 'busy' | 'on' | 'off' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? 'on' : 'off'))
      .catch(() => undefined);
  }, []);

  async function applyPushPreference() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      throw new Error('Push notifications are not supported in this browser.');
    }
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      const response = await fetch('/api/push/subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: existing.endpoint }),
      });
      if (!response.ok) throw new Error('Could not turn off news alerts.');
      await existing.unsubscribe();
      setStatus('off');
      setMessage('News alerts turned off.');
      return;
    }

      if (Notification.permission === 'denied') throw new Error('Notifications are blocked in browser settings.');
      const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Allow notifications to receive new headlines.');

      const keyResponse = await fetch('/api/push/subscription', { cache: 'no-store' });
      const { publicKey } = await keyResponse.json();
      if (!publicKey) throw new Error('News alerts are not configured on this deployment yet.');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(publicKey),
      });
      const response = await fetch('/api/push/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!response.ok) {
        await subscription.unsubscribe();
        const result = await response.json();
        throw new Error(result.error || 'Could not enable news alerts.');
      }
      setStatus('on');
      setMessage('News alerts are on for this device.');
  }

  async function toggleNotifications() {
    setStatus('busy');
    setMessage('');
    try {
      const sessionResponse = await fetch('/api/reader-auth/session', { cache: 'no-store' });
      const session = await sessionResponse.json();
      if (!session.authenticated) {
        setNeedsEmail(true);
        setStatus('off');
        setMessage('Add an email to continue. No verification code is required.');
        return;
      }
      await applyPushPreference();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not update notification settings.');
    } finally {
      setStatus((current) => current === 'busy' ? 'off' : current);
    }
  }

  async function saveEmailAndContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('busy');
    setMessage('');
    try {
      const response = await fetch('/api/reader-auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save that email.');
      setNeedsEmail(false);
      await applyPushPreference();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not update notification settings.');
    } finally {
      setStatus((current) => current === 'busy' ? 'off' : current);
    }
  }

  return (
    <section className="my-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-foreground">Headline alerts</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Get new story headlines with cover images on this device. Push works in supported browsers and installed PWAs.</p>
      </div>
      {needsEmail ? (
        <form onSubmit={saveEmailAndContinue} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-label="Email address" className="min-w-0 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground" />
          <button disabled={status === 'busy'} className="min-h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
            {status === 'busy' ? 'Continuing…' : 'Continue'}
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => void toggleNotifications()} disabled={status === 'busy'} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50">
          {status === 'on' ? <BellOff size={16} /> : <BellRing size={16} />}
          {status === 'busy' ? 'Updating…' : status === 'on' ? 'Turn off alerts' : 'Enable alerts'}
        </button>
      )}
      {message && <p role="status" className="basis-full text-xs text-muted-foreground sm:basis-auto">{message}</p>}
    </section>
  );
}