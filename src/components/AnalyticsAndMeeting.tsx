import React from 'react';
import { TrendingUp, Activity, Users } from 'lucide-react';
import { PremiumEmptyState } from './common/PremiumEmptyState.tsx';

export const AnalyticsAndMeeting: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 h-32">
        <PremiumEmptyState 
          icon={TrendingUp}
          minHeight="100%" 
          title="Métricas" 
          subtitle="Rendimiento del mes." 
        />
        <PremiumEmptyState 
          icon={Activity}
          minHeight="100%" 
          title="Actividad" 
          subtitle="Ritmo operativo estable." 
        />
      </div>

      {/* Bottom: Board Meeting Card */}
      <div 
        id="card-board-meeting"
        className="bg-white dark:bg-[#141417] rounded-3xl p-5 border border-neutral-200/70 dark:border-[#26262B] shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between flex-1 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-50">Próximas Reuniones</h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Agenda</span>
        </div>

        <PremiumEmptyState 
          icon={Users}
          minHeight="100px"
          title="Sin reuniones programadas"
          subtitle="No hay firmas ni juntas registradas para los próximos días."
        />
      </div>
    </div>
  );
};
