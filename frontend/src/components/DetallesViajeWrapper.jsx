import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DetallesViajeOriginal from './DetallesViaje';

const DetallesViajeWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViaje = async () => {
      try {
        const { data } = await api.get(`/viaje/${id}`);
        setViaje(data);
      } catch (error) {
        console.error('Error fetching viaje details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchViaje();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-emerald-500">Cargando bitácora de viaje...</div>;
  if (!viaje) return <div className="text-center py-20 text-red-500">Viaje no encontrado.</div>;

  return (
    <DetallesViajeOriginal 
        viaje={viaje} 
        volver={() => navigate('/dashboard')} 
    />
  );
};

export default DetallesViajeWrapper;
