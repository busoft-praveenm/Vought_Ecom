"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";
import { createCategoryAction } from "@/app/actions/category";

export function CategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const finalImageUrl = imageUrl.trim() || "https://media.istockphoto.com/id/510693044/photo/house-cleaning-product-on-wood-table.jpg?s=612x612&w=0&k=20&c=EZfeRCDgSMPnqG684zQBOqyNfDGx9JWTXS1Q2Lhrjy4=";
      const result = await createCategoryAction({ name, description, imageUrl: finalImageUrl });
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Category created successfully");
      setName("");
      setDescription("");
      setImageUrl("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium">Create New Category</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Electronics" 
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
          placeholder="Category description..." 
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
        {isLoading ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}
