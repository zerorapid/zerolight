"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { Folder, FolderOpen, FileText, ChevronRight, HardDrive, Download, MoreHorizontal } from "lucide-react";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  children?: TreeNode[];
}

const DEFAULT_TREE_DATA: TreeNode[] = [
  {
    id: "root-1",
    name: "prod-telemetry-s3-bucket",
    type: "folder",
    children: [
      {
        id: "folder-1",
        name: "us-east-1-ingress",
        type: "folder",
        children: [
          { id: "f-1", name: "access-logs-2026-11-07.parquet", type: "file", size: "48.2 MB" },
          { id: "f-2", name: "error-traces-v2.json.gz", type: "file", size: "12.8 MB" },
        ],
      },
      {
        id: "folder-2",
        name: "k8s-manifests",
        type: "folder",
        children: [
          { id: "f-3", name: "deployment-spec.yaml", type: "file", size: "18.4 KB" },
          { id: "f-4", name: "ingress-rules.yaml", type: "file", size: "6.2 KB" },
        ],
      },
      { id: "f-5", name: "cluster-audit-report.pdf", type: "file", size: "2.4 MB" },
    ],
  },
];

export interface TreeViewProps {
  data?: TreeNode[];
  onSelectNode?: (node: TreeNode) => void;
  className?: string;
}

export function TreeView({
  data = DEFAULT_TREE_DATA,
  onSelectNode,
  className = "",
}: TreeViewProps) {
  const { tokens, scaled } = useZeroLight();
  const [expandedIds, setExpandedIds] = useState<string[]>(["root-1", "folder-1"]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = expandedIds.includes(node.id);

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (isFolder) toggleExpand(node.id);
            onSelectNode?.(node);
          }}
          style={{
            paddingLeft: `${depth * 20 + 12}px`,
            borderRadius: `${scaled.scaledRadius}px`,
          }}
          className="py-1.5 pr-3 flex items-center justify-between text-xs hover:bg-neutral-100/70 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            {isFolder ? (
              <ChevronRight
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            ) : (
              <span className="w-3.5" />
            )}

            {isFolder ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
              )
            ) : (
              <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
            )}

            <span
              style={{ color: tokens.textIconColor }}
              className={`truncate ${isFolder ? "font-semibold" : "font-medium"}`}
            >
              {node.name}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {node.size && (
              <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
                {node.size}
              </span>
            )}
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 p-0.5"
              aria-label="Actions"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isFolder && isExpanded && node.children && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`border overflow-hidden p-3 space-y-1 w-full ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100 mb-2">
        <HardDrive className="w-4 h-4 text-neutral-500" />
        <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold">
          Cloud Storage &amp; Object Explorer
        </span>
      </div>

      <div className="space-y-0.5">{data.map((rootNode) => renderNode(rootNode, 0))}</div>
    </div>
  );
}
