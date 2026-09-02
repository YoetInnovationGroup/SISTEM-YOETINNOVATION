import React from 'react';
import { PieChart } from 'lucide-react';
import { ComingSoonSpotlight } from '../common/ComingSoonSpotlight.tsx';

export const ReportesView: React.FC = () => {
  return (
    <ComingSoonSpotlight
      sectionName="Reportes"
      badgeText="Próximamente"
      icon={PieChart}
      accentColor="emerald"
      headline="Reportes"
      description="Pronto podrás consultar estadísticas y generar informes de la notaría."
    />
  );
};

