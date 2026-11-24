"use client";

import React, { useState } from "react";
import {
  Server,
  DollarSign,
  Zap,
  Plus,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useZeroLight } from "../context";
import { StatCard } from "../molecules/stat-card";
import { SearchBar } from "../molecules/search-bar";
import { Select } from "../molecules/select";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Avatar } from "../atoms/avatar";
import { DataTable, DataTableColumn } from "../organisms/data-table";
import { DetailDrawer } from "../organisms/detail-drawer";
import { BrandLogoRenderer } from "./samples/brand-logo-renderer";

interface WorkloadRecord {
  id: string;
  name: string;
  domain: string;
  role: "API Gateway" | "Core Worker" | "Cache Enclave" | "Ingress Edge" | "Data Sync";
  region: string;
  status: "healthy" | "syncing" | "degraded";
  throughput: string;
  latency: string;
  health: number;
}

const WORKLOAD_RECORDS: WorkloadRecord[] = [
  {
    id: "wl-01",
    name: "us-east-prod-gateway",
    domain: "api.zerolight.io/v2",
    role: "API Gateway",
    region: "us-east",
    status: "healthy",
    throughput: "14,820 req/s",
    latency: "18ms",
    health: 99,
  },
  {
    id: "wl-02",
    name: "us-west-cache-enclave",
    domain: "redis.cluster.internal",
    role: "Cache Enclave",
    region: "us-west",
    status: "healthy",
    throughput: "42,100 ops/s",
    latency: "4ms",
    health: 100,
  },
  {
    id: "wl-03",
    name: "eu-central-sync-worker",
    domain: "sync-eu.zerolight.net",
    role: "Data Sync",
    region: "eu-west",
    status: "syncing",
    throughput: "3,250 req/s",
    latency: "42ms",
    health: 94,
  },
  {
    id: "wl-04",
    name: "ap-south-ingress-router",
    domain: "edge-bom.zerolight.io",
    role: "Ingress Edge",
    region: "ap-south",
    status: "healthy",
    throughput: "8,940 req/s",
    latency: "28ms",
    health: 98,
  },
  {
    id: "wl-05",
    name: "us-east-batch-pipeline",
    domain: "jobs.internal.pipeline",
    role: "Core Worker",
    region: "us-east",
    status: "degraded",
    throughput: "1,120 req/s",
    latency: "86ms",
    health: 82,
  },
  {
    id: "wl-06",
    name: "eu-west-auth-verifier",
    domain: "auth.security.cloud",
    role: "Core Worker",
    region: "eu-west",
    status: "healthy",
    throughput: "5,400 req/s",
    latency: "14ms",
    health: 99,
  },
];

const REGION_OPTIONS = [
  { value: "all", label: "All Regions" },
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "eu-west", label: "EU Central (Frankfurt)" },
  { value: "ap-south", label: "AP South (Mumbai)" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "healthy", label: "Nominal (Healthy)" },
  { value: "syncing", label: "Syncing Buffer" },
  { value: "degraded", label: "Degraded Latency" },
];

export interface UnifiedEnterpriseStageProps {
  brandName?: string;
  brandMark?: string;
  brandLogoUrl?: string | null;
  selectedIconMark?: string;
  className?: string;
}

export function UnifiedEnterpriseStage({
  brandName = "ZeroLight OS",
  brandMark = "ZL",
  brandLogoUrl = null,
  selectedIconMark = "shield",
  className = "",
}: UnifiedEnterpriseStageProps) {
  const { tokens, scaled } = useZeroLight();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [inspectingNode, setInspectingNode] = useState<WorkloadRecord | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(["wl-01"]);

  // Filter workload records
  const filteredRecords = WORKLOAD_RECORDS.filter((rec) => {
    const matchesSearch =
      !searchQuery ||
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || rec.region === selectedRegion;
    const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Table Columns using real ZeroLight DataTable API
  const columns: DataTableColumn<WorkloadRecord>[] = [
    {
      key: "name",
      header: "Workload Node / Endpoint",
      render: (row) => (
        <div className="flex items-center gap-2.5 py-1">
          <Avatar
            initials={row.name.substring(0, 2).toUpperCase()}
            size="sm"
          />
          <div className="min-w-0">
            <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
              {row.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans tabular-nums truncate">
              {row.domain}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Service Role",
      render: (row) => (
        <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium whitespace-nowrap">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "healthy") {
          return <Badge variant="healthy" size="sm">Healthy</Badge>;
        }
        if (row.status === "syncing") {
          return <Badge variant="neutral" size="sm">Syncing</Badge>;
        }
        return <Badge variant="degraded" size="sm">Degraded</Badge>;
      },
    },
    {
      key: "throughput",
      header: "Throughput",
      align: "right",
      render: (row) => (
        <span className="text-xs font-sans tabular-nums font-semibold text-slate-900 dark:text-zinc-200">
          {row.throughput}
        </span>
      ),
    },
    {
      key: "latency",
      header: "p99 Latency",
      align: "right",
      render: (row) => (
        <span className="text-xs font-sans tabular-nums text-slate-600 dark:text-zinc-400">
          {row.latency}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInspectingNode(row)}
          className="text-[11px] h-7 px-2.5"
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div
      className={`w-full flex flex-col space-y-4 font-sans select-none ${className}`}
      style={{
        color: tokens.textIconColor,
        fontFamily: scaled.resolvedFontFamily,
      }}
    >
      {/* ════ ZONE 1: BREADCRUMB + PAGE HEADER + PRIMARY CTA ════ */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b"
        style={{ borderColor: tokens.universalBorderColor }}
      >
        <div className="flex items-center gap-3">
          <BrandLogoRenderer
            brandLogoUrl={brandLogoUrl}
            selectedIconMark={selectedIconMark}
            brandMark={brandMark}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight"
                style={{
                  fontFamily: scaled.resolvedHeadingFontFamily,
                  color: tokens.textIconColor,
                }}
              >
                {brandName} Console
              </h2>
              <Badge variant="healthy" size="sm">99.98% SLA</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Live enterprise telemetry, cluster health, and tokenized design surfaces.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-3.5 h-3.5" />}
          >
            New Workload
          </Button>
        </div>
      </div>

      {/* ════ ZONE 2: 3 MISSION-CRITICAL TELEMETRY STAT CARDS ════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <StatCard
          label="MONTHLY RUNTIME EXPENSE"
          value="$148,250.00"
          delta="+14.2%"
          trend="up"
          comparisonText="vs last cycle"
          icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="ACTIVE CLUSTER NODES"
          value="1,284"
          delta="+8.1%"
          trend="up"
          comparisonText="98.4% capacity"
          icon={<Server className="w-4 h-4 text-sky-500" />}
        />
        <StatCard
          label="MEDIAN API LATENCY"
          value="24.8ms"
          delta="-3.2ms"
          trend="up"
          comparisonText="p99: 48ms"
          icon={<Zap className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* ════ ZONE 3: UNIFIED DYNAMIC FILTER BAR (100% NATIVE ZEROLIGHT CONTROLS) ════ */}
      <div
        className="p-3 sm:p-3.5 border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs"
        style={{
          borderRadius: `${scaled.scaledCardRadius}px`,
          backgroundColor: tokens.universalFillColor,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
        }}
      >
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search workloads, routes & roles..."
            showKbd={true}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ZeroLight Custom Dropdown 1: Region */}
          <div className="w-44">
            <Select
              options={REGION_OPTIONS}
              value={selectedRegion}
              onChange={setSelectedRegion}
              size="sm"
            />
          </div>

          {/* ZeroLight Custom Dropdown 2: Status */}
          <div className="w-44">
            <Select
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={setSelectedStatus}
              size="sm"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => {
              const tsvContent = filteredRecords
                .map((r) => `${r.name}\t${r.role}\t${r.region}\t${r.status}\t${r.throughput}\t${r.latency}`)
                .join("\n");
              navigator.clipboard?.writeText?.(tsvContent);
            }}
          >
            Export TSV
          </Button>
        </div>
      </div>

      {/* ════ ZONE 4: ENTERPRISE DATA TABLE ORGANISM ════ */}
      <div className="w-full">
        <DataTable<WorkloadRecord>
          columns={columns}
          rows={filteredRecords}
          rowKey={(r) => r.id}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          searchPlaceholder="Filter records..."
          enableExport={false}
        />
      </div>

      {/* ════ ZONE 5: DETAIL DRAWER (PROVE SLIDE-OVER SPRING PHYSICS & TOKEN ELEVATION) ════ */}
      <DetailDrawer
        isOpen={Boolean(inspectingNode)}
        onClose={() => setInspectingNode(null)}
        title={inspectingNode?.name ?? "Workload Inspector"}
        subtitle={`${inspectingNode?.role ?? ""} • ${inspectingNode?.region ?? ""}`}
        onSave={() => setInspectingNode(null)}
      >
        {inspectingNode && (
          <div className="space-y-4 text-xs">
            <div
              className="p-3 rounded-xl border space-y-1.5"
              style={{
                borderColor: tokens.universalBorderColor,
                backgroundColor: tokens.hoverBackplateTint,
              }}
            >
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                System Telemetry
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Domain Route:</span>
                  <p className="font-sans tabular-nums font-medium text-slate-900 dark:text-white truncate">
                    {inspectingNode.domain}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Service Role:</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {inspectingNode.role}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Live Throughput:</span>
                  <p className="font-sans tabular-nums font-semibold text-slate-900 dark:text-white">
                    {inspectingNode.throughput}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">p99 Latency:</span>
                  <p className="font-sans tabular-nums font-semibold text-slate-900 dark:text-white">
                    {inspectingNode.latency}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setInspectingNode(null)}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
