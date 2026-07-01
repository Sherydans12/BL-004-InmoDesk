'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  Building, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Star, 
  Globe, 
  Check, 
  AlertCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { Property } from '@/types';

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterComuna, setFilterComuna] = useState('');

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties');
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleTogglePublished = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentVal })
      });
      if (res.ok) {
        // Optimistic update or refetch
        setProperties(prev => prev.map(p => p.id === id ? { ...p, isPublished: !currentVal } : p));
      }
    } catch (error) {
      console.error('Error toggling publication:', error);
    }
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentVal })
      });
      if (res.ok) {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !currentVal } : p));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterOperation('');
    setFilterType('');
    setFilterStatus('');
    setFilterComuna('');
  };

  // Get unique comunas for filter dropdown
  const uniqueComunas = Array.from(new Set(properties.map(p => p.comuna))).filter(Boolean);

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.comuna.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperation = filterOperation ? prop.operation === filterOperation : true;
    const matchesType = filterType ? prop.type === filterType : true;
    const matchesStatus = filterStatus ? prop.status === filterStatus : true;
    const matchesComuna = filterComuna ? prop.comuna === filterComuna : true;

    return matchesSearch && matchesOperation && matchesType && matchesStatus && matchesComuna;
  });

  const propertyStatusColors = {
    borrador: 'bg-slate-100 text-slate-700 border-slate-200',
    disponible: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    reservada: 'bg-amber-50 text-amber-700 border-amber-100',
    vendida: 'bg-blue-50 text-blue-700 border-blue-100',
    arrendada: 'bg-purple-50 text-purple-700 border-purple-100',
    pausada: 'bg-rose-50 text-rose-700 border-rose-100',
    archivada: 'bg-slate-200 text-slate-600 border-slate-300'
  };

  const propertyStatusLabels = {
    borrador: 'Borrador',
    disponible: 'Disponible',
    reservada: 'Reservada',
    vendida: 'Vendida',
    arrendada: 'Arrendada',
    pausada: 'Pausada',
    archivada: 'Archivada'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Propiedades</h1>
            <p className="text-sm text-slate-500">Administra tu portafolio inmobiliario y su estado de publicación en la web.</p>
          </div>
          <Link 
            href="/properties/new" 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Nueva Propiedad
          </Link>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, dirección, comuna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
            
            {/* Operation Filter */}
            <select
              value={filterOperation}
              onChange={(e) => setFilterOperation(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="">Operación (Todos)</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="">Tipo (Todos)</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="oficina">Oficina</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local Comercial</option>
              <option value="industrial">Industrial</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="">Estado (Todos)</option>
              {Object.entries(propertyStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Comuna Filter */}
            <select
              value={filterComuna}
              onChange={(e) => setFilterComuna(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="">Comuna (Todos)</option>
              {uniqueComunas.map(comuna => (
                <option key={comuna} value={comuna}>{comuna}</option>
              ))}
            </select>

            {/* Reset Button */}
            {(searchTerm || filterOperation || filterType || filterStatus || filterComuna) && (
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
                <span className="text-xs text-slate-500">Cargando propiedades...</span>
              </div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900">No se encontraron propiedades</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Prueba ajustando los filtros de búsqueda o registra una propiedad nueva.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                    <th className="py-3.5 px-5">Propiedad</th>
                    <th className="py-3.5 px-4">Operación</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Comuna</th>
                    <th className="py-3.5 px-4">Precio</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-center">Publicada Web</th>
                    <th className="py-3.5 px-4 text-center">Destacada</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/40 transition-colors group">
                      {/* Image & Title */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <img
                              src={prop.mainImage}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/properties/${prop.id}`} className="font-bold text-slate-900 hover:text-teal-600 truncate block text-xs max-w-[200px]">
                              {prop.title}
                            </Link>
                            <span className="text-[10px] text-slate-400 truncate block mt-0.5">{prop.address}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Operation */}
                      <td className="py-4 px-4 capitalize font-medium text-slate-700">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          prop.operation === 'venta' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {prop.operation}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 capitalize text-slate-600">{prop.type}</td>

                      {/* Comuna */}
                      <td className="py-4 px-4 text-slate-600">{prop.comuna}</td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {prop.operation === 'venta' 
                          ? `${prop.priceUF.toLocaleString('es-CL')} UF`
                          : `$${prop.priceCLP.toLocaleString('es-CL')}`
                        }
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-semibold border ${
                          propertyStatusColors[prop.status as keyof typeof propertyStatusColors] || 'bg-slate-50 text-slate-600'
                        }`}>
                          {propertyStatusLabels[prop.status as keyof typeof propertyStatusLabels]}
                        </span>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublished(prop.id, prop.isPublished)}
                          className={`inline-flex p-1.5 rounded-lg border transition-all ${
                            prop.isPublished
                              ? 'bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                          title={prop.isPublished ? 'Publicada: hacer clic para ocultar' : 'Oculta: hacer clic para publicar'}
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prop.id, prop.isFeatured)}
                          className={`inline-flex p-1.5 rounded-lg border transition-all ${
                            prop.isFeatured
                              ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                          title={prop.isFeatured ? 'Destacada: hacer clic para quitar' : 'No destacada: hacer clic para destacar'}
                        >
                          <Star className={`h-4 w-4 ${prop.isFeatured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${prop.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                            title="Ver Ficha Detalle"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/properties/${prop.id}/edit`}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                            title="Editar Ficha"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
