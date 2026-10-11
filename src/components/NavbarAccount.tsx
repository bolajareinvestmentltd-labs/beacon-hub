"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

type ReaderSession = { authenticated: boolean; email?: string };

/**
 * Navbar account slot: a notification bell for visitors, and the reader's avatar
 * (initial on a gradient disc) once they have registered an email.
 */
export default function NavbarAccount() {
  const [session, setSession] = useState<ReaderSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reader-auth/session", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { authenticated: false }))
      .then((data: ReaderSession) => { if (!cancelled) setSession(data); })
      .catch(() => { if (!cancelled) setSession({ authenticated: false }); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-muted/70 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary";

  if (!session?.authenticated || !session.email) {
    return (
      <Link href="/#headline-alerts" aria-label="Get headline alerts" title="Headline alerts" className={buttonClass}>
        <Bell size={17} />
      </Link>
    );
  }

  const email = session.email;
  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={email}
        onClick={() => setIsOpen((open) => !open)}
        className="app-gradient inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white ring-2 ring-border/70 transition hover:ring-primary"
      >
        {initial}
      </button>

      {isOpen ? (
        <div role="menu" className="absolute right-0 top-11 w-60 rounded-xl border border-border bg-card p-2 text-foreground shadow-xl">
          <p className="truncate px-3 py-2 text-xs text-muted-foreground" title={email}>{email}</p>
          <Link
            href="/#headline-alerts"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            <Bell size={15} /> Headline alerts
          </Link>
        </div>
      ) : null}
    </div>
  );
}

