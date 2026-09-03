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
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
  { name: "Overview", href: "/stats", icon: LayoutDashboard },
  { name: "Orders", href: "#", icon: ShoppingBag },
  { name: "Analytics", href: "#", icon: BarChart3 },
  { name: "Customers", href: "#", icon: Users },
  { name: "Shipping", href: "#", icon: Truck },
  { name: "Payments", href: "#", icon: CreditCard },
];

const FOOTER_ITEMS = [
  { name: "Support", href: "#", icon: LifeBuoy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar: Ultra-Minimalist */}
      <aside
        className={`h-screen transition-all duration-500 ease-in-out bg-card border-r border-border flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="font-bold text-white">d</span>
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold tracking-tight whitespace-nowrap"
              >
                dotman
              </motion.span>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all relative group ${
                  isActive
                    ? "text-white"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon size={20} className={isActive ? "text-primary" : "text-muted group-hover:text-white"} />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-border/50 space-y-2">
          {FOOTER_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? "text-white"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-primary" : "text-muted group-hover:text-white"} />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}

          <div className={`mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              NV
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate">Nav Venham</p>
                <p className="text-[10px] text-muted truncate">Premium Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Header: Floating & Minimal */}
        <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-md px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-white/5 text-muted transition-colors"
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="text-xl font-semibold tracking-tight">
              {MENU_ITEMS.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-medium text-muted">
              <span className="opacity-60">Range:</span>
              <span className="text-white">Apr 10 - Apr 16</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">Nav Venham</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                NV
              </div>
            </div>
          </div>
        </header>

        {/* Content: The Void */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-7xl mx-auto relative">
            {/* Background Depth Glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
