"use client";

import React, { useState } from "react";
import { Shield, Check } from "lucide-react";
import { useZeroLight } from "../context";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export type PermissionAction = "read" | "create" | "update" | "delete" | "approve";

export interface PermissionResourceRow {
  resource: string;
  description?: string;
  allowed: Record<PermissionAction, boolean>;
}

export interface PermissionMatrixProps {
  roleName?: string;
  resources: PermissionResourceRow[];
  actions?: PermissionAction[];
  onChange?: (updated: PermissionResourceRow[]) => void;
  onSave?: (updated: PermissionResourceRow[]) => void;
  readOnly?: boolean;
  className?: string;
}

const DEFAULT_ACTIONS: PermissionAction[] = ["read", "create", "update", "delete", "approve"];

/**
 * Interactive RBAC resource-by-action permission matrix for B2B SaaS & Enterprise administration.
 */
export function PermissionMatrix({
  roleName = "Operations Manager",
  resources: initialResources,
  actions = DEFAULT_ACTIONS,
  onChange,
  onSave,
  readOnly = false,
  className = "",
}: PermissionMatrixProps) {
  const { tokens, scaled } = useZeroLight();
  const [rows, setRows] = useState<PermissionResourceRow[]>(initialResources);
  const [saved, setSaved] = useState(false);

  const toggle = (resource: string, action: PermissionAction) => {
    if (readOnly) return;
    const next = rows.map((r) =>
      r.resource === resource
        ? { ...r, allowed: { ...r.allowed, [action]: !r.allowed[action] } }
        : r
    );
    setRows(next);
    setSaved(false);
    onChange?.(next);
  };

  return (
    <div
      style={{
        backgroundColor: tokens.universalFillColor,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${Math.max(1, tokens.borderWidth)}px`,
        borderStyle: "solid",
        borderRadius: `${scaled.scaledCardRadius}px`,
        boxShadow: scaled.cardShadow,
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
      className={`overflow-hidden ${className}`}
    >
      <div
        style={{ borderColor: tokens.universalBorderColor }}
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 opacity-75" />
          <h3 className="text-sm font-semibold">Role Permissions</h3>
          <Badge variant="healthy" size="xs">
            {roleName}
          </Badge>
        </div>
        {!readOnly && onSave && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onSave(rows);
              setSaved(true);
            }}
            iconLeft={saved ? <Check className="w-3.5 h-3.5" /> : undefined}
          >
            {saved ? "Saved" : "Save Policy"}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: tokens.hoverBackplateTint, borderColor: tokens.universalBorderColor }} className="border-b">
              <th className="text-left px-4 py-2.5 font-semibold">Resource</th>
              {actions.map((a) => (
                <th key={a} className="text-center px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] opacity-75">
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.resource} style={{ borderColor: tokens.universalBorderColor }} className="border-b last:border-b-0">
                <td className="px-4 py-2.5">
                  <div className="font-semibold">{row.resource}</div>
                  {row.description && <div className="text-[11px] opacity-60">{row.description}</div>}
                </td>
                {actions.map((action) => {
                  const checked = Boolean(row.allowed[action]);
                  return (
                    <td key={action} className="text-center px-3 py-2.5">
                      <button
                        type="button"
                        disabled={readOnly}
                        aria-label={`${row.resource} ${action}`}
                        aria-pressed={checked}
                        onClick={() => toggle(row.resource, action)}
                        style={{
                          backgroundColor: checked ? tokens.primaryButtonColor : tokens.universalFillColor,
                          borderColor: checked ? tokens.primaryButtonColor : tokens.universalBorderColor,
                          borderRadius: `${Math.max(4, scaled.scaledOptionRadius)}px`,
                          color: checked ? "#FFFFFF" : tokens.textIconColor,
                        }}
                        className="w-6 h-6 inline-flex items-center justify-center border cursor-pointer disabled:opacity-50"
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
