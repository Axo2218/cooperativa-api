import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Fuel, Calculator, CheckCircle, XCircle } from 'lucide-react';

const ViajeGastoCRUD = () => {
  const [gastos, setGastos] = useState([]);
  const [viajes, setViajes] = useState([]);
  const [insumos, setInsumos] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    gas_fk_viaje: '',
    gas_fk_insumo: '',
    gas_cantidad: 0,
    gas_precio_unitario: 0,
    gas_pagado_por_cooperativa: true
  });

  useEffect(() => {
    fetchGastos();
    fetchViajes();
    fetchInsumos();
  }, []);

  const fetchGastos = async () => {
    try {
      const { data } = await axios.get('/viajeGasto');
      setGastos(data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  };

  const fetchViajes = async () => {
    try {
      const { data } = await axios.get('/viaje').catch(() => axios.get('/viajes'));
      setViajes(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    }
  };

  const fetchInsumos = async () => {
    try {
      const { data } = await axios.get('/insumos');
      setInsumos(data);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const openModal = (registro = null) => {
    setErrorMsg('');
    if (registro) {
      setCurrentRegistro(registro);
      setFormData({
        gas_fk_viaje: registro.gas_fk_viaje || '',
        gas_fk_insumo: registro.gas_fk_insumo || '',
        gas_cantidad: registro.gas_cantidad || 0,
        gas_precio_unitario: registro.gas_precio_unitario || 0,
        gas_pagado_por_cooperativa: registro.gas_pagado_por_cooperativa !== undefined ? registro.gas_pagado_por_cooperativa : true
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        gas_fk_viaje: '',
        gas_fk_insumo: '',
        gas_cantidad: 0,
        gas_precio_unitario: 0,
        gas_pagado_por_cooperativa: true
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
        await axios.put(`/viajeGasto/${currentRegistro.gas_id}`, formData);
      } else {
        await axios.post('/viajeGasto', formData);
      }
      fetchGastos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/viajeGasto/${currentRegistro.gas_id}`);
      fetchGastos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Completado': return 'text-teal-400';
      case 'En Curso': return 'text-emerald-400';
      case 'En Puerto': return 'text-indigo-400';
      default: return 'text-zinc-500';
    }
  };

  // Cálculo del subtotal
  const subtotalCalculado = parseFloat(formData.gas_cantidad || 0) * parseFloat(formData.gas_precio_unitario || 0);

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Fuel className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Gastos Operativos por Viaje</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Gasto
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-20">ID</th>
                  <th className="p-4 font-semibold">Viaje Origen</th>
                  <th className="p-4 font-semibold">Insumo</th>
                  <th className="p-4 font-semibold text-right">Cantidad</th>
                  <th className="p-4 font-semibold text-right">Costo Unitario</th>
                  <th className="p-4 font-semibold text-right text-red-400">Gasto Total</th>
                  <th className="p-4 font-semibold text-center">Pagado por Coop.</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {gastos.map((reg) => (
                  <tr key={reg.gas_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.gas_id}</td>
                    <td className="p-4 text-zinc-400">
                      <div className="font-medium text-zinc-300">Viaje #{reg.gas_fk_viaje}</div>
                      <span className={`block text-[10px] font-bold uppercase mt-1 ${getEstatusColor(reg.via_estatus)}`}>
                        {reg.via_estatus || 'Sin Estatus'}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">
                      {reg.ins_nombre || <span className="text-zinc-600 italic">Desconocido</span>}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-400">
                      {reg.gas_cantidad} <span className="text-[10px] text-zinc-500 uppercase">{reg.ins_unidad_medida || 'u'}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-400 text-sm">{formatCurrency(reg.gas_precio_unitario)}</td>
                    <td className="p-4 text-right font-mono text-white font-bold bg-red-500/5">
                      {formatCurrency(reg.gas_subtotal)}
                    </td>
                    <td className="p-4 text-center">
                      {reg.gas_pagado_por_cooperativa ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                          <CheckCircle size={12}/> Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                          <XCircle size={12}/> Tripulación
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar Registro"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar Registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {gastos.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay registros de gastos operativos por viaje.
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Fuel className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Gasto Operativo' : 'Registrar Gasto de Viaje'}
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
                  <label className="text-sm font-medium text-zinc-300">Viaje Relacionado *</label>
                  <select
                    name="gas_fk_viaje"
                    value={formData.gas_fk_viaje}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione el viaje...</option>
                    {viajes.map(v => (
                      <option key={v.via_id} value={v.via_id}>
                        Viaje #{v.via_id} - Estatus: {v.via_estatus} - {v.barco ? `Barco: ${v.barco}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Insumo Utilizado (Diésel, Hielo, Víveres) *</label>
                  <select
                    name="gas_fk_insumo"
                    value={formData.gas_fk_insumo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione el insumo...</option>
                    {insumos.map(i => (
                      <option key={i.ins_id} value={i.ins_id}>
                        {i.ins_nombre} ({i.ins_unidad_medida})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-blue-400">Cantidad Surtida *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="gas_cantidad"
                    value={formData.gas_cantidad}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full bg-zinc-800 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Costo Unitario (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="gas_precio_unitario"
                      value={formData.gas_precio_unitario}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="gas_pagado_por_cooperativa"
                      name="gas_pagado_por_cooperativa"
                      checked={formData.gas_pagado_por_cooperativa}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-emerald-500 rounded bg-zinc-800 border-zinc-700"
                    />
                    <label htmlFor="gas_pagado_por_cooperativa" className="text-sm font-medium text-emerald-400 cursor-pointer">
                      Gasto cubierto inicialmente por la Cooperativa (Se descontará en liquidación)
                    </label>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 ml-8">
                    Si se desmarca, significa que el gasto fue cubierto por el bolsillo del Capitán/Tripulación y no se deducirá de las ganancias netas de la cooperativa.
                  </p>
                </div>

                {/* Calculadora de Gasto Total */}
                <div className="md:col-span-2 mt-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400">
                    <Calculator size={20} />
                    <span className="font-medium">Total de este Gasto:</span>
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Gasto?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar este registro de gasto. Esto afectará el balance y la liquidación final del viaje.
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

export default ViajeGastoCRUD;
