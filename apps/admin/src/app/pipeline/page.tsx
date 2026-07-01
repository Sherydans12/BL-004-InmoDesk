'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  GitBranch, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar,
  DollarSign,
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Lead, Property } from '@/types';

const PIPELINE_STAGES = [
  { id: 'nuevo', label: 'Nuevos', color: 'border-t-blue-500 bg-blue-50/10' },
  { id: 'contactado', label: 'Contactados', color: 'border-t-amber-500 bg-amber-50/10' },
  { id: 'visita_agendada', label: 'Visita Agendada', color: 'border-t-purple-500 bg-purple-50/10' },
  { id: 'visito', label: 'Visitó', color: 'border-t-indigo-500 bg-indigo-50/10' },
  { id: 'en_negociacion', label: 'En Negociación', color: 'border-t-teal-500 bg-teal-50/10' },
  { id: 'cerrado', label: 'Cerrados', color: 'border-t-emerald-500 bg-emerald-50/10' },
  { id: 'perdido', label: 'Perdidos', color: 'border-t-slate-400 bg-slate-50/20' }
];

export default function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moveLead = async (leadId: string, currentStatus: string, direction: 'prev' | 'next') => {
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStatus);
    let targetIndex = currentIndex;
    
    if (direction === 'prev' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < PIPELINE_STAGES.length - 1) {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex === currentIndex) return;
    const targetStatus = PIPELINE_STAGES[targetIndex].id;

    // Optimistically update UI
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus as Lead['status'] } : l));

    try {
      // Determine default action text
      let defaultNextAction = '';
      if (targetStatus === 'contactado') defaultNextAction = 'Agendar visita o descartar';
      if (targetStatus === 'visita_agendada') defaultNextAction = 'Confirmar asistencia a visita';
      if (targetStatus === 'visito') defaultNextAction = 'Enviar propuesta formal de compra/arriendo';
      if (targetStatus === 'en_negociacion') defaultNextAction = 'Revisar detalles del contrato';
      if (targetStatus === 'cerrado') defaultNextAction = 'Operación completada con éxito';

      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: targetStatus,
          nextAction: defaultNextAction || undefined
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update actual data response to align
      const updated = await res.json();
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
    } catch (err) {
      console.error(err);
      fetchData(); // Rollback on error
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pipeline Comercial</h1>
            <p className="text-sm text-slate-500">Mueve los leads a través de las etapas del embudo comercial inmobiliario.</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full font-medium">
            <GitBranch className="h-3.5 w-3.5 text-slate-500" />
            Embudo de Ventas / Arriendos
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto flex gap-4 pb-4 items-stretch select-none">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
            </div>
          ) : (
            PIPELINE_STAGES.map((stage) => {
              const stageLeads = leads.filter(l => l.status === stage.id);
              return (
                <div 
                  key={stage.id} 
                  className={`w-72 border border-slate-200 rounded-2xl p-4 flex flex-col border-t-4 ${stage.color} shrink-0`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{stage.label}</span>
                    <span className="text-xs font-extrabold bg-slate-200/60 px-2 py-0.5 rounded-full text-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards Area scrollable */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {stageLeads.length === 0 ? (
                      <div className="h-28 border border-dashed border-slate-250 rounded-xl flex items-center justify-center text-center p-4">
                        <span className="text-[10px] text-slate-400 font-medium">Sin interesados en esta etapa.</span>
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const linkedProp = properties.find(p => p.id === lead.propertyId);
                        return (
                          <div 
                            key={lead.id} 
                            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3 group"
                          >
                            {/* Card Content */}
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                                {lead.name}
                              </h4>
                              {linkedProp ? (
                                <Link 
                                  href={`/properties/${linkedProp.id}`}
                                  className="text-[10px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 truncate"
                                >
                                  {linkedProp.title}
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </Link>
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">Interés General</span>
                              )}
                            </div>

                            {/* Next Action Indicator */}
                            {lead.nextAction && (
                              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-600">
                                <span className="font-semibold text-slate-700 block uppercase text-[8px] tracking-wider mb-0.5">Siguiente Acción</span>
                                <p className="leading-tight line-clamp-2">{lead.nextAction}</p>
                              </div>
                            )}

                            {/* Card Footer controls */}
                            <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-1 shrink-0">
                              {/* Prev stage button */}
                              <button
                                onClick={() => moveLead(lead.id, lead.status, 'prev')}
                                disabled={stage.id === 'nuevo'}
                                className="p-1 rounded-md border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-20 transition-all"
                              >
                                <ArrowLeft className="h-3 w-3" />
                              </button>

                              {/* Channel badge */}
                              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">
                                {lead.source === 'web' ? 'Web' : lead.source}
                              </span>

                              {/* Next stage button */}
                              <button
                                onClick={() => moveLead(lead.id, lead.status, 'next')}
                                disabled={stage.id === 'perdido'}
                                className="p-1 rounded-md border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-20 transition-all"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
