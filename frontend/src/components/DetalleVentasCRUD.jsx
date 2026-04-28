import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, List, Calculator } from 'lucide-react';

const DetalleVentasCRUD = () => {
  const [detalles, setDetalles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [especies, setEspecies] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    ven_det_fk_venta: '',
    ven_det_fk_especie: '',
    ven_det_kg: 0,
    ven_det_precio_kg_venta: 0
  });

  useEffect(() => {
    fetchDetalles();
    fetchVentas();
    fetchEspecies();
  }, []);

  const fetchDetalles = async () => {
    try {
      const { data } = await axios.get('/detalleVentas');
      setDetalles(data);
    } catch (error) {
      console.error('Error al cargar detalles de ventas:', error);
    }
  };

  const fetchVentas = async () => {
    try {
      const { data } = await axios.get('/ventas');
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const fetchEspecies = async () => {
    try {
      const { data } = await axios.get('/especies');
      setEspecies(data);
    } catch (error) {
      console.error('Error al cargar especies:', error);
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
        ven_det_fk_venta: registro.ven_det_fk_venta || '',
        ven_det_fk_especie: registro.ven_det_fk_especie || '',
        ven_det_kg: registro.ven_det_kg || 0,
        ven_det_precio_kg_venta: registro.ven_det_precio_kg_venta || 0
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        ven_det_fk_venta: '',
        ven_det_fk_especie: '',
        ven_det_kg: 0,
        ven_det_precio_kg_venta: 0
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
        await axios.put(`/detalleVentas/${currentRegistro.ven_det_id}`, formData);
      } else {
        await axios.post('/detalleVentas', formData);
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
      await axios.delete(`/detalleVentas/${currentRegistro.ven_det_id}`);
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

  // Cálculo en tiempo real del subtotal en el formulario
  const subtotalCalculado = parseFloat(formData.ven_det_kg || 0) * parseFloat(formData.ven_det_precio_kg_venta || 0);

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <List className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Detalles por Venta</h1>
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
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Venta (Folio)</th>
                  <th className="p-4 font-semibold">Especie</th>
                  <th className="p-4 font-semibold text-right">Cantidad (Kg)</th>
                  <th className="p-4 font-semibold text-right">Precio/Kg</th>
                  <th className="p-4 font-semibold text-right text-emerald-400">Subtotal</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {detalles.map((reg) => (
                  <tr key={reg.ven_det_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.ven_det_id}</td>
                    <td className="p-4 text-zinc-300">
                      Folio Venta #{reg.ven_det_fk_venta}
                      {reg.ven_fecha && <span className="block text-xs text-zinc-500">{new Date(reg.ven_fecha).toLocaleDateString()}</span>}
                    </td>
                    <td className="p-4 text-white font-medium">{reg.esp_nombre_comun || <span className="text-zinc-600 italic">Desconocida</span>}</td>
                    <td className="p-4 text-right font-mono">{reg.ven_det_kg} kg</td>
                    <td className="p-4 text-right font-mono">{formatCurrency(reg.ven_det_precio_kg_venta)}</td>
                    <td className="p-4 text-right font-mono text-white font-bold bg-emerald-500/5">
                      {formatCurrency(reg.ven_det_subtotal)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
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
                      No hay detalles de venta registrados.
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
                {currentRegistro ? 'Editar Detalle de Venta' : 'Agregar Detalle a Venta'}
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
                  <label className="text-sm font-medium text-zinc-300">Venta Asociada *</label>
                  <select
                    name="ven_det_fk_venta"
                    value={formData.ven_det_fk_venta}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione la venta...</option>
                    {ventas.map(v => (
                      <option key={v.ven_id} value={v.ven_id}>
                        Folio #{v.ven_id} - {new Date(v.ven_fecha).toLocaleDateString()} - {v.cli_nombre || 'Cliente Desconocido'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Especie Vendida *</label>
                  <select
                    name="ven_det_fk_especie"
                    value={formData.ven_det_fk_especie}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una especie...</option>
                    {especies.map(e => (
                      <option key={e.esp_id} value={e.esp_id}>
                        {e.esp_nombre_comun} {e.esp_nombre_cientifico ? `(${e.esp_nombre_cientifico})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cantidad (Kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="ven_det_kg"
                    value={formData.ven_det_kg}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Precio Unitario por Kg (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="ven_det_precio_kg_venta"
                      value={formData.ven_det_precio_kg_venta}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Calculadora en tiempo real */}
                <div className="md:col-span-2 mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Calculator size={20} />
                    <span className="font-medium">Subtotal Calculado:</span>
                  </div>
                  <span className="text-xl font-bold text-white font-mono">
                    {formatCurrency(subtotalCalculado)}
                  </span>
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
                  {currentRegistro ? 'Guardar Cambios' : 'Agregar Detalle'}
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
              Estás a punto de eliminar este detalle de venta. Esto modificará el registro de los kilos vendidos.
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

export default DetalleVentasCRUD;
