import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Search, 
  Plus, 
  FileText, 
  ArrowRight, 
  CheckCircle2,
  X,
  FolderOpen,
  Check
} from 'lucide-react';
import { Client, NotaryServiceItem } from '../../types/client';
import { ClientFolderCard } from './ClientFolderCard';
import { DarkFolderEmptyState } from '../DarkFolderEmptyState';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

interface ClientDirectoryProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onAddClient: (newClient: Client) => void;
}

export const ClientDirectory: React.FC<ClientDirectoryProps> = ({
  clients,
  onSelectClient,
  onAddClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fisica' | 'juridica'>('all');
  const [viewMode, setViewMode] = useState<'folders' | 'list'>('folders');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  useLockBodyScroll(isAddModalOpen);

  // Always reset scroll to top when opening directory
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // New Client Form State
  const [formData, setFormData] = useState({
    name: '',
    personType: 'fisica' as 'fisica' | 'juridica',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    nationality: 'Costarricense',
    civilStatus: 'Soltero(a)',
    occupation: '',
    initialServiceType: 'Constitución de Sociedad',
    initialFee: '$1,200',
  });

  // Reset or initialize when changing personType
  const handlePersonTypeChange = (type: 'fisica' | 'juridica') => {
    setFormData((prev) => ({
      ...prev,
      personType: type,
      civilStatus: type === 'juridica' ? 'Persona Jurídica (S.A./S.R.L.)' : 'Soltero(a)',
      occupation: type === 'juridica' ? 'Comercio y Servicios' : prev.occupation,
    }));
  };

  // Calculate totals
  const totalPhysical = clients.filter(c => c.personType === 'fisica').length;
  const totalJuridical = clients.filter(c => c.personType === 'juridica').length;
  const totalDocsArchived = clients.reduce((acc, c) => {
    const cDocs = [
      ...(c.referenceDocuments || []),
      ...(c.services || []).flatMap(s => s.documents || [])
    ];
    return acc + cDocs.length;
  }, 0);
  const totalActiveServices = clients.reduce((acc, c) => acc + (c.services?.filter(s => s.status === 'En proceso').length || 0), 0);

  // Filtering
  const filteredClients = clients.filter((c) => {
    const matchesType = typeFilter === 'all' || c.personType === typeFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.idNumber.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.occupation.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  const handleCreateClient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.idNumber.trim()) {
      return;
    }

    const initialService: NotaryServiceItem = {
      id: `serv-${Date.now()}`,
      serviceType: formData.initialServiceType,
      startDate: new Date().toLocaleDateString('es-CR'),
      fee: formData.initialFee.trim() ? (formData.initialFee.startsWith('$') ? formData.initialFee : `$${formData.initialFee}`) : '$1,000',
      status: 'En proceso',
      protocolNumber: `Tomo XLV - Asiento ${Math.floor(Math.random() * 50) + 100}`,
      folioNumber: `Folio ${Math.floor(Math.random() * 100) + 150}`,
      description: `Apertura de expediente y trámite notarial inicial de ${formData.initialServiceType}.`,
      relatedPersons: [],
      documents: [],
      requirements: [
        { id: `req-new-1`, name: 'Verificación de documento de identidad oficial', completed: true },
        { id: `req-new-2`, name: 'Estudio de capacidad y personerías legales', completed: false },
      ],
      ddc: {
        riskLevel: 'Bajo',
        status: 'Pendiente',
        pepStatus: false,
        originOfFunds: 'Ingresos por actividades profesionales y comerciales declaradas.',
        verifiedDate: new Date().toLocaleDateString('es-CR'),
        beneficialOwnerDeclared: formData.personType === 'juridica',
      },
      tasks: [
        { id: `t-1`, title: 'Verificación de firmas y huellas en protocolo', completed: false, priority: 'alta' },
        { id: `t-2`, title: 'Inscripción y recepción de boletas de registro', completed: false, priority: 'media' },
      ],
      historyLog: [
        {
          id: `h-1`,
          date: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
          action: 'Apertura de expediente y alta de cliente',
          author: 'Notario Titular',
        },
      ],
    };

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: formData.name.trim(),
      personType: formData.personType,
      idNumber: formData.idNumber.trim(),
      phone: formData.phone.trim() || '+506 2200-0000',
      email: formData.email.trim() || 'cliente@notaria.cr',
      address: formData.address.trim() || 'San José, Costa Rica',
      nationality: formData.nationality.trim() || 'Costarricense',
      civilStatus: formData.civilStatus,
      occupation: formData.occupation.trim() || (formData.personType === 'juridica' ? 'Comercio y Servicios' : 'Profesional Independiente'),
      registrationDate: new Date().toLocaleDateString('es-CR'),
      lastActivity: 'Hoy (alta de expediente)',
      status: 'Activo',
      notes: 'Expediente creado en el sistema notarial. Pendiente recepción de firmas.',
      services: [initialService],
      referenceDocuments: [],
    };

    onAddClient(newClient);
    setIsAddModalOpen(false);
    // Reset
    setFormData({
      name: '',
      personType: 'fisica',
      idNumber: '',
      phone: '',
      email: '',
      address: '',
      nationality: 'Costarricense',
      civilStatus: 'Soltero(a)',
      occupation: '',
      initialServiceType: 'Constitución de Sociedad',
      initialFee: '$1,200',
    });
  };

  return (
    <div className="space-y-7 pb-16 w-full">
      {/* Header with Apple / Gemini Design Architecture */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Directorio de Expedientes y Clientes
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl font-normal">
            Administra y consulta los expedientes, trámites y documentos de tus clientes en un solo lugar.
          </p>
        </div>

        {/* Action Controls & Top Button */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          {/* New Client Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white rounded-2xl text-sm font-bold shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Nueva Carpeta de Cliente</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="apple-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-3.5 rounded-2xl border border-black/[0.05] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar carpetas por nombre, cédula o tipo de trámite..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/90 dark:bg-[#18181F] border border-black/[0.05] dark:border-white/[0.07] rounded-xl text-sm font-medium text-neutral-850 dark:text-neutral-150 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl border border-black/[0.04] dark:border-white/[0.06] shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-white dark:bg-[#1E1E24] text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Todas ({clients.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('fisica')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              typeFilter === 'fisica'
                ? 'bg-white dark:bg-[#1E1E24] text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Físicas ({totalPhysical})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('juridica')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              typeFilter === 'juridica'
                ? 'bg-white dark:bg-[#1E1E24] text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Jurídicas ({totalJuridical})
          </button>
        </div>
      </div>

      {/* Main Content: Folder Grid vs List View */}
      {viewMode === 'folders' ? (
        /* Real Geometric Folder Deck Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-7 pt-4">
          {filteredClients.map((client, index) => (
            <ClientFolderCard
              key={client.id}
              client={client}
              index={index}
              onSelect={onSelectClient}
            />
          ))}
        </div>
      ) : (
        /* Detailed List View */
        <div className="apple-card rounded-3xl border border-black/[0.05] dark:border-white/[0.08] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-300 font-bold border-b border-black/[0.05] dark:border-white/[0.06]">
                <tr>
                  <th className="py-4 px-5">Cliente</th>
                  <th className="py-4 px-4">Identificación</th>
                  <th className="py-4 px-4">Trámite Principal</th>
                  <th className="py-4 px-4">Documentos</th>
                  <th className="py-4 px-4">Contacto</th>
                  <th className="py-4 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {filteredClients.map((client) => {
                  const isJuridica = client.personType === 'juridica';
                  const mainService = client.services?.[0]?.serviceType || 'Constitución de Sociedad';
                  const allDocs = [
                    ...(client.referenceDocuments || []),
                    ...(client.services || []).flatMap(s => s.documents || [])
                  ];
                  const readyDocs = allDocs.filter(d => d.status === 'Aportado').length;
                  const totalDocs = allDocs.length;

                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => onSelectClient(client.id)}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-4.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isJuridica 
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                              : 'bg-violet-50 dark:bg-violet-950/60 text-[#7C3AED] dark:text-[#C4B5FD]'
                          }`}>
                            {isJuridica ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors">
                              {client.name}
                            </span>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">{client.occupation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-4 font-mono font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                        {client.idNumber}
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#1E1E24] text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm">
                          {mainService}
                        </span>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{readyDocs} de {totalDocs} listos</span>
                        </span>
                      </td>
                      <td className="py-4.5 px-4 text-neutral-600 dark:text-neutral-400 font-medium text-sm">
                        <div className="truncate max-w-[200px]">{client.email}</div>
                      </td>
                      <td className="py-4.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1.5 font-bold text-sm text-[#7C3AED] dark:text-[#C4B5FD] group-hover:underline">
                          <span>Abrir Carpeta</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="w-full">
          <DarkFolderEmptyState
            title="Expect to see your orders appear here soon!"
            subtitle="Here is where you'll manage order fulfillment, payment collection, and order progress tracking."
            buttonText="Create New"
            onCreateNew={() => setIsAddModalOpen(true)}
          />
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#141417] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[88vh] my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0 bg-white dark:bg-[#141417]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center shadow-xs shrink-0">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                      Crear Nueva Carpeta Notarial
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Registro de cliente y apertura de expediente notarial
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body - Single Unified Clean Layout */}
              <form 
                onSubmit={handleCreateClient} 
                className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* DATOS DEL CLIENTE */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                        Datos del Cliente
                      </h4>
                    </div>
                  </div>

                  {/* Person Type Selector */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      Tipo de persona
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handlePersonTypeChange('fisica')}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm sm:text-base font-bold cursor-pointer transition-all ${
                          formData.personType === 'fisica'
                            ? 'bg-violet-50 dark:bg-violet-950/60 border-[#7C3AED] text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs'
                            : 'border-neutral-200 dark:border-[#2A2A32] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1C1C21]'
                        }`}
                      >
                        <User className="w-4.5 h-4.5" />
                        <span>Persona Física</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePersonTypeChange('juridica')}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm sm:text-base font-bold cursor-pointer transition-all ${
                          formData.personType === 'juridica'
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'border-neutral-200 dark:border-[#2A2A32] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1C1C21]'
                        }`}
                      >
                        <Building2 className="w-4.5 h-4.5" />
                        <span>Persona Jurídica</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        {formData.personType === 'juridica' ? 'Razón Social / Denominación' : 'Nombre Completo del Cliente'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={formData.personType === 'juridica' ? 'Ej: Corporación Inmobiliaria del Valle S.A.' : 'Ej: Lic. Juan Carlos Solano Arias'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        {formData.personType === 'juridica' ? 'Cédula Jurídica' : 'Cédula de Identidad / Pasaporte'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={formData.personType === 'juridica' ? 'Ej: 3-101-998877' : 'Ej: 1-1122-3344'}
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base font-mono font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="contacto@notaria.cr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="text"
                        placeholder="+506 2200-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Nacionalidad
                        </label>
                        <select
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                        >
                          <option value="Costarricense">Costarricense</option>
                          <option value="Nicaragüense">Nicaragüense</option>
                          <option value="Colombiano(a)">Colombiano(a)</option>
                          <option value="Panameño(a)">Panameño(a)</option>
                          <option value="Estadounidense">Estadounidense</option>
                          <option value="Español(a)">Español(a)</option>
                          <option value="Mexicano(a)">Mexicano(a)</option>
                          <option value="Otra">Otra</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Estado Civil
                        </label>
                        <select
                          value={formData.civilStatus}
                          onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                        >
                          <option value="Soltero(a)">Soltero(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Viudo(a)">Viudo(a)</option>
                          <option value="Unión de Hecho">Unión de Hecho</option>
                          <option value="Persona Jurídica (S.A./S.R.L.)">Persona Jurídica (S.A./S.R.L.)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Ocupación o Profesión
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Ingeniero, Abogado, Empresario..."
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Dirección Domiciliar
                      </label>
                      <input
                        type="text"
                        placeholder="Provincia, Cantón, Distrito y señas exactas"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-sm sm:text-base text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
                      />
                    </div>
                  </div>

                  {/* Initial Service Settings */}
                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#1A1A20] border border-neutral-200/70 dark:border-[#2A2A32] mt-4">
                    <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3">
                      Trámite Notarial Inicial
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Tipo de Servicio Notarial</label>
                        <select
                          value={formData.initialServiceType}
                          onChange={(e) => setFormData({ ...formData, initialServiceType: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-white dark:bg-[#141417] text-sm sm:text-base font-semibold text-neutral-900 dark:text-white outline-none"
                        >
                          <option value="Constitución de Sociedad">Constitución de Sociedad</option>
                          <option value="Poder">Poder</option>
                          <option value="Fideicomiso">Fideicomiso</option>
                          <option value="Testamentos">Testamentos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Honorario Notarial Estimado ($)</label>
                        <input
                          type="text"
                          value={formData.initialFee}
                          onChange={(e) => setFormData({ ...formData, initialFee: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-white dark:bg-[#141417] text-sm sm:text-base font-semibold text-neutral-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/80 dark:border-[#26262B] sticky bottom-0 bg-white dark:bg-[#141417] py-2.5 -mb-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-[#202026] rounded-xl hover:bg-neutral-200 cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Crear Carpeta Notarial</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
