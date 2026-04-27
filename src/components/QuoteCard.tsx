import React from 'react';

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
}

export default function QuoteCard({ quote, author, role = "Developer & Speaker" }: QuoteCardProps) {
  return (
    <div className="w-full bg-slate-900/80 rounded-2xl shadow-2xl overflow-hidden border-l-4 border-indigo-500 p-8 relative group hover:bg-slate-900 transition-colors">
      
      {/* Decorative Quote Mark */}
      <div className="absolute top-4 right-6 text-slate-800/50 group-hover:text-indigo-500/10 transition-colors">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* The Quote Content */}
      <div className="relative z-10">
        <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed mb-8">
          "{quote}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
             {author.charAt(0)}
          </div>
          <div>
            <p className="text-base font-bold text-slate-100 uppercase tracking-wider">
              {author}
            </p>
            <p className="text-xs text-indigo-400 font-medium">
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
