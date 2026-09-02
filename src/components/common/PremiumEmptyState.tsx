import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  minHeight?: string;
  className?: string;
  badge?: string;
}

export const PremiumEmptyState: React.FC<PremiumEmptyStateProps> = ({
  icon: Icon,
  title = 'Sin registros',
  subtitle = 'No hay elementos pendientes para mostrar.',
  minHeight = '150px',
  className = '',
  badge
}) => {
  return (
    <div 
      className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-[#27272F] bg-neutral-50/50 dark:bg-[#161619]/40 w-full transition-colors duration-200 ${className}`}
      style={{ minHeight }}
    >
      <div className="relative z-10 flex flex-col items-center p-4 text-center">
        {/* Apple/Gemini Minimalist Icon Container */}
        {Icon && (
          <div 
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#202026] shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-neutral-200/70 dark:border-[#2C2C34] flex items-center justify-center mb-2.5 text-neutral-600 dark:text-neutral-300"
          >
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}

        {badge && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-2 border border-neutral-200/50 dark:border-neutral-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {badge}
          </span>
        )}

        <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-[12px] font-normal text-neutral-500 dark:text-neutral-400 max-w-[210px] leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
