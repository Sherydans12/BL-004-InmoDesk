'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Plus, 
  MessageSquare,
  Star,
  Globe
} from 'lucide-react';
import { Property, Lead, Visit, Settings } from '@/types';

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [propsRes, leadsRes, visitsRes, settingsRes] = await Promise.all([
          fetch('/api/admin/properties'),
          fetch('/api/admin/leads'),
          fetch('/api/admin/visits'),
          fetch('/api/admin/settings'),
        ]);

        const [propsData, leadsData, visitsData, settingsData] = await Promise.all([
          propsRes.json(),
          leadsRes.json(),
          visitsRes.json(),
          settingsRes.json(),
        ]);

        setProperties(propsData);
        setLeads(leadsData);
        setVisits(visitsData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-500">Cargando métricas y actividades...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate metrics
  const activeProperties = properties.filter(p => p.status === 'disponible' || p.status === 'reservada');
  const publishedProperties = properties.filter(p => p.isPublished);
  const newLeadsCount = leads.filter(l => l.status === 'nuevo').length;
  
  // Calculate commission estimate in UF (based on properties in 'disponible' or 'reservada' times commission)
  const potentialCommissionUF = properties
    .filter(p => p.status === 'disponible' || p.status === 'reservada')
    .reduce((sum, p) => {
      // Find owner commission
      // Default commission: 2%
      const commRate = 0.02; 
      return sum + (p.priceUF * commRate);
    }, 0);

  // Recent leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Upcoming visits
  const upcomingVisits = [...visits]
    .filter(v => v.status === 'programada' || v.status === 'reagendada')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 4);

  // Featured published properties
  const featuredProps = properties.filter(p => p.isFeatured && p.isPublished).slice(0, 3);

  // Lead status colors map
  const leadStatusColors = {
    nuevo: 'bg-blue-50 text-blue-700 border-blue-100',
    contactado: 'bg-amber-50 text-amber-700 border-amber-100',
    visita_agendada: 'bg-purple-50 text-purple-700 border-purple-100',
    visito: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    en_negociacion: 'bg-teal-50 text-teal-700 border-teal-100',
    cerrado: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    perdido: 'bg-slate-100 text-slate-600 border-slate-200'
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
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hola, Sofía</h1>
            <p className="text-sm text-slate-500">
              Aquí tienes el resumen operativo para <span className="font-semibold text-slate-700">{settings?.companyName || 'Altavista Propiedades'}</span> hoy.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full font-medium shadow-2xs">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Demo activa en vivo
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Propiedades Activas</span>
              <p className="text-3xl font-extrabold text-slate-900">{activeProperties.length}</p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <Globe className="h-3 w-3 text-teal-600" />
                {publishedProperties.length} publicadas en web
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Building className="h-5 w-5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leads Nuevos</span>
              <p className="text-3xl font-extrabold text-slate-900">{newLeadsCount}</p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                Total de {leads.length} interesados registrados
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visitas esta Semana</span>
              <p className="text-3xl font-extrabold text-slate-900">{upcomingVisits.length}</p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Organizadas por agente asignado
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comisión Estimada</span>
              <p className="text-3xl font-extrabold text-slate-900">{Math.round(potentialCommissionUF).toLocaleString('es-CL')} UF</p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                Comisión potencial sobre cartera activa (2%)
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="font-bold text-sm">$</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/properties/new" 
              className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-teal-500 hover:bg-teal-50/20 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Publicar Propiedad</span>
              <span className="text-xs text-slate-500 mt-1">Crea una propiedad y actívala para verla en la web</span>
            </Link>

            <Link 
              href="/leads" 
              className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Registrar Lead</span>
              <span className="text-xs text-slate-500 mt-1">Ingresa un nuevo interesado de forma manual</span>
            </Link>

            <Link 
              href="/agenda" 
              className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-purple-500 hover:bg-purple-50/20 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Agendar Visita</span>
              <span className="text-xs text-slate-500 mt-1">Planifica una visita con un lead calificado</span>
            </Link>

            <Link 
              href="/integration" 
              className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-slate-500 hover:bg-slate-50 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">API &amp; Widget Web</span>
              <span className="text-xs text-slate-500 mt-1">Visualiza el código de integración de propiedades</span>
            </Link>
          </div>
        </div>

        {/* Details Section (Leads & Visits) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Últimos Leads Ingresados</h2>
              <Link href="/leads" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                Ver todos
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3">Nombre</th>
                    <th className="pb-3">Propiedad</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Origen</th>
                    <th className="pb-3">Siguiente Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentLeads.map((lead) => {
                    const linkedProp = properties.find(p => p.id === lead.propertyId);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">{lead.name}</td>
                        <td className="py-3 text-slate-600 max-w-[150px] truncate">
                          {linkedProp ? (
                            <Link href={`/properties/${linkedProp.id}`} className="hover:text-teal-600 transition-colors">
                              {linkedProp.title}
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">No especificada</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            leadStatusColors[lead.status as keyof typeof leadStatusColors] || 'bg-slate-50 text-slate-600'
                          }`}>
                            {leadStatusLabels[lead.status as keyof typeof leadStatusLabels]}
                          </span>
                        </td>
                        <td className="py-3 capitalize text-slate-500">{lead.source}</td>
                        <td className="py-3 text-slate-500 max-w-[200px] truncate">{lead.nextAction || 'Sin acción asignada'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Visits */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Próximas Visitas</h2>
                <Link href="/agenda" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  Ver agenda
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {upcomingVisits.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No hay visitas programadas próximamente.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => {
                    const linkedProp = properties.find(p => p.id === visit.propertyId);
                    const linkedLead = leads.find(l => l.id === visit.leadId);
                    const dateObj = new Date(visit.dateTime);
                    return (
                      <div key={visit.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start gap-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center flex flex-col justify-center items-center shrink-0 w-12 shadow-2xs">
                          <span className="text-[10px] font-bold text-teal-600 uppercase">
                            {dateObj.toLocaleDateString('es-CL', { month: 'short' })}
                          </span>
                          <span className="text-base font-extrabold text-slate-800 leading-none">
                            {dateObj.getDate()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {linkedLead?.name || 'Cliente sin nombre'}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mb-1">
                            {linkedProp?.title || 'Propiedad sin nombre'}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-600 bg-slate-200/50 px-1.5 py-0.5 rounded-sm">
                              {dateObj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs
                            </span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded-sm text-[9px] font-semibold border ${
                              visitStatusColors[visit.status as keyof typeof visitStatusColors] || 'bg-slate-50 text-slate-600'
                            }`}>
                              {visitStatusLabels[visit.status as keyof typeof visitStatusLabels]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <Link 
              href="/agenda" 
              className="mt-4 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all duration-200"
            >
              Ir a Registrar Visita
            </Link>
          </div>
        </div>

        {/* Featured Properties Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Propiedades Destacadas en la Web</h2>
            <Link href="/properties" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Ver inventario
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredProps.map((prop) => (
              <div key={prop.id} className="rounded-xl border border-slate-100 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="relative h-40 bg-slate-100 shrink-0">
                  <img
                    src={prop.mainImage}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-teal-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {prop.operation}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-teal-700 p-1.5 rounded-full shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-teal-600 text-teal-600" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 truncate hover:text-teal-600">
                      <Link href={`/properties/${prop.id}`}>{prop.title}</Link>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{prop.address}, {prop.comuna}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-auto">
                    <span className="text-sm font-extrabold text-slate-900">
                      {prop.operation === 'venta' 
                        ? `${prop.priceUF.toLocaleString('es-CL')} UF`
                        : `$${prop.priceCLP.toLocaleString('es-CL')}`
                      }
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold capitalize">
                      {prop.type} • {prop.bedrooms} d • {prop.bathrooms} b
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
