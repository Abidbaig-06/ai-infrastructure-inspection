import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Sparkles,
  Truck,
  Building2,
  Eye,
  Scan,
  CheckCircle2,
  Navigation,
  Maximize2
} from 'lucide-react';

// Custom Pulsing Red Dot for Complaints with White Light Rim
const createPulsingRedDotIcon = (severity, isSelected) => {
  const isCritical = severity === 'CRITICAL';
  const colorBg = isCritical ? 'bg-red-600' : severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500';
  const colorPing = isCritical ? 'bg-red-400' : severity === 'HIGH' ? 'bg-orange-300' : 'bg-amber-300';
  const ring = isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-black scale-125' : '';

  return L.divIcon({
    className: 'custom-red-dot-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 ${ring}">
        <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full ${colorPing} opacity-75"></span>
        <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 ${colorBg} border-2 border-white shadow-[0_0_10px_#ffffff] text-[9px] font-black text-white">
          !
        </span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Smoothly center the map so the popup card lands right in the dead-center of the screen
const centerOnMarkerPopup = (map, lat, lng) => {
  if (!map || !lat || !lng) return;
  const zoom = Math.max(map.getZoom(), 16);
  const point = map.project([lat, lng], zoom);
  // Offset by 190px north so the entire 300px popup box is in the vertical center of the map
  const targetPoint = L.point(point.x, point.y - 190);
  const centerLatLng = map.unproject(targetPoint, zoom);
  map.flyTo(centerLatLng, zoom, {
    animate: true,
    duration: 0.65,
    easeLinearity: 0.25
  });
};

// Disperse overlapping GPS coordinates in a clean radial offset (~100m) so all complaint pins are distinct
const getSpiderfiedComplaints = (items = []) => {
  const coordMap = new Map();
  return items.map((c) => {
    if (!c.location?.latitude || !c.location?.longitude) return c;
    const baseKey = `${Number(c.location.latitude).toFixed(4)}_${Number(c.location.longitude).toFixed(4)}`;
    const count = coordMap.get(baseKey) || 0;
    coordMap.set(baseKey, count + 1);

    if (count === 0) {
      return {
        ...c,
        _displayLat: Number(c.location.latitude),
        _displayLng: Number(c.location.longitude)
      };
    }

    // Radial cluster offset
    const angle = (count * (2 * Math.PI)) / 5;
    const offset = 0.0012 * Math.ceil(count / 5);
    return {
      ...c,
      _displayLat: Number(c.location.latitude) + offset * Math.sin(angle),
      _displayLng: Number(c.location.longitude) + offset * Math.cos(angle) * 1.15
    };
  });
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
};

export const RealLifeSatelliteMap = ({
  complaints = [],
  onSelectComplaint,
  onOpenAiVision,
  selectedComplaintId,
  height = '100%'
}) => {
  const [mapType, setMapType] = useState('satellite');
  const [activeComplaint, setActiveComplaint] = useState(null);

  const gunturCenter = [16.3067, 80.4365];

  const mapTileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const attributions = {
    satellite: '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
    streets: '&copy; <a href="https://carto.com/">CARTO</a>',
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  };

  const displayedComplaints = React.useMemo(() => getSpiderfiedComplaints(complaints), [complaints]);

  const currentCenter = selectedComplaintId
    ? (() => {
      const found = displayedComplaints.find(c => (c.ticketId === selectedComplaintId || c._id === selectedComplaintId));
      return found?._displayLat ? [found._displayLat, found._displayLng] : gunturCenter;
    })()
    : gunturCenter;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black w-full h-full flex flex-col min-h-0">
      {/* Top Map Overlays Bar (Unified Non-Overlapping Row) */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between gap-2 pointer-events-none">
        {/* Left Map Switcher */}
        <div className="charcoal-glass rounded-2xl p-1.5 shadow-2xl border border-white/20 flex items-center gap-1.5 text-xs text-white pointer-events-auto">
          <div className="hidden sm:flex items-center gap-1 font-bold text-white px-1.5 font-mono text-[11px]">
            <Layers className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_#ffffff]" />
            <span>Map:</span>
          </div>

          <div className="flex items-center bg-black/60 p-0.5 rounded-xl border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 text-[11px] ${mapType === 'satellite'
                  ? 'white-gloss-btn text-black shadow'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <span>🛰️ Aerial Satellite</span>
            </button>

            <button
              type="button"
              onClick={() => setMapType('streets')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${mapType === 'streets'
                  ? 'white-gloss-btn text-black shadow'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <span>🗺️ Streets</span>
            </button>

            <button
              type="button"
              onClick={() => setMapType('osm')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${mapType === 'osm'
                  ? 'white-gloss-btn text-black shadow'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <span>🏙️ OSM</span>
            </button>
          </div>
        </div>

        {/* Right Active Red Dots Count Badge */}
        <div className="charcoal-glass rounded-2xl px-3 py-1.5 shadow-2xl border border-white/20 flex items-center gap-2 text-xs text-white pointer-events-auto flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-[0_0_8px_#ef4444]"></span>
          </span>
          <span className="font-mono font-bold text-red-400 text-[11px] whitespace-nowrap">
            {displayedComplaints.filter(c => c.status !== 'RESOLVED').length} Active Red Dots
          </span>
        </div>
      </div>

      {/* Leaflet Map without Default White Zoom Controls Box */}
      <div className="flex-1 w-full h-full min-h-0 relative" style={{ height: '100%' }}>
        <MapContainer
          center={currentCenter}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <MapResizer />
          <TileLayer
            key={mapType}
            attribution={attributions[mapType]}
            url={mapTileUrls[mapType]}
            maxZoom={19}
          />

          {displayedComplaints.map((c) => {
            if (!c._displayLat || !c._displayLng) return null;
            const isSelected = selectedComplaintId === c.ticketId || selectedComplaintId === c._id;
            const severity = c.aiAnalysis?.severity || 'MEDIUM';

            return (
              <Marker
                key={c.ticketId || c._id}
                position={[c._displayLat, c._displayLng]}
                icon={createPulsingRedDotIcon(severity, isSelected)}
                eventHandlers={{
                  click: (e) => {
                    setActiveComplaint(c);
                    const map = e.target?._map;
                    centerOnMarkerPopup(map, c._displayLat, c._displayLng);
                  }
                }}
              >
                <Popup
                  className="custom-leaflet-popup"
                  autoPan={false}
                  offset={[0, -10]}
                  closeButton={true}
                >
                  <div className="p-1 max-w-xs space-y-2 text-xs">
                    {c.imageUrl && (
                      <div
                        onClick={() => {
                          if (onOpenAiVision) onOpenAiVision(c);
                          else if (onSelectComplaint) onSelectComplaint(c);
                        }}
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        title="Click to launch AI Vision inspection"
                      >
                        <img
                          src={c.imageUrl}
                          alt="Hazard"
                          className="w-full h-28 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-zinc-900 text-[11px]">{c.ticketId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {severity} ({c.aiAnalysis?.riskScore || 50}/100)
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1 mt-1">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="text-[10px] text-slate-600 border-t pt-1.5 font-mono">
                      📍 {c.location.address || c.location.ward}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenAiVision) onOpenAiVision(c);
                        else if (onSelectComplaint) onSelectComplaint(c);
                      }}
                      className="w-full py-2.5 white-gloss-btn text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:opacity-95 active:scale-95"
                    >
                      <Scan className="w-4 h-4 text-black" />
                      <span>AI Vision & Defect Detection</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Coordinates & Live Status Bar */}
      <div className="p-3 bg-black/90 border-t border-white/15 text-zinc-300 text-[11px] font-mono flex flex-wrap items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>LIVE GIS • LAT: {Number(currentCenter[0]).toFixed(4)}° N, LNG: {Number(currentCenter[1]).toFixed(4)}° E • SATELLITE HIGH-RES</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">Touch/Click any <strong className="text-red-400 font-bold">Red Dot</strong> to center & inspect live defect</span>
        </div>
      </div>
    </div>
  );
};
