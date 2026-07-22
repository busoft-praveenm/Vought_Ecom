import React from "react";
import { ProductForm } from "../../product-form";
import { cookies } from "next/headers";
import { getCategoriesAction } from "@/app/actions/category";
import { getBrandsAction } from "@/app/actions/brand";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let initialData = null;
  let fetchError = false;
  let categories = [];
  let brands = [];

  try {
    const categoriesResponse = await getCategoriesAction(1, 100);
    categories = categoriesResponse.data || [];
    
    const brandsResponse = await getBrandsAction(1, 100);
    brands = brandsResponse.results || [];

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/products/${id}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const product = data.product; // Note: our backend returns { product, reviews }
      
      if (product) {
        initialData = {
          name: product.name || "",
          sku: product.sku || "",
          price: product.price ? String(product.price) : "",
          stock: product.stock ? String(product.stock) : "0",
          category: product.category ? String(product.category.id) : "",
          brand: product.brand ? String(product.brand.id) : "",
          imageUrl: product.imageUrl || "",
          description: product.description || "",
        };
      }
    } else {
      fetchError = true;
    }
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    fetchError = true;
  }

  if (fetchError || !initialData) {
    return (
      <div className="w-full flex justify-center mt-10">
        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 max-w-md w-full text-center">
          Failed to load product details.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500 flex justify-center">
      <ProductForm initialData={initialData} productId={id} categories={categories} brands={brands} />
    </div>
  );
}
