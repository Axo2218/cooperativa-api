import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import topoBg from './assets/topo-bg.png';

// Components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DetallesViajeWrapper from './components/DetallesViajeWrapper';
import AIChatbot from './components/AIChatbot';
import Geolocalizacion from './components/Geolocalizacion';

// CRUD Components - Operaciones
import ViajeCRUD from './components/ViajeCRUD';
import ViajePersonalCRUD from './components/ViajePersonalCRUD';
import ViajeDetalleCapturaCRUD from './components/ViajeDetalleCapturaCRUD';
import ViajeGastoCRUD from './components/ViajeGastoCRUD';
import PescaHistoricoCRUD from './components/PescaHistoricoCRUD';

// CRUD Components - Flota
import EmbarcacionCRUD from './components/EmbarcacionCRUD';
import MantenimientoEmbarcacionCRUD from './components/MantenimientoEmbarcacionCRUD';
import BitacoraMantenimientoCRUD from './components/BitacoraMantenimientoCRUD';
import ActivosFijosCRUD from './components/ActivosFijosCRUD';

// CRUD Components - Finanzas
import VentaCRUD from './components/VentaCRUD';
import DetalleVentasCRUD from './components/DetalleVentasCRUD';
import ComprasInsumosCRUD from './components/ComprasInsumosCRUD';
import DetalleCompraInsumosCRUD from './components/DetalleCompraInsumosCRUD';
import FacturacionCRUD from './components/FacturacionCRUD';
import CuotasCRUD from './components/CuotasCRUD';
import PagosNominaCRUD from './components/PagosNominaCRUD';

// CRUD Components - Catálogos
import EspeciesCRUD from './components/EspeciesCRUD';
import CategoriaEspecieCRUD from './components/CategoriaEspecieCRUD';
import InsumosCRUD from './components/InsumosCRUD';
import CategoriaCRUD from './components/CategoriaCRUD'; // Cat insumos
import CatTipoActivoCRUD from './components/CatTipoActivoCRUD';
import CatTipoInstalacionCRUD from './components/CatTipoInstalacionCRUD';

// CRUD Components - RRHH
import PersonalCRUD from './components/PersonalCRUD';
import RolCRUD from './components/RolCRUD';
import ClientesCRUD from './components/ClientesCRUD';
import CooperativaCRUD from './components/CooperativaCRUD';
import AlertaSistemaCRUD from './components/AlertaSistemaCRUD';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col relative overflow-x-hidden">
        {/* Fondo Topográfico */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-20 z-0"
          style={{ 
            backgroundImage: `url(${topoBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)'
          }}
        />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-20 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard y Detalles */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viajes/:id" element={<DetallesViajeWrapper />} />
            <Route path="/geolocalizacion" element={<Geolocalizacion />} />
            
            {/* Operaciones */}
            <Route path="/operaciones/viajes" element={<ViajeCRUD />} />
            <Route path="/operaciones/tripulacion" element={<ViajePersonalCRUD />} />
            <Route path="/operaciones/capturas" element={<ViajeDetalleCapturaCRUD />} />
            <Route path="/operaciones/gastos" element={<ViajeGastoCRUD />} />
            <Route path="/operaciones/historico" element={<PescaHistoricoCRUD />} />

            {/* Flota */}
            <Route path="/flota/embarcaciones" element={<EmbarcacionCRUD />} />
            <Route path="/flota/mantenimiento" element={<MantenimientoEmbarcacionCRUD />} />
            <Route path="/flota/bitacora" element={<BitacoraMantenimientoCRUD />} />
            <Route path="/flota/activos" element={<ActivosFijosCRUD />} />

            {/* Finanzas */}
            <Route path="/finanzas/ventas" element={<VentaCRUD />} />
            <Route path="/finanzas/detalle-ventas" element={<DetalleVentasCRUD />} />
            <Route path="/finanzas/compras" element={<ComprasInsumosCRUD />} />
            <Route path="/finanzas/detalle-compras" element={<DetalleCompraInsumosCRUD />} />
            <Route path="/finanzas/facturacion" element={<FacturacionCRUD />} />
            <Route path="/finanzas/cuotas" element={<CuotasCRUD />} />
            <Route path="/finanzas/nomina" element={<PagosNominaCRUD />} />

            {/* Catálogos */}
            <Route path="/catalogos/especies" element={<EspeciesCRUD />} />
            <Route path="/catalogos/cat-especies" element={<CategoriaEspecieCRUD />} />
            <Route path="/catalogos/insumos" element={<InsumosCRUD />} />
            <Route path="/catalogos/cat-insumos" element={<CategoriaCRUD />} />
            <Route path="/catalogos/cat-activos" element={<CatTipoActivoCRUD />} />
            <Route path="/catalogos/cat-instalaciones" element={<CatTipoInstalacionCRUD />} />

            {/* RRHH y Organización */}
            <Route path="/rh/personal" element={<PersonalCRUD />} />
            <Route path="/rh/roles" element={<RolCRUD />} />
            <Route path="/rh/clientes" element={<ClientesCRUD />} />
            <Route path="/rh/cooperativas" element={<CooperativaCRUD />} />
            
            {/* Alertas */}
            <Route path="/alertas" element={<AlertaSistemaCRUD />} />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-32">
                <h2 className="text-4xl font-bold text-emerald-500 mb-4">404</h2>
                <p className="text-zinc-400">La página solicitada no existe o está en construcción.</p>
              </div>
            } />
          </Routes>
        </main>

        <footer className="py-8 border-t border-zinc-900 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-3">
            <div className="flex flex-col items-center">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                © {new Date().getFullYear()} · Josué Segura Milla
              </p>
              <div className="h-px w-12 bg-emerald-500/30 mb-2"></div>
            </div>
            
            <p className="text-zinc-600 text-[10px] max-w-2xl leading-relaxed">
              Sistema de Gestión Pesquera e Inteligencia Operativa desarrollado para la cátedra de 
              <span className="text-zinc-400 font-bold mx-1 text-[11px]">Arquitectura Big Data y Ciencia de Datos</span> 
              bajo la dirección del <span className="text-zinc-400 font-bold mx-1 text-[11px]">M.A Jose Manuel Aguilar</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['React 18', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Express', 'Recharts'].map(tech => (
                <span key={tech} className="text-[8px] font-bold bg-zinc-900/50 text-zinc-500 px-2 py-1 rounded-md border border-zinc-800/50 hover:border-emerald-500/30 hover:text-emerald-500 transition-all cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </footer>
          <AIChatbot />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;