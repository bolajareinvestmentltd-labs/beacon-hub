"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function NewsletterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  // Portaled to <body>: the navbar uses backdrop-filter, which would otherwise trap this fixed overlay inside the header.
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="newsletter-title" className="relative w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          type="button"
          onClick={onClose}
          aria-label="Close newsletter signup"
          className="absolute right-4 top-4 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
        >
          <X size={16} />
        </button>
        <NewsletterForm onSubscribed={() => { window.setTimeout(onClose, 2200); }} />
      </div>
    </div>,
    document.body
  );
}