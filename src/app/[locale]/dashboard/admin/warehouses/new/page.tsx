"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWarehouseAction } from "@/app/actions/warehouses";
import { Input } from "@/components/input";
import { GoogleMapPicker, LocationData } from "@/components/google-map-picker";
import { MapPin } from "lucide-react";
import { Button } from "@/components/button";

export default function NewWarehousePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      address: formData.get("address"),
      lat: parseFloat(formData.get("lat") as string),
      lng: parseFloat(formData.get("lng") as string),
      processingTimeHours: parseInt(formData.get("processingTimeHours") as string, 10),
      isActive: true,
    };

    const result = await createWarehouseAction(data);
    if (result.success) {
      router.push("/dashboard/admin/warehouses");
    } else {
      setError(result.error || "Failed to create warehouse");
      setLoading(false);
    }
  };

  if (showMap) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Warehouse</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Select Location on Map</h3>
          <GoogleMapPicker 
            initialLat={parseFloat(lat) || undefined}
            initialLng={parseFloat(lng) || undefined}
            onCancel={() => setShowMap(false)}
            onLocationSelect={(location: LocationData) => {
              setAddress(location.address);
              setLat(location.lat.toString());
              setLng(location.lng.toString());
              setShowMap(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Warehouse</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-2">Warehouse Name</label>
          <Input
            name="name"
            required
            placeholder="e.g. Chennai North Hub"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Address</label>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowMap(true)} className="h-8">
              <MapPin className="w-4 h-4 mr-1" />
              Pick on Map
            </Button>
          </div>
          <textarea
            name="address"
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Full physical address or pick from map"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Latitude</label>
            <Input
              name="lat"
              type="number"
              step="any"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="font-mono"
              placeholder="13.0827"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Longitude</label>
            <Input
              name="lng"
              type="number"
              step="any"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="font-mono"
              placeholder="80.2707"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Processing Time (Hours)</label>
          <Input
            name="processingTimeHours"
            type="number"
            min="0"
            required
            defaultValue="24"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Time required to pack and dispatch an order from this warehouse. This will be added to the estimated transit time.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Warehouse"}
          </button>
        </div>
      </form>
    </div>
  );
}
