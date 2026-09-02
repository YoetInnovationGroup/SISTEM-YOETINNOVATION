import React from 'react';
import { CheckSquare } from 'lucide-react';
import { ComingSoonSpotlight } from '../common/ComingSoonSpotlight.tsx';

export const TareasView: React.FC = () => {
  return (
    <ComingSoonSpotlight
      sectionName="Tareas"
      badgeText="Próximamente"
      icon={CheckSquare}
      accentColor="indigo"
      headline="Tareas"
      description="Pronto podrás organizar los pendientes y tareas de la notaría desde este espacio."
    />
  );
};

