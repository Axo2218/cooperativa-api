import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';

const AdminViajes = ({ viajes, recargarViajes }) => {
    const [catalogos, setCatalogos] = useState({ embarcaciones: [], capitanes: [], zonas: [] });

    // Estados de Modales
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false); // <-- Nuevo estado para el seguro

    const [formData, setFormData] = useState({
        via_fk_embarcacion: '', via_fk_capitan: '', via_presupuesto_estimado: '', via_fk_zona: ''
    });

    const [datosEdicion, setDatosEdicion] = useState({ id: null, estatus: '' });

    // Estado para saber a quién vamos a borrar
    const [viajeAEliminar, setViajeAEliminar] = useState(null);

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const res = await api.get('/catalogos');
                setCatalogos(res.data);
            } catch (error) {
                console.error("Error cargando catálogos:", error);
            }
        };
        cargarCatalogos();
    }, []);

    const manejarCambio = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const crearNuevoViaje = async (e) => {
        e.preventDefault();
        try {
            await api.post('/viajes', formData);
            setMostrarModal(false);
            recargarViajes();
            setFormData({ via_fk_embarcacion: '', via_fk_capitan: '', via_presupuesto_estimado: '', via_fk_zona: '' });
        } catch (error) {
            console.error("Error al crear:", error);
            alert("Hubo un fallo al zarpar.");
        }
    };

    const abrirModalEdicion = (viaje) => {
        setDatosEdicion({ id: viaje.via_id, estatus: viaje.via_estatus });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/viajes/${datosEdicion.id}/estatus`, { via_estatus: datosEdicion.estatus });
            setMostrarModalEdicion(false);
            recargarViajes();
        } catch (error) {
            console.error("Error al editar:", error);
        }
    };

    // --- NUEVAS FUNCIONES PARA ELIMINAR ---
    const confirmarEliminacion = (viaje) => {
        setViajeAEliminar(viaje); // Guardamos los datos del viaje en la mira
        setMostrarModalEliminar(true); // Abrimos la advertencia
    };

    const ejecutarEliminacion = async () => {
        try {
            // Mandamos el torpedo al backend
            await api.delete(`/viajes/${viajeAEliminar.via_id}`);
            setMostrarModalEliminar(false); // Cerramos el modal
            setViajeAEliminar(null); // Limpiamos la mira
            recargarViajes(); // Actualizamos el radar
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar. Revisa si el viaje tiene gastos registrados que impidan borrarlo.");
        }
    };

    const obtenerColorEstatus = (estatus) => {
        switch (estatus) {
            case 'Cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Completado': case 'Finalizado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'En Curso': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'En Preparación': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'En Puerto': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
        }
    };

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Gestión de Viajes (Administrador temporal)</h2>
                <button onClick={() => setMostrarModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                    <Plus size={18} /> Nuevo Viaje
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
                        <tr>
                            <th className="px-4 py-3">ID</th><th className="px-4 py-3">Barco</th><th className="px-4 py-3">Capitán</th><th className="px-4 py-3">Presupuesto</th><th className="px-4 py-3">Estatus</th><th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viajes.map((v) => (
                            <tr key={v.via_id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-white">#{v.via_id}</td>
                                <td className="px-4 py-3">{v.barco}</td><td className="px-4 py-3">{v.capitan}</td><td className="px-4 py-3 text-emerald-400">${v.via_presupuesto_estimado}</td>
                                <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${obtenerColorEstatus(v.via_estatus)}`}>{v.via_estatus}</span></td>
                                <td className="px-4 py-3 flex justify-end gap-2">
                                    <button onClick={() => abrirModalEdicion(v)} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition-colors" title="Modificar"><Edit2 size={16} /></button>

                                    {/* Conectamos el botón rojo a la función de confirmación */}
                                    <button onClick={() => confirmarEliminacion(v)} className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded transition-colors" title="Eliminar">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL CREAR (Resumido para espacio, sigue igual) --- */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md p-6 relative shadow-2xl">
                        <button onClick={() => setMostrarModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={24} /></button>
                        <h3 className="text-xl font-bold text-white mb-6">Planificar Nuevo Viaje</h3>
                        <form onSubmit={crearNuevoViaje} className="space-y-4">
                            <div><label className="block text-sm font-medium text-zinc-400 mb-1">Embarcación</label><select name="via_fk_embarcacion" value={formData.via_fk_embarcacion} onChange={manejarCambio} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white"><option value="" disabled>Selecciona...</option>{catalogos.embarcaciones.map(b => (<option key={b.emb_id} value={b.emb_id}>{b.emb_nombre}</option>))}</select></div>
                            <div><label className="block text-sm font-medium text-zinc-400 mb-1">Capitán</label><select name="via_fk_capitan" value={formData.via_fk_capitan} onChange={manejarCambio} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white"><option value="" disabled>Selecciona...</option>{catalogos.capitanes.map(c => (<option key={c.per_id} value={c.per_id}>{c.nombre_completo}</option>))}</select></div>
                            <div><label className="block text-sm font-medium text-zinc-400 mb-1">Zona</label><select name="via_fk_zona" value={formData.via_fk_zona} onChange={manejarCambio} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white"><option value="" disabled>Selecciona...</option>{catalogos.zonas.map(z => (<option key={z.zona_id} value={z.zona_id}>{z.zona_nombre}</option>))}</select></div>
                            <div><label className="block text-sm font-medium text-zinc-400 mb-1">Presupuesto ($)</label><input type="number" step="0.01" name="via_presupuesto_estimado" value={formData.via_presupuesto_estimado} onChange={manejarCambio} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" /></div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-4">Autorizar Zarpe</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL EDITAR (Sigue igual) --- */}
            {mostrarModalEdicion && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm p-6 relative shadow-[0_0_15px_#411682]">
                        <button onClick={() => setMostrarModalEdicion(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={24} /></button>
                        <h3 className="text-xl font-bold text-white mb-2">Modificar Viaje #{datosEdicion.id}</h3>
                        <form onSubmit={guardarEdicion} className="space-y-4">
                            <div><label className="block text-sm text-zinc-400 mb-1">Estatus</label><select value={datosEdicion.estatus} onChange={(e) => setDatosEdicion({ ...datosEdicion, estatus: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white"><option value="En Preparación">En Preparación</option><option value="En Curso">En Curso</option><option value="En Puerto">En Puerto</option><option value="Completado">Completado</option><option value="Cancelado">Cancelado</option></select></div>
                            <button type="submit" className="w-full bg-coop-rojo hover:opacity-80 text-white font-bold py-3 rounded-lg">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- NUEVO: MODAL DE ADVERTENCIA PARA ELIMINAR --- */}
            {mostrarModalEliminar && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 border border-red-900 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_25px_rgba(220,38,38,0.3)]">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4 mx-auto">
                            <Trash2 className="text-red-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 text-center">¿Eliminar Viaje #{viajeAEliminar?.via_id}?</h3>
                        <p className="text-zinc-400 text-sm mb-8 text-center">
                            Estás a punto de borrar los registros operativos de la embarcación <strong className="text-white">{viajeAEliminar?.barco}</strong>. Esta acción es permanente y no se puede deshacer. ¿Seguro que quieres proceder?
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setMostrarModalEliminar(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={ejecutarEliminacion}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViajes;