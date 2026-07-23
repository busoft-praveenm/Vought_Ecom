import React from "react";
import { ProductForm } from "../product-form";
import { getCategoriesAdminAction } from "@/app/actions/category";
import { getBrandsAdminAction } from "@/app/actions/brand";

export default async function NewProductPage() {
  const { data: categories = [] } = await getCategoriesAdminAction(1, 100);
  const { results: brands = [] } = await getBrandsAdminAction(1, 100);

  return (
    <div className="w-full animate-in fade-in duration-500 flex justify-center">
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
