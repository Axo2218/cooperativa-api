import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Circle, Rectangle, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { Ship, Home, Anchor, Map as MapIcon, Loader2, Info, Users, Navigation } from 'lucide-react';

// Corregir el problema de los iconos de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Iconos personalizados por tipo
const createCustomIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

const icons = {
    embarcacion: createCustomIcon('#10b981'), // Emerald
    embarcacionActiva: new L.DivIcon({
        className: 'active-ship',
        html: `<div style="background-color: #10b981; width: 18px; height: 18px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(16,185,129,0.8); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;" class="animate-pulse"></div></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    }),
    cooperativa: new L.DivIcon({
        className: 'coop-marker',
        html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(59,130,246,1); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    }),
    instalacion: createCustomIcon('#f59e0b'), // Amber
    zona: createCustomIcon('#ef4444')        // Red
};

const customMapStyles = `
  .leaflet-control-layers {
    background: #09090b !important;
    color: #e4e4e7 !important;
    border: 1px solid #27272a !important;
    border-radius: 16px !important;
    padding: 12px !important;
    font-family: 'Inter', sans-serif !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
    font-size: 12px !important;
  }
  .leaflet-control-layers-overlays label {
    margin-bottom: 8px !important;
    display: flex !important;
    align-items: center !important;
    cursor: pointer !important;
    padding: 4px 8px !important;
    border-radius: 8px !important;
    transition: background 0.2s !important;
  }
  .leaflet-control-layers-overlays label:hover {
    background: #18181b !important;
  }
  .leaflet-control-layers-selector {
    margin-right: 12px !important;
    accent-color: #10b981 !important;
  }
  .leaflet-bar a {
    background-color: #09090b !important;
    color: #ffffff !important;
    border-bottom: 1px solid #27272a !important;
  }
  .leaflet-bar a:hover {
    background-color: #18181b !important;
  }
`;

const Geolocalizacion = () => {
    const [data, setData] = useState({
        embarcaciones: [],
        cooperativas: [],
        instalaciones: [],
        zonas: [],
        viajesActivos: []
    });
    const [loading, setLoading] = useState(true);
    const [mapCenter] = useState([18.5, -93.0]); // Centro aproximado de la región
    const [zoom] = useState(8);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [emb, coop, inst, zonas, viajes] = await Promise.all([
                    api.get('/embarcaciones'),
                    api.get('/cooperativas'),
                    api.get('/instalaciones'),
                    api.get('/zonas'),
                    api.get('/viaje')
                ]);

                setData({
                    embarcaciones: emb.data,
                    cooperativas: coop.data,
                    instalaciones: inst.data,
                    zonas: zonas.data,
                    viajesActivos: (viajes.data || []).filter(v => v.via_estatus === 'Navegando')
                });
            } catch (error) {
                console.error('Error al cargar datos de geolocalización:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <p className="text-zinc-400 font-bold animate-pulse">Sincronizando coordenadas satelitales...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <style>{customMapStyles}</style>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Inteligencia <span className="text-emerald-500">Geoespacial</span>
                    </h1>
                    <p className="text-zinc-400">Monitoreo dinámico de flota y activos estratégicos.</p>
                </div>
                <div className="flex gap-4 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Barcos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Coops</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Puertos/Bodegas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Zonas Pesca</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* MAPA */}
                <div className="flex-grow h-[700px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative z-0">
                    <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%', background: '#09090b' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        <LayersControl position="topright" collapsed={false}>
                            <LayersControl.Overlay checked name="Flota en Puerto">
                                <LayerGroup>
                                    {data.embarcaciones.filter(e => e.emb_latitud && e.emb_longitud && e.emb_estatus !== 'Navegando').map(emb => (
                                        <Marker 
                                            key={`emb-${emb.emb_id}`} 
                                            position={[parseFloat(emb.emb_latitud), parseFloat(emb.emb_longitud)]}
                                            icon={icons.embarcacion}
                                        >
                                            <Popup>
                                                <div className="p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800 min-w-[200px]">
                                                    <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                                                        <Ship size={16} className="text-emerald-500" />
                                                        <h3 className="font-bold text-sm">{emb.emb_nombre}</h3>
                                                    </div>
                                                    <div className="space-y-1 text-[11px]">
                                                        <p><span className="text-zinc-500 uppercase font-black mr-1">Matrícula:</span> {emb.emb_matricula}</p>
                                                        <p><span className="text-zinc-500 uppercase font-black mr-1">Estatus:</span> {emb.emb_estatus}</p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="Flota Navegando">
                                <LayerGroup>
                                    {data.viajesActivos.map(viaje => (
                                        <Marker 
                                            key={`viaje-${viaje.via_id}`} 
                                            position={[parseFloat(viaje.emb_latitud), parseFloat(viaje.emb_longitud)]}
                                            icon={icons.embarcacionActiva}
                                            zIndexOffset={2000}
                                        >
                                            <Popup>
                                                <div className="p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800 min-w-[200px]">
                                                    <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                                        <h3 className="font-bold text-sm text-emerald-400">NAVEGANDO: {viaje.barco}</h3>
                                                    </div>
                                                    <div className="space-y-1 text-[11px]">
                                                        <p><span className="text-zinc-500 uppercase font-black mr-1">Capitán:</span> {viaje.capitan}</p>
                                                        <p><span className="text-zinc-500 uppercase font-black mr-1">Posición:</span> {parseFloat(viaje.emb_latitud).toFixed(4)}, {parseFloat(viaje.emb_longitud).toFixed(4)}</p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="Cooperativas">
                                <LayerGroup>
                                    {data.cooperativas.filter(c => c.coop_latitud && c.coop_longitud).map(coop => (
                                        <Marker 
                                            key={`coop-${coop.coop_id}`} 
                                            position={[parseFloat(coop.coop_latitud), parseFloat(coop.coop_longitud)]}
                                            icon={icons.cooperativa}
                                            zIndexOffset={1000}
                                        >
                                            <Popup>
                                                <div className="p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800 min-w-[200px]">
                                                    <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                                                        <Home size={16} className="text-blue-500" />
                                                        <h3 className="font-bold text-sm">{coop.coop_nombre}</h3>
                                                    </div>
                                                    <div className="space-y-1 text-[11px]">
                                                        <p><span className="text-zinc-500 uppercase font-black mr-1">Representante:</span> {coop.coop_representante_legal}</p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="Instalaciones Terrestres">
                                <LayerGroup>
                                    {data.instalaciones.filter(i => i.inst_latitud && i.inst_longitud).map(inst => (
                                        <Marker 
                                            key={`inst-${inst.inst_id}`} 
                                            position={[parseFloat(inst.inst_latitud), parseFloat(inst.inst_longitud)]}
                                            icon={icons.instalacion}
                                        >
                                            <Popup>
                                                <div className="p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800">
                                                    <h3 className="font-bold text-sm text-amber-500">{inst.inst_nombre}</h3>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>

                            <LayersControl.Overlay checked name="Zonas y Cuadrantes">
                                <LayerGroup>
                                    {data.zonas.filter(z => z.zona_lat_min && z.zona_lon_min).map(zona => (
                                        <React.Fragment key={`zona-${zona.zona_id}`}>
                                            <Rectangle 
                                                bounds={[
                                                    [parseFloat(zona.zona_lat_min), parseFloat(zona.zona_lon_min)],
                                                    [parseFloat(zona.zona_lat_max), parseFloat(zona.zona_lon_max)]
                                                ]}
                                                pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.1, weight: 1 }}
                                            />
                                            {zona.zona_latitud && zona.zona_longitud && (
                                                <Marker 
                                                    position={[parseFloat(zona.zona_latitud), parseFloat(zona.zona_longitud)]}
                                                    icon={icons.zona}
                                                >
                                                    <Popup>
                                                        <div className="p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800 min-w-[150px]">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <MapIcon size={14} className="text-red-500" />
                                                                <h4 className="font-bold text-xs uppercase">Zona: {zona.zona_nombre}</h4>
                                                            </div>
                                                            <p className="text-[10px] text-zinc-500 italic">{zona.zona_cuadrante}</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>
                        </LayersControl>
                    </MapContainer>
                </div>

                {/* SIDEBAR ESTADÍSTICAS */}
                <div className="w-full lg:w-96 flex flex-col gap-4 h-[700px]">
                    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 h-full flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <Navigation className="text-emerald-500" size={24} />
                                Radar Activo
                            </h2>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em]">
                                {data.viajesActivos.length} en Mar
                            </span>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            {data.viajesActivos.length > 0 ? data.viajesActivos.map(viaje => (
                                <div key={`side-${viaje.via_id}`} className="p-5 bg-zinc-800/40 border border-zinc-800/50 rounded-2xl hover:border-emerald-500/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-white text-lg group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{viaje.barco}</h3>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{viaje.emb_matricula}</p>
                                        </div>
                                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                                            <Ship className="text-emerald-500" size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 text-[11px] mb-2">
                                                <Users size={14} className="text-zinc-500" />
                                                <span className="text-zinc-400 font-bold uppercase tracking-tighter">Capitán al mando</span>
                                            </div>
                                            <p className="text-sm text-zinc-100 font-medium ml-6">{viaje.capitan}</p>
                                        </div>

                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 text-[11px] mb-2">
                                                <MapIcon size={14} className="text-zinc-500" />
                                                <span className="text-zinc-400 font-bold uppercase tracking-tighter">Ubicación Actual</span>
                                            </div>
                                            <div className="flex justify-between items-center ml-6">
                                                <span className="text-emerald-500 font-mono text-xs font-bold tracking-widest">{parseFloat(viaje.emb_latitud).toFixed(5)}</span>
                                                <span className="text-zinc-600 font-mono">|</span>
                                                <span className="text-emerald-500 font-mono text-xs font-bold tracking-widest">{parseFloat(viaje.emb_longitud).toFixed(5)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Transmitiendo</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-600 font-bold">ZONA: {viaje.zona_nombre}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                        <Ship className="text-zinc-600" size={32} />
                                    </div>
                                    <p className="text-zinc-500 text-sm italic max-w-[200px]">Sin actividad de navegación detectada en este momento.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-zinc-800/50">
                            <div className="flex items-center gap-3 p-4 bg-zinc-800/20 rounded-2xl border border-zinc-800/50">
                                <Info className="text-zinc-500" size={18} />
                                <p className="text-[10px] text-zinc-500 leading-tight">
                                    Los datos de telemetría se consolidan desde las bitácoras de abordo y sistemas de posicionamiento global.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Geolocalizacion;
