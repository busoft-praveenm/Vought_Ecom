import React, { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/button";
import { Plus, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  currency?: string;
};

export default async function AdminProductsPage({
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/products?page=${page}&limit=10&search=${encodeURIComponent(search)}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      fetchError = true;
    } else {
      const data = await res.json();
      products = data.results || [];
      totalPages = data.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    fetchError = true;
  }

  const createPageUrl = (pageNumber: number) => {
    const urlParams = new URLSearchParams();
    if (pageNumber > 1) urlParams.set("page", pageNumber.toString());
    if (search) urlParams.set("search", search);
    return `?${urlParams.toString()}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store's inventory.</p>
        </div>
        
        <Link href="/dashboard/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {fetchError && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          Failed to load products. Make sure you are logged in as an admin.
        </div>
      )}

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {product.currency === 'INR' ? '₹' : '$'}{Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={page > 1 ? createPageUrl(page - 1) : "#"} 
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink 
                    href={createPageUrl(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

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
