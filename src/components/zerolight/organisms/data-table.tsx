"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { Server, Globe, Search, X, Check, MoreHorizontal } from "lucide-react";
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
  className = "",
}: DataTableProps) {
  const { tokens, scaled } = useZeroLight();
  const [selectedIds, setSelectedIds] = useState<string[]>(["node-1"]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = nodes.filter((node) => {
    const matchesRole = roleFilter === "all" || node.role === roleFilter;
    const matchesSearch =
      !search ||
      node.name.toLowerCase().includes(search.toLowerCase()) ||
      node.region.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === nodes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(nodes.map((n) => n.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
        }}
        className="overflow-x-auto border bg-white"
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
                  {selectedIds.length === nodes.length && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
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
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="p-3.5 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span style={{ color: tokens.textIconColor }} className="font-semibold tabular-nums">
                        {node.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{node.region}</span>
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
                    {node.latency}
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
