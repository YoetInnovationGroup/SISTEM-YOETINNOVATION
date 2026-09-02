import React from 'react';
import { 
  LayoutGrid,
  Users,
  CheckSquare,
  Settings,
  PieChart, 
  Bell,
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarDockProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({ 
  activeTab = 'dashboard', 
  onSelectTab 
}) => {
  return (
    <aside 
      id="sidebar-dock" 
      aria-label="Sidebar Navigation"
      className="relative z-20 flex flex-col items-center shrink-0 text-white select-none transition-all mt-2 md:mt-4 self-start py-4 w-16 md:w-20"
      style={{ minHeight: '520px' }}
    >
      {/* Organic UNION Blue Background Wave Shape with Apple depth */}
      <svg 
        className="absolute inset-0 w-full h-full -z-10 filter drop-shadow-[0_12px_28px_rgba(37,117,252,0.3)]" 
        viewBox="0 0 80 560" 
        preserveAspectRatio="none" 
        fill="none"
      >
        <defs>
          <linearGradient id="sidebarWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2575FC" />
            <stop offset="50%" stopColor="#2169C4" />
            <stop offset="100%" stopColor="#0A192F" />
          </linearGradient>
        </defs>
        <path
          d="M 0 0 
             C 0 35, 18 50, 46 68 
             C 68 82, 80 98, 80 120 
             L 80 440 
             C 80 462, 68 478, 46 492 
             C 18 510, 0 525, 0 560 
             Z"
          fill="url(#sidebarWaveGrad)"
        />
      </svg>

      {/* Navigation Icon Stack - Positioned starting where column reaches full 80px width */}
      <nav className="flex flex-col items-center space-y-3.5 flex-1 w-full px-2 pt-20 pb-10" aria-label="Navegación principal">
        
        {/* Panel / Dashboard (Standard Icon & Same Size as Others) */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="sidebar-brand-btn"
          type="button"
          title="Panel"
          aria-label="Panel"
          onClick={() => onSelectTab?.('dashboard')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'bg-white/25 text-white shadow-xs font-bold' 
              : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <LayoutGrid className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

        {/* Clientes */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="nav-clientes"
          type="button"
          title="Clientes"
          aria-label="Clientes"
          onClick={() => onSelectTab?.('clientes')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'clientes' ? 'bg-white/25 text-white shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <Users className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

        {/* Tareas */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="nav-tareas"
          type="button"
          title="Tareas"
          aria-label="Tareas"
          onClick={() => onSelectTab?.('tareas')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'tareas' ? 'bg-white/25 text-white shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <CheckSquare className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

        {/* Alertas */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="nav-alertas"
          type="button"
          title="Alertas"
          aria-label="Alertas"
          onClick={() => onSelectTab?.('alertas')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'alertas' ? 'bg-white/25 text-white shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <Bell className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

        {/* Reportes */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="nav-reportes"
          type="button"
          title="Reportes"
          aria-label="Reportes"
          onClick={() => onSelectTab?.('reportes')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'reportes' ? 'bg-white/25 text-white shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <PieChart className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

        {/* Configuracion */}
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
          id="nav-configuracion"
          type="button"
          title="Configuración"
          aria-label="Configuración"
          onClick={() => onSelectTab?.('configuracion')}
          className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'configuracion' ? 'bg-white/25 text-white shadow-xs' : 'text-white/80 hover:text-white hover:bg-white/15'
          }`}
        >
          <Settings className="w-4 h-4" strokeWidth={2.2} />
        </motion.button>

      </nav>
    </aside>
  );
};
