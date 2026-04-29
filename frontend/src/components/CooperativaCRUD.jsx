import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Building } from 'lucide-react';

const CooperativaCRUD = () => {
  const [cooperativas, setCooperativas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCooperativa, setCurrentCooperativa] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    coop_nombre: '',
    coop_rfc: '',
    coop_fecha_constitucion: '',
    coop_direccion_oficina: '',
    coop_telefono: '',
    coop_correo: ''
  });

  useEffect(() => {
    fetchCooperativas();
  }, []);

  const fetchCooperativas = async () => {
    try {
      const { data } = await axios.get('/cooperativas');
      setCooperativas(data);
    } catch (error) {
      console.error('Error al cargar cooperativas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (cooperativa = null) => {
    setErrorMsg('');
    if (cooperativa) {
      setCurrentCooperativa(cooperativa);
      setFormData({
        coop_nombre: cooperativa.coop_nombre || '',
        coop_rfc: cooperativa.coop_rfc || '',
        coop_fecha_constitucion: cooperativa.coop_fecha_constitucion ? cooperativa.coop_fecha_constitucion.split('T')[0] : '',
        coop_direccion_oficina: cooperativa.coop_direccion_oficina || '',
        coop_telefono: cooperativa.coop_telefono || '',
        coop_correo: cooperativa.coop_correo || ''
      });
    } else {
      setCurrentCooperativa(null);
      setFormData({
        coop_nombre: '',
        coop_rfc: '',
        coop_fecha_constitucion: '',
        coop_direccion_oficina: '',
        coop_telefono: '',
        coop_correo: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCooperativa(null);
    setErrorMsg('');
  };

  const confirmDelete = (cooperativa) => {
    setCurrentCooperativa(cooperativa);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentCooperativa(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.coop_fecha_constitucion) dataToSubmit.coop_fecha_constitucion = null;

      if (currentCooperativa) {
        await axios.put(`/cooperativas/${currentCooperativa.coop_id}`, dataToSubmit);
      } else {
        await axios.post('/cooperativas', dataToSubmit);
      }
      fetchCooperativas();
      closeModal();
    } catch (error) {
      console.error('Error al guardar cooperativa:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/cooperativas/${currentCooperativa.coop_id}`);
      fetchCooperativas();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar cooperativa:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Building className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Gestión de Cooperativas</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Cooperativa
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre de la Cooperativa</th>
                  <th className="p-4 font-semibold">RFC</th>
                  <th className="p-4 font-semibold">Fecha Constitución</th>
                  <th className="p-4 font-semibold">Teléfono</th>
                  <th className="p-4 font-semibold">Correo</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {cooperativas.map((coop) => (
                  <tr key={coop.coop_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{coop.coop_id}</td>
                    <td className="p-4 text-white font-medium">{coop.coop_nombre}</td>
                    <td className="p-4 font-mono text-sm">{coop.coop_rfc}</td>
                    <td className="p-4">
                      {coop.coop_fecha_constitucion ? new Date(coop.coop_fecha_constitucion).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">{coop.coop_telefono || 'N/A'}</td>
                    <td className="p-4">{coop.coop_correo || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(coop)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(coop)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cooperativas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay cooperativas registradas.
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
                {currentCooperativa ? 'Editar Cooperativa' : 'Nueva Cooperativa'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre de la Cooperativa *</label>
                  <input
                    type="text"
                    name="coop_nombre"
                    value={formData.coop_nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. S.C.P.P. Pescadores de la Bahía"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">RFC *</label>
                  <input
                    type="text"
                    name="coop_rfc"
                    value={formData.coop_rfc}
                    onChange={handleInputChange}
                    required
                    maxLength="13"
                    placeholder="Ej. XAXX010101000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Fecha de Constitución</label>
                  <input
                    type="date"
                    name="coop_fecha_constitucion"
                    value={formData.coop_fecha_constitucion}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Teléfono</label>
                  <input
                    type="text"
                    name="coop_telefono"
                    value={formData.coop_telefono}
                    onChange={handleInputChange}
                    placeholder="Ej. 555-123-4567"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Correo Electrónico</label>
                  <input
                    type="email"
                    name="coop_correo"
                    value={formData.coop_correo}
                    onChange={handleInputChange}
                    placeholder="Ej. contacto@cooperativa.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Dirección de Oficina</label>
                  <textarea
                    name="coop_direccion_oficina"
                    value={formData.coop_direccion_oficina}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Domicilio de la cooperativa..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
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
                  {currentCooperativa ? 'Guardar Cambios' : 'Registrar Cooperativa'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Cooperativa?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar a la cooperativa "{currentCooperativa?.coop_nombre}". Esta acción puede fallar si existen registros dependientes (socios, activos, clientes, etc.).
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

export default CooperativaCRUD;
