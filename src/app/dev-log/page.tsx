import { Terminal, GitCommit } from "lucide-react";

export default function DevLogPage() {
  // Architect Note: This is placeholder UI data. Later, we can connect this 
  // to your database to pull articles specifically categorized as "Dev Log".
  const logs = [
    {
      id: 1,
      date: "MAY 14, 2026",
      version: "v1.2.0",
      title: "Escrow Protocol & Frontend Lock",
      content: "Engineered the transparent checkout UI for the JCLs flat-fee escrow system. Deployed the dynamic routing for premium marketplace assets. The frontend architecture is now fully sealed.",
    },
    {
      id: 2,
      date: "MAY 13, 2026",
      version: "v1.1.0",
      title: "Vercel Cron & Secure Vault",
      content: "Automated the global and regional intelligence ingestion engine. Locked the Command Center behind Next.js Edge Middleware with secure HTTP-only cookie authentication.",
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-8">
        <div className="flex items-center gap-3 text-[#E2725B] mb-4">
          <Terminal size={24} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">System Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-playfair text-black dark:text-[#F9F6F0]">
          The Dev Log.
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl text-sm leading-relaxed">
          A transparent ledger of the JCLs intelligence network evolution. Track system upgrades, security patches, and protocol deployments.
        </p>
      </div>

      <div className="relative border-l border-black/10 dark:border-white/10 ml-3 md:ml-4 space-y-12 pb-12">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-8 md:pl-12 group">
            {/* The Timeline Node */}
            <div className="absolute -left-[17px] top-1 bg-[#F9F6F0] dark:bg-black p-1">
              <div className="bg-slate-300 dark:bg-slate-800 group-hover:bg-[#E2725B] text-white rounded-full p-1.5 transition-colors duration-500">
                <GitCommit size={14} />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">{log.date}</span>
              <span className="bg-black/5 dark:bg-white/10 text-black dark:text-white text-[10px] px-2 py-0.5 rounded-sm font-mono">{log.version}</span>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-[#F9F6F0] mb-3">{log.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
              {log.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}