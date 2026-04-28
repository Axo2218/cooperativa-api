import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, ListChecks } from 'lucide-react';

const DetalleCompraInsumosCRUD = () => {
  const [detalles, setDetalles] = useState([]);
  const [compras, setCompras] = useState([]);
  const [insumos, setInsumos] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDetalle, setCurrentDetalle] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    dcomp_fk_compra: '',
    dcomp_fk_insumo: '',
    dcomp_cantidad: 1,
    dcomp_precio_unitario: 0
  });

  useEffect(() => {
    fetchDetalles();
    fetchCatalogs();
  }, []);

  const fetchDetalles = async () => {
    try {
      const { data } = await axios.get('/detalle-compra-insumos');
      setDetalles(data);
    } catch (error) {
      console.error('Error al cargar detalles de compra:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [resCompras, resInsumos] = await Promise.all([
        axios.get('/compras-insumos').catch(() => ({ data: [] })),
        axios.get('/insumos').catch(() => ({ data: [] }))
      ]);
      setCompras(resCompras.data);
      setInsumos(resInsumos.data);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (detalle = null) => {
    setErrorMsg('');
    if (detalle) {
      setCurrentDetalle(detalle);
      setFormData({
        dcomp_fk_compra: detalle.dcomp_fk_compra || '',
        dcomp_fk_insumo: detalle.dcomp_fk_insumo || '',
        dcomp_cantidad: detalle.dcomp_cantidad || 1,
        dcomp_precio_unitario: detalle.dcomp_precio_unitario || 0
      });
    } else {
      setCurrentDetalle(null);
      setFormData({
        dcomp_fk_compra: '',
        dcomp_fk_insumo: '',
        dcomp_cantidad: 1,
        dcomp_precio_unitario: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDetalle(null);
    setErrorMsg('');
  };

  const confirmDelete = (detalle) => {
    setCurrentDetalle(detalle);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDetalle(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // El subtotal no se manda, la BD lo calcula automáticamente (GENERATED ALWAYS AS)
      if (currentDetalle) {
        await axios.put(`/detalle-compra-insumos/${currentDetalle.dcomp_id}`, formData);
      } else {
        await axios.post('/detalle-compra-insumos', formData);
      }
      fetchDetalles();
      closeModal();
    } catch (error) {
      console.error('Error al guardar detalle:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/detalle-compra-insumos/${currentDetalle.dcomp_id}`);
      fetchDetalles();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar detalle:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
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
            <ListChecks className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Detalle de Compras (Insumos)</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Agregar Detalle
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Factura (Compra)</th>
                  <th className="p-4 font-semibold">Insumo</th>
                  <th className="p-4 font-semibold text-right">Cantidad</th>
                  <th className="p-4 font-semibold text-right">Precio Unitario</th>
                  <th className="p-4 font-semibold text-right text-emerald-400">Subtotal</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {detalles.map((detalle) => (
                  <tr key={detalle.dcomp_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{detalle.dcomp_id}</td>
                    <td className="p-4 text-white">
                      {detalle.comp_factura ? `Factura: ${detalle.comp_factura}` : `ID Compra: ${detalle.dcomp_fk_compra}`} 
                      <span className="text-xs text-zinc-500 block">
                        {detalle.comp_fecha ? new Date(detalle.comp_fecha).toLocaleDateString() : ''}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{detalle.ins_nombre || `ID: ${detalle.dcomp_fk_insumo}`}</td>
                    <td className="p-4 text-right">{detalle.dcomp_cantidad}</td>
                    <td className="p-4 text-right font-mono text-sm">{formatCurrency(detalle.dcomp_precio_unitario)}</td>
                    <td className="p-4 text-right font-medium text-emerald-400">
                      {formatCurrency(detalle.dcomp_subtotal)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(detalle)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(detalle)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {detalles.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay detalles de compra registrados.
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
                {currentDetalle ? 'Editar Detalle' : 'Agregar Detalle a Compra'}
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
                  <label className="text-sm font-medium text-zinc-300">Seleccionar Compra (Factura) *</label>
                  <select
                    name="dcomp_fk_compra"
                    value={formData.dcomp_fk_compra}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione la compra...</option>
                    {compras.map(c => (
                      <option key={c.comp_id} value={c.comp_id}>
                        {c.comp_factura ? `Factura: ${c.comp_factura}` : `Compra #${c.comp_id}`} - {c.comp_fecha ? new Date(c.comp_fecha).toLocaleDateString() : ''} - Total: {formatCurrency(c.comp_total)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Insumo Comprado *</label>
                  <select
                    name="dcomp_fk_insumo"
                    value={formData.dcomp_fk_insumo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione un insumo...</option>
                    {insumos.map(i => (
                      <option key={i.ins_id} value={i.ins_id}>{i.ins_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cantidad *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dcomp_cantidad"
                    value={formData.dcomp_cantidad}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Precio Unitario (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="dcomp_precio_unitario"
                      value={formData.dcomp_precio_unitario}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Subtotal Calculado:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatCurrency((formData.dcomp_cantidad || 0) * (formData.dcomp_precio_unitario || 0))}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 text-right">
                    (Este valor se calcula automáticamente en la base de datos)
                  </p>
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
                  {currentDetalle ? 'Guardar Cambios' : 'Agregar Detalle'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Detalle?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el detalle de la compra #{currentDetalle?.dcomp_fk_compra}.
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

export default DetalleCompraInsumosCRUD;
