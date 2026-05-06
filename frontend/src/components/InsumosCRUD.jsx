import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, PackageSearch, PackagePlus } from 'lucide-react';

const InsumosCRUD = () => {
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentInsumo, setCurrentInsumo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [installations, setInstallations] = useState([]);
  const [selectedInstallation, setSelectedInstallation] = useState('');
  
  const [stockFormData, setStockFormData] = useState({
    inst_id: '',
    cantidad: 0
  });
  
  const [formData, setFormData] = useState({
    ins_nombre: '',
    ins_fk_categoria: '',
    ins_fk_unidad: '',
    ins_costo_unitario_referencia: 0,
    ins_stock_actual: 0,
    ins_stock_minimo: 0
  });

  useEffect(() => {
    fetchCatalogos();
  }, []);

  useEffect(() => {
    fetchInsumos();
  }, [selectedInstallation]);

  const fetchCatalogos = async () => {
    try {
      // Cargamos por separado para evitar que un error en uno bloquee los demás
      axios.get('/categoria-insumo/categorias').then(r => setCategorias(r.data)).catch(e => console.error('Error cats:', e));
      axios.get('/unidades-medida').then(r => setUnidades(r.data)).catch(e => console.error('Error unis:', e));
      axios.get('/instalaciones').then(r => {
        console.log('Instalaciones cargadas:', r.data);
        setInstallations(r.data);
      }).catch(e => console.error('Error insts:', e));
    } catch (error) {
      console.error('Error general al cargar catálogos:', error);
    }
  };

  const fetchInsumos = async () => {
    try {
      const url = selectedInstallation ? `/insumos?inst_id=${selectedInstallation}` : '/insumos';
      const { data } = await axios.get(url);
      setInsumos(data);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
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
        ins_fk_categoria: insumo.ins_fk_categoria || '',
        ins_fk_unidad: insumo.ins_fk_unidad || '',
        ins_costo_unitario_referencia: insumo.ins_costo_unitario_referencia || 0,
        ins_stock_actual: insumo.ins_stock_actual || 0,
        ins_stock_minimo: insumo.ins_stock_minimo || 0
      });
    } else {
      setCurrentInsumo(null);
      setFormData({
        ins_nombre: '',
        ins_fk_categoria: '',
        ins_fk_unidad: '',
        ins_costo_unitario_referencia: 0,
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

  const openStockModal = (insumo) => {
    setErrorMsg('');
    setCurrentInsumo(insumo);
    setStockFormData({
      inst_id: selectedInstallation || '',
      cantidad: insumo.ins_stock_actual || 0
    });
    setIsStockModalOpen(true);
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
    setCurrentInsumo(null);
    setErrorMsg('');
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.patch(`/insumos/${currentInsumo.ins_id}/stock`, stockFormData);
      fetchInsumos();
      closeStockModal();
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al ajustar el stock.');
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
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ubicación:</label>
              <select
                value={selectedInstallation}
                onChange={(e) => setSelectedInstallation(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all min-w-[220px] shadow-inner"
              >
                <option value="" className="bg-zinc-900 text-white">Todas (Stock Total)</option>
                {installations.map(inst => (
                  <option key={inst.inst_id} value={inst.inst_id} className="bg-zinc-900 text-white">
                    {inst.inst_nombre}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
            >
              <Plus size={20} />
              Nuevo Insumo
            </button>
          </div>
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
                      <td className="p-4 font-medium text-white">{insumo.ins_nombre}</td>
                      <td className="p-4">{insumo.ins_categoria}</td>
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
                            onClick={() => openStockModal(insumo)}
                            className="text-zinc-400 hover:text-blue-500 transition-colors p-1"
                            title="Ajustar Stock"
                          >
                            <PackagePlus size={18} />
                          </button>
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



                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Categoría *</label>
                  <select
                    name="ins_fk_categoria"
                    value={formData.ins_fk_categoria}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione categoría...</option>
                    {categorias.map(c => (
                      <option key={c.cat_ins_id || c.cat_id} value={c.cat_ins_id || c.cat_id}>{c.cat_ins_nombre || c.cat_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Unidad de Medida *</label>
                  <select
                    name="ins_fk_unidad"
                    value={formData.ins_fk_unidad}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione unidad...</option>
                    {unidades.map(u => (
                      <option key={u.uni_id} value={u.uni_id}>{u.uni_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Costo Ref. Unitario (MXN) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="ins_costo_unitario_referencia"
                    value={formData.ins_costo_unitario_referencia}
                    onChange={handleInputChange}
                    required
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

      {/* Modal Ajustar Stock */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PackagePlus className="text-blue-500" size={24} />
                Ajustar Stock
              </h2>
              <button onClick={closeStockModal} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleStockSubmit} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-zinc-400 mb-4">
                  Ajustando stock para: <span className="text-white font-medium">{currentInsumo?.ins_nombre}</span>
                </p>
                
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Ubicación / Instalación *</label>
                    <select
                      value={stockFormData.inst_id}
                      onChange={(e) => setStockFormData({...stockFormData, inst_id: e.target.value})}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Seleccione ubicación...</option>
                      {installations.map(inst => (
                        <option key={inst.inst_id} value={inst.inst_id}>{inst.inst_nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Nueva Cantidad Total ({currentInsumo?.ins_unidad_medida}) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={stockFormData.cantidad}
                      onChange={(e) => setStockFormData({...stockFormData, cantidad: e.target.value})}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStockModal}
                  className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium"
                >
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsumosCRUD;
