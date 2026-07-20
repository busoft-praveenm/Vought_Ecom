import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/pagination";
import { generatePagination } from "@/lib/pagination";
import { Card, CardContent, CardFooter } from "@/components/card";
import { Button } from "@/components/button";
import { Star, ShoppingCart } from "lucide-react";
import { ProductSearch, ActiveFiltersBreadcrumbs } from "./search-form";
import { getCategoriesAction } from "@/app/actions/category";

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
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const category = params.category || "";

  let products: Product[] = [];
  let categories: { id: number; name: string }[] = [];
  let totalPages = 1;
  let fetchError = false;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/products?page=${page}&limit=10&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store",
    });

    const catRes = await getCategoriesAction(1, 100);
    categories = catRes.data || [];

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
    const urlParams = new URLSearchParams();
    if (pageNumber > 1) urlParams.set("page", pageNumber.toString());
    if (search) urlParams.set("search", search);
    if (category) urlParams.set("category", category);
    return `?${urlParams.toString()}`;
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-xl p-6 mb-6 border border-yellow-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Products</h1>
          <p className="text-foreground font-medium mt-1">Browse our premium selection of products.</p>
        </div>

        <Suspense fallback={<div className="h-10 w-full sm:w-[300px] bg-muted animate-pulse rounded-md"></div>}>
          <ProductSearch categories={categories} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <ActiveFiltersBreadcrumbs categories={categories} />
      </Suspense>

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
            <Link key={product.id} href={`/dashboard/products/${product.id}`} className="block h-full">
              <Card className="group overflow-hidden flex flex-col hover:shadow-lg transition-all border-border/50 bg-card hover:border-primary/50 cursor-pointer h-full">
                <div className="relative w-full aspect-square bg-muted/30 overflow-hidden p-4 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/50 rounded-md flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-300">
                      <span className="text-xs uppercase tracking-widest">
                        {typeof product.category === 'string' ? product.category : (product.category as any)?.name || '-'}
                      </span>
                    </div>
                  )}

                  {product.stock === 0 ? (
                    <span className="absolute top-2 right-2 z-10 px-2 py-1 text-[10px] font-bold uppercase rounded-sm bg-destructive text-destructive-foreground">
                      Out of Stock
                    </span>
                  ) : product.stock < 20 ? (
                    <span className="absolute top-2 right-2 z-10 px-2 py-1 text-[10px] font-bold uppercase rounded-sm bg-red-500 text-white shadow-sm">
                      Low Stock
                    </span>
                  ) : null}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest">
                    {product.category ? (typeof product.category === 'string' ? product.category : (product.category as any).name) : "Product"}
                  </div>
                  <h3 className="font-bold text-xl leading-tight line-clamp-2 text-foreground mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3 mt-auto">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.averageRating || 0)
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
                  {/* We omit the Add to cart button here or make it a div to avoid nested links */}
                  <div className="w-full flex items-center justify-center h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                    <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                    {product.status === 'Out of Stock' ? 'Out of Stock' : 'View Details'}
                  </div>
                </CardFooter>
              </Card>
            </Link>
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

              {generatePagination(page, totalPages).map((p, i) => {
                if (p === '...') {
                  return (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                const pageNumber = p as number;
                return (
                  <PaginationItem key={`page-${pageNumber}`}>
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
