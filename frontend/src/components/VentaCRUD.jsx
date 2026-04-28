import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, ShoppingCart, DollarSign } from 'lucide-react';

const VentaCRUD = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Necesitamos el formato YYYY-MM-DDTHH:MM
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
  };

  const [formData, setFormData] = useState({
    ven_fecha: formatDateForInput(new Date()),
    ven_total: 0,
    ven_tipo_pago: 'Efectivo',
    ven_fk_cliente: '',
    ven_fk_cooperativa: ''
  });

  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchCooperativas();
  }, []);

  const fetchVentas = async () => {
    try {
      const { data } = await axios.get('/ventas'); // Asegúrate que tu ruta se llame /ventas
      setVentas(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const { data } = await axios.get('/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const fetchCooperativas = async () => {
    try {
      const { data } = await axios.get('/cooperativas');
      setCooperativas(data);
    } catch (error) {
      console.error('Error al cargar cooperativas:', error);
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
        ven_fecha: formatDateForInput(registro.ven_fecha),
        ven_total: registro.ven_total || 0,
        ven_tipo_pago: registro.ven_tipo_pago || 'Efectivo',
        ven_fk_cliente: registro.ven_fk_cliente || '',
        ven_fk_cooperativa: registro.ven_fk_cooperativa || ''
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        ven_fecha: formatDateForInput(new Date()),
        ven_total: 0,
        ven_tipo_pago: 'Efectivo',
        ven_fk_cliente: '',
        ven_fk_cooperativa: ''
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
      const dataToSubmit = { ...formData };
      
      if (currentRegistro) {
        await axios.put(`/ventas/${currentRegistro.ven_id}`, dataToSubmit);
      } else {
        await axios.post('/ventas', dataToSubmit);
      }
      fetchVentas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar venta:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/ventas/${currentRegistro.ven_id}`);
      fetchVentas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Registro de Ventas Generales</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-20">Folio</th>
                  <th className="p-4 font-semibold">Fecha y Hora</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Cooperativa (Origen)</th>
                  <th className="p-4 font-semibold">Tipo de Pago</th>
                  <th className="p-4 font-semibold text-right text-emerald-400">Total</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {ventas.map((reg) => (
                  <tr key={reg.ven_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.ven_id}</td>
                    <td className="p-4 text-sm text-zinc-300">{formatDateTime(reg.ven_fecha)}</td>
                    <td className="p-4 text-white font-medium">{reg.cli_nombre || <span className="text-zinc-600 italic">Desconocido</span>}</td>
                    <td className="p-4 text-sm text-zinc-400">{reg.coop_nombre || <span className="text-zinc-600 italic">No asignada</span>}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${
                        reg.ven_tipo_pago === 'Transferencia Electrónica' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        reg.ven_tipo_pago === 'Efectivo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}>
                        {reg.ven_tipo_pago}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-white font-bold">
                      {formatCurrency(reg.ven_total)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar Venta"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar Venta"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {ventas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay ventas registradas.
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Venta General' : 'Registrar Nueva Venta'}
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
                  <label className="text-sm font-medium text-zinc-300">Cliente *</label>
                  <select
                    name="ven_fk_cliente"
                    value={formData.ven_fk_cliente}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map(c => (
                      <option key={c.cli_id} value={c.cli_id}>
                        {c.cli_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa Facturadora *</label>
                  <select
                    name="ven_fk_cooperativa"
                    value={formData.ven_fk_cooperativa}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione...</option>
                    {cooperativas.map(c => (
                      <option key={c.coop_id} value={c.coop_id}>
                        {c.coop_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha y Hora de la Venta *</label>
                  <input
                    type="datetime-local"
                    name="ven_fecha"
                    value={formData.ven_fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Pago *</label>
                  <select
                    name="ven_tipo_pago"
                    value={formData.ven_tipo_pago}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia Electrónica">Transferencia Electrónica</option>
                    <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-emerald-400">Total de la Venta (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="ven_total"
                      value={formData.ven_total}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-emerald-500/30 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-lg"
                    />
                  </div>
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar Venta'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Venta?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el registro de esta venta. Toma en cuenta que si la venta ya cuenta con un detalle de captura o facturación asociada, la base de datos podría rechazar la eliminación.
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

export default VentaCRUD;
