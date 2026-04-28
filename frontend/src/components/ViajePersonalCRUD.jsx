import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Users, Anchor } from 'lucide-react';

const ViajePersonalCRUD = () => {
  const [tripulaciones, setTripulaciones] = useState([]);
  const [viajes, setViajes] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [tripulantesOcupadosIds, setTripulantesOcupadosIds] = useState(new Set());
  
  const [formData, setFormData] = useState({
    via_per_fk_viaje: '',
    via_per_fk_personal: '',
    via_per_fk_rol: ''
  });

  useEffect(() => {
    fetchTripulaciones();
    fetchViajes();
    fetchPersonal();
    fetchRoles();
  }, []);

  const fetchTripulaciones = async () => {
    try {
      const { data } = await axios.get('/viajes-personal'); // Usar ruta correcta plural
      setTripulaciones(data);
      
      // Calcular ocupados: los que están en viajes activos
      const ocupados = new Set(
        data.filter(t => ['Pendiente', 'En Preparación', 'En Curso'].includes(t.via_estatus))
            .map(t => t.via_per_fk_personal)
      );
      setTripulantesOcupadosIds(ocupados);
    } catch (error) {
      console.error('Error al cargar tripulaciones:', error);
    }
  };

  const fetchViajes = async () => {
    try {
      const { data } = await axios.get('/viaje').catch(() => axios.get('/viajes'));
      setViajes(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    }
  };

  const fetchPersonal = async () => {
    try {
      const { data } = await axios.get('/personal');
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('/roles');
      setRoles(data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (registro = null) => {
    setErrorMsg('');
    if (registro) {
      setCurrentRegistro(registro);
      setFormData({
        via_per_fk_viaje: registro.via_per_fk_viaje || '',
        via_per_fk_personal: registro.via_per_fk_personal || '',
        via_per_fk_rol: registro.via_per_fk_rol || ''
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        via_per_fk_viaje: '',
        via_per_fk_personal: '',
        via_per_fk_rol: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRegistro(null);
    setErrorMsg('');
  };

  const confirmDelete = (registro) => {
    setCurrentRegistro(registro);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentRegistro(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentRegistro) {
        await axios.put(`/viajes-personal/${currentRegistro.via_per_id}`, formData);
      } else {
        await axios.post('/viajes-personal', formData);
      }
      fetchTripulaciones();
      closeModal();
    } catch (error) {
      console.error('Error al enrolar tripulante:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/viajes-personal/${currentRegistro.via_per_id}`);
      fetchTripulaciones();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al desembarcar tripulante:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Completado': return 'text-teal-400';
      case 'En Curso': return 'text-emerald-400';
      case 'En Puerto': return 'text-indigo-400';
      case 'Cancelado': return 'text-red-400';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Tripulación por Viaje (Enrolamiento)</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Enrolar Tripulante
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-20">ID</th>
                  <th className="p-4 font-semibold">Viaje Asignado</th>
                  <th className="p-4 font-semibold">Nombre del Tripulante</th>
                  <th className="p-4 font-semibold">Rol a Bordo</th>
                  <th className="p-4 font-semibold text-center">Puntos (Liquidación)</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tripulaciones.map((reg) => (
                  <tr key={reg.via_per_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.via_per_id}</td>
                    <td className="p-4 text-zinc-300">
                      Viaje #{reg.via_per_fk_viaje}
                      <span className={`block text-xs font-medium mt-1 ${getEstatusColor(reg.via_estatus)}`}>
                        {reg.via_estatus || 'Sin Estatus'}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">
                      {reg.personal_nombre || <span className="text-zinc-600 italic">Desconocido</span>}
                    </td>
                    <td className="p-4 text-zinc-300">
                      <span className="inline-flex items-center gap-1">
                        <Anchor size={14} className="text-emerald-500" />
                        {reg.rol_nombre || 'Sin Rol'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-mono text-sm font-bold">
                        {reg.rol_puntos_reparto || 0} pts
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar Asignación"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Desembarcar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tripulaciones.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-zinc-500">
                      No hay tripulantes enrolados en ningún viaje.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Asignación de Tripulante' : 'Enrolar Tripulante en Viaje'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Viaje de Destino *</label>
                  <select
                    name="via_per_fk_viaje"
                    value={formData.via_per_fk_viaje}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione el viaje...</option>
                    {viajes
                      .filter(v => ['Pendiente', 'En Preparación'].includes(v.via_estatus) || (currentRegistro && currentRegistro.via_per_fk_viaje === v.via_id))
                      .map(v => (
                      <option key={v.via_id} value={v.via_id}>
                        Viaje #{v.via_id} - {v.barco ? `Barco: ${v.barco}` : 'Sin Barco'} - ({v.via_estatus})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-zinc-500 mt-1">Solo se pueden asignar tripulantes a viajes en Preparación.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tripulante *</label>
                  <select
                    name="via_per_fk_personal"
                    value={formData.via_per_fk_personal}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione al tripulante...</option>
                    {personal.map(p => {
                      // Se excluyen los capitanes ocupados también calculando desde los viajes?
                      // Para este modal, bloqueamos a los tripulantes que ya sabemos que están en viajes activos
                      const isOcupado = tripulantesOcupadosIds.has(p.per_id) && (!currentRegistro || currentRegistro.via_per_fk_personal !== p.per_id);
                      return (
                        <option key={p.per_id} value={p.per_id} disabled={isOcupado}>
                          {p.per_nombre} {p.per_apellidos} {p.per_es_socio ? '(Socio)' : '(Empleado)'} {isOcupado ? ' - OCUPADO EN OTRO VIAJE' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-emerald-400">Rol a Desempeñar en este Viaje *</label>
                  <select
                    name="via_per_fk_rol"
                    value={formData.via_per_fk_rol}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-emerald-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione el rol operativo...</option>
                    {roles.map(r => (
                      <option key={r.rol_id} value={r.rol_id}>
                        {r.rol_nombre} - (Otorga {r.rol_puntos_reparto} Pts de liquidación)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-zinc-500 mt-1">
                    El rol define cuántos puntos le corresponden al tripulante a la hora de repartir las ganancias netas del viaje.
                  </p>
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-medium"
                >
                  {currentRegistro ? 'Guardar Cambios' : 'Enrolar Tripulante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Desembarcar Tripulante?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar a este tripulante del registro del viaje. Perderá su derecho a los puntos de liquidación asociados a este viaje.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-left">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                Sí, desembarcar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViajePersonalCRUD;
