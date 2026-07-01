'use client';

import React, { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  XCircle,
  Video,
  FileText
} from 'lucide-react';
import { Visit, Property, Lead } from '@/types';

export default function AgendaPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600/50 border-t-teal-600"></div>
        </div>
      </DashboardLayout>
    }>
      <AgendaContent />
    </Suspense>
  );
}

function AgendaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const queryLeadId = searchParams.get('leadId') || '';
  const queryPropertyId = searchParams.get('propertyId') || '';

  const [visits, setVisits] = useState<Visit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // New Visit Form State
  const [formData, setFormData] = useState({
    propertyId: queryPropertyId,
    leadId: queryLeadId,
    dateTime: '',
    notes: '',
    agentName: 'Sofía Valdés'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [visitsRes, propsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/visits'),
        fetch('/api/admin/properties'),
        fetch('/api/admin/leads')
      ]);

      const visitsData = await visitsRes.json();
      const propsData = await propsRes.json();
      const leadsData = await leadsRes.json();

      setVisits(visitsData);
      setProperties(propsData);
      setLeads(leadsData);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update form inputs if query parameters change
  useEffect(() => {
    if (queryPropertyId || queryLeadId) {
      setFormData(prev => ({
        ...prev,
        propertyId: queryPropertyId,
        leadId: queryLeadId
      }));
    }
  }, [queryPropertyId, queryLeadId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.leadId || !formData.dateTime) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'programada'
        })
      });

      if (res.ok) {
        // Also update lead status to "visita_agendada"
        await fetch(`/api/admin/leads/${formData.leadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'visita_agendada', nextAction: `Asistir a la visita programada para el ${new Date(formData.dateTime).toLocaleDateString('es-CL')}` })
        });

        setFormData({
          propertyId: '',
          leadId: '',
          dateTime: '',
          notes: '',
          agentName: 'Sofía Valdés'
        });
        
        // Refresh
        fetchData();
      } else {
        const err = await res.json();
        setError(err.error || 'No se pudo crear la visita.');
      }
    } catch (err) {
      setError('Error al registrar la visita.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, newStatus: 'realizada' | 'cancelada' | 'reagendada') => {
    try {
      const res = await fetch(`/api/admin/visits/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Find visit details to update lead status too
        const updatedVisit = await res.json();
        setVisits(prev => prev.map(v => v.id === visitId ? updatedVisit : v));
        
        // If visit is realized, update lead status to "visito"
        if (newStatus === 'realizada') {
          await fetch(`/api/admin/leads/${updatedVisit.leadId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'visito', nextAction: 'Enviar propuesta de compra/arriendo' })
          });
          fetchData();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Sort upcoming visits chronologically
  const sortedVisits = [...visits].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const visitStatusLabels = {
    programada: 'Programada',
    realizada: 'Realizada',
    cancelada: 'Cancelada',
    reagendada: 'Reagendada'
  };

  const visitStatusColors = {
    programada: 'bg-blue-50 text-blue-700 border-blue-100',
    realizada: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelada: 'bg-rose-50 text-rose-700 border-rose-100',
    reagendada: 'bg-amber-50 text-amber-700 border-amber-100'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda de Visitas</h1>
          <p className="text-sm text-slate-500">Planifica, confirma o cancela las visitas de tus clientes a las propiedades.</p>
        </div>

        {/* Content Layout Grid (Visits List + Form Scheduler) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visits List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Cronograma de Visitas</h2>
            
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
              </div>
            ) : sortedVisits.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-500">No hay visitas agendadas en el sistema.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVisits.map((visit) => {
                  const linkedProp = properties.find(p => p.id === visit.propertyId);
                  const linkedLead = leads.find(l => l.id === visit.leadId);
                  const dateObj = new Date(visit.dateTime);
                  
                  return (
                    <div 
                      key={visit.id} 
                      className={`p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all bg-white hover:bg-slate-50/50`}
                    >
                      {/* Left Block */}
                      <div className="flex items-start gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center flex flex-col justify-center items-center w-14 shrink-0 shadow-2xs">
                          <span className="text-[10px] font-extrabold text-teal-600 uppercase leading-none mb-1">
                            {dateObj.toLocaleDateString('es-CL', { month: 'short' })}
                          </span>
                          <span className="text-xl font-extrabold text-slate-800 leading-none">
                            {dateObj.getDate()}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {linkedLead?.name || 'Cliente sin nombre'}
                            </span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded-sm text-[8px] font-bold border capitalize ${
                              visitStatusColors[visit.status as keyof typeof visitStatusColors] || 'bg-slate-50'
                            }`}>
                              {visitStatusLabels[visit.status as keyof typeof visitStatusLabels]}
                            </span>
                          </div>

                          {linkedProp && (
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {linkedProp.title} • {linkedProp.comuna}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {dateObj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs
                            </span>
                            <span>Agente: {visit.agentName}</span>
                          </div>

                          {visit.notes && (
                            <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic mt-2">
                              "{visit.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Block (Status Control buttons) */}
                      {visit.status === 'programada' && (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleUpdateVisitStatus(visit.id, 'cancelada')}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-bold transition-all"
                          >
                            <XCircle className="h-3 w-3" />
                            Cancelar
                          </button>
                          
                          <button
                            onClick={() => handleUpdateVisitStatus(visit.id, 'realizada')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-xs transition-all"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Realizada
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Scheduler */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-5">Planificar Nueva Visita</h2>
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleScheduleVisit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Propiedad Asociada *</label>
                <select
                  name="propertyId"
                  required
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="">Selecciona la propiedad</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.comuna})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Cliente Interesado *</label>
                <select
                  name="leadId"
                  required
                  value={formData.leadId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="">Selecciona el prospecto</option>
                  {/* If property is selected, filter leads by that property first, else show all */}
                  {leads
                    .filter(l => !formData.propertyId || l.propertyId === formData.propertyId || !l.propertyId)
                    .map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Agente Asignado</label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Instrucciones / Notas</label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Ej. Llevar llaves auxiliares. Cliente solicita financiamiento hipotecario pre-aprobado."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all text-xs flex justify-center items-center gap-1.5"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Agendar Visita Comercial
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
