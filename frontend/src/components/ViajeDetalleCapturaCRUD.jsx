import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Fish, Calculator, Ship } from 'lucide-react';

const ViajeDetalleCapturaCRUD = () => {
  const [capturas, setCapturas] = useState([]);
  const [viajes, setViajes] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [filtroBarco, setFiltroBarco] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    det_cap_fk_viaje: '',
    det_cap_fk_especie: '',
    det_cap_kilogramos: 0,
    det_cap_precio_pactado: 0
  });

  useEffect(() => {
    fetchCapturas();
    fetchViajes();
    fetchEspecies();
    fetchEmbarcaciones();
  }, []);

  const fetchCapturas = async () => {
    try {
      const { data } = await axios.get('/viajeDetalleCaptura');
      setCapturas(data);
    } catch (error) {
      console.error('Error al cargar capturas:', error);
    }
  };

  const fetchViajes = async () => {
    try {
      // Intentar obtener de /viaje (ruta CRUD), o /viajes (ruta dashboard)
      const { data } = await axios.get('/viaje').catch(() => axios.get('/viajes'));
      setViajes(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
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

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones');
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
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
        det_cap_fk_viaje: registro.det_cap_fk_viaje || '',
        det_cap_fk_especie: registro.det_cap_fk_especie || '',
        det_cap_kilogramos: registro.det_cap_kilogramos || 0,
        det_cap_precio_pactado: registro.det_cap_precio_pactado || 0
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        det_cap_fk_viaje: '',
        det_cap_fk_especie: '',
        det_cap_kilogramos: 0,
        det_cap_precio_pactado: 0
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
        await axios.put(`/viajeDetalleCaptura/${currentRegistro.det_cap_id}`, formData);
      } else {
        await axios.post('/viajeDetalleCaptura', formData);
      }
      fetchCapturas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar captura:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/viajeDetalleCaptura/${currentRegistro.det_cap_id}`);
      fetchCapturas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar captura:', error);
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

  // Cálculo en tiempo real del valor bruto de captura en el formulario
  const valorBrutoCalculado = parseFloat(formData.det_cap_kilogramos || 0) * parseFloat(formData.det_cap_precio_pactado || 0);

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Fish className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Registro de Capturas (Bitácora)</h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Embarcación:</label>
              <select
                value={filtroBarco}
                onChange={(e) => setFiltroBarco(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all min-w-[220px] shadow-inner"
              >
                <option value="all" className="bg-zinc-900 text-white">Todas las Embarcaciones</option>
                {embarcaciones.map(b => (
                  <option key={b.emb_id} value={b.emb_id} className="bg-zinc-900 text-white">
                    {b.emb_nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
            >
              <Plus size={20} />
              Registrar Captura
            </button>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-20">ID</th>
                  <th className="p-4 font-semibold">Viaje Origen</th>
                  <th className="p-4 font-semibold">Especie Capturada</th>
                  <th className="p-4 font-semibold text-right">Kilogramos</th>
                  <th className="p-4 font-semibold text-right">Precio Pactado/Kg</th>
                  <th className="p-4 font-semibold text-right text-emerald-400">Valor Bruto</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {capturas
                  .filter(reg => filtroBarco === 'all' || reg.via_fk_embarcacion?.toString() === filtroBarco)
                  .map((reg) => (
                  <tr key={reg.det_cap_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.det_cap_id}</td>
                    <td className="p-4 text-zinc-400">
                      <div className="font-medium text-zinc-300">Viaje #{reg.det_cap_fk_viaje}</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">{reg.barco || 'Barco N/A'}</div>
                      <span className={`block text-[10px] font-bold uppercase mt-1 ${getEstatusColor(reg.via_estatus)}`}>
                        {reg.via_estatus || 'Sin Estatus'}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">{reg.esp_nombre_comun || <span className="text-zinc-600 italic">Desconocida</span>}</td>
                    <td className="p-4 text-right font-mono text-blue-400">{reg.det_cap_kilogramos} <span className="text-[10px] text-zinc-500">kg</span></td>
                    <td className="p-4 text-right font-mono text-zinc-400 text-sm">{formatCurrency(reg.det_cap_precio_pactado)}</td>
                    <td className="p-4 text-right font-mono text-white font-bold bg-emerald-500/5">
                      {formatCurrency(reg.det_cap_subtotal)}
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
                {capturas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay registros de capturas pesqueras.
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
                <Fish className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Captura' : 'Registrar Nueva Captura'}
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
                  <label className="text-sm font-medium text-zinc-300">Viaje de Origen *</label>
                  <select
                    name="det_cap_fk_viaje"
                    value={formData.det_cap_fk_viaje}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione el viaje correspondiente...</option>
                    {viajes.map(v => (
                      <option key={v.via_id} value={v.via_id}>
                        Viaje #{v.via_id} - Estatus: {v.via_estatus} - {v.barco ? `Barco: ${v.barco}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Especie Capturada *</label>
                  <select
                    name="det_cap_fk_especie"
                    value={formData.det_cap_fk_especie}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione la especie...</option>
                    {especies.map(e => (
                      <option key={e.esp_id} value={e.esp_id}>
                        {e.esp_nombre_comun} {e.esp_nombre_cientifico ? `(${e.esp_nombre_cientifico})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-blue-400">Kilogramos Capturados *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="det_cap_kilogramos"
                    value={formData.det_cap_kilogramos}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full bg-zinc-800 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Precio Pactado por Kg (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="det_cap_precio_pactado"
                      value={formData.det_cap_precio_pactado}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Calculadora de Valor Bruto */}
                <div className="md:col-span-2 mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Calculator size={20} />
                    <span className="font-medium">Valor Bruto de Captura:</span>
                  </div>
                  <span className="text-xl font-bold text-white font-mono">
                    {formatCurrency(valorBrutoCalculado)}
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar Captura'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Captura?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el registro de esta captura. Esto restará estos kilos y su valor bruto de la liquidación del viaje.
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

export default ViajeDetalleCapturaCRUD;
