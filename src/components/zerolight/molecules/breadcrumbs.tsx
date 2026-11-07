"use client";

import React from "react";
import { useZeroLight } from "../context";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const { tokens, scaled } = useZeroLight();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 select-none ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.label}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={{ fontSize: `${scaled.sublabelFontSize}px` }}
                className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontSize: `${scaled.sublabelFontSize}px`,
                  color: isLast ? tokens.textIconColor : undefined,
                }}
                className={`font-semibold whitespace-nowrap ${isLast ? "" : "text-neutral-500"}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
