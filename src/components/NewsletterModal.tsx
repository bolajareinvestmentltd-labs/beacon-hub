"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("jcls_newsletter_seen");
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("jcls_newsletter_seen", "true");
      }, 15000); 

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
        >
          <X size={16} />
        </button>
        <NewsletterForm />
      </div>
    </div>
  );
}