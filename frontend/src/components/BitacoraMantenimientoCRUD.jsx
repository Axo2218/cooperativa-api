import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Wrench } from 'lucide-react';

const BitacoraMantenimientoCRUD = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [activosFijos, setActivosFijos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBitacora, setCurrentBitacora] = useState(null);
  
  const [formData, setFormData] = useState({
    mant_fk_embarcacion: '',
    mant_fk_activo: '',
    mant_fecha: new Date().toISOString().split('T')[0],
    mant_tipo: 'Preventivo',
    mant_descripcion: '',
    mant_costo_total: 0,
    mant_taller_proveedor: ''
  });

  useEffect(() => {
    fetchBitacoras();
    fetchCatalogs();
  }, []);

  const fetchBitacoras = async () => {
    try {
      const { data } = await axios.get('/bitacora-mantenimiento');
      setBitacoras(data);
    } catch (error) {
      console.error('Error al cargar bitácoras:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [resEmb, resAct] = await Promise.all([
        axios.get('/embarcaciones').catch(() => ({ data: [] })),
        axios.get('/activos-fijos').catch(() => ({ data: [] }))
      ]);
      setEmbarcaciones(resEmb.data);
      setActivosFijos(resAct.data);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (bitacora = null) => {
    if (bitacora) {
      setCurrentBitacora(bitacora);
      // Extraemos solo la parte YYYY-MM-DD de la fecha si viene con formato timestamp
      const fecha = bitacora.mant_fecha ? bitacora.mant_fecha.split('T')[0] : '';
      setFormData({
        mant_fk_embarcacion: bitacora.mant_fk_embarcacion || '',
        mant_fk_activo: bitacora.mant_fk_activo || '',
        mant_fecha: fecha,
        mant_tipo: bitacora.mant_tipo || 'Preventivo',
        mant_descripcion: bitacora.mant_descripcion || '',
        mant_costo_total: bitacora.mant_costo_total || 0,
        mant_taller_proveedor: bitacora.mant_taller_proveedor || ''
      });
    } else {
      setCurrentBitacora(null);
      setFormData({
        mant_fk_embarcacion: '',
        mant_fk_activo: '',
        mant_fecha: new Date().toISOString().split('T')[0],
        mant_tipo: 'Preventivo',
        mant_descripcion: '',
        mant_costo_total: 0,
        mant_taller_proveedor: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBitacora(null);
  };

  const confirmDelete = (bitacora) => {
    setCurrentBitacora(bitacora);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentBitacora(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.mant_fk_activo) dataToSubmit.mant_fk_activo = null; // Enviar como null si está vacío

      if (currentBitacora) {
        await axios.put(`/bitacora-mantenimiento/${currentBitacora.mant_id}`, dataToSubmit);
      } else {
        await axios.post('/bitacora-mantenimiento', dataToSubmit);
      }
      fetchBitacoras();
      closeModal();
    } catch (error) {
      console.error('Error al guardar bitácora:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/bitacora-mantenimiento/${currentBitacora.mant_id}`);
      fetchBitacoras();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar registro de bitácora:', error);
    }
  };

  const getTipoStyle = (tipo) => {
    switch (tipo) {
      case 'Urgencia': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Correctivo': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Preventivo': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  // Formateador de moneda MXN
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
            <h1 className="text-2xl font-bold text-white">Bitácora de Mantenimiento</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Registro
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Embarcación</th>
                  <th className="p-4 font-semibold">Activo</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold">Costo Total</th>
                  <th className="p-4 font-semibold">Taller/Proveedor</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {bitacoras.map((b) => (
                  <tr key={b.mant_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{b.mant_id}</td>
                    <td className="p-4 text-white">
                      {new Date(b.mant_fecha).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">{b.emb_nombre || `ID: ${b.mant_fk_embarcacion}`}</td>
                    <td className="p-4">{b.act_nombre || (b.mant_fk_activo ? `ID: ${b.mant_fk_activo}` : 'N/A')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTipoStyle(b.mant_tipo)}`}>
                        {b.mant_tipo}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">{formatCurrency(b.mant_costo_total)}</td>
                    <td className="p-4">{b.mant_taller_proveedor || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(b)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(b)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bitacoras.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay registros de mantenimiento.
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentBitacora ? 'Editar Registro de Mantenimiento' : 'Nuevo Registro de Mantenimiento'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha *</label>
                  <input
                    type="date"
                    name="mant_fecha"
                    value={formData.mant_fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Mantenimiento *</label>
                  <select
                    name="mant_tipo"
                    value={formData.mant_tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Urgencia">Urgencia</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Embarcación *</label>
                  <select
                    name="mant_fk_embarcacion"
                    value={formData.mant_fk_embarcacion}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione embarcación...</option>
                    {embarcaciones.map(e => (
                      <option key={e.emb_id} value={e.emb_id}>{e.emb_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Activo (Opcional)</label>
                  <select
                    name="mant_fk_activo"
                    value={formData.mant_fk_activo}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Ninguno específico...</option>
                    {activosFijos.map(a => (
                      <option key={a.act_id} value={a.act_id}>{a.act_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Descripción de los trabajos *</label>
                  <textarea
                    name="mant_descripcion"
                    value={formData.mant_descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Detalle de los trabajos realizados..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Costo Total (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="mant_costo_total"
                      value={formData.mant_costo_total}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Taller o Proveedor</label>
                  <input
                    type="text"
                    name="mant_taller_proveedor"
                    value={formData.mant_taller_proveedor}
                    onChange={handleInputChange}
                    placeholder="Nombre del taller o mecánico"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
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
                  {currentBitacora ? 'Guardar Cambios' : 'Crear Registro'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Registro?</h3>
            <p className="text-zinc-400 mb-6">
              Estás a punto de eliminar un registro de mantenimiento por {formatCurrency(currentBitacora?.mant_costo_total || 0)}. Esta acción no se puede deshacer.
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

export default BitacoraMantenimientoCRUD;
