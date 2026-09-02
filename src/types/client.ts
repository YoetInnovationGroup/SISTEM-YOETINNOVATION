export interface ReferenceDocument {
  id: string;
  title: string;
  status: 'Aportado' | 'Pendiente' | string;
  uploadedAt?: string;
  fileSize?: string;
  fileType?: string;
  fileName?: string;
}

export interface RelatedPerson {
  id: string;
  name: string; // Nombre completo (nombre y apellidos)
  idType?: 'Cédula física' | 'Cédula jurídica' | 'DIMEX' | 'Pasaporte' | string; // Tipo de identificación
  idNumber: string; // Número de identificación
  civilStatus?: string; // Estado civil
  occupation?: string; // Profesión u ocupación
  address?: string; // Domicilio/dirección exacta
  nationality?: string; // Nacionalidad (obligatorio si es extranjero)
  personType?: 'Física' | 'Jurídica'; // Tipo de persona
  role: string; // Rol en el trámite (Comprador, Vendedor, Apoderado, Testigo, Fiador, Representante, etc.)
  isRepresenting?: boolean; // ¿Actúa en representación de alguien más?
  representedName?: string; // Nombre del representado
  representedId?: string; // Cédula del representado
  powerType?: 'Poder Generalísimo' | 'Poder General' | 'Poder Especial' | 'Poder Judicial' | string; // Tipo de poder
  phone?: string; // Teléfono (contacto práctico)
  email?: string; // Correo electrónico (contacto práctico)
  company?: string;
  createdDate?: string;
  avatar?: string;
}

export interface DDCCompliance {
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  status: 'Cumplido' | 'Pendiente' | 'En revisión';
  pepStatus: boolean; // Persona Expuesta Políticamente
  originOfFunds: string;
  verifiedDate?: string;
  beneficialOwnerDeclared: boolean; // Beneficiario Final
}

export interface ServiceTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'alta' | 'media' | 'baja';
}

export interface ServiceHistoryLog {
  id: string;
  date: string;
  action: string;
  author: string;
}

export interface RegulatoryItem {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  status: 'Cumplido' | 'Pendiente' | 'Exonerado';
}

export interface NotaryServiceRequirement {
  id: string;
  name: string;
  completed: boolean;
}

export interface NotaryServiceItem {
  id: string;
  serviceType: string;
  startDate: string;
  fee: string;
  status: 'En proceso' | 'Completado' | string;
  description?: string;
  protocolNumber?: string;
  folioNumber?: string;
  notaryNotes?: string;
  requirements?: NotaryServiceRequirement[];
  relatedPersons?: RelatedPerson[];
  ddc?: DDCCompliance;
  documents?: ReferenceDocument[];
  tasks?: ServiceTask[];
  historyLog?: ServiceHistoryLog[];
}

export interface Client {
  id: string;
  name: string;
  personType: 'fisica' | 'juridica';
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  civilStatus: string;
  corporateType?: string; // ej: Sociedad Anónima (S.A.)
  occupation: string;
  registrationDate?: string;
  lastActivity?: string;
  services: NotaryServiceItem[];
  referenceDocuments?: ReferenceDocument[];
  notes?: string;
  avatar?: string;
  status?: 'Activo' | 'Inactivo' | 'Pendiente';
}
