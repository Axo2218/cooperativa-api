import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Bell } from 'lucide-react';

const AlertaSistemaCRUD = () => {
  const [alertas, setAlertas] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAlerta, setCurrentAlerta] = useState(null);
  
  const [formData, setFormData] = useState({
    ale_fk_embarcacion: '',
    ale_tipo: '',
    ale_mensaje: '',
    ale_nivel_riesgo: 'Bajo',
    ale_estatus: 'No leída'
  });

  useEffect(() => {
    fetchAlertas();
    fetchEmbarcaciones();
  }, []);

  const fetchAlertas = async () => {
    try {
      const { data } = await axios.get('/alerta-sistema');
      setAlertas(data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    }
  };

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones');
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
      // Por si no existe aún la ruta, no rompe
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (alerta = null) => {
    if (alerta) {
      setCurrentAlerta(alerta);
      setFormData({
        ale_fk_embarcacion: alerta.ale_fk_embarcacion || '',
        ale_tipo: alerta.ale_tipo || '',
        ale_mensaje: alerta.ale_mensaje || '',
        ale_nivel_riesgo: alerta.ale_nivel_riesgo || 'Bajo',
        ale_estatus: alerta.ale_estatus || 'No leída'
      });
    } else {
      setCurrentAlerta(null);
      setFormData({
        ale_fk_embarcacion: '',
        ale_tipo: '',
        ale_mensaje: '',
        ale_nivel_riesgo: 'Bajo',
        ale_estatus: 'No leída'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAlerta(null);
  };

  const confirmDelete = (alerta) => {
    setCurrentAlerta(alerta);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentAlerta(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAlerta) {
        await axios.put(`/alerta-sistema/${currentAlerta.ale_id}`, formData);
      } else {
        await axios.post('/alerta-sistema', formData);
      }
      fetchAlertas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar alerta:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/alerta-sistema/${currentAlerta.ale_id}`);
      fetchAlertas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
    }
  };

  const getNivelRiesgoStyle = (nivel) => {
    switch (nivel) {
      case 'Crítico': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medio': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Bajo': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const getEstatusStyle = (estatus) => {
    return estatus === 'No leída' ? 'text-amber-500' : 'text-emerald-500';
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Alertas de Sistema</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Alerta
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Embarcación</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold">Mensaje</th>
                  <th className="p-4 font-semibold">Riesgo</th>
                  <th className="p-4 font-semibold">Estatus</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {alertas.map((alerta) => (
                  <tr key={alerta.ale_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{alerta.ale_id}</td>
                    <td className="p-4 text-white font-medium">{alerta.emb_nombre || `ID: ${alerta.ale_fk_embarcacion}`}</td>
                    <td className="p-4">{alerta.ale_tipo}</td>
                    <td className="p-4">
                      <div className="truncate max-w-[200px]" title={alerta.ale_mensaje}>
                        {alerta.ale_mensaje}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getNivelRiesgoStyle(alerta.ale_nivel_riesgo)}`}>
                        {alerta.ale_nivel_riesgo || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${getEstatusStyle(alerta.ale_estatus)}`}>
                        {alerta.ale_estatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {new Date(alerta.ale_fecha_generacion).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(alerta)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(alerta)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {alertas.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay alertas registradas en el sistema.
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentAlerta ? 'Editar Alerta' : 'Nueva Alerta'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Embarcación *</label>
                  <select
                    name="ale_fk_embarcacion"
                    value={formData.ale_fk_embarcacion}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una embarcación...</option>
                    {embarcaciones.map(e => (
                      <option key={e.emb_id} value={e.emb_id}>{e.emb_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Alerta *</label>
                  <input
                    type="text"
                    name="ale_tipo"
                    value={formData.ale_tipo}
                    onChange={handleInputChange}
                    placeholder="Ej. Mantenimiento Preventivo"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Mensaje *</label>
                  <textarea
                    name="ale_mensaje"
                    value={formData.ale_mensaje}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Nivel de Riesgo</label>
                    <select
                      name="ale_nivel_riesgo"
                      value={formData.ale_nivel_riesgo}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Crítico">Crítico</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Estatus</label>
                    <select
                      name="ale_estatus"
                      value={formData.ale_estatus}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="No leída">No leída</option>
                      <option value="Leída">Leída</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Resuelta">Resuelta</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
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
                  {currentAlerta ? 'Guardar Cambios' : 'Crear Alerta'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Alerta?</h3>
            <p className="text-zinc-400 mb-6">
              Estás a punto de eliminar la alerta de tipo "{currentAlerta?.ale_tipo}". Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
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
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertaSistemaCRUD;
