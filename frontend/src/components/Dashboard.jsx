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
    revenueHistory: [],
    coopSales: [],
    workforceStats: [],
    coopProduction: []
  });
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [dbConnectionError, setDbConnectionError] = useState(false);
  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const [respViajes, respStats] = await Promise.all([
        api.get(`/viajes?archivados=${showArchived}`),
        api.get('/stats/dashboard')
      ]);
      setViajes(respViajes.data);
      setStats(respStats.data);
      setDbConnectionError(false);
    } catch (error) {
      console.error('Error al conectar con la base operativa:', error);
      setDbConnectionError(true);
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

        <div 
          className={`kpi-content-transition overflow-hidden ${
            isExpanded 
              ? 'max-h-[1000px] opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-4'
          }`}
        >
          <div className="p-5 pt-0 border-t border-zinc-800/50 bg-zinc-900/30">
            <div className="pt-4">
              {renderExpandedContent(id, stats)}
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="w-full">
      <div className="mb-10 mt-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {showArchived ? 'Archivo de ' : 'Cooperativa '}
            <span className={showArchived ? 'text-zinc-500' : 'text-emerald-500'}>
              {showArchived ? 'Operaciones Pasadas' : 'Pesquera'}
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${showArchived
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
            value={stats.workforceStats.reduce((acc, curr) => acc + (parseInt(curr.activos) || 0) + (parseInt(curr.inactivos) || 0), 0)}
            subtitle="Total de empleados"
            color="bg-indigo-500"
          />

          <div className={`mt-4 p-4 rounded-xl border transition-all duration-500 ${
            dbConnectionError 
              ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]' 
              : 'bg-emerald-500/5 border-emerald-500/10'
          }`}>
            <p className={`text-[10px] font-black uppercase mb-1 tracking-widest ${
              dbConnectionError ? 'text-red-500' : 'text-emerald-500'
            }`}>Estado del Sistema</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                dbConnectionError 
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                  : 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]'
              }`}></div>
              <p className={`text-sm font-bold ${dbConnectionError ? 'text-red-400' : 'text-white'}`}>
                {dbConnectionError ? 'Sin Conexión Operativa' : 'Sincronizado con DB'}
              </p>
            </div>
            {dbConnectionError && (
              <p className="text-[10px] text-red-500/60 mt-2 italic">Reintentando enlace con el servidor...</p>
            )}
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
  switch (id) {
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
      return (
        <div className="space-y-4">
          <div className="h-32 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.productionHistory}>
                <defs>
                  <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorProduction)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Rendimiento por Cooperativa</h4>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-tighter">Captura (KG)</span>
            </div>

            {stats.coopProduction && stats.coopProduction.map((coop, idx) => {
              const maxTotal = Math.max(...stats.coopProduction.map(c => parseFloat(c.total) || 1));
              const percentage = (parseFloat(coop.total) / maxTotal) * 100;

              return (
                <div key={idx} className="group relative">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${idx === 0 ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                        idx === 1 ? 'bg-zinc-300 text-black' :
                          idx === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                        {idx + 1}
                      </span>
                      <span className="text-white font-bold text-xs truncate max-w-[140px]">{coop.coop_nombre}</span>
                    </div>
                    <span className="text-zinc-300 font-mono text-[11px] font-bold">
                      {parseFloat(coop.total).toLocaleString()} Kg
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-zinc-700'
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {(!stats.coopProduction || stats.coopProduction.length === 0) && (
              <p className="text-center py-2 text-zinc-600 text-xs italic">No hay datos de producción por cooperativa.</p>
            )}
          </div>
        </div>
      );
    case 'revenue':
      return (
        <div className="space-y-4">
          <div className="h-32 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueHistory}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Leaderboard de Ventas</h4>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter">Ranking Oficial</span>
            </div>

            {stats.coopSales && stats.coopSales.map((coop, idx) => {
              const maxTotal = Math.max(...stats.coopSales.map(c => parseFloat(c.total) || 1));
              const percentage = (parseFloat(coop.total) / maxTotal) * 100;

              return (
                <div key={idx} className="group relative">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${idx === 0 ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                        idx === 1 ? 'bg-zinc-300 text-black' :
                          idx === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                        {idx + 1}
                      </span>
                      <span className="text-white font-bold text-xs truncate max-w-[140px]">{coop.coop_nombre}</span>
                    </div>
                    <span className="text-zinc-300 font-mono text-[11px] font-bold">
                      ${parseFloat(coop.total).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-zinc-700'
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {(!stats.coopSales || stats.coopSales.length === 0) && (
              <p className="text-center py-2 text-zinc-600 text-xs italic">No hay datos de ventas por cooperativa.</p>
            )}
          </div>
        </div>
      );
    case 'personnel':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Personal por Cooperativa</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Activos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Inactivos</span>
              </div>
            </div>
          </div>

          {stats.workforceStats && stats.workforceStats.map((coop, idx) => (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs">{coop.coop_nombre}</span>
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Distribución de Plantilla</span>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center min-w-[40px] px-2 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <span className="text-xs font-black text-emerald-400">{coop.activos}</span>
                  <span className="text-[7px] font-bold text-emerald-500/60 uppercase">ACT</span>
                </div>
                <div className="flex flex-col items-center min-w-[40px] px-2 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <span className="text-xs font-black text-zinc-400">{coop.inactivos}</span>
                  <span className="text-[7px] font-bold text-zinc-500/60 uppercase">INA</span>
                </div>
              </div>
            </div>
          ))}

          {(!stats.workforceStats || stats.workforceStats.length === 0) && (
            <p className="text-center py-2 text-zinc-600 text-xs italic">No hay datos de personal disponibles.</p>
          )}
        </div>
      );
    default: return null;
  }
};

export default Dashboard;
