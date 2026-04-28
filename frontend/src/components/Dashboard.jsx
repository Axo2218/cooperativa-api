import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ViajeCard from './ViajeCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [viajes, setViajes] = useState([]);
  const navigate = useNavigate();

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

  const abrirDetalles = (viaje) => {
    navigate(`/viajes/${viaje.via_id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 w-full">
      <div className="text-center mb-16 mt-4">
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
        {viajes.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800">
            No hay viajes registrados. Comienza planificando un nuevo viaje.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
