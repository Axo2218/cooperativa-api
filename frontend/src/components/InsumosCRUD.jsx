import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, PackageSearch } from 'lucide-react';

const InsumosCRUD = () => {
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentInsumo, setCurrentInsumo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    ins_nombre: '',
    ins_descripcion: '',
    ins_fk_categoria: '',
    ins_unidad_medida: 'Piezas',
    ins_stock_actual: 0,
    ins_stock_minimo: 0
  });

  useEffect(() => {
    fetchInsumos();
    fetchCategorias();
  }, []);

  const fetchInsumos = async () => {
    try {
      const { data } = await axios.get('/insumos');
      setInsumos(data);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get('/categoria-insumo');
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías de insumos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (insumo = null) => {
    setErrorMsg('');
    if (insumo) {
      setCurrentInsumo(insumo);
      setFormData({
        ins_nombre: insumo.ins_nombre || '',
        ins_descripcion: insumo.ins_descripcion || '',
        ins_fk_categoria: insumo.ins_fk_categoria || '',
        ins_unidad_medida: insumo.ins_unidad_medida || 'Piezas',
        ins_stock_actual: insumo.ins_stock_actual || 0,
        ins_stock_minimo: insumo.ins_stock_minimo || 0
      });
    } else {
      setCurrentInsumo(null);
      setFormData({
        ins_nombre: '',
        ins_descripcion: '',
        ins_fk_categoria: '',
        ins_unidad_medida: 'Piezas',
        ins_stock_actual: 0,
        ins_stock_minimo: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentInsumo(null);
    setErrorMsg('');
  };

  const confirmDelete = (insumo) => {
    setCurrentInsumo(insumo);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentInsumo(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentInsumo) {
        await axios.put(`/insumos/${currentInsumo.ins_id}`, formData);
      } else {
        await axios.post('/insumos', formData);
      }
      fetchInsumos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar insumo:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/insumos/${currentInsumo.ins_id}`);
      fetchInsumos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar insumo:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getStockStatus = (actual, minimo) => {
    if (actual <= 0) return { label: 'Agotado', style: 'bg-red-500/10 text-red-500 border-red-500/20' };
    if (actual <= minimo) return { label: 'Stock Bajo', style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'Suficiente', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <PackageSearch className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Catálogo de Insumos</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Insumo
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold text-right">Stock Actual</th>
                  <th className="p-4 font-semibold text-right">Stock Mínimo</th>
                  <th className="p-4 font-semibold text-center">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {insumos.map((insumo) => {
                  const status = getStockStatus(insumo.ins_stock_actual, insumo.ins_stock_minimo);
                  return (
                    <tr key={insumo.ins_id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 text-zinc-500">#{insumo.ins_id}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">{insumo.ins_nombre}</div>
                        <div className="text-xs text-zinc-500 truncate max-w-[200px]">{insumo.ins_descripcion}</div>
                      </td>
                      <td className="p-4">{insumo.cat_ins_nombre || `ID: ${insumo.ins_fk_categoria}`}</td>
                      <td className="p-4 text-right">
                        <span className="font-mono text-white">{insumo.ins_stock_actual}</span> {insumo.ins_unidad_medida}
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono">{insumo.ins_stock_minimo}</span> {insumo.ins_unidad_medida}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.style}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openModal(insumo)}
                            className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(insumo)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {insumos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay insumos registrados.
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
                {currentInsumo ? 'Editar Insumo' : 'Registrar Nuevo Insumo'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre del Insumo *</label>
                  <input
                    type="text"
                    name="ins_nombre"
                    value={formData.ins_nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Aceite de motor marino"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Descripción</label>
                  <textarea
                    name="ins_descripcion"
                    value={formData.ins_descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Detalles adicionales del insumo..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Categoría *</label>
                  <select
                    name="ins_fk_categoria"
                    value={formData.ins_fk_categoria}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una categoría...</option>
                    {categorias.map(c => (
                      <option key={c.cat_ins_id} value={c.cat_ins_id}>{c.cat_ins_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Unidad de Medida *</label>
                  <input
                    type="text"
                    name="ins_unidad_medida"
                    value={formData.ins_unidad_medida}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Litros, Metros, Piezas, Cajas"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Stock Actual *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="ins_stock_actual"
                    value={formData.ins_stock_actual}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Stock Mínimo de Alerta *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="ins_stock_minimo"
                    value={formData.ins_stock_minimo}
                    onChange={handleInputChange}
                    required
                    min="0"
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
                  {currentInsumo ? 'Guardar Cambios' : 'Registrar Insumo'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Insumo?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el insumo "{currentInsumo?.ins_nombre}". Esta acción fallará si el insumo ya está registrado en alguna compra o asignado a un vale.
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

export default InsumosCRUD;
