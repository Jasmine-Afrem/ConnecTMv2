'use client';

import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import styled from 'styled-components';

interface MapComponentProps {
  lat: number;
  lng: number;
  onMapClick: (e: L.LeafletMouseEvent) => void;
}

const MapContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(map);

      map.on("click", onMapClick);

      return () => {
        map.remove();
      };
    }
  }, [lat, lng, onMapClick]);

  return (
    <MapContainer>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </MapContainer>
  );
};

export default MapComponent;
