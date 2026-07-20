import React from "react";
import { cookies } from "next/headers";
import { CustomerStatusToggle } from "./customer-status-toggle";
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

type Customer = {
  id: number;
  email: string;
  status: string;
  role?: {
    name: string;
  };
};

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  
  let customers: Customer[] = [];
  let totalCount = 0;
  let fetchError = false;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/users/customers?page=${page}&limit=${limit}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      fetchError = true;
    } else {
      const result = await res.json();
      customers = result.data || [];
      totalCount = result.total || 0;
    }
  } catch (error) {
    console.error("Error fetching customers for admin:", error);
    fetchError = true;
  }

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const createPageUrl = (pageNumber: number) => {
    return `?page=${pageNumber}`;
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-xl p-6 mb-6 border border-yellow-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-foreground font-medium mt-1">View the list of registered users.</p>
        </div>
      </div>

      {fetchError && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          Failed to load customers. Make sure you are logged in as an admin.
        </div>
      )}

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && !fetchError ? (
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.email}</TableCell>
                  <TableCell className="capitalize">{customer.role?.name || "User"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {customer.status || "active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <CustomerStatusToggle
                      customerId={customer.id}
                      initialStatus={customer.status || "active"}
                      canDeactivate={customer.email !== process.env.ADMIN_EMAIL}
                    />
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
