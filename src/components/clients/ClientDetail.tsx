import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, NotaryServiceItem } from '../../types/client';
import { ServiceDetailModal } from './ServiceDetailModal';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Pencil,
  FileText,
  Briefcase,
  Plus,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  ShieldAlert,
  FolderOpen,
  Trash2
} from 'lucide-react';

interface ClientDetailProps {
  client: Client;
  allClients: Client[];
  onBack: () => void;
  onUpdateClient: (updatedClient: Client) => void;
  onSelectClientById: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
}

export const ClientDetail: React.FC<ClientDetailProps> = ({
  client,
  allClients,
  onBack,
  onUpdateClient,
  onSelectClientById,
  onDeleteClient,
}) => {
  // Services filtering state
  const [servicesFilter, setServicesFilter] = useState<'activos' | 'completados'>('activos');
  const [selectedService, setSelectedService] = useState<NotaryServiceItem | null>(null);

  // Modals state
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  useLockBodyScroll(isEditingClient || isAddingService || isConfirmingDelete);
  const [showClientsDropdown, setShowClientsDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDeleteClientConfirm = () => {
    setIsConfirmingDelete(false);
    if (onDeleteClient) {
      onDeleteClient(client.id);
    }
    onBack();
  };

  // New Service Form State
  const [newServiceType, setNewServiceType] = useState('Constitución de Sociedad');
  const [newServiceFee, setNewServiceFee] = useState('$1,200');
  const [newServiceDescription, setNewServiceDescription] = useState('');

  // Client & Service Edit Form State
  const isJuridica = client?.personType === 'juridica';
  const avatarUrl = client?.avatar || (isJuridica
    ? 'https://i.imgur.com/94tooVn.png'
    : 'https://i.imgur.com/7wCr3WQ.png');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [client?.id, client?.avatar]);

  const [editFormData, setEditFormData] = useState({
    name: client?.name || '',
    personType: client?.personType || 'juridica',
    avatar: client?.avatar || '',
    idNumber: client?.idNumber || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    nationality: client?.nationality || 'Costarricense',
    corporateType: client?.corporateType || (isJuridica ? 'Sociedad Anónima (S.A.)' : ''),
    civilStatus: client?.civilStatus || (!isJuridica ? 'Casado(a) una vez' : 'No aplica'),
    occupation: client?.occupation || '',
    // Service fields
    selectedServiceId: client?.services?.[0]?.id || '',
    serviceType: client?.services?.[0]?.serviceType || 'Constitución de Sociedad',
    serviceFee: client?.services?.[0]?.fee || '$1,200',
    serviceStatus: client?.services?.[0]?.status || 'En proceso',
    serviceDescription: client?.services?.[0]?.description || '',
  });

  // Ensure view starts from the top whenever client is opened/changed or a service is selected/closed
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.scrollTop = 0;
      if (mainEl.scrollTo) mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [client?.id, selectedService]);

  if (!client) {
    return (
      <div className="bg-white dark:bg-[#141417] rounded-3xl p-8 border border-neutral-200/80 dark:border-[#26262B] text-center space-y-4 my-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Cliente no encontrado</h3>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Lista de Clientes
        </button>
      </div>
    );
  }

  // Safe client fields
  const clientName = client.name || 'Sin nombre registrado';
  const idNumber = client.idNumber || '—';
  const phone = client.phone || '—';
  const email = client.email || '—';
  const address = client.address || '—';
  const nationality = client.nationality || 'Costarricense';
  const occupation = client.occupation || '—';
  const notes = client.notes ?? '';
  const services = Array.isArray(client.services) ? client.services : [];

  // Determine Corporate Type or Civil Status properly
  const corporateTypeDisplay = client.corporateType || (isJuridica ? 'Sociedad Anónima (S.A.)' : undefined);
  const civilStatusDisplay = !isJuridica ? (client.civilStatus || 'Soltero(a)') : undefined;

  // Compute stats
  const activeServices = useMemo(() => services.filter((s) => s.status === 'En proceso'), [services]);
  const completedServices = useMemo(() => services.filter((s) => s.status === 'Completado'), [services]);

  // Filtered services
  const displayedServices = useMemo(() => {
    if (servicesFilter === 'activos') return activeServices;
    if (servicesFilter === 'completados') return completedServices;
    return services;
  }, [services, servicesFilter, activeServices, completedServices]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Notes change with auto-save
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = {
      ...client,
      notes: e.target.value,
      lastActivity: 'Hoy (observaciones actualizadas)'
    };
    onUpdateClient(updated);
  };

  // Save Client & Service Edit
  const handleSaveClientEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const isJur = editFormData.personType === 'juridica';

    let updatedServices = client.services ? [...client.services] : [];
    if (editFormData.selectedServiceId) {
      updatedServices = updatedServices.map((s) => {
        if (s.id === editFormData.selectedServiceId) {
          return {
            ...s,
            serviceType: editFormData.serviceType,
            fee: editFormData.serviceFee.trim() ? (editFormData.serviceFee.startsWith('$') ? editFormData.serviceFee : `$${editFormData.serviceFee}`) : s.fee,
            status: editFormData.serviceStatus as 'En proceso' | 'Completado',
            description: editFormData.serviceDescription,
          };
        }
        return s;
      });
    }

    const updated: Client = {
      ...client,
      name: editFormData.name.trim() || client.name,
      avatar: editFormData.avatar?.trim() || client.avatar,
      personType: editFormData.personType,
      idNumber: editFormData.idNumber.trim() || client.idNumber,
      phone: editFormData.phone.trim() || client.phone,
      email: editFormData.email.trim() || client.email,
      address: editFormData.address.trim() || client.address,
      nationality: editFormData.nationality.trim() || client.nationality,
      corporateType: isJur ? editFormData.corporateType : undefined,
      civilStatus: isJur ? 'No aplica' : editFormData.civilStatus,
      occupation: editFormData.occupation.trim() || client.occupation,
      services: updatedServices,
      lastActivity: 'Hoy (datos del cliente y servicio actualizados)'
    };

    onUpdateClient(updated);
    if (selectedService && editFormData.selectedServiceId === selectedService.id) {
      const updatedSelected = updatedServices.find((s) => s.id === selectedService.id);
      if (updatedSelected) setSelectedService(updatedSelected);
    }
    setIsEditingClient(false);
    showToast('Datos del cliente y trámite notarial actualizados');
  };

  // Add New Service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newServ: NotaryServiceItem = {
      id: `serv-${Date.now()}`,
      serviceType: newServiceType,
      startDate: new Date().toLocaleDateString('es-CR'),
      fee: newServiceFee.trim() ? (newServiceFee.startsWith('$') ? newServiceFee : `$${newServiceFee}`) : '$0',
      status: 'En proceso',
      protocolNumber: `Tomo XLVI - Asiento ${Math.floor(Math.random() * 80) + 120}`,
      folioNumber: `Folio ${Math.floor(Math.random() * 200) + 250}`,
      description: newServiceDescription.trim() || `Actuación notarial de ${newServiceType} solicitada por el cliente.`,
      relatedPersons: [],
      ddc: {
        riskLevel: 'Bajo',
        status: 'Cumplido',
        pepStatus: false,
        originOfFunds: 'Operación comercial declarada lícita',
        verifiedDate: new Date().toLocaleDateString('es-CR'),
        beneficialOwnerDeclared: true
      },
      documents: [],
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Cotejo de personerías y facultades de otorgamiento', completed: true, priority: 'alta' },
        { id: `t-${Date.now()}-2`, title: 'Redacción de matriz notarial en protocolo', completed: false, priority: 'alta' },
        { id: `t-${Date.now()}-3`, title: 'Firma de comparecientes y cancelación de timbres', completed: false, priority: 'alta' }
      ]
    };

    const updated = {
      ...client,
      services: [newServ, ...services],
      lastActivity: 'Hoy (nuevo servicio contratado)'
    };

    onUpdateClient(updated);
    setIsAddingService(false);
    setNewServiceDescription('');
    showToast(`Servicio "${newServiceType}" creado exitosamente`);
    // Open the new service expediente immediately
    setSelectedService(newServ);
  };

  // Handle service status update
  const handleUpdateServiceStatus = (serviceId: string, newStatus: 'En proceso' | 'Completado') => {
    const updatedServices = services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, status: newStatus };
      }
      return s;
    });

    onUpdateClient({
      ...client,
      services: updatedServices,
      lastActivity: 'Hoy (servicio actualizado)'
    });

    if (selectedService && selectedService.id === serviceId) {
      setSelectedService({ ...selectedService, status: newStatus });
    }
  };

  // Handle service item deep update
  const handleUpdateService = (updatedServ: NotaryServiceItem) => {
    const updatedServices = services.map((s) => (s.id === updatedServ.id ? updatedServ : s));
    onUpdateClient({
      ...client,
      services: updatedServices,
      lastActivity: 'Hoy (expediente de servicio actualizado)'
    });
    setSelectedService(updatedServ);
  };

  return (
    <div className="space-y-6 pb-16 w-full max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-2xl shadow-xl border border-white/10"
          >
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedService ? (
        <ServiceDetailModal
          service={selectedService}
          clientName={clientName}
          clientIdNumber={idNumber}
          onClose={() => setSelectedService(null)}
          onUpdateService={handleUpdateService}
          onUpdateServiceStatus={handleUpdateServiceStatus}
        />
      ) : (
        <>
          {/* Back navigation button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-[#26262B] bg-white dark:bg-[#141417] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#1C1C21] text-sm sm:text-base font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>Volver al directorio de clientes</span>
            </button>
          </div>

      {/* 1. ENCABEZADO DEL CLIENTE */}
      <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-8 lg:p-9 border border-neutral-200/80 dark:border-[#26262B] shadow-sm transition-colors">
        
        {/* Main Client Profile Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex items-center justify-center shrink-0">
              {!imageError ? (
                <div className={`rounded-full overflow-hidden border-2 border-neutral-100 dark:border-[#2A2A32] shadow-sm flex items-center justify-center shrink-0 ${
                  isJuridica
                    ? 'w-16 h-16 sm:w-20 sm:h-20 bg-white'
                    : 'w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 dark:bg-[#1E1E24]'
                }`}>
                  <img
                    src={avatarUrl}
                    alt={clientName}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className={`w-full h-full ${isJuridica ? 'object-contain p-1.5' : 'object-cover'}`}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-100 dark:bg-[#1E1E24] text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0 border-2 border-neutral-200/80 dark:border-[#2A2A32] shadow-sm">
                  {isJuridica ? <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-700 dark:text-neutral-300" /> : <User className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-700 dark:text-neutral-300" />}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                  {clientName}
                </h1>
                
                {/* Status indicator */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 text-xs sm:text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {activeServices.length} {activeServices.length === 1 ? 'trámite activo' : 'trámites activos'}
                </span>
              </div>

              {/* Persona Jurídica · Cédula jurídica */}
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-medium flex flex-wrap items-center gap-2.5">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isJuridica ? 'Persona Jurídica' : 'Persona Física'}</span>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                  {isJuridica ? `Cédula jurídica ${idNumber}` : `Cédula de identidad ${idNumber}`}
                </span>
              </p>

              {/* Email & Phone Contact */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                <span 
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100/70 dark:bg-[#1E1E24] text-neutral-800 dark:text-neutral-200 cursor-default select-text"
                >
                  <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                  <span className="font-medium">{email}</span>
                </span>
                <span 
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100/70 dark:bg-[#1E1E24] text-neutral-800 dark:text-neutral-200 cursor-default select-text"
                >
                  <Phone className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                  <span className="font-medium">{phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Editar cliente & Eliminar cliente */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-center flex-wrap">
            <button
              type="button"
              onClick={() => {
                const firstService = client.services?.[0];
                setEditFormData({
                  name: client.name || '',
                  personType: client.personType || 'juridica',
                  avatar: client.avatar || '',
                  idNumber: client.idNumber || '',
                  phone: client.phone || '',
                  email: client.email || '',
                  address: client.address || '',
                  nationality: client.nationality || 'Costarricense',
                  corporateType: client.corporateType || (isJuridica ? 'Sociedad Anónima (S.A.)' : ''),
                  civilStatus: client.civilStatus || (!isJuridica ? 'Casado(a) una vez' : 'No aplica'),
                  occupation: client.occupation || '',
                  selectedServiceId: firstService?.id || '',
                  serviceType: firstService?.serviceType || 'Constitución de Sociedad',
                  serviceFee: firstService?.fee || '$1,200',
                  serviceStatus: firstService?.status || 'En proceso',
                  serviceDescription: firstService?.description || '',
                });
                setIsEditingClient(true);
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#1C1C21] dark:hover:bg-[#25252C] text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm font-bold rounded-xl border border-neutral-200/80 dark:border-[#2A2A32] shadow-2xs transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              <span>Editar cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4.5 py-2.5 sm:py-3 bg-rose-50 hover:bg-rose-100/90 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold rounded-xl border border-rose-200/90 dark:border-rose-900/50 shadow-2xs transition-colors cursor-pointer"
              title="Eliminar cliente"
            >
              <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Eliminar cliente</span>
            </button>
          </div>
        </div>

        {/* 7. RESUMEN SUPERIOR: FILA DE INDICADORES CLICABLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-7 pt-6 border-t border-neutral-100 dark:border-[#222228]">
          
          {/* Indicador 1: Trámites activos */}
          <button
            type="button"
            onClick={() => setServicesFilter('activos')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              servicesFilter === 'activos'
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 ring-2 ring-amber-500/20'
                : 'bg-neutral-50/70 dark:bg-[#1A1A20] border-neutral-200/80 dark:border-[#26262B] hover:bg-amber-50/40 dark:hover:bg-amber-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-[13px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                Trámites Activos
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                {activeServices.length}
              </span>
              <span className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 font-bold">
                en proceso
              </span>
            </div>
          </button>

          {/* Indicador 2: Finalizados */}
          <button
            type="button"
            onClick={() => setServicesFilter('completados')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              servicesFilter === 'completados'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 ring-2 ring-emerald-500/20'
                : 'bg-neutral-50/70 dark:bg-[#1A1A20] border-neutral-200/80 dark:border-[#26262B] hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-[13px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                Finalizados
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                {completedServices.length}
              </span>
              <span className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                concluidos
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* 2 & 3. INFORMACIÓN GENERAL + ANOTACIONES Y OBSERVACIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. INFORMACIÓN PERSONAL DEL CLIENTE (2 Columnas en pantallas anchas) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-8 lg:p-9 border border-neutral-200/80 dark:border-[#26262B] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-[#222228]">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-neutral-900 dark:text-neutral-50 text-lg sm:text-2xl">
                  Información Personal
                </h3>
              </div>
            </div>

            {/* Grid ordenado de datos generales con tamaño y espaciado ampliado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm sm:text-base">
              
              {/* Correo */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Correo electrónico:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold truncate max-w-[220px]" title={email}>
                  {email}
                </span>
              </div>

              {/* Teléfono */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Número telefónico:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">{phone}</span>
              </div>

              {/* Cédula */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">
                  {isJuridica ? 'Cédula jurídica:' : 'Cédula de identidad:'}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold font-mono">{idNumber}</span>
              </div>

              {/* Nacionalidad */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Nacionalidad:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">{nationality}</span>
              </div>

              {/* Tipo de persona */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Tipo de persona:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-neutral-100 dark:bg-[#202026] text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm font-bold">
                  {isJuridica ? 'Persona Jurídica' : 'Persona Física'}
                </span>
              </div>

              {/* Tipo societario (si es jurídica) / Estado civil (si es física) */}
              {isJuridica ? (
                <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                  <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Tipo societario:</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-bold">
                    {corporateTypeDisplay || 'Sociedad Anónima (S.A.)'}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026]">
                  <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm">Estado civil:</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-bold">
                    {civilStatusDisplay || 'Casado(a) una vez'}
                  </span>
                </div>
              )}

              {/* Actividad / Ocupación */}
              <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-[#202026] sm:col-span-2">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm shrink-0">
                  Ocupación o Profesión:
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold text-right truncate pl-4">
                  {occupation}
                </span>
              </div>

              {/* Dirección */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 py-2.5 border-b border-neutral-100 dark:border-[#202026] sm:col-span-2">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs sm:text-sm shrink-0">
                  Dirección Domiciliar:
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold text-left sm:text-right leading-relaxed">
                  {address}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* 3. ANOTACIONES Y OBSERVACIONES NOTARIALES (Visualmente secundaria) */}
        <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-[#26262B] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-[#222228]">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-200">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 dark:text-neutral-400" />
                <span>Anotaciones y observaciones</span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 mb-3 leading-normal">
              Notas generales aplicables al cliente (no pertenecen a un trámite específico).
            </p>

            <textarea
              value={notes}
              onChange={handleNotesChange}
              rows={6}
              placeholder="Escriba notas internas sobre el cliente, preferencias corporativas o advertencias..."
              className="w-full px-4 py-3.5 bg-neutral-50/80 dark:bg-[#1A1A20] border border-neutral-200/80 dark:border-[#26262B] rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="pt-3.5 text-xs text-neutral-400 dark:text-neutral-500 text-right font-medium">
            Última actualización: {client.lastActivity || 'Hoy'}
          </div>
        </div>

      </div>

      {/* 4. SERVICIOS CONTRATADOS (La sección MÁS importante) */}
      <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-[#26262B] shadow-sm space-y-5 transition-colors">
        
        {/* Header with Title + Filters + [+ Nuevo servicio] */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-[#222228]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl">
                Servicios contratados
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 text-xs font-bold">
                {services.length}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Cada servicio contratado cuenta con su propio expediente notarial independiente.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex bg-neutral-100 dark:bg-[#1C1C21] p-1 rounded-xl border border-neutral-200/60 dark:border-[#2A2A32] text-xs">
              <button
                type="button"
                onClick={() => setServicesFilter('activos')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  servicesFilter === 'activos'
                    ? 'bg-white dark:bg-[#141417] text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                En proceso ({activeServices.length})
              </button>
              <button
                type="button"
                onClick={() => setServicesFilter('completados')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  servicesFilter === 'completados'
                    ? 'bg-white dark:bg-[#141417] text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                Completados ({completedServices.length})
              </button>
            </div>

            {/* [+ Nuevo servicio] button */}
            <button
              type="button"
              onClick={() => setIsAddingService(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo servicio</span>
            </button>
          </div>
        </div>

        {/* Services List / Folder Grid */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-6 pt-4">
          {displayedServices.map((serv) => {
            const isServCompleted = serv.status === 'Completado';
            return (
              <div 
                key={serv.id} 
                className="folder-wrapper group"
                onClick={() => setSelectedService(serv)}
              >
                <div className="folder">
                  {/* Parte Trasera y Pestaña */}
                  <div className="folder-back">
                      <div className="folder-tab"></div>
                  </div>

                  {/* Documentos (Papeles) internos */}
                  <div className="paper paper-1">
                      <div className="paper-line"></div>
                      <div className="paper-line short"></div>
                  </div>
                  <div className="paper paper-2">
                      <div className="paper-line" style={{ marginTop: '20px' }}></div>
                      <div className="paper-line short"></div>
                  </div>
                  <div className="paper paper-3"></div>

                  {/* Tapa Frontal con Texto */}
                  <div className="folder-front">
                      <h3 className="folder-title" title={serv.serviceType}>
                        {serv.serviceType.length > 30 ? `${serv.serviceType.substring(0, 30)}...` : serv.serviceType}
                      </h3>
                      <p className="folder-subtitle">{serv.status}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {displayedServices.length === 0 && (
            <div className="w-full py-12 text-center bg-neutral-50 dark:bg-[#1A1A20] rounded-2xl border border-dashed border-neutral-200 dark:border-[#26262B]">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                No hay servicios registrados en esta categoría.
              </p>
              <button
                type="button"
                onClick={() => setIsAddingService(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar nuevo servicio</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: EDITAR CLIENTE */}
      <AnimatePresence>
        {isEditingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingClient(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#141417] border border-neutral-200/90 dark:border-[#26262B] rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[88vh] flex flex-col my-auto"
            >
              {/* Header Fijo */}
              <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-neutral-100 dark:border-[#26262B] bg-white dark:bg-[#141417]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                    Editar Ficha del Cliente & Trámite Notarial
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Actualice los datos generales del cliente y los detalles de su servicio o expediente notarial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingClient(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form con scroll fluido sin bloqueos de inercia */}
              <form onSubmit={handleSaveClientEdit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div 
                  className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {/* 1. SECCIÓN: DATOS DEL CLIENTE */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b border-neutral-100 dark:border-[#222228]">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white" />
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                        1. Información del Cliente
                      </h4>
                    </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Nombre Completo o Razón Social *
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                        required
                      />
                    </div>



                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Tipo de Persona
                      </label>
                      <select
                        value={editFormData.personType}
                        onChange={(e) => {
                          const newType = e.target.value as 'fisica' | 'juridica';
                          setEditFormData({
                            ...editFormData,
                            personType: newType,
                            corporateType: newType === 'juridica' ? 'Sociedad Anónima (S.A.)' : '',
                            civilStatus: newType === 'fisica' ? 'Casado(a) una vez' : 'No aplica'
                          });
                        }}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="juridica">Persona Jurídica (Empresa/Sociedad)</option>
                        <option value="fisica">Persona Física</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        {editFormData.personType === 'juridica' ? 'Cédula Jurídica' : 'Cédula de Identidad'} *
                      </label>
                      <input
                        type="text"
                        value={editFormData.idNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, idNumber: e.target.value })}
                        placeholder="Ej: 3-101-789456"
                        className="w-full px-4 py-2.5 text-sm sm:text-base font-mono rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Número Telefónico
                      </label>
                      <input
                        type="text"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Nacionalidad
                      </label>
                      <select
                        value={editFormData.nationality}
                        onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
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

                    {editFormData.personType === 'juridica' ? (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Tipo Societario
                        </label>
                        <select
                          value={editFormData.corporateType}
                          onChange={(e) => setEditFormData({ ...editFormData, corporateType: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                        >
                          <option value="Sociedad Anónima (S.A.)">Sociedad Anónima (S.A.)</option>
                          <option value="Sociedad de Responsabilidad Limitada (S.R.L.)">Sociedad de Resp. Limitada (S.R.L.)</option>
                          <option value="Empresa Individual de Responsabilidad Limitada (E.I.R.L.)">E.I.R.L.</option>
                          <option value="Sociedad Colectiva">Sociedad Colectiva</option>
                          <option value="Sucursal de Sociedad Extranjera">Sucursal Extranjera</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Estado Civil
                        </label>
                        <select
                          value={editFormData.civilStatus}
                          onChange={(e) => setEditFormData({ ...editFormData, civilStatus: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                        >
                          <option value="Soltero(a)">Soltero(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Viudo(a)">Viudo(a)</option>
                          <option value="Unión de Hecho">Unión de Hecho</option>
                        </select>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Ocupación o Profesión
                      </label>
                      <input
                        type="text"
                        value={editFormData.occupation}
                        onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Dirección Domiciliar
                      </label>
                      <input
                        type="text"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SECCIÓN: TRÁMITE / SERVICIO NOTARIAL */}
                <div className="pt-4 border-t border-neutral-100 dark:border-[#222228]">
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-neutral-100 dark:border-[#222228]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2575FC]" />
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                        2. Trámite Notarial / Servicio
                      </h4>
                    </div>
                    {services.length > 1 && (
                      <span className="text-xs sm:text-sm text-neutral-400 font-semibold">
                        {services.length} servicios registrados
                      </span>
                    )}
                  </div>

                  {/* If multiple services, allow choosing which one to edit */}
                  {services.length > 1 && (
                    <div className="mb-4">
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Seleccionar Trámite a Modificar
                      </label>
                      <select
                        value={editFormData.selectedServiceId}
                        onChange={(e) => {
                          const servId = e.target.value;
                          const targetServ = services.find((s) => s.id === servId);
                          if (targetServ) {
                            setEditFormData({
                              ...editFormData,
                              selectedServiceId: targetServ.id,
                              serviceType: targetServ.serviceType || 'Constitución de Sociedad',
                              serviceFee: targetServ.fee || '$1,200',
                              serviceStatus: targetServ.status || 'En proceso',
                              serviceDescription: targetServ.description || '',
                            });
                          }
                        }}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none font-medium"
                      >
                        {services.map((s, idx) => (
                          <option key={s.id} value={s.id}>
                            Trámite {idx + 1}: {s.serviceType} ({s.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Tipo de Trámite / Acto Notarial
                      </label>
                      <select
                        value={editFormData.serviceType}
                        onChange={(e) => setEditFormData({ ...editFormData, serviceType: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none font-semibold"
                      >
                        <option value="Constitución de Sociedad">Constitución de Sociedad</option>
                        <option value="Poder">Poder</option>
                        <option value="Fideicomiso">Fideicomiso</option>
                        <option value="Testamentos">Testamentos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Estado del Trámite
                      </label>
                      <select
                        value={editFormData.serviceStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, serviceStatus: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none font-semibold"
                      >
                        <option value="En proceso">🟡 En proceso (Activo)</option>
                        <option value="Completado">🟢 Completado (Finalizado)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Honorario Notarial Estimado ($)
                      </label>
                      <input
                        type="text"
                        value={editFormData.serviceFee}
                        onChange={(e) => setEditFormData({ ...editFormData, serviceFee: e.target.value })}
                        placeholder="Ej: $1,200"
                        className="w-full px-4 py-2.5 text-sm sm:text-base font-semibold rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Objeto y Descripción del Trámite
                      </label>
                      <textarea
                        value={editFormData.serviceDescription}
                        onChange={(e) => setEditFormData({ ...editFormData, serviceDescription: e.target.value })}
                        placeholder="Detalles sobre el acto notarial, otorgamiento de poderes, cláusulas..."
                        rows={2}
                        className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

                {/* Footer Fijo con Botones de Acción */}
                <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-t border-neutral-100 dark:border-[#26262B] bg-neutral-50/80 dark:bg-[#18181D]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingClient(false);
                      setIsConfirmingDelete(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar cliente</span>
                  </button>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingClient(false)}
                      className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-[#25252D] rounded-xl cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#2E2E38] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl cursor-pointer shadow-xs transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NUEVO SERVICIO */}
      <AnimatePresence>
        {isAddingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingService(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-xl bg-white dark:bg-[#141417] border border-neutral-200/90 dark:border-[#26262B] rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[88vh] flex flex-col my-auto"
            >
              <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-neutral-100 dark:border-[#26262B] bg-white dark:bg-[#141417]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                    Contratar Nuevo Servicio Notarial
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Se creará un expediente independiente para este trámite notarial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateService} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div 
                  className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Tipo de Servicio / Acto Notarial *
                    </label>
                    <select
                      value={newServiceType}
                      onChange={(e) => setNewServiceType(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none font-semibold"
                    >
                      <option value="Constitución de Sociedad">Constitución de Sociedad</option>
                      <option value="Poder">Poder</option>
                      <option value="Fideicomiso">Fideicomiso</option>
                      <option value="Testamentos">Testamentos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Honorario Estimado ($)
                    </label>
                    <input
                      type="text"
                      value={newServiceFee}
                      onChange={(e) => setNewServiceFee(e.target.value)}
                      placeholder="Ej: $1,200"
                      className="w-full px-4 py-2.5 text-sm sm:text-base font-semibold rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Descripción Inicial del Acto Jurídico
                    </label>
                    <textarea
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                      placeholder="Detalles sobre el objeto del trámite, comparecientes o cláusulas especiales..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-neutral-900 dark:text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-neutral-100 dark:border-[#26262B] bg-neutral-50/80 dark:bg-[#18181D]">
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-[#25252D] rounded-xl cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#2E2E38] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm sm:text-base font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Abrir Nuevo Expediente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MODAL: CONFIRMACIÓN DE ELIMINAR CLIENTE */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmingDelete(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-white dark:bg-[#141417] border border-neutral-200/90 dark:border-[#26262B] rounded-3xl shadow-2xl z-10 overflow-hidden p-6 sm:p-7"
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    ¿Eliminar cliente?
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                ¿Está seguro de que desea eliminar el expediente de <strong className="text-neutral-900 dark:text-white font-bold">{client.name}</strong>? Se eliminarán todos sus trámites notariales, tareas y documentos asociados de forma permanente.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#202026] dark:hover:bg-[#2A2A32] rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClientConfirm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sí, eliminar cliente</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};
