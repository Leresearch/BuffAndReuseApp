import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Location {
  name: string;
  lat: number;
  lng: number;
  state: string;
}

const goodwillLocations: Location[] = [
  { name: 'Goodwill of Greater Washington', lat: 38.9072, lng: -76.9964, state: 'DC' },
  { name: 'Arlington, Glebe Road', lat: 38.8760, lng: -77.1167, state: 'VA' },
  { name: 'West Falls Church', lat: 38.8607, lng: -77.1717, state: 'VA' },
  { name: 'Alexandria, Richmond Highway', lat: 38.7693, lng: -77.0841, state: 'VA' },
  { name: 'Annandale, Columbia Pike', lat: 38.8304, lng: -77.1977, state: 'VA' },
];

export function LocationMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map - centered on DC/VA area
    const map = L.map(containerRef.current).setView([38.8607, -77.1167], 11);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Brown circle icon for markers
    const brownIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #8B4513; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
      iconSize: [16, 16],
    });

    // Add markers for each location
    goodwillLocations.forEach((location) => {
      L.marker([location.lat, location.lng], { icon: brownIcon })
        .addTo(map)
        .bindPopup(`<strong>${location.name}</strong><br/>${location.state}`);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] overflow-hidden">
      <div className="bg-[#0053A0] text-white px-3 py-2">
        <h3 className="text-sm font-bold">Goodwill Locations</h3>
      </div>
      <div ref={containerRef} style={{ height: '250px', width: '100%' }} />
      <div className="p-3 border-t border-[#99c2e6]">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Locations by State:</h4>
        <div className="space-y-1 text-xs text-gray-600">
          {goodwillLocations.map((loc) => (
            <div key={loc.name} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brown-600 rounded-full" style={{ backgroundColor: '#8B4513' }}></div>
              <span>{loc.name}, {loc.state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
