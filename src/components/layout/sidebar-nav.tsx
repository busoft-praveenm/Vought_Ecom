"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Activity, LayoutGrid, ShoppingCart, Users, Package, Bookmark, Receipt, Building } from "lucide-react";

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  const isProducts = pathname.startsWith("/dashboard/products") && !pathname.startsWith("/dashboard/admin/products");
  const isAdminProducts = pathname.startsWith("/dashboard/admin/products");
  const isAdminCustomers = pathname.startsWith("/dashboard/admin/customers");
  const isWarehouses = pathname.startsWith("/dashboard/admin/warehouses");
  const isOrders = pathname.startsWith("/dashboard/orders");
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
          {t('Overview')}
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
        {t('Products')}
      </Link>
      <Link 
        href="/dashboard/orders" 
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          isOrders 
            ? "bg-zinc-800/80 text-zinc-50" 
            : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
        }`}
      >
        <Receipt className={`h-5 w-5 ${isOrders ? "text-zinc-50" : ""}`} />
        {t('Orders')}
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
            {t('Categories')}
          </Link>
          <Link 
            href="/dashboard/admin/brands" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/dashboard/admin/brands")
                ? "bg-zinc-800/80 text-zinc-50" 
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
            }`}
          >
            <Bookmark className={`h-5 w-5 ${pathname.startsWith("/dashboard/admin/brands") ? "text-zinc-50" : ""}`} />
            {t('Brands')}
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
            {t('Customers')}
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
            {t('ProductsInventory')}
          </Link>
          <Link 
            href="/dashboard/admin/warehouses" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isWarehouses 
                ? "bg-zinc-800/80 text-zinc-50" 
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
            }`}
          >
            <Building className={`h-5 w-5 ${isWarehouses ? "text-zinc-50" : ""}`} />
            {t('Warehouses')}
          </Link>
        </>
      )}
    </nav>
  );
}
