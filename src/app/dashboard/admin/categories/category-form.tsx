"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "@/app/actions/category";

export function CategoryForm({ initialData }: { initialData?: any }) {
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
      const finalImageUrl = imageUrl.trim() || "https://media.istockphoto.com/id/510693044/photo/house-cleaning-product-on-wood-table.jpg?s=612x612&w=0&k=20&c=EZfeRCDgSMPnqG684zQBOqyNfDGx9JWTXS1Q2Lhrjy4=";
      
      if (initialData) {
        const result = await updateCategoryAction(initialData.id, { name, description, imageUrl: finalImageUrl });
        if (!result.success) throw new Error(result.error);
        toast.success("Category updated successfully");
        router.push("/dashboard/admin/categories");
      } else {
        const result = await createCategoryAction({ name, description, imageUrl: finalImageUrl });
        if (!result.success) throw new Error(result.error);
        toast.success("Category created successfully");
        setName("");
        setDescription("");
        setImageUrl("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/categories");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium">{initialData ? "Edit Category" : "Create New Category"}</h3>
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
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Saving..." : (initialData ? "Update Category" : "Create Category")}
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
