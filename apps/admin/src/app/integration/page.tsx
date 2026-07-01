'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Code, 
  Terminal, 
  Play, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Building,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Send
} from 'lucide-react';
import { Property } from '@/types';

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'leadForm'>('sandbox');
  const [properties, setProperties] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [loadingApi, setLoadingApi] = useState(false);

  // Lead capture form simulation state
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertySlug: '',
    message: ''
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadResult, setLeadResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);

  useEffect(() => {
    // Fetch published properties for selection dropdown
    async function loadProps() {
      try {
        const res = await fetch('/api/public/demo/properties');
        const data = await res.json();
        setProperties(data);
        if (data.length > 0) {
          setLeadForm(prev => ({ ...prev, propertySlug: data[0].slug }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProps();
  }, []);

  const triggerGetProperties = async () => {
    setLoadingApi(true);
    setApiResponse('');
    try {
      const res = await fetch('/api/public/demo/properties');
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResponse('Error al consultar API pública.');
    } finally {
      setLoadingApi(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone || !leadForm.propertySlug) return;
    
    setSubmittingLead(true);
    setLeadResult(null);

    try {
      const res = await fetch('/api/public/demo/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          notes: `Mensaje enviado desde formulario público de Altavista Propiedades: "${leadForm.message}"`
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLeadResult({ success: true, data });
        // Reset form except select
        setLeadForm(prev => ({
          ...prev,
          name: '',
          email: '',
          phone: '',
          message: ''
        }));
      } else {
        setLeadResult({ success: false, error: data.error || 'No se pudo registrar el lead' });
      }
    } catch (err) {
      setLeadResult({ success: false, error: 'Error de conexión con el endpoint de leads' });
    } finally {
      setSubmittingLead(false);
    }
  };

  const sampleAdminProperty = {
    id: "prop_101",
    title: "Departamento Amoblado en Las Condes",
    slug: "departamento-amoblado-en-las-condes",
    operation: "arriendo",
    priceCLP: 850000,
    priceUF: 22.4,
    comuna: "Las Condes",
    address: "Av. Apoquindo 3400",
    ownerId: "owner_987", // Omitted in public
    internalNotes: "El propietario está dispuesto a negociar el arriendo si se paga un año completo por adelantado. Llaves en conserjería.", // Omitted in public
    documentationChecklist: {
      escritura: true,
      rol: true,
      contribuciones: false,
      certificados: true
    } // Omitted in public
  };

  const samplePublicProperty = {
    id: "prop_101",
    title: "Departamento Amoblado en Las Condes",
    slug: "departamento-amoblado-en-las-condes",
    operation: "arriendo",
    priceCLP: 850000,
    priceUF: 22.4,
    comuna: "Las Condes",
    address: "Av. Apoquindo 3400"
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Consola de Integración API</h1>
          <p className="text-sm text-slate-500">
            Prueba en vivo los endpoints públicos que utilizará el sitio demo "Altavista Propiedades" u otros sitios externos.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'sandbox'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-950'
            }`}
          >
            Sandbox de Endpoints
          </button>
          <button
            onClick={() => setActiveTab('leadForm')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'leadForm'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-950'
            }`}
          >
            Simulador de Formulario Público
          </button>
        </div>

        {/* TAB 1: API Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="space-y-8">
            
            {/* Split showing security and isolation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Internal Admin view */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                  <span className="text-xs font-bold text-slate-900">Vista Admin Interna (CRM)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Contiene notas comerciales confidenciales, checklist documental y relaciones del propietario mandante.
                </p>
                <pre className="text-[10px] font-mono p-4 bg-slate-950 text-rose-400 rounded-xl overflow-x-auto h-52">
                  {JSON.stringify(sampleAdminProperty, null, 2)}
                </pre>
              </div>

              {/* Public API view */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Vista API Pública Sanitizada</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Solo expone datos esenciales requeridos para desplegar las fichas de propiedades en la web del cliente.
                </p>
                <pre className="text-[10px] font-mono p-4 bg-slate-950 text-teal-400 rounded-xl overflow-x-auto h-52">
                  {JSON.stringify(samplePublicProperty, null, 2)}
                </pre>
              </div>

            </div>

            {/* Sandbox Sandbox Sandbox */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Sandbox: GET /api/public/demo/properties</h3>
                </div>

                <button
                  onClick={triggerGetProperties}
                  disabled={loadingApi}
                  className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md disabled:opacity-5 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Ejecutar Consulta API
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Haz clic en el botón para realizar un llamado HTTP real a tu base de datos simulada y verificar el JSON retornado.
              </p>

              {apiResponse && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Respuesta JSON (GET)</span>
                  <pre className="text-[10px] font-mono p-4 bg-slate-950 text-teal-100/90 rounded-xl max-h-80 overflow-y-auto leading-relaxed">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Lead capture simulation */}
        {activeTab === 'leadForm' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Description & Guide */}
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">¿Cómo Funciona?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cuando un usuario visita el portal público (e.g. Altavista Propiedades) y rellena el formulario de contacto de una propiedad en venta o arriendo:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 pl-1 leading-relaxed">
                  <li>Se realiza una petición POST con los datos de contacto y el slug de la propiedad.</li>
                  <li>InmoDesk recibe la petición en <code className="bg-slate-100 px-1 rounded-sm text-teal-700 font-mono text-[10px]">/api/public/demo/leads</code>.</li>
                  <li>InmoDesk busca la propiedad correspondiente y asocia el lead automáticamente al inventario interno del corredor.</li>
                  <li>El lead se inyecta en estado <strong>"Nuevo"</strong> directamente en el pipeline.</li>
                </ol>
              </div>
            </div>

            {/* Simulated Lead Form UI */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md lg:col-span-2 space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">Portal Público</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">Formulario de Contacto Altavista</h3>
                </div>
                <div className="h-7 w-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
              </div>

              {leadResult && (
                <div className={`p-4 rounded-xl text-xs font-semibold border ${
                  leadResult.success 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  {leadResult.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                        <span>¡Lead inyectado exitosamente en InmoDesk!</span>
                      </div>
                      <p className="text-[11px] text-emerald-800/80 font-normal leading-relaxed">
                        El lead fue registrado de forma segura. Puedes ir al panel administrativo de InmoDesk para avanzar su negociación.
                      </p>
                      <div className="flex gap-2 border-t border-emerald-100 pt-3 mt-1 font-sans">
                        <Link 
                          href="/pipeline" 
                          className="flex items-center gap-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-750 text-white px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Ver en Pipeline
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                        <Link 
                          href="/leads" 
                          className="text-[10px] font-bold bg-white text-emerald-700 hover:bg-emerald-100/40 px-3 py-1.5 rounded-lg border border-emerald-200"
                        >
                          Ver en Leads
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <span>Error: {leadResult.error}</span>
                  )}
                </div>
              )}

              <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Francisca Pérez"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="francisca@correo.cl"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Teléfono Móvil *</label>
                    <input
                      type="text"
                      required
                      placeholder="+56998765432"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Propiedad de Interés *</label>
                    <select
                      value={leadForm.propertySlug}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, propertySlug: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.slug}>{p.title} ({p.comuna})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Mensaje o Comentario</label>
                  <textarea
                    rows={4}
                    placeholder="Hola, me gustaría agendar una visita a esta propiedad lo antes posible..."
                    value={leadForm.message}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-xs flex justify-center items-center gap-1.5"
                >
                  {submittingLead ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Enviar Formulario de Contacto
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
