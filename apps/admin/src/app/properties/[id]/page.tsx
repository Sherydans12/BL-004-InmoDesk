'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Star, 
  Globe, 
  Edit3, 
  ArrowLeft, 
  User, 
  FileText, 
  Clock, 
  Plus, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Property, Owner, Lead, Visit } from '@/types';

export default function PropertyDetail({ params }: { params: any }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [allVisits, setAllVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  // Rápido Registro Lead Modal/Form State
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadNotes, setLeadNotes] = useState('');

  // Rápido Registro Visita Modal/Form State
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitLeadId, setVisitLeadId] = useState('');
  const [visitDateTime, setVisitDateTime] = useState('');
  const [visitNotes, setVisitNotes] = useState('');

  const fetchPropertyData = async (propId: string) => {
    try {
      const [propRes, leadsRes, visitsRes, ownersRes] = await Promise.all([
        fetch(`/api/admin/properties/${propId}`),
        fetch('/api/admin/leads'),
        fetch('/api/admin/visits'),
        fetch('/api/admin/owners')
      ]);

      if (!propRes.ok) {
        throw new Error('Property not found');
      }

      const propData = await propRes.json() as Property;
      const leadsData = await leadsRes.json() as Lead[];
      const visitsData = await visitsRes.json() as Visit[];
      const ownersData = await ownersRes.json() as Owner[];

      setProperty(propData);
      setAllLeads(leadsData);
      setAllVisits(visitsData);

      const matchedOwner = ownersData.find(o => o.id === propData.ownerId);
      if (matchedOwner) {
        setOwner(matchedOwner);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      fetchPropertyData(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  const handleTogglePublished = async () => {
    if (!property) return;
    try {
      const updatedVal = !property.isPublished;
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: updatedVal })
      });
      if (res.ok) {
        setProperty(prev => prev ? { ...prev, isPublished: updatedVal } : null);
      }
    } catch (err) {
      console.error('Error toggling publish state:', err);
    }
  };

  const handleToggleFeatured = async () => {
    if (!property) return;
    try {
      const updatedVal = !property.isFeatured;
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: updatedVal })
      });
      if (res.ok) {
        setProperty(prev => prev ? { ...prev, isFeatured: updatedVal } : null);
      }
    } catch (err) {
      console.error('Error toggling featured state:', err);
    }
  };

  // Submit Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          status: 'nuevo',
          source: 'manual',
          propertyId: property.id,
          agentName: property.agentName || 'Sofía Valdés',
          nextAction: 'Llamar para calificar interesado ingresado en ficha',
          notes: leadNotes || 'Registrado manualmente desde la ficha de propiedad.'
        })
      });

      if (res.ok) {
        setLeadName('');
        setLeadEmail('');
        setLeadPhone('');
        setLeadNotes('');
        setShowLeadForm(false);
        // Refresh data
        fetchPropertyData(property.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Submit Visit
  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !visitLeadId || !visitDateTime) return;

    try {
      const res = await fetch('/api/admin/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          leadId: visitLeadId,
          agentName: property.agentName || 'Sofía Valdés',
          dateTime: visitDateTime,
          status: 'programada',
          notes: visitNotes || 'Visita agendada desde la ficha de propiedad.'
        })
      });

      if (res.ok) {
        // Also update lead status to "visita_agendada"
        await fetch(`/api/admin/leads/${visitLeadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'visita_agendada', nextAction: `Asistir a la visita programada para el ${new Date(visitDateTime).toLocaleDateString('es-CL')}` })
        });

        setVisitLeadId('');
        setVisitDateTime('');
        setVisitNotes('');
        setShowVisitForm(false);
        // Refresh
        fetchPropertyData(property.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
            <span className="text-xs text-slate-500">Cargando ficha de propiedad...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Propiedad no encontrada</h2>
          <p className="text-xs text-slate-500 mt-1">La propiedad solicitada no existe o fue eliminada.</p>
          <Link href="/properties" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl transition-all">
            Volver a Propiedades
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Filter linked leads and visits
  const propertyLeads = allLeads.filter(l => l.propertyId === property.id);
  const propertyVisits = allVisits.filter(v => v.propertyId === property.id);

  const propertyStatusLabels = {
    borrador: 'Borrador',
    disponible: 'Disponible',
    reservada: 'Reservada',
    vendida: 'Vendida',
    arrendada: 'Arrendada',
    pausada: 'Pausada',
    archivada: 'Archivada'
  };

  const propertyStatusColors = {
    borrador: 'bg-slate-100 text-slate-700 border-slate-200',
    disponible: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    reservada: 'bg-amber-50 text-amber-700 border-amber-100',
    vendida: 'bg-blue-50 text-blue-700 border-blue-100',
    arrendada: 'bg-purple-50 text-purple-700 border-purple-100',
    pausada: 'bg-rose-50 text-rose-700 border-rose-100',
    archivada: 'bg-slate-200 text-slate-600 border-slate-300'
  };

  const leadStatusLabels = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    visita_agendada: 'Visita Agendada',
    visito: 'Visitó',
    en_negociacion: 'En Negociación',
    cerrado: 'Cerrado',
    perdido: 'Perdido'
  };

  const leadStatusColors = {
    nuevo: 'bg-blue-50 text-blue-700 border-blue-100',
    contactado: 'bg-amber-50 text-amber-700 border-amber-100',
    visita_agendada: 'bg-purple-50 text-purple-700 border-purple-100',
    visito: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    en_negociacion: 'bg-teal-50 text-teal-700 border-teal-100',
    cerrado: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    perdido: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href="/properties" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a listado
          </Link>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Publish Toggle Button */}
            <button
              onClick={handleTogglePublished}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold shadow-2xs transition-all ${
                property.isPublished 
                  ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {property.isPublished ? 'Publicada en Web' : 'Oculta en Web'}
            </button>

            {/* Feature Toggle Button */}
            <button
              onClick={handleToggleFeatured}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold shadow-2xs transition-all ${
                property.isFeatured 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${property.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
              {property.isFeatured ? 'Destacada' : 'Destacar'}
            </button>

            {/* Edit Button */}
            <Link
              href={`/properties/${property.id}/edit`}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar Ficha
            </Link>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center Column (Property details, gallery, description) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Property Card Header with Image */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative h-96 bg-slate-100 w-full">
                <img
                  src={property.mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Float badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md text-white ${
                    property.operation === 'venta' ? 'bg-orange-600' : 'bg-blue-600'
                  }`}>
                    {property.operation}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-md ${
                    propertyStatusColors[property.status as keyof typeof propertyStatusColors] || 'bg-slate-100 text-slate-700'
                  }`}>
                    {propertyStatusLabels[property.status as keyof typeof propertyStatusLabels]}
                  </span>
                </div>

                {property.isPublished && (
                  <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Globe className="h-3.5 w-3.5" />
                    Público
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{property.type}</span>
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">{property.title}</h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {property.address}, {property.comuna}, {property.region}
                  </p>
                </div>

                {/* Pricing / Key metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Valor Comercial</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {property.operation === 'venta' 
                        ? `${property.priceUF.toLocaleString('es-CL')} UF`
                        : `$${property.priceCLP.toLocaleString('es-CL')}`
                      }
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Dormitorios</span>
                    <span className="text-base font-extrabold text-slate-900">{property.bedrooms || '—'}</span>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Baños</span>
                    <span className="text-base font-extrabold text-slate-900">{property.bathrooms || '—'}</span>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Superficie</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {property.areaConstruida ? `${property.areaConstruida} m²` : '—'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-1">Descripción Comercial</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{property.description || 'Sin descripción comercial.'}</p>
                </div>
              </div>
            </div>

            {/* Additional gallery if exists */}
            {property.images && property.images.length > 1 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Galería de Imágenes</h3>
                <div className="grid grid-cols-3 gap-3">
                  {property.images.map((img, i) => (
                    <div key={i} className="h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img src={img} alt={`${property.title} - ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Leads Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-800">Leads / Interesados ({propertyLeads.length})</h3>
                <button 
                  onClick={() => {
                    setShowLeadForm(!showLeadForm);
                    setShowVisitForm(false);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Registrar Lead
                </button>
              </div>

              {/* Rápido Registro Lead Form Inline */}
              {showLeadForm && (
                <form onSubmit={handleCreateLead} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <p className="text-xs font-bold text-slate-700">Registrar Nuevo Interesado</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Nombre completo *"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Correo *"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Teléfono *"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Notas del contacto..."
                      value={leadNotes}
                      onChange={(e) => setLeadNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                    >
                      Guardar Lead
                    </button>
                  </div>
                </form>
              )}

              {propertyLeads.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay leads asignados a esta propiedad actualmente.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {propertyLeads.map(lead => (
                    <div key={lead.id} className="py-3 flex justify-between items-center hover:bg-slate-50/50 px-2 rounded-lg transition-all">
                      <div>
                        <Link href="/leads" className="text-xs font-bold text-slate-900 hover:text-teal-600 transition-colors">
                          {lead.name}
                        </Link>
                        <div className="text-[10px] text-slate-400 mt-0.5">{lead.phone} • {lead.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                          leadStatusColors[lead.status as keyof typeof leadStatusColors] || 'bg-slate-50 text-slate-600'
                        }`}>
                          {leadStatusLabels[lead.status as keyof typeof leadStatusLabels]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Associated Visits Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-800">Visitas Agendadas ({propertyVisits.length})</h3>
                {propertyLeads.length > 0 && (
                  <button 
                    onClick={() => {
                      setShowVisitForm(!showVisitForm);
                      setShowLeadForm(false);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Agendar Visita
                  </button>
                )}
              </div>

              {/* Rápido Registro Visita Form Inline */}
              {showVisitForm && (
                <form onSubmit={handleCreateVisit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <p className="text-xs font-bold text-slate-700">Planificar Nueva Visita</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Seleccionar Lead</label>
                      <select
                        required
                        value={visitLeadId}
                        onChange={(e) => setVisitLeadId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="">Selecciona un interesado</option>
                        {propertyLeads.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        required
                        value={visitDateTime}
                        onChange={(e) => setVisitDateTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Notas adicionales para el agente..."
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVisitForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                    >
                      Confirmar Visita
                    </button>
                  </div>
                </form>
              )}

              {propertyVisits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay visitas agendadas para esta propiedad.</p>
              ) : (
                <div className="space-y-3">
                  {propertyVisits.map(visit => {
                    const linkedLead = allLeads.find(l => l.id === visit.leadId);
                    const dateObj = new Date(visit.dateTime);
                    return (
                      <div key={visit.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white border p-1.5 rounded-lg text-center w-11">
                            <div className="text-[8px] font-bold text-teal-600 uppercase">{dateObj.toLocaleDateString('es-CL', { month: 'short' })}</div>
                            <div className="text-sm font-extrabold text-slate-800 leading-none">{dateObj.getDate()}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{linkedLead?.name || 'Cliente'}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Hora: {dateObj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs • Agente: {visit.agentName}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold capitalize bg-slate-200/60 px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">
                          {visit.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Owner details, internal data, legal checklist) */}
          <div className="space-y-6">
            
            {/* Propietario (Owner) Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Propietario Mandante</h3>
              {owner ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-100">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{owner.name}</h4>
                      <p className="text-[10px] text-slate-500">Asociado desde {new Date(owner.createdAt).toLocaleDateString('es-CL')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">Teléfono:</span>
                      <span className="font-semibold text-slate-800">{owner.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{owner.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Comisión pactada:</span>
                      <span className="font-semibold text-teal-700">{owner.commission}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No hay propietario asociado asignado.</p>
              )}
            </div>

            {/* Checklist Documental */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Checklist Legal Interno</h3>
              
              <div className="space-y-2.5">
                {[
                  { key: 'escritura', label: 'Copia de Escrituras' },
                  { key: 'rol', label: 'Rol de Avalúo SII' },
                  { key: 'contribuciones', label: 'Contribuciones al día' },
                  { key: 'certificados', label: 'Certificado de Gravámenes' }
                ].map(item => {
                  const isChecked = property.documentationChecklist?.[item.key as keyof typeof property.documentationChecklist];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100">
                      <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                      {isChecked ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          Listo
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <XCircle className="h-3 w-3" />
                          Pendiente
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gestión y Notas de Negocio */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Notas del Agente (CONFIDENCIAL)</h3>
              
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {property.internalNotes || 'No se han registrado notas de negociación interna.'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase">
                <Clock className="h-3.5 w-3.5" />
                Agente a cargo: {property.agentName || 'Sofía Valdés'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
