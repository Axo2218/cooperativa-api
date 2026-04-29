import React, { useEffect, useState } from 'react';
import api from './services/api';
import ViajeCard from './components/ViajeCard';
import AdminViajes from './components/AdminViajes';
import DetallesViaje from './components/DetallesViaje'; // <-- 1. Importamos la nueva bitácora

function App() {
  const [viajes, setViajes] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('embarcaciones'); // 'embarcaciones' o 'admin'
  // <-- 2. Nuevo estado para guardar qué barco se seleccionó
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const cargarViajes = async () => {
    try {
      const respuesta = await api.get('/viajes');
      setViajes(respuesta.data);
    } catch (error) {
      console.error('Error al conectar con la base operativa:', error);
    }
  };

  useEffect(() => {
    cargarViajes();
  }, []);

  // <-- 3. Función que se dispara al dar clic en la tarjeta
  const abrirDetalles = (viaje) => {
    setViajeSeleccionado(viaje);
    setVistaActiva('detalles');

  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-slate-950 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-xl font-bold tracking-tighter">
          Coop<span className="text-emerald-500">Pesca</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <button
            onClick={() => setVistaActiva('dashboard')}
            className={`transition-colors ${(vistaActiva === 'dashboard' || vistaActiva === 'detalles') ? 'text-emerald-500 border-b-2 border-emerald-500 pb-1' : 'text-zinc-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setVistaActiva('admin')}
            className={`transition-colors ${vistaActiva === 'admin' ? 'text-emerald-500 border-b-2 border-emerald-500 pb-1' : 'text-zinc-400 hover:text-white'}`}
          >
            Súper Admin
          </button>
        </div>
        <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <span>Capitán Axo</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* RENDERIZADO CONDICIONAL DE PANTALLAS */}

        {vistaActiva === 'dashboard' && (
          <>
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
                Centro de <span className="text-emerald-500">Mando de Flota</span>
              </h1>
              <p className="text-zinc-400 text-lg">Monitorea los viajes en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viajes.map(viaje => (
                <ViajeCard
                  key={viaje.via_id}
                  viaje={viaje}
                  onVerDetalles={() => abrirDetalles(viaje)}
                />
              ))}
            </div>
          </>
        )}

        {vistaActiva === 'admin' && (
          <AdminViajes viajes={viajes} recargarViajes={cargarViajes} />
        )}

        {/* 5. Nueva vista de detalles */}
        {vistaActiva === 'detalles' && viajeSeleccionado && (
          <DetallesViaje
            viaje={viajeSeleccionado}
            volver={() => setVistaActiva('dashboard')}
          />
        )}

      </div>
    </div>
  );
}

export default App;