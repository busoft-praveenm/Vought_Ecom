"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/dropdown-menu";

export const Topbar = () => {
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <form className="hidden sm:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-[300px] rounded-full transition-all hover:bg-muted/50 focus:bg-background"
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        
        <div className="ml-2 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="secondary" size="icon" className="rounded-full overflow-hidden bg-primary/10 cursor-pointer">
                <User className="h-5 w-5 text-primary" />
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
