"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWarehouseAction } from "@/app/actions/warehouses";

export default function NewWarehousePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          <input
            name="name"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Chennai North Hub"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            required
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Full physical address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Latitude</label>
            <input
              name="lat"
              type="number"
              step="any"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="13.0827"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Longitude</label>
            <input
              name="lng"
              type="number"
              step="any"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="80.2707"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Processing Time (Hours)</label>
          <input
            name="processingTimeHours"
            type="number"
            min="0"
            required
            defaultValue="24"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
