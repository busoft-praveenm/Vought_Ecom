"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutGrid, ShoppingCart, Users, Package } from "lucide-react";

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const isProducts = pathname.startsWith("/dashboard/products") && !pathname.startsWith("/dashboard/admin/products");
  const isAdminProducts = pathname.startsWith("/dashboard/admin/products");
  const isAdminCustomers = pathname.startsWith("/dashboard/admin/customers");
  const isOverview = pathname === "/dashboard";

  return (
    <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
      {isAdmin && (
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isOverview 
              ? "bg-zinc-800/80 text-zinc-50" 
              : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
          }`}
        >
          <Activity className={`h-5 w-5 ${isOverview ? "text-zinc-50" : ""}`} />
          Overview
        </Link>
      )}

      <Link 
        href="/dashboard/products" 
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          isProducts 
            ? "bg-zinc-800/80 text-zinc-50" 
            : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
        }`}
      >
        <ShoppingCart className={`h-5 w-5 ${isProducts ? "text-zinc-50" : ""}`} />
        Products
      </Link>
      {isAdmin && (
        <>
          <Link 
            href="/dashboard/admin/categories" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/dashboard/admin/categories")
                ? "bg-zinc-800/80 text-zinc-50" 
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
            }`}
          >
            <LayoutGrid className={`h-5 w-5 ${pathname.startsWith("/dashboard/admin/categories") ? "text-zinc-50" : ""}`} />
            Categories
          </Link>
          <Link 
            href="/dashboard/admin/customers" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isAdminCustomers 
                ? "bg-zinc-800/80 text-zinc-50" 
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
            }`}
          >
            <Users className={`h-5 w-5 ${isAdminCustomers ? "text-zinc-50" : ""}`} />
            Customers
          </Link>
          <Link 
            href="/dashboard/admin/products" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isAdminProducts 
                ? "bg-zinc-800/80 text-zinc-50" 
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
            }`}
          >
            <Package className={`h-5 w-5 ${isAdminProducts ? "text-zinc-50" : ""}`} />
            Products Inventory
          </Link>
        </>
      )}
    </nav>
  );
}
