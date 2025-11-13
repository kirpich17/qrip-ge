"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";

// Dynamically import the entire map component to avoid SSR issues
const DynamicMap = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  )
});

interface InteractiveMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLocation?: string; // Location string to prefill in search
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
  showCoordinateInputs?: boolean;
  className?: string;
  translations?: {
    searchPlaceholder: string;
    latitude: string;
    longitude: string;
    latitudePlaceholder: string;
    longitudePlaceholder: string;
    instructions: {
      title: string;
      clickMap: string;
      searchLocation: string;
      currentLocation: string;
      manualCoordinates: string;
    };
  };
}


export default function InteractiveMap({
  initialLat = 41.7151,
  initialLng = 44.8271,
  initialLocation = "",
  onLocationChange,
  height = "400px",
  showCoordinateInputs = true,
  className = "",
  translations
}: InteractiveMapProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [manualLat, setManualLat] = useState<string>(initialLat.toString());
  const [manualLng, setManualLng] = useState<string>(initialLng.toString());
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialLocation || "");

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng]);
      setManualLat(initialLat.toString());
      setManualLng(initialLng.toString());
    }
  }, [initialLat, initialLng]);

  // Update search query when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setSearchQuery(initialLocation);
    }
  }, [initialLocation]);

  // Add cursor styling and z-index for the map
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        cursor: crosshair !important;
        z-index: 1 !important;
        position: relative !important;
      }
      .leaflet-container .leaflet-interactive {
        cursor: crosshair !important;
      }
      .leaflet-popup {
        z-index: 1000 !important;
      }
      .leaflet-control {
        z-index: 1000 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setManualLat(lat.toString());
    setManualLng(lng.toString());
    onLocationChange(lat, lng);
  };

  const handleManualCoordinateChange = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setPosition([lat, lng]);
      onLocationChange(lat, lng);
    }
  };

  const handleGeocodeSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.lat);
        const lng = parseFloat(firstResult.lon);
        
        setPosition([lat, lng]);
        setManualLat(lat.toString());
        setManualLng(lng.toString());
        onLocationChange(lat, lng);
      }
    } catch (error) {
      // Geocoding failed silently
    } finally {
      setIsGeocoding(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setManualLat(latitude.toString());
          setManualLng(longitude.toString());
          onLocationChange(latitude, longitude);
        },
        (error) => {
          // Location access failed silently
        }
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder={translations?.searchPlaceholder || "Search for a location (e.g., Amsterdam, Netherlands)"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGeocodeSearch()}
          />
        </div>
        <Button
          onClick={handleGeocodeSearch}
          disabled={isGeocoding || !searchQuery.trim()}
          variant="outline"
        >
          {isGeocoding ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={getCurrentLocation}
          variant="outline"
          title="Use my current location"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border map-container">
        <DynamicMap
          position={position}
          onLocationChange={handleMapClick}
          height={height}
        />
      </div>

      {/* Manual Coordinate Inputs */}
      {showCoordinateInputs && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manual-lat" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {translations?.latitude || "Latitude"}
            </Label>
            <Input
              id="manual-lat"
              type="number"
              step="any"
              placeholder={translations?.latitudePlaceholder || "e.g. 41.7151"}
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              onBlur={handleManualCoordinateChange}
              className="h-10"
              min="-90"
              max="90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manual-lng" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {translations?.longitude || "Longitude"}
            </Label>
            <Input
              id="manual-lng"
              type="number"
              step="any"
              placeholder={translations?.longitudePlaceholder || "e.g. 44.8271"}
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              onBlur={handleManualCoordinateChange}
              className="h-10"
              min="-180"
              max="180"
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium mb-1">{translations?.instructions?.title || "How to set the precise location:"}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{translations?.instructions?.clickMap || "Click anywhere on the map to place the memorial marker"}</li>
          <li>{translations?.instructions?.searchLocation || "Search for a location using the search bar"}</li>
          <li>{translations?.instructions?.currentLocation || "Use the navigation button to get your current location"}</li>
          <li>{translations?.instructions?.manualCoordinates || "Enter exact coordinates manually in the input fields"}</li>
        </ul>
      </div>
    </div>
  );
}
