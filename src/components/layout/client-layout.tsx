"use client";

import React, { useState, createContext, useContext } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function DashboardClientLayout({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <div className="flex min-h-screen flex-col w-full bg-muted/40">
        {topbar}
        <div className="flex flex-1">
          <aside
            className={`fixed top-16 bottom-0 left-0 z-20 w-64 flex-col border-r border-zinc-800 bg-[#494F55] transition-transform duration-300 ease-in-out sm:flex ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebar}
          </aside>

          <div
            className={`flex flex-col w-full transition-all duration-300 ease-in-out pt-4 ${
              isOpen ? "sm:pl-64" : "pl-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
