import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Ship, Database, DollarSign, Users, ShieldAlert, Settings, Anchor, Map, LogOut } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  const navRefs = useRef({});

  const navGroups = [
    {
      id: 'operaciones',
      title: 'Operaciones',
      icon: <Ship size={16} />,
      routes: [
        { path: '/operaciones/viajes', label: 'Viajes de Pesca' },
        { path: '/operaciones/tripulacion', label: 'Enrolamiento (Tripulación)' },
        { path: '/operaciones/capturas', label: 'Bitácora de Capturas' },
        { path: '/operaciones/gastos', label: 'Gastos Operativos' },
        { path: '/operaciones/historico', label: 'Histórico de Pesca' },
        { path: '/geolocalizacion', label: 'Geolocalización (Mapa)' }
      ]
    },
    {
      id: 'embarcaciones',
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
      id: 'finanzas',
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
      id: 'catalogos',
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
      id: 'personal',
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

  const containerRef = useRef(null);

  useEffect(() => {
    const updateIndicator = () => {
      let activeId = '';

      if (location.pathname === '/dashboard' || location.pathname.startsWith('/viajes/')) {
        activeId = 'dashboard';
      } else if (location.pathname === '/geolocalizacion') {
        activeId = 'geolocalizacion';
      } else if (location.pathname === '/alertas') {
        activeId = 'alertas';
      } else {
        const activeGroup = navGroups.find(g => g.routes.some(r => location.pathname === r.path));
        if (activeGroup) activeId = activeGroup.id;
      }

      const activeElement = navRefs.current[activeId];
      const container = containerRef.current;

      if (activeElement && container) {
        const activeRect = activeElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Ejecutar inmediatamente y tras un breve delay por si el DOM cambia
    updateIndicator();
    const timer = setTimeout(updateIndicator, 100);

    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${
      scrolled 
        ? 'py-3 bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
        : 'py-5 bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">

        {/* BRANDING */}
        <Link to="/dashboard" className="flex items-center group">
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            CooPesca
          </span>
        </Link>

        {/* CENTER MENUS */}
        <div ref={containerRef} className="flex gap-2 text-sm font-medium relative items-center h-10">

          {/* Sliding Indicator */}
          <div
            className="absolute bottom-[-17px] h-[3px] bg-emerald-500 rounded-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }}
          />

          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            ref={el => navRefs.current['dashboard'] = el}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 relative z-10
                ${(location.pathname === '/dashboard' || location.pathname.startsWith('/viajes/')) ? 'text-emerald-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}
              `}
          >
            Dashboard
          </Link>
          
          {/* Dropdowns */}
          {navGroups.map((group, idx) => {
            const isGroupActive = group.routes.some(r => location.pathname === r.path);
            return (
              <div key={idx} className="relative group">
                <button
                  ref={el => navRefs.current[group.id] = el}
                  className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 relative z-10
                    ${isGroupActive ? 'text-emerald-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}
                  `}
                >
                  {group.icon}
                  {group.title}
                  <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className="absolute top-full left-0 mt-3 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top shadow-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden z-50 py-2">
                  {group.routes.map((route, rIdx) => (
                    <Link
                      key={rIdx}
                      to={route.path}
                      className={`block px-4 py-2.5 text-sm transition-colors
                        ${location.pathname === route.path ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}
                      `}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Alertas */}
          <Link
            to="/alertas"
            ref={el => navRefs.current['alertas'] = el}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2 relative z-10
                ${location.pathname === '/alertas' ? 'text-emerald-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}
              `}
          >
            <ShieldAlert size={16} /> Alertas
          </Link>
        </div>

        {/* USER PROFILE */}
        <div className="text-sm font-medium text-zinc-400 flex items-center gap-3">
          <span className="hidden md:inline">Super Admin</span>
          <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.reload();
            }}
            className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
