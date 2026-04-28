"use client";

import { useState } from "react";
import { subscribeUser } from "../lib/actions";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleAction(formData: FormData) {
    setStatus("loading");
    const result = await subscribeUser(formData);
    
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("idle");
      alert("Failed to subscribe. Check your API key!");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 text-center">
        <p className="text-emerald-400 font-bold">✓ Magic Link Sent!</p>
        <p className="text-xs text-slate-400 mt-1">Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <form action={handleAction} className="flex flex-col gap-3">
      <input 
        type="email" 
        name="email"
        placeholder="Enter your email address..." 
        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
        required
      />
      <button 
        type="submit"
        disabled={status === "loading"}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
      >
        {status === "loading" ? "Transmitting..." : "Subscribe via Magic Link"}
      </button>
    </form>
  );
}
