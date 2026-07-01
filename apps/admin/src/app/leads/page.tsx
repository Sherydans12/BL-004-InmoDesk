'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import { Lead, Property } from '@/types';

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');

  // Modal / Form state for new Lead
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    source: 'manual' as 'manual' | 'web' | 'portal',
    status: 'nuevo' as any,
    nextAction: '',
    notes: ''
  });

  // Selected lead for details panel
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  const fetchData = async () => {
    try {
      const [leadsRes, propsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/properties')
      ]);
      const leadsData = await leadsRes.json();
      const propsData = await propsRes.json();
      
      setLeads(leadsData);
      setProperties(propsData);
    } catch (err) {
      console.error('Error fetching leads data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email || !newLead.phone) return;

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLead,
          agentName: 'Sofía Valdés',
          nextAction: newLead.nextAction || 'Contactar interesado para primer filtro'
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewLead({
          name: '',
          email: '',
          phone: '',
          propertyId: '',
          source: 'manual',
          status: 'nuevo',
          nextAction: '',
          notes: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setIsUpdatingLead(true);
    try {
      let defaultNextAction = '';
      if (newStatus === 'contactado') defaultNextAction = 'Agendar visita o descartar';
      if (newStatus === 'visita_agendada') defaultNextAction = 'Confirmar asistencia a visita';
      if (newStatus === 'visito') defaultNextAction = 'Enviar propuesta formal de compra/arriendo';
      if (newStatus === 'en_negociacion') defaultNextAction = 'Revisar detalles del contrato';
      if (newStatus === 'cerrado') defaultNextAction = 'Operación completada con éxito';

      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          nextAction: defaultNextAction || undefined
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleUpdateNextAction = async (leadId: string, actionText: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextAction: actionText })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateNotes = async (leadId: string, notesText: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesText })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filters logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.phone.includes(searchTerm);
    const matchesStatus = filterStatus ? lead.status === filterStatus : true;
    const matchesSource = filterSource ? lead.source === filterSource : true;
    return matchesSearch && matchesStatus && matchesSource;
  });

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads e Interesados</h1>
            <p className="text-sm text-slate-500">Monitorea los prospectos interesados en tus propiedades y su avance en el embudo comercial.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Registrar Lead
          </button>
        </div>

        {/* Filters and Counters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Filters Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm md:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo, fono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              >
                <option value="">Cualquier Estado</option>
                {Object.entries(leadStatusLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              >
                <option value="">Cualquier Canal</option>
                <option value="web">Sitio Web Altavista</option>
                <option value="portal">Portales Inmobiliarios</option>
                <option value="manual">Manual / Teléfono</option>
              </select>
            </div>
          </div>

          {/* Quick Stat Panel */}
          <div className="bg-teal-600 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100">Leads Calificados</span>
              <p className="text-2xl font-extrabold mt-1">{leads.filter(l => l.status !== 'perdido' && l.status !== 'cerrado').length}</p>
              <span className="text-[9px] text-teal-100/90 font-medium">Activos en el Pipeline</span>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-400" />
          </div>
        </div>

        {/* Content Layout Grid (Table of leads + details split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Leads Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">No se encontraron interesados</h3>
                <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros o agrega un nuevo prospecto manual.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                      <th className="py-3.5 px-5">Interesado</th>
                      <th className="py-3.5 px-4">Propiedad de Interés</th>
                      <th className="py-3.5 px-4">Origen</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Próxima Acción</th>
                      <th className="py-3.5 px-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const linkedProp = properties.find(p => p.id === lead.propertyId);
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <tr 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-slate-50/40 cursor-pointer transition-colors ${
                            isSelected ? 'bg-teal-50/30' : ''
                          }`}
                        >
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{lead.phone}</div>
                          </td>

                          <td className="py-4 px-4 text-slate-600 max-w-[180px] truncate">
                            {linkedProp ? (
                              <span className="font-medium hover:text-teal-600 truncate block">
                                {linkedProp.title}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Cualquiera</span>
                            )}
                          </td>

                          <td className="py-4 px-4 capitalize text-slate-500 font-medium">
                            {lead.source === 'web' ? 'Web Altavista' : lead.source}
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                              leadStatusColors[lead.status as keyof typeof leadStatusColors] || 'bg-slate-50'
                            }`}>
                              {leadStatusLabels[lead.status as keyof typeof leadStatusLabels]}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-slate-500 max-w-[200px] truncate">
                            {lead.nextAction}
                          </td>

                          <td className="py-4 px-5 text-right">
                            <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Details Sidebar Panel */}
          <div className="space-y-6">
            {selectedLead ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedLead.name}</h3>
                    <p className="text-[10px] text-slate-400">Ingreso: {new Date(selectedLead.createdAt).toLocaleDateString('es-CL')}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    leadStatusColors[selectedLead.status as keyof typeof leadStatusColors] || 'bg-slate-50'
                  }`}>
                    {leadStatusLabels[selectedLead.status as keyof typeof leadStatusLabels]}
                  </span>
                </div>

                {/* Contact Data */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{selectedLead.email}</span>
                  </div>
                </div>

                {/* Linked Property Details */}
                {(() => {
                  const linkedProp = properties.find(p => p.id === selectedLead.propertyId);
                  return (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Propiedad Solicitada</span>
                      {linkedProp ? (
                        <div>
                          <Link href={`/properties/${linkedProp.id}`} className="text-xs font-bold text-slate-800 hover:text-teal-600 flex items-center gap-1">
                            {linkedProp.title}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {linkedProp.comuna} • {linkedProp.operation === 'venta' ? `${linkedProp.priceUF} UF` : `$${linkedProp.priceCLP.toLocaleString('es-CL')}`}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Interés general o propiedad no asignada.</p>
                      )}
                    </div>
                  );
                })()}

                {/* Update Status Actions */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Avanzar Estado</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(leadStatusLabels).map(([key, label]) => {
                      const isActive = selectedLead.status === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(selectedLead.id, key)}
                          disabled={isUpdatingLead}
                          className={`text-center py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            isActive
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Siguiente Acción editable */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Siguiente Acción</span>
                  <input
                    type="text"
                    defaultValue={selectedLead.nextAction}
                    onBlur={(e) => handleUpdateNextAction(selectedLead.id, e.target.value)}
                    placeholder="Escribe la siguiente acción comercial..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                  <span className="text-[9px] text-slate-400 block">Presiona Enter o haz clic fuera para guardar.</span>
                </div>

                {/* Notes editable */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Bitácora / Comentarios</span>
                  <textarea
                    defaultValue={selectedLead.notes}
                    onBlur={(e) => handleUpdateNotes(selectedLead.id, e.target.value)}
                    rows={4}
                    placeholder="Detalles sobre lo conversado..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                {/* Quick appointment action */}
                {selectedLead.status !== 'cerrado' && selectedLead.status !== 'perdido' && (
                  <Link
                    href={`/agenda?leadId=${selectedLead.id}&propertyId=${selectedLead.propertyId}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100 rounded-xl text-xs font-semibold transition-all w-full"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar Visita Comercial
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-slate-100/60 p-6 rounded-2xl border border-dashed border-slate-350 text-center py-16">
                <Users className="h-8 w-8 text-slate-350 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Selecciona un interesado en el listado para ver su ficha y gestionar su proceso de venta.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Manual Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-teal-600" />
                Registrar Nuevo Interesado
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-50 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Rodrigo Altamirano"
                  value={newLead.name}
                  onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.cl"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Teléfono Móvil *</label>
                  <input
                    type="text"
                    required
                    placeholder="+56912345678"
                    value={newLead.phone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Propiedad Asociada</label>
                <select
                  value={newLead.propertyId}
                  onChange={(e) => setNewLead(prev => ({ ...prev, propertyId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">Interés general (Ninguna específica)</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.comuna})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Canal de Origen</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                >
                  <option value="manual">Manual / Teléfono</option>
                  <option value="web">Sitio Web Altavista</option>
                  <option value="portal">Portales Inmobiliarios</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Notas Iniciales</label>
                <textarea
                  rows={3}
                  placeholder="Detalles de contacto, requerimientos especiales de financiamiento..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
