import React, { Suspense } from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";
import { Card, CardContent, CardFooter } from "@/components/card";
import { Button } from "@/components/button";
import { Star, ShoppingCart } from "lucide-react";
import { ProductSearch } from "./search-form";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  imageUrl?: string;
  averageRating?: number;
  reviews?: number;
  currency?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  
  let products: Product[] = [];
  let totalPages = 1;
  let fetchError = false;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080';
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    console.log("Token in ProductsPage:", token ? "Token Exists" : "No Token");

    const res = await fetch(`${backendUrl}/products?page=${page}&limit=10&search=${encodeURIComponent(search)}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Backend returned status ${res.status}.`);
      fetchError = true;
    } else {
      const data = await res.json();
      products = data.results || [];
      totalPages = data.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error("Network error fetching products:", error);
    fetchError = true;
  }

  // Fallback data removed per user request. 
  // If the API fails or returns no data, we will just show the empty state.

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (pageNumber > 1) params.set("page", pageNumber.toString());
    if (search) params.set("search", search);
    return `?${params.toString()}`;
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Browse our premium selection of products.</p>
        </div>
        
        <Suspense fallback={<div className="h-10 w-full sm:w-[300px] bg-muted animate-pulse rounded-md"></div>}>
          <ProductSearch />
        </Suspense>
      </div>

      {fetchError && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          Failed to load products from the server. Please try logging in again.
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg bg-card/50">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all border-border/50 bg-card hover:border-primary/50 cursor-pointer">
              <div className="relative w-full aspect-square bg-muted/30 overflow-hidden p-4 flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300 shadow-sm"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/50 rounded-md flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs uppercase tracking-widest">{product.category}</span>
                  </div>
                )}
                
                {product.status !== 'Active' && (
                  <span className={`absolute top-2 right-2 z-10 px-2 py-1 text-[10px] font-bold uppercase rounded-sm ${
                    product.status === 'Out of Stock' ? 'bg-destructive text-destructive-foreground' : 'bg-yellow-500 text-white'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>
              
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.averageRating || 0) 
                            ? "fill-orange-400 text-orange-400" 
                            : "fill-muted text-muted"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"})
                  </span>
                </div>
                
                <div className="mt-auto pt-3 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">
                      {product.currency === 'INR' ? '₹' : '$'}{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">In stock: {product.stock}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full h-9 text-xs font-semibold" 
                  disabled={product.status === 'Out of Stock'}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                  {product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 mb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={page > 1 ? createPageUrl(page - 1) : "#"} 
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      href={createPageUrl(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext 
                  href={page < totalPages ? createPageUrl(page + 1) : "#"} 
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
