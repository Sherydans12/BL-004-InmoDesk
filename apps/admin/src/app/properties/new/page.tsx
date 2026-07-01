'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  MapPin, 
  ListFilter, 
  FileText, 
  UserCheck, 
  Globe, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Save 
} from 'lucide-react';
import { Owner } from '@/types';

export default function CreateProperty() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    operation: 'venta' as 'venta' | 'arriendo',
    type: 'casa' as 'casa' | 'departamento' | 'oficina' | 'terreno' | 'local' | 'industrial',
    status: 'borrador' as 'borrador' | 'disponible' | 'reservada' | 'vendida' | 'arrendada' | 'pausada' | 'archivada',
    priceCLP: 0,
    priceUF: 0,
    bedrooms: 0,
    bathrooms: 0,
    areaConstruida: 0,
    areaTerreno: 0,
    address: '',
    comuna: '',
    region: 'Región Metropolitana',
    description: '',
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', // Default gorgeous placeholder
    images: [] as string[],
    isFeatured: false,
    isPublished: false,
    internalNotes: '',
    documentationChecklist: {
      escritura: false,
      rol: false,
      contribuciones: false,
      certificados: false
    },
    ownerId: '',
    agentName: 'Sofía Valdés' // Default logged-in agent
  });

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch('/api/admin/owners');
        const data = await res.json();
        setOwners(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, ownerId: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching owners:', err);
      }
    }
    fetchOwners();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChecklistChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documentationChecklist: {
        ...prev.documentationChecklist,
        [field]: checked
      }
    }));
  };

  // Convert prices based on operation & exchange rate
  // Let's assume 1 UF = 38,000 CLP for calculation help
  const handlePriceCLPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clp = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      priceCLP: clp,
      priceUF: Math.round((clp / 38000) * 10) / 10 // round to 1 decimal
    }));
  };

  const handlePriceUFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uf = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      priceUF: uf,
      priceCLP: Math.round(uf * 38000)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.comuna) {
      setError('Por favor completa los campos obligatorios: Título, Dirección y Comuna.');
      setActiveTab(1);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/properties/${saved.id}`);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Ocurrió un error al guardar la propiedad.');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Error al conectar con la API.');
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 1, name: 'General & Ubicación', icon: MapPin },
    { id: 2, name: 'Características & Ficha', icon: ListFilter },
    { id: 3, name: 'Propietario & Legal', icon: UserCheck },
    { id: 4, name: 'Publicación & Guardar', icon: Globe }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link href="/properties" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a listado
          </Link>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nueva Propiedad</h1>
          <p className="text-sm text-slate-500">Crea una ficha de propiedad detallando los datos comerciales, características e información interna.</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        {/* Tab Headers */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex overflow-x-auto gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          
          {/* TAB 1: General & Location */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Información Básica Comercial</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Título Comercial *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ej. Hermosa Casa Mediterránea en La Dehesa"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Operación
                  </label>
                  <select
                    name="operation"
                    value={formData.operation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  >
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tipo de Propiedad
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  >
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="oficina">Oficina</option>
                    <option value="terreno">Terreno</option>
                    <option value="local">Local Comercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Estado Interno
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="disponible">Disponible</option>
                    <option value="reservada">Reservada</option>
                    <option value="vendida">Vendida</option>
                    <option value="arrendada">Arrendada</option>
                    <option value="pausada">Pausada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Precio CLP
                  </label>
                  <input
                    type="number"
                    name="priceCLP"
                    value={formData.priceCLP || ''}
                    onChange={handlePriceCLPChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="Valor en Pesos"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Cálculo de referencia</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Precio UF
                  </label>
                  <input
                    type="number"
                    name="priceUF"
                    value={formData.priceUF || ''}
                    onChange={handlePriceUFChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="Valor en UF"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">UF de referencia = $38.000</span>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 pt-4">Ubicación Geográfica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Dirección Pública *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Calle, Número, Depto u Oficina"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Comuna *
                  </label>
                  <input
                    type="text"
                    name="comuna"
                    required
                    placeholder="Ej. Las Condes"
                    value={formData.comuna}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Región
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Features & Details */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Características Físicas</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Dormitorios
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Baños
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Área Útil / Const. (m²)
                  </label>
                  <input
                    type="number"
                    name="areaConstruida"
                    value={formData.areaConstruida}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Área Terreno / Total (m²)
                  </label>
                  <input
                    type="number"
                    name="areaTerreno"
                    value={formData.areaTerreno}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 pt-4">Descripción &amp; Fotos</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Descripción Comercial Pública
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    placeholder="Detalla los puntos fuertes de la propiedad, la distribución, el entorno..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Foto Principal (URL)
                  </label>
                  <input
                    type="text"
                    name="mainImage"
                    value={formData.mainImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Inserta un enlace de imagen estable. Por defecto se asigna una foto demo de alta calidad.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Owner & Legal */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Propietario Asociado</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Propietario *
                  </label>
                  <select
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  >
                    <option value="">Selecciona un propietario</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Link 
                    href="/owners"
                    target="_blank" 
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-xl transition-all w-full md:w-auto text-center"
                  >
                    Crear Nuevo Propietario
                  </Link>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 pt-4">Datos de Gestión Interna (CONFIDENCIAL)</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Notas Internas de Negociación
                  </label>
                  <textarea
                    name="internalNotes"
                    rows={3}
                    placeholder="Ej. Propietario acepta ofertas con hasta 5% de descuento. Llaves en conserjería del edificio..."
                    value={formData.internalNotes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                  <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Esta información NUNCA se enviará a la API pública ni se mostrará en la web.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Checklist Documental Interno
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.documentationChecklist.escritura}
                        onChange={(e) => handleChecklistChange('escritura', e.target.checked)}
                        className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Copia de Escrituras</span>
                        <span className="text-[9px] text-slate-400">Verificadas e ingresadas</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.documentationChecklist.rol}
                        onChange={(e) => handleChecklistChange('rol', e.target.checked)}
                        className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Rol de Avalúo</span>
                        <span className="text-[9px] text-slate-400">Identificado ante el SII</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.documentationChecklist.contribuciones}
                        onChange={(e) => handleChecklistChange('contribuciones', e.target.checked)}
                        className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Contribuciones al día</span>
                        <span className="text-[9px] text-slate-400">Último comprobante verificado</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.documentationChecklist.certificados}
                        onChange={(e) => handleChecklistChange('certificados', e.target.checked)}
                        className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Certificados de Gravámenes</span>
                        <span className="text-[9px] text-slate-400">Libre de embargos o deudas</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Publication & Save */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Estado y Visibilidad Pública</h2>
              
              <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3">
                <Globe className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-teal-900">Configuración Web Pública</p>
                  <p className="text-xs text-teal-800/90 leading-relaxed">
                    Al marcar esta propiedad como "Publicada", se expondrá inmediatamente en la API pública de demostración comercial. 
                    Podrás verla en el widget y simular su carga en la web del cliente.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="h-5 w-5 rounded-md text-teal-600 focus:ring-teal-500 border-slate-300 mt-0.5"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Publicar en la Web</span>
                    <span className="text-xs text-slate-500 mt-0.5">Expone los datos comerciales básicos y fotos públicamente.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-5 w-5 rounded-md text-teal-600 focus:ring-teal-500 border-slate-300 mt-0.5"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Propiedad Destacada</span>
                    <span className="text-xs text-slate-500 mt-0.5">Añade esta propiedad al banner principal y posiciones prioritarias de la web.</span>
                  </div>
                </label>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-64 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      Crear Propiedad en InmoDesk
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons inside form */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              disabled={activeTab === 1}
              onClick={() => setActiveTab(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>

            {activeTab < 4 ? (
              <button
                type="button"
                onClick={() => setActiveTab(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
