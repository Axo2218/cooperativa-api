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
    // 2. Estado para guardar el personal de la BD
    const [personalDisponible, setPersonalDisponible] = useState([]);

    // 3. Modificamos la estructura del nuevo tripulante para que maneje el ID real
    const [nuevoTripulante, setNuevoTripulante] = useState({ id_personal: '', nombre: '', rol: 'Marinero Principal' });

    // 4. Disparamos la búsqueda a la base de datos al abrir el componente
    useEffect(() => {
        const cargarPersonal = async () => {
            try {
                const res = await api.get('/catalogos');
                // Aunque la variable del backend se llama 'capitanes', sabemos que contiene a TODO el personal
                setPersonalDisponible(res.data.capitanes || []);
            } catch (error) {
                console.error("Error al cargar el personal de la BD:", error);
            }
        };
        cargarPersonal();
    }, []);

    const agregarTripulante = (e) => {
        e.preventDefault();
        if (!nuevoTripulante.id_personal) return;

        // Evitamos que suban al mismo marinero dos veces al barco
        if (tripulacion.find(t => t.id === nuevoTripulante.id_personal)) {
            alert("¡Este elemento ya se encuentra asignado a la tripulación actual!");
            return;
        }

        setTripulacion([...tripulacion, {
            id: nuevoTripulante.id_personal,
            nombre: nuevoTripulante.nombre,
            rol: nuevoTripulante.rol
        }]);

        // Limpiamos el formulario
        setNuevoTripulante({ id_personal: '', nombre: '', rol: 'Marinero Principal' });
        setMostrarModalTripulacion(false);
    };

    const eliminarTripulante = (id) => {
        if (id === 'cap') return;
        setTripulacion(tripulacion.filter(t => t.id !== id));
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
                                    {tripulante.id !== 'cap' && (
                                        <button onClick={() => eliminarTripulante(tripulante.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Botón dinámico que se bloquea al llegar al límite */}
                        <button
                            onClick={() => setMostrarModalTripulacion(true)}
                            disabled={tripulacionLlena}
                            className={`w-full mt-4 py-3 border border-dashed rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${tripulacionLlena
                                    ? 'border-red-900/50 text-red-500 bg-red-500/5 cursor-not-allowed'
                                    : 'border-zinc-700 text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                        >
                            {tripulacionLlena ? (
                                <><XCircle size={16} /> Capacidad Máxima Alcanzada</>
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
                                <select value={nuevoTripulante.rol} onChange={(e) => setNuevoTripulante({ ...nuevoTripulante, rol: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                                    <option value="Marinero Principal">Marinero Principal</option>
                                    <option value="Motorista">Motorista</option>
                                    <option value="Ayudante">Ayudante</option>
                                    <option value="Buzo">Buzo</option>
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