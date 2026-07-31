import React from "react";
import { getCategoriesAdminAction } from "@/app/actions/category";
import { CategoryForm } from "./category-form";
import { CategoryActions, CategoryStatusToggle } from "./category-actions";
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
  searchParams: Promise<{ page?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const editId = params.edit;
  const limit = 10;

  const { data: categories = [], total = 0 } = await getCategoriesAdminAction(page, limit);

  const totalPages = Math.ceil(total / limit) || 1;
  const editCategory = editId ? categories.find((c: any) => c.id === Number(editId)) : null;

  const createPageUrl = (pageNumber: number) => {
    return `?page=${pageNumber}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-500 to-teal-100 rounded-xl p-6 mb-6 border border-teal-100 flex flex-col justify-center shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
        <p className="text-white mt-1">Manage product categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CategoryForm initialData={editCategory} key={editCategory?.id || 'new'} />
        </div>

        <div className="md:col-span-2 rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      <CategoryStatusToggle category={category} />
                    </TableCell>
                    <TableCell className="text-right">
                      <CategoryActions category={category} />
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
