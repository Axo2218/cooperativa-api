import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Compass, Calendar } from 'lucide-react';

const ViajeCRUD = () => {
  const [viajes, setViajes] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [zonas, setZonas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [tripulacionGlobal, setTripulacionGlobal] = useState([]);
  const [selectedCoop, setSelectedCoop] = useState(null);
  const [cooperativas, setCooperativas] = useState([]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  const formatDateOnlyForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10);
  };

  const [formData, setFormData] = useState({
    via_fecha_salida: formatDateForInput(new Date()),
    via_fecha_llegada: '',
    via_estatus: 'Pendiente',
    via_observaciones: '',
    via_fk_embarcacion: '',
    via_fk_capitan: '',
    via_fecha_estimada: '',
    via_presupuesto_estimado: 0,
    via_fk_zona: ''
  });

  useEffect(() => {
    fetchViajes();
    fetchEmbarcaciones();
    fetchPersonal();
    fetchZonas();
    fetchTripulacionGlobal();
    fetchCooperativas();
  }, []);

  const fetchCooperativas = async () => {
    try {
      const { data } = await axios.get('/cooperativas').catch(() => ({ data: [] }));
      setCooperativas(data);
    } catch (error) {
      console.error('Error al cargar cooperativas:', error);
    }
  };

  const fetchTripulacionGlobal = async () => {
    try {
      const { data } = await axios.get('/viajes-personal').catch(() => ({ data: [] }));
      setTripulacionGlobal(data);
    } catch (error) {
      console.error('Error al cargar tripulación global:', error);
    }
  };

  const fetchViajes = async () => {
    try {
      const { data } = await axios.get('/viaje').catch(() => axios.get('/viajes')); // Fallback to /viajes if /viaje isn't mounted correctly yet
      setViajes(data);
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    }
  };

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones').catch(() => ({ data: [] }));
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
    }
  };

  const fetchPersonal = async () => {
    try {
      const { data } = await axios.get('/personal').catch(() => ({ data: [] }));
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    }
  };

  const fetchZonas = async () => {
    try {
      // Intentamos cargar zonas. Si no existe la ruta, manejaremos el error silenciosamente.
      const { data } = await axios.get('/zonas').catch(() => ({ data: [] }));
      setZonas(data);
    } catch (error) {
      console.error('Error al cargar zonas de pesca:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'via_fk_embarcacion') {
      const barco = embarcaciones.find(emb => emb.emb_id.toString() === value.toString());
      // Si por alguna razón se cambia de barco pero sigue siendo la misma coop, lo dejamos.
      // Pero si se selecciona un barco vacío, reseteamos el capitán.
      if (!value) {
        setFormData({ ...formData, [name]: value, via_fk_capitan: '' });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleCoopChange = (e) => {
    const value = e.target.value;
    const newCoop = value ? parseInt(value) : null;
    setSelectedCoop(newCoop);
    
    // Al cambiar la cooperativa, reseteamos barco y capitán
    setFormData({
      ...formData,
      via_fk_embarcacion: '',
      via_fk_capitan: ''
    });
  };

  const openModal = (registro = null) => {
    setErrorMsg('');
    if (registro) {
      setCurrentRegistro(registro);
      setFormData({
        via_fecha_salida: formatDateForInput(registro.via_fecha_salida),
        via_fecha_llegada: formatDateForInput(registro.via_fecha_llegada),
        via_estatus: registro.via_estatus || 'Pendiente',
        via_observaciones: registro.via_observaciones || '',
        via_fk_embarcacion: registro.via_fk_embarcacion || '',
        via_fk_capitan: registro.via_fk_capitan || '',
        via_fecha_estimada: formatDateOnlyForInput(registro.via_fecha_estimada),
        via_presupuesto_estimado: registro.via_presupuesto_estimado || 0,
        via_fk_zona: registro.via_fk_zona || ''
      });
      // Detectar cooperativa al editar
      const barco = embarcaciones.find(emb => emb.emb_id === registro.via_fk_embarcacion);
      setSelectedCoop(barco ? barco.emb_fk_cooperativa : null);
    } else {
      setCurrentRegistro(null);
      setSelectedCoop(null);
      setFormData({
        via_fecha_salida: formatDateForInput(new Date()),
        via_fecha_llegada: '',
        via_estatus: 'Pendiente',
        via_observaciones: '',
        via_fk_embarcacion: '',
        via_fk_capitan: '',
        via_fecha_estimada: '',
        via_presupuesto_estimado: 0,
        via_fk_zona: ''
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
      const endpoint = currentRegistro ? `/viaje/${currentRegistro.via_id}` : '/viaje';
      const method = currentRegistro ? 'put' : 'post';
      
      await axios[method](endpoint, formData).catch(async (err) => {
        // Fallback to /viajes endpoint
        if (err.response && err.response.status === 404) {
             const fallbackEndpoint = currentRegistro ? `/viajes/${currentRegistro.via_id}` : '/viajes';
             return await axios[method](fallbackEndpoint, formData);
        }
        throw err;
      });

      fetchViajes();
      closeModal();
    } catch (error) {
      console.error('Error al guardar viaje:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/viaje/${currentRegistro.via_id}`).catch(async (err) => {
          if (err.response && err.response.status === 404) {
             return await axios.delete(`/viajes/${currentRegistro.via_id}`);
          }
          throw err;
      });
      fetchViajes();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Pendiente': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'En Preparación': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'En Curso': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'En Puerto': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Cancelado': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Completado': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  // Filtrado de ocupados
  const viajesActivos = viajes.filter(v => ['Pendiente', 'En Preparación', 'En Curso'].includes(v.via_estatus));
  const barcosOcupados = new Set(viajesActivos.map(v => v.via_fk_embarcacion));
  const capitanesOcupados = new Set(viajesActivos.map(v => v.via_fk_capitan));
  const tripulantesOcupados = new Set(
    tripulacionGlobal
      .filter(t => ['Pendiente', 'En Preparación', 'En Curso'].includes(t.via_estatus))
      .map(t => t.via_per_fk_personal)
  );

  const personalOcupadoTotal = new Set([...capitanesOcupados, ...tripulantesOcupados]);

  return (
    <div className="text-zinc-400 font-sans">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Compass className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Registro CRUD de Viajes (Altamar)</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Planificar Viaje
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-20">ID</th>
                  <th className="p-4 font-semibold">Embarcación</th>
                  <th className="p-4 font-semibold">Capitán</th>
                  <th className="p-4 font-semibold">Salida</th>
                  <th className="p-4 font-semibold">Estatus</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {viajes.map((reg) => (
                  <tr key={reg.via_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.via_id}</td>
                    <td className="p-4 text-white font-medium">{reg.barco || <span className="text-zinc-600 italic">Desconocido</span>}</td>
                    <td className="p-4 text-sm text-zinc-300">{reg.capitan || <span className="text-zinc-600 italic">No Asignado</span>}</td>
                    <td className="p-4 text-sm text-zinc-400">{new Date(reg.via_fecha_salida).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getEstatusColor(reg.via_estatus)}`}>
                        {reg.via_estatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar Viaje"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar Viaje"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {viajes.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-zinc-500">
                      No hay viajes registrados.
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Viaje' : 'Planificar Nuevo Viaje'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-2 border-b border-zinc-800 pb-2">Información Operativa</h3>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Cooperativa Propietaria *</label>
                    <select
                      value={selectedCoop || ''}
                      onChange={handleCoopChange}
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
                    <label className="text-sm font-medium text-zinc-300">Embarcación * {selectedCoop && <span className="text-[10px] text-emerald-500 font-black ml-2 opacity-70">DISPONIBLES</span>}</label>
                    <select
                      name="via_fk_embarcacion"
                      value={formData.via_fk_embarcacion}
                      onChange={handleInputChange}
                      required
                      disabled={!selectedCoop}
                      className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors ${!selectedCoop ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{selectedCoop ? 'Seleccione embarcación...' : 'Primero seleccione cooperativa'}</option>
                      {embarcaciones
                        .filter(e => !selectedCoop || e.emb_fk_cooperativa === selectedCoop)
                        .map(e => {
                          const isOcupado = barcosOcupados.has(e.emb_id) && (!currentRegistro || currentRegistro.via_fk_embarcacion !== e.emb_id);
                          return (
                            <option key={e.emb_id} value={e.emb_id} disabled={isOcupado}>
                              {e.emb_nombre} ({e.emb_matricula}) {isOcupado ? ' - EN RUTA' : ''}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                    <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Capitán Designado * {selectedCoop && <span className="text-[10px] text-emerald-500 font-black ml-2 opacity-70">FILTRADO POR COOPERATIVA</span>}</label>
                    <select
                      name="via_fk_capitan"
                      value={formData.via_fk_capitan}
                      onChange={handleInputChange}
                      required
                      disabled={!selectedCoop}
                      className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors ${!selectedCoop ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{selectedCoop ? 'Seleccione capitán...' : 'Primero seleccione cooperativa'}</option>
                      {personal
                        .filter(p => !selectedCoop || p.per_fk_cooperativa === selectedCoop)
                        .map(p => {
                          const isOcupado = personalOcupadoTotal.has(p.per_id) && (!currentRegistro || currentRegistro.via_fk_capitan !== p.per_id);
                          return (
                            <option key={p.per_id} value={p.per_id} disabled={isOcupado}>
                              {p.per_nombre} {p.per_apellidos} {isOcupado ? ' - OCUPADO' : ''}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Zona de Pesca (Opcional)</label>
                    <select
                      name="via_fk_zona"
                      value={formData.via_fk_zona}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Seleccione zona...</option>
                      {zonas.map(z => (
                        <option key={z.zona_id} value={z.zona_id}>
                          {z.zona_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Estatus del Viaje *</label>
                    <select
                      name="via_estatus"
                      value={formData.via_estatus}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Preparación">En Preparación</option>
                      <option value="En Curso">En Curso</option>
                      <option value="En Puerto">En Puerto</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-2 border-b border-zinc-800 pb-2">Logística y Tiempos</h3>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Fecha y Hora de Salida *</label>
                    <input
                      type="datetime-local"
                      name="via_fecha_salida"
                      value={formData.via_fecha_salida}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Fecha Estimada de Regreso</label>
                    <input
                      type="date"
                      name="via_fecha_estimada"
                      value={formData.via_fecha_estimada}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-500">Fecha y Hora Real de Llegada (Se llena al arribo)</label>
                    <input
                      type="datetime-local"
                      name="via_fecha_llegada"
                      value={formData.via_fecha_llegada}
                      onChange={handleInputChange}
                      disabled
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-600 cursor-not-allowed focus:outline-none transition-colors opacity-60"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Presupuesto Estimado (MXN)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="via_presupuesto_estimado"
                      value={formData.via_presupuesto_estimado}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Observaciones del Viaje</label>
                  <textarea
                    name="via_observaciones"
                    value={formData.via_observaciones}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Condiciones climáticas, reportes de averías, etc..."
                  ></textarea>
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
                  {currentRegistro ? 'Guardar Cambios' : 'Planificar Viaje'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Viaje?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar este viaje. Si ya tiene asignados gastos, capturas o liquidaciones asociadas, la base de datos protegerá su integridad y no permitirá borrarlo.
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

export default ViajeCRUD;
