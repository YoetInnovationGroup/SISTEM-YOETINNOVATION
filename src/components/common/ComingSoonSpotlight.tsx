import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ComingSoonSpotlightProps {
  sectionName: string;
  badgeText?: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  accentColor?: 'blue' | 'indigo' | 'amber' | 'emerald';
  children?: React.ReactNode;
}

export const ComingSoonSpotlight: React.FC<ComingSoonSpotlightProps> = ({
  sectionName,
  badgeText = 'Próximamente',
  icon: Icon,
  headline,
  description,
  accentColor = 'blue',
  children,
}) => {
  const glowColors = {
    blue: {
      radial: 'radial-gradient(circle, rgba(37,117,252,0.18) 0%, rgba(33,105,196,0.06) 50%, transparent 75%)',
      ring: 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10',
      pill: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
      dot: 'bg-blue-500 shadow-[0_0_8px_rgba(37,117,252,0.6)]',
    },
    indigo: {
      radial: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.06) 50%, transparent 75%)',
      ring: 'border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      pill: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40',
      dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    },
    amber: {
      radial: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(217,119,6,0.06) 50%, transparent 75%)',
      ring: 'border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10',
      pill: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
      dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    },
    emerald: {
      radial: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.06) 50%, transparent 75%)',
      ring: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    },
  }[accentColor];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-2">
      <div className="relative rounded-[32px] overflow-hidden border border-neutral-200/80 dark:border-[#26262B] bg-white/80 dark:bg-[#121215]/90 backdrop-blur-2xl shadow-xl p-8 sm:p-12 lg:p-14 text-center flex flex-col items-center">
        {/* Apple/Gemini Ambient Luminous Aura */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80 transition-opacity duration-1000"
          style={{ background: glowColors.radial }}
        />

        {/* Gemini fine dot accent grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Top Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase mb-7 shadow-xs">
          <span className={`w-2 h-2 rounded-full animate-pulse ${glowColors.dot}`} />
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            {sectionName}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="font-bold text-neutral-900 dark:text-white">
            {badgeText}
          </span>
        </div>

        {/* Central Icon Ring */}
        <div className="relative z-10 mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1A1A1F] shadow-lg flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-neutral-800 dark:text-neutral-100" strokeWidth={1.75} />
          </div>
        </div>

        {/* Main Title & Headline */}
        <div className="relative z-10 max-w-lg space-y-2 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        {/* Optional Custom Content (e.g. Quick Settings Toggle) */}
        {children && (
          <div className="relative z-10 w-full pt-6 border-t border-neutral-200/60 dark:border-white/10 mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
