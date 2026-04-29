import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Wallet } from 'lucide-react';

const PagosNominaCRUD = () => {
  const [pagos, setPagos] = useState([]);
  const [socios, setSocios] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPago, setCurrentPago] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    pag_fk_socio: '',
    pag_fecha: new Date().toISOString().split('T')[0],
    pag_monto_bruto: 0,
    pag_deducciones: 0,
    pag_referencia: ''
  });

  useEffect(() => {
    fetchPagos();
    fetchSocios();
  }, []);

  const fetchPagos = async () => {
    try {
      const { data } = await axios.get('/pagos-nomina');
      setPagos(data);
    } catch (error) {
      console.error('Error al cargar pagos de nómina:', error);
    }
  };

  const fetchSocios = async () => {
    try {
      const { data } = await axios.get('/socios');
      setSocios(data);
    } catch (error) {
      console.error('Error al cargar socios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (pago = null) => {
    setErrorMsg('');
    if (pago) {
      setCurrentPago(pago);
      setFormData({
        pag_fk_socio: pago.pag_fk_socio || '',
        pag_fecha: pago.pag_fecha ? pago.pag_fecha.split('T')[0] : '',
        pag_monto_bruto: pago.pag_monto_bruto || 0,
        pag_deducciones: pago.pag_deducciones || 0,
        pag_referencia: pago.pag_referencia || ''
      });
    } else {
      setCurrentPago(null);
      setFormData({
        pag_fk_socio: '',
        pag_fecha: new Date().toISOString().split('T')[0],
        pag_monto_bruto: 0,
        pag_deducciones: 0,
        pag_referencia: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPago(null);
    setErrorMsg('');
  };

  const confirmDelete = (pago) => {
    setCurrentPago(pago);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentPago(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentPago) {
        await axios.put(`/pagos-nomina/${currentPago.pag_id}`, formData);
      } else {
        await axios.post('/pagos-nomina', formData);
      }
      fetchPagos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar pago de nómina:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/pagos-nomina/${currentPago.pag_id}`);
      fetchPagos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar pago de nómina:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Cálculo visual para el formulario
  const montoBrutoForm = parseFloat(formData.pag_monto_bruto) || 0;
  const deduccionesForm = parseFloat(formData.pag_deducciones) || 0;
  const netoForm = montoBrutoForm - deduccionesForm;

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Pagos de Nómina</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Pago
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Socio</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Referencia</th>
                  <th className="p-4 font-semibold text-right text-emerald-400">Bruto</th>
                  <th className="p-4 font-semibold text-right text-red-400">Deducciones</th>
                  <th className="p-4 font-semibold text-right text-blue-400">Neto (Calculado)</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pagos.map((pago) => (
                  <tr key={pago.pag_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{pago.pag_id}</td>
                    <td className="p-4 text-white font-medium">
                      {pago.soc_nombre}
                      <span className="block text-xs text-zinc-500 font-mono mt-1">RFC: {pago.soc_rfc || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(pago.pag_fecha).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-mono text-zinc-300 truncate max-w-[150px]" title={pago.pag_referencia}>
                      {pago.pag_referencia || '-'}
                    </td>
                    <td className="p-4 text-right text-emerald-400 font-mono">
                      {formatCurrency(pago.pag_monto_bruto)}
                    </td>
                    <td className="p-4 text-right text-red-400 font-mono">
                      -{formatCurrency(pago.pag_deducciones)}
                    </td>
                    <td className="p-4 text-right text-blue-400 font-mono font-bold">
                      {formatCurrency(pago.pag_monto_neto)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(pago)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(pago)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagos.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay pagos de nómina registrados.
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
                {currentPago ? 'Editar Pago de Nómina' : 'Registrar Nuevo Pago'}
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
                  <label className="text-sm font-medium text-zinc-300">Socio *</label>
                  <select
                    name="pag_fk_socio"
                    value={formData.pag_fk_socio}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione un socio...</option>
                    {socios.map(s => (
                      <option key={s.soc_id} value={s.soc_id}>
                        {s.soc_nombre} (RFC: {s.soc_rfc || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Pago *</label>
                  <input
                    type="date"
                    name="pag_fecha"
                    value={formData.pag_fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Referencia / Folio (Opcional)</label>
                  <input
                    type="text"
                    name="pag_referencia"
                    value={formData.pag_referencia}
                    onChange={handleInputChange}
                    placeholder="Ej. TRANSF-1029"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-emerald-400">Monto Bruto (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="pag_monto_bruto"
                      value={formData.pag_monto_bruto}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-emerald-500/50 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-red-400">Deducciones (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="pag_deducciones"
                      value={formData.pag_deducciones}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-red-500/50 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex justify-between items-center">
                  <span className="text-blue-400 font-medium">Monto Neto Calculado:</span>
                  <span className="text-2xl font-bold font-mono text-blue-400">
                    {formatCurrency(netoForm)}
                  </span>
                </div>
                <p className="md:col-span-2 text-xs text-zinc-500 text-center">
                  El monto neto será calculado y guardado automáticamente por la base de datos al registrar.
                </p>

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
                  {currentPago ? 'Guardar Cambios' : 'Registrar Pago'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Pago?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el registro de pago para este socio. Esta acción no se puede deshacer y puede afectar los reportes financieros.
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

export default PagosNominaCRUD;
