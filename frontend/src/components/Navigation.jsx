import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Ship, Database, DollarSign, Users, ShieldAlert, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const navGroups = [
    {
      title: 'Operaciones',
      icon: <Ship size={16} />,
      routes: [
        { path: '/operaciones/viajes', label: 'Viajes de Pesca' },
        { path: '/operaciones/tripulacion', label: 'Enrolamiento (Tripulación)' },
        { path: '/operaciones/capturas', label: 'Bitácora de Capturas' },
        { path: '/operaciones/gastos', label: 'Gastos Operativos' },
        { path: '/operaciones/historico', label: 'Histórico de Pesca' }
      ]
    },
    {
      title: 'Embarcaciones',
      icon: <Anchor size={16} />,
      routes: [
        { path: '/flota/embarcaciones', label: 'Registro de Flota' },
        { path: '/flota/mantenimiento', label: 'Mantenimientos' },
        { path: '/flota/bitacora', label: 'Bitácora de Mantenimiento' },
        { path: '/flota/activos', label: 'Activos Fijos' }
      ]
    },
    {
      title: 'Finanzas',
      icon: <DollarSign size={16} />,
      routes: [
        { path: '/finanzas/ventas', label: 'Ventas Generales' },
        { path: '/finanzas/detalle-ventas', label: 'Detalle de Ventas' },
        { path: '/finanzas/compras', label: 'Compras de Insumos' },
        { path: '/finanzas/detalle-compras', label: 'Detalle de Compras' },
        { path: '/finanzas/facturacion', label: 'Facturación' },
        { path: '/finanzas/cuotas', label: 'Cuotas Sociales' },
        { path: '/finanzas/nomina', label: 'Pagos de Nómina' }
      ]
    },
    {
      title: 'Catálogos',
      icon: <Database size={16} />,
      routes: [
        { path: '/catalogos/especies', label: 'Especies' },
        { path: '/catalogos/cat-especies', label: 'Cat. Especies' },
        { path: '/catalogos/insumos', label: 'Insumos' },
        { path: '/catalogos/cat-insumos', label: 'Cat. Insumos' },
        { path: '/catalogos/cat-activos', label: 'Tipos de Activo' },
        { path: '/catalogos/cat-instalaciones', label: 'Tipos de Instalación' }
      ]
    },
    {
      title: 'Personal',
      icon: <Users size={16} />,
      routes: [
        { path: '/rh/personal', label: 'Personal y Socios' },
        { path: '/rh/roles', label: 'Roles Operativos' },
        { path: '/rh/clientes', label: 'Cartera de Clientes' },
        { path: '/rh/cooperativas', label: 'Cooperativas (Entidades)' }
      ]
    }
  ];

  return (
    <nav className="border-b border-zinc-800 bg-slate-950 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">

        {/* BRANDING */}
        <Link to="/dashboard" className="text-xl font-bold tracking-tighter flex items-center hover:opacity-80 transition-opacity">
          Coo<span className="text-emerald-500">Pesca</span>
        </Link>

        {/* CENTER MENUS */}
        <div className="flex gap-2 text-sm font-medium">

          {/* Dashboard Link (Direct) */}
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2
                ${location.pathname === '/dashboard' || location.pathname.startsWith('/viajes/') ? 'text-emerald-500 border-b-2 border-emerald-500 rounded-b-none' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
              `}
          >
            Dashboard
          </Link>

          {/* Dropdowns */}
          {navGroups.map((group, idx) => (
            <div key={idx} className="relative group">
              <button
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 
                  ${group.routes.some(r => location.pathname === r.path) ? 'text-emerald-500 border-b-2 border-emerald-500 rounded-b-none' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
                `}
              >
                {group.icon}
                {group.title}
                <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Dropdown Menu Container */}
              <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left shadow-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-50 py-2">
                {group.routes.map((route, rIdx) => (
                  <Link
                    key={rIdx}
                    to={route.path}
                    className={`block px-4 py-2 text-sm transition-colors
                      ${location.pathname === route.path ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                    `}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Alertas */}
          <Link
            to="/alertas"
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2
                ${location.pathname === '/alertas' ? 'text-emerald-500 border-b-2 border-emerald-500 rounded-b-none' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
              `}
          >
            <ShieldAlert size={16} /> Alertas
          </Link>
        </div>

        {/* USER PROFILE */}
        <div className="text-sm font-medium text-zinc-400 flex items-center gap-3">
          <span className="hidden md:inline">Capitán</span>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <Settings size={16} />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Necesito importar Anchor ya que lucide-react lo tiene pero no lo importé arriba.
import { Anchor } from 'lucide-react';

export default Navigation;
