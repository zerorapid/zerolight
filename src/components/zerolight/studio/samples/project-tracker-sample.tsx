"use client";

import React, { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Filter,
  Flame,
  ArrowUp,
  Minus,
  ArrowDown,
  Inbox,
  PlayCircle,
  Tag,
  Search,
  SlidersHorizontal,
  Calendar,
  Layers,
} from "lucide-react";
import { useZeroLight } from "../../context";
import { Badge } from "../../atoms/badge";
import { TagChip } from "../../atoms/tag-chip";
import { Button } from "../../atoms/button";
import { IconButton } from "../../atoms/icon-button";
import { Avatar } from "../../atoms/avatar";
import { BrandLogoRenderer } from "./brand-logo-renderer";

interface TaskCardData {
  id: string;
  code: string;
  title: string;
  priority: "urgent" | "high" | "medium" | "low";
  tag: string;
  assignee: { name: string; initials: string };
  dueDate: string;
}

interface ColumnData {
  id: string;
  title: string;
  count: number;
  tasks: TaskCardData[];
}

const INITIAL_COLUMNS: ColumnData[] = [
  {
    id: "backlog",
    title: "Backlog",
    count: 3,
    tasks: [
      {
        id: "task-1",
        code: "ENG-104",
        title: "Migrate HSM secret rotation to zero-latency enclave",
        priority: "urgent",
        tag: "Security",
        assignee: { name: "Sarah Connor", initials: "SC" },
        dueDate: "Nov 24",
      },
      {
        id: "task-2",
        code: "ENG-112",
        title: "Implement YIQ luminance contrast math for dynamic themes",
        priority: "high",
        tag: "Design System",
        assignee: { name: "Alex Chen", initials: "AC" },
        dueDate: "Nov 26",
      },
      {
        id: "task-3",
        code: "ENG-118",
        title: "Automate TSV export pipeline for virtual data grid",
        priority: "low",
        tag: "Core",
        assignee: { name: "David Kim", initials: "DK" },
        dueDate: "Dec 02",
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    count: 2,
    tasks: [
      {
        id: "task-4",
        code: "ENG-098",
        title: "Spring motion physics calibration across viewport transitions",
        priority: "high",
        tag: "Animation",
        assignee: { name: "Elena Rostova", initials: "ER" },
        dueDate: "Today",
      },
      {
        id: "task-5",
        code: "ENG-101",
        title: "Top-level breadcrumb responsive collapsing with popover",
        priority: "medium",
        tag: "Navigation",
        assignee: { name: "Sarah Connor", initials: "SC" },
        dueDate: "Tomorrow",
      },
    ],
  },
  {
    id: "done",
    title: "Completed",
    count: 2,
    tasks: [
      {
        id: "task-6",
        code: "ENG-089",
        title: "Dynamic Google Fonts link injection with zero reload",
        priority: "high",
        tag: "Typography",
        assignee: { name: "Alex Chen", initials: "AC" },
        dueDate: "Nov 16",
      },
      {
        id: "task-7",
        code: "ENG-074",
        title: "Stdio MCP JSON-RPC 2.0 protocol tooling verification",
        priority: "medium",
        tag: "Tooling",
        assignee: { name: "David Kim", initials: "DK" },
        dueDate: "Nov 14",
      },
    ],
  },
];

export interface ProjectTrackerSampleProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
}

export function ProjectTrackerSample({
  brandName = "ZeroLight",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
}: ProjectTrackerSampleProps) {
  const { tokens, scaled } = useZeroLight();
  const [columns, setColumns] = useState<ColumnData[]>(INITIAL_COLUMNS);

  const isCompact = (tokens.heightDensity ?? 44) <= 40;
  const isSpacious = (tokens.heightDensity ?? 44) >= 48;

  const cardPadding = isCompact ? "p-2.5 space-y-2" : isSpacious ? "p-4 space-y-3" : "p-3 space-y-2.5";
  const boardGap = isCompact ? "gap-2.5" : isSpacious ? "gap-4" : "gap-3";

  return (
    <div
      className="w-full flex flex-col space-y-4 font-sans select-none"
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ── PROJECT HEADER & ACTIONS ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: tokens.universalBorderColor }}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <BrandLogoRenderer
              brandLogoUrl={brandLogoUrl}
              selectedIconMark={selectedIconMark}
              brandMark={brandMark}
              size="sm"
            />
            <h2
              className="text-base font-bold tracking-tight"
              style={{
                fontFamily: scaled.resolvedHeadingFontFamily,
                color: tokens.textIconColor,
              }}
            >
              {brandName} Sprint Board
            </h2>
            <Badge variant="neutral" size="sm">Active Sprint 42</Badge>
          </div>
          <p className="text-xs opacity-75">
            Density & spacing layout test-bench. Modulating tokens dynamically recalculates card padding and radii.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Filter className="w-3.5 h-3.5" />}>
            Filter
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-3.5 h-3.5" />}
          >
            New Issue
          </Button>
        </div>
      </div>

      {/* ── 3-COLUMN KANBAN BOARD ── */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${boardGap} items-start`}>
        {columns.map((col) => (
          <div
            key={col.id}
            className="p-2.5 sm:p-3 flex flex-col space-y-2.5 min-w-0"
            style={{
              backgroundColor: tokens.hoverBackplateTint,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              borderRadius: `${scaled.scaledCardRadius}px`,
              transition: scaled.transitionStyle,
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-0.5 text-xs font-semibold">
              <div className="flex items-center gap-2">
                {col.id === "backlog" && <Inbox size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-60" />}
                {col.id === "in_progress" && <PlayCircle size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} className="text-amber-500" />}
                {col.id === "done" && <CheckCircle2 size={14} strokeWidth={tokens.iconStrokeWidth || 1.75} className="text-emerald-500" />}
                <span>{col.title}</span>
                <span
                  className="px-1.5 py-0.2 text-[10px] font-bold font-sans tabular-nums"
                  style={{
                    backgroundColor: tokens.universalFillColor,
                    borderColor: tokens.universalBorderColor,
                    borderWidth: `${tokens.borderWidth}px`,
                    borderRadius: `${scaled.scaledRadius}px`,
                    color: tokens.textIconColor,
                  }}
                >
                  {col.count}
                </span>
              </div>
              <IconButton
                icon={<MoreHorizontal className="w-3.5 h-3.5" />}
                ariaLabel="Column options"
                variant="ghost"
                size="sm"
              />
            </div>

            {/* Task Cards Stack */}
            <div className="space-y-2">
              {col.tasks.map((task) => {
                const priorityIcon = {
                  urgent: <Flame size={12} strokeWidth={tokens.iconStrokeWidth || 2} className="text-rose-500" />,
                  high: <ArrowUp size={12} strokeWidth={tokens.iconStrokeWidth || 2} className="text-amber-500" />,
                  medium: <Minus size={12} strokeWidth={tokens.iconStrokeWidth || 2} className="text-sky-500" />,
                  low: <ArrowDown size={12} strokeWidth={tokens.iconStrokeWidth || 2} className="text-slate-400" />,
                }[task.priority];

                return (
                  <div
                    key={task.id}
                    className={`transition-all cursor-pointer ${cardPadding}`}
                    style={{
                      backgroundColor: tokens.universalFillColor,
                      borderColor: tokens.universalBorderColor,
                      borderWidth: `${tokens.borderWidth}px`,
                      borderRadius: `${scaled.scaledCardRadius}px`,
                      boxShadow: scaled.cardShadow,
                      transition: scaled.transitionStyle,
                    }}
                  >
                    {/* Top Meta: Code & Priority */}
                    <div className="flex items-center justify-between text-[11px] opacity-75">
                      <span className="font-sans tabular-nums font-semibold flex items-center gap-1.5">
                        <Layers size={11} strokeWidth={tokens.iconStrokeWidth || 1.75} className="opacity-50" />
                        <span>{task.code}</span>
                      </span>
                      <span
                        className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{
                          backgroundColor: tokens.hoverBackplateTint,
                          borderColor: tokens.universalBorderColor,
                          borderWidth: `${tokens.borderWidth}px`,
                          borderRadius: `${scaled.scaledRadius}px`,
                        }}
                      >
                        {priorityIcon}
                        <span>{task.priority}</span>
                      </span>
                    </div>

                  {/* Task Title */}
                  <h3
                    className="text-xs font-semibold leading-snug"
                    style={{
                      fontFamily: scaled.resolvedHeadingFontFamily,
                      color: tokens.textIconColor,
                    }}
                  >
                    {task.title}
                  </h3>

                  {/* Footer Meta: TagChip, Due Date & Assignee Avatar */}
                  <div
                    className="flex items-center justify-between pt-1 border-t text-[11px] opacity-75"
                    style={{ borderColor: tokens.universalBorderColor }}
                  >
                    <div className="flex items-center gap-1.5">
                      <TagChip label={task.tag} />
                      <span className="text-[10px] font-sans tabular-nums flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {task.dueDate}
                      </span>
                    </div>

                    <Avatar
                      initials={task.assignee.initials}
                      size="xs"
                      alt={task.assignee.name}
                    />
                  </div>
                </div>
              );
            })}
          </div>

            {/* Add Card Quick Trigger */}
            <button
              type="button"
              className="w-full py-1.5 border border-dashed text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 opacity-70 hover:opacity-100"
              style={{
                borderColor: tokens.universalBorderColor,
                borderRadius: `${scaled.scaledRadius}px`,
                color: tokens.textIconColor,
              }}
            >
              <Plus className="w-3 h-3" />
              <span>Add task</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
