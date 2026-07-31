"use client";

import React, { useMemo } from "react";
import Masonry from "@/components/ui/Masonry";

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface CategoryMasonryProps {
  categories: Category[];
}

export function CategoryMasonry({ categories }: CategoryMasonryProps) {
  // Deterministic heights based on index or string hash for production-ready layout
  const masonryItems = useMemo(() => {
    return categories.map((cat, index) => {
      // Create a deterministic but varied height for masonry effect.
      // Base height is 300, max height is 550.
      const idHash = cat.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const heights = [300, 450, 500, 350, 550, 400];
      const deterministicHeight = heights[(index + idHash) % heights.length];

      return {
        id: cat.id.toString(),
        name: cat.name,
        // If there's no image, pass an empty string, the Masonry handles a fallback color
        img: cat.imageUrl || "", 
        url: `/dashboard/products?category=${cat.id}`,
        height: deterministicHeight,
      };
    });
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg bg-card/50 max-w-6xl mx-auto">
        No categories available to display.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 h-[1000px]">
      <Masonry 
        items={masonryItems} 
        animateFrom="bottom"
        stagger={0.1}
        duration={0.8}
        colorShiftOnHover={true}
      />
    </div>
  );
}
