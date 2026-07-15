import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let cartCount = 0;
  try {
    if (token) {
      const res = await fetch(`http://localhost:8080/cart`, {
        headers: {
          ...(token ? { "Cookie": `access_token=${token}` } : {})
        },
        cache: 'no-store' // Keep it fresh
      });
      if (res.ok) {
        const data = await res.json();
        // Count number of distinct products, or you can sum quantity
        cartCount = data?.items?.length || 0; 
      }
    }
  } catch (err) {
    console.error("Failed to fetch cart in layout", err);
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-zinc-800 bg-[#494F55] sm:flex">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6 relative">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes logo-shimmer {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .animate-logo-shimmer {
              background: linear-gradient(
                to right,
                #FF9933 0%,
                #FFFFFF 33%,
                #138808 66%,
                #FF9933 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              animation: logo-shimmer 4s linear infinite;
            }
            .dark .animate-logo-shimmer {
              background: linear-gradient(
                to right,
                #FF9933 0%,
                #FFFFFF 33%,
                #138808 66%,
                #FF9933 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
            }
          `}} />
          <span className="text-xl font-bold tracking-tight animate-logo-shimmer">
            Vought India
          </span>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg hover:bg-zinc-800/80 bg-zinc-800/40 px-3 py-2 text-zinc-50 transition-all">
            <Activity className="h-5 w-5 text-zinc-50" />
            Overview
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-50 hover:bg-zinc-800/50">
            <Users className="h-5 w-5" />
            Customers
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-50 hover:bg-zinc-800/50">
            <DollarSign className="h-5 w-5" />
            Products
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-50 hover:bg-zinc-800/50">
            <CreditCard className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:pl-64 w-full">
        {/* We use the custom Topbar component */}
        <Topbar cartCount={cartCount} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
