"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";
import { createBrandAction } from "@/app/actions/brand";

export function BrandForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await createBrandAction({ name, description, imageUrl });
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Brand created successfully");
      setName("");
      setDescription("");
      setImageUrl("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium">Create New Brand</h3>
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
      <Button type="submit" disabled={isLoading || !name.trim()}>
        {isLoading ? "Creating..." : "Create Brand"}
      </Button>
    </form>
  );
}
