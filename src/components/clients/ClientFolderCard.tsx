import React from 'react';
import type { Client } from '../../types/client';
import { Share, Star, Bookmark, ExternalLink } from 'lucide-react';

interface ClientFolderCardProps {
  client: Client;
  index?: number;
  onSelect: (id: string) => void;
}

export const ClientFolderCard: React.FC<ClientFolderCardProps> = ({ client, onSelect }) => {
  const activeServices = client.services?.filter((s) => s.status === 'En proceso').length || 0;
  const completedServices = client.services?.filter((s) => s.status === 'Completado').length || 0;

  const role = client.corporateType || client.occupation || (client.personType === 'juridica' ? 'Entidad Comercial' : 'Cliente Particular');
  const tag1 = client.personType === 'juridica' ? 'Jurídica' : 'Física';
  const tag2 = client.status || 'Activo';

  const avatarUrl = client.avatar || (client.personType === 'juridica'
    ? 'https://i.imgur.com/94tooVn.png'
    : 'https://i.imgur.com/7wCr3WQ.png');

  return (
    <div 
      className="relative w-full rounded-[36px] p-7 sm:p-8 shadow-sm hover:shadow-md dark:shadow-none bg-white dark:bg-[#141417] border border-neutral-200/80 dark:border-[#26262B] transition-transform duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
    >
      <div>
        {/* Avatar */}
        <div className={`rounded-full overflow-hidden mb-4 shrink-0 border-2 border-neutral-100 dark:border-[#26262B] shadow-2xs flex items-center justify-center ${
          client.personType === 'juridica' 
            ? 'w-16 h-16 bg-white' 
            : 'w-14 h-14 bg-neutral-100 dark:bg-[#1C1C21]'
        }`}>
          <img 
            src={avatarUrl} 
            alt={client.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full ${client.personType === 'juridica' ? 'object-contain p-1' : 'object-cover'}`}
          />
        </div>

        {/* Info */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white leading-tight pr-2 line-clamp-1">
          {client.name}
        </h3>
        <p className="text-base font-medium text-neutral-600 dark:text-neutral-300 mt-1.5 line-clamp-1">
          {role}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          <span className="px-4 py-1.5 bg-neutral-100 dark:bg-[#1E1E24] border border-neutral-200/90 dark:border-[#2C2C35] rounded-full text-xs sm:text-[13px] font-bold text-neutral-800 dark:text-neutral-200">
            {tag1}
          </span>
          <span className="px-4 py-1.5 bg-neutral-100 dark:bg-[#1E1E24] border border-neutral-200/90 dark:border-[#2C2C35] rounded-full text-xs sm:text-[13px] font-bold text-neutral-800 dark:text-neutral-200">
            {tag2}
          </span>
        </div>
      </div>

      <div>
        {/* Stats Row */}
        <div className="flex items-center justify-around mt-8 pt-5 border-t border-neutral-100 dark:border-[#222228]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-lg font-bold text-neutral-900 dark:text-white">
              <Star className="w-5 h-5 fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white" />
              <span>{activeServices}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">Activos</span>
          </div>
          
          <div className="w-[1px] h-9 bg-neutral-200 dark:bg-[#282830]"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">{completedServices}</span>
            <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">Finalizados</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-7">
          <button
            type="button"
            onClick={() => onSelect(client.id)}
            className="w-full py-4 px-5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 rounded-2xl text-sm sm:text-base font-bold shadow-xs transition-colors cursor-pointer"
          >
            Abrir expediente
          </button>
        </div>
      </div>
    </div>
  );
};
