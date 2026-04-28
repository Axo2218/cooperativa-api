import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, FileText } from 'lucide-react';

const FacturacionCRUD = () => {
  const [facturas, setFacturas] = useState([]);
  const [ventas, setVentas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFactura, setCurrentFactura] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    fac_folio: '',
    fac_fk_venta: '',
    fac_fecha_emision: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    fac_total: 0,
    fac_rfc_receptor: '',
    fac_estado: 'Emitida'
  });

  useEffect(() => {
    fetchFacturas();
    fetchVentas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const { data } = await axios.get('/facturacion');
      setFacturas(data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (factura = null) => {
    setErrorMsg('');
    if (factura) {
      setCurrentFactura(factura);
      // Format datetime to YYYY-MM-DDTHH:mm for the input datetime-local
      const formattedDate = factura.fac_fecha_emision 
        ? new Date(factura.fac_fecha_emision).toISOString().slice(0, 16)
        : '';

      setFormData({
        fac_folio: factura.fac_folio || '',
        fac_fk_venta: factura.fac_fk_venta || '',
        fac_fecha_emision: formattedDate,
        fac_total: factura.fac_total || 0,
        fac_rfc_receptor: factura.fac_rfc_receptor || '',
        fac_estado: factura.fac_estado || 'Emitida'
      });
    } else {
      setCurrentFactura(null);
      setFormData({
        fac_folio: '',
        fac_fk_venta: '',
        fac_fecha_emision: new Date().toISOString().slice(0, 16),
        fac_total: 0,
        fac_rfc_receptor: '',
        fac_estado: 'Emitida'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFactura(null);
    setErrorMsg('');
  };

  const confirmDelete = (factura) => {
    setCurrentFactura(factura);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentFactura(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentFactura) {
        await axios.put(`/facturacion/${currentFactura.fac_id}`, formData);
      } else {
        await axios.post('/facturacion', formData);
      }
      fetchFacturas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar factura:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/facturacion/${currentFactura.fac_id}`);
      fetchFacturas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'Emitida': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
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
            <FileText className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Facturación</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Factura
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">Folio</th>
                  <th className="p-4 font-semibold">Venta Asociada</th>
                  <th className="p-4 font-semibold">RFC Receptor</th>
                  <th className="p-4 font-semibold">Fecha Emisión</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {facturas.map((factura) => (
                  <tr key={factura.fac_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-white font-medium">{factura.fac_folio}</td>
                    <td className="p-4 text-zinc-300">
                      {factura.venta_folio ? `Venta: ${factura.venta_folio}` : `ID: ${factura.fac_fk_venta}`}
                    </td>
                    <td className="p-4 font-mono">{factura.fac_rfc_receptor}</td>
                    <td className="p-4">
                      {new Date(factura.fac_fecha_emision).toLocaleString()}
                    </td>
                    <td className="p-4 text-white font-mono">
                      {formatCurrency(factura.fac_total)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoStyle(factura.fac_estado)}`}>
                        {factura.fac_estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(factura)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(factura)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {facturas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay facturas registradas.
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
                {currentFactura ? 'Editar Factura' : 'Registrar Nueva Factura'}
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
                  <label className="text-sm font-medium text-zinc-300">Folio de Factura *</label>
                  <input
                    type="text"
                    name="fac_folio"
                    value={formData.fac_folio}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. FAC-102938"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">RFC del Receptor *</label>
                  <input
                    type="text"
                    name="fac_rfc_receptor"
                    value={formData.fac_rfc_receptor}
                    onChange={handleInputChange}
                    required
                    maxLength="13"
                    placeholder="Ej. ABCD123456EF7"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Venta Asociada *</label>
                  <select
                    name="fac_fk_venta"
                    value={formData.fac_fk_venta}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una venta...</option>
                    {ventas.map(v => (
                      <option key={v.vent_id} value={v.vent_id}>
                        {v.vent_folio ? `Folio: ${v.vent_folio}` : `Venta #${v.vent_id}`} - Fecha: {new Date(v.vent_fecha).toLocaleDateString()} - Total Venta: {formatCurrency(v.vent_total)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha y Hora de Emisión *</label>
                  <input
                    type="datetime-local"
                    name="fac_fecha_emision"
                    value={formData.fac_fecha_emision}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="fac_estado"
                    value={formData.fac_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Emitida">Emitida</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Total Facturado (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="fac_total"
                      value={formData.fac_total}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors text-lg font-mono"
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
                  {currentFactura ? 'Guardar Cambios' : 'Emitir Factura'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Factura?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar la factura con folio "{currentFactura?.fac_folio}". Por motivos contables, se recomienda cambiar su estado a "Cancelada" en lugar de eliminarla. ¿Deseas continuar?
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

export default FacturacionCRUD;
