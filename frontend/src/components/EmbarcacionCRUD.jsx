import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Ship } from 'lucide-react';

const EmbarcacionCRUD = () => {
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmbarcacion, setCurrentEmbarcacion] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    emb_nombre: '',
    emb_matricula: '',
    emb_eslora: '',
    emb_manga: '',
    emb_capacidad_carga: '',
    emb_tipo_motor: '',
    emb_estado: 'Activa',
    emb_fk_cooperativa: '',
    emb_fk_categoria: ''
  });

  useEffect(() => {
    fetchEmbarcaciones();
    fetchCooperativas();
  }, []);

  const fetchEmbarcaciones = async () => {
    try {
      const { data } = await axios.get('/embarcaciones');
      setEmbarcaciones(data);
    } catch (error) {
      console.error('Error al cargar embarcaciones:', error);
    }
  };

  const fetchCooperativas = async () => {
    try {
      const { data } = await axios.get('/catalogo/catalogos');
      setCooperativas(data.cooperativas || []);
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'emb_fk_categoria') {
      const selectedCat = categorias.find(c => c.cat_id === parseInt(value));
      if (selectedCat) {
        setFormData({ 
          ...formData, 
          [name]: value,
          emb_capacidad_carga: selectedCat.cat_capacidad_sugerida || '',
          // Valores por defecto sugeridos según categoría para facilitar el llenado
          emb_eslora: value === '1' ? '7.5' : value === '3' ? '25.0' : formData.emb_eslora,
          emb_manga: value === '1' ? '2.5' : value === '3' ? '6.0' : formData.emb_manga
        });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (embarcacion = null) => {
    setErrorMsg('');
    if (embarcacion) {
      setCurrentEmbarcacion(embarcacion);
      setFormData({
        emb_nombre: embarcacion.emb_nombre || '',
        emb_matricula: embarcacion.emb_matricula || '',
        emb_eslora: embarcacion.emb_eslora || '',
        emb_manga: embarcacion.emb_manga || '',
        emb_capacidad_carga: embarcacion.emb_capacidad_carga || '',
        emb_tipo_motor: embarcacion.emb_tipo_motor || '',
        emb_estado: embarcacion.emb_estatus || 'Activa',
        emb_fk_cooperativa: embarcacion.emb_fk_cooperativa || '',
        emb_fk_categoria: embarcacion.emb_fk_categoria || ''
      });
    } else {
      setCurrentEmbarcacion(null);
      setFormData({
        emb_nombre: '',
        emb_matricula: '',
        emb_eslora: '',
        emb_manga: '',
        emb_capacidad_carga: '',
        emb_tipo_motor: '',
        emb_estado: 'Activa',
        emb_fk_cooperativa: '',
        emb_fk_categoria: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmbarcacion(null);
    setErrorMsg('');
  };

  const confirmDelete = (embarcacion) => {
    setCurrentEmbarcacion(embarcacion);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentEmbarcacion(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.emb_eslora === '') dataToSubmit.emb_eslora = null;
      if (dataToSubmit.emb_manga === '') dataToSubmit.emb_manga = null;
      if (dataToSubmit.emb_capacidad_carga === '') dataToSubmit.emb_capacidad_carga = null;
      if (dataToSubmit.emb_fk_categoria === '') dataToSubmit.emb_fk_categoria = null;

      if (currentEmbarcacion) {
        await axios.put(`/embarcaciones/${currentEmbarcacion.emb_id}`, dataToSubmit);
      } else {
        await axios.post('/embarcaciones', dataToSubmit);
      }
      fetchEmbarcaciones();
      closeModal();
    } catch (error) {
      console.error('Error al guardar embarcación:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/embarcaciones/${currentEmbarcacion.emb_id}`);
      fetchEmbarcaciones();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar embarcación:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'Activa': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'En Mantenimiento': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Inactiva': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Ship className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Directorio de Embarcaciones</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Embarcación
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Matrícula</th>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold">Carga (kg)</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {embarcaciones.map((emb) => (
                  <tr key={emb.emb_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{emb.emb_id}</td>
                    <td className="p-4 font-mono text-white">{emb.emb_matricula}</td>
                    <td className="p-4 font-medium text-white">{emb.emb_nombre}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded text-[10px] font-bold uppercase">
                        {emb.categoria || 'Sin Cat.'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{emb.coop_nombre || `ID: ${emb.emb_fk_cooperativa}`}</td>
                    <td className="p-4 text-sm text-zinc-400">{emb.emb_capacidad_carga ? `${emb.emb_capacidad_carga} kg` : 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoStyle(emb.emb_estatus)}`}>
                        {emb.emb_estatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(emb)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(emb)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {embarcaciones.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay embarcaciones registradas.
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
              <h2 className="text-xl font-bold text-white">
                {currentEmbarcacion ? 'Editar Embarcación' : 'Nueva Embarcación'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre de la Embarcación *</label>
                  <input
                    type="text"
                    name="emb_nombre"
                    value={formData.emb_nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. La Perla Negra"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Matrícula *</label>
                  <input
                    type="text"
                    name="emb_matricula"
                    value={formData.emb_matricula}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. MAT-12345"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa Propietaria *</label>
                  <select
                    name="emb_fk_cooperativa"
                    value={formData.emb_fk_cooperativa}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Cooperativa...</option>
                    {cooperativas.map(c => (
                      <option key={c.coop_id} value={c.coop_id}>{c.coop_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Categoría de Barco *</label>
                  <select
                    name="emb_fk_categoria"
                    value={formData.emb_fk_categoria}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Categoría...</option>
                    {categorias.map(cat => (
                      <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Estado *</label>
                  <select
                    name="emb_estado"
                    value={formData.emb_estado}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Activa">Activa</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Motor</label>
                  <input
                    type="text"
                    name="emb_tipo_motor"
                    value={formData.emb_tipo_motor}
                    onChange={handleInputChange}
                    placeholder="Ej. Yamaha 115 HP"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Capacidad de Carga (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="emb_capacidad_carga"
                    value={formData.emb_capacidad_carga}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Ej. 1500"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Eslora (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="emb_eslora"
                    value={formData.emb_eslora}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Largo total"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Manga (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="emb_manga"
                    value={formData.emb_manga}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Ancho máximo"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
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
                  {currentEmbarcacion ? 'Guardar Cambios' : 'Registrar Embarcación'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Embarcación?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar la embarcación "{currentEmbarcacion?.emb_nombre}" (Matrícula: {currentEmbarcacion?.emb_matricula}). Esta acción fallará si existen bitácoras o pescas vinculadas.
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

export default EmbarcacionCRUD;
