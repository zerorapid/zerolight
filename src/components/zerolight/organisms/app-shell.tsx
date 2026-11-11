"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

export interface AppShellProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navItems?: NavItem[];
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  footerAction?: React.ReactNode;
  className?: string;
}

export function AppShell({
  brandName = "ZeroLight",
  brandLogo,
  navItems = [],
  headerRight,
  children,
  defaultCollapsed = false,
  footerAction,
  className = "",
}: AppShellProps) {
  const { tokens, scaled } = useZeroLight();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      style={{ backgroundColor: tokens.hoverBackplateTint || "#F8FAFC" }}
      className={`min-h-screen flex flex-col antialiased text-neutral-900 ${className}`}
    >
      {/* Mobile Top Header */}
      <header
        style={{
          borderColor: tokens.universalBorderColor,
          backgroundColor: tokens.universalFillColor,
        }}
        className="lg:hidden border-b px-4 h-14 flex items-center justify-between sticky top-0 z-30 shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          {brandLogo}
          <span className="font-bold text-sm tracking-tight">{brandName}</span>
        </div>
        <div>{headerRight}</div>
      </header>

      {/* Main Framework Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <aside
          style={{
            borderColor: tokens.universalBorderColor,
            borderRightWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
            width: isCollapsed ? 68 : 240,
            transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="hidden lg:flex flex-col justify-between border-r shrink-0 select-none z-20"
        >
          {/* Top Brand & Toggle */}
          <div>
            <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {brandLogo}
                {!isCollapsed && (
                  <span className="font-extrabold text-sm tracking-tight text-neutral-900 truncate">
                    {brandName}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-7 h-7 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = item.active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    title={isCollapsed ? item.label : undefined}
                    style={{
                      borderRadius: `${scaled.scaledRadius}px`,
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Utility / User Dock */}
          {footerAction && (
            <div className="p-3 border-t border-neutral-100">
              {footerAction}
            </div>
          )}
        </aside>

        {/* Content Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Desktop Top Header */}
          <header
            style={{
              borderColor: tokens.universalBorderColor,
              borderBottomWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
            }}
            className="hidden lg:flex items-center justify-between px-6 h-16 border-b shrink-0 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Workspace
              </span>
            </div>
            <div className="flex items-center gap-3">{headerRight}</div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-7">{children}</main>
        </div>
      </div>

      {/* Mobile Drawer Slide-out */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={scaled.motionConfig.drawerTransition}
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    {brandLogo}
                    <span className="font-bold text-sm">{brandName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="py-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.onClick?.();
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        item.active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              {footerAction && <div>{footerAction}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
