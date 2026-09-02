import React from 'react';
import { 
  Bell, 
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';

interface TopNavbarProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onSearch?: (query: string) => void;
  onAddNewBoard?: () => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeSection,
  onSelectSection
}) => {
  return (
    <header id="top-navbar" className="flex items-center justify-between gap-4 w-full pb-2 pt-0 select-none">
      {/* Brand: Favicon Icon + Yoet Text Image (Static Display Only) */}
      <div 
        className="flex items-center gap-0 select-none pointer-events-none cursor-default"
      >
        {/* Favicon Logo Mark */}
        <img 
          src="https://i.imgur.com/oIHIGTx.png" 
          alt="Yoet Favicon" 
          referrerPolicy="no-referrer"
          className="h-10 sm:h-12 md:h-14 w-auto object-contain brightness-0 shrink-0 pointer-events-none select-none"
        />
        {/* Yoet Text Brand - Static Logo */}
        <img 
          src="https://i.imgur.com/KAyqArH.png" 
          alt="Yoet" 
          referrerPolicy="no-referrer"
          className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain brightness-0 shrink-0 -ml-5 sm:-ml-7 md:-ml-9 lg:-ml-10 pointer-events-none select-none"
        />
      </div>

      {/* Right Controls - Only visible on Dashboard */}
      {activeSection === 'dashboard' && (
        <div className="flex items-center space-x-1.5 ml-auto">
          {/* Action Icons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-quick-bell"
            type="button"
            aria-label="Alertas"
            title="Alertas"
            onClick={() => onSelectSection?.('alertas')}
            className="p-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-quick-settings"
            type="button"
            aria-label="Configuración"
            title="Configuración"
            onClick={() => onSelectSection?.('configuracion')}
            className="p-2 text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </motion.button>
        </div>
      )}
    </header>
  );
};


