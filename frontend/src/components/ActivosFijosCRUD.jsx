import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

const ActivosFijosCRUD = () => {
  const [activos, setActivos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentActivo, setCurrentActivo] = useState(null);
  
  const [formData, setFormData] = useState({
    act_nombre: '',
    act_num_serie_o_placa: '',
    act_estado: 'Operativo',
    act_fk_tipo: '',
    act_fk_cooperativa: '',
    act_fk_instalacion: '',
    act_fk_embarcacion: ''
  });

  useEffect(() => {
    fetchActivos();
    fetchCatalogs();
  }, []);

  const fetchActivos = async () => {
    try {
      const { data } = await axios.get('/activos-fijos');
      setActivos(data);
    } catch (error) {
      console.error('Error al cargar activos:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      // Intentamos cargar los catálogos si existen las rutas
      const [resTipos, resCoop, resInst, resEmb] = await Promise.all([
        axios.get('/cat-tipo-activo').catch(() => ({ data: [] })),
        axios.get('/cooperativas').catch(() => ({ data: [] })),
        axios.get('/instalaciones').catch(() => ({ data: [] })),
        axios.get('/embarcaciones').catch(() => ({ data: [] }))
      ]);
      setTipos(resTipos.data);
      setCooperativas(resCoop.data);
      setInstalaciones(resInst.data);
      setEmbarcaciones(resEmb.data);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (activo = null) => {
    if (activo) {
      setCurrentActivo(activo);
      setFormData({
        act_nombre: activo.act_nombre || '',
        act_num_serie_o_placa: activo.act_num_serie_o_placa || '',
        act_estado: activo.act_estado || 'Operativo',
        act_fk_tipo: activo.act_fk_tipo || '',
        act_fk_cooperativa: activo.act_fk_cooperativa || '',
        act_fk_instalacion: activo.act_fk_instalacion || '',
        act_fk_embarcacion: activo.act_fk_embarcacion || ''
      });
    } else {
      setCurrentActivo(null);
      setFormData({
        act_nombre: '',
        act_num_serie_o_placa: '',
        act_estado: 'Operativo',
        act_fk_tipo: '',
        act_fk_cooperativa: '',
        act_fk_instalacion: '',
        act_fk_embarcacion: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActivo(null);
  };

  const confirmDelete = (activo) => {
    setCurrentActivo(activo);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentActivo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Limpiar valores vacíos para que sean NULL en la BD
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.act_fk_instalacion) dataToSubmit.act_fk_instalacion = null;
      if (!dataToSubmit.act_fk_embarcacion) dataToSubmit.act_fk_embarcacion = null;

      if (currentActivo) {
        await axios.put(`/activos-fijos/${currentActivo.act_id}`, dataToSubmit);
      } else {
        await axios.post('/activos-fijos', dataToSubmit);
      }
      fetchActivos();
      closeModal();
    } catch (error) {
      console.error('Error al guardar activo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/activos-fijos/${currentActivo.act_id}`);
      fetchActivos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar activo:', error);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Activos Fijos</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Activo
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold">Serie/Placa</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold">Ubicación (Inst / Emb)</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {activos.map((activo) => (
                  <tr key={activo.act_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{activo.act_id}</td>
                    <td className="p-4 text-white font-medium">{activo.act_nombre}</td>
                    <td className="p-4 text-zinc-400 font-mono text-sm">{activo.act_num_serie_o_placa || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${activo.act_estado === 'Operativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                        {activo.act_estado}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{activo.tip_act_nombre || activo.act_fk_tipo}</td>
                    <td className="p-4 text-sm text-zinc-400">{activo.coop_nombre || activo.act_fk_cooperativa}</td>
                    <td className="p-4">
                      {activo.inst_nombre && <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">🏢 {activo.inst_nombre}</span>}
                      {activo.emb_nombre && <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">🚢 {activo.emb_nombre}</span>}
                      {!activo.inst_nombre && !activo.emb_nombre && <span className="text-zinc-600 italic">Sin Ubicación</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(activo)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(activo)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {activos.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-zinc-500">
                      No hay activos fijos registrados.
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentActivo ? 'Editar Activo Fijo' : 'Nuevo Activo Fijo'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Nombre del Activo *</label>
                  <input
                    type="text"
                    name="act_nombre"
                    value={formData.act_nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Nº Serie o Placa</label>
                  <input
                    type="text"
                    name="act_num_serie_o_placa"
                    value={formData.act_num_serie_o_placa}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="act_estado"
                    value={formData.act_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="En Reparación">En Reparación</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Activo *</label>
                  <select
                    name="act_fk_tipo"
                    value={formData.act_fk_tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione un tipo...</option>
                    {tipos.map(t => (
                      <option key={t.tip_act_id} value={t.tip_act_id}>{t.tip_act_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa Propietaria *</label>
                  <select
                    name="act_fk_cooperativa"
                    value={formData.act_fk_cooperativa}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione una cooperativa...</option>
                    {cooperativas.map(c => (
                      <option key={c.coop_id} value={c.coop_id}>{c.coop_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Asignar a Instalación</label>
                  <select
                    name="act_fk_instalacion"
                    value={formData.act_fk_instalacion}
                    onChange={handleInputChange}
                    disabled={!!formData.act_fk_embarcacion}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                  >
                    <option value="">Ninguna...</option>
                    {instalaciones.map(i => (
                      <option key={i.inst_id} value={i.inst_id}>{i.inst_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Asignar a Embarcación</label>
                  <select
                    name="act_fk_embarcacion"
                    value={formData.act_fk_embarcacion}
                    onChange={handleInputChange}
                    disabled={!!formData.act_fk_instalacion}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                  >
                    <option value="">Ninguna...</option>
                    {embarcaciones.map(e => (
                      <option key={e.emb_id} value={e.emb_id}>{e.emb_nombre}</option>
                    ))}
                  </select>
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
                  {currentActivo ? 'Guardar Cambios' : 'Crear Activo'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Activo Fijo?</h3>
            <p className="text-zinc-400 mb-6">
              Estás a punto de eliminar el activo "{currentActivo?.act_nombre}". Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
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

export default ActivosFijosCRUD;
