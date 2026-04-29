import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, FishSymbol } from 'lucide-react';

const EspeciesCRUD = () => {
  const [especies, setEspecies] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEspecie, setCurrentEspecie] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    esp_nombre_comun: '',
    esp_nombre_cientifico: '',
    esp_fk_categoria: '',
    esp_temporada_veda_inicio: '',
    esp_temporada_veda_fin: '',
    esp_precio_sugerido_kg: 0
  });

  useEffect(() => {
    fetchEspecies();
    fetchCategorias();
  }, []);

  const fetchEspecies = async () => {
    try {
      const { data } = await axios.get('/especies');
      setEspecies(data);
    } catch (error) {
      console.error('Error al cargar especies:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get('/categoria-especie');
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías de especies:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (especie = null) => {
    setErrorMsg('');
    if (especie) {
      setCurrentEspecie(especie);
      setFormData({
        esp_nombre_comun: especie.esp_nombre_comun || '',
        esp_nombre_cientifico: especie.esp_nombre_cientifico || '',
        esp_fk_categoria: especie.esp_fk_categoria || '',
        esp_temporada_veda_inicio: especie.esp_temporada_veda_inicio ? especie.esp_temporada_veda_inicio.split('T')[0] : '',
        esp_temporada_veda_fin: especie.esp_temporada_veda_fin ? especie.esp_temporada_veda_fin.split('T')[0] : '',
        esp_precio_sugerido_kg: especie.esp_precio_sugerido_kg || 0
      });
    } else {
      setCurrentEspecie(null);
      setFormData({
        esp_nombre_comun: '',
        esp_nombre_cientifico: '',
        esp_fk_categoria: '',
        esp_temporada_veda_inicio: '',
        esp_temporada_veda_fin: '',
        esp_precio_sugerido_kg: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEspecie(null);
    setErrorMsg('');
  };

  const confirmDelete = (especie) => {
    setCurrentEspecie(especie);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentEspecie(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.esp_temporada_veda_inicio) dataToSubmit.esp_temporada_veda_inicio = null;
      if (!dataToSubmit.esp_temporada_veda_fin) dataToSubmit.esp_temporada_veda_fin = null;

      if (currentEspecie) {
        await axios.put(`/especies/${currentEspecie.esp_id}`, dataToSubmit);
      } else {
        await axios.post('/especies', dataToSubmit);
      }
      fetchEspecies();
      closeModal();
    } catch (error) {
      console.error('Error al guardar especie:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/especies/${currentEspecie.esp_id}`);
      fetchEspecies();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar especie:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const estaEnVeda = (inicio, fin) => {
    if (!inicio || !fin) return false;
    const hoy = new Date();
    // Normalizamos ignorando el año (las vedas suelen ser anuales pero asumiremos validación de fechas directas por ahora)
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    return hoy >= fechaInicio && hoy <= fechaFin;
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FishSymbol className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Directorio de Especies</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Especie
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre Común</th>
                  <th className="p-4 font-semibold">Nombre Científico</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Veda</th>
                  <th className="p-4 font-semibold text-right">Precio Sug. (kg)</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {especies.map((especie) => {
                  const enVeda = estaEnVeda(especie.esp_temporada_veda_inicio, especie.esp_temporada_veda_fin);
                  return (
                    <tr key={especie.esp_id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 text-zinc-500">#{especie.esp_id}</td>
                      <td className="p-4 text-white font-medium">{especie.esp_nombre_comun}</td>
                      <td className="p-4 italic text-sm">{especie.esp_nombre_cientifico || 'N/A'}</td>
                      <td className="p-4">{especie.cat_esp_nombre || `ID: ${especie.esp_fk_categoria}`}</td>
                      <td className="p-4">
                        {especie.esp_temporada_veda_inicio && especie.esp_temporada_veda_fin ? (
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${enVeda ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                            <span className="text-xs">
                              {new Date(especie.esp_temporada_veda_inicio).toLocaleDateString()} - {new Date(especie.esp_temporada_veda_fin).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-xs">Sin temporada fija</span>
                        )}
                      </td>
                      <td className="p-4 text-right text-white font-mono">
                        {formatCurrency(especie.esp_precio_sugerido_kg)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openModal(especie)}
                            className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(especie)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {especies.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay especies registradas.
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
                {currentEspecie ? 'Editar Especie' : 'Nueva Especie'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre Común *</label>
                  <input
                    type="text"
                    name="esp_nombre_comun"
                    value={formData.esp_nombre_comun}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Huachinango"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Nombre Científico</label>
                  <input
                    type="text"
                    name="esp_nombre_cientifico"
                    value={formData.esp_nombre_cientifico}
                    onChange={handleInputChange}
                    placeholder="Ej. Lutjanus campechanus"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white italic focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Categoría *</label>
                  <select
                    name="esp_fk_categoria"
                    value={formData.esp_fk_categoria}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione categoría...</option>
                    {categorias.map(c => (
                      <option key={c.cat_esp_id} value={c.cat_esp_id}>{c.cat_esp_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Precio Sugerido por Kg (MXN)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-zinc-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="esp_precio_sugerido_kg"
                      value={formData.esp_precio_sugerido_kg}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 pb-2 border-b border-zinc-800">
                  <h4 className="text-sm font-semibold text-emerald-400">Temporada de Veda (Opcional)</h4>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Inicio</label>
                  <input
                    type="date"
                    name="esp_temporada_veda_inicio"
                    value={formData.esp_temporada_veda_inicio}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Fin</label>
                  <input
                    type="date"
                    name="esp_temporada_veda_fin"
                    value={formData.esp_temporada_veda_fin}
                    onChange={handleInputChange}
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
                  {currentEspecie ? 'Guardar Cambios' : 'Registrar Especie'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Especie?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar la especie "{currentEspecie?.esp_nombre_comun}". Esto fallará si existen ventas o pescas de esta especie.
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

export default EspeciesCRUD;
