'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Building, 
  Phone, 
  Mail, 
  CreditCard,
  Percent,
  AlertCircle,
  X
} from 'lucide-react';
import { Owner, Property } from '@/types';

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Owner form state
  const [showModal, setShowModal] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: '',
    email: '',
    phone: '',
    rut: '',
    commission: 2
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [ownersRes, propsRes] = await Promise.all([
        fetch('/api/admin/owners'),
        fetch('/api/admin/properties')
      ]);
      const ownersData = await ownersRes.json();
      const propsData = await propsRes.json();
      setOwners(ownersData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwner.name || !newOwner.email || !newOwner.phone || !newOwner.rut) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOwner)
      });

      if (res.ok) {
        setShowModal(false);
        setNewOwner({
          name: '',
          email: '',
          phone: '',
          rut: '',
          commission: 2
        });
        fetchData();
      } else {
        const err = await res.json();
        setError(err.error || 'Ocurrió un error al crear el propietario.');
      }
    } catch (err) {
      setError('Error al registrar propietario.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter owners
  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.rut.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Propietarios Mandantes</h1>
            <p className="text-sm text-slate-500">Gestiona los propietarios que entregan mandatos de venta y arriendo de sus inmuebles.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Registrar Propietario
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, rut, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="bg-white py-16 text-center rounded-2xl border border-slate-200">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No se encontraron propietarios mandantes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOwners.map(owner => {
              const ownerPropsCount = properties.filter(p => p.ownerId === owner.id).length;
              return (
                <div key={owner.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                  
                  {/* Top Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-100 shrink-0">
                        {owner.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{owner.name}</h3>
                        <p className="text-[10px] text-slate-400">Mandante desde: {new Date(owner.createdAt).toLocaleDateString('es-CL')}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-50 pt-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-650">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                        <span>RUT: {owner.rut}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-650">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-650">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{owner.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats Block */}
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 shrink-0">
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Comisión Pactada</span>
                      <span className="text-xs font-bold text-teal-700 mt-1 block">{owner.commission}%</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Propiedades Mandadas</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block flex items-center gap-1 justify-end">
                        <Building className="h-3 w-3 text-slate-400" />
                        {ownerPropsCount} {ownerPropsCount === 1 ? 'Propiedad' : 'Propiedades'}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-teal-600" />
                Registrar Nuevo Propietario
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-50 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 font-semibold rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Martín Larraín"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">RUT / Identificación *</label>
                  <input
                    type="text"
                    required
                    placeholder="12.345.678-9"
                    value={newOwner.rut}
                    onChange={(e) => setNewOwner(prev => ({ ...prev, rut: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Comisión Pactada (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newOwner.commission}
                    onChange={(e) => setNewOwner(prev => ({ ...prev, commission: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.cl"
                    value={newOwner.email}
                    onChange={(e) => setNewOwner(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Teléfono Móvil *</label>
                  <input
                    type="text"
                    required
                    placeholder="+56998765432"
                    value={newOwner.phone}
                    onChange={(e) => setNewOwner(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  {submitting && <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>}
                  Guardar Mandante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
