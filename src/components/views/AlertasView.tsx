import React from 'react';
import { Bell } from 'lucide-react';
import { ComingSoonSpotlight } from '../common/ComingSoonSpotlight.tsx';

export const AlertasView: React.FC = () => {
  return (
    <ComingSoonSpotlight
      sectionName="Alertas"
      badgeText="Próximamente"
      icon={Bell}
      accentColor="amber"
      headline="Alertas"
      description="Pronto podrás consultar avisos de vencimientos, trámites y recordatorios importantes."
    />
  );
};

