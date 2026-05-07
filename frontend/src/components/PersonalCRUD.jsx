import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle, Users, CheckCircle, XCircle, ArrowUpDown, Filter, Eye, Calendar, DollarSign, Briefcase, Ship, Loader2, Home } from 'lucide-react';

const PersonalCRUD = () => {
  const [personal, setPersonal] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editRoleValue, setEditRoleValue] = useState('');
  const [editSalaryValue, setEditSalaryValue] = useState('');
  
  // Estados para ordenamiento
  const [sortConfig, setSortConfig] = useState({ key: 'per_id', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  
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
    per_auth_uuid: '',
    per_salario_base: 7468
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
        per_auth_uuid: registro.per_auth_uuid || '',
        per_salario_base: registro.per_salario_base || 7468
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
        per_auth_uuid: '',
        per_salario_base: 7468
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

  const openDetailsModal = async (registro) => {
    setCurrentRegistro(registro);
    setIsLoadingDetails(true);
    setIsDetailsModalOpen(true);
    try {
      const { data } = await axios.get(`/personal/detalles/${registro.per_id}`);
      setDetailsData(data);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setErrorMsg('No se pudieron cargar los detalles del personal.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setDetailsData(null);
    setCurrentRegistro(null);
  };

  const handleSaveRoleSalary = async () => {
    try {
      const dataToSubmit = { 
        ...detailsData.personal,
        per_fk_rol: editRoleValue || detailsData.personal.per_fk_rol,
        per_salario_base: editSalaryValue !== '' ? editSalaryValue : detailsData.personal.per_salario_base
      };
      
      await axios.put(`/personal/${currentRegistro.per_id}`, dataToSubmit);
      
      // Update local state to reflect changes without reloading the whole modal
      const { data } = await axios.get(`/personal/detalles/${currentRegistro.per_id}`);
      setDetailsData(data);
      fetchPersonal(); // refresh the background list
      setIsEditingRole(false);
    } catch (error) {
      console.error('Error al actualizar rol y salario:', error);
      setErrorMsg('No se pudo actualizar el rol y salario.');
    }
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredPersonal = () => {
    let filtered = [...personal];
    
    // Filtro de búsqueda (opcional pero muy útil)
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.per_nombre.toLowerCase().includes(lowSearch) || 
        p.per_apellidos.toLowerCase().includes(lowSearch) ||
        (p.rol_nombre && p.rol_nombre.toLowerCase().includes(lowSearch))
      );
    }

    return filtered.sort((a, b) => {
      let valA, valB;
      
      switch(sortConfig.key) {
        case 'nombre':
          valA = a.per_nombre.toLowerCase();
          valB = b.per_nombre.toLowerCase();
          break;
        case 'apellido':
          valA = a.per_apellidos.toLowerCase();
          valB = b.per_apellidos.toLowerCase();
          break;
        case 'socio':
          valA = a.per_es_socio ? 1 : 0;
          valB = b.per_es_socio ? 1 : 0;
          break;
        case 'rol':
          valA = (a.rol_nombre || '').toLowerCase();
          valB = (b.rol_nombre || '').toLowerCase();
          break;
        case 'estatus':
          valA = a.per_estatus ? 1 : 0;
          valB = b.per_estatus ? 1 : 0;
          break;
        case 'per_id':
        default:
          valA = a.per_id;
          valB = b.per_id;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const currentSortedPersonal = getSortedAndFilteredPersonal();

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">Directorio de Personal y Socios</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Buscador Rápido */}
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Buscar por nombre o rol..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-zinc-800 border border-zinc-700 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Filter className="absolute right-3 top-2.5 text-zinc-500" size={16} />
            </div>

            {/* Selector de Ordenamiento */}
            <select 
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-');
                setSortConfig({ key, direction });
              }}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="per_id-desc">ID (Más reciente)</option>
              <option value="per_id-asc">ID (Más antiguo)</option>
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="apellido-asc">Apellido (A-Z)</option>
              <option value="apellido-desc">Apellido (Z-A)</option>
              <option value="rol-asc">Rol (A-Z)</option>
              <option value="socio-desc">Socios primero</option>
              <option value="estatus-desc">Activos primero</option>
            </select>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              <Plus size={18} />
              Registrar Personal
            </button>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/80 text-zinc-300 border-b border-zinc-700">
                  <th className="p-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('per_id')}>
                    <div className="flex items-center gap-1">ID <ArrowUpDown size={12}/></div>
                  </th>
                  <th className="p-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('nombre')}>
                    <div className="flex items-center gap-1">Nombre Completo <ArrowUpDown size={12}/></div>
                  </th>
                  <th className="p-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('rol')}>
                    <div className="flex items-center gap-1">Rol <ArrowUpDown size={12}/></div>
                  </th>
                  <th className="p-4 font-semibold">Cooperativa</th>
                  <th className="p-4 font-semibold text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('socio')}>
                    <div className="flex items-center justify-center gap-1">Es Socio <ArrowUpDown size={12}/></div>
                  </th>
                  <th className="p-4 font-semibold text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('estatus')}>
                    <div className="flex items-center justify-center gap-1">Estatus <ArrowUpDown size={12}/></div>
                  </th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {currentSortedPersonal.map((reg) => (
                  <tr key={reg.per_id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-zinc-500 font-mono">#{reg.per_id}</td>
                    <td className="p-4 text-white font-medium">
                      {reg.per_nombre} {reg.per_apellidos}
                      <span className="block text-xs text-zinc-500 mt-1 font-mono">Tel: {reg.per_telefono || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{reg.rol_nombre || 'N/A'}</td>
                    <td className="p-4 text-sm text-zinc-400">{reg.coop_nombre || 'N/A'}</td>
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
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium"><CheckCircle size={14}/> Activo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium"><XCircle size={14}/> Inactivo</span>
                      )}
                    </td>
                     <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openDetailsModal(reg)}
                          className="text-zinc-400 hover:text-blue-400 transition-colors p-1"
                          title="Ver Detalles"
                        >
                          <Eye size={18} />
                        </button>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5 flex flex-col">
            <div className="relative p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800 shrink-0">
                <div className="flex justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                            <Users size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase">{currentRegistro ? 'Editar' : 'Registrar'} <span className="text-blue-500">Personal</span></h3>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1">Gestión de RRHH</p>
                        </div>
                    </div>
                    <button 
                        onClick={closeModal} 
                        className="text-zinc-500 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-xl group"
                    >
                        <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              
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
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-300">Salario Mensual Base (MXN) *</label>
                      <input type="number" name="per_salario_base" value={formData.per_salario_base} onChange={handleInputChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
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

       {/* Modal Detalles Completos (Expediente Digital) */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center z-[150] p-4 overflow-y-auto pt-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden mb-12 animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5">
            
            {/* Header del Expediente */}
            <div className="relative p-8 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                    <Users size={36} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Expediente de <span className="text-blue-500">Personal</span></h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${detailsData?.personal.per_estatus ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`}></span>
                        <p className="text-[10px] text-zinc-300 uppercase font-black tracking-widest">{detailsData?.personal.per_estatus ? 'Perfil Activo' : 'Perfil Inactivo'}</p>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">Nómina Integrada</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeDetailsModal} 
                  className="text-zinc-500 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 p-3 rounded-2xl group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[600px]">
              
              {/* Lateral Izquierdo: Perfil y Estadísticas */}
              <div className="lg:w-80 bg-zinc-950/30 border-r border-zinc-800/50 p-8 space-y-8">
                
                {/* Info de Identidad */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Nombre del Colaborador</label>
                    <p className="text-xl font-bold text-white leading-tight">{detailsData?.personal.per_nombre} {detailsData?.personal.per_apellidos}</p>
                  </div>
                  
                  <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-4">
                    <div className="flex items-start justify-between gap-3 relative group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mt-1">
                          <Briefcase size={16} />
                        </div>
                        <div className="flex-1">
                          {isEditingRole ? (
                            <div className="space-y-3 bg-zinc-950 p-3 rounded-lg border border-emerald-500/30">
                              <div>
                                <label className="text-[9px] text-zinc-500 uppercase font-bold mb-1 block">Puesto / Rol</label>
                                <select 
                                  value={editRoleValue || detailsData?.personal.per_fk_rol || ''}
                                  onChange={(e) => setEditRoleValue(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded text-xs text-white p-1 focus:outline-none focus:border-emerald-500"
                                >
                                  {roles.map(r => (
                                    <option key={r.rol_id} value={r.rol_id}>{r.rol_nombre}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] text-zinc-500 uppercase font-bold mb-1 block">Salario Base (MXN)</label>
                                <input 
                                  type="number"
                                  value={editSalaryValue !== '' ? editSalaryValue : detailsData?.personal.per_salario_base || ''}
                                  onChange={(e) => setEditSalaryValue(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded text-xs text-white p-1 focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditingRole(false)} className="text-[9px] text-zinc-400 hover:text-white px-2 py-1 rounded border border-zinc-700 bg-zinc-800">Cancelar</button>
                                <button onClick={handleSaveRoleSalary} className="text-[9px] text-white px-2 py-1 rounded border border-emerald-500/50 bg-emerald-600 hover:bg-emerald-500">Guardar</button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[9px] text-zinc-500 uppercase font-bold">Puesto / Rol Actual</p>
                              <p className="text-sm font-black text-white uppercase">{detailsData?.personal.rol_nombre}</p>
                              <p className="text-[10px] text-emerald-400 font-bold mt-1 tracking-wider">Salario Base: ${parseFloat(detailsData?.personal.per_salario_base || 0).toLocaleString()} MXN</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {!isEditingRole && (
                        <button 
                          onClick={() => {
                            setEditRoleValue(detailsData?.personal.per_fk_rol);
                            setEditSalaryValue(detailsData?.personal.per_salario_base);
                            setIsEditingRole(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg absolute right-0 top-0"
                          title="Editar Rol y Salario"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Home size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Cooperativa Origen</p>
                        <p className="text-xs font-bold text-zinc-300">{detailsData?.personal.coop_nombre}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacto y Emergencia */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Información de Contacto</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold">Teléfono Personal</p>
                      <p className="text-xs text-zinc-300 font-bold">{detailsData?.personal.per_telefono || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold">Contacto de Emergencia</p>
                      <p className="text-xs text-zinc-300 font-medium leading-relaxed">{detailsData?.personal.per_contacto_emergencia || 'No registrado'}</p>
                    </div>
                  </div>
                </div>

                {/* Resumen Financiero Destacado */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-6 rounded-[2rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={14} className="text-emerald-500" />
                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Saldo Acumulado</h3>
                  </div>
                  <p className="text-4xl font-black text-white tracking-tighter">
                    ${parseFloat(detailsData?.estadisticas.total_acumulado || 0).toLocaleString()}
                  </p>
                  <div className="mt-4 pt-4 border-t border-emerald-500/10 flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Viajes Liquidados</span>
                    <span className="text-white font-black bg-zinc-900 px-2.5 py-1 rounded-lg">{detailsData?.estadisticas.viajes_pagados || 0}</span>
                  </div>
                </div>

                {/* Info Legal/Socio */}
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 space-y-3">
                      <div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold">CURP</p>
                        <p className="text-[11px] font-mono text-zinc-300 tracking-tighter">{detailsData?.personal.per_curp || 'NO REGISTRADO'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold">Número de Seguridad Social (NSS)</p>
                        <p className="text-[11px] font-mono text-zinc-300 tracking-tighter">{detailsData?.personal.per_nss || 'NO REGISTRADO'}</p>
                      </div>
                    </div>
                    {detailsData?.personal.per_es_socio && (
                      <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/20">
                        <p className="text-[9px] text-blue-400 uppercase font-black mb-1">Status de Socio</p>
                        <p className="text-xs font-bold text-white"># {detailsData?.personal.per_numero_socio}</p>
                        <p className="text-[9px] text-zinc-500 mt-1">Cert: {detailsData?.personal.per_certificado_aportacion || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Área Principal: Historial Detallado */}
              <div className="flex-1 p-8 bg-zinc-900/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white flex items-center gap-4 tracking-tight">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    Cronología de Actividades
                  </h3>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800">
                    Últimas 50 Bitácoras
                  </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar scroll-smooth">
                  {isLoadingDetails ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-blue-500" size={48} />
                      <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Consultando Archivos...</p>
                    </div>
                  ) : detailsData?.viajes.length > 0 ? detailsData.viajes.map((viaje) => (
                    <div key={viaje.via_id} className="group bg-zinc-950 p-6 rounded-[2rem] border border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-900 transition-all duration-300 relative">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-blue-500 group-hover:bg-blue-500/5 transition-all duration-300">
                            <Ship size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-black text-white tracking-tight">Viaje #{viaje.via_id}</h4>
                              <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border ${
                                viaje.via_estatus === 'Completado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                              }`}>
                                {viaje.via_estatus}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-bold">
                                <Calendar size={12} className="text-zinc-700" />
                                {new Date(viaje.via_fecha_salida).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </span>
                              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                                <Briefcase size={10} className="text-blue-500" />
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{viaje.rol_en_viaje}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-right min-w-[140px] group-hover:bg-zinc-950 transition-colors">
                          <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1.5">Remuneración</p>
                          <p className="text-xl font-black text-white group-hover:text-emerald-500 transition-colors">
                            {viaje.pag_monto_recibido ? `$${parseFloat(viaje.pag_monto_recibido).toLocaleString()}` : <span className="text-zinc-700 font-normal italic opacity-50">Pendiente</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-24 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
                      <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-800">
                        <Users size={32} />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Sin actividad histórica</h4>
                      <p className="text-zinc-600 max-w-xs mx-auto text-sm leading-relaxed">Este colaborador no ha participado en bitácoras de viaje registradas en el sistema hasta el momento.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer con Acción */}
            <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={closeDetailsModal} 
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-black px-12 py-4 rounded-2xl transition-all active:scale-95 shadow-xl uppercase text-xs tracking-widest"
              >
                Cerrar Expediente
              </button>
            </div>
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
