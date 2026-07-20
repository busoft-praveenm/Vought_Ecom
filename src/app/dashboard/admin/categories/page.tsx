import React from "react";
import { getCategoriesAction } from "@/app/actions/category";
import { CategoryForm } from "./category-form";
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

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;

  const { data: categories = [], total = 0 } = await getCategoriesAction(page, limit);

  const totalPages = Math.ceil(total / limit) || 1;

  const createPageUrl = (pageNumber: number) => {
    return `?page=${pageNumber}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-xl p-6 mb-6 border border-yellow-100 flex flex-col justify-center shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-black">Categories</h1>
        <p className="text-black mt-1">Manage product categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CategoryForm />
        </div>

        <div className="md:col-span-2 rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${category.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
