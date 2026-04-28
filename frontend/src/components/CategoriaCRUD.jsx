import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Layers } from 'lucide-react';

const CategoriaCRUD = () => {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    cat_nombre: '',
    cat_descripcion: ''
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get('/categoria-insumo').catch(() => axios.get('/categoria'));
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
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
        cat_nombre: registro.cat_nombre || '',
        cat_descripcion: registro.cat_descripcion || ''
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        cat_nombre: '',
        cat_descripcion: ''
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
        await axios.put(`/categoria-insumo/${currentRegistro.cat_id}`, formData).catch(() => axios.put(`/categoria/${currentRegistro.cat_id}`, formData));
      } else {
        await axios.post('/categoria-insumo', formData).catch(() => axios.post('/categoria', formData));
      }
      fetchCategorias();
      closeModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/categoria-insumo/${currentRegistro.cat_id}`).catch(() => axios.delete(`/categoria/${currentRegistro.cat_id}`));
      fetchCategorias();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar. Asegúrese de que no haya insumos usando esta categoría.');
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Layers className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Catálogo de Categorías de Insumo</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Nombre de Categoría</th>
                  <th className="p-4 font-semibold">Descripción</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {categorias.map((reg) => (
                  <tr key={reg.cat_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.cat_id}</td>
                    <td className="p-4 text-white font-medium">{reg.cat_nombre}</td>
                    <td className="p-4 text-zinc-400">{reg.cat_descripcion || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar Categoría"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar Categoría"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-zinc-500">
                      No hay categorías registradas.
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="text-emerald-500" size={24}/>
                {currentRegistro ? 'Editar Categoría' : 'Nueva Categoría'}
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

              <div className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Nombre de la Categoría *</label>
                  <input
                    type="text"
                    name="cat_nombre"
                    value={formData.cat_nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Descripción</label>
                  <textarea
                    name="cat_descripcion"
                    value={formData.cat_descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Categoría?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar esta categoría. No podrás hacerlo si hay insumos que dependan de ella.
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

export default CategoriaCRUD;
