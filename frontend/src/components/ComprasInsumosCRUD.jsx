import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, ShoppingCart } from 'lucide-react';

const ComprasInsumosCRUD = () => {
  const [compras, setCompras] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    comp_fk_proveedor: '',
    comp_fecha: new Date().toISOString().split('T')[0],
    comp_factura: '',
    comp_total: 0,
    comp_fk_cooperativa: '',
    comp_estado: 'Completada'
  });

  useEffect(() => {
    fetchCompras();
    fetchCatalogs();
  }, []);

  const fetchCompras = async () => {
    try {
      const { data } = await axios.get('/compras-insumos');
      setCompras(data);
    } catch (error) {
      console.error('Error al cargar compras:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [resCoop, resProv] = await Promise.all([
        axios.get('/cooperativas').catch(() => ({ data: [] })),
        axios.get('/proveedores').catch(() => ({ data: [] }))
      ]);
      setCooperativas(resCoop.data);
      setProveedores(resProv.data);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (compra = null) => {
    setErrorMsg('');
    if (compra) {
      setCurrentCompra(compra);
      setFormData({
        comp_fk_proveedor: compra.comp_fk_proveedor || '',
        comp_fecha: compra.comp_fecha ? compra.comp_fecha.split('T')[0] : '',
        comp_factura: compra.comp_factura || '',
        comp_total: compra.comp_total || 0,
        comp_fk_cooperativa: compra.comp_fk_cooperativa || '',
        comp_estado: compra.comp_estado || 'Completada'
      });
    } else {
      setCurrentCompra(null);
      setFormData({
        comp_fk_proveedor: '',
        comp_fecha: new Date().toISOString().split('T')[0],
        comp_factura: '',
        comp_total: 0,
        comp_fk_cooperativa: '',
        comp_estado: 'Completada'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCompra(null);
    setErrorMsg('');
  };

  const confirmDelete = (compra) => {
    setCurrentCompra(compra);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentCompra(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentCompra) {
        await axios.put(`/compras-insumos/${currentCompra.comp_id}`, formData);
      } else {
        await axios.post('/compras-insumos', formData);
      }
      fetchCompras();
      closeModal();
    } catch (error) {
      console.error('Error al guardar compra:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/compras-insumos/${currentCompra.comp_id}`);
      fetchCompras();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'Completada': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pendiente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Cancelada': return 'bg-red-500/10 text-red-500 border-red-500/20';
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
            <ShoppingCart className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Compras de Insumos</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Compra
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Proveedor</th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold">Factura</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {compras.map((compra) => (
                  <tr key={compra.comp_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{compra.comp_id}</td>
                    <td className="p-4 text-white">{new Date(compra.comp_fecha).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{compra.prov_nombre || `ID: ${compra.comp_fk_proveedor}`}</td>
                    <td className="p-4">{compra.coop_nombre || `ID: ${compra.comp_fk_cooperativa}`}</td>
                    <td className="p-4 font-mono text-sm">{compra.comp_factura || 'N/A'}</td>
                    <td className="p-4 text-white font-medium">{formatCurrency(compra.comp_total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoStyle(compra.comp_estado)}`}>
                        {compra.comp_estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(compra)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(compra)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {compras.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay compras de insumos registradas.
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
                {currentCompra ? 'Editar Compra' : 'Nueva Compra'}
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
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha *</label>
                  <input
                    type="date"
                    name="comp_fecha"
                    value={formData.comp_fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="comp_estado"
                    value={formData.comp_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Proveedor *</label>
                  <select
                    name="comp_fk_proveedor"
                    value={formData.comp_fk_proveedor}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione proveedor...</option>
                    {proveedores.map(p => (
                      <option key={p.prov_id} value={p.prov_id}>{p.prov_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa *</label>
                  <select
                    name="comp_fk_cooperativa"
                    value={formData.comp_fk_cooperativa}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione cooperativa...</option>
                    {cooperativas.map(c => (
                      <option key={c.coop_id} value={c.coop_id}>{c.coop_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Folio de Factura</label>
                  <input
                    type="text"
                    name="comp_factura"
                    value={formData.comp_factura}
                    onChange={handleInputChange}
                    placeholder="Ej. F-10293"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Total de la Compra (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="comp_total"
                      value={formData.comp_total}
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
                  {currentCompra ? 'Guardar Cambios' : 'Registrar Compra'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Compra?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar la compra con ID #{currentCompra?.comp_id} por {formatCurrency(currentCompra?.comp_total || 0)}.
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

export default ComprasInsumosCRUD;
