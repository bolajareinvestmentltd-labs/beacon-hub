"use client";

import { useState } from "react";
import { subscribeToNetwork } from "@/lib/email-actions";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleAction(formData: FormData) {
    setStatus("loading");
    const result = await subscribeToNetwork(formData);
    
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result.success) {
      setStatus("success");
      setMessage(result.success);
    }
  }

  return (
    <div className="w-full bg-[#1C1C1E] dark:bg-[#121212] rounded-xl p-8 md:p-12 border border-black/10 dark:border-white/5 relative overflow-hidden my-12">
      {/* Premium Ambient Glow */}
      <div className="absolute top-0 right-0 p-32 bg-[#E2725B] opacity-[0.03] dark:opacity-[0.05] blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 text-[#E2725B] mb-4">
          <Mail size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The JCLs Dispatch</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black font-playfair text-[#F9F6F0] mb-4">
          Access the Inner Circle.
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Receive macro-trend analysis, exclusive escrow asset drops, and verified intelligence briefings directly to your inbox.
        </p>

        {status === "success" ? (
          <div className="bg-[#3A7B7A]/10 border border-[#3A7B7A]/30 text-[#4A9B9A] p-4 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Transmission Confirmed. Welcome to the Network.
          </div>
        ) : (
          <form action={handleAction} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Enter your email address..."
              className="flex-grow bg-white/5 border border-white/10 rounded-md px-4 py-3.5 text-[#F9F6F0] focus:outline-none focus:border-[#E2725B] focus:bg-white/10 transition-all placeholder:text-slate-500 text-sm"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="bg-[#E2725B] hover:bg-[#c95b46] text-white font-black px-8 py-3.5 rounded-md transition-all uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? "Encrypting..." : "Subscribe"} <ArrowRight size={14} />
            </button>
          </form>
        )}
        
        {status === "error" && (
          <p className="mt-3 text-red-400 text-[10px] font-bold uppercase tracking-widest">{message}</p>
        )}
      </div>
    </div>
  );
}
