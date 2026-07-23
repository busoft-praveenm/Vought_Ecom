"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { saveProductAction } from "./actions";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/dropdown-menu";

type ProductData = {
  name: string;
  sku: string;
  price: string;
  stock: string;
  categories: string[];
  brand: string;
  imageUrl: string;
  description: string;
};

export function ProductForm({ 
  initialData, 
  productId,
  categories = [],
  brands = []
}: { 
  initialData?: ProductData, 
  productId?: string,
  categories?: { id: number; name: string }[],
  brands?: { id: number; name: string }[]
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductData>(initialData || {
    name: "",
    sku: "",
    price: "",
    stock: "",
    categories: [],
    brand: "",
    imageUrl: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }
    if (!formData.brand) {
      toast.error("Please select a brand");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryIds: formData.categories.map(c => parseInt(c, 10)),
        brandId: formData.brand ? parseInt(formData.brand, 10) : undefined,
      };

      const result = await saveProductAction(payload, productId);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to save product");
      }

      toast.success(productId ? "Product updated successfully" : "Product created successfully");
      router.push("/dashboard/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-card border-border shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{productId ? "Edit Product" : "New Product"}</CardTitle>
        <CardDescription>Fill in the product details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Awesome Product"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU-12345 (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ or $)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categories <span className="text-red-500">*</span></Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-10 w-full items-center justify-between px-3 py-2 text-sm bg-background/50 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                  <span className="flex items-center gap-2 truncate">
                    {formData.categories.length > 0 ? `${formData.categories.length} selected` : "Select categories"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--anchor-width] min-w-[200px]">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((cat) => (
                      <DropdownMenuCheckboxItem
                        key={cat.id}
                        checked={formData.categories.includes(cat.id.toString())}
                        onCheckedChange={(checked) => {
                          setFormData(prev => {
                            const newCats = checked 
                              ? [...prev.categories, cat.id.toString()]
                              : prev.categories.filter(id => id !== cat.id.toString());
                            return { ...prev, categories: newCats };
                          });
                        }}
                        className="cursor-pointer"
                      >
                        {cat.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                    {categories.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">No categories found</div>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand <span className="text-red-500">*</span></Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-10 w-full items-center justify-between px-3 py-2 text-sm bg-background/50 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                  <span className="flex items-center gap-2 truncate">
                    {formData.brand ? brands.find(b => b.id.toString() === formData.brand)?.name || "Select a brand" : "Select a brand"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--anchor-width] min-w-[200px]">
                  <DropdownMenuRadioGroup value={formData.brand} onValueChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}>
                    <DropdownMenuLabel>Brands</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {brands.map(brand => (
                      <DropdownMenuRadioItem key={brand.id} value={brand.id.toString()} className="cursor-pointer">
                        {brand.name}
                      </DropdownMenuRadioItem>
                    ))}
                    {brands.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">No brands found</div>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
