import React from 'react';

export const DarkFrostedFolderIllustration: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <div className={`group flex flex-col items-center select-none ${className}`}>
      {/* Horizontal Folder Illustration Container */}
      <div className="relative w-72 h-[180px] cursor-pointer transition-all duration-500 transform group-hover:-translate-y-2.5 group-hover:scale-[1.02]">
          
          {/* Sombra de ambiente inferior */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-[#2575FC]/25 dark:bg-black/50 blur-xl rounded-full transition-opacity opacity-60 group-hover:opacity-100 pointer-events-none -z-10"></div>
          
          {/* Pestaña superior de la carpeta */}
          <div className="absolute top-0 left-5 w-28 h-7 bg-[#1E60B5] dark:bg-[#0A192F] rounded-t-xl border-t border-l border-r border-white/20 dark:border-white/10" />

          {/* Parte trasera de la carpeta (UNION Signal Blue) */}
          <div className="absolute top-4 inset-x-0 bottom-0 bg-gradient-to-b from-[#2575FC] to-[#2169C4] dark:from-[#2169C4] dark:to-[#0A192F] rounded-[28px] shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/40 border border-white/10 dark:border-white/5"></div>
          
          {/* Expediente Blanco (Papeles interiores horizontales) */}
          <div className="absolute top-8 bottom-4 left-7 right-5 bg-white dark:bg-[#F8F9FA] rounded-[20px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] flex flex-col justify-center items-end pr-6 gap-3 z-0">
              <div className="w-12 h-2.5 bg-neutral-200 dark:bg-neutral-300 rounded-full"></div>
              <div className="w-20 h-2.5 bg-neutral-200 dark:bg-neutral-300 rounded-full"></div>
              <div className="w-10 h-2.5 bg-neutral-200 dark:bg-neutral-300 rounded-full"></div>
          </div>

          {/* Cubierta frontal de Cristal (Light/Dark Glassmorphism) */}
          <div className="absolute top-4 bottom-0 left-0 right-16 rounded-[28px] z-10 transition-transform duration-500 origin-left group-hover:-rotate-y-12 bg-white/40 dark:bg-[#2A2A2C]/65 backdrop-blur-[12px] shadow-[15px_0_25px_rgba(0,0,0,0.1)] dark:shadow-[15px_0_25px_rgba(0,0,0,0.25)] border-t border-white/60 dark:border-white/15 border-l border-white/40 dark:border-white/10 border-r border-white/30 dark:border-white/5">
          </div>
      </div>
    </div>
  );
};
