import React from "react";
import { ProductForm } from "../product-form";
import { getCategoriesAction } from "@/app/actions/category";

export default async function NewProductPage() {
  const { data: categories = [] } = await getCategoriesAction(1, 100);

  return (
    <div className="w-full animate-in fade-in duration-500 flex justify-center">
      <ProductForm categories={categories} />
    </div>
  );
}
