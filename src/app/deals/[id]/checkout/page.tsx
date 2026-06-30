"use server";

import React from "react";

export default async function CheckoutPage() {
  // Mock data for pure frontend layout representation
  const mockDeal = {
    title: "Premium Minimalist UI Kit & Design System Token",
    vendor: "JCLS• Labs",
    price: 25000,
    platformFee: 50,
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1C1C1C] antialiased selection:bg-[#C85A32] selection:text-white font-sans">
      {/* Editorial Header */}
      <header className="border-b border-[#1C1C1C]/10 px-6 py-8 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C85A32] uppercase font-mono">
              Trust-Relay Protocol
            </span>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight mt-1">
              Secure Ledger Interlock
            </h1>
          </div>
          <div className="text-right font-mono text-xs text-slate-500">
            REF: TR-{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-130px)]">
        
        {/* Left Column: Checkout Manifest */}
        <section className="lg:col-span-7 p-6 md:p-12 lg:p-24 lg:border-r border-[#1C1C1C]/10 flex flex-col justify-between">
          <div className="max-w-xl w-full space-y-12">
            <div>
              <h2 className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase font-mono mb-4">
                01 / Asset Manifest
              </h2>
              <div className="border border-[#1C1C1C]/10 bg-white/50 backdrop-blur p-6 rounded-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-serif text-lg leading-snug">{mockDeal.title}</h3>
                  <span className="font-mono font-bold text-base whitespace-nowrap">
                    ₦{mockDeal.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-[#1C1C1C]/5">
                  <span>Vendor Sign-off</span>
                  <span className="font-mono font-medium text-[#1C1C1C]">{mockDeal.vendor}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase font-mono mb-4">
                02 / Secure Escrow Summary
              </h2>
              <div className="space-y-3 font-mono text-sm border-b border-[#1C1C1C]/10 pb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Principal Asset Price</span>
                  <span>₦{mockDeal.price.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-[#C85A32] font-medium">
                  <span>Flat Platform Relay Lock</span>
                  <span>+ ₦{mockDeal.platformFee}.00</span>
                </div>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="font-serif text-base font-medium">Total Committal</span>
                <span className="text-2xl md:text-3xl font-mono font-bold tracking-tight">
                  ₦{(mockDeal.price + mockDeal.platformFee).toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Area */}
          <div className="max-w-xl w-full mt-12 pt-8 border-t border-[#1C1C1C]/10">
            <button className="w-full bg-[#1C1C1C] text-[#FDFBF7] py-4 px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C85A32] transition-colors duration-300 ease-in-out focus:outline-none">
              Initialize Split Deposit Gateway
            </button>
            <p className="text-[10px] text-slate-400 font-mono mt-3 text-center">
              Funds are held under standard multi-sig escrow encryption rules.
            </p>
          </div>
        </section>

        {/* Right Column: Dynamic Status Ledger */}
        <section className="lg:col-span-5 bg-[#F6F3EC] p-6 md:p-12 lg:p-16 flex flex-col justify-between font-mono">
          <div className="w-full space-y-8">
            <h2 className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-6">
              03 / Relay Timeline Ledger
            </h2>
            
            {/* Timeline Tracking */}
            <div className="relative border-l border-[#1C1C1C]/10 pl-6 space-y-12 py-2">
              {/* State 1: Active */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#C85A32] border-4 border-[#F6F3EC] box-content" />
                <div className="text-xs font-bold uppercase text-[#C85A32]">Pending Initialization</div>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Awaiting buyer checkout payload submission to anchor node.
                </p>
              </div>

              {/* State 2: Locked */}
              <div className="relative opacity-40">
                <div className="absolute -left-[29px] top-0 w-2 h-2 rounded-full bg-[#1C1C1C] border-2 border-[#F6F3EC] box-content" />
                <div className="text-xs font-bold uppercase">Vault Interlock Secured</div>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Funds verified via Paystack and safely committed to escrow storage.
                </p>
              </div>

              {/* State 3: Dispatched */}
              <div className="relative opacity-40">
                <div className="absolute -left-[29px] top-0 w-2 h-2 rounded-full bg-[#1C1C1C] border-2 border-[#F6F3EC] box-content" />
                <div className="text-xs font-bold uppercase">Vendor Dispatch Cleared</div>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Vendor tracking authenticated; asset transmission initiated.
                </p>
              </div>

              {/* State 4: Settled */}
              <div className="relative opacity-40">
                <div className="absolute -left-[29px] top-0 w-2 h-2 rounded-full bg-[#1C1C1C] border-2 border-[#F6F3EC] box-content" />
                <div className="text-xs font-bold uppercase">Relay Settled & Disbursed</div>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Dual clearance confirmed. Principal released to vendor; platform fee committed.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1C1C1C]/5 pt-6 mt-12 text-[10px] text-slate-400 space-y-1">
            <div>SYSTEM STATUS: COLD COMPLIANT</div>
            <div>ESCROW RUNTIME V1.0.0 (NEON/PAYSTACK LINK)</div>
          </div>
        </section>

      </div>
    </main>
  );
}
