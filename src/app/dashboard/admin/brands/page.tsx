import React from "react";
import { getBrandsAdminAction } from "@/app/actions/brand";
import { BrandForm } from "./brand-form";
import { BrandActions, BrandStatusToggle } from "./brand-actions";
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

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const editId = params.edit;
  const limit = 10;

  const { results: brands = [], pagination: { totalPages = 1 } = {} } = await getBrandsAdminAction(page, limit);
  const editBrand = editId ? brands.find((b: any) => b.id === Number(editId)) : null;

  const createPageUrl = (pageNumber: number) => {
    return `?page=${pageNumber}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-500 to-teal-100 rounded-xl p-6 mb-6 border border-teal-100 flex flex-col justify-center shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-white">Brands</h1>
        <p className="text-white mt-1">Manage product brands.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BrandForm initialData={editBrand} key={editBrand?.id || 'new'} />
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
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No brands found.
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand: any) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.description || "-"}</TableCell>
                    <TableCell>
                      <BrandStatusToggle brand={brand} />
                    </TableCell>
                    <TableCell className="text-right">
                      <BrandActions brand={brand} />
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
