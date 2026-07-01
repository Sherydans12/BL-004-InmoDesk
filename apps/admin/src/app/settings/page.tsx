'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  Save, 
  Code, 
  Copy, 
  Check, 
  Globe, 
  Mail, 
  Phone, 
  Building,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Settings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError('Ocurrió un error al guardar las configuraciones.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setSaving(false);
    }
  };

  const integrationCodeSnippet = `<!-- Integración Altavista Propiedades - InmoDesk Widget -->
<div id="inmodesk-properties-root"></div>

<script>
  (async function() {
    const container = document.getElementById('inmodesk-properties-root');
    if (!container) return;

    // Mostrar estado de carga inicial
    container.innerHTML = \`<div style="text-align: center; padding: 40px; font-family: sans-serif; color: #64748b;">
      <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #0d9488; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 8px;"></div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      <div>Cargando propiedades...</div>
    </div>\`;

    try {
      const apiUrl = window.location.origin + '/api/public/demo/properties';
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Error al conectar con InmoDesk API');
      const properties = await response.json();
      
      if (properties.length === 0) {
        container.innerHTML = \`<div style="text-align: center; padding: 40px; font-family: sans-serif; color: #64748b; border: 1px dashed #cbd5e1; border-radius: 12px;">
          No hay propiedades publicadas disponibles actualmente.
        </div>\`;
        return;
      }

      let cardsHtml = '';
      for (const p of properties) {
        const priceText = p.operation === 'venta' 
          ? p.priceUF + ' UF' 
          : '$' + Number(p.priceCLP || 0).toLocaleString('es-CL');
        const opLabel = p.operation === 'venta' ? 'Venta' : 'Arriendo';
        const image = p.mainImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
        
        cardsHtml += \`<div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
          <img src="\${image}" style="width: 100%; height: 180px; object-fit: cover;" alt="\${p.title}" />
          <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 600; line-height: 1.4;">\${p.title}</h3>
              <p style="color: #64748b; font-size: 12px; margin: 6px 0 12px;">📍 \${p.comuna}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 10px; margin-top: 10px;">
              <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">\${opLabel}</span>
              <span style="font-size: 14px; font-weight: bold; color: #0d9488;">\${priceText}</span>
            </div>
          </div>
        </div>\`;
      }

      container.innerHTML = \`<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; font-family: sans-serif;">
        \${cardsHtml}
      </div>\`;
    } catch (err) {
      console.error('Error al cargar propiedades InmoDesk:', err);
      container.innerHTML = \`<div style="text-align: center; padding: 40px; font-family: sans-serif; color: #e11d48; border: 1px solid #fecdd3; background: #fff1f2; border-radius: 12px;">
        <strong>Error:</strong> No se pudieron cargar las propiedades. Intente más tarde.
      </div>\`;
    }
  })();
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
          <p className="text-sm text-slate-500">Configura la marca de tu corredora y obtén los códigos de integración para tu sitio web público.</p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building className="h-4.5 w-4.5 text-teal-600" />
                Datos de la Empresa / Branding
              </h2>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                  Configuraciones guardadas exitosamente.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nombre de la Empresa *</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={settings?.companyName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Dirección Comercial</label>
                  <input
                    type="text"
                    name="address"
                    value={settings?.address || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Correo de Soporte *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={settings?.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Teléfono de Soporte *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={settings?.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp Móvil</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={settings?.whatsapp || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Color Primario (Hex)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      name="primaryColor"
                      value={settings?.primaryColor || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                    />
                    <div 
                      className="h-8 w-8 rounded-lg border border-slate-300 shrink-0" 
                      style={{ backgroundColor: settings?.primaryColor || '#0d9488' }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Logo URL</label>
                  <input
                    type="text"
                    name="logo"
                    value={settings?.logo || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Configuración
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Integration Sidebar Guide */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-teal-650" />
                Integración API Widget
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                InmoDesk expone una API pública y segura para conectar directamente tu catálogo con el sitio web de tu empresa o marca.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="font-bold text-slate-700 block uppercase text-[9px] mb-1">Endpoints Públicos</span>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-teal-700 font-semibold">
                      <span>GET /api/public/demo/properties</span>
                      <span className="text-[9px] bg-teal-50 px-1 border rounded-sm font-sans uppercase">API</span>
                    </div>
                    <div className="flex justify-between items-center text-teal-700 font-semibold">
                      <span>POST /api/public/demo/leads</span>
                      <span className="text-[9px] bg-teal-50 px-1 border rounded-sm font-sans uppercase">POST</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                  Las notas internas del agente y datos del propietario mandante se eliminan del payload automáticamente para garantizar total confidencialidad.
                </div>
              </div>

              <Link 
                href="/integration"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all w-full"
              >
                <Code className="h-4 w-4" />
                Ver Código de Integración
              </Link>
            </div>
          </div>

        </div>

        {/* Code Snippet Box */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Widget de Integración HTML/Javascript
            </h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all border border-slate-700"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar Código
                </>
              )}
            </button>
          </div>

          <pre className="text-[11px] font-mono overflow-x-auto p-4 bg-slate-950 rounded-xl leading-relaxed text-teal-100/90 whitespace-pre">
            {integrationCodeSnippet}
          </pre>
        </div>

      </div>
    </DashboardLayout>
  );
}
