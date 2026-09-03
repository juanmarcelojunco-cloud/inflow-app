"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Users,
  Truck,
  CreditCard,
  LifeBuoy,
  Settings,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { name: "Overview", href: "/stats", icon: LayoutDashboard },
  { name: "Orders", href: "#", icon: ShoppingBag },
  { name: "Sales Analytics", href: "#", icon: BarChart3 },
  { name: "Customer Management", href: "#", icon: Users },
  { name: "Shipping", href: "#", icon: Truck },
  { name: "Payments", href: "#", icon: CreditCard },
];

const FOOTER_ITEMS = [
  { name: "Help and Support", href: "#", icon: LifeBuoy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-screen transition-all duration-300 ease-in-out bg-[#0A0E13] border-r border-[#1D2632] flex flex-col ${
          isSidebarOpen ? "w-[260px]" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-[80px] flex items-center px-6 border-b border-[#1D2632]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="font-bold text-white">d</span>
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight"
              >
                dotman
              </motion.span>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-[#8B95A7] hover:bg-[#1D2632] hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-[#8B95A7] group-hover:text-white"} />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <ChevronRight size={14} className="ml-auto text-white/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1D2632] space-y-1">
          {FOOTER_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-[#8B95A7] hover:bg-[#1D2632] hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-[#8B95A7] group-hover:text-white"} />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}

          {/* User Profile */}
          <div className="mt-4 p-3 rounded-xl bg-[#131A22] border border-[#1D2632] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              NV
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">Nav Venham</p>
                <p className="text-[10px] text-[#8B95A7] truncate">Premium Member</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[80px] border-b border-[#1D2632] bg-[#0B0F14] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-[#1D2632] text-[#8B95A7] transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold">
              {MENU_ITEMS.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131A22] border border-[#1D2632] text-xs text-[#8B95A7]">
              <span className="opacity-60">Range:</span>
              <span className="text-white font-medium">Apr 10 - Apr 16</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
              NV
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0B0F14]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
