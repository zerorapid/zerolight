"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { useZeroLight } from "../context";
import { Checkbox } from "../atoms/checkbox";
import { ChevronDown, ChevronRight, Search, X, FolderTree } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface TreeSelectNode {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  data: TreeSelectNode[];
  value: string[];
  onChange: (nextValue: string[]) => void;
  label?: string;
  placeholder?: string;
  maxTagCount?: number;
  showSearch?: boolean;
  className?: string;
}

export function TreeSelect({
  data,
  value,
  onChange,
  label,
  placeholder = "Select resources from hierarchy...",
  maxTagCount = 2,
  showSearch = true,
  className = "",
}: TreeSelectProps) {
  const { tokens, scaled } = useZeroLight();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    data.map((n) => n.id)
  );
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    width: 300,
    placement: "bottom",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const treeId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build quick lookup map of all nodes by id
  const nodeMap = useMemo(() => {
    const map = new Map<string, TreeSelectNode>();
    const traverse = (nodes: TreeSelectNode[]) => {
      for (const node of nodes) {
        map.set(node.id, node);
        if (node.children) traverse(node.children);
      }
    };
    traverse(data);
    return map;
  }, [data]);

  // Get all selectable descendant IDs for a node (leaf IDs if branch, or self if leaf)
  const getSelectableIds = useCallback((node: TreeSelectNode): string[] => {
    if (!node.children || node.children.length === 0) {
      return node.disabled ? [] : [node.id];
    }
    const ids: string[] = [];
    for (const child of node.children) {
      ids.push(...getSelectableIds(child));
    }
    return ids;
  }, []);

  const valueSet = useMemo(() => new Set(value), [value]);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = tokens.menuOffsetGap || 6;
    const estimatedHeight = 320;
    const viewportHeight = window.innerHeight;

    let placement: "top" | "bottom" = "bottom";
    let top = rect.bottom + margin;

    if (
      rect.bottom + estimatedHeight > viewportHeight - 16 &&
      rect.top - estimatedHeight > 16
    ) {
      placement = "top";
      top = rect.top - margin;
    }

    setCoords({
      top,
      left: rect.left,
      width: rect.width,
      placement,
    });
  }, [tokens.menuOffsetGap]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleNodeSelection = (node: TreeSelectNode) => {
    if (node.disabled) return;
    const targetIds = getSelectableIds(node);
    if (targetIds.length === 0) return;

    const allChecked = targetIds.every((id) => valueSet.has(id));
    if (allChecked) {
      const removeSet = new Set(targetIds);
      onChange(value.filter((id) => !removeSet.has(id)));
    } else {
      const next = Array.from(new Set([...value, ...targetIds]));
      onChange(next);
    }
  };

  // Filter tree based on searchQuery while keeping ancestors of matches
  const { filteredTree, autoExpandIds } = useMemo(() => {
    if (!searchQuery.trim()) {
      return { filteredTree: data, autoExpandIds: [] as string[] };
    }
    const q = searchQuery.toLowerCase();
    const expandSet = new Set<string>();

    const filterNodes = (nodes: TreeSelectNode[]): TreeSelectNode[] => {
      const res: TreeSelectNode[] = [];
      for (const node of nodes) {
        const selfMatches = node.label.toLowerCase().includes(q);
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        if (selfMatches || filteredChildren.length > 0) {
          if (filteredChildren.length > 0) {
            expandSet.add(node.id);
          }
          res.push({
            ...node,
            children: selfMatches && filteredChildren.length === 0 ? node.children : filteredChildren,
          });
        }
      }
      return res;
    };

    return {
      filteredTree: filterNodes(data),
      autoExpandIds: Array.from(expandSet),
    };
  }, [data, searchQuery]);

  const renderTreeNode = (node: TreeSelectNode, depth = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded =
      expandedIds.includes(node.id) || autoExpandIds.includes(node.id);

    const descendantIds = getSelectableIds(node);
    const checkedCount = descendantIds.filter((id) => valueSet.has(id)).length;
    const isChecked = descendantIds.length > 0 && checkedCount === descendantIds.length;
    const isIndeterminate = checkedCount > 0 && checkedCount < descendantIds.length;

    return (
      <div key={node.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isChecked}>
        <div
          onClick={() => toggleNodeSelection(node)}
          style={{
            paddingLeft: `${depth * 18 + 8}px`,
            borderRadius: `${scaled.scaledOptionRadius}px`,
            backgroundColor: isChecked && !hasChildren ? tokens.hoverBackplateTint : "transparent",
          }}
          className={`py-1.5 pr-2.5 flex items-center justify-between gap-2 text-xs transition-colors ${
            node.disabled
              ? "opacity-45 cursor-not-allowed"
              : "cursor-pointer hover:bg-neutral-100/70"
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-neutral-700 shrink-0 cursor-pointer"
                aria-label={isExpanded ? "Collapse branch" : "Expand branch"}
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}

            <div className="pointer-events-none flex items-center">
              <Checkbox
                checked={isChecked}
                indeterminate={isIndeterminate}
                disabled={node.disabled}
              />
            </div>

            <span
              style={{ color: tokens.textIconColor }}
              className={`truncate ml-1 ${hasChildren ? "font-semibold" : "font-medium"}`}
            >
              {node.label}
            </span>
          </div>

          {node.badge && (
            <span
              style={{ borderRadius: `${scaled.scaledPillRadius}px` }}
              className="text-[10px] font-semibold px-1.5 py-0.5 bg-neutral-100 text-neutral-500 border border-neutral-200 shrink-0"
            >
              {node.badge}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && node.children && (
          <div role="group">{node.children.map((child) => renderTreeNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  // Smart Tag Folding calculation
  const visibleTags = value.slice(0, maxTagCount);
  const hiddenCount = Math.max(0, value.length - maxTagCount);
  const hiddenLabels = value
    .slice(maxTagCount)
    .map((id) => nodeMap.get(id)?.label || id)
    .join(", ");

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }}
          className="block font-medium"
        >
          {label}
        </label>
      )}

      {/* Trigger Field */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? treeId : undefined}
        tabIndex={0}
        onClick={() => {
          if (!isOpen) calculatePosition();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isOpen) calculatePosition();
            setIsOpen((prev) => !prev);
          }
        }}
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: isOpen ? tokens.primaryButtonColor : tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          minHeight: `${scaled.scaledHeight}px`,
          paddingLeft: `${Math.max(8, scaled.scaledPaddingX - 4)}px`,
          paddingRight: `${scaled.scaledPaddingX}px`,
          transition: scaled.transitionStyle,
        }}
        className="w-full py-1 flex items-center justify-between gap-2 border cursor-pointer select-none focus:outline-none"
      >
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          {value.length === 0 ? (
            <span
              style={{ fontSize: `${scaled.scaledFontSize}px` }}
              className="text-neutral-400 font-medium truncate pl-1"
            >
              {placeholder}
            </span>
          ) : (
            <>
              {visibleTags.map((id) => {
                const node = nodeMap.get(id);
                return (
                  <span
                    key={id}
                    style={{
                      borderRadius: `${scaled.scaledPillRadius}px`,
                      backgroundColor: tokens.hoverBackplateTint,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      color: tokens.textIconColor,
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold border whitespace-nowrap"
                  >
                    <span className="truncate max-w-[130px]">{node?.label || id}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(value.filter((v) => v !== id));
                      }}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      aria-label={`Remove ${node?.label || id}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {hiddenCount > 0 && (
                <span
                  title={hiddenLabels}
                  style={{
                    borderRadius: `${scaled.scaledPillRadius}px`,
                    backgroundColor: tokens.primaryButtonColor,
                    color: scaled.primaryActionTextColor,
                  }}
                  className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold tabular-nums whitespace-nowrap"
                >
                  +{hiddenCount} more
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
              aria-label="Clear all selected"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            size={scaled.iconSmSize || 16}
            strokeWidth={tokens.iconStrokeWidth || 1.75}
            color={tokens.iconColor || tokens.textIconColor}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Portaled Tree Dropdown */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                id={treeId}
                role="tree"
                initial={{ opacity: 0, scale: 0.97, y: coords.placement === "bottom" ? -4 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: coords.placement === "bottom" ? -4 : 4 }}
                transition={scaled.motionConfig.spring}
                style={{
                  position: "fixed",
                  top: coords.placement === "bottom" ? coords.top : undefined,
                  bottom: coords.placement === "top" ? window.innerHeight - coords.top : undefined,
                  left: coords.left,
                  width: Math.max(260, coords.width),
                  borderRadius: `${scaled.scaledMenuRadius}px`,
                  borderColor: tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: tokens.universalFillColor,
                  boxShadow: "0 14px 30px -6px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.06)",
                  zIndex: 99998,
                }}
                className="border overflow-hidden select-none"
              >
                {/* Search Toolbar inside Tree */}
                {showSearch && (
                  <div
                    style={{
                      borderColor: tokens.universalBorderColor,
                      borderBottomWidth: `${tokens.borderWidth}px`,
                    }}
                    className="px-3 py-2 border-b flex items-center gap-2 bg-neutral-50/60"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search hierarchy nodes..."
                      style={{ color: tokens.textIconColor }}
                      className="w-full text-xs bg-transparent outline-none font-medium placeholder:text-neutral-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Tree Scroll Viewport */}
                <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                  {filteredTree.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-medium flex flex-col items-center gap-1.5">
                      <FolderTree className="w-5 h-5 text-neutral-300" />
                      <span>No matching branches found</span>
                    </div>
                  ) : (
                    filteredTree.map((node) => renderTreeNode(node, 0))
                  )}
                </div>

                {/* Footer Status */}
                <div
                  style={{
                    borderColor: tokens.universalBorderColor,
                    borderTopWidth: `${tokens.borderWidth}px`,
                    backgroundColor: tokens.hoverBackplateTint,
                  }}
                  className="px-3 py-1.5 border-t flex items-center justify-between text-[11px] text-neutral-500 font-medium tabular-nums"
                >
                  <span>{value.length} selected</span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{ color: tokens.primaryButtonColor }}
                    className="font-semibold hover:underline cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
