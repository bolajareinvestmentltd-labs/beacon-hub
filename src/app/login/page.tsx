"use client";

import { useState, useSyncExternalStore } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  return "";
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const loginError = new URLSearchParams(search).get("error");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-black dark:bg-[#F9F6F0] rounded-full flex items-center justify-center mb-4 text-white dark:text-black">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl font-black font-playfair text-black dark:text-[#F9F6F0]">Restricted Sector</h1>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">Beacon-Hub Command Auth</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Use the seeded admin account to enter the command center.</p>
        </div>

        {loginError && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 p-3 rounded-md text-xs font-bold text-center mb-6 uppercase tracking-wider">
            {loginError}
          </div>
        )}

        <form action={loginAction} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Admin Email</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] transition-all"
              placeholder={process.env.NODE_ENV === "development" ? "admin@beacon-hub.local" : "Enter admin email"}
              defaultValue={process.env.NODE_ENV === "development" ? "admin@beacon-hub.local" : ""}
              title="Enter an admin email address"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                minLength={8}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 dark:border-white/10 rounded-md px-4 py-3 pr-12 text-black dark:text-white focus:outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B] transition-all"
                placeholder="Enter your admin password"
                defaultValue=""
                title="Password must be at least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 transition hover:text-[#E2725B]"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <input type="checkbox" name="rememberMe" className="h-4 w-4 rounded border-gray-300 text-[#E2725B] focus:ring-[#E2725B]" />
            Remember me for 30 days
          </label>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Use your Beacon Hub admin email and password. The session is protected by an HTTP-only cookie and stays valid for one day or 30 days when remembered.
          </p>

          <button
            type="submit"
            className="mt-4 bg-[#E2725B] hover:bg-[#c95b46] text-white font-black py-4 rounded-md transition-all duration-300 w-full uppercase tracking-[0.2em] text-[11px]"
          >
            Authenticate
          </button>
        </form>

      </div>
    </div>
  );
}
