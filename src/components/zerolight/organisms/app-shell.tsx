"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export interface NavChildItem {
  id: string;
  label: string;
  active?: boolean;
  badge?: string;
  external?: boolean;
  onClick?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
  external?: boolean;
  children?: NavChildItem[];
  onClick?: () => void;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface AppShellProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navItems?: NavItem[];
  navSections?: NavSection[];
  sidebarWidgets?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  hideHeader?: boolean;
  hideCollapseToggle?: boolean;
  activeIndicator?: "solid" | "left-bar";
  accentColor?: string;
  footerAction?: React.ReactNode;
  className?: string;
}

export function AppShell({
  brandName = "ZeroLight",
  brandLogo,
  navItems = [],
  navSections,
  sidebarWidgets,
  headerRight,
  children,
  defaultCollapsed = false,
  hideHeader = false,
  hideCollapseToggle = false,
  activeIndicator = "solid",
  accentColor = "#2563EB",
  footerAction,
  className = "",
}: AppShellProps) {
  const { tokens, scaled } = useZeroLight();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sections: NavSection[] = navSections ?? [{ items: navItems }];

  const renderNavItem = (item: NavItem, mobile = false) => {
    const isActive = item.active;
    const isLeftBar = activeIndicator === "left-bar";

    return (
      <div key={item.id} className="space-y-0.5">
        <button
          type="button"
          onClick={() => {
            item.onClick?.();
            if (mobile) setIsMobileOpen(false);
          }}
          title={!mobile && isCollapsed ? item.label : undefined}
          style={{
            borderRadius: `${isLeftBar ? 6 : scaled.scaledRadius}px`,
            backgroundColor: isActive
              ? isLeftBar
                ? scaled.isDarkSurface
                  ? "rgba(37, 99, 235, 0.14)"
                  : "rgba(37, 99, 235, 0.06)"
                : tokens.primaryButtonColor
              : "transparent",
            color: isActive
              ? isLeftBar
                ? accentColor
                : scaled.primaryActionTextColor
              : tokens.textIconColor,
          }}
          className={`relative w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
            !isActive ? "opacity-75 hover:opacity-100" : ""
          } ${!mobile && isCollapsed ? "justify-center" : ""}`}
        >
          {isActive && isLeftBar && (
            <span
              style={{ backgroundColor: accentColor }}
              className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
            />
          )}
          <span
            style={{ color: isActive && isLeftBar ? accentColor : undefined }}
            className="shrink-0"
          >
            {item.icon}
          </span>
          {(mobile || !isCollapsed) && (
            <span className="truncate flex-1 text-left">{item.label}</span>
          )}
          {(mobile || !isCollapsed) && item.external && (
            <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
          )}
          {(mobile || !isCollapsed) && item.badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              {item.badge}
            </span>
          )}
        </button>

        {/* Nested Sub-Items with Vertical Indentation Guide */}
        {(mobile || !isCollapsed) && item.children && item.children.length > 0 && (
          <div
            style={{ borderColor: tokens.universalBorderColor }}
            className="ml-5 pl-3 border-l space-y-0.5 py-0.5"
          >
            {item.children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => {
                  child.onClick?.();
                  if (mobile) setIsMobileOpen(false);
                }}
                style={{
                  borderRadius: `${isLeftBar ? 6 : scaled.scaledOptionRadius}px`,
                  color: child.active ? accentColor : tokens.textIconColor,
                  backgroundColor: child.active
                    ? scaled.isDarkSurface
                      ? "rgba(37, 99, 235, 0.14)"
                      : "rgba(37, 99, 235, 0.06)"
                    : "transparent",
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs transition-colors cursor-pointer text-left ${
                  child.active ? "font-semibold" : "font-medium opacity-75 hover:opacity-100"
                }`}
              >
                <span className="truncate">{child.label}</span>
                {child.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    {child.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSections = (mobile = false) => (
    <nav className="p-3 space-y-5">
      {sections.map((section, sIdx) => (
        <div key={section.title || sIdx} className="space-y-1">
          {section.title && (mobile || !isCollapsed) && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {section.title}
            </div>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => renderNavItem(item, mobile))}
          </div>
        </div>
      ))}
      {(mobile || !isCollapsed) && sidebarWidgets && (
        <div className="pt-1">{sidebarWidgets}</div>
      )}
    </nav>
  );

  return (
    <div
      style={{
        backgroundColor: scaled.isDarkSurface ? "#09090B" : tokens.hoverBackplateTint || "#F8FAFC",
        color: tokens.textIconColor,
      }}
      className={`min-h-screen flex flex-col antialiased ${className}`}
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
          <span style={{ color: tokens.textIconColor }} className="font-bold text-sm tracking-tight">
            {brandName}
          </span>
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
          {/* Top Brand & Sections */}
          <div className="overflow-y-auto flex-1">
            {(brandLogo || !hideCollapseToggle) && (
              <div
                style={{ borderColor: tokens.universalBorderColor }}
                className="h-14 px-4 flex items-center justify-between border-b"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {brandLogo}
                  {!isCollapsed && (
                    <span
                      style={{ color: tokens.textIconColor }}
                      className="font-extrabold text-sm tracking-tight truncate"
                    >
                      {brandName}
                    </span>
                  )}
                </div>
                {!hideCollapseToggle && (
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-7 h-7 rounded-lg text-neutral-400 hover:text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            )}

            {renderSections(false)}
          </div>

          {/* Footer Utility / User Dock */}
          {footerAction && (
            <div
              style={{ borderColor: tokens.universalBorderColor }}
              className="p-3 border-t"
            >
              {footerAction}
            </div>
          )}
        </aside>

        {/* Content Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Desktop Top Header */}
          {!hideHeader && (
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
          )}

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-8">{children}</main>
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
              style={{ backgroundColor: tokens.universalFillColor }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col justify-between p-3 z-10 overflow-y-auto"
            >
              <div>
                <div
                  style={{ borderColor: tokens.universalBorderColor }}
                  className="flex items-center justify-between pb-3 px-2 border-b"
                >
                  <div className="flex items-center gap-2">
                    {brandLogo}
                    <span style={{ color: tokens.textIconColor }} className="font-bold text-sm">
                      {brandName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderSections(true)}
              </div>
              {footerAction && (
                <div
                  style={{ borderColor: tokens.universalBorderColor }}
                  className="p-3 border-t"
                >
                  {footerAction}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
