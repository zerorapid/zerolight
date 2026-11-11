"use client";

import React, { useState } from "react";
import {
  ConsoleTableTemplate,
  Badge,
  Button,
  SearchBar,
  SegmentedControl,
  DetailDrawer,
  ConfirmationModal,
  TagChip,
} from "@/components/zerolight";
import {
  Key,
  Copy,
  Check,
  Plus,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  environment: "Production" | "Staging" | "Development";
  created: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: "k-01",
    name: "Production Stripe Webhook",
    keyPrefix: "zl_live_89a7...4c21",
    environment: "Production",
    created: "2026-09-12",
    lastUsed: "2 mins ago",
    status: "Active",
  },
  {
    id: "k-02",
    name: "Internal Analytics ETL",
    keyPrefix: "zl_live_41c0...9e88",
    environment: "Production",
    created: "2026-10-01",
    lastUsed: "14 mins ago",
    status: "Active",
  },
  {
    id: "k-03",
    name: "Mobile App Client (iOS)",
    keyPrefix: "zl_live_77e2...3f10",
    environment: "Production",
    created: "2026-10-18",
    lastUsed: "1 hour ago",
    status: "Active",
  },
  {
    id: "k-04",
    name: "CI/CD Staging Deployer",
    keyPrefix: "zl_stg_19d5...22ab",
    environment: "Staging",
    created: "2026-11-02",
    lastUsed: "Yesterday",
    status: "Active",
  },
  {
    id: "k-05",
    name: "Local Dev Testing (Sarah)",
    keyPrefix: "zl_dev_03fe...7a91",
    environment: "Development",
    created: "2026-11-08",
    lastUsed: "3 days ago",
    status: "Revoked",
  },
];

export function DevConsoleView() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(INITIAL_KEYS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedKey, setSelectedKey] = useState<ApiKeyRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 1800);
  };

  const handleCreateKey = () => {
    const newRecord: ApiKeyRecord = {
      id: `k-${Date.now().toString().slice(-4)}`,
      name: "New Integration Secret",
      keyPrefix: `zl_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      environment: "Production",
      created: "Today",
      lastUsed: "Just now",
      status: "Active",
    };
    setKeys((prev) => [newRecord, ...prev]);
    setIsCreateModalOpen(false);
  };

  const filteredKeys = keys.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv =
      selectedEnv === "all" || k.environment.toLowerCase() === selectedEnv.toLowerCase();
    return matchesSearch && matchesEnv;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ConsoleTableTemplate
        breadcrumbs={
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Cloud Infrastructure</span>
            <span>/</span>
            <span className="font-semibold text-neutral-900">API Gateway</span>
          </div>
        }
        title="API Gateway & Cloud Telemetry"
        subtitle="Live cluster endpoints, rate quotas, deployment matrices and production API keys."
        badge={
          <Badge variant="healthy">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>14 Clusters Operational</span>
            </span>
          </Badge>
        }
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Generate API Key
          </Button>
        }
        secondaryActions={
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => setKeys([...INITIAL_KEYS])}
          >
            Refresh
          </Button>
        }
        toolbar={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <SearchBar
              placeholder="Search API keys by label or prefix..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              className="w-full sm:w-80"
            />
            <SegmentedControl
              options={[
                { key: "all", label: "All Envs", count: keys.length },
                { key: "production", label: "Production", count: keys.filter((k) => k.environment === "Production").length },
                { key: "staging", label: "Staging", count: keys.filter((k) => k.environment === "Staging").length },
                { key: "development", label: "Dev", count: keys.filter((k) => k.environment === "Development").length },
              ]}
              value={selectedEnv}
              onChange={(val) => setSelectedEnv(val)}
            />
          </div>
        }
        table={
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/70 bg-neutral-50/50">
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Secret Label</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Key Prefix</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Environment</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Ingress</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Lifecycle</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredKeys.map((k) => (
                  <tr
                    key={k.id}
                    onClick={() => setSelectedKey(k)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-xs font-semibold text-neutral-900 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{k.name}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 font-sans tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-sans">
                          {k.keyPrefix}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(k.id, k.keyPrefix);
                          }}
                          className="p-1 hover:bg-neutral-200 rounded text-neutral-500 transition-colors cursor-pointer"
                          title="Copy Key"
                        >
                          {copiedKeyId === k.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 font-sans">
                      <TagChip label={k.environment} />
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-500 tabular-nums">
                      {k.lastUsed}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <Badge variant={k.status === "Active" ? "healthy" : "critical"}>
                        {k.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-right">
                      <span className="text-neutral-400 hover:text-neutral-900 font-medium">
                        View →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        detailDrawer={
          <DetailDrawer
            isOpen={selectedKey !== null}
            onClose={() => setSelectedKey(null)}
            title={selectedKey?.name || "Credential Metadata"}
            subtitle={`ID: ${selectedKey?.id} • Environment: ${selectedKey?.environment}`}
            footer={
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (selectedKey) {
                      setKeys((prev) =>
                        prev.map((k) =>
                          k.id === selectedKey.id ? { ...k, status: "Revoked" } : k
                        )
                      );
                      setSelectedKey(null);
                    }
                  }}
                >
                  Revoke Secret
                </Button>
                <Button variant="primary" size="sm" onClick={() => setSelectedKey(null)}>
                  Done
                </Button>
              </div>
            }
          >
            {selectedKey && (
              <div className="space-y-5 text-xs text-neutral-600">
                <div className="space-y-1">
                  <span className="font-semibold text-neutral-900 block">Prefix Secret</span>
                  <div className="flex items-center gap-2 p-2.5 bg-neutral-100 rounded-lg font-sans tabular-nums text-neutral-800">
                    <span>{selectedKey.keyPrefix}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedKey.id, selectedKey.keyPrefix)}
                      className="ml-auto text-neutral-500 hover:text-neutral-900"
                    >
                      {copiedKeyId === selectedKey.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Lifecycle</span>
                    <span className="font-semibold text-neutral-900 text-xs">{selectedKey.status}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Assigned Region</span>
                    <span className="font-semibold text-neutral-900 text-xs">us-east-1</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Issued Date</span>
                    <span className="font-semibold text-neutral-900 text-xs">{selectedKey.created}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Recent Ingress</span>
                    <span className="font-semibold text-neutral-900 text-xs">{selectedKey.lastUsed}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Revoking this key immediately terminates active ingress sessions.</span>
                </div>
              </div>
            )}
          </DetailDrawer>
        }
        modal={
          <ConfirmationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onConfirm={handleCreateKey}
            title="Issue Production API Credential"
            description="A new production secret with full ingress scopes will be provisioned."
            confirmButtonText="Generate Secret"
            verificationPhrase="CONFIRM"
          />
        }
      />
    </div>
  );
}
