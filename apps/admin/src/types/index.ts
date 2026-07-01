export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  rut: string;
  commission: number; // e.g. 2 for 2%
  notes: string;
  createdAt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: 'venta' | 'arriendo';
  type: 'casa' | 'departamento' | 'oficina' | 'terreno' | 'local' | 'industrial';
  status: 'borrador' | 'disponible' | 'reservada' | 'vendida' | 'arrendada' | 'pausada' | 'archivada';
  priceCLP: number;
  priceUF: number;
  bedrooms: number;
  bathrooms: number;
  areaConstruida: number; // sqm
  areaTerreno: number; // sqm
  address: string;
  comuna: string;
  region: string;
  description: string;
  mainImage: string;
  images: string[];
  isFeatured: boolean;
  isPublished: boolean;
  internalNotes: string;
  documentationChecklist: {
    escritura: boolean;
    rol: boolean;
    contribuciones: boolean;
    certificados: boolean;
  };
  ownerId: string;
  agentName: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'nuevo' | 'contactado' | 'visita_agendada' | 'visito' | 'en_negociacion' | 'cerrado' | 'perdido';
  source: 'web' | 'manual' | 'portal';
  propertyId?: string;
  agentName: string;
  nextAction?: string;
  notes?: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  propertyId: string;
  leadId: string;
  agentName: string;
  dateTime: string; // ISO string or datetime-local value
  status: 'programada' | 'realizada' | 'cancelada' | 'reagendada';
  notes: string;
  createdAt: string;
}

export interface Settings {
  companyName: string;
  logo: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  primaryColor: string;
  presentationText: string;
  contactMessage: string;
  publicUrl: string;
  integrationCode: string;
}

export interface DbSchema {
  owners: Owner[];
  properties: Property[];
  leads: Lead[];
  visits: Visit[];
  settings: Settings;
}
