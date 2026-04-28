import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Building2 } from 'lucide-react';

const CatTipoInstalacionCRUD = () => {
  const [tiposInstalacion, setTiposInstalacion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTipo, setCurrentTipo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    tip_inst_nombre: ''
  });

  useEffect(() => {
    fetchTiposInstalacion();
  }, []);

  const fetchTiposInstalacion = async () => {
    try {
      const { data } = await axios.get('/cat-tipo-instalacion');
      setTiposInstalacion(data);
    } catch (error) {
      console.error('Error al cargar tipos de instalación:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (tipo = null) => {
    setErrorMsg('');
    if (tipo) {
      setCurrentTipo(tipo);
      setFormData({
        tip_inst_nombre: tipo.tip_inst_nombre || ''
      });
    } else {
      setCurrentTipo(null);
      setFormData({
        tip_inst_nombre: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTipo(null);
    setErrorMsg('');
  };

  const confirmDelete = (tipo) => {
    setCurrentTipo(tipo);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentTipo(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentTipo) {
        await axios.put(`/cat-tipo-instalacion/${currentTipo.tip_inst_id}`, formData);
      } else {
        await axios.post('/cat-tipo-instalacion', formData);
      }
      fetchTiposInstalacion();
      closeModal();
    } catch (error) {
      console.error('Error al guardar tipo de instalación:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Ocurrió un error inesperado al guardar.');
      }
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/cat-tipo-instalacion/${currentTipo.tip_inst_id}`);
      fetchTiposInstalacion();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar tipo de instalación:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('Ocurrió un error inesperado al eliminar.');
      }
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Catálogo: Tipos de Instalación</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Tipo
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold w-24">ID</th>
                  <th className="p-4 font-semibold">Nombre del Tipo de Instalación</th>
                  <th className="p-4 font-semibold text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tiposInstalacion.map((tipo) => (
                  <tr key={tipo.tip_inst_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{tipo.tip_inst_id}</td>
                    <td className="p-4 text-white font-medium">{tipo.tip_inst_nombre}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(tipo)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(tipo)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tiposInstalacion.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-zinc-500">
                      No hay tipos de instalación registrados.
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentTipo ? 'Editar Tipo de Instalación' : 'Nuevo Tipo de Instalación'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre *</label>
                  <input
                    type="text"
                    name="tip_inst_nombre"
                    value={formData.tip_inst_nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Centro de Acopio..."
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
                  {currentTipo ? 'Guardar Cambios' : 'Crear Tipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Tipo?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar el tipo "{currentTipo?.tip_inst_nombre}".
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

export default CatTipoInstalacionCRUD;
