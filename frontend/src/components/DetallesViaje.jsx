import React, { useState, useEffect } from 'react';
import { ArrowLeft, Anchor, User, Map, DollarSign, Ship, MapPin, CheckCircle, XCircle, Users, Plus, FileText, Fish, TrendingUp, BarChart3, Package, ShoppingCart, AlertCircle, Navigation, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// 1. Importamos nuestra conexión a la API
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal';
import { generateLiquidacionPDF } from '../utils/pdfGenerator';

// Configuración de iconos para Leaflet (evitar errores de Vite)
const shipIcon = new L.DivIcon({
    className: 'custom-ship-marker',
    html: `<div style="background-color: #10b981; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(16,185,129,0.8);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
};

// Formas de zonas para referencia visual en el mini-mapa
const ZONE_SHAPES = {
    1: [[18.53, -92.68], [18.65, -92.55], [18.85, -92.35], [19.15, -92.55], [19.25, -92.85], [19.05, -93.05], [18.75, -92.95], [18.58, -92.75]],
    2: [[19.15, -92.55], [19.45, -92.15], [20.15, -92.45], [20.45, -91.85], [19.85, -91.25], [19.25, -91.65], [19.15, -92.05]],
    3: [[18.35, -93.65], [18.42, -93.45], [18.55, -93.25], [18.85, -93.15], [19.05, -93.45], [18.85, -93.75], [18.55, -93.85]],
    4: [[18.45, -93.25], [18.52, -93.05], [18.65, -92.85], [19.05, -92.75], [19.15, -93.05], [18.85, -93.35], [18.55, -93.45]]
};

// COMPONENTE DE RENDIMIENTO HISTÓRICO REUTILIZABLE (FUERA PARA ESTABILIDAD)
const RendimientoHistorial = ({ isFullWidth, dataHistory }) => (
    <div className={`${isFullWidth ? 'lg:col-span-12' : ''} bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                    <BarChart3 size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Rendimiento Histórico</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Análisis de producción y rentabilidad</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Producción (KG)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ingresos ($)</span>
                </div>
            </div>
        </div>
        <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIng" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="fecha" stroke="#52525b" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#52525b" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '1.5rem', color: '#fff', border: '1px solid #3f3f46', padding: '1rem' }}
                        itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="kilos" name="Captura (Kg)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorKg)" strokeWidth={4} />
                    <Area type="monotone" dataKey="ingresos" name="Ingreso ($)" stroke="#10b981" fillOpacity={1} fill="url(#colorIng)" strokeWidth={4} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const DetallesViaje = ({ viaje: initialViaje, volver }) => {
    const [viaje, setViaje] = useState(initialViaje);
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
    const [especies, setEspecies] = useState([]);
    const [capturas, setCapturas] = useState([]);
    const [nuevaCaptura, setNuevaCaptura] = useState({ especie_id: '', kilogramos: '', precio: '' });
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [mostrarModalLlegada, setMostrarModalLlegada] = useState(false);
    const [datosLlegada, setDatosLlegada] = useState({ 
        fecha: new Date().toISOString().slice(0, 16), 
        observaciones: '',
        via_fk_puerto: ''
    });
    const [dataHistory, setDataHistory] = useState([]);
    const [insumosViaje, setInsumosViaje] = useState([]);
    const [inventarioBodega, setInventarioBodega] = useState([]);
    const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
    const [mostrarModalReconciliacion, setMostrarModalReconciliacion] = useState(false);
    const [cantidadesTemp, setCantidadesTemp] = useState({}); // { ins_id: cantidad }
    const [cantidadesReconciliacion, setCantidadesReconciliacion] = useState({}); // { ins_id: cantidad_a_procesar }
    const [instalaciones, setInstalaciones] = useState([]);

    const [nuevoTripulante, setNuevoTripulante] = useState({ id_personal: '', nombre: '', rol_id: '', rol_nombre: '' });
    const [coordenadas, setCoordenadas] = useState({ 
        lat: viaje.emb_latitud || '', 
        lon: viaje.emb_longitud || '' 
    });
    const [isUpdatingGPS, setIsUpdatingGPS] = useState(false);
    
    // --- ESTADO DE CONFIRMACIÓN CUSTOM ---
    const [confirmConfig, setConfirmConfig] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {}, 
        type: 'warning' 
    });
    
    // --- ESTADOS DE BÚSQUEDA ---
    const [busquedaTripulante, setBusquedaTripulante] = useState('');
    const [busquedaEspecie, setBusquedaEspecie] = useState('');

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
                        rol_id: t.via_per_fk_rol,
                        salario_base: t.per_salario_base,
                        rol_puntos_reparto: t.rol_puntos_reparto,
                        enrolado: t.via_per_enrolado
                    }));
                } catch (e) { console.error("Error al cargar tripulacion del viaje:", e); }

                // Mantener al capitán
                const tripulacionInicial = [{ 
                    id: 'cap', 
                    nombre: viaje.capitan, 
                    rol: 'Capitán (Líder)',
                    salario_base: viaje.capitan_salario_base || 0 
                }, ...tripDB];
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
                        .filter(p => !ocupados.has(p.per_id) && p.per_fk_cooperativa === viaje.emb_fk_cooperativa)
                        .map(p => ({
                            per_id: p.per_id,
                            nombre_completo: `${p.per_nombre} ${p.per_apellidos}`,
                            salario_base: p.per_salario_base || 0,
                            rol_id: p.per_fk_rol
                        }));
                } catch (e) { console.error("Error al cargar personal:", e); }

                setPersonalDisponible(personalMapeado);

                // 3. Cargar Roles
                try {
                    const resRoles = await api.get('/roles');
                    setRoles(resRoles.data);
                } catch (e) { console.error("Error al cargar roles:", e); }

                // 4. Cargar Especies y Capturas
                try {
                    const resEsp = await api.get('/especies');
                    setEspecies(resEsp.data);
                    
                    const resCap = await api.get(`/viajeDetalleCaptura/viaje/${viaje.via_id}`);
                    setCapturas(resCap.data);
                } catch (e) { console.error("Error al cargar capturas/especies:", e); }

                // 5. Cargar Historial de la Embarcación para la gráfica
                try {
                    const resHist = await api.get(`/stats/vessel-history/${viaje.via_fk_embarcacion}`);
                    setDataHistory(resHist.data);
                } catch (e) { console.error("Error al cargar historial del barco:", e); }

                // 6. Cargar Insumos del Viaje
                try {
                    const resIV = await api.get(`/viaje-insumos/viaje/${viaje.via_id}`);
                    setInsumosViaje(resIV.data);
                } catch (e) { console.error("Error al cargar insumos del viaje:", e); }

                // 7. Cargar Inventario de la Bodega de la Cooperativa
                if (viaje.id_bodega) {
                    try {
                        const resInv = await api.get(`/viaje-insumos/bodega/${viaje.id_bodega}`);
                        setInventarioBodega(resInv.data);
                    } catch (e) { console.error("Error al cargar inventario de bodega:", e); }
                }

                // 8. Cargar Instalaciones (Puertos)
                try {
                    const resInst = await api.get('/instalaciones');
                    setInstalaciones(resInst.data);
                } catch (e) { console.error("Error al cargar instalaciones:", e); }

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
            toast.error("No se pueden hacer cambios en la tripulación una vez que el viaje ha avanzado.");
            return;
        }

        if (tripulacion.find(t => t.id === Number(nuevoTripulante.id_personal))) {
            toast.error("¡Este elemento ya se encuentra asignado!");
            return;
        }

        try {
            const res = await api.post('/viajes-personal', {
                via_per_fk_viaje: viaje.via_id,
                via_per_fk_personal: nuevoTripulante.id_personal,
                via_per_fk_rol: nuevoTripulante.rol_id
            });

            const personaSeleccionada = personalDisponible.find(p => p.per_id === Number(nuevoTripulante.id_personal));
            const salarioBase = personaSeleccionada ? parseFloat(personaSeleccionada.salario_base || 0) : 0;

            setTripulacion([...tripulacion, {
                id: Number(nuevoTripulante.id_personal),
                via_per_id: res.data.via_per_id,
                nombre: nuevoTripulante.nombre,
                rol: nuevoTripulante.rol_nombre,
                rol_id: nuevoTripulante.rol_id,
                salario_base: salarioBase
            }]);

            // Lógica para actualizar presupuesto estimado
            if (salarioBase > 0) {
                let diasViaje = 1;
                const fechaSalida = viaje.via_fecha_salida ? new Date(viaje.via_fecha_salida) : new Date();
                const fechaEstimada = viaje.via_fecha_estimada ? new Date(viaje.via_fecha_estimada) : null;
                
                if (fechaEstimada && fechaEstimada > fechaSalida) {
                    diasViaje = Math.max(1, Math.ceil(Math.abs(fechaEstimada - fechaSalida) / (1000 * 60 * 60 * 24)));
                }

                const costoEstimado = (salarioBase / 30) * diasViaje;
                const presupuestoActual = parseFloat(viaje.via_presupuesto_estimado || 0);
                const nuevoPresupuesto = presupuestoActual + costoEstimado;

                console.log(`Calculando presupuesto: ${presupuestoActual} + (${salarioBase}/30 * ${diasViaje}) = ${nuevoPresupuesto}`);

                try {
                    await api.put(`/viajes/${viaje.via_id}`, {
                        ...viaje,
                        via_presupuesto_estimado: nuevoPresupuesto
                    });
                    setViaje(prev => ({ ...prev, via_presupuesto_estimado: nuevoPresupuesto }));
                    toast.success(`Presupuesto actualizado: +$${costoEstimado.toFixed(2)}`);
                } catch (err) {
                    console.error("Error al actualizar el presupuesto:", err);
                    toast.error("El tripulante se asignó pero no se pudo actualizar el presupuesto.");
                }
            }

            setNuevoTripulante({ id_personal: '', nombre: '', rol_id: '', rol_nombre: '' });
            setMostrarModalTripulacion(false);
            toast.success(`${nuevoTripulante.nombre} se ha unido a la tripulación.`);
        } catch (error) {
            console.error("Error al asignar tripulante:", error);
            toast.error(error.response?.data?.error || "Error al asignar el tripulante.");
        }
    };

    const toggleAsistencia = async (id, via_per_id, actualEstado) => {
        if (!['En Preparación'].includes(viaje.via_estatus)) return;
        try {
            await api.put(`/viajes-personal/${via_per_id}`, { via_per_enrolado: !actualEstado });
            setTripulacion(prev => prev.map(t => t.via_per_id === via_per_id ? { ...t, enrolado: !actualEstado } : t));
            if (!actualEstado) {
                toast.success(`Asistencia confirmada.`);
            } else {
                toast.success(`Asistencia removida.`);
            }
        } catch (error) {
            console.error("Error al confirmar asistencia:", error);
            toast.error("Error al actualizar la asistencia.");
        }
    };

    const eliminarTripulante = async (id, via_per_id) => {
        if (id === 'cap') return;
        if (!['Pendiente', 'En Preparación'].includes(viaje.via_estatus)) {
            toast.error("No se pueden eliminar tripulantes una vez que el viaje ha zarpado.");
            return;
        }

        try {
            await api.delete(`/viajes-personal/${via_per_id}`);
            
            // Reajustar presupuesto si tenía salario base
            const tripToRemove = tripulacion.find(t => t.via_per_id === via_per_id);
            if (tripToRemove && parseFloat(tripToRemove.salario_base || 0) > 0) {
                let diasViaje = 1;
                const fechaSalida = viaje.via_fecha_salida ? new Date(viaje.via_fecha_salida) : new Date();
                const fechaEstimada = viaje.via_fecha_estimada ? new Date(viaje.via_fecha_estimada) : null;
                
                if (fechaEstimada && fechaEstimada > fechaSalida) {
                    diasViaje = Math.max(1, Math.ceil(Math.abs(fechaEstimada - fechaSalida) / (1000 * 60 * 60 * 24)));
                }
                
                const costoAhorrado = (parseFloat(tripToRemove.salario_base) / 30) * diasViaje;
                const presupuestoActual = parseFloat(viaje.via_presupuesto_estimado || 0);
                const nuevoPresupuesto = Math.max(0, presupuestoActual - costoAhorrado);
                
                try {
                    await api.put(`/viajes/${viaje.via_id}`, {
                        ...viaje,
                        via_presupuesto_estimado: nuevoPresupuesto
                    });
                    setViaje(prev => ({ ...prev, via_presupuesto_estimado: nuevoPresupuesto }));
                    toast.success(`Presupuesto actualizado: -$${costoAhorrado.toFixed(2)}`);
                } catch (err) {
                    console.error("Error al reajustar el presupuesto:", err);
                }
            }

            setTripulacion(tripulacion.filter(t => t.via_per_id !== via_per_id));
            toast.success("Tripulante retirado del viaje.");
        } catch (error) {
            console.error("Error al retirar al tripulante:", error);
            toast.error("Error al eliminar el tripulante.");
        }
    };

    const registrarCaptura = async (e) => {
        e.preventDefault();
        if (!nuevaCaptura.especie_id || !nuevaCaptura.kilogramos) return;

        try {
            const res = await api.post('/viajeDetalleCaptura', {
                det_cap_fk_viaje: viaje.via_id,
                det_cap_fk_especie: nuevaCaptura.especie_id,
                det_cap_kilogramos: parseFloat(nuevaCaptura.kilogramos),
                det_cap_precio_pactado: parseFloat(nuevaCaptura.precio || 0)
            });

            const esp = especies.find(e => e.esp_id.toString() === nuevaCaptura.especie_id.toString());
            setCapturas([...capturas, {
                ...res.data,
                esp_nombre_comun: esp ? esp.esp_nombre_comun : 'Especie',
                det_cap_subtotal: nuevaCaptura.kilogramos * nuevaCaptura.precio
            }]);
            setNuevaCaptura({ especie_id: '', kilogramos: '', precio: '' });
            toast.success("Captura registrada correctamente.");
        } catch (error) {
            console.error("Error al registrar captura:", error);
            toast.error("Error al registrar la captura.");
        }
    };

    const finalizarViaje = async () => {
        setConfirmConfig({
            isOpen: true,
            title: '¿Finalizar Registro?',
            message: '¿Estás seguro de finalizar el registro y liquidar el viaje? Una vez completado no se podrán agregar más capturas.',
            type: 'warning',
            onConfirm: ejecutarFinalizacion
        });
    };

    const ejecutarFinalizacion = async () => {
        setIsFinalizing(true);
        const loadToast = toast.loading("Liquidando viaje y actualizando inventarios...");
        try {
            const res = await api.put(`/viaje/finalizar/${viaje.via_id}`);
            toast.success("¡Viaje finalizado y liquidado exitosamente!", { id: loadToast });
            setTimeout(() => volver(), 1500); 
        } catch (error) {
            console.error("Error al finalizar viaje:", error);
            toast.error("Ocurrió un error al intentar liquidar el viaje.", { id: loadToast });
        } finally {
            setIsFinalizing(false);
        }
    };

    const eliminarCaptura = async (id) => {
        try {
            await api.delete(`/viajeDetalleCaptura/${id}`);
            setCapturas(capturas.filter(c => c.det_cap_id !== id));
        } catch (error) {
            console.error("Error al eliminar captura:", error);
        }
    };

    const equiparBarco = async () => {
        // Obtenemos IDs de insumos que están en el counter temp O que ya estaban en el barco
        const idsInsumosAfectados = new Set([
            ...Object.keys(cantidadesTemp),
            ...insumosViaje.map(iv => iv.vi_fk_insumo.toString())
        ]);

        try {
            for (const ins_id of idsInsumosAfectados) {
                const nuevaQty = cantidadesTemp[ins_id] || 0;
                const actualEnBarco = parseFloat(insumosViaje.find(iv => iv.vi_fk_insumo.toString() === ins_id.toString())?.vi_cantidad || 0);

                // Solo enviamos si hay un cambio real
                if (nuevaQty !== actualEnBarco) {
                    await api.post('/viaje-insumos', {
                        via_id: viaje.via_id,
                        ins_id,
                        cantidad: nuevaQty,
                        id_bodega: viaje.id_bodega
                    });
                }
            }

            toast.success("¡Equipamiento actualizado y sincronizado!");
            setMostrarModalInsumos(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("Error al equipar:", error);
            toast.error("Ocurrió un error al sincronizar los insumos.");
        }
    };

    const actualizarUbicacion = async (e) => {
        e.preventDefault();
        if (!coordenadas.lat || !coordenadas.lon) return;
        setIsUpdatingGPS(true);
        try {
            await api.patch(`/embarcaciones/coordenadas/${viaje.via_fk_embarcacion}`, {
                emb_latitud: parseFloat(coordenadas.lat),
                emb_longitud: parseFloat(coordenadas.lon)
            });
        } catch (error) {
            console.error("Error al actualizar coordenadas:", error);
            toast.error("Error al reportar posición GPS.");
        } finally {
            setIsUpdatingGPS(false);
        }
    };
    
    const reconciliarInsumo = async (ins_id, accion) => {
        try {
            const cantidad = cantidadesReconciliacion[ins_id] || 0;
            if (cantidad <= 0) return toast.error("Selecciona una cantidad válida.");

            await api.post('/viaje-insumos/reconciliar', {
                via_id: viaje.via_id,
                emb_id: viaje.via_fk_embarcacion, // Usamos la FK de la embarcación
                ins_id,
                accion,
                id_bodega: viaje.id_bodega,
                cantidad
            });

            // Actualizar el estado local restando la cantidad procesada
            setInsumosViaje(prev => prev.map(iv => {
                if (iv.vi_fk_insumo === ins_id) {
                    const nueva = parseFloat(iv.vi_cantidad) - cantidad;
                    return { ...iv, vi_cantidad: nueva };
                }
                return iv;
            }).filter(iv => parseFloat(iv.vi_cantidad) > 0));

            // Resetear la cantidad seleccionada para este insumo
            setCantidadesReconciliacion(prev => ({ ...prev, [ins_id]: 0 }));
            
        } catch (error) {
            console.error("Error al reconciliar:", error);
            toast.error("Error al procesar la reconciliación.");
        }
    };

    const ajustarCantidadReconciliacion = (ins_id, delta, max) => {
        const actual = cantidadesReconciliacion[ins_id] || 0;
        const nueva = Math.min(Math.max(0, actual + delta), max);
        setCantidadesReconciliacion({ ...cantidadesReconciliacion, [ins_id]: nueva });
    };

    const ajustarCantidadTemp = (ins_id, delta, max) => {
        const actual = cantidadesTemp[ins_id] || 0;
        const nueva = Math.min(Math.max(0, actual + delta), max);
        setCantidadesTemp({ ...cantidadesTemp, [ins_id]: nueva });
    };

    // --- DATOS PARA KPIs INDIVIDUALES ---
    const totalKg = capturas.reduce((acc, curr) => acc + Number(curr.det_cap_kilogramos), 0);
    const totalIngresos = capturas.reduce((acc, curr) => acc + Number(curr.det_cap_subtotal), 0);

    const dataPerformance = capturas.map(c => ({
        especie: c.esp_nombre_comun,
        kg: Number(c.det_cap_kilogramos),
        ingreso: Number(c.det_cap_subtotal)
    }));
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

    const cambiarEstatus = async (nuevoEstatus) => {
        if (nuevoEstatus === 'En Puerto') {
            setMostrarModalLlegada(true);
            return;
        }

        try {
            await api.put(`/viaje/estatus/${viaje.via_id}`, { via_estatus: nuevoEstatus });
            toast.success(`Estatus actualizado: ${nuevoEstatus}`);
            setTimeout(() => window.location.reload(), 800);
        } catch (error) {
            console.error("Error al cambiar estatus:", error);
            toast.error("Error al actualizar el estatus del viaje.");
        }
    };

    const confirmarLlegada = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/viaje/estatus/${viaje.via_id}`, { 
                via_estatus: 'En Puerto',
                via_fecha_llegada: datosLlegada.fecha,
                via_observaciones: datosLlegada.observaciones,
                via_fk_puerto: datosLlegada.via_fk_puerto
            });
            toast.success("¡Arribo a puerto registrado exitosamente!");
            setMostrarModalLlegada(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("Error al registrar llegada:", error);
            toast.error("Error al registrar la llegada a puerto.");
        }
    };

    return (
        <div className="text-white">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* CABECERA (Se mantiene igual) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-5">
                    <button onClick={volver} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all shadow-lg">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">{viaje.barco}</h2>
                            <div className="flex flex-col gap-1">
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                                    Viaje #{viaje.via_id}
                                </span>
                                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border border-blue-500/20 w-fit">
                                    {viaje.emb_categoria || 'Flota Menor'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-zinc-500 font-medium">Bitácora del zarpe.</p>
                            <span className="text-zinc-600">•</span>
                            <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-widest">
                                {viaje.zona_nombre} {viaje.zona_cuadrante ? `[Cuadrante ${viaje.zona_cuadrante}]` : ''}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Estatus Operativo</p>
                        <p className={`text-2xl font-bold ${isCancelado ? 'text-red-500' : 'text-emerald-500'}`}>{viaje.via_estatus}</p>
                    </div>
                    {/* BOTONES DE ACCIÓN DE ESTATUS */}
                    <div className="flex gap-2">
                        {viaje.via_estatus === 'Pendiente' && (
                            <button onClick={() => cambiarEstatus('En Preparación')} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-zinc-700">Comenzar Preparación</button>
                        )}
                        {viaje.via_estatus === 'En Preparación' && (
                            <button onClick={() => cambiarEstatus('En Curso')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20">Zarpar (En Curso)</button>
                        )}
                        {viaje.via_estatus === 'En Curso' && (
                            <button onClick={() => cambiarEstatus('En Puerto')} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-amber-500/20">Arribo a Puerto</button>
                        )}
                    </div>
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

            {/* GRID PRINCIPAL OPTIMIZADO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* COLUMNA DE ENFOQUE (8/12) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Bloque de KPIs siempre visible y bien distribuido */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Presupuesto</p>
                            <p className="text-2xl font-black text-white">${parseFloat(viaje.via_presupuesto_estimado || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Producción</p>
                            <p className="text-2xl font-black text-white">{totalKg.toLocaleString()} <span className="text-zinc-600 text-sm font-bold">/ {viaje.emb_capacidad_carga || 0} KG</span></p>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center ring-1 ring-emerald-500/30 bg-emerald-500/[0.02]">
                            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Ingresos Totales</p>
                            <p className="text-3xl font-black text-white">${totalIngresos.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* SECCIÓN CRÍTICA: REGISTRO DE PESCA Y LIQUIDACIÓN (OCUPA ESPACIO ANCHO) */}
                    {(viaje.via_estatus === 'Completado' || viaje.via_estatus === 'En Puerto') && (
                        <div className="bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Fish size={28} /></div>
                                <div><h3 className="text-2xl font-black text-white tracking-tight">Registro de Pesca y Liquidación</h3><p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Información oficial de producción y finanzas</p></div>
                            </div>

                            {viaje.via_estatus === 'Completado' && (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-10 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-3 p-8 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between shadow-inner">
                                            <div><p className="text-zinc-500 text-xs font-bold uppercase mb-2">Ganancia Neta (Margen Real)</p><p className={`text-6xl font-black ${parseFloat(viaje.via_ganancia_neta) >= 0 ? 'text-white' : 'text-red-500'}`}>${parseFloat(viaje.via_ganancia_neta || 0).toLocaleString()}</p></div>
                                            <div className="text-right flex flex-col items-end gap-3">
                                              <div><p className="text-zinc-600 text-xs font-bold uppercase mb-1">Rentabilidad</p><p className="text-emerald-500 font-black text-4xl">{((parseFloat(viaje.via_ganancia_neta) / parseFloat(viaje.via_total_ingresos || 1)) * 100).toFixed(1)}%</p></div>
                                              <button 
                                                onClick={() => generateLiquidacionPDF(viaje, capturas, tripulacion)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20 mt-2 flex items-center gap-2"
                                              >
                                                <FileText size={16} /> Descargar Reporte
                                              </button>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-amber-500 text-xs font-black uppercase mb-3 opacity-70">Cooperativa</p><p className="text-white font-black text-3xl">${parseFloat(viaje.via_reparto_cooperativa || 0).toLocaleString()}</p></div>
                                        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-blue-500 text-xs font-black uppercase mb-3 opacity-70">Capitán</p><p className="text-white font-black text-3xl">${parseFloat(viaje.via_reparto_capitan || 0).toLocaleString()}</p></div>
                                        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-emerald-500 text-xs font-black uppercase mb-3 opacity-70">Tripulación</p><p className="text-white font-black text-3xl">${parseFloat(viaje.via_reparto_tripulacion || 0).toLocaleString()}</p></div>
                                    </div>
                                </div>
                            )}

                            {viaje.via_estatus === 'En Puerto' && (
                                <form onSubmit={registrarCaptura} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in zoom-in-95 duration-500">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2">Especie</label>
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                placeholder="🔍 Buscar especie..." 
                                                value={busquedaEspecie}
                                                onChange={(e) => setBusquedaEspecie(e.target.value)}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                            <select 
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 ring-emerald-500/20" 
                                                value={nuevaCaptura.especie_id} 
                                                onChange={(e) => { 
                                                    const esp = especies.find(x => x.esp_id.toString() === e.target.value); 
                                                    setNuevaCaptura({ ...nuevaCaptura, especie_id: e.target.value, precio: esp?.esp_precio_kilo_referencia || '' }); 
                                                }} 
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                {especies
                                                    .filter(e => e.esp_nombre_comun.toLowerCase().includes(busquedaEspecie.toLowerCase()))
                                                    .map(e => <option key={e.esp_id} value={e.esp_id}>{e.esp_nombre_comun}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2">KG</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 ring-emerald-500/20" 
                                            value={nuevaCaptura.kilogramos} 
                                            onChange={(e) => setNuevaCaptura({ ...nuevaCaptura, kilogramos: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2">Precio/KG (Ref)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 ring-emerald-500/20 font-mono" 
                                            value={nuevaCaptura.precio} 
                                            onChange={(e) => setNuevaCaptura({ ...nuevaCaptura, precio: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                                        Registrar
                                    </button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {capturas.map((c, idx) => (
                                    <div key={idx} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group transition-all hover:border-zinc-700">
                                        <div><p className="text-white font-black">{c.esp_nombre_comun}</p><p className="text-zinc-500 text-[10px] font-bold uppercase">{c.det_cap_kilogramos} KG • ${c.det_cap_precio_pactado}/KG</p></div>
                                        <div className="text-right flex items-center gap-4"><p className="text-emerald-500 font-black text-lg">${Number(c.det_cap_subtotal).toLocaleString()}</p>{viaje.via_estatus !== 'Completado' && (<button onClick={() => eliminarCaptura(c.det_cap_id)} className="text-zinc-700 hover:text-red-500 transition-colors"><XCircle size={18} /></button>)}</div>
                                    </div>
                                ))}
                            </div>

                            {capturas.length > 0 && viaje.via_estatus !== 'Completado' && (
                                <button onClick={finalizarViaje} disabled={isFinalizing} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"><TrendingUp size={20} /> {isFinalizing ? 'Procesando Cierre...' : 'FINALIZAR Y LIQUIDAR VIAJE'}</button>
                            )}
                        </div>
                    )}

                    {/* MOSTRAR RENDIMIENTO AQUÍ SI NO ESTÁ COMPLETADO PARA LLENAR EL HUECO */}
                    {viaje.via_estatus !== 'Completado' && <RendimientoHistorial isFullWidth={false} dataHistory={dataHistory} />}
                </div>

                {/* COLUMNA DERECHA: Módulos Operativos Priorizados */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        {(() => {
                            const isPreparacion = ['Pendiente', 'En Preparación'].includes(viaje.via_estatus);
                            
                            const tripulacionBlock = (
                                <div className={`bg-zinc-950 p-6 rounded-2xl border border-zinc-800 transition-all ${isPreparacion ? 'ring-2 ring-emerald-500/20' : ''} flex flex-col shadow-lg`}>
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
                                        <div className="flex items-center gap-3 text-emerald-500">
                                            <Users size={20} />
                                            <h3 className="text-lg font-bold text-white">Tripulación</h3>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded text-xs font-bold border ${tripulacionLlena ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                                            {tripulacion.length} / {capacidadMaxima} a bordo
                                        </span>
                                    </div>

                                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[200px]">
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
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        {viaje.via_estatus === 'En Preparación' && (
                                                            <button 
                                                                onClick={() => toggleAsistencia(tripulante.id, tripulante.via_per_id, tripulante.enrolado)} 
                                                                className={`p-1 rounded-full border transition-colors ${tripulante.enrolado ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-emerald-500'}`} 
                                                                title={tripulante.enrolado ? "Asistencia Confirmada" : "Confirmar Asistencia"}
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => eliminarTripulante(tripulante.id, tripulante.via_per_id)} className="text-zinc-600 hover:text-red-500 transition-colors" title="Desembarcar">
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
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
                            );

                        const equipamientoBlock = (
                            <div className={`bg-zinc-950 p-6 rounded-[2rem] border border-zinc-800 relative overflow-hidden ${isPreparacion ? 'ring-2 ring-blue-500/30 bg-blue-500/[0.02]' : ''}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl"><Package size={24} /></div>
                                    <div><h3 className="text-lg font-bold text-white">Equipamiento</h3><p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Suministros</p></div>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 mb-4">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase mb-3 tracking-widest">Carga Actual</p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {insumosViaje.map((ins, idx) => (
                                            <div key={idx} className="flex justify-between text-[11px] font-medium"><span className="text-zinc-400"># {ins.ins_nombre}</span><span className="text-blue-400 font-black">{ins.vi_cantidad} {ins.ins_unidad_medida}</span></div>
                                        ))}
                                    </div>
                                </div>
                                {viaje.via_estatus === 'En Preparación' ? (
                                    <button onClick={() => { const init = {}; insumosViaje.forEach(iv => { init[iv.vi_fk_insumo] = parseFloat(iv.vi_cantidad); }); setCantidadesTemp(init); setMostrarModalInsumos(true); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20">Gestionar Insumos</button>
                                ) : viaje.via_estatus === 'Completado' && insumosViaje.length > 0 ? (
                                    <button onClick={() => setMostrarModalReconciliacion(true)} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2">Finalizar Logística</button>
                                ) : (
                                    <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 text-center"><p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Módulo de Carga Cerrado</p></div>
                                )}
                            </div>
                        );

                        const gpsBlock = viaje.via_estatus === 'En Curso' && (
                            <div className="bg-zinc-950 p-6 rounded-[2rem] border border-zinc-800 ring-2 ring-emerald-500/20 bg-emerald-500/[0.02] shadow-xl animate-in zoom-in-95 duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                        <Navigation size={24} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Posicionamiento GPS</h3>
                                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Interactuar para marcar</p>
                                    </div>
                                </div>
                                
                                {/* MINI MAPA INTERACTIVO */}
                                <div className="h-48 w-full rounded-2xl overflow-hidden border border-zinc-800 mb-4 relative z-0">
                                    <MapContainer 
                                        center={[parseFloat(coordenadas.lat) || 18.5, parseFloat(coordenadas.lon) || -93.0]} 
                                        zoom={8} 
                                        style={{ height: '100%', width: '100%' }}
                                        zoomControl={false}
                                    >
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        {coordenadas.lat && coordenadas.lon && (
                                            <Marker position={[coordenadas.lat, coordenadas.lon]} icon={shipIcon} />
                                        )}
                                        {viaje.via_fk_zona && ZONE_SHAPES[viaje.via_fk_zona] && (
                                            <Polygon 
                                                positions={ZONE_SHAPES[viaje.via_fk_zona]} 
                                                pathOptions={{ color: '#ef4444', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }} 
                                            />
                                        )}
                                        <MapClickHandler onLocationSelect={(latlng) => setCoordenadas({ lat: latlng.lat, lon: latlng.lng })} />
                                    </MapContainer>
                                    <div className="absolute bottom-2 right-2 z-[1000] bg-zinc-950/80 px-2 py-1 rounded text-[8px] text-zinc-400 font-bold uppercase border border-zinc-800">
                                        Clic en mapa para ubicar
                                    </div>
                                </div>
                                
                                <form onSubmit={actualizarUbicacion} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Latitud</label>
                                            <input 
                                                type="number" 
                                                step="0.000001"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-2 ring-emerald-500/20 font-mono"
                                                value={coordenadas.lat}
                                                onChange={(e) => setCoordenadas({...coordenadas, lat: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Longitud</label>
                                            <input 
                                                type="number" 
                                                step="0.000001"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-2 ring-emerald-500/20 font-mono"
                                                value={coordenadas.lon}
                                                onChange={(e) => setCoordenadas({...coordenadas, lon: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isUpdatingGPS}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group text-sm"
                                    >
                                        <Navigation size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        {isUpdatingGPS ? 'Reportando...' : 'ACTUALIZAR RADAR'}
                                    </button>
                                </form>
                                <p className="mt-4 text-[9px] text-zinc-600 text-center font-medium italic">
                                    * Esta posición se reflejará instantáneamente en el centro de control geoespacial.
                                </p>
                            </div>
                        );

                        return (
                            <div className="flex flex-col gap-6">
                                {gpsBlock}
                                {tripulacionBlock}
                                {equipamientoBlock}
                            </div>
                        );
                    })()}
                </div>

                {/* MOSTRAR RENDIMIENTO AQUÍ SI ESTÁ COMPLETADO PARA OCUPAR TODO EL ANCHO */}
                {viaje.via_estatus === 'Completado' && <RendimientoHistorial isFullWidth={true} dataHistory={dataHistory} />}
            </div>
            </div> {/* CIERRE DE max-w-7xl (LÍNEA 361) */}

            {/* 5. MODAL CON DESPLEGABLE DESDE LA BD */}
            {mostrarModalTripulacion && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] px-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5 flex flex-col">
                        <div className="relative p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800 shrink-0">
                            <div className="flex justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                        <Users size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tighter uppercase">Alistar <span className="text-emerald-500">Tripulante</span></h3>
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1">Asignación Operativa</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMostrarModalTripulacion(false)} 
                                    className="text-zinc-500 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-xl group"
                                >
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <form onSubmit={agregarTripulante} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Rol a Bordo</label>
                                <select
                                    value={nuevoTripulante.rol_id}
                                    onChange={(e) => {
                                        const rolSeleccionado = roles.find(r => r.rol_id.toString() === e.target.value);
                                        setNuevoTripulante({
                                            id_personal: '', // Resetear persona al cambiar rol
                                            nombre: '',
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

                            <div>
                                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Personal Disponible</label>
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="🔍 Buscar por nombre..." 
                                        value={busquedaTripulante}
                                        onChange={(e) => setBusquedaTripulante(e.target.value)}
                                        disabled={!nuevoTripulante.rol_id}
                                        className={`w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors ${!nuevoTripulante.rol_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <select
                                        value={nuevoTripulante.id_personal}
                                        onChange={(e) => {
                                            const personaSeleccionada = personalDisponible.find(p => p.per_id.toString() === e.target.value);
                                            setNuevoTripulante({
                                                ...nuevoTripulante,
                                                id_personal: e.target.value,
                                                nombre: personaSeleccionada ? personaSeleccionada.nombre_completo : ''
                                            });
                                        }}
                                        required
                                        disabled={!nuevoTripulante.rol_id}
                                        className={`w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 shadow-inner ${!nuevoTripulante.rol_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="" disabled>{!nuevoTripulante.rol_id ? 'Primero selecciona un rol...' : 'Selecciona un tripulante...'}</option>
                                        {personalDisponible
                                            .filter(p => p.rol_id && p.rol_id.toString() === nuevoTripulante.rol_id.toString())
                                            .filter(p => p.nombre_completo.toLowerCase().includes(busquedaTripulante.toLowerCase()))
                                            .map(p => {
                                                const yaAsignado = tripulacion.some(t => t.id === p.per_id) || p.per_id === viaje.via_fk_capitan;
                                                return (
                                                    <option 
                                                        key={p.per_id} 
                                                        value={p.per_id} 
                                                        disabled={yaAsignado}
                                                        className={yaAsignado ? 'text-zinc-600 italic' : ''}
                                                    >
                                                        {p.nombre_completo} {yaAsignado ? '(Ya asignado)' : ''}
                                                    </option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2">
                                <Plus size={18} /> Asignar a la embarcación
                            </button>
                        </form>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL DE ARRIBO A PUERTO */}
            {mostrarModalLlegada && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[150] px-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5 flex flex-col">
                        <div className="relative p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800 shrink-0">
                            <div className="flex justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                                        <MapPin size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tighter uppercase">Registro de <span className="text-amber-500">Arribo</span></h3>
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1">Llegada a Puerto</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMostrarModalLlegada(false)} 
                                    className="text-zinc-500 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-xl group"
                                >
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <form onSubmit={confirmarLlegada} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Fecha y Hora de Llegada</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all"
                                    value={datosLlegada.fecha}
                                    onChange={(e) => setDatosLlegada({ ...datosLlegada, fecha: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Puerto de Arribo</label>
                                <select 
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all"
                                    value={datosLlegada.via_fk_puerto}
                                    onChange={(e) => setDatosLlegada({ ...datosLlegada, via_fk_puerto: e.target.value })}
                                >
                                    <option value="">Seleccionar puerto...</option>
                                    {instalaciones.map(inst => (
                                        <option key={inst.inst_id} value={inst.inst_id}>{inst.inst_nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Observaciones del Viaje</label>
                                <textarea 
                                    placeholder="Reporte de averías, condiciones climáticas encontradas, etc..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all h-32 resize-none"
                                    value={datosLlegada.observaciones}
                                    onChange={(e) => setDatosLlegada({ ...datosLlegada, observaciones: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setMostrarModalLlegada(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all">Cancelar</button>
                                <button type="submit" className="flex-[2] bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all">Registrar Llegada</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL DE EQUIPAMIENTO DE INSUMOS */}
            {mostrarModalInsumos && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center z-[150] p-4 overflow-y-auto pt-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden mb-12 animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5 flex flex-col">
                        <div className="relative p-8 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800 shrink-0">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                                        <Package size={36} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Equipar <span className="text-blue-500">Embarcación</span></h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                                <p className="text-[10px] text-zinc-300 uppercase font-black tracking-widest">Almacén Activo</p>
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">
                                                Inventario: {viaje.id_bodega ? `Bodega #${viaje.id_bodega}` : 'No asignada'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMostrarModalInsumos(false)} 
                                    className="text-zinc-500 hover:text-white transition-all bg-zinc-800 hover:bg-zinc-700 p-3 rounded-2xl group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                            {['Operativos', 'Pesca', 'Materiales'].map((categoria) => {
                                const items = inventarioBodega.filter(inv => inv.ins_categoria === categoria);
                                if (items.length === 0) return null;

                                return (
                                    <div key={categoria} className="mb-10 last:mb-0">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`h-8 w-1.5 rounded-full ${
                                                categoria === 'Operativos' ? 'bg-amber-500' : 
                                                categoria === 'Pesca' ? 'bg-emerald-500' : 'bg-blue-500'
                                            }`}></div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-wider">
                                                Insumos {categoria}
                                            </h4>
                                        </div>

                                        <table className="w-full text-left border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                                    <th className="px-4 py-2">Insumo</th>
                                                    <th className="px-4 py-2">Disponible</th>
                                                    <th className="px-4 py-2">Costo Ref.</th>
                                                    <th className="px-4 py-2 text-center w-48">Cantidad a Cargar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((inv) => (
                                                    <tr key={inv.inv_id} className="bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors group">
                                                        <td className="px-4 py-4 rounded-l-2xl">
                                                            <p className="text-white font-bold">{inv.ins_nombre}</p>
                                                            <p className="text-[10px] text-zinc-500 uppercase">{inv.ins_unidad_medida}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {parseFloat(inv.inv_cantidad_actual) === 0 ? (
                                                                <span className="text-red-500 font-black text-[10px] uppercase tracking-tighter bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Agotado en Bodega</span>
                                                            ) : (
                                                                <span className="text-zinc-300 font-mono">{inv.inv_cantidad_actual} {inv.ins_unidad_medida}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="text-emerald-500 font-bold">${inv.ins_costo_unitario_referencia}</span>
                                                        </td>
                                                        <td className="px-4 py-4 rounded-r-2xl">
                                                            <div className="flex items-center justify-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                                                                <button 
                                                                    onClick={() => {
                                                                        const actualEnBarco = parseFloat(insumosViaje.find(iv => iv.vi_fk_insumo === inv.inv_fk_insumo)?.vi_cantidad || 0);
                                                                        const maxPermitido = parseFloat(inv.inv_cantidad_actual) + actualEnBarco;
                                                                        ajustarCantidadTemp(inv.inv_fk_insumo, -1, maxPermitido);
                                                                    }}
                                                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-lg transition-all"
                                                                >-</button>
                                                                <span className="text-white font-black min-w-[30px] text-center">
                                                                    {cantidadesTemp[inv.inv_fk_insumo] || 0}
                                                                </span>
                                                                <button 
                                                                    onClick={() => {
                                                                        const actualEnBarco = parseFloat(insumosViaje.find(iv => iv.vi_fk_insumo === inv.inv_fk_insumo)?.vi_cantidad || 0);
                                                                        const maxPermitido = parseFloat(inv.inv_cantidad_actual) + actualEnBarco;
                                                                        ajustarCantidadTemp(inv.inv_fk_insumo, 1, maxPermitido);
                                                                    }}
                                                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-500 rounded-lg transition-all"
                                                                >+</button>
                                                                <button 
                                                                    onClick={() => {
                                                                        const actualEnBarco = parseFloat(insumosViaje.find(iv => iv.vi_fk_insumo === inv.inv_fk_insumo)?.vi_cantidad || 0);
                                                                        const maxPermitido = parseFloat(inv.inv_cantidad_actual) + actualEnBarco;
                                                                        setCantidadesTemp({ ...cantidadesTemp, [inv.inv_fk_insumo]: maxPermitido });
                                                                    }}
                                                                    className="px-2 h-8 flex items-center justify-center bg-zinc-800 hover:bg-blue-500/20 text-zinc-500 hover:text-blue-400 rounded-lg transition-all text-[9px] font-black uppercase"
                                                                    title="Cargar máximo"
                                                                >MAX</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-4">
                            <button 
                                onClick={() => setMostrarModalInsumos(false)} 
                                className="px-8 py-3 rounded-xl text-zinc-400 font-bold hover:text-white hover:bg-zinc-800 transition-all"
                            >
                                Descartar Cambios
                            </button>
                            <button 
                                onClick={equiparBarco}
                                className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-xl shadow-blue-600/20 transition-all"
                            >
                                Confirmar y Equipar Barco
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE RECONCILIACIÓN LOGÍSTICA (ESTILO COMPACTO COHERENTE) */}
            {mostrarModalReconciliacion && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[80] px-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden scale-in-center">
                        {/* Header coherente */}
                        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">Reconciliación Logística</h3>
                                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Destino final de suministros post-viaje</p>
                                </div>
                            </div>
                            <button onClick={() => setMostrarModalReconciliacion(false)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
                                <XCircle size={32} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                            {insumosViaje.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">Logística Completada</h4>
                                    <p className="text-zinc-500 text-sm">Todos los insumos han sido procesados y el inventario está al día.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                            <th className="px-6 py-2">Insumo</th>
                                            <th className="px-6 py-2">A Bordo</th>
                                            <th className="px-6 py-2 text-center w-48">Cantidad a Procesar</th>
                                            <th className="px-6 py-2 text-center">Acciones / Destino</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {insumosViaje.map((ins) => (
                                            <tr key={ins.vi_fk_insumo} className="bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors group">
                                                <td className="px-6 py-4 rounded-l-2xl">
                                                    <p className="text-white font-bold">{ins.ins_nombre}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase">{ins.ins_unidad_medida}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">
                                                        {ins.vi_cantidad} {ins.ins_unidad_medida}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* Selector compacto estilo Equipamiento */}
                                                    <div className="flex items-center justify-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                                                        <button 
                                                            onClick={() => ajustarCantidadReconciliacion(ins.vi_fk_insumo, -1, parseFloat(ins.vi_cantidad))}
                                                            className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all"
                                                        >-</button>
                                                        <span className="text-white font-black min-w-[30px] text-center tabular-nums">
                                                            {cantidadesReconciliacion[ins.vi_fk_insumo] || 0}
                                                        </span>
                                                        <button 
                                                            onClick={() => ajustarCantidadReconciliacion(ins.vi_fk_insumo, 1, parseFloat(ins.vi_cantidad))}
                                                            className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-emerald-600/30 text-zinc-400 hover:text-emerald-500 rounded-lg transition-all"
                                                        >+</button>
                                                        <button 
                                                            onClick={() => setCantidadesReconciliacion({ ...cantidadesReconciliacion, [ins.vi_fk_insumo]: parseFloat(ins.vi_cantidad) })}
                                                            className="px-2 h-8 flex items-center justify-center bg-zinc-800 hover:bg-emerald-500/20 text-zinc-500 hover:text-emerald-400 rounded-lg transition-all text-[9px] font-black uppercase"
                                                            title="Seleccionar todo"
                                                        >TODO</button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 rounded-r-2xl">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => reconciliarInsumo(ins.vi_fk_insumo, 'devolver')}
                                                            title="Regresar a Bodega"
                                                            className="flex-1 px-3 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-black uppercase tracking-tighter rounded-xl border border-blue-600/20 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Package size={14} /> Bodega
                                                        </button>
                                                        <button 
                                                            onClick={() => reconciliarInsumo(ins.vi_fk_insumo, 'mantener')}
                                                            title="Dejar en el Barco"
                                                            className="flex-1 px-3 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-black uppercase tracking-tighter rounded-xl border border-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Anchor size={14} /> Barco
                                                        </button>
                                                        <button 
                                                            onClick={() => reconciliarInsumo(ins.vi_fk_insumo, 'perdido')}
                                                            title="Marcar como Perdido"
                                                            className="flex-1 px-3 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-[10px] font-black uppercase tracking-tighter rounded-xl border border-red-600/20 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle size={14} /> Perdido
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-center">
                            <button 
                                onClick={() => setMostrarModalReconciliacion(false)} 
                                className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-2xl transition-all shadow-xl"
                            >FINALIZAR GESTIÓN</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN GLOBAL */}
            <ConfirmationModal 
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText="Aceptar"
                cancelText="Volver"
            />
        </div>
    );
};

export default DetallesViaje;