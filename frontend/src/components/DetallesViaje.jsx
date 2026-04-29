import React, { useState, useEffect } from 'react';
import { ArrowLeft, Anchor, User, Map, DollarSign, Ship, MapPin, CheckCircle, XCircle, Users, Plus, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// 1. Importamos nuestra conexión a la API
import api from '../services/api';

const DetallesViaje = ({ viaje, volver }) => {
    // --- ESTADOS DE TRIPULACIÓN Y CATÁLOGO ---
    const [tripulacion, setTripulacion] = useState([
        { id: 'cap', nombre: viaje.capitan, rol: 'Capitán (Líder)' }
    ]);
    const [mostrarModalTripulacion, setMostrarModalTripulacion] = useState(false);
    // Si la BD aún no manda el dato, le ponemos 5 de límite temporalmente para que no truene
    const capacidadMaxima = viaje.capacidad || 5;

    // Verificamos si el barco ya llegó a su límite
    const tripulacionLlena = tripulacion.length >= capacidadMaxima;
    const [personalDisponible, setPersonalDisponible] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoadingTripulacion, setIsLoadingTripulacion] = useState(true);

    const [nuevoTripulante, setNuevoTripulante] = useState({ id_personal: '', nombre: '', rol_id: '', rol_nombre: '' });
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Cargar tripulación actual del viaje
                let tripDB = [];
                try {
                    const resTrip = await api.get(`/viajes-personal/viaje/${viaje.via_id}`);
                    tripDB = resTrip.data.map(t => ({
                        id: t.via_per_fk_personal,
                        via_per_id: t.via_per_id, // ID del registro en viaje_personal
                        nombre: t.personal_nombre,
                        rol: t.rol_nombre,
                        rol_id: t.via_per_fk_rol
                    }));
                } catch (e) { console.error("Error al cargar tripulacion del viaje:", e); }

                // Mantener al capitán
                const tripulacionInicial = [{ id: 'cap', nombre: viaje.capitan, rol: 'Capitán (Líder)' }, ...tripDB];
                setTripulacion(tripulacionInicial);

                // 2. Cargar Personal Disponible (Excluyendo ocupados)
                let personalMapeado = [];
                try {
                    const resPers = await api.get('/personal');
                    let ocupados = new Set();

                    try {
                        const resAllViajes = await api.get('/viajes').catch(() => api.get('/viaje'));
                        const viajesActivos = resAllViajes.data.filter(v => ['Pendiente', 'En Preparación', 'En Curso'].includes(v.via_estatus) && v.via_id !== viaje.via_id);
                        viajesActivos.forEach(v => ocupados.add(v.via_fk_capitan));
                    } catch (e) { console.error("Error al cargar viajes:", e); }

                    try {
                        const resAllTrip = await api.get('/viajes-personal');
                        resAllTrip.data
                            .filter(t => ['Pendiente', 'En Preparación', 'En Curso'].includes(t.via_estatus) && t.via_per_fk_viaje !== viaje.via_id)
                            .forEach(t => ocupados.add(t.via_per_fk_personal));
                    } catch (e) { console.error("Error al cargar toda la tripulación:", e); }

                    personalMapeado = resPers.data
                        .filter(p => !ocupados.has(p.per_id))
                        .map(p => ({
                            per_id: p.per_id,
                            nombre_completo: `${p.per_nombre} ${p.per_apellidos}`
                        }));
                } catch (e) { console.error("Error al cargar personal:", e); }

                setPersonalDisponible(personalMapeado);

                // 3. Cargar Roles
                try {
                    const resRoles = await api.get('/roles');
                    setRoles(resRoles.data);
                } catch (e) { console.error("Error al cargar roles:", e); }

            } catch (error) {
                console.error("Error general en cargarDatos:", error);
            } finally {
                setIsLoadingTripulacion(false);
            }
        };
        cargarDatos();
    }, [viaje.via_id]);

    const agregarTripulante = async (e) => {
        e.preventDefault();
        if (!nuevoTripulante.id_personal || !nuevoTripulante.rol_id) return;

        if (!['Pendiente', 'En Preparación'].includes(viaje.via_estatus)) {
            alert("No se pueden hacer cambios en la tripulación una vez que el viaje ha avanzado de la etapa de Preparación.");
            return;
        }

        if (tripulacion.find(t => t.id === Number(nuevoTripulante.id_personal))) {
            alert("¡Este elemento ya se encuentra asignado a la tripulación actual!");
            return;
        }

        try {
            const res = await api.post('/viajes-personal', {
                via_per_fk_viaje: viaje.via_id,
                via_per_fk_personal: nuevoTripulante.id_personal,
                via_per_fk_rol: nuevoTripulante.rol_id
            });

            setTripulacion([...tripulacion, {
                id: Number(nuevoTripulante.id_personal),
                via_per_id: res.data.via_per_id,
                nombre: nuevoTripulante.nombre,
                rol: nuevoTripulante.rol_nombre,
                rol_id: nuevoTripulante.rol_id
            }]);

            setNuevoTripulante({ id_personal: '', nombre: '', rol_id: '', rol_nombre: '' });
            setMostrarModalTripulacion(false);
        } catch (error) {
            console.error("Error al asignar tripulante:", error);
            alert(error.response?.data?.error || "Error al asignar el tripulante.");
        }
    };

    const eliminarTripulante = async (id, via_per_id) => {
        if (id === 'cap') return;
        if (!['Pendiente', 'En Preparación'].includes(viaje.via_estatus)) {
            alert("No se pueden eliminar tripulantes una vez que el viaje ha avanzado de la etapa de Preparación.");
            return;
        }

        try {
            await api.delete(`/viajes-personal/${via_per_id}`);
            setTripulacion(tripulacion.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error al desembarcar tripulante:", error);
            alert("Error al eliminar el tripulante.");
        }
    };

    // --- DATOS SIMULADOS PARA KPIs ---
    const dataGastos = [
        { name: 'Diésel', Presupuesto: 15000, Real: 14200 },
        { name: 'Hielo', Presupuesto: 5000, Real: 5500 },
        { name: 'Víveres', Presupuesto: 8000, Real: 7800 },
        { name: 'Mantenimiento', Presupuesto: 4000, Real: 2000 },
    ];

    const dataCaptura = [
        { name: 'Robalo', value: 400, color: '#10b981' },
        { name: 'Camarón', value: 300, color: '#f59e0b' },
        { name: 'Mero', value: 300, color: '#3b82f6' },
    ];

    // --- LÓGICA DEL STEPPER ---
    const pasos = [
        { nombre: 'Preparación', icono: <Anchor size={20} /> },
        { nombre: 'En Curso', icono: <Ship size={20} /> },
        { nombre: 'En Puerto', icono: <MapPin size={20} /> },
        { nombre: 'Completado', icono: <CheckCircle size={20} /> }
    ];

    const isCancelado = viaje.via_estatus === 'Cancelado';
    const pasoActual = pasos.findIndex(p => p.nombre.includes(viaje.via_estatus.replace('En ', '')));
    const indexPaso = pasoActual === -1 ? 0 : pasoActual;

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* CABECERA (Se mantiene igual) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-5">
                    <button onClick={volver} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all shadow-lg">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">{viaje.barco}</h2>
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                                Viaje #{viaje.via_id}
                            </span>
                        </div>
                        <p className="text-zinc-500 font-medium mt-1">Bitácora técnica y financiera del zarpe.</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Estatus Operativo</p>
                    <p className={`text-2xl font-bold ${isCancelado ? 'text-red-500' : 'text-emerald-500'}`}>{viaje.via_estatus}</p>
                </div>
            </div>

            {/* STEPPER (Se mantiene igual) */}
            <div className="bg-zinc-950/50 border border-zinc-800 p-10 rounded-2xl mb-10">
                {isCancelado ? (
                    <div className="flex items-center gap-4 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <XCircle size={32} />
                        <div><p className="font-bold">ORDEN DE ABORTO CONFIRMADA</p><p className="text-sm opacity-80">Este viaje ha sido cancelado.</p></div>
                    </div>
                ) : (
                    <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-zinc-800 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1.5 bg-emerald-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: `${(indexPaso / (pasos.length - 1)) * 100}%` }}></div>
                        {pasos.map((paso, index) => {
                            const completado = index <= indexPaso;
                            return (
                                <div key={paso.nombre} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-14 h-14 flex items-center justify-center rounded-full border-4 border-zinc-900 transition-all duration-500 ${completado ? 'bg-emerald-500 text-white scale-110 shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}>{paso.icono}</div>
                                    <span className={`mt-4 text-xs font-bold uppercase tracking-tighter ${completado ? 'text-emerald-500' : 'text-zinc-600'}`}>{paso.nombre}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* GRID DE KPIs Y TRIPULACIÓN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: GRÁFICOS Y KPIs (Se mantiene igual) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
                            <div><p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Presupuesto Asignado</p><p className="text-3xl font-bold text-white">${viaje.via_presupuesto_estimado}</p></div>
                            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><DollarSign size={24} /></div>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
                            <div><p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Zona Operativa</p><p className="text-3xl font-bold text-white">Sector #{viaje.via_fk_zona || '01'}</p></div>
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Map size={24} /></div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FileText size={18} className="text-emerald-500" /> Control de Gastos Operativos</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataGastos} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
                                    <Bar dataKey="Presupuesto" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Real" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-zinc-600"></div><span className="text-xs text-zinc-400">Presupuestado</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-zinc-400">Gasto Real</span></div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: TRIPULACIÓN Y CAPTURA */}
                <div className="space-y-6">

                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
                            <div className="flex items-center gap-3 text-emerald-500">
                                <Users size={20} />
                                <h3 className="text-lg font-bold text-white">Tripulación</h3>
                            </div>
                            {/* Contador Dinámico de Capacidad */}
                            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${tripulacionLlena ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                                {tripulacion.length} / {capacidadMaxima} a bordo
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {tripulacion.map((tripulante) => (
                                <div key={tripulante.id} className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tripulante.id === 'cap' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm leading-none mb-1">{tripulante.nombre}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${tripulante.id === 'cap' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                                                {tripulante.rol}
                                            </p>
                                        </div>
                                    </div>
                                    {tripulante.id !== 'cap' && ['Pendiente', 'En Preparación'].includes(viaje.via_estatus) && (
                                        <button onClick={() => eliminarTripulante(tripulante.id, tripulante.via_per_id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" title="Desembarcar">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setMostrarModalTripulacion(true)}
                            disabled={tripulacionLlena || !['Pendiente', 'En Preparación'].includes(viaje.via_estatus)}
                            className={`w-full mt-4 py-3 border border-dashed rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${tripulacionLlena || !['Pendiente', 'En Preparación'].includes(viaje.via_estatus)
                                    ? 'border-zinc-800 text-zinc-600 bg-zinc-900/50 cursor-not-allowed'
                                    : 'border-zinc-700 text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                        >
                            {tripulacionLlena ? (
                                <><XCircle size={16} /> Capacidad Máxima Alcanzada</>
                            ) : !['Pendiente', 'En Preparación'].includes(viaje.via_estatus) ? (
                                <><XCircle size={16} /> Tripulación Cerrada (Viaje en curso)</>
                            ) : (
                                <><Plus size={16} /> Agregar Personal</>
                            )}
                        </button>
                    </div>

                    {/* Gráfica de Dona */}
                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                        <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Pronóstico de Captura (KG)</h3>
                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataCaptura} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                                        {dataCaptura.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. MODAL CON DESPLEGABLE DESDE LA BD */}
            {mostrarModalTripulacion && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm p-6 relative shadow-2xl">
                        <button onClick={() => setMostrarModalTripulacion(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><XCircle size={20} /></button>
                        <h3 className="text-lg font-bold text-white mb-4">Alistar Tripulante</h3>

                        <form onSubmit={agregarTripulante} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Personal Disponible</label>
                                {/* El input de texto ahora es un majestuoso SELECT */}
                                <select
                                    value={nuevoTripulante.id_personal}
                                    onChange={(e) => {
                                        // Buscamos el nombre correspondiente al ID seleccionado para guardarlo
                                        const personaSeleccionada = personalDisponible.find(p => p.per_id.toString() === e.target.value);
                                        setNuevoTripulante({
                                            ...nuevoTripulante,
                                            id_personal: e.target.value,
                                            nombre: personaSeleccionada ? personaSeleccionada.nombre_completo : ''
                                        });
                                    }}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="" disabled>Selecciona un tripulante...</option>
                                    {personalDisponible.map(p => (
                                        <option key={p.per_id} value={p.per_id}>{p.nombre_completo}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Rol a Bordo</label>
                                <select
                                    value={nuevoTripulante.rol_id}
                                    onChange={(e) => {
                                        const rolSeleccionado = roles.find(r => r.rol_id.toString() === e.target.value);
                                        setNuevoTripulante({
                                            ...nuevoTripulante,
                                            rol_id: e.target.value,
                                            rol_nombre: rolSeleccionado ? rolSeleccionado.rol_nombre : ''
                                        });
                                    }}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="" disabled>Selecciona un rol...</option>
                                    {roles.map(r => (
                                        <option key={r.rol_id} value={r.rol_id}>{r.rol_nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2">
                                <Plus size={18} /> Asignar a la embarcación
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetallesViaje;