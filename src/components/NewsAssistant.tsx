'use client';

import Link from 'next/link';
import { ArrowUpRight, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

type AssistantArticle = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
};

export default function NewsAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [articles, setArticles] = useState<AssistantArticle[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setAnswer('');
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The newsroom assistant is unavailable.');
      setAnswer(result.answer || 'No answer was returned.');
      setArticles(Array.isArray(result.articles) ? result.articles : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The newsroom assistant is unavailable.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section className="flex max-h-[min(70dvh,38rem)] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-2xl" aria-label="Beacon Hub AI news assistant">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-primary" />
              <div>
                <h2 className="text-sm font-bold">Newsroom assistant</h2>
                <p className="text-[10px] text-muted-foreground">Find a story or ask for a summary</p>
              </div>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X size={16} />
            </button>
          </header>

          <div className="min-h-32 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {!answer && !error && <p className="text-sm leading-6 text-muted-foreground">Try “Summarize the latest technology story” or “Find election coverage.”</p>}
            {answer && <p className="whitespace-pre-wrap text-sm leading-6">{answer}</p>}
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {articles.map((article) => (
              <Link key={article.id} href={`/read/${article.slug}`} onClick={() => setOpen(false)} className="flex gap-3 rounded-lg border border-border p-2 transition-colors hover:bg-muted">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img src={article.coverImage || '/logo.png'} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] text-primary">{article.category}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-bold leading-5">{article.title}</p>
                </div>
                <ArrowUpRight size={14} className="mt-1 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <form onSubmit={ask} className="flex gap-2 border-t border-border p-3">
            <input value={query} onChange={(event) => setQuery(event.target.value)} maxLength={400} required placeholder="Ask about Beacon Hub news" className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            <button type="submit" disabled={busy} aria-label="Send question" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close newsroom assistant' : 'Ask the newsroom assistant'} className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]">
        <Sparkles size={17} />
        <span>Ask Beacon</span>
      </button>
    </div>
  );
}