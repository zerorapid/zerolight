"use client";

import React, { useState, useEffect } from "react";
import { useZeroLight } from "../context";
import { Server, Globe, Search, X, Check, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "../atoms/badge";

export interface NodeRecord {
  id: string;
  name: string;
  region: string;
  role: "API Gateway" | "Worker" | "Cache" | "Ingress" | "Data Sync";
  status: "healthy" | "degraded" | "syncing" | "critical";
  cpuMemory: string;
  latency: string;
}

export interface DataTableProps {
  nodes?: NodeRecord[];
  onSelectNode?: (nodeId: string) => void;
  editable?: boolean;
  onUpdateNode?: (nodeId: string, patch: Partial<NodeRecord>) => void;
  className?: string;
}

const DEFAULT_NODES: NodeRecord[] = [
  { id: "node-1", name: "us-east-prod-01", region: "us-east-1", role: "API Gateway", status: "healthy", cpuMemory: "24% / 4.2 GB", latency: "18ms" },
  { id: "node-2", name: "eu-west-worker-03", region: "eu-west-1", role: "Worker", status: "healthy", cpuMemory: "68% / 11.4 GB", latency: "34ms" },
  { id: "node-3", name: "ap-south-cache-02", region: "ap-south-1", role: "Cache", status: "degraded", cpuMemory: "89% / 15.1 GB", latency: "112ms" },
  { id: "node-4", name: "us-west-ingress-04", region: "us-west-2", role: "Ingress", status: "healthy", cpuMemory: "12% / 2.1 GB", latency: "22ms" },
  { id: "node-5", name: "sa-east-sync-01", region: "sa-east-1", role: "Data Sync", status: "syncing", cpuMemory: "45% / 6.8 GB", latency: "64ms" },
];

export function DataTable({
  nodes = DEFAULT_NODES,
  onSelectNode,
  editable = false,
  onUpdateNode,
  className = "",
}: DataTableProps) {
  const { tokens, scaled } = useZeroLight();
  const [localNodes, setLocalNodes] = useState<NodeRecord[]>(nodes);
  const [selectedIds, setSelectedIds] = useState<string[]>(["node-1"]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingCell, setEditingCell] = useState<{ id: string; field: "name" | "region" | "latency" } | null>(null);
  const [editDraft, setEditDraft] = useState("");

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  const activeNodes = onUpdateNode ? nodes : localNodes;

  const commitEdit = () => {
    if (!editingCell) return;
    const trimmed = editDraft.trim();
    if (trimmed) {
      const patch = { [editingCell.field]: trimmed } as Partial<NodeRecord>;
      if (onUpdateNode) {
        onUpdateNode(editingCell.id, patch);
      } else {
        setLocalNodes((prev) =>
          prev.map((n) => (n.id === editingCell.id ? { ...n, ...patch } : n))
        );
      }
    }
    setEditingCell(null);
  };

  const filtered = activeNodes.filter((node) => {
    const matchesRole = roleFilter === "all" || node.role === roleFilter;
    const matchesSearch =
      !search ||
      node.name.toLowerCase().includes(search.toLowerCase()) ||
      node.region.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === activeNodes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activeNodes.map((n) => n.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderEditableCell = (
    node: NodeRecord,
    field: "name" | "region" | "latency",
    displayClassName: string
  ) => {
    const isEditing = editingCell?.id === node.id && editingCell?.field === field;
    if (isEditing) {
      return (
        <input
          type="text"
          autoFocus
          value={editDraft}
          onChange={(e) => setEditDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setEditingCell(null);
          }}
          style={{
            borderRadius: `${scaled.scaledInnerRadius}px`,
            borderColor: tokens.primaryButtonColor,
            color: tokens.textIconColor,
          }}
          className="px-2 py-0.5 text-xs bg-white border outline-none font-medium w-32 shadow-2xs"
        />
      );
    }

    if (!editable) {
      return (
        <span style={{ color: field === "name" ? tokens.textIconColor : undefined }} className={displayClassName}>
          {node[field]}
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={() => {
          setEditingCell({ id: node.id, field });
          setEditDraft(node[field]);
        }}
        title="Click to edit inline"
        className="group/cell inline-flex items-center gap-1.5 text-left cursor-text hover:bg-neutral-100/80 px-1.5 py-0.5 -mx-1.5 rounded transition-colors"
      >
        <span style={{ color: field === "name" ? tokens.textIconColor : undefined }} className={displayClassName}>
          {node[field]}
        </span>
        <Pencil className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover/cell:opacity-100 transition-opacity shrink-0" />
      </button>
    );
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: scaled.effectiveInputFill,
            height: `${scaled.scaledHeight}px`,
          }}
          className="flex-1 flex items-center gap-2 border px-3"
        >
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by node name, cluster, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
            className="w-full bg-transparent outline-none font-medium placeholder:text-neutral-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-neutral-400 hover:text-neutral-700">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Roles Segmented Filter */}
        <div
          style={{
            borderRadius: `${scaled.scaledPillRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.hoverBackplateTint,
          }}
          className="inline-flex items-center gap-1 p-0.5 border shrink-0 overflow-x-auto whitespace-nowrap"
        >
          {(["all", "API Gateway", "Worker", "Cache"] as const).map((r) => {
            const isSelected = roleFilter === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                  color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
                  transition: "background-color 0.2s ease, color 0.2s ease",
                }}
                className={`px-3 py-1 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected ? "shadow-xs" : "hover:text-neutral-900"
                }`}
              >
                {r === "all" ? "All Roles" : r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Surface */}
      <div
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="overflow-x-auto border"
      >
        <table className="w-full text-left text-xs border-collapse min-w-[860px]">
          <thead>
            <tr
              style={{
                borderColor: tokens.universalBorderColor,
                borderBottomWidth: `${tokens.borderWidth}px`,
                backgroundColor: tokens.hoverBackplateTint,
              }}
              className="text-neutral-500 font-semibold border-b"
            >
              <th className="p-3.5 w-10 text-center">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  style={{
                    borderRadius: `${scaled.scaledCheckboxRadius}px`,
                    borderColor: selectedIds.length > 0 ? tokens.primaryButtonColor : tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: selectedIds.length > 0 ? tokens.primaryButtonColor : tokens.universalFillColor,
                  }}
                  className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto"
                >
                  {selectedIds.length === activeNodes.length && <Check className="w-3 h-3" color={scaled.primaryActionTextColor} strokeWidth={3} />}
                </button>
              </th>
              <th className="p-3.5 whitespace-nowrap">Node / Cluster</th>
              <th className="p-3.5 whitespace-nowrap">Region</th>
              <th className="p-3.5 whitespace-nowrap">Role</th>
              <th className="p-3.5 whitespace-nowrap">Health Status</th>
              <th className="p-3.5 whitespace-nowrap">CPU / Memory</th>
              <th className="p-3.5 whitespace-nowrap">Latency</th>
              <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((node) => {
              const isSelected = selectedIds.includes(node.id);
              return (
                <tr
                  key={node.id}
                  style={{
                    backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                    transition: scaled.transitionStyle,
                  }}
                  className="hover:bg-neutral-50/80 transition-colors"
                >
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleSelectRow(node.id)}
                      style={{
                        borderRadius: `${scaled.scaledCheckboxRadius}px`,
                        borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                      }}
                      className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto"
                    >
                      {isSelected && <Check className="w-3 h-3" color={scaled.primaryActionTextColor} strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="p-3.5 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {renderEditableCell(node, "name", "font-semibold tabular-nums")}
                    </div>
                  </td>
                  <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {renderEditableCell(node, "region", "font-medium")}
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      style={{
                        borderRadius: `${scaled.scaledPillRadius}px`,
                        borderColor: tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: tokens.hoverBackplateTint,
                        color: tokens.textIconColor,
                      }}
                      className="inline-block px-2.5 py-0.5 text-[11px] font-semibold border whitespace-nowrap shrink-0"
                    >
                      {node.role}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <Badge variant={node.status} pulse={node.status === "syncing"}>
                      {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-neutral-700 font-medium tabular-nums whitespace-nowrap">
                    {node.cpuMemory}
                  </td>
                  <td className="p-3.5 text-neutral-700 font-medium tabular-nums whitespace-nowrap">
                    {renderEditableCell(node, "latency", "font-medium tabular-nums")}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectNode?.(node.id)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-md"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
