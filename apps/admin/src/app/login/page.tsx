'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@baselogic.cl');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to home
    const loggedIn = localStorage.getItem('inmodesk_logged_in');
    if (loggedIn === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate short network delay
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        localStorage.setItem('inmodesk_logged_in', 'true');
        router.push('/');
      } else {
        setError('Por favor completa todos los campos.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Building className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inmo<span className="text-teal-600">Desk</span>
          </h2>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">
          SaaS Inmobiliario Reutilizable — Código Interno <span className="font-semibold text-slate-900">BL-004</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 rounded-2xl border border-slate-100 sm:px-10">
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100">
            <p className="text-xs font-semibold text-teal-800 mb-1">Acceso Demo Comercial</p>
            <p className="text-xs text-teal-700/90 leading-relaxed">
              Utiliza los credenciales precargados para iniciar sesión y explorar el panel administrativo.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Ingresar al Panel
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center justify-center gap-1.5 text-center border-t border-slate-100 pt-6">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Broker Demo</span>
            <span className="text-sm font-bold text-slate-800">Altavista Propiedades</span>
            <span className="text-xs text-slate-500">Santiago, Chile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
