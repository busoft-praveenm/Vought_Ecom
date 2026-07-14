"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/input";
import { Search } from "lucide-react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset page on new search
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full sm:w-[300px] pl-8 bg-background"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
}
