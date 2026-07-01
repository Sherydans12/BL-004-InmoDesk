import fs from 'fs';
import path from 'path';
import { DbSchema, Property, Lead, Owner, Visit, Settings } from '../types';
import { initialData } from '../data/initialData';

/**
 * Ruta del archivo de base de datos mock.
 *
 * En producción/Coolify: usa la variable de entorno INMODESK_DB_FILE_PATH
 * que debe apuntar a un volumen persistente (ej: /app/storage/db.json).
 *
 * En desarrollo local: usa el fallback en src/data/db.json.
 */
const DB_FILE_PATH = process.env.INMODESK_DB_FILE_PATH
  ? path.resolve(process.env.INMODESK_DB_FILE_PATH)
  : path.join(process.cwd(), 'src/data/db.json');

function ensureDbFile() {
  if (!fs.existsSync(DB_FILE_PATH)) {
    // Crear directorio automáticamente si no existe (ej: /app/storage en Coolify)
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log(`[InmoDesk DB] Base mock inicializada en: ${DB_FILE_PATH}`);
  }
}

export function readDb(): DbSchema {
  ensureDbFile();
  try {
    const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent) as DbSchema;
  } catch (error) {
    console.error('Error reading mock database, returning initialData:', error);
    return initialData;
  }
}

export function writeDb(data: DbSchema): void {
  ensureDbFile();
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to mock database:', error);
  }
}

// Property CRUD
export function getProperties(): Property[] {
  return readDb().properties;
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find(p => p.id === id);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getProperties().find(p => p.slug === slug);
}

export function isPubliclyAvailableProperty(property: Property | undefined): property is Property {
  if (!property) return false;
  return (
    property.isPublished === true &&
    property.status !== 'borrador' &&
    property.status !== 'archivada'
  );
}

export function saveProperty(property: Property): void {
  const db = readDb();
  const index = db.properties.findIndex(p => p.id === property.id);
  if (index >= 0) {
    db.properties[index] = property;
  } else {
    db.properties.push(property);
  }
  writeDb(db);
}

// Lead CRUD
export function getLeads(): Lead[] {
  return readDb().leads;
}

export function getLeadById(id: string): Lead | undefined {
  return getLeads().find(l => l.id === id);
}

export function saveLead(lead: Lead): void {
  const db = readDb();
  const index = db.leads.findIndex(l => l.id === lead.id);
  if (index >= 0) {
    db.leads[index] = lead;
  } else {
    db.leads.push(lead);
  }
  writeDb(db);
}

export function updateLeadStatus(leadId: string, status: Lead['status']): void {
  const db = readDb();
  const index = db.leads.findIndex(l => l.id === leadId);
  if (index >= 0) {
    db.leads[index].status = status;
    // If status changes to visita_agendada and we have a next action, let's keep it updated
    writeDb(db);
  }
}

// Visit CRUD
export function getVisits(): Visit[] {
  return readDb().visits;
}

export function saveVisit(visit: Visit): void {
  const db = readDb();
  const index = db.visits.findIndex(v => v.id === visit.id);
  if (index >= 0) {
    db.visits[index] = visit;
  } else {
    db.visits.push(visit);
  }
  writeDb(db);
}

export function updateVisitStatus(visitId: string, status: Visit['status']): void {
  const db = readDb();
  const index = db.visits.findIndex(v => v.id === visitId);
  if (index >= 0) {
    db.visits[index].status = status;
    writeDb(db);
  }
}

// Owner CRUD
export function getOwners(): Owner[] {
  return readDb().owners;
}

export function saveOwner(owner: Owner): void {
  const db = readDb();
  const index = db.owners.findIndex(o => o.id === owner.id);
  if (index >= 0) {
    db.owners[index] = owner;
  } else {
    db.owners.push(owner);
  }
  writeDb(db);
}

// Settings CRUD
export function getSettings(): Settings {
  return readDb().settings;
}

export function saveSettings(settings: Settings): void {
  const db = readDb();
  db.settings = settings;
  writeDb(db);
}
