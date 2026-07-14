import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold tracking-tight text-primary">Ecom Admin</span>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg hover:bg-primary/10 px-3 py-2 text-primary transition-all">
            <Activity className="h-5 w-5" />
            Overview
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent">
            <Users className="h-5 w-5" />
            Customers
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent">
            <DollarSign className="h-5 w-5" />
            Products
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent">
            <CreditCard className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        {/* We use the custom Topbar component */}
        <Topbar />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
