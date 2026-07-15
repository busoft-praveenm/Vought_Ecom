"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, User, LogOut, ShoppingCart } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/dropdown-menu";

export const Topbar = ({ cartCount = 0 }: { cartCount?: number }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080';
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        // credentials: "omit" or "include", depending on your CORS setup.
      });
      // Redirect to login page after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#494F55] backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <form className="hidden sm:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 pl-8 shadow-none md:w-2/3 lg:w-[300px] rounded-full transition-all hover:bg-zinc-800 focus:bg-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/cart">
          <Button variant="ghost" size="icon" className="relative rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>

        <div className="ml-2 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="secondary" size="icon" className="rounded-full overflow-hidden bg-primary/10 hover:bg-primary/20 border border-primary/20 cursor-pointer">
                <User className="h-5 w-5 text-zinc-50" />
                <span className="sr-only">User Profile</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
