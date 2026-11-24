"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, ScanSearch, Copy, Check, Sparkles, AlertTriangle, Code2, Globe, ArrowUpRight } from "lucide-react";
import { useZeroLight } from "../context";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Card } from "../atoms/card";
import { Input } from "../atoms/input";
import { Textarea } from "../atoms/textarea";
import { SegmentedControl } from "../molecules/segmented-control";
import { StatCard } from "../molecules/stat-card";
import { AlertBanner } from "../molecules/alert-banner";
import { EmptyState } from "../molecules/empty-state";
import {
  runZeroAuditorScan,
  formatAuditMarkdown,
  formatAuditTSV,
  AuditSeverity,
} from "./ai-footprint-rules";

const SLOPPY_SAAS_SAMPLE = `<section class="bg-black text-zinc-500 p-8 relative">
  <div class="blur-3xl opacity-30 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
  <h1 class="text-3xl font-bold">🚀 Supercharge your workflow with the the AI!</h1>
  <p>**Unlock actionable insights** for Acme Corporation — contact foo@example.com.</p>
  <span class="truncate font-mono">Enterprise cluster telemetry string without title attribute</span>
  <button class="rounded-full animate-shimmer bg-gradient-to-r from-purple-600 to-cyan-500">Get Started</button>
  <img src="/hero.png">
</section>`;

const CLEAN_ZEROLIGHT_SAMPLE = `<section data-zl-audit="clean" class="p-6 space-y-4">
  <div class="flex items-center justify-between">
    <h1 class="text-xl font-bold tracking-tight">GST Reconciliation Ledger</h1>
    <button type="button" class="px-4 py-2 text-xs font-semibold">Export Ledger</button>
  </div>
  <div class="grid grid-cols-3 gap-4">
    <div class="p-4 border rounded-xl">
      <span class="text-xs font-medium truncate" title="Net Settled Volume">Net Settled Volume</span>
      <div class="text-2xl font-bold font-sans tabular-nums">₹48,20,000</div>
    </div>
  </div>
  <img src="/ledger-mark.svg" alt="ZeroRapid Ledger Mark" />
</section>`;

export interface ZeroAuditorToolProps {
  onStatusToast?: (msg: string) => void;
}

export function ZeroAuditorTool({ onStatusToast }: ZeroAuditorToolProps) {
  const { tokens, scaled } = useZeroLight();
  const [scanMode, setScanMode] = useState<"markup" | "url" | "workspace">("markup");
  const [markupInput, setMarkupInput] = useState<string>(SLOPPY_SAAS_SAMPLE);
  const [urlInput, setUrlInput] = useState<string>("https://zerorapid.in");
  const [fetchedUrlMeta, setFetchedUrlMeta] = useState<{ url: string; title: string; html: string } | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [workspaceHtml, setWorkspaceHtml] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<"All" | AuditSeverity>("All");
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedTSV, setCopiedTSV] = useState(false);

  const activeSource =
    scanMode === "workspace"
      ? workspaceHtml
      : scanMode === "url"
      ? fetchedUrlMeta?.html || ""
      : markupInput;

  const report = useMemo(() => {
    return runZeroAuditorScan(activeSource);
  }, [activeSource]);

  const filteredFindings = useMemo(() => {
    if (severityFilter === "All") return report.findings;
    return report.findings.filter((f) => f.severity === severityFilter);
  }, [report.findings, severityFilter]);

  const handleScanUrl = async (targetOverride?: string) => {
    const raw = (targetOverride ?? urlInput).trim();
    if (!raw) return;
    setIsScanningUrl(true);
    setUrlError(null);
    setScanMode("url");
    try {
      const res = await fetch("/api/audit-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUrlError(data.error || "Unable to fetch website markup.");
        onStatusToast?.(data.error || "URL scan blocked or failed");
        return;
      }
      setFetchedUrlMeta({ url: data.url, title: data.title, html: data.html });
      onStatusToast?.(`Audited ${data.title} (${data.charCount.toLocaleString()} chars)`);
    } catch {
      setUrlError("Network error while contacting /api/audit-url.");
    } finally {
      setIsScanningUrl(false);
    }
  };

  const handleScanActiveDom = () => {
    if (typeof document === "undefined") return;
    const mainEl = document.querySelector("main") || document.body;
    const htmlSnapshot = mainEl ? mainEl.innerHTML.slice(0, 120000) : "";
    setWorkspaceHtml(htmlSnapshot);
    setScanMode("workspace");
    onStatusToast?.("Audited active ZeroLight DOM surface");
  };

  const handleCopyReport = () => {
    const label =
      scanMode === "workspace"
        ? "Active ZeroLight DOM"
        : scanMode === "url" && fetchedUrlMeta
        ? fetchedUrlMeta.url
        : "Submitted Markup";
    const md = formatAuditMarkdown(report, label);
    navigator.clipboard?.writeText(md);
    setCopiedReport(true);
    onStatusToast?.("Audit report copied as Markdown");
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyTSV = () => {
    const tsv = formatAuditTSV(report);
    navigator.clipboard?.writeText(tsv);
    setCopiedTSV(true);
    onStatusToast?.("Audit ledger copied as Google Sheets / Excel TSV");
    setTimeout(() => setCopiedTSV(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Zone 1: Header + 1 Primary Action + Max 4 KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b" style={{ borderColor: tokens.universalBorderColor }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: tokens.textIconColor }}>
              ZeroAuditor AI-Slop & UI Scanner
            </h1>
            <Badge variant={report.score >= 85 ? "healthy" : report.score >= 60 ? "degraded" : "critical"} size="xs">
              Grade {report.grade}
            </Badge>
          </div>
          <p className="text-xs opacity-70 mt-0.5" style={{ color: tokens.textIconColor }}>
            Audits live surfaces or JSX/HTML against ZeroLight contrast, anti-slop, and accessibility guardrails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTSV}
            iconLeft={copiedTSV ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedTSV ? "Copied TSV" : "Copy Excel TSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReport}
            iconLeft={copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedReport ? "Copied Report" : "Copy Markdown"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleScanActiveDom}
            iconLeft={<ScanSearch className="w-3.5 h-3.5" />}
          >
            Scan Live Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Clean Craft Score"
          value={`${report.score}/100`}
          delta={report.grade}
          trend={report.score >= 85 ? "up" : "down"}
          comparisonText={`${report.summary.rulesEvaluated} rules checked`}
        />
        <StatCard
          label="Blockers"
          value={report.summary.blockers}
          trend={report.summary.blockers === 0 ? "up" : "down"}
          comparisonText="A11y & broken syntax"
        />
        <StatCard
          label="Major Slop Flags"
          value={report.summary.majors}
          trend={report.summary.majors === 0 ? "up" : "down"}
          comparisonText="Contrast, gradients, cliché copy"
        />
        <StatCard
          label="Minor Hygiene"
          value={report.summary.minors}
          trend={report.summary.minors === 0 ? "up" : "neutral"}
          comparisonText="Radii, font-mono, token drift"
        />
      </div>

      {/* Zone 2: Source Inspector + Findings Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card padding="md" className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 opacity-70" style={{ color: tokens.textIconColor }} />
              <h2 className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
                Audit Target Source
              </h2>
            </div>

            <SegmentedControl<"markup" | "url" | "workspace">
              value={scanMode}
              onChange={(mode) => {
                if (mode === "workspace") handleScanActiveDom();
                else setScanMode(mode);
              }}
              options={[
                { key: "markup", label: "HTML / JSX" },
                { key: "url", label: "Website URL" },
                { key: "workspace", label: "Live DOM" },
              ]}
            />
          </div>

          {scanMode === "markup" ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMarkupInput(SLOPPY_SAAS_SAMPLE)}
                  iconLeft={<AlertTriangle className="w-3 h-3" style={{ color: tokens.textIconColor }} />}
                >
                  Load Sloppy AI Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMarkupInput(CLEAN_ZEROLIGHT_SAMPLE)}
                  iconLeft={<Sparkles className="w-3 h-3" style={{ color: tokens.primaryButtonColor }} />}
                >
                  Load Clean ZeroLight Sample
                </Button>
              </div>
              <Textarea
                rows={13}
                value={markupInput}
                onChange={(e) => setMarkupInput(e.target.value)}
                placeholder="Paste HTML, JSX, or AI-generated SaaS markup to scan..."
                className="text-xs leading-relaxed"
              />
            </>
          ) : scanMode === "url" ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleScanUrl();
                    }
                  }}
                  placeholder="https://your-saas-app.com"
                  iconLeft={<Globe className="w-3.5 h-3.5" />}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleScanUrl()}
                  disabled={isScanningUrl}
                  iconLeft={<ScanSearch className="w-3.5 h-3.5" />}
                >
                  {isScanningUrl ? "Scanning..." : "Fetch & Audit"}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUrlInput("https://zerorapid.in");
                    handleScanUrl("https://zerorapid.in");
                  }}
                >
                  Test zerorapid.in
                </Button>
              </div>

              {urlError && (
                <AlertBanner
                  severity="critical"
                  title="Website Audit Error"
                  description={urlError}
                />
              )}

              {fetchedUrlMeta && !urlError && (
                <AlertBanner
                  severity="info"
                  title={`Scanned ${fetchedUrlMeta.title}`}
                  description={`Audited ${fetchedUrlMeta.html.length.toLocaleString()} characters from ${fetchedUrlMeta.url}.`}
                />
              )}
            </div>
          ) : (
            <AlertBanner
              severity="info"
              title="Live ZeroLight DOM Snapshot Active"
              description={`Captured ${workspaceHtml.length.toLocaleString()} characters from the active workspace container. Click 'Scan Live Workspace' again after switching tabs or themes.`}
              action={
                <Button variant="outline" size="sm" onClick={() => setScanMode("markup")}>
                  Switch to Paste
                </Button>
              }
            />
          )}
        </Card>

        <Card padding="md" className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: tokens.universalBorderColor }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: tokens.textIconColor }}>
                Diagnostic Findings & ZeroLight Fixes
              </h2>
              <p className="text-xs opacity-70" style={{ color: tokens.textIconColor }}>
                Prioritized remediation guide for designers and AI coding agents.
              </p>
            </div>

            <SegmentedControl<"All" | AuditSeverity>
              value={severityFilter}
              onChange={setSeverityFilter}
              options={[
                { key: "All", label: "All" },
                { key: "Blocker", label: "Blocker" },
                { key: "Major", label: "Major" },
                { key: "Minor", label: "Minor" },
              ]}
            />
          </div>

          {filteredFindings.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="w-6 h-6" style={{ color: tokens.primaryButtonColor }} />}
              title="Zero AI Footprints Detected"
              description="The inspected markup complies cleanly with contrast, truncation safety, and tactile-calm hierarchy rules."
              actionText="Test Sloppy Sample"
              onAction={() => {
                setScanMode("markup");
                setMarkupInput(SLOPPY_SAAS_SAMPLE);
                setSeverityFilter("All");
              }}
            />
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 border space-y-2 transition-colors"
                  style={{
                    borderRadius: `${scaled.scaledRadius}px`,
                    borderColor: tokens.universalBorderColor,
                    backgroundColor: tokens.hoverBackplateTint,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold font-sans tabular-nums opacity-60" style={{ color: tokens.textIconColor }}>
                        #{finding.ruleNumber}
                      </span>
                      <span className="text-xs font-bold truncate" title={finding.title} style={{ color: tokens.textIconColor }}>
                        {finding.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="neutral" size="xs" showDot={false}>
                        {finding.category}
                      </Badge>
                      <Badge
                        variant={
                          finding.severity === "Blocker"
                            ? "critical"
                            : finding.severity === "Major"
                            ? "degraded"
                            : "info"
                        }
                        size="xs"
                      >
                        {finding.severity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed" style={{ color: tokens.textIconColor }}>
                    {finding.whatISee}
                  </p>
                  <div
                    className="text-[11px] font-medium px-3 py-2 border"
                    style={{
                      borderRadius: `${Math.max(4, scaled.scaledRadius - 2)}px`,
                      borderColor: tokens.universalBorderColor,
                      backgroundColor: tokens.universalFillColor,
                      color: tokens.textIconColor,
                    }}
                  >
                    <strong className="font-semibold">ZeroLight Fix: </strong>
                    {finding.zerolightFix}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* ZeroRapid Remediation Funnel CTA */}
          <Card variant="muted" padding="sm" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs" style={{ color: tokens.textIconColor }}>
              <span className="font-bold">
                {report.findings.length > 0
                  ? `Fix ${report.findings.length} craft issues fast:`
                  : "Want handcrafted SaaS UI?"}
              </span>{" "}
              <span className="opacity-75">
                ZeroRapid upgrades AI prototypes into production SaaS interfaces in 48 hours.
              </span>
            </div>
            <a href="https://zerorapid.in" target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Button variant="outline" size="sm" iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Book Craft Sprint · zerorapid.in
              </Button>
            </a>
          </Card>
        </Card>
      </div>
    </div>
  );
}
