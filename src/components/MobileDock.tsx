"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, Newspaper, Sparkles, Tags, X } from "lucide-react";
import { useRef, useState } from "react";
import { TAXONOMY } from "@/config/taxonomy";

const MAIN_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Deals", href: "/deals", icon: Tags },
  { label: "Astro", href: "/horoscopes", icon: Sparkles },
  { label: "Briefings", href: "/curated-news", icon: Newspaper },
];

const CATEGORY_LINKS = TAXONOMY.primary.filter((item) => item.href.startsWith('/category/'));

export default function MobileDock() {
  const pathname = usePathname() ?? "/";
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    rect: DOMRect;
  } | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div
        className="fixed bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[min(26rem,calc(100vw-6rem))] -translate-x-1/2 rounded-2xl border border-border/80 bg-card/95 px-2 py-2 shadow-xl backdrop-blur md:hidden"
        style={{ transform: `translate(calc(-50% + ${dragOffset.x}px), ${dragOffset.y}px)` }}
      >
        <button
          type="button"
          aria-label="Drag navigation dock to reposition"
          title="Drag to reposition"
          onPointerDown={(event) => {
            const dock = event.currentTarget.parentElement;
            if (!dock) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              offsetX: dragOffset.x,
              offsetY: dragOffset.y,
              rect: dock.getBoundingClientRect(),
            };
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;
            const minX = drag.offsetX - drag.rect.left + 8;
            const maxX = drag.offsetX + window.innerWidth - drag.rect.right - 8;
            const minY = drag.offsetY - drag.rect.top + 8;
            const maxY = drag.offsetY + window.innerHeight - drag.rect.bottom - 8;
            setDragOffset({
              x: Math.min(maxX, Math.max(minX, drag.offsetX + event.clientX - drag.startX)),
              y: Math.min(maxY, Math.max(minY, drag.offsetY + event.clientY - drag.startY)),
            });
          }}
          onPointerUp={() => { dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
          className="mx-auto mb-1 block h-1.5 w-9 touch-none rounded-full bg-muted-foreground/40"
        />
        <div className="mx-auto flex max-w-md items-center justify-between gap-1">
          {MAIN_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition ${
                isActive(href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={18} />
              <span className="mt-1">{label}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsTrayOpen(true)}
            className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:bg-muted"
          >
            <Menu size={18} />
            <span className="mt-1">Menu</span>
          </button>
        </div>
      </div>

      {isTrayOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl border border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-foreground shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                Explore
              </p>
              <button
                type="button"
                onClick={() => setIsTrayOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {CATEGORY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsTrayOpen(false)}
                  className="rounded-lg border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
