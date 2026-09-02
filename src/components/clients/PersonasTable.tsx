import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  X,
  Scale,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { RelatedPerson } from '../../types/client';
import { motion, AnimatePresence } from 'motion/react';

interface PersonasTableProps {
  persons: RelatedPerson[];
  onAddPerson?: (person: RelatedPerson) => void;
  onUpdatePerson?: (person: RelatedPerson) => void;
  onDeletePerson?: (id: string) => void;
  title?: string;
  subtitle?: string;
  readOnly?: boolean;
}

export const PersonasTable: React.FC<PersonasTableProps> = ({
  persons = [],
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  title = 'Compareciente',
  subtitle = '',
  readOnly = false,
}) => {
  // Array of persons
  const displayPersons = persons && persons.length > 0 ? persons : [];
  
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form state for editing or adding
  const [formData, setFormData] = useState<Partial<RelatedPerson>>({});

  const startEdit = (person: RelatedPerson) => {
    setFormData({ ...person });
    setIsEditing(true);
    setIsAdding(false);
    setIsDropdownOpen(false);
  };

  const startAdd = () => {
    setFormData({
      id: `rp-${Date.now()}`,
      name: '',
      idType: 'Cédula física',
      idNumber: '',
      civilStatus: '',
      occupation: '',
      address: '',
      nationality: 'Costarricense',
      personType: 'Física',
      role: '',
      isRepresenting: false,
      representedName: '',
      representedId: '',
      powerType: '',
      phone: '',
      email: ''
    });
    setIsAdding(true);
    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.idNumber?.trim()) return;

    const personToSave = formData as RelatedPerson;
    if (isAdding) {
      onAddPerson?.(personToSave);
      setIsAdding(false);
      setSelectedPersonIndex(displayPersons.length);
    } else if (isEditing) {
      onUpdatePerson?.(personToSave);
      setIsEditing(false);
    }
  };

  const activePerson = displayPersons[selectedPersonIndex] || displayPersons[0];

  return (
    <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-[#26262B] shadow-sm space-y-6 transition-colors">
      
      {/* Top Header: Section Title + Persona Dropdown Selector / Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-[#222228]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl tracking-tight">
              {title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-[#7C3AED] dark:text-[#C4B5FD] text-xs font-bold border border-violet-200/50 dark:border-violet-900/40">
              {displayPersons.length}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap relative">
          {/* Dropdown Selector for Comparecientes (Desplegable hacia abajo al apretar) */}
          {displayPersons.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  isDropdownOpen
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white ring-2 ring-violet-500/30'
                    : 'bg-neutral-50 dark:bg-[#1C1C21] hover:bg-neutral-100 dark:hover:bg-[#25252C] text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-[#2A2A32]'
                }`}
              >
                <div className="w-5 h-5 rounded-lg bg-violet-100 dark:bg-violet-950 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center shrink-0">
                  {displayPersons.length > 1 ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold truncate max-w-[150px] sm:max-w-[180px]">
                      {activePerson?.name || `Compareciente ${selectedPersonIndex + 1}`}
                    </span>
                    {displayPersons.length > 1 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/20 font-bold">
                        {selectedPersonIndex + 1}/{displayPersons.length}
                      </span>
                    )}
                  </div>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 opacity-70 shrink-0 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-70 shrink-0 ml-1" />
                )}
              </button>

              {/* Menu desplegable hacia abajo con las personas creadas */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#18181D] rounded-2xl border border-neutral-200/90 dark:border-[#2A2A32] shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 bg-neutral-50/80 dark:bg-[#141417] border-b border-neutral-100 dark:border-[#222228] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Personas Creadas ({displayPersons.length})
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Selecciona para ver ficha
                      </span>
                    </div>

                    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                      {displayPersons.map((p, idx) => {
                        const isSelected = selectedPersonIndex === idx && !isAdding;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedPersonIndex(idx);
                              setIsEditing(false);
                              setIsAdding(false);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-neutral-900 dark:text-neutral-50'
                                : 'hover:bg-neutral-50 dark:hover:bg-[#202026] text-neutral-700 dark:text-neutral-300 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                                isSelected 
                                  ? 'bg-[#2575FC] text-white' 
                                  : 'bg-neutral-100 dark:bg-[#222228] text-neutral-600 dark:text-neutral-400'
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                  {p.name || `Compareciente ${idx + 1}`}
                                </p>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                  {p.role || p.idNumber || 'Sin rol especificado'}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#2575FC] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!readOnly && (
                      <div className="p-2 border-t border-neutral-100 dark:border-[#222228] bg-neutral-50/50 dark:bg-[#141417]/50">
                        <button
                          type="button"
                          onClick={startAdd}
                          className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar otro compareciente</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Add Person button if none exists or as quick button */}
          {!readOnly && displayPersons.length > 0 && !isAdding && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Compareciente</span>
            </button>
          )}
        </div>
      </div>

      {/* INLINE FORM (FOR EDITING OR ADDING) */}
      <AnimatePresence>
        {(isEditing || isAdding) && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveForm}
            className="p-6 bg-neutral-50/90 dark:bg-[#18181D] rounded-3xl border border-neutral-200/90 dark:border-[#2A2A32] space-y-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-[#26262B]">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {isAdding ? 'Registrar Nuevo Compareciente' : `Editar Compareciente: ${formData.name || ''}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg cursor-pointer bg-neutral-100 dark:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Licda. María José Delgado"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tipo de Persona
                </label>
                <select
                  value={formData.personType || 'Física'}
                  onChange={(e) => setFormData({ ...formData, personType: e.target.value as 'Física' | 'Jurídica' })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Física">Persona Física</option>
                  <option value="Jurídica">Persona Jurídica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tipo de Identificación
                </label>
                <select
                  value={formData.idType || 'Cédula física'}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cédula física">Cédula física</option>
                  <option value="Cédula jurídica">Cédula jurídica</option>
                  <option value="DIMEX">DIMEX</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Número de Identificación *
                </label>
                <input
                  type="text"
                  required
                  value={formData.idNumber || ''}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="Ej: 1-0845-0912"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nacionalidad
                </label>
                <select
                  value={formData.nationality || 'Costarricense'}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Estado Civil
                </label>
                <select
                  value={formData.civilStatus || 'Soltero(a)'}
                  onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Soltero(a)">Soltero(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viudo(a)">Viudo(a)</option>
                  <option value="Unión de Hecho">Unión de Hecho</option>
                  <option value="Persona Jurídica (S.A./S.R.L.)">Persona Jurídica (S.A./S.R.L.)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Profesión u Ocupación
                </label>
                <input
                  type="text"
                  value={formData.occupation || ''}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Ej: Ingeniero, Abogado, Empresario..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Rol Notarial
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ej: Comprador, Vendedor, Apoderado..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Domicilio / Dirección Exacta
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: San José, Escazú, San Rafael, Condominio..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3 pt-3 border-t border-neutral-200/60 dark:border-[#26262B]">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="edit-isRepresenting"
                    checked={formData.isRepresenting || false}
                    onChange={(e) => setFormData({ ...formData, isRepresenting: e.target.checked })}
                    className="w-5 h-5 rounded border-neutral-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <label htmlFor="edit-isRepresenting" className="text-sm font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer select-none">
                    ¿Actúa en representación de alguien más? (En Representación)
                  </label>
                </div>

                {formData.isRepresenting && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-[#141417] rounded-xl border border-neutral-200 dark:border-[#2A2A32]">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Representado
                      </label>
                      <input
                        type="text"
                        value={formData.representedName || ''}
                        onChange={(e) => setFormData({ ...formData, representedName: e.target.value })}
                        placeholder="Ej: Inversiones Globales S.A."
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Cédula del Representado
                      </label>
                      <input
                        type="text"
                        value={formData.representedId || ''}
                        onChange={(e) => setFormData({ ...formData, representedId: e.target.value })}
                        placeholder="Ej: 3-101-987654"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Tipo de Poder
                      </label>
                      <input
                        type="text"
                        value={formData.powerType || ''}
                        onChange={(e) => setFormData({ ...formData, powerType: e.target.value })}
                        placeholder="Ej: Poder Generalísimo"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181D] border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Teléfono (Contacto)
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ej: +506 8888-8888"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: compareciente@correo.com"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] rounded-xl text-neutral-900 dark:text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-neutral-200/60 dark:border-[#26262B]">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-200/80 dark:bg-[#22222A] rounded-xl cursor-pointer hover:bg-neutral-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Guardar Compareciente
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* DIRECT EMBEDDED CUADRO: FICHA DE IDENTIFICACIÓN NOTARIAL Y COMPARECENCIA */}
      {!isEditing && !isAdding && (
        <div className="space-y-6">
          {displayPersons.length === 0 ? (
            <div className="py-14 px-6 rounded-3xl border border-dashed border-neutral-200 dark:border-[#2A2A32] bg-neutral-50/50 dark:bg-[#18181D]/50 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-[#202026] text-neutral-500 dark:text-neutral-400 flex items-center justify-center border border-neutral-200/80 dark:border-[#2E2E38]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Sin Compareciente Registrado
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
                  Esta sección está limpia. Haz clic en el botón para ingresar los datos del compareciente.
                </p>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Compareciente</span>
                </button>
              )}
            </div>
          ) : (
            displayPersons.map((person, idx) => {
              // If more than 1 person, only show selected person tab
              if (displayPersons.length > 1 && selectedPersonIndex !== idx) return null;

              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-neutral-50/60 dark:bg-[#18181D]/80 rounded-3xl border border-neutral-200/90 dark:border-[#26262B] shadow-sm overflow-hidden"
                >
                  {/* ENCABEZADO DE LA FICHA */}
                  <div className="p-6 sm:p-7 pb-5 border-b border-neutral-100 dark:border-[#222228] bg-gradient-to-b from-blue-50/40 to-transparent dark:from-blue-950/20 dark:to-transparent">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          {person.avatar ? (
                            <div className={`rounded-2xl border-2 border-white dark:border-[#222228] shadow-sm flex items-center justify-center overflow-hidden shrink-0 ${
                              person.personType === 'Jurídica'
                                ? 'w-14 h-14 sm:w-16 sm:h-16 bg-white'
                                : 'w-12 h-12 sm:w-14 sm:h-14 bg-neutral-100 dark:bg-[#1C1C21]'
                            }`}>
                              <img
                                src={person.avatar}
                                alt={person.name}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full ${person.personType === 'Jurídica' ? 'object-contain p-1' : 'object-cover'}`}
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/90 text-[#2575FC] dark:text-[#60A5FA] flex items-center justify-center font-bold text-xl border-2 border-white dark:border-[#222228] shadow-sm">
                              {person.personType === 'Jurídica' ? <Building2 className="w-7 h-7" /> : <User className="w-7 h-7" />}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#141417] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                              {person.name || 'Compareciente sin nombre'}
                            </h3>
                            <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#2575FC] dark:text-[#60A5FA] text-xs font-bold border border-blue-200/60 dark:border-blue-800/40">
                              Persona {person.personType || 'Física'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(person)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#141417] border border-neutral-200 dark:border-[#2A2A32] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#202026] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            {onDeletePerson && (
                              <button
                                type="button"
                                onClick={() => onDeletePerson(person.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs transition-colors cursor-pointer border border-red-200/60 dark:border-red-800/40"
                                title="Eliminar compareciente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CUERPO DEL CUADRO NOTARIAL */}
                  <div className="p-6 sm:p-7 space-y-6">
                    
                    {/* SECCIÓN 1: Información Personal */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-neutral-200/60 dark:border-[#222228]">
                        <div className="w-5.5 h-5.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#2575FC] dark:text-[#60A5FA] flex items-center justify-center">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Información Personal
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-[#141417] border border-neutral-200/70 dark:border-[#26262B]">
                        <div>
                          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                            Tipo y Número de Identificación
                          </span>
                          <span className="text-sm font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                            {person.idType || 'Cédula física'}: {person.idNumber || '—'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                            Nacionalidad
                          </span>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                            {person.nationality || '—'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                            Estado Civil
                          </span>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                            {person.civilStatus || '—'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                            Profesión u Ocupación
                          </span>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                            {person.occupation || '—'}
                          </span>
                        </div>

                        <div className="sm:col-span-2 pt-2 border-t border-neutral-100 dark:border-[#222228]">
                          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                            Domicilio / Dirección Exacta
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-0.5 block leading-relaxed">
                            {person.address || '—'}
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* SECCIÓN 2: Rol en el Trámite y Representación */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-neutral-200/60 dark:border-[#222228]">
                        <div className="w-5.5 h-5.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Scale className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Rol en el Trámite y Representación
                        </h4>
                      </div>

                      <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-neutral-200/70 dark:border-[#26262B] space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                              Rol Notarial
                            </span>
                            <span className="inline-block mt-1 px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#2575FC] dark:text-[#60A5FA] text-xs font-bold">
                              {person.role || 'Compareciente'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                              Tipo de Persona
                            </span>
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
                              {person.personType || 'Física'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 dark:border-[#222228] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                              ¿Actúa en representación de alguien más?
                            </span>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              person.isRepresenting 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' 
                                : 'bg-neutral-100 text-neutral-700 dark:bg-[#202026] dark:text-neutral-300'
                            }`}>
                              {person.isRepresenting ? 'SÍ (En Representación)' : 'NO (A nombre propio)'}
                            </span>
                          </div>

                          {person.isRepresenting && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-[#18181D] border border-neutral-200/80 dark:border-[#2A2A32]">
                              <div>
                                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase block">
                                  Representado
                                </span>
                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                                  {person.representedName || '—'}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase block">
                                  Cédula del Representado
                                </span>
                                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                                  {person.representedId || '—'}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase block">
                                  Tipo de Poder
                                </span>
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                                  {person.powerType || '—'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* SECCIÓN 3: Contacto */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-neutral-200/60 dark:border-[#222228]">
                        <div className="w-5.5 h-5.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Contacto
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-[#141417] border border-neutral-200/70 dark:border-[#26262B]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-[#1F1F26] border border-neutral-200/80 dark:border-[#2E2E38] flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                              Teléfono
                            </span>
                            {person.phone ? (
                              <a 
                                href={`tel:${person.phone}`} 
                                className="text-sm font-bold text-neutral-900 dark:text-neutral-100 hover:text-[#2575FC] transition-colors"
                              >
                                {person.phone}
                              </a>
                            ) : (
                              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">—</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-[#1F1F26] border border-neutral-200/80 dark:border-[#2E2E38] flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block uppercase tracking-wider">
                              Correo Electrónico
                            </span>
                            {person.email ? (
                              <a 
                                href={`mailto:${person.email}`} 
                                className="text-sm font-bold text-neutral-900 dark:text-neutral-100 hover:text-[#2575FC] transition-colors truncate block max-w-[220px]"
                              >
                                {person.email}
                              </a>
                            ) : (
                              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                  </div>

                </motion.div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
