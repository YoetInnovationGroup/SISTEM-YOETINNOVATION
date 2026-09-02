import React from 'react';
import { Settings } from 'lucide-react';
import { ComingSoonSpotlight } from '../common/ComingSoonSpotlight.tsx';

interface ConfiguracionViewProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export const ConfiguracionView: React.FC<ConfiguracionViewProps> = () => {
  return (
    <ComingSoonSpotlight
      sectionName="Configuración"
      badgeText="Próximamente"
      icon={Settings}
      accentColor="blue"
      headline="Configuración"
      description="Pronto podrás gestionar los ajustes generales y preferencias del sistema."
    />
  );
};

