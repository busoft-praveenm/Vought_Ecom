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
  PaginationEllipsis,
} from "@/components/pagination";
import { generatePagination } from "@/lib/pagination";
import { ProductSearch, ActiveFiltersBreadcrumbs } from "../../products/search-form";
import { getCategoriesAdminAction } from "@/app/actions/category";
import { ProductActions, ProductStatusToggle } from "./product-actions";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories: any[];
  status: string;
  isActive?: boolean;
  currency?: string;
};

export default async function AdminProductsPage({
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

    const catRes = await getCategoriesAdminAction(1, 100);
    categories = catRes.data || [];

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
    if (category) urlParams.set("category", category);
    return `?${urlParams.toString()}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-500 to-teal-100 rounded-xl p-6 mb-6 border border-teal-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Products Inventory</h1>
          <p className="text-white font-medium mt-1">Manage your store's inventory.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start sm:items-center">
          <Suspense fallback={<div className="h-10 w-full sm:w-[300px] bg-muted animate-pulse rounded-md"></div>}>
            <ProductSearch categories={categories} />
          </Suspense>

          <Link href="/dashboard/admin/products/new">
            <Button className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={null}>
        <ActiveFiltersBreadcrumbs categories={categories} />
      </Suspense>

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
              <TableHead className="text-center">Status</TableHead>
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
                  <TableCell>{product.categories?.length > 0 ? product.categories.map((c: any) => c.name).join(', ') : "-"}</TableCell>
                  <TableCell className="text-right">
                    {product.currency === 'INR' ? '₹' : '$'}{Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <ProductStatusToggle product={product} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductActions product={product} />
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

              {generatePagination(page, totalPages).map((p, i) => {
                if (p === '...') {
                  return (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={`page-${p}`}>
                    <PaginationLink
                      href={createPageUrl(p as number)}
                      isActive={page === p}
                    >
                      {p}
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
