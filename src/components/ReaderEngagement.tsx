'use client';

import { useEffect, useState } from 'react';
import { MessageSquareText, Star, ThumbsDown, ThumbsUp, X } from 'lucide-react';

type Reaction = 'like' | 'dislike';
type EngagementData = {
  likes: number;
  dislikes: number;
  averageRating: number | null;
  ratingCount: number;
  readerReaction: Reaction | null;
  readerRating: number | null;
  readerComment: string | null;
  comments: Array<{ comment: string | null; rating: number | null; updatedAt: string }>;
};

type ModalStage = 'email' | 'code' | 'review';

const emptyEngagement: EngagementData = {
  likes: 0,
  dislikes: 0,
  averageRating: null,
  ratingCount: 0,
  readerReaction: null,
  readerRating: null,
  readerComment: null,
  comments: [],
};

export default function ReaderEngagement({ articleId }: { articleId: number }) {
  const [engagement, setEngagement] = useState(emptyEngagement);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState<ModalStage>('email');
  const [code, setCode] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [pendingReaction, setPendingReaction] = useState<Reaction | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadEngagement() {
      try {
        const [interactionResponse, sessionResponse] = await Promise.all([
          fetch(`/api/articles/${articleId}/interactions`, { cache: 'no-store' }),
          fetch('/api/reader-auth/session', { cache: 'no-store' }),
        ]);
        const [interactionData, sessionData] = await Promise.all([
          interactionResponse.json(),
          sessionResponse.json(),
        ]);
        if (cancelled) return;
        if (interactionResponse.ok) setEngagement({ ...emptyEngagement, ...interactionData });
        if (sessionData.authenticated && typeof sessionData.email === 'string') {
          setIsAuthenticated(true);
          setEmail(sessionData.email);
        }
      } catch {
        if (!cancelled) setMessage('Engagement is temporarily unavailable.');
      }
    }

    void loadEngagement();
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  function openParticipation() {
    setMessage('');
    setStage(isAuthenticated ? 'review' : 'email');
    setModalOpen(true);
  }

  async function refreshEngagement() {
    const response = await fetch(`/api/articles/${articleId}/interactions`, { cache: 'no-store' });
    if (response.ok) setEngagement({ ...emptyEngagement, ...(await response.json()) });
  }

  async function submitReaction(reaction: Reaction) {
    if (!isAuthenticated) {
      setPendingReaction(reaction);
      openParticipation();
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/articles/${articleId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save your reaction.');
      await refreshEngagement();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save your reaction.');
    } finally {
      setBusy(false);
    }
  }

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/reader-auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your code.');
      setStage('code');
      setMessage(result.message || 'Check your inbox for a sign-in code.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not send your code.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/reader-auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not verify your code.');
      setIsAuthenticated(true);
      setStage('review');
      setMessage('Email verified. You can now react and review this story.');
      if (pendingReaction) {
        const reactionResponse = await fetch(`/api/articles/${articleId}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reaction: pendingReaction }),
        });
        const reactionResult = await reactionResponse.json();
        if (!reactionResponse.ok) throw new Error(reactionResult.error || 'Email verified, but the reaction could not be saved.');
        setPendingReaction(null);
        await refreshEngagement();
        setMessage('Email verified and your reaction was saved. You can also review this story.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not verify your code.');
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/articles/${articleId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: rating || undefined, comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not publish your review.');
      await refreshEngagement();
      setModalOpen(false);
      setComment('');
      setMessage('Your review has been posted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not publish your review.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto my-10 w-full max-w-4xl border-y border-border py-7 sm:my-14 sm:py-9" aria-label="Reader reactions and reviews">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Join the conversation</h2>
          <p className="mt-1 text-sm text-muted-foreground">Verify your email to react or leave a review.</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {engagement.averageRating === null ? 'No ratings yet' : `${engagement.averageRating.toFixed(1)} / 5`}
            <span className="ml-2 font-normal text-muted-foreground">({engagement.ratingCount} ratings)</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void submitReaction('like')}
            disabled={busy}
            aria-pressed={engagement.readerReaction === 'like'}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors ${engagement.readerReaction === 'like' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-muted'}`}
          >
            <ThumbsUp size={17} /> Like <span>{engagement.likes}</span>
          </button>
          <button
            type="button"
            onClick={() => void submitReaction('dislike')}
            disabled={busy}
            aria-pressed={engagement.readerReaction === 'dislike'}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors ${engagement.readerReaction === 'dislike' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-muted'}`}
          >
            <ThumbsDown size={17} /> Dislike <span>{engagement.dislikes}</span>
          </button>
          <button type="button" onClick={openParticipation} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90">
            <MessageSquareText size={17} /> Review story
          </button>
        </div>
      </div>

      {message && !modalOpen && <p role="status" className="mt-3 text-sm text-muted-foreground">{message}</p>}

      {engagement.comments.length > 0 && (
        <div className="mt-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Reader reviews</h3>
          {engagement.comments.map((item, index) => (
            <article key={`${item.updatedAt}-${index}`} className="border-l-2 border-primary/60 pl-4">
              {item.rating ? <p className="mb-1 text-xs font-semibold text-primary">Rated {item.rating} out of 5</p> : null}
              <p className="text-sm leading-6 text-foreground">{item.comment}</p>
              <time className="mt-1 block text-xs text-muted-foreground" dateTime={item.updatedAt}>
                {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.updatedAt))}
              </time>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-5" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="reader-dialog-title" className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-card p-5 text-foreground shadow-2xl sm:rounded-xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] text-primary">BEACON HUB / READER DESK</p>
                <h2 id="reader-dialog-title" className="mt-2 text-2xl font-black">
                  {stage === 'review' ? 'Review this story' : 'Verify your email'}
                </h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close dialog" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {stage === 'email' && (
              <form onSubmit={requestCode} className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">Enter your email and we’ll send a one-time code before you can participate.</p>
                <label className="block text-sm font-semibold" htmlFor="reader-email">Email address</label>
                <input id="reader-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-3 text-foreground outline-none focus:border-primary" />
                <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
                  {busy ? 'Sending code…' : 'Email me a sign-in code'}
                </button>
              </form>
            )}

            {stage === 'code' && (
              <form onSubmit={verifyCode} className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">Enter the six-digit code sent to {email}.</p>
                <label className="block text-sm font-semibold" htmlFor="reader-code">Verification code</label>
                <input id="reader-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full rounded-md border border-border bg-background px-3 py-3 text-center font-mono text-xl tracking-[0.25em] text-foreground outline-none focus:border-primary" />
                <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
                  {busy ? 'Verifying…' : 'Verify email'}
                </button>
              </form>
            )}

            {stage === 'review' && (
              <form onSubmit={submitReview} className="space-y-4">
                <p className="text-sm text-muted-foreground">Signed in as {email}</p>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">Your rating</legend>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button key={value} type="button" onClick={() => setRating(value)} aria-label={`Rate ${value} out of 5`} aria-pressed={rating === value} className="rounded p-1 text-amber-500 hover:bg-muted">
                        <Star size={25} fill={value <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="block text-sm font-semibold" htmlFor="reader-comment">Comment or review</label>
                <textarea id="reader-comment" required minLength={5} maxLength={1200} rows={5} value={comment} onChange={(event) => setComment(event.target.value)} className="w-full resize-y rounded-md border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary" placeholder="What stood out to you?" />
                <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
                  {busy ? 'Posting…' : 'Post review'}
                </button>
              </form>
            )}

            {message && <p role="status" className="mt-4 text-sm text-muted-foreground">{message}</p>}
          </section>
        </div>
      )}
    </section>
  );
}