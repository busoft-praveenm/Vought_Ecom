"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/input";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/dropdown-menu";

export function ProductSearch({ categories = [] }: { categories?: { id: number; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(',') : []
  );

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    const catStr = searchParams.get("category");
    setSelectedCategories(catStr ? catStr.split(',') : []);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        const params = new URLSearchParams(searchParams);
        if (search) params.set("search", search);
        else params.delete("search");

        if (selectedCategories.length > 0) params.set("category", selectedCategories.join(','));
        else params.delete("category");

        params.delete("page");
        router.push(`?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, selectedCategories, router, searchParams]);

  const applyFilters = (searchVal: string, catVals: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (searchVal) params.set("search", searchVal);
    else params.delete("search");

    if (catVals.length > 0) params.set("category", catVals.join(','));
    else params.delete("category");

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, selectedCategories);
  };

  const toggleCategory = (catId: string) => {
    const newCats = selectedCategories.includes(catId)
      ? selectedCategories.filter(id => id !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(newCats);
    applyFilters(search, newCats);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-full sm:w-[180px] items-center justify-between px-3 py-2 text-sm bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Filter by Category"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((cat) => (
              <DropdownMenuCheckboxItem
                key={cat.id}
                checked={selectedCategories.includes(cat.id.toString())}
                onCheckedChange={() => toggleCategory(cat.id.toString())}
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

      <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground mt-0.5" />
        <Input
          type="search"
          placeholder="Search products..."
          className="h-10 w-full sm:w-[300px] pl-8 bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
}

export function ActiveFiltersBreadcrumbs({ categories = [] }: { categories?: { id: number; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryStr = searchParams.get("category");
  const selectedCategories = categoryStr ? categoryStr.split(',') : [];

  if (selectedCategories.length === 0) return null;

  const removeCategory = (catId: string) => {
    const newCats = selectedCategories.filter(id => id !== catId);
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");

    if (newCats.length > 0) params.set("category", newCats.join(','));
    else params.delete("category");

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");

    params.delete("category");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 bg-[#494F55] p-3 rounded-lg border border-transparent shadow-sm">
      <span className="text-sm font-medium text-zinc-200 mr-1">Active filters:</span>
      {selectedCategories.map(catId => {
        const cat = categories.find(c => c.id.toString() === catId);
        if (!cat) return null;
        return (
          <button
            key={catId}
            type="button"
            onClick={() => removeCategory(catId)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-black border border-yellow-600 transition-all hover:bg-yellow-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
          >
            {cat.name}
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {cat.name} filter</span>
          </button>
        );
      })}
      {selectedCategories.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-zinc-300 hover:text-white underline underline-offset-2 px-2 ml-1 cursor-pointer"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
