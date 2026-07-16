"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CreditCard, ShoppingCart, Users, Shield } from "lucide-react";

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const isProducts = pathname.startsWith("/dashboard/products") && !pathname.startsWith("/dashboard/admin/products");
  const isAdminProducts = pathname.startsWith("/dashboard/admin/products");
  const isOverview = pathname === "/dashboard";

  return (
    <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
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
      <Link 
        href="#" 
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-50 hover:bg-zinc-800/50"
      >
        <Users className="h-5 w-5" />
        Customers
      </Link>
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
      <Link 
        href="#" 
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-50 hover:bg-zinc-800/50"
      >
        <CreditCard className="h-5 w-5" />
        Settings
      </Link>
      {isAdmin && (
        <Link 
          href="/dashboard/admin/products" 
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isAdminProducts 
              ? "bg-zinc-800/80 text-zinc-50" 
              : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
          }`}
        >
          <Shield className={`h-5 w-5 ${isAdminProducts ? "text-zinc-50" : ""}`} />
          Admin Products
        </Link>
      )}
    </nav>
  );
}
