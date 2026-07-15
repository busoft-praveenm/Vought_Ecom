"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CreditCard, ShoppingCart, Users } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const isProducts = pathname.startsWith("/dashboard/products");
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
    </nav>
  );
}
