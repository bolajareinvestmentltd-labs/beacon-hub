"use client";

import { useState, useEffect } from "react";
import { subscribeUser } from "@/lib/actions";
export default function NewsletterModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if they closed it recently (7-day cookie)
    const hasSeenModal = localStorage.getItem("beacon_newsletter_dismissed");
    if (hasSeenModal) return;

    // The 15-second trap
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Hide for 7 days if they close it
    localStorage.setItem("beacon_newsletter_dismissed", "true");
  };

  const formAction = async (formData: FormData) => {
    setStatus("loading");
    const result = await subscribeUser(formData);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Welcome to the Network. Check your inbox.");
      // Auto-close after 3 seconds on success
      setTimeout(() => handleClose(), 3000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-xl p-6 relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          ✕
        </button>
        
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
          Secure the Briefing.
        </h3>
        <p className="font-sans text-sm text-slate-600 mb-4">
          Join high-net-worth individuals and industry leaders. Get our macro-market analysis delivered instantly.
        </p>

        {status === "success" ? (
          <div className="bg-green-50 text-green-800 text-sm font-medium p-3 rounded-md border border-green-200">
            {message}
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <input 
              type="email" 
              name="email" 
              required
              placeholder="name@company.com" 
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2 rounded-md transition-colors disabled:opacity-70"
            >
              {status === "loading" ? "Securing..." : "Subscribe"}
            </button>
            {status === "error" && (
              <p className="text-red-600 text-xs mt-1">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}