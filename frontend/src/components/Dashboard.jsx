import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ViajeCard from './ViajeCard';
import { useNavigate } from 'react-router-dom';
import { Ship, Users, Anchor, DollarSign, TrendingUp, Activity, Archive, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [viajes, setViajes] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [stats, setStats] = useState({
    totalEmbarcaciones: 0,
    viajesActivos: 0,
    viajesPreparacion: 0,
    totalKilos: 0,
    totalVentas: 0,
    personalStats: [],
    fleetList: [],
    activeTrips: [],
    productionHistory: [],
    revenueHistory: []
  });
  const [selectedKpi, setSelectedKpi] = useState(null);
  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const [respViajes, respStats] = await Promise.all([
        api.get(`/viajes?archivados=${showArchived}`),
        api.get('/stats/dashboard')
      ]);
      setViajes(respViajes.data);
      setStats(respStats.data);
    } catch (error) {
      console.error('Error al conectar con la base operativa:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [showArchived]);

  const abrirDetalles = (viaje) => {
    navigate(`/viajes/${viaje.via_id}`);
  };

  const handleArchivar = async (viajeId) => {
    try {
      await api.patch(`/viajes/${viajeId}/archivar`);
      cargarDatos();
    } catch (error) {
      console.error('Error al archivar viaje:', error);
    }
  };

  const handleDesarchivar = async (viajeId) => {
    try {
      await api.patch(`/viajes/${viajeId}/desarchivar`);
      cargarDatos();
    } catch (error) {
      console.error('Error al desarchivar viaje:', error);
    }
  };

  const KpiCard = ({ icon: Icon, title, value, subtitle, color, id }) => {
    const isExpanded = selectedKpi === id;
    
    return (
      <div 
        className={`bg-zinc-900/50 border ${isExpanded ? 'border-zinc-600 ring-1 ring-zinc-600' : 'border-zinc-800'} rounded-xl transition-all shadow-lg overflow-hidden flex flex-col`}
      >
        <div 
          onClick={() => setSelectedKpi(isExpanded ? null : id)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
              <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</p>
              <p className="text-2xl font-black text-white leading-tight">{value}</p>
              {subtitle && <p className="text-zinc-400 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className={`text-zinc-600 group-hover:text-zinc-400 transition-all ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} />
          </div>
        </div>

        {isExpanded && (
          <div className="p-5 pt-0 border-t border-zinc-800/50 bg-zinc-900/30 animate-in slide-in-from-top-2 duration-300">
            <div className="pt-4">
              {renderExpandedContent(id, stats)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExpandedContent = (id) => {
    switch(id) {
      case 'fleet':
        return (
          <div className="space-y-2">
            {stats.fleetList.map((ship, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                <span className="text-white font-bold text-sm">{ship.emb_nombre}</span>
                <span className="text-zinc-500 text-xs font-mono">{ship.emb_matricula}</span>
              </div>
            ))}
          </div>
        );
      case 'operation':
        return (
          <div className="space-y-2">
            {stats.activeTrips.map((trip, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                <span className="text-white font-bold text-sm">{trip.emb_nombre}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[9px] font-black uppercase">
                  Activo
                </span>
              </div>
            ))}
            {stats.activeTrips.length === 0 && (
              <p className="text-center py-2 text-zinc-600 text-xs italic">No hay barcos en curso.</p>
            )}
          </div>
        );
      case 'production':
      case 'revenue':
        const isProd = id === 'production';
        return (
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={isProd ? stats.productionHistory : stats.revenueHistory}>
                <defs>
                  <linearGradient id={`color${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isProd ? '#f59e0b' : '#a855f7'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isProd ? '#f59e0b' : '#a855f7'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="mes" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke={isProd ? '#f59e0b' : '#a855f7'} 
                  fillOpacity={1} 
                  fill={`url(#color${id})`} 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case 'personnel':
        return (
          <div className="grid grid-cols-1 gap-2">
            {stats.personalStats.map((st, idx) => {
              const isActive = st.per_estatus === 'Activo';
              return (
                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border ${isActive ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/20 border-zinc-800'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-zinc-600'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {isActive ? 'Personal Activo' : 'Personal Inactivo'}
                    </span>
                  </div>
                  <span className={`text-lg font-black ${isActive ? 'text-white' : 'text-zinc-400'}`}>{st.count}</span>
                </div>
              );
            })}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 w-full">
      <div className="mb-10 mt-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {showArchived ? 'Archivo de ' : 'Centro de '}
            <span className={showArchived ? 'text-zinc-500' : 'text-emerald-500'}>
              {showArchived ? 'Operaciones Pasadas' : 'Mando de Flota'}
            </span>
          </h1>
          <p className="text-zinc-400">
            {showArchived 
              ? 'Historial de viajes completados y cancelados.' 
              : 'Rendimiento global y monitoreo de operaciones en tiempo real.'}
          </p>
        </div>
        
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${
            showArchived 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
          }`}
        >
          {showArchived ? <Activity size={18} /> : <Archive size={18} />}
          {showArchived ? 'Volver al Mando' : 'Ver Archivados'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-80 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity size={16} /> Indicadores Globales
          </h2>
          
          <KpiCard 
            id="fleet"
            icon={Ship} 
            title="Flota Total" 
            value={stats.totalEmbarcaciones} 
            subtitle="Barcos registrados"
            color="bg-blue-500"
          />
          
          <KpiCard 
            id="operation"
            icon={Anchor} 
            title="En Operación" 
            value={stats.viajesActivos} 
            subtitle={`${stats.viajesPreparacion} en preparación`}
            color="bg-emerald-500"
          />
          
          <KpiCard 
            id="production"
            icon={TrendingUp} 
            title="Producción" 
            value={`${stats.totalKilos} Kg`} 
            subtitle="Captura total histórica"
            color="bg-amber-500"
          />
          
          <KpiCard 
            id="revenue"
            icon={DollarSign} 
            title="Ingresos" 
            value={`$${parseFloat(stats.totalVentas).toLocaleString()}`} 
            subtitle="Ventas totales"
            color="bg-purple-500"
          />
          
          <KpiCard 
            id="personnel"
            icon={Users} 
            title="Fuerza Laboral" 
            value={stats.personalStats.reduce((acc, curr) => acc + parseInt(curr.count), 0)} 
            subtitle="Personal activo"
            color="bg-indigo-500"
          />
          
          <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <p className="text-xs text-emerald-500 font-bold uppercase mb-1">Estado del Sistema</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-sm text-white">Sincronizado con DB</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             {showArchived ? 'Viajes Archivados' : 'Monitoreo de Viajes'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
            {viajes.map(viaje => (
              <ViajeCard
                key={viaje.via_id}
                viaje={viaje}
                onVerDetalles={() => abrirDetalles(viaje)}
                onArchivar={() => handleArchivar(viaje.via_id)}
                onDesarchivar={() => handleDesarchivar(viaje.via_id)}
              />
            ))}
            {viajes.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                No hay viajes activos en este momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderExpandedContent = (id, stats) => {
  switch(id) {
    case 'fleet':
      return (
        <div className="space-y-2">
          {stats.fleetList.map((ship, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
              <span className="text-white font-bold text-sm">{ship.emb_nombre}</span>
              <span className="text-zinc-500 text-xs font-mono">{ship.emb_matricula}</span>
            </div>
          ))}
        </div>
      );
    case 'operation':
      return (
        <div className="space-y-2">
          {stats.activeTrips.map((trip, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
              <span className="text-white font-bold text-sm">{trip.emb_nombre}</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[9px] font-black uppercase">
                Activo
              </span>
            </div>
          ))}
          {stats.activeTrips.length === 0 && (
            <p className="text-center py-2 text-zinc-600 text-xs italic">No hay barcos en curso.</p>
          )}
        </div>
      );
    case 'production':
    case 'revenue':
      const isProd = id === 'production';
      return (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={isProd ? stats.productionHistory : stats.revenueHistory}>
              <defs>
                <linearGradient id={`color${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isProd ? '#f59e0b' : '#a855f7'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isProd ? '#f59e0b' : '#a855f7'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="mes" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '10px' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke={isProd ? '#f59e0b' : '#a855f7'} 
                fillOpacity={1} 
                fill={`url(#color${id})`} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    case 'personnel':
      return (
        <div className="grid grid-cols-1 gap-2">
          {stats.personalStats.map((st, idx) => {
            const isActive = st.per_estatus === 'Activo';
            return (
              <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border ${isActive ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/20 border-zinc-800'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-zinc-600'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {isActive ? 'Personal Activo' : 'Personal Inactivo'}
                  </span>
                </div>
                <span className={`text-lg font-black ${isActive ? 'text-white' : 'text-zinc-400'}`}>{st.count}</span>
              </div>
            );
          })}
        </div>
      );
    default: return null;
  }
};

export default Dashboard;
