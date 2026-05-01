import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Wrench, Calendar, CheckCircle } from 'lucide-react';

const MantenimientoEmbarcacionCRUD = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMantenimiento, setCurrentMantenimiento] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    mant_fk_embarcacion: '',
    mant_fecha_inicio: new Date().toISOString().split('T')[0],
    mant_fecha_fin: '',
    mant_descripcion: '',
    mant_costo: 0,
    mant_estado: 'En Proceso'
  });

  useEffect(() => {
    fetchMantenimientos();
    fetchEmbarcaciones();
  }, []);

  const fetchMantenimientos = async () => {
    try {
      const { data } = await axios.get('/mantenimiento-embarcacion');
      setMantenimientos(data);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
    }
  };

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones');
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (mant = null) => {
    setErrorMsg('');
    if (mant) {
      setCurrentMantenimiento(mant);
      setFormData({
        mant_fk_embarcacion: mant.mant_fk_embarcacion || '',
        mant_fecha_inicio: mant.mant_fecha_inicio ? mant.mant_fecha_inicio.split('T')[0] : '',
        mant_fecha_fin: mant.mant_fecha_fin ? mant.mant_fecha_fin.split('T')[0] : '',
        mant_descripcion: mant.mant_descripcion || '',
        mant_costo: mant.mant_costo || 0,
        mant_estado: mant.mant_estado || 'En Proceso'
      });
    } else {
      setCurrentMantenimiento(null);
      setFormData({
        mant_fk_embarcacion: '',
        mant_fecha_inicio: new Date().toISOString().split('T')[0],
        mant_fecha_fin: '',
        mant_descripcion: '',
        mant_costo: 0,
        mant_estado: 'En Proceso'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMantenimiento(null);
    setErrorMsg('');
  };

  const confirmDelete = (mant) => {
    setCurrentMantenimiento(mant);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentMantenimiento(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.mant_fecha_fin) dataToSubmit.mant_fecha_fin = null;

      if (currentMantenimiento && currentMantenimiento.mant_id) {
        await axios.put(`/mantenimiento-embarcacion/${currentMantenimiento.mant_id}`, dataToSubmit);
      } else {
        await axios.post('/mantenimiento-embarcacion', dataToSubmit);
      }
      fetchMantenimientos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/mantenimiento-embarcacion/${currentMantenimiento.mant_id}`);
      fetchMantenimientos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'Finalizado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'En Proceso': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Pendiente': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Wrench className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Mantenimiento de Embarcaciones</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Mantenimiento
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Embarcación</th>
                  <th className="p-4 font-semibold">Descripción</th>
                  <th className="p-4 font-semibold">Fechas</th>
                  <th className="p-4 font-semibold text-right">Costo</th>
                  <th className="p-4 font-semibold text-center">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mantenimientos.map((mant) => (
                  <tr key={mant.mant_id || `pending-${mant.mant_fk_embarcacion}`} className={`transition-colors ${!mant.mant_id ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-zinc-800/50'}`}>
                    <td className="p-4 text-zinc-500 font-mono">{mant.mant_id ? `#${mant.mant_id}` : <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1 rounded uppercase font-bold">Auto</span>}</td>
                    <td className="p-4 text-white font-medium">
                      {mant.emb_nombre}
                      <span className="block text-xs text-zinc-500 font-mono mt-1">{mant.emb_matricula}</span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400 truncate max-w-[200px]" title={mant.mant_descripcion}>
                      {mant.mant_descripcion}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(mant.mant_fecha_inicio).toLocaleDateString()}</span>
                        {mant.mant_fecha_fin && <span className="flex items-center gap-1.5 opacity-60"><CheckCircle size={12}/> {new Date(mant.mant_fecha_fin).toLocaleDateString()}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right text-white font-mono">
                      {formatCurrency(mant.mant_costo)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${getEstadoStyle(mant.mant_estado)}`}>
                        {mant.mant_estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(mant)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        {mant.mant_id && (
                          <button
                            onClick={() => confirmDelete(mant)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {mantenimientos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay mantenimientos registrados.
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentMantenimiento ? 'Editar Mantenimiento' : 'Registrar Mantenimiento'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Embarcación *</label>
                  <select
                    name="mant_fk_embarcacion"
                    value={formData.mant_fk_embarcacion}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una embarcación...</option>
                    {embarcaciones.map(e => (
                      <option key={e.emb_id} value={e.emb_id}>
                        {e.emb_nombre} - Matrícula: {e.emb_matricula}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Descripción del Trabajo *</label>
                  <textarea
                    name="mant_descripcion"
                    value={formData.mant_descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Ej. Cambio de aceite de motor, pintura de casco, reparación de hélice..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Inicio *</label>
                  <input
                    type="date"
                    name="mant_fecha_inicio"
                    value={formData.mant_fecha_inicio}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Fin (Opcional)</label>
                  <input
                    type="date"
                    name="mant_fecha_fin"
                    value={formData.mant_fecha_fin}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="mant_estado"
                    value={formData.mant_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Costo Estimado/Final (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="mant_costo"
                      value={formData.mant_costo}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
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
                  {currentMantenimiento ? 'Guardar Cambios' : 'Registrar Mantenimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Mantenimiento?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar este registro de mantenimiento. Esta acción no se puede deshacer.
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
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MantenimientoEmbarcacionCRUD;
