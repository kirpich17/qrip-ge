"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  position: [number, number];
  onLocationChange: (lat: number, lng: number) => void;
  height: string;
}

interface MapClickHandlerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationChange }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
}

export default function MapComponent({ position, onLocationChange, height }: MapComponentProps) {
  return (
    <div 
      className="cursor-crosshair map-container"
      style={{ height, width: "100%" }}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ 
          height: "100%", 
          width: "100%", 
          cursor: "crosshair"
        }}
        key={`${position[0]}-${position[1]}`}
        className="cursor-crosshair"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <div className="text-center">
            <MapPin className="h-4 w-4 text-red-500 mx-auto" />
            <span className="text-xs">Memorial Location</span>
          </div>
        </Marker>
        <MapClickHandler onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}
