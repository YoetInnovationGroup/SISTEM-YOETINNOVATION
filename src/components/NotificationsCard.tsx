import React from 'react';
import { Bell } from 'lucide-react';
import { PremiumEmptyState } from './common/PremiumEmptyState.tsx';

export const NotificationsCard: React.FC = () => {
  return (
    <div 
      id="card-notifications"
      className="flex flex-col h-full bg-white dark:bg-[#141417] rounded-3xl p-5 border border-neutral-200/70 dark:border-[#26262B] shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">Notificaciones</h2>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">0 nuevas</span>
      </div>

      <PremiumEmptyState 
        icon={Bell}
        title="Sin notificaciones"
        subtitle="Los avisos y alertas registrales aparecerán aquí."
      />
    </div>
  );
};
