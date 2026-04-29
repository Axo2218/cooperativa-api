import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Ship } from 'lucide-react';

const PescaHistoricoCRUD = () => {
  const [historial, setHistorial] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [especies, setEspecies] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    pes_fk_embarcacion: '',
    pes_fecha_salida: new Date().toISOString().split('T')[0],
    pes_fecha_regreso: '',
    pes_zona_pesca: '',
    pes_fk_especie_principal: '',
    pes_kilos_capturados: 0,
    pes_ingreso_estimado: 0
  });

  useEffect(() => {
    fetchHistorial();
    fetchEmbarcaciones();
    fetchEspecies();
  }, []);

  const fetchHistorial = async () => {
    try {
      const { data } = await axios.get('/pesca-historico');
      setHistorial(data);
    } catch (error) {
      console.error('Error al cargar historial de pesca:', error);
    }
  };

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones');
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
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
        pes_fk_embarcacion: registro.pes_fk_embarcacion || '',
        pes_fecha_salida: registro.pes_fecha_salida ? registro.pes_fecha_salida.split('T')[0] : '',
        pes_fecha_regreso: registro.pes_fecha_regreso ? registro.pes_fecha_regreso.split('T')[0] : '',
        pes_zona_pesca: registro.pes_zona_pesca || '',
        pes_fk_especie_principal: registro.pes_fk_especie_principal || '',
        pes_kilos_capturados: registro.pes_kilos_capturados || 0,
        pes_ingreso_estimado: registro.pes_ingreso_estimado || 0
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        pes_fk_embarcacion: '',
        pes_fecha_salida: new Date().toISOString().split('T')[0],
        pes_fecha_regreso: '',
        pes_zona_pesca: '',
        pes_fk_especie_principal: '',
        pes_kilos_capturados: 0,
        pes_ingreso_estimado: 0
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
      if (!dataToSubmit.pes_fecha_regreso) dataToSubmit.pes_fecha_regreso = null;
      if (!dataToSubmit.pes_fk_especie_principal) dataToSubmit.pes_fk_especie_principal = null;

      if (currentRegistro) {
        await axios.put(`/pesca-historico/${currentRegistro.pes_id}`, dataToSubmit);
      } else {
        await axios.post('/pesca-historico', dataToSubmit);
      }
      fetchHistorial();
      closeModal();
    } catch (error) {
      console.error('Error al guardar registro de pesca:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/pesca-historico/${currentRegistro.pes_id}`);
      fetchHistorial();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar registro de pesca:', error);
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
            <Ship className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Historial de Pesca</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Viaje
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">Viaje</th>
                  <th className="p-4 font-semibold">Embarcación</th>
                  <th className="p-4 font-semibold">Fechas</th>
                  <th className="p-4 font-semibold">Capitán / Tripulación</th>
                  <th className="p-4 font-semibold">Detalle de Captura</th>
                  <th className="p-4 font-semibold text-right">Total (Kg)</th>
                  <th className="p-4 font-semibold text-right">Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {historial.map((reg) => (
                  <tr key={reg.via_id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4 text-zinc-500 font-mono text-xs">#{reg.via_id}</td>
                    <td className="p-4">
                      <div className="text-white font-bold">{reg.emb_nombre}</div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase">{reg.emb_matricula}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-zinc-300">Salida: {new Date(reg.via_fecha_salida).toLocaleDateString()}</div>
                      <div className="text-emerald-500 font-medium">Llegada: {new Date(reg.via_fecha_llegada).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <div className="text-emerald-400 font-bold text-sm">{reg.capitan_nombre}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1 italic">{reg.tripulacion || 'Sin tripulación extra'}</div>
                    </td>
                    <td className="p-4 max-w-[250px]">
                      <div className="text-xs text-zinc-300 leading-relaxed">
                        {reg.detalle_pesca || <span className="text-zinc-600 italic">Sin capturas registradas</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-white font-black">{Number(reg.via_total_kg).toLocaleString()} <span className="text-[10px] text-zinc-500">KG</span></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-emerald-500 font-black text-lg">{formatCurrency(reg.via_total_ingresos)}</div>
                    </td>
                  </tr>
                ))}
                {historial.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay registros de viajes de pesca.
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
                {currentRegistro ? 'Editar Viaje de Pesca' : 'Registrar Nuevo Viaje'}
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
                  <label className="text-sm font-medium text-zinc-300">Embarcación *</label>
                  <select
                    name="pes_fk_embarcacion"
                    value={formData.pes_fk_embarcacion}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una embarcación...</option>
                    {embarcaciones.map(e => (
                      <option key={e.emb_id} value={e.emb_id}>
                        {e.emb_nombre} (Matrícula: {e.emb_matricula})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Salida *</label>
                  <input
                    type="date"
                    name="pes_fecha_salida"
                    value={formData.pes_fecha_salida}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Regreso (Opcional)</label>
                  <input
                    type="date"
                    name="pes_fecha_regreso"
                    value={formData.pes_fecha_regreso}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Zona de Pesca</label>
                  <input
                    type="text"
                    name="pes_zona_pesca"
                    value={formData.pes_zona_pesca}
                    onChange={handleInputChange}
                    placeholder="Ej. Golfo de México, Zona Norte"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Especie Principal Capturada</label>
                  <select
                    name="pes_fk_especie_principal"
                    value={formData.pes_fk_especie_principal}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una especie (Opcional)...</option>
                    {especies.map(e => (
                      <option key={e.esp_id} value={e.esp_id}>
                        {e.esp_nombre_comun}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Kilos Capturados Totales *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      name="pes_kilos_capturados"
                      value={formData.pes_kilos_capturados}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pr-12 pl-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <span className="absolute right-4 top-2 text-zinc-500">kg</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Ingreso Estimado (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="pes_ingreso_estimado"
                      value={formData.pes_ingreso_estimado}
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar Viaje'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Registro?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar este registro histórico de pesca. Esta acción no se puede deshacer.
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

export default PescaHistoricoCRUD;
