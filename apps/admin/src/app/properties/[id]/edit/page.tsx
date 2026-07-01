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
  Save,
  AlertCircle
} from 'lucide-react';
import { Owner, Property } from '@/types';

export default function EditProperty({ params }: { params: any }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
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
    mainImage: '',
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
    agentName: 'Sofía Valdés'
  });

  const fetchData = async (propId: string) => {
    try {
      const [propRes, ownersRes] = await Promise.all([
        fetch(`/api/admin/properties/${propId}`),
        fetch('/api/admin/owners')
      ]);

      if (!propRes.ok) {
        throw new Error('Property not found');
      }

      const propData = await propRes.json() as Property;
      const ownersData = await ownersRes.json() as Owner[];

      setOwners(ownersData);
      setFormData({
        title: propData.title || '',
        operation: propData.operation || 'venta',
        type: propData.type || 'casa',
        status: propData.status || 'borrador',
        priceCLP: propData.priceCLP || 0,
        priceUF: propData.priceUF || 0,
        bedrooms: propData.bedrooms || 0,
        bathrooms: propData.bathrooms || 0,
        areaConstruida: propData.areaConstruida || 0,
        areaTerreno: propData.areaTerreno || 0,
        address: propData.address || '',
        comuna: propData.comuna || '',
        region: propData.region || 'Región Metropolitana',
        description: propData.description || '',
        mainImage: propData.mainImage || '',
        images: propData.images || [],
        isFeatured: propData.isFeatured || false,
        isPublished: propData.isPublished || false,
        internalNotes: propData.internalNotes || '',
        documentationChecklist: propData.documentationChecklist || {
          escritura: false,
          rol: false,
          contribuciones: false,
          certificados: false
        },
        ownerId: propData.ownerId || '',
        agentName: propData.agentName || 'Sofía Valdés'
      });
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la propiedad.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      fetchData(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

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

  const handlePriceCLPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clp = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      priceCLP: clp,
      priceUF: Math.round((clp / 38000) * 10) / 10
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
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push(`/properties/${id}`);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
            <span className="text-xs text-slate-500">Cargando datos de propiedad...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-2">
          <Link href={`/properties/${id}`} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a la Ficha
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Propiedad</h1>
          <p className="text-sm text-slate-500">Actualiza los datos del inmueble, precios, notas de negociación o estado de publicación.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          
          {/* TAB 1 */}
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
                    <option value="archivada">Archivada</option>
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
                  />
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
                  />
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
                    value={formData.comuna}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 */}
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
                    Área Útil (m²)
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
                    Área Terreno (m²)
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
                    Descripción Comercial
                  </label>
                  <textarea
                    name="description"
                    rows={5}
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
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Propietario Asociado</h2>
              
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

              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 pt-4">Datos de Gestión Interna (CONFIDENCIAL)</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Notas Internas de Negociación
                  </label>
                  <textarea
                    name="internalNotes"
                    rows={3}
                    value={formData.internalNotes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Checklist Documental Interno
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['escritura', 'rol', 'contribuciones', 'certificados'].map((key) => (
                      <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.documentationChecklist[key as keyof typeof formData.documentationChecklist]}
                          onChange={(e) => handleChecklistChange(key, e.target.checked)}
                          className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                        />
                        <span className="text-xs font-bold text-slate-800 capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4 */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Estado y Visibilidad Pública</h2>
              
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
                    <span className="text-xs text-slate-500 mt-0.5">Añade esta propiedad al banner principal de la web.</span>
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
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              disabled={activeTab === 1}
              onClick={() => setActiveTab(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30"
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
