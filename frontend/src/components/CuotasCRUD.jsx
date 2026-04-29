import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, CircleDollarSign } from 'lucide-react';

const CuotasCRUD = () => {
  const [cuotas, setCuotas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCuota, setCurrentCuota] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    cuo_fk_socio: '',
    cuo_fk_cooperativa: '',
    cuo_monto: 0,
    cuo_fecha_pago: new Date().toISOString().split('T')[0],
    cuo_tipo: 'Mensualidad',
    cuo_estado: 'Pagada'
  });

  useEffect(() => {
    fetchCuotas();
    fetchCatalogs();
  }, []);

  const fetchCuotas = async () => {
    try {
      const { data } = await axios.get('/cuotas');
      setCuotas(data);
    } catch (error) {
      console.error('Error al cargar cuotas:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [resSoc, resCoop] = await Promise.all([
        axios.get('/socios').catch(() => ({ data: [] })),
        axios.get('/cooperativas').catch(() => ({ data: [] }))
      ]);
      setSocios(resSoc.data);
      setCooperativas(resCoop.data);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (cuota = null) => {
    setErrorMsg('');
    if (cuota) {
      setCurrentCuota(cuota);
      setFormData({
        cuo_fk_socio: cuota.cuo_fk_socio || '',
        cuo_fk_cooperativa: cuota.cuo_fk_cooperativa || '',
        cuo_monto: cuota.cuo_monto || 0,
        cuo_fecha_pago: cuota.cuo_fecha_pago ? cuota.cuo_fecha_pago.split('T')[0] : '',
        cuo_tipo: cuota.cuo_tipo || 'Mensualidad',
        cuo_estado: cuota.cuo_estado || 'Pagada'
      });
    } else {
      setCurrentCuota(null);
      setFormData({
        cuo_fk_socio: '',
        cuo_fk_cooperativa: '',
        cuo_monto: 0,
        cuo_fecha_pago: new Date().toISOString().split('T')[0],
        cuo_tipo: 'Mensualidad',
        cuo_estado: 'Pagada'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCuota(null);
    setErrorMsg('');
  };

  const confirmDelete = (cuota) => {
    setCurrentCuota(cuota);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentCuota(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentCuota) {
        await axios.put(`/cuotas/${currentCuota.cuo_id}`, formData);
      } else {
        await axios.post('/cuotas', formData);
      }
      fetchCuotas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar cuota:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/cuotas/${currentCuota.cuo_id}`);
      fetchCuotas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar cuota:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'Pagada': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pendiente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Atrasada': return 'bg-red-500/10 text-red-500 border-red-500/20';
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
            <CircleDollarSign className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Gestión de Cuotas de Socios</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Cuota
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Socio</th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold">Monto</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {cuotas.map((cuota) => (
                  <tr key={cuota.cuo_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{cuota.cuo_id}</td>
                    <td className="p-4 text-white font-medium">{cuota.soc_nombre || `ID: ${cuota.cuo_fk_socio}`}</td>
                    <td className="p-4">{cuota.coop_nombre || `ID: ${cuota.cuo_fk_cooperativa}`}</td>
                    <td className="p-4">{cuota.cuo_tipo}</td>
                    <td className="p-4 text-white font-medium">{formatCurrency(cuota.cuo_monto)}</td>
                    <td className="p-4">{new Date(cuota.cuo_fecha_pago).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoStyle(cuota.cuo_estado)}`}>
                        {cuota.cuo_estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(cuota)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(cuota)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cuotas.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay cuotas registradas.
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
                {currentCuota ? 'Editar Cuota' : 'Registrar Cuota'}
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
                  <label className="text-sm font-medium text-zinc-300">Socio *</label>
                  <select
                    name="cuo_fk_socio"
                    value={formData.cuo_fk_socio}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione un socio...</option>
                    {socios.map(s => (
                      <option key={s.soc_id} value={s.soc_id}>{s.soc_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa *</label>
                  <select
                    name="cuo_fk_cooperativa"
                    value={formData.cuo_fk_cooperativa}
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
                  <label className="text-sm font-medium text-zinc-300">Tipo de Cuota *</label>
                  <select
                    name="cuo_tipo"
                    value={formData.cuo_tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Inscripción">Inscripción</option>
                    <option value="Mensualidad">Mensualidad</option>
                    <option value="Extraordinaria">Extraordinaria</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="cuo_estado"
                    value={formData.cuo_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Pagada">Pagada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Atrasada">Atrasada</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Pago/Vencimiento *</label>
                  <input
                    type="date"
                    name="cuo_fecha_pago"
                    value={formData.cuo_fecha_pago}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Monto (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="cuo_monto"
                      value={formData.cuo_monto}
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
                  {currentCuota ? 'Guardar Cambios' : 'Registrar Cuota'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Cuota?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar la cuota #{currentCuota?.cuo_id} por un monto de {formatCurrency(currentCuota?.cuo_monto || 0)}.
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

export default CuotasCRUD;
