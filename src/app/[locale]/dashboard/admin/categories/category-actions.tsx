"use client";

import React, { useState } from "react";
import { updateCategoryAction, deleteCategoryAction } from "@/app/actions/category";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Trash, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CategoryStatusToggle({ category }: { category: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleActive = async () => {
    setIsLoading(true);
    const res = await updateCategoryAction(category.id, { isActive: !category.isActive });
    setIsLoading(false);
    if (res.success) {
      toast.success(`Category ${!category.isActive ? "activated" : "deactivated"}.`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update category.");
    }
  };

  const isActive = category.isActive;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={isLoading}
      onClick={handleToggleActive}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        data-state={isActive ? "checked" : "unchecked"}
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          isActive ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function CategoryActions({ category }: { category: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? Products might lose their category association.")) return;
    setIsLoading(true);
    const res = await deleteCategoryAction(category.id);
    setIsLoading(false);
    if (res.success) {
      toast.success("Category deleted.");
    } else {
      toast.error(res.error || "Failed to delete category.");
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/dashboard/admin/categories?edit=${category.id}`}>
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={isLoading} title="Edit">
          <Pencil className="w-4 h-4" />
        </Button>
      </Link>
      <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isLoading} className="h-8 w-8" title="Delete">
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
}
