"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBrandAction, updateBrandAction } from "@/app/actions/brand";

export function BrandForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      if (initialData) {
        const result = await updateBrandAction(initialData.id, { name, description, imageUrl });
        if (!result.success) throw new Error(result.error);
        toast.success("Brand updated successfully");
        router.push("/dashboard/admin/brands"); // remove edit query param
      } else {
        const result = await createBrandAction({ name, description, imageUrl });
        if (!result.success) throw new Error(result.error);
        toast.success("Brand created successfully");
        setName("");
        setDescription("");
        setImageUrl("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save brand");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/brands");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium">{initialData ? "Edit Brand" : "Create New Brand"}</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Brand Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Sony" 
          required 
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Brand description..." 
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input 
          id="imageUrl" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="https://..." 
          disabled={isLoading}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Saving..." : (initialData ? "Update Brand" : "Create Brand")}
        </Button>
        {initialData && (
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
