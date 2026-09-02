import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Printer,
  FileCheck,
  UserCheck,
  Users,
  AlertCircle,
  Plus,
  Download,
  Upload,
  BookOpen,
  History,
  CheckSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Search,
  Bell,
  Sliders,
  Layers,
  Share2,
  MoreHorizontal,
  Mic,
  AudioLines,
  Settings,
  Mail,
  User,
  Send,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Zap,
  Check,
  Paperclip,
  Flame,
  FileCode2,
  Scale,
  Stamp,
  Building2,
  Lock,
  Eye,
  Trash2,
  Edit3,
  Info,
  FolderOpen,
  Activity,
  Wrench,
  Construction,
  X
} from 'lucide-react';
import { NotaryServiceItem, ReferenceDocument, RelatedPerson, ServiceTask } from '../../types/client';
import { PersonasTable } from './PersonasTable';
import { MaintenanceSpotState } from '../common/MaintenanceSpotState';

interface ServiceDetailModalProps {
  service: NotaryServiceItem | null;
  clientName: string;
  clientIdNumber?: string;
  onClose: () => void;
  onUpdateService?: (updatedService: NotaryServiceItem) => void;
  onUpdateServiceStatus?: (serviceId: string, newStatus: 'En proceso' | 'Completado') => void;
}

export const REFERENCE_DOCUMENT_OPTIONS = [
  'Hoja de cálculo de honorarios',
  'Entero de gobierno',
  'Planos',
  'Visados',
  'SIRI',
  'Municipalidad',
  'Bomberos',
  'Aguas',
  'Electricidad',
  'Uso de Suelo y Patente Municipal',
  'Ministerio de Salud',
  'Identificación',
  'Personería',
  'Documentos Apostillados',
  'Reglamentos',
];

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  clientName,
  clientIdNumber,
  onClose,
  onUpdateService,
  onUpdateServiceStatus,
}) => {
  // Navigation tabs matching the user's exact specification:
  // 1. Informacion del Servicio
  // 2. Personas Relacionadas
  // 3. Archivos de Referencia
  // 4. Tareas
  // 5. DDC (Debida Diligencia)
  // 6. Historial
  const [activeTab, setActiveTab] = useState<'info' | 'personas' | 'archivos' | 'tareas' | 'ddc' | 'historial'>('info');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatically scroll to top when entering service details or switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.scrollTop = 0;
      if (mainEl.scrollTo) mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [service?.id, activeTab]);

  // Modal forms for adding items
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('Compareciente / Otorgante');
  const [newPersonIdNumber, setNewPersonIdNumber] = useState('');

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'alta' | 'media' | 'baja'>('alta');

  // Documents state & Upload flow
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [selectedPendingDocId, setSelectedPendingDocId] = useState<string>('');
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [selectedUploadedFile, setSelectedUploadedFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Service Description editable state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [serviceNotes, setServiceNotes] = useState(service?.description || 'Trámite notarial formalizado según normativa. Las partes comparecen con facultades suficientes acreditadas ante el Registro Nacional. Minuta y timbres en proceso de expedición.');

  if (!service) return null;

  const isCompleted = service.status === 'Completado';
  
  const relatedPersons = service.relatedPersons || [];

  const documents = service.documents || [];

  const tasks: ServiceTask[] = service.tasks || [
    { id: 't-1', title: 'Verificación de personería e identidad en Registro', completed: true, priority: 'alta' },
    { id: 't-2', title: 'Revisión registral de bienes y gravámenes', completed: true, priority: 'alta' },
    { id: 't-3', title: 'Firma de comparecientes en protocolo notarial', completed: isCompleted, priority: 'alta' },
    { id: 't-4', title: 'Expedición de testimonio y presentación registral', completed: isCompleted, priority: 'media' },
  ];

  const ddc = service.ddc || {
    riskLevel: 'Bajo',
    status: 'Cumplido',
    pepStatus: false,
    originOfFunds: 'Operación comercial y bancaria declarada lícita',
    verifiedDate: service.startDate,
    beneficialOwnerDeclared: true
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasksCount / (tasks.length || 1)) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle task
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    if (onUpdateService) {
      onUpdateService({
        ...service,
        tasks: updatedTasks
      });
    }
    showToast('Estado de tarea actualizado');
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: ServiceTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: 'Próxima semana'
    };
    if (onUpdateService) {
      onUpdateService({
        ...service,
        tasks: [...tasks, newTask]
      });
    }
    setNewTaskTitle('');
    setIsAddingTask(false);
    showToast('Tarea agregada al expediente');
  };

  // Add related person
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    const newPerson: RelatedPerson = {
      id: `rp-${Date.now()}`,
      name: newPersonName.trim(),
      role: newPersonRole.trim() || 'Compareciente',
      idNumber: newPersonIdNumber.trim() || 'No aportada'
    };
    if (onUpdateService) {
      onUpdateService({
        ...service,
        relatedPersons: [...relatedPersons, newPerson]
      });
    }
    setNewPersonName('');
    setNewPersonRole('Compareciente / Otorgante');
    setNewPersonIdNumber('');
    setIsAddingPerson(false);
    showToast('Persona relacionada agregada');
  };

  // Delete document
  const handleDeleteDoc = (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    if (onUpdateService) {
      onUpdateService({
        ...service,
        documents: updatedDocs
      });
    }
    showToast('Archivo eliminado');
  };

  // Toggle document status
  const handleToggleDocStatus = (docId: string) => {
    const updatedDocs = documents.map((d) => {
      if (d.id === docId) {
        const next = d.status === 'Aportado' ? 'Pendiente' : 'Aportado';
        return {
          ...d,
          status: next,
          uploadedAt: next === 'Aportado' ? new Date().toLocaleDateString('es-CR') : undefined,
          fileSize: next === 'Aportado' ? '1.4 MB' : undefined
        };
      }
      return d;
    });
    if (onUpdateService) {
      onUpdateService({
        ...service,
        documents: updatedDocs
      });
    }
    showToast('Estado del archivo actualizado');
  };

  // Save notes
  const handleSaveNotes = () => {
    if (onUpdateService) {
      onUpdateService({
        ...service,
        description: serviceNotes
      });
    }
    setIsEditingNotes(false);
    showToast('Información del servicio guardada');
  };

  // Chronological History Log
  const historyEvents = [
    {
      id: 'h-1',
      title: 'Apertura de Expediente Notarial',
      date: service.startDate,
      time: '09:30 AM',
      author: 'Notario Responsable',
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
      description: `Se registró el servicio de "${service.serviceType}" para el cliente ${clientName}.`
    },
    {
      id: 'h-2',
      title: 'Verificación de Debida Diligencia (DDC)',
      date: service.startDate,
      time: '11:15 AM',
      author: 'Oficial de Cumplimiento',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      description: `Perfil evaluado con Riesgo ${ddc.riskLevel}. Verificación en listas PEP y cotejo de beneficiario final (RTBF) acreditados.`
    },
    {
      id: 'h-3',
      title: 'Recepción de Archivos de Referencia',
      date: service.startDate,
      time: '02:40 PM',
      author: 'Recepción / Notaría',
      icon: FolderOpen,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
      description: `Aportada la certificación de personería jurídica y minuta preliminar para cotejo.`
    },
    {
      id: 'h-4',
      title: 'Cotejo en Registro Nacional & Tomo Protocolar',
      date: 'Fecha en curso',
      time: '10:00 AM',
      author: 'Notario Responsable',
      icon: CheckSquare,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      description: `Avance en los requisitos notariales: ${completedTasksCount} de ${tasks.length} tareas completadas.`
    }
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-2xl shadow-xl border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-[#26262B] bg-white dark:bg-[#141417] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1C1C21] text-sm font-semibold shadow-2xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al expediente de {clientName}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-[#26262B] bg-white dark:bg-[#141417] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1C1C21] text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Expediente</span>
          </button>

          {onUpdateServiceStatus && (
            <button
              type="button"
              onClick={() => {
                const next = isCompleted ? 'En proceso' : 'Completado';
                onUpdateServiceStatus(service.id, next);
                showToast(`Trámite marcado como: ${next}`);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border shadow-2xs transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/40 hover:bg-amber-100'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100'
              }`}
            >
              <FileCheck className="w-4.5 h-4.5" />
              <span>{isCompleted ? 'Reabrir Trámite' : 'Marcar Finalizado'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. EXPEDIENTE HERO HEADER */}
      <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-[#26262B] shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40'
            }`}>
              <Briefcase className="w-8 h-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                <span className="font-semibold text-neutral-400 dark:text-neutral-500">Expediente Notarial</span>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{clientName}</span>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <span className="font-mono text-neutral-500">ID #{service.id}</span>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-md ml-1 ${
                  isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                }`}>
                  {service.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {service.serviceType}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-neutral-400" />
                  Iniciado el <strong className="text-neutral-900 dark:text-white font-semibold">{service.startDate}</strong>
                </span>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4.5 h-4.5 text-neutral-400" />
                  Honorarios: <strong className="text-neutral-900 dark:text-white font-bold">{service.fee || '$0.00'}</strong>
                </span>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  DDC: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Riesgo {ddc.riskLevel}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-neutral-50 dark:bg-[#18181D] p-5 rounded-2xl border border-neutral-200/60 dark:border-[#26262B] flex items-center gap-4 min-w-[260px]">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-200 dark:text-neutral-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 dark:text-blue-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-bold text-neutral-800 dark:text-neutral-200">
                {progressPercent}%
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white block">
                Cumplimiento Notarial
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                {completedTasksCount} de {tasks.length} requisitos listos
              </span>
            </div>
          </div>

        </div>

        {/* 3. SEGMENTED TABS: Guaranteed single row without overflow or cutting off */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-[#202026]">
          <div className="bg-neutral-100/90 dark:bg-[#18181D] p-1.5 rounded-2xl border border-neutral-200/80 dark:border-[#26262B] grid grid-cols-6 gap-1.5 shadow-2xs">
            {[
              { id: 'info', label: 'Información', icon: Info },
              { id: 'personas', label: 'Compareciente', icon: Users, badge: relatedPersons.length > 0 ? relatedPersons.length : undefined },
              { id: 'archivos', label: 'Archivos', icon: FolderOpen, badge: documents.length > 0 ? documents.length : undefined },
              { id: 'tareas', label: 'Tareas', icon: CheckSquare, badge: 'Próx.' },
              { id: 'ddc', label: 'DDC', icon: ShieldCheck, badge: 'Próx.' },
              { id: 'historial', label: 'Historial', icon: History, badge: 'Próx.' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isMaintenance = tab.id === 'tareas' || tab.id === 'ddc' || tab.id === 'historial';
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md ring-2 ring-neutral-900/10 dark:ring-white/20 border border-neutral-900 dark:border-white'
                      : 'bg-white dark:bg-[#141417] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#202026] border border-neutral-200/70 dark:border-[#2A2A32] shadow-2xs hover:shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isActive 
                      ? 'text-white dark:text-neutral-900' 
                      : isMaintenance 
                        ? 'text-amber-500/80 dark:text-amber-400/80' 
                        : 'text-neutral-500 dark:text-neutral-400'
                  }`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10.5px] sm:text-[11px] font-black shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-neutral-900'
                        : isMaintenance
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40'
                          : 'bg-neutral-100 dark:bg-[#22222A] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-[#2C2C35]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE CONTAINER */}
      <div className="space-y-6">
        
        {/* ================= SECTION 1: INFORMACIÓN DEL SERVICIO ================= */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 columns: Metrics & Notes */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#141417] p-6 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Estado del Trámite
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {service.status}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 block">
                    {isCompleted ? 'Trámite finalizado y asentado' : 'Expediente notarial activo'}
                  </span>
                </div>

                <div className="bg-white dark:bg-[#141417] p-6 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Honorarios Notariales
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {service.fee || '$0.00'}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 block">
                    Conforme al Arancel Notarial vigente
                  </span>
                </div>

                <div className="bg-white dark:bg-[#141417] p-6 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Fecha de Apertura
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {service.startDate}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 block">
                    Radicación de expediente notarial
                  </span>
                </div>
              </div>

              {/* Service Description & Notes */}
              <div className="bg-white dark:bg-[#141417] p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Objeto y Descripción del Servicio Notarial
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1E2028] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditingNotes ? 'Cancelar' : 'Editar Notas'}</span>
                  </button>
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      className="w-full p-4 text-sm sm:text-base bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-[#26262B] rounded-2xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="px-4 py-2 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl shadow-xs cursor-pointer"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed bg-neutral-50 dark:bg-[#18181D] p-5 rounded-2xl border border-neutral-200/60 dark:border-[#26262B]">
                    {serviceNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Right 4 columns: Ficha del Expediente (Solo visible en sección Información) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#141417] p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  Ficha del Expediente
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-[#202026]">
                    <span className="text-neutral-500 dark:text-neutral-400">Tipo de Acto</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{service.serviceType}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-[#202026]">
                    <span className="text-neutral-500 dark:text-neutral-400">Cliente Otorgante</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{clientName}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-[#202026]">
                    <span className="text-neutral-500 dark:text-neutral-400">Identificación</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{clientIdNumber || '3-101-789456'}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-[#202026]">
                    <span className="text-neutral-500 dark:text-neutral-400">Honorarios Base</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{service.fee || '$0.00'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Fecha de Apertura</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{service.startDate}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('historial')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-[#18181D] dark:hover:bg-[#202026] text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-neutral-200/60 dark:border-[#26262B]"
                  >
                    <History className="w-4 h-4 text-neutral-400" />
                    <span>Ver Bitácora de Eventos</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

          {/* ================= SECTION 2: COMPARECIENTES ================= */}
          {activeTab === 'personas' && (
            <PersonasTable
              persons={relatedPersons}
              title="Compareciente"
              subtitle=""
              onAddPerson={(newPerson) => {
                if (onUpdateService) {
                  onUpdateService({
                    ...service,
                    relatedPersons: [...relatedPersons, newPerson]
                  });
                }
                showToast('Compareciente registrado exitosamente');
              }}
              onUpdatePerson={(updatedPerson) => {
                if (onUpdateService) {
                  onUpdateService({
                    ...service,
                    relatedPersons: relatedPersons.map(p => p.id === updatedPerson.id ? updatedPerson : p)
                  });
                }
                showToast('Datos del compareciente actualizados');
              }}
              onDeletePerson={(id) => {
                if (onUpdateService) {
                  onUpdateService({
                    ...service,
                    relatedPersons: relatedPersons.filter(p => p.id !== id)
                  });
                }
                showToast('Compareciente eliminado');
              }}
            />
          )}

          {/* ================= SECTION 3: ARCHIVOS DE REFERENCIA ================= */}
          {activeTab === 'archivos' && (
            <div className="bg-white dark:bg-[#141417] p-6 sm:p-7 rounded-3xl border border-neutral-200/80 dark:border-[#26262B] shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Archivos de Referencia
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Documentos del trámite.
                  </p>
                </div>
                {!isAddingDoc && documents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingDoc(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Archivo</span>
                  </button>
                )}
              </div>

              {/* Add doc form */}
              <AnimatePresence>
                {isAddingDoc && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!selectedPendingDocId) return;
                        
                        const docTitle = selectedPendingDocId;
                        const fileExt = selectedUploadedFile ? (selectedUploadedFile.name.split('.').pop()?.toUpperCase() as 'PDF' | 'DOCX' | 'JPG') : 'PDF';
                        const fileSize = selectedUploadedFile ? `${(selectedUploadedFile.size / 1024 / 1024).toFixed(1)} MB` : undefined;
                        
                        const existingDoc = documents.find(d => d.title === docTitle);

                        if (onUpdateService) {
                          if (existingDoc) {
                            onUpdateService({
                              ...service,
                              documents: documents.map(d => 
                                d.id === existingDoc.id ? {
                                  ...d,
                                  status: 'Aportado',
                                  uploadedAt: new Date().toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }),
                                  fileSize: fileSize || d.fileSize || '1.2 MB',
                                  fileType: fileExt || d.fileType
                                } : d
                              )
                            });
                          } else {
                            onUpdateService({
                              ...service,
                              documents: [...documents, {
                                id: `doc-${Date.now()}`,
                                title: docTitle,
                                status: 'Aportado',
                                uploadedAt: new Date().toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }),
                                fileSize: fileSize || (selectedUploadedFile ? undefined : '1.2 MB'),
                                fileType: fileExt as 'PDF' | 'DOCX' | 'JPG'
                              }]
                            });
                          }
                        }
                        
                        setSelectedPendingDocId('');
                        setSelectedUploadedFile(null);
                        setIsAddingDoc(false);
                        showToast('Archivo de referencia agregado exitosamente');
                      }}
                      className="p-5 sm:p-6 bg-neutral-50 dark:bg-[#18181D] rounded-2xl border border-neutral-200 dark:border-[#26262B] space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 dark:border-[#26262B]">
                        <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                          Agregar Archivo de Referencia
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingDoc(false);
                            setSelectedPendingDocId('');
                            setSelectedUploadedFile(null);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg cursor-pointer bg-neutral-100 dark:bg-neutral-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Select Reference Document from the list */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Seleccionar tipo de archivo de referencia *
                        </label>
                        <select
                          value={selectedPendingDocId}
                          onChange={(e) => setSelectedPendingDocId(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">
                            {REFERENCE_DOCUMENT_OPTIONS.some(docName => !documents.some(d => d.title === docName))
                              ? 'Seleccione el archivo a agregar...'
                              : 'Todos los documentos ya han sido aportados'}
                          </option>
                          {REFERENCE_DOCUMENT_OPTIONS
                            .filter(docName => !documents.some(d => d.title === docName))
                            .map(docName => (
                              <option key={docName} value={docName}>{docName}</option>
                            ))}
                        </select>
                      </div>

                      {/* File Dropzone (Opcional) */}
                      {selectedPendingDocId && (
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                            Adjuntar archivo digital (Opcional)
                          </label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                            onDragLeave={() => setIsDraggingOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingOver(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                setSelectedUploadedFile(e.dataTransfer.files[0]);
                              }
                            }}
                            className={`relative flex justify-center px-6 py-5 border-2 border-dashed rounded-xl transition-colors ${
                              isDraggingOver 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <div className="space-y-1 text-center">
                              <FolderOpen className="mx-auto h-8 w-8 text-neutral-400" />
                              <div className="flex text-sm text-neutral-600 dark:text-neutral-400 justify-center">
                                <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-[#2575FC] focus-within:outline-none hover:text-[#2169C4]">
                                  <span>Seleccionar archivo</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        setSelectedUploadedFile(e.target.files[0]);
                                      }
                                    }}
                                  />
                                </label>
                                <p className="pl-1">o arrastrar y soltar</p>
                              </div>
                              <p className="text-xs text-neutral-500">PDF, DOCX, JPG hasta 10MB</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Selected File Preview */}
                      {selectedUploadedFile && (
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl">
                          <FileText className="w-6 h-6 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                              {selectedUploadedFile.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {(selectedUploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedUploadedFile(null)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-[#2A2A32]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingDoc(false);
                            setSelectedPendingDocId('');
                            setSelectedUploadedFile(null);
                          }}
                          className="px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/80 dark:hover:bg-[#22222A] rounded-xl transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedPendingDocId}
                          className="px-6 py-2.5 text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Guardar Archivo
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* List */}
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-neutral-200 dark:border-[#26262B] bg-neutral-50/50 dark:bg-[#16161B]/50">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-[#1E1E24] text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto mb-3">
                      <FolderOpen className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                      Sin archivos de referencia
                    </h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                      Esta sección está limpia. Haz clic en "Agregar Archivo" para adjuntar documentos del trámite.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddingDoc(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Archivo</span>
                    </button>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 sm:p-5 bg-neutral-50 dark:bg-[#18181D] rounded-2xl border border-neutral-200/60 dark:border-[#26262B] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                            {doc.title}
                          </h4>
                          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 block mt-0.5">
                            {doc.fileSize ? `${doc.fileSize} · ` : ''}Registrado el {doc.uploadedAt || 'reciente'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleDocStatus(doc.id)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            doc.status === 'Aportado'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {doc.status}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-2 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION 4: TAREAS (EN MANTENIMIENTO / PRÓXIMAMENTE) ================= */}
          {activeTab === 'tareas' && (
            <MaintenanceSpotState
              section="tareas"
              title="Tareas & Requisitos Notariales"
              subtitle="Disponible próximamente."
            />
          )}

          {/* ================= SECTION 5: DDC (EN MANTENIMIENTO / PRÓXIMAMENTE) ================= */}
          {activeTab === 'ddc' && (
            <MaintenanceSpotState
              section="ddc"
              title="Debida Diligencia (DDC)"
              subtitle="Disponible próximamente."
            />
          )}

          {/* ================= SECTION 6: HISTORIAL (EN MANTENIMIENTO / PRÓXIMAMENTE) ================= */}
          {activeTab === 'historial' && (
            <MaintenanceSpotState
              section="historial"
              title="Historial & Bitácora Notarial"
              subtitle="Disponible próximamente."
            />
          )}

      </div>

    </div>
  );
};
