'use client';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  accentColor?: string;
  centered?: boolean;
}

export default function SectionHeaderComponent({
  title,
  eyebrow,
  description,
  accentColor = '#E2725B',
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-12`}>
      {/* Eyebrow Label */}
      {eyebrow && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="h-1 w-8"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </span>
          <div
            className="h-1 w-8"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      )}

      {/* Main Title - Serif */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-playfair leading-tight text-black dark:text-[#F9F6F0] mb-4">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}

      {/* Bottom Accent Bar */}
      <div className={`h-1 ${centered ? 'mx-auto' : ''} w-20 mt-8`} style={{ backgroundColor: accentColor }} />
    </div>
  );
}
