import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, AlertCircle, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom white light glowing marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEventsHandler({ position, setPosition, onLocationChange }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() > 14 ? map.getZoom() : 15, { animate: true });
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationChange) {
        onLocationChange({
          latitude: Number(e.latlng.lat.toFixed(6)),
          longitude: Number(e.latlng.lng.toFixed(6))
        });
      }
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={customMarkerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          const newPos = [latlng.lat, latlng.lng];
          setPosition(newPos);
          if (onLocationChange) {
            onLocationChange({
              latitude: Number(latlng.lat.toFixed(6)),
              longitude: Number(latlng.lng.toFixed(6))
            });
          }
        }
      }}
    />
  ) : null;
}

export const LocationPicker = ({
  locationData,
  onChange,
  wards = [
    'Ward 01 - Arundelpet Central',
    'Ward 02 - Brodipet Commercial Zone',
    'Ward 03 - Kothapet Heritage',
    'Ward 04 - Lakshmipuram',
    'Ward 05 - Pattabhipuram',
    'Ward 06 - Nallapadu Industrial Area',
    'Ward 07 - Gorantla & Amaravathi Road',
    'Ward 08 - Old Guntur Market',
    'Ward 09 - Gujjanagundla Lake District',
    'Ward 10 - Vidyanagar Transit Corridor',
    'Ward 11 - Brindavan Gardens',
    'Ward 12 - Syamala Nagar'
  ]
}) => {
  const [position, setPosition] = useState([
    locationData?.latitude || 16.3067,
    locationData?.longitude || 80.4365
  ]);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (locationData?.latitude && locationData?.longitude) {
      setPosition([locationData.latitude, locationData.longitude]);
    }
  }, [locationData?.latitude, locationData?.longitude]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const newPos = [lat, lng];
        setPosition(newPos);
        setIsLocating(false);

        onChange({
          ...locationData,
          latitude: lat,
          longitude: lng,
          address: locationData.address || `Guntur GPS Pin: ${lat}, ${lng} (Auto-detected)`
        });
      },
      (err) => {
        console.warn('Geo error:', err);
        setIsLocating(false);
        setGeoError('Could not fetch precise GPS. You can pin location directly on the Guntur city map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Location Bar */}
      <div className="charcoal-glass flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/15">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <Compass className="w-4 h-4 text-white drop-shadow-[0_0_6px_#ffffff]" />
            Guntur City Geolocation & Ward Identification
          </h4>
          <p className="text-[11px] text-zinc-400">
            Click anywhere on the Guntur map or drag the pin directly over the infrastructure defect.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isLocating}
          className="white-glass-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-white' : 'text-white'}`} />
          <span>{isLocating ? 'Acquiring Satellites...' : 'Auto-Detect Current GPS'}</span>
        </button>
      </div>

      {geoError && (
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2 backdrop-blur-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Map Container */}
      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative z-10">
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler
            position={position}
            setPosition={setPosition}
            onLocationChange={(coords) => {
              onChange({
                ...locationData,
                latitude: coords.latitude,
                longitude: coords.longitude
              });
            }}
          />
        </MapContainer>

        {/* Floating coordinates badge */}
        <div className="absolute bottom-3 right-3 z-[400] charcoal-pill text-white text-[11px] px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 shadow-lg border border-white/25">
          <MapPin className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_#ffffff]" />
          <span>GUNTUR LAT: {position[0].toFixed(5)}, LNG: {position[1].toFixed(5)}</span>
        </div>
      </div>

      {/* Address & Ward Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Street Address / Road Name in Guntur *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lakshmipuram Main Road, near Hindu Pharmacy College"
            value={locationData.address || ''}
            onChange={(e) => onChange({ ...locationData, address: e.target.value })}
            className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            GMC Municipal Ward *
          </label>
          <select
            value={locationData.ward || wards[3]}
            onChange={(e) => onChange({ ...locationData, ward: e.target.value })}
            className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-xl focus:outline-none font-medium text-white"
          >
            {wards.map((w) => (
              <option key={w} value={w} className="bg-zinc-950 text-white">
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Prominent Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. Opposite Union Bank / Near Guntur Railway Station"
            value={locationData.landmark || ''}
            onChange={(e) => onChange({ ...locationData, landmark: e.target.value })}
            className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Zone / Circle
          </label>
          <input
            type="text"
            placeholder="e.g. Zone 2 - Guntur West"
            value={locationData.zone || 'Zone 2 - Guntur West'}
            onChange={(e) => onChange({ ...locationData, zone: e.target.value })}
            className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-xl focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Postal PIN Code
          </label>
          <input
            type="text"
            placeholder="e.g. 522007"
            value={locationData.pincode || '522007'}
            onChange={(e) => onChange({ ...locationData, pincode: e.target.value })}
            className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-xl focus:outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
};
