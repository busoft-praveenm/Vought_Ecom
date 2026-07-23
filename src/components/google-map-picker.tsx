"use client";

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Search, MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default to a central location (e.g., New Delhi, India)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const libraries: "places"[] = ["places"];

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface GoogleMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (location: LocationData) => void;
  onCancel: () => void;
}

export function GoogleMapPicker({ initialLat, initialLng, onLocationSelect, onCancel }: GoogleMapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number}>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter
  );
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (ac: google.maps.places.Autocomplete) => {
    setAutocomplete(ac);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        if (place.formatted_address) {
          setSelectedAddress(place.formatted_address);
        }
        map?.panTo({ lat, lng });
        map?.setZoom(15);
      }
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return;
    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results.length > 0) {
        setSelectedAddress(response.results[0].formatted_address);
      } else {
        setSelectedAddress('');
      }
    } catch (error) {
      console.error("Geocoding error: ", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, []);

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const handleConfirm = () => {
    onLocationSelect({
      address: selectedAddress,
      lat: markerPosition.lat,
      lng: markerPosition.lng
    });
  };

  if (!isLoaded) return <div className="p-8 text-center bg-muted rounded-md animate-pulse">Loading Maps...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for a location..." 
              className="pl-10 w-full"
            />
          </div>
        </Autocomplete>
      </div>
      
      <div className="rounded-md border border-border overflow-hidden relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false
          }}
        >
          <Marker 
            position={markerPosition} 
            draggable={true}
            onDragEnd={handleDragEnd}
          />
        </GoogleMap>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          Selected Location
        </h4>
        <p className="text-sm text-muted-foreground min-h-[40px]">
          {isGeocoding ? "Fetching address..." : (selectedAddress || "Click on the map or search to select a location.")}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        <Button onClick={handleConfirm} disabled={!selectedAddress || isGeocoding} type="button">Confirm Location</Button>
      </div>
    </div>
  );
}
