import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCustomerLocations } from '@/services/mapService';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPage() {
  const [locations, setLocations] = useState([]);
  const [center] = useState([51.505, -0.09]); // Default center (London)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await getCustomerLocations();
        if (response && response.success) {
          const customerLocations = response.result
            .filter(customer => customer.latitude && customer.longitude)
            .map(customer => ({
              id: customer._id,
              name: customer.name,
              position: [customer.latitude, customer.longitude],
              address: customer.address,
              phone: customer.phone
            }));
          setLocations(customerLocations);
        }
      } catch (error) {
        console.error('Error fetching customer locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Calculate bounds to fit all markers
  const bounds = useMemo(() => {
    if (locations.length === 0) return null;
    return L.latLngBounds(locations.map(loc => loc.position));
  }, [locations]);

  // Fit map to bounds when locations change
  const mapRef = useRef();
  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds]);

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map(location => (
          <Marker key={location.id} position={location.position}>
            <Popup>
              <b>{location.name}</b>
              <p>More details here...</p>
            </Popup>
          </Marker>
        ))}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.8)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          Loading map data...
        </div>
      )}
      </MapContainer>
    </div>
  );
}

export default MapPage;
