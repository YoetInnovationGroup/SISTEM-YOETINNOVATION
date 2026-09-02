import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, ShieldCheck, History, Sparkles } from 'lucide-react';

interface MaintenanceSpotStateProps {
  section: 'tareas' | 'ddc' | 'historial';
  title?: string;
  subtitle?: string;
}

export const MaintenanceSpotState: React.FC<MaintenanceSpotStateProps> = ({
  section,
  title,
  subtitle
}) => {
  const getSectionConfig = () => {
    switch (section) {
      case 'tareas':
        return {
          defaultTitle: 'Tareas Notariales',
          defaultSubtitle: 'Disponible próximamente.',
          Icon: CheckSquare,
          gradient: 'from-blue-500/20 via-sky-500/20 to-indigo-500/20',
          iconColor: 'text-[#2575FC] dark:text-[#60A5FA]',
          accentColor: '#2575FC',
        };
      case 'ddc':
        return {
          defaultTitle: 'Debida Diligencia (DDC)',
          defaultSubtitle: 'Disponible próximamente.',
          Icon: ShieldCheck,
          gradient: 'from-emerald-500/20 via-teal-500/20 to-sky-500/20',
          iconColor: 'text-emerald-500 dark:text-emerald-400',
          accentColor: '#10B981',
        };
      case 'historial':
      default:
        return {
          defaultTitle: 'Historial del Trámite',
          defaultSubtitle: 'Disponible próximamente.',
          Icon: History,
          gradient: 'from-blue-600/20 via-sky-500/20 to-slate-500/20',
          iconColor: 'text-[#2575FC] dark:text-[#60A5FA]',
          accentColor: '#2169C4',
        };
    }
  };

  const config = getSectionConfig();
  const IconComponent = config.Icon;
  const displayTitle = title || config.defaultTitle;
  const displaySubtitle = subtitle || config.defaultSubtitle;

  return (
    <div className="relative w-full py-16 sm:py-24 px-6 rounded-3xl bg-white/70 dark:bg-[#141417]/80 border border-neutral-200/80 dark:border-[#26262B] backdrop-blur-sm flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Ambient background glow (Apple/Gemini gradient aura) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0">
        <div
          className={`w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr ${config.gradient} blur-3xl opacity-60 dark:opacity-40 animate-pulse`}
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* Spot Illustration Container */}
      <div className="relative z-10 mb-8 flex items-center justify-center">
        {/* Orbital SVG Art */}
        <svg
          className="w-48 h-48 sm:w-56 sm:h-56 select-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`gemini-grad-${section}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id={`glow-${section}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central radial glow */}
          <circle cx="100" cy="100" r="70" fill={`url(#glow-${section})`} />

          {/* Outer elegant orbit ring */}
          <circle
            cx="100"
            cy="100"
            r="82"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="text-neutral-300/80 dark:text-neutral-700/60 opacity-60"
          />

          {/* Inner orbit ring */}
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke={`url(#gemini-grad-${section})`}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* Floating orbital spark stars */}
          <g className="animate-spin" style={{ animationDuration: '24s', transformOrigin: '100px 100px' }}>
            <circle cx="100" cy="18" r="3.5" fill={config.accentColor} />
            <circle cx="182" cy="100" r="2.5" fill="#A855F7" opacity="0.8" />
            <circle cx="28" cy="130" r="2" fill="#38BDF8" opacity="0.9" />
          </g>

          {/* Gemini 4-point sparkle decorative elements */}
          <path
            d="M165 45 C165 49, 169 53, 173 53 C169 53, 165 57, 165 61 C165 57, 161 53, 157 53 C161 53, 165 49, 165 45 Z"
            fill={config.accentColor}
            opacity="0.75"
          />
          <path
            d="M35 155 C35 158, 38 161, 41 161 C38 161, 35 164, 35 167 C35 164, 32 161, 29 161 C32 161, 35 158, 35 155 Z"
            fill="#A855F7"
            opacity="0.6"
          />
        </svg>

        {/* Central Frosted Glass Medallion */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/90 dark:bg-[#1C1C22]/90 border border-white/80 dark:border-white/10 shadow-xl shadow-neutral-900/5 dark:shadow-black/40 backdrop-blur-md flex items-center justify-center">
            <IconComponent className={`w-9 h-9 sm:w-11 sm:h-11 ${config.iconColor}`} strokeWidth={1.75} />
          </div>
        </motion.div>
      </div>

      {/* Text Hierarchy */}
      <div className="relative z-10 max-w-md mx-auto space-y-2.5">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          {displayTitle}
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
};
