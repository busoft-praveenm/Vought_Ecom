"use client";

import React, { useState } from "react";
import { updateProductStatusAction, deleteProductAction } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Trash, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductStatusToggle({ product }: { product: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleActive = async () => {
    setIsLoading(true);
    const res = await updateProductStatusAction(product.id, { isActive: !product.isActive });
    setIsLoading(false);
    if (res.success) {
      toast.success(`Product ${!product.isActive ? "activated" : "deactivated"}.`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update product.");
    }
  };

  const isActive = product.isActive;

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

export function ProductActions({ product }: { product: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsLoading(true);
    const res = await deleteProductAction(product.id);
    setIsLoading(false);
    if (res.success) {
      toast.success("Product deleted.");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete product.");
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/dashboard/admin/products/${product.id}/edit`}>
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
