"use client";

import React, { useState, useEffect, useRef } from "react";
import { useZeroLight } from "../context";
import { Server, Globe, Search, X, Check, MoreHorizontal, Pencil, Download, FileSpreadsheet, FileCode, ClipboardCopy } from "lucide-react";
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

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T = NodeRecord> {
  columns?: DataTableColumn<T>[];
  rows?: T[];
  rowKey?: (row: T, index: number) => string;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  showToolbar?: boolean;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  footerAction?: React.ReactNode;
  nodes?: NodeRecord[];
  onSelectNode?: (nodeId: string) => void;
  editable?: boolean;
  onUpdateNode?: (nodeId: string, patch: Partial<NodeRecord>) => void;
  enableClipboardPaste?: boolean;
  enableExport?: boolean;
  pinSelectionColumn?: boolean;
  pinActionsColumn?: boolean;
  onPasteRows?: (pastedRows: Partial<T>[]) => void;
  className?: string;
}

const DEFAULT_NODES: NodeRecord[] = [
  { id: "node-1", name: "us-east-prod-01", region: "us-east-1", role: "API Gateway", status: "healthy", cpuMemory: "24% / 4.2 GB", latency: "18ms" },
  { id: "node-2", name: "eu-west-worker-03", region: "eu-west-1", role: "Worker", status: "healthy", cpuMemory: "68% / 11.4 GB", latency: "34ms" },
  { id: "node-3", name: "ap-south-cache-02", region: "ap-south-1", role: "Cache", status: "degraded", cpuMemory: "89% / 15.1 GB", latency: "112ms" },
  { id: "node-4", name: "us-west-ingress-04", region: "us-west-2", role: "Ingress", status: "healthy", cpuMemory: "12% / 2.1 GB", latency: "22ms" },
  { id: "node-5", name: "sa-east-sync-01", region: "sa-east-1", role: "Data Sync", status: "syncing", cpuMemory: "45% / 6.8 GB", latency: "64ms" },
];

export function DataTable<T = NodeRecord>({
  columns,
  rows,
  rowKey,
  selectable = true,
  selectedRowKeys,
  onSelectionChange,
  showToolbar = false,
  searchPlaceholder = "Filter rows...",
  searchAccessor,
  footerAction,
  nodes = DEFAULT_NODES,
  onSelectNode,
  editable = false,
  onUpdateNode,
  enableClipboardPaste = true,
  enableExport = true,
  pinSelectionColumn = true,
  pinActionsColumn = true,
  onPasteRows,
  className = "",
}: DataTableProps<T>) {
  const { tokens, scaled } = useZeroLight();
  const [localNodes, setLocalNodes] = useState<NodeRecord[]>(nodes);
  const [selectedIds, setSelectedIds] = useState<string[]>(["node-1"]);
  const [genericSelectedIds, setGenericSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingCell, setEditingCell] = useState<{ id: string; field: "name" | "region" | "latency" } | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  // Export handlers
  const exportToCSV = (dataRows: Record<string, unknown>[], filename = "zerolight-export.csv") => {
    if (!dataRows.length) return;
    const headers = Object.keys(dataRows[0]);
    const csvContent = [
      headers.join(","),
      ...dataRows.map((row) =>
        headers
          .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (dataRows: Record<string, unknown>[], filename = "zerolight-export.json") => {
    const jsonContent = JSON.stringify(dataRows, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clipboard TSV / CSV Paste Parser
  const handlePasteData = (rawText: string) => {
    const lines = rawText.trim().split(/\r\n|\n|\r/).filter(Boolean);
    if (!lines.length) return;
    const parsed = lines.map((line, idx) => {
      const delimiter = line.includes("\t") ? "\t" : ",";
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^"|"$/g, ""));
      return {
        id: `node-${Date.now()}-${idx}`,
        name: parts[0] || `pasted-node-${idx + 1}`,
        region: parts[1] || "global-edge",
        role: (parts[2] as NodeRecord["role"]) || "Worker",
        status: (parts[3] as NodeRecord["status"]) || "healthy",
        cpuMemory: parts[4] || "28% / 4.0 GB",
        latency: parts[5] || "18ms",
      };
    });

    if (onPasteRows) {
      onPasteRows(parsed as unknown as Partial<T>[]);
    } else {
      setLocalNodes((prev) => [...parsed, ...prev]);
    }
    setPasteNotice(`Imported ${parsed.length} rows from clipboard`);
    setTimeout(() => setPasteNotice(null), 3000);
  };

  const handleClipboardTrigger = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handlePasteData(text);
          return;
        }
      }
    } catch {
      // Fallback sample
    }
    const sampleTSV = "us-west-edge-09\tus-west-1\tWorker\thealthy\t32% / 6.1 GB\t14ms\neu-north-sync-02\teu-north-1\tData Sync\tsyncing\t51% / 8.2 GB\t42ms";
    handlePasteData(sampleTSV);
  };

  // Generic typed DataTable mode when `columns` and `rows` are supplied
  if (columns && rows) {
    const getKey = (row: T, idx: number) =>
      rowKey
        ? rowKey(row, idx)
        : String((row as Record<string, unknown>)?.id ?? idx);

    const activeSelected = selectedRowKeys ?? genericSelectedIds;
    const setActiveSelected = (next: string[]) => {
      if (onSelectionChange) onSelectionChange(next);
      else setGenericSelectedIds(next);
    };

    const filteredRows = !search
      ? rows
      : rows.filter((row) => {
          const text = searchAccessor
            ? searchAccessor(row)
            : Object.values(row as Record<string, unknown>)
                .filter((v) => typeof v === "string" || typeof v === "number")
                .join(" ");
          return text.toLowerCase().includes(search.toLowerCase());
        });

    const allRowIds = filteredRows.map(getKey);
    const allSelected =
      allRowIds.length > 0 && allRowIds.every((id) => activeSelected.includes(id));

    return (
      <div className={`space-y-3 w-full ${className}`}>
        {showToolbar && (
          <div
            style={{
              borderRadius: `${scaled.scaledRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: scaled.effectiveInputFill,
              height: `${scaled.scaledHeight}px`,
            }}
            className="flex items-center gap-2 border px-3"
          >
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
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
        )}

        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            backgroundColor: tokens.universalFillColor,
          }}
          className="overflow-x-auto border"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                style={{
                  borderColor: tokens.universalBorderColor,
                  borderBottomWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.hoverBackplateTint,
                }}
                className="text-neutral-500 font-semibold border-b uppercase tracking-wider text-[10px]"
              >
                {selectable && (
                  <th className="p-3.5 w-10 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveSelected(allSelected ? [] : allRowIds)}
                      style={{
                        borderRadius: `${scaled.scaledCheckboxRadius}px`,
                        borderColor: activeSelected.length > 0 ? tokens.primaryButtonColor : tokens.universalBorderColor,
                        borderWidth: `${tokens.borderWidth}px`,
                        backgroundColor: activeSelected.length > 0 ? tokens.primaryButtonColor : tokens.universalFillColor,
                      }}
                      className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto"
                    >
                      {allSelected && (
                        <Check className="w-3 h-3" color={scaled.primaryActionTextColor} strokeWidth={3} />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`p-3.5 whitespace-nowrap ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRows.map((row, idx) => {
                const id = getKey(row, idx);
                const isSelected = activeSelected.includes(id);
                return (
                  <tr
                    key={id}
                    style={{
                      backgroundColor: isSelected ? tokens.hoverBackplateTint : "transparent",
                      transition: scaled.transitionStyle,
                    }}
                    className="transition-colors"
                  >
                    {selectable && (
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSelected(
                              isSelected
                                ? activeSelected.filter((item) => item !== id)
                                : [...activeSelected, id]
                            )
                          }
                          style={{
                            borderRadius: `${scaled.scaledCheckboxRadius}px`,
                            borderColor: isSelected ? tokens.primaryButtonColor : tokens.universalBorderColor,
                            borderWidth: `${tokens.borderWidth}px`,
                            backgroundColor: isSelected ? tokens.primaryButtonColor : tokens.universalFillColor,
                          }}
                          className="w-4 h-4 flex items-center justify-center cursor-pointer border mx-auto"
                        >
                          {isSelected && (
                            <Check className="w-3 h-3" color={scaled.primaryActionTextColor} strokeWidth={3} />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ color: tokens.textIconColor }}
                        className={`p-3.5 whitespace-nowrap ${
                          col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                        }`}
                      >
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)?.[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {footerAction && <div className="pt-1">{footerAction}</div>}
      </div>
    );
  }

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

        {/* Enterprise Actions (Paste TSV & Export CSV/JSON) */}
        {(enableClipboardPaste || enableExport) && (
          <div className="flex items-center gap-2 shrink-0">
            {enableClipboardPaste && (
              <button
                type="button"
                onClick={handleClipboardTrigger}
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.universalFillColor,
                  color: tokens.textIconColor,
                  fontSize: `${scaled.scaledFontSize - 1}px`,
                }}
                title="Paste cells copied from Excel or Google Sheets (Ctrl+V supported)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <ClipboardCopy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Paste TSV/CSV</span>
              </button>
            )}
            {enableExport && (
              <>
                <button
                  type="button"
                  onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], "zerolight-nodes.csv")}
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    fontSize: `${scaled.scaledFontSize - 1}px`,
                  }}
                  title="Export filtered records to CSV"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportToJSON(filtered as unknown as Record<string, unknown>[], "zerolight-nodes.json")}
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.universalFillColor,
                    color: tokens.textIconColor,
                    fontSize: `${scaled.scaledFontSize - 1}px`,
                  }}
                  title="Export records to formatted JSON"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-600" />
                  <span>JSON</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {pasteNotice && (
        <div
          style={{
            borderRadius: `${scaled.scaledRadius}px`,
            backgroundColor: tokens.hoverBackplateTint,
            borderColor: tokens.universalBorderColor,
            borderWidth: `${tokens.borderWidth}px`,
            color: tokens.textIconColor,
          }}
          className="flex items-center justify-between px-3.5 py-2 text-xs border"
        >
          <span className="font-medium">{pasteNotice}</span>
          <button type="button" onClick={() => setPasteNotice(null)} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Table Surface */}
      <div
        onPaste={(e) => {
          if (!enableClipboardPaste) return;
          const text = e.clipboardData?.getData("text");
          if (text) {
            e.preventDefault();
            handlePasteData(text);
          }
        }}
        tabIndex={0}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="overflow-x-auto border outline-none focus:ring-1 focus:ring-neutral-400/30"
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
              <th
                style={{ backgroundColor: tokens.hoverBackplateTint }}
                className={`p-3.5 w-10 text-center ${pinSelectionColumn ? "sticky left-0 z-10 shadow-[1px_0_0_0_#E4E4E7]" : ""}`}
              >
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
              <th
                style={{ backgroundColor: tokens.hoverBackplateTint }}
                className={`p-3.5 text-right whitespace-nowrap ${pinActionsColumn ? "sticky right-0 z-10 shadow-[-1px_0_0_0_#E4E4E7]" : ""}`}
              >
                Actions
              </th>
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
                  <td
                    style={{ backgroundColor: isSelected ? tokens.hoverBackplateTint : tokens.universalFillColor }}
                    className={`p-3.5 text-center whitespace-nowrap ${pinSelectionColumn ? "sticky left-0 z-10 shadow-[1px_0_0_0_#E4E4E7]" : ""}`}
                  >
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
                  <td
                    style={{ backgroundColor: isSelected ? tokens.hoverBackplateTint : tokens.universalFillColor }}
                    className={`p-3.5 text-right whitespace-nowrap ${pinActionsColumn ? "sticky right-0 z-10 shadow-[-1px_0_0_0_#E4E4E7]" : ""}`}
                  >
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
