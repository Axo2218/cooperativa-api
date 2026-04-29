import React from 'react';
// Agregamos XCircle para el ícono de cancelado
import { Ship, Anchor, MapPin, CheckCircle, XCircle, Archive, RefreshCcw } from 'lucide-react';

const ViajeCard = ({ viaje, onVerDetalles, onArchivar, onDesarchivar }) => {
    const pasos = [
        { nombre: 'Preparación', icono: <Anchor size={16} /> },
        { nombre: 'En Curso', icono: <Ship size={16} /> },
        { nombre: 'En Puerto', icono: <MapPin size={16} /> },
        { nombre: 'Completado', icono: <CheckCircle size={16} /> }
    ];

    const isCancelado = viaje.via_estatus === 'Cancelado';
    const isArchivable = (isCancelado || viaje.via_estatus === 'Completado') && !viaje.via_archivado;
    const isArchived = viaje.via_archivado;

    const pasoActual = pasos.findIndex(p => p.nombre.includes(viaje.via_estatus.replace('En ', '')));
    const indexPaso = pasoActual === -1 ? 0 : pasoActual;

    return (
        <div className={`bg-zinc-900 rounded-xl border ${isCancelado ? 'border-red-900/50' : 'border-zinc-800'} overflow-hidden hover:border-zinc-700 transition-colors flex flex-col h-full group/card relative ${isArchived ? 'opacity-75' : ''}`}>
            
            {(isArchivable || isArchived) && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        isArchived ? onDesarchivar() : onArchivar();
                    }}
                    className="absolute top-4 right-24 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all opacity-0 group-hover/card:opacity-100 z-20"
                    title={isArchived ? "Restaurar al Mando" : "Archivar Viaje"}
                >
                    {isArchived ? <RefreshCcw size={16} /> : <Archive size={16} />}
                </button>
            )}

            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="pr-12">
                        <h3 className={`text-xl font-bold mb-1 ${isCancelado ? 'text-zinc-500 line-through' : 'text-white'}`}>{viaje.barco}</h3>
                        <p className="text-sm text-zinc-400">Cap. {viaje.capitan}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isCancelado ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {viaje.via_estatus}
                    </span>
                </div>

                <div className="text-xs text-zinc-500 mb-6 flex items-center gap-2">
                    <span className={isCancelado ? "text-red-400 font-bold" : "text-coop-rojo font-bold"}>ID: #{viaje.via_id}</span>
                    <span>•</span>
                    {/* Tachamos el presupuesto si se canceló */}
                    <span className={isCancelado ? "line-through opacity-50" : ""}>Presupuesto: ${viaje.via_presupuesto_estimado}</span>
                </div>

                {/* Zona de Progreso: Stepper normal o Mensaje de Aborto */}
                {isCancelado ? (
                    <div className="flex flex-col items-center justify-center mt-8 mb-4 py-6 bg-red-500/5 rounded-lg border border-red-500/10">
                        <XCircle size={28} className="text-red-500 mb-2 opacity-80" />
                        <span className="text-red-400 text-sm font-medium">Viaje Abortado</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between relative mt-8 mb-4">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-zinc-800 z-0 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-coop-rojo z-0 transition-all duration-500 rounded-full shadow-[0_0_10px_#411682]"
                            style={{ width: `${(indexPaso / (pasos.length - 1)) * 100}%` }}
                        ></div>

                        {pasos.map((paso, index) => {
                            const completado = index <= indexPaso;
                            return (
                                <div key={paso.nombre} className="relative z-10 flex flex-col items-center group">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full border-4 border-zinc-900 transition-colors duration-300 ${completado ? 'bg-coop-rojo text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {paso.icono}
                                    </div>
                                    <span className={`absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${completado ? 'text-coop-rojo' : 'text-zinc-500'}`}>
                                        {paso.nombre}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="px-6 pb-6 mt-auto">
                {/* Botón dinámico: Gris oscuro si está cancelado, Morado si está activo */}
                {/* Antes no tenía el onClick */}
                <button
                    onClick={onVerDetalles}
                    className="w-full text-white font-black py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10"
                >
                    Ver Detalles
                    {/* ... (tu svg de flechita sigue aquí) */}
                </button>
            </div>
        </div>
    );
};

export default ViajeCard;