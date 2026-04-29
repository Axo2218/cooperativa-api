import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';

const PersonalCRUD = () => {
  const [personal, setPersonal] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    per_nombre: '',
    per_apellidos: '',
    per_curp: '',
    per_telefono: '',
    per_contacto_emergencia: '',
    per_estatus: true,
    per_fk_rol: '',
    per_fk_cooperativa: '',
    per_nss: '',
    per_es_socio: false,
    per_numero_socio: '',
    per_certificado_aportacion: '',
    per_auth_uuid: ''
  });

  useEffect(() => {
    fetchPersonal();
    fetchRoles();
    fetchCooperativas();
  }, []);

  const fetchPersonal = async () => {
    try {
      const { data } = await axios.get('/personal');
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      // Si no existe la ruta de roles, lo ideal es crearla. Asumiremos que retorna una lista básica.
      const { data } = await axios.get('/roles').catch(() => ({ data: [
        { rol_id: 1, rol_nombre: 'Capitán' },
        { rol_id: 2, rol_nombre: 'Motorista' },
        { rol_id: 3, rol_nombre: 'Pescador (Marinero)' },
        { rol_id: 4, rol_nombre: 'Personal Administrativo' },
        { rol_id: 5, rol_nombre: 'Almacenista' }
      ]}));
      setRoles(data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
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
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const openModal = (registro = null) => {
    setErrorMsg('');
    if (registro) {
      setCurrentRegistro(registro);
      setFormData({
        per_nombre: registro.per_nombre || '',
        per_apellidos: registro.per_apellidos || '',
        per_curp: registro.per_curp || '',
        per_telefono: registro.per_telefono || '',
        per_contacto_emergencia: registro.per_contacto_emergencia || '',
        per_estatus: registro.per_estatus !== undefined ? registro.per_estatus : true,
        per_fk_rol: registro.per_fk_rol || '',
        per_fk_cooperativa: registro.per_fk_cooperativa || '',
        per_nss: registro.per_nss || '',
        per_es_socio: registro.per_es_socio || false,
        per_numero_socio: registro.per_numero_socio || '',
        per_certificado_aportacion: registro.per_certificado_aportacion || '',
        per_auth_uuid: registro.per_auth_uuid || ''
      });
    } else {
      setCurrentRegistro(null);
      setFormData({
        per_nombre: '',
        per_apellidos: '',
        per_curp: '',
        per_telefono: '',
        per_contacto_emergencia: '',
        per_estatus: true,
        per_fk_rol: '',
        per_fk_cooperativa: '',
        per_nss: '',
        per_es_socio: false,
        per_numero_socio: '',
        per_certificado_aportacion: '',
        per_auth_uuid: ''
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
      
      // Limpiar campos de socio si no es socio
      if (!dataToSubmit.per_es_socio) {
        dataToSubmit.per_numero_socio = null;
        dataToSubmit.per_certificado_aportacion = null;
      }

      if (currentRegistro) {
        await axios.put(`/personal/${currentRegistro.per_id}`, dataToSubmit);
      } else {
        await axios.post('/personal', dataToSubmit);
      }
      fetchPersonal();
      closeModal();
    } catch (error) {
      console.error('Error al guardar personal:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al guardar.');
    }
  };

  const handleDelete = async () => {
    setErrorMsg('');
    try {
      await axios.delete(`/personal/${currentRegistro.per_id}`);
      fetchPersonal();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar personal:', error);
      setErrorMsg(error.response?.data?.error || 'Ocurrió un error inesperado al eliminar.');
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Directorio de Personal y Socios</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            Registrar Personal
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Nombre Completo</th>
                  <th className="p-4 font-semibold">Rol</th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold text-center">Es Socio</th>
                  <th className="p-4 font-semibold text-center">Estatus</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {personal.map((reg) => (
                  <tr key={reg.per_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500">#{reg.per_id}</td>
                    <td className="p-4 text-white font-medium">
                      {reg.per_nombre} {reg.per_apellidos}
                      <span className="block text-xs text-zinc-500 mt-1">Tel: {reg.per_telefono || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">{reg.rol_nombre || 'N/A'}</td>
                    <td className="p-4 text-sm text-zinc-300">{reg.coop_nombre || 'N/A'}</td>
                    <td className="p-4 text-center">
                      {reg.per_es_socio ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-full">
                          Socio
                        </span>
                      ) : (
                        <span className="inline-flex text-xs text-zinc-500">Empleado</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {reg.per_estatus ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle size={16}/> Activo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400"><XCircle size={16}/> Inactivo</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openModal(reg)}
                          className="text-zinc-400 hover:text-emerald-500 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(reg)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {personal.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-zinc-500">
                      No hay registros de personal.
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {currentRegistro ? 'Editar Personal' : 'Registrar Personal'}
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
                
                {/* Datos Personales */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-white mb-3 border-b border-zinc-800 pb-2">Datos Personales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Nombre(s) *</label>
                      <input type="text" name="per_nombre" value={formData.per_nombre} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Apellidos *</label>
                      <input type="text" name="per_apellidos" value={formData.per_apellidos} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">CURP</label>
                      <input type="text" name="per_curp" value={formData.per_curp} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors" maxLength="18" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">NSS (Seguro Social)</label>
                      <input type="text" name="per_nss" value={formData.per_nss} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" maxLength="11" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Teléfono</label>
                      <input type="text" name="per_telefono" value={formData.per_telefono} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Contacto de Emergencia</label>
                      <input type="text" name="per_contacto_emergencia" value={formData.per_contacto_emergencia} onChange={handleInputChange} placeholder="Nombre y teléfono" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Datos Operativos */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-lg font-medium text-white mb-3 border-b border-zinc-800 pb-2">Datos Operativos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Cooperativa *</label>
                      <select name="per_fk_cooperativa" value={formData.per_fk_cooperativa} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                        <option value="">Seleccione una cooperativa...</option>
                        {cooperativas.map(c => (
                          <option key={c.coop_id} value={c.coop_id}>{c.coop_nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Rol Operativo *</label>
                      <select name="per_fk_rol" value={formData.per_fk_rol} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                        <option value="">Seleccione un rol...</option>
                        {roles.map(r => (
                          <option key={r.rol_id} value={r.rol_id}>{r.rol_nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <input type="checkbox" id="per_estatus" name="per_estatus" checked={formData.per_estatus} onChange={handleInputChange} className="w-5 h-5 accent-emerald-500 rounded bg-zinc-800 border-zinc-700" />
                      <label htmlFor="per_estatus" className="text-sm font-medium text-zinc-300 cursor-pointer">Personal Activo</label>
                    </div>
                  </div>
                </div>

                {/* Zona de Socios */}
                <div className="md:col-span-2 mt-2 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <input type="checkbox" id="per_es_socio" name="per_es_socio" checked={formData.per_es_socio} onChange={handleInputChange} className="w-5 h-5 accent-blue-500 rounded bg-zinc-800 border-zinc-700" />
                    <label htmlFor="per_es_socio" className="text-base font-bold text-blue-400 cursor-pointer">Es Socio Cooperativista</label>
                  </div>
                  
                  {formData.per_es_socio && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-300">Número de Socio *</label>
                        <input type="text" name="per_numero_socio" value={formData.per_numero_socio} onChange={handleInputChange} required={formData.per_es_socio} placeholder="Ej. SOC-001" className="w-full bg-zinc-800/80 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-blue-300">Certificado de Aportación</label>
                        <input type="text" name="per_certificado_aportacion" value={formData.per_certificado_aportacion} onChange={handleInputChange} placeholder="Ej. CERT-2023-01" className="w-full bg-zinc-800/80 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                    </div>
                  )}
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
                  {currentRegistro ? 'Guardar Cambios' : 'Registrar Personal'}
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
              Estás a punto de eliminar el registro de este elemento del personal. Esto puede afectar históricos de viajes.
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

export default PersonalCRUD;
