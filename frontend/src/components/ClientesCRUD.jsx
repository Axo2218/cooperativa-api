import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Users } from 'lucide-react';

const ClientesCRUD = () => {
  const [clientes, setClientes] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    cli_nombre: '',
    cli_rfc: '',
    cli_tipo: 'Mayoreo',
    cli_telefono: '',
    cli_direccion: '',
    cli_fk_cooperativa: ''
  });

  useEffect(() => {
    fetchClientes();
    fetchCooperativas();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data } = await axios.get('/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

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

  const openModal = (cliente = null) => {
    setErrorMsg('');
    if (cliente) {
      setCurrentCliente(cliente);
      setFormData({
        cli_nombre: cliente.cli_nombre || '',
        cli_rfc: cliente.cli_rfc || '',
        cli_tipo: cliente.cli_tipo || 'Mayoreo',
        cli_telefono: cliente.cli_telefono || '',
        cli_direccion: cliente.cli_direccion || '',
        cli_fk_cooperativa: cliente.cli_fk_cooperativa || ''
      });
    } else {
      setCurrentCliente(null);
      setFormData({
        cli_nombre: '',
        cli_rfc: '',
        cli_tipo: 'Mayoreo',
        cli_telefono: '',
        cli_direccion: '',
        cli_fk_cooperativa: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCliente(null);
    setErrorMsg('');
  };

  const confirmDelete = (cliente) => {
    setCurrentCliente(cliente);
    setErrorMsg('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentCliente(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (currentCliente) {
        await axios.put(`/clientes/${currentCliente.cli_id}`, formData);
      } else {
        await axios.post('/clientes', formData);
      }
      fetchClientes();
      closeModal();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/clientes/${currentCliente.cli_id}`);
      fetchClientes();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  const getTipoStyle = (tipo) => {
    return tipo === 'Mayoreo' 
      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Directorio de Clientes</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre/Razón Social</th>
                  <th className="p-4 font-semibold">RFC</th>
                  <th className="p-4 font-semibold">Tipo</th>
                  <th className="p-4 font-semibold">Teléfono</th>
                  <th className="p-4 font-semibold">Cooperativa Asociada</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {clientes.map((cliente) => (
                  <tr key={cliente.cli_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{cliente.cli_id}</td>
                    <td className="p-4 text-white font-medium">{cliente.cli_nombre}</td>
                    <td className="p-4 font-mono text-sm">{cliente.cli_rfc || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTipoStyle(cliente.cli_tipo)}`}>
                        {cliente.cli_tipo}
                      </span>
                    </td>
                    <td className="p-4">{cliente.cli_telefono || 'N/A'}</td>
                    <td className="p-4">{cliente.coop_nombre || `ID: ${cliente.cli_fk_cooperativa}`}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(cliente)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(cliente)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay clientes registrados en el sistema.
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
                {currentCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                  <label className="text-sm font-medium text-zinc-300">Nombre o Razón Social *</label>
                  <input
                    type="text"
                    name="cli_nombre"
                    value={formData.cli_nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Distribuidora de Mariscos del Pacífico S.A."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">RFC</label>
                  <input
                    type="text"
                    name="cli_rfc"
                    value={formData.cli_rfc}
                    onChange={handleInputChange}
                    maxLength="13"
                    placeholder="Ej. XAXX010101000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Teléfono</label>
                  <input
                    type="text"
                    name="cli_telefono"
                    value={formData.cli_telefono}
                    onChange={handleInputChange}
                    placeholder="Ej. 555-123-4567"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Cliente *</label>
                  <select
                    name="cli_tipo"
                    value={formData.cli_tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Mayoreo">Mayoreo</option>
                    <option value="Menudeo">Menudeo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">Cooperativa *</label>
                  <select
                    name="cli_fk_cooperativa"
                    value={formData.cli_fk_cooperativa}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Seleccione cooperativa...</option>
                    {cooperativas.map(c => (
                      <option key={c.coop_id} value={c.coop_id}>{c.coop_nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Dirección</label>
                  <textarea
                    name="cli_direccion"
                    value={formData.cli_direccion}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Domicilio completo..."
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
                  {currentCliente ? 'Guardar Cambios' : 'Crear Cliente'}
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
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Cliente?</h3>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar al cliente "{currentCliente?.cli_nombre}".
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

export default ClientesCRUD;
