import React from 'react';
import { motion } from 'motion/react';
import { 
  StayOrganizedIllustration, 
  SyncNotesIllustration, 
  CollaborateShareIllustration 
} from './SpotIllustrations.tsx';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero-section" aria-label="Hero Overview" className="w-full mb-7">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
        
        {/* Left Greeting & Headline */}
        <div className="xl:col-span-4 flex flex-col justify-center pr-2">
          {/* Subheading Question */}
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight mb-2.5">
            ¿Cuáles son tus planes para hoy?
          </h2>

          {/* Descriptive text */}
          <p className="text-base font-normal text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md">
            Ecosistema integral diseñado para organizar expedientes notariales, trámites y control de notas con máxima precisión.
          </p>
        </div>

        {/* Right Feature Action Cards (3 Cards) - Apple Squircle Cards */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 2: Stay organized */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            id="card-stay-organized"
            className="apple-card flex flex-col items-center justify-between h-44 rounded-3xl p-4 border border-black/[0.05] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all text-center"
          >
            <div className="flex-1 flex items-center justify-center">
              <StayOrganizedIllustration className="w-18 h-18" />
            </div>
            <div className="w-full mt-1">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-[15px] leading-tight">
                Mantente organizado
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-xs sm:text-[13px] leading-tight mt-1">
                Estructura clara para notas
              </p>
            </div>
          </motion.div>

          {/* Card 3: Sync your notes */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            id="card-sync-notes"
            className="apple-card flex flex-col items-center justify-between h-44 rounded-3xl p-4 border border-black/[0.05] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all text-center"
          >
            <div className="flex-1 flex items-center justify-center">
              <SyncNotesIllustration className="w-18 h-18" />
            </div>
            <div className="w-full mt-1">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-[15px] leading-tight">
                Sincroniza tus notas
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-xs sm:text-[13px] leading-tight mt-1">
                Seguridad en la nube
              </p>
            </div>
          </motion.div>

          {/* Card 4: Collaborate and share */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            id="card-collaborate-share"
            className="apple-card flex flex-col items-center justify-between h-44 rounded-3xl p-4 border border-black/[0.05] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all text-center"
          >
            <div className="flex-1 flex items-center justify-center">
              <CollaborateShareIllustration className="w-18 h-18" />
            </div>
            <div className="w-full mt-1">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-[15px] leading-tight">
                Colabora y comparte
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-xs sm:text-[13px] leading-tight mt-1">
                Acceso para tu equipo
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

