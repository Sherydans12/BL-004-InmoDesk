'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  GitBranch, 
  Calendar, 
  UserCheck, 
  Settings as SettingsIcon, 
  Code, 
  Plus, 
  Search, 
  Bell, 
  LogOut,
  Menu,
  X,
  Building
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication
    const loggedIn = localStorage.getItem('inmodesk_logged_in');
    const authStatus = loggedIn === 'true';
    
    const timer = setTimeout(() => {
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        router.push('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Cargando InmoDesk...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Propiedades', href: '/properties', icon: Home },
    { name: 'Leads / Interesados', href: '/leads', icon: Users },
    { name: 'Pipeline Comercial', href: '/pipeline', icon: GitBranch },
    { name: 'Agenda de Visitas', href: '/agenda', icon: Calendar },
    { name: 'Propietarios', href: '/owners', icon: UserCheck },
    { name: 'Configuración Pública', href: '/settings', icon: SettingsIcon },
    { name: 'Integración API', href: '/integration', icon: Code },
  ];

  const handleLogout = () => {
    localStorage.removeItem('inmodesk_logged_in');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2">
          <Building className="h-6 w-6 text-teal-600" />
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Inmo<span className="text-teal-600">Desk</span>
          </span>
          <span className="ml-auto text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
            SaaS
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-250 ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
              SV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Sofía Valdés</p>
              <p className="text-[10px] text-slate-500 truncate">Agente Inmobiliario</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header / Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white flex flex-col transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-teal-600" />
            <span className="font-bold text-lg text-slate-900">Inmo<span className="text-teal-600">Desk</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
              SV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Sofía Valdés</p>
              <p className="text-[10px] text-slate-500 truncate">Agente Inmobiliario</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Global Search Mock */}
            <div className="relative w-48 sm:w-64 hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar propiedades, leads..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <Link 
              href="/properties/new" 
              className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nueva Propiedad</span>
            </Link>

            {/* Notification Badge Mock */}
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 relative transition-all">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-teal-600 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            {/* Public site status visual */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sitio Público</span>
              <a 
                href="/integration"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 justify-end"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Altavista Activo
              </a>
            </div>
          </div>
        </header>

        {/* Inner Content scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
