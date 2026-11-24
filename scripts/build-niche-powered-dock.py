#!/usr/bin/env python3
"""
build-niche-powered-dock.py
Upgrades dock-prototype.html with:
1. Canvas View Switcher (Spec & 27 Primitives, FinTech Ops, Cloud DevTools, B2B Workspace).
2. True 15-Minute Niche SaaS Assembled Views.
3. Multi-Format Code Export including Next.js React (TSX), Tailwind v4, CSS Variables, and Figma DTCG JSON.
4. True token binding across all views and primitives.
"""

import re

# Read current dock-prototype.html
with open("dock-prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add Canvas View Switcher bar directly above main canvas content
view_switcher_html = """
        <!-- CANVAS VIEW MODE SWITCHER (15-Minute Niche SaaS Engine) -->
        <div class="view-mode-bar" style="display:flex; justify-content:space-between; align-items:center; background:var(--card-subtle); border:1px solid var(--border); border-radius:var(--radius); padding:6px 12px; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em;">Canvas Mode:</span>
            <div class="tab-strip" style="background:#FFFFFF; border:1px solid var(--border); padding:2px; margin:0;">
              <div class="tab-btn active" id="btnViewSpec" onclick="switchCanvasView('spec')">Foundations &amp; 27 Primitives</div>
              <div class="tab-btn" id="btnViewFintech" onclick="switchCanvasView('fintech')">FinTech Revenue Ops</div>
              <div class="tab-btn" id="btnViewDevtools" onclick="switchCanvasView('devtools')">Cloud DevTools</div>
              <div class="tab-btn" id="btnViewWorkspace" onclick="switchCanvasView('workspace')">B2B Team Workspace</div>
            </div>
          </div>
          <span style="font-size:11px; color:var(--muted); font-weight:500;" id="viewModeTag">Full Design System Specification</span>
        </div>
"""

# Replace insertion point before HERO BRAND LOCKUP
if "<!-- CANVAS VIEW MODE SWITCHER" not in html:
    html = html.replace('<!-- HERO BRAND LOCKUP -->', view_switcher_html + '\n        <!-- HERO BRAND LOCKUP -->')

# 2. Add container for Niche Assembled Views
niche_views_container = """
        <!-- ================= ASSEMBLED NICHE SAAS BLUEPRINTS (Hidden by default, shown via View Switcher) ================= -->
        <div id="nicheBlueprintContainer" style="display:none; flex-direction:column; gap:24px;">

          <!-- 1. FINTECH REVENUE OPS BLUEPRINT -->
          <div id="blueprintFintech" style="display:none; flex-direction:column; gap:20px;">
            <div class="spec-section">
              <div class="section-headline">
                <h3>Revenue Telemetry &amp; Monthly Run-Rate</h3>
                <span>Realtime Stripe Ledger Stream</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">Monthly Recurring Revenue</span>
                      <span class="badge success">+14.2%</span>
                    </div>
                    <div class="kpi-value">$148,250.00</div>
                    <span style="font-size:11px; color:var(--muted);">vs. $129,100 last 30d &bull; 99.98% retention</span>
                  </div>
                </div>
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">Annual Run Rate (ARR)</span>
                      <span class="badge success">+18.4%</span>
                    </div>
                    <div class="kpi-value">$1,779,000.00</div>
                    <span style="font-size:11px; color:var(--muted);">Normalized across 42 enterprise seats</span>
                  </div>
                </div>
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">Gross Margin</span>
                      <span class="badge primary">86.4%</span>
                    </div>
                    <div class="kpi-value">$128,088.00</div>
                    <span style="font-size:11px; color:var(--muted);">COGS: AWS + OpenAI API egress</span>
                  </div>
                </div>
              </div>

              <!-- Revenue Area Chart -->
              <div class="comp-card" style="padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <strong style="font-size:13px;">Net Revenue Velocity (12 Month Trajectory)</strong>
                  <span class="badge success">Target Achieved</span>
                </div>
                <div style="height:120px; width:100%;">
                  <svg viewBox="0 0 600 120" style="width:100%; height:100%; overflow:visible;">
                    <defs>
                      <linearGradient id="fintechAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,105 C80,95 140,80 200,85 C260,90 320,60 380,50 C440,40 500,20 600,10 L600,120 L0,120 Z" fill="url(#fintechAreaGrad)"/>
                    <path d="M0,105 C80,95 140,80 200,85 C260,90 320,60 380,50 C440,40 500,20 600,10" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
                  </svg>
                </div>
              </div>

              <!-- Invoices Table & Stripe Tier -->
              <div style="display:grid; grid-template-columns:1fr 340px; gap:16px;">
                <div class="comp-card" style="padding:0; overflow:hidden;">
                  <table class="saas-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th style="text-align:right;">Billed MRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Stripe Technologies</strong></td>
                        <td>Enterprise Custom</td>
                        <td><span class="badge success">Paid</span></td>
                        <td style="text-align:right;" class="tabular-nums">$32,400.00</td>
                      </tr>
                      <tr>
                        <td><strong>Vercel Global</strong></td>
                        <td>Pro Annual</td>
                        <td><span class="badge success">Paid</span></td>
                        <td style="text-align:right;" class="tabular-nums">$14,500.00</td>
                      </tr>
                      <tr>
                        <td><strong>Linear Systems</strong></td>
                        <td>Scale Tier</td>
                        <td><span class="badge warning">Pending</span></td>
                        <td style="text-align:right;" class="tabular-nums">$8,250.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Stripe Card Preview -->
                <div class="comp-card" style="padding:18px; justify-content:space-between;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; font-weight:600; color:var(--muted);">Billing Method</span>
                    <span class="badge primary">Default</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:12px; margin:10px 0;">
                    <div style="width:40px; height:26px; border-radius:4px; background:#1E293B; color:#FFFFFF; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;">VISA</div>
                    <div>
                      <div style="font-size:13px; font-weight:600;">Ending in &bull;&bull;&bull;&bull; 4242</div>
                      <div style="font-size:11px; color:var(--muted);">Expires 12/28 &bull; Auto-debit active</div>
                    </div>
                  </div>
                  <button class="btn sm outline" style="width:100%;" onclick="showToast('Manage payment method opened')">Manage Payment Gateway</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. CLOUD DEVTOOLS BLUEPRINT -->
          <div id="blueprintDevtools" style="display:none; flex-direction:column; gap:20px;">
            <div class="spec-section">
              <div class="section-headline">
                <h3>Edge Cluster Infrastructure &amp; Latency Monitor</h3>
                <span>99.99% Production Uptime</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">Active Microservices</span>
                      <span class="badge success">24 / 24 Healthy</span>
                    </div>
                    <div class="kpi-value">1,420 RPS</div>
                    <span style="font-size:11px; color:var(--muted);">Globally routed via Anycast DNS</span>
                  </div>
                </div>
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">P99 Gateway Latency</span>
                      <span class="badge success">14.2ms</span>
                    </div>
                    <div class="kpi-value">24.8ms</div>
                    <span style="font-size:11px; color:var(--muted);">Within SLA threshold (&lt;50ms)</span>
                  </div>
                </div>
                <div class="comp-card">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <span class="kpi-label">Error Rate (5xx)</span>
                      <span class="badge success">0.001%</span>
                    </div>
                    <div class="kpi-value">0.00%</div>
                    <span style="font-size:11px; color:var(--muted);">Zero dropped packets in last 24h</span>
                  </div>
                </div>
              </div>

              <!-- Endpoint ConjoinedField & SplitButton -->
              <div class="comp-card" style="padding:18px;">
                <label style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase;">Production Webhook Receiver</label>
                <div style="display:flex; gap:10px; margin-top:8px;">
                  <div style="display:flex; flex:1; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden;">
                    <span style="background:var(--secondary); padding:0 12px; display:flex; align-items:center; font-size:12px; color:var(--muted); border-right:1px solid var(--border);">https://</span>
                    <input type="text" readonly value="api.zerolight.dev/v1/telemetry/events" style="flex:1; border:none; padding:0 12px; font-size:12px; outline:none; background:#FFFFFF;">
                    <button class="btn sm ghost" onclick="showToast('Copied endpoint URL')"><iconify-icon icon="lucide:copy"></iconify-icon></button>
                  </div>
                  <button class="btn primary sm" onclick="showToast('Triggered test event payload')">Trigger Event</button>
                  <button class="btn sm" onclick="showToast('Cluster logs refreshed')">Rotate Key</button>
                </div>
              </div>

              <!-- Microservice Table -->
              <div class="comp-card" style="padding:0; overflow:hidden;">
                <table class="saas-table">
                  <thead>
                    <tr>
                      <th>Service Key</th>
                      <th>Region</th>
                      <th>Cluster Status</th>
                      <th style="text-align:right;">Memory</th>
                      <th style="text-align:right;">P99 Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>api.edge.prod</strong></td>
                      <td>us-east-1</td>
                      <td><span class="badge success">99.98%</span></td>
                      <td style="text-align:right;" class="tabular-nums">256MB / 1GB</td>
                      <td style="text-align:right;" class="tabular-nums">14.2ms</td>
                    </tr>
                    <tr>
                      <td><strong>db.aurora.read</strong></td>
                      <td>ap-south-1</td>
                      <td><span class="badge success">Active</span></td>
                      <td style="text-align:right;" class="tabular-nums">1.2GB / 4GB</td>
                      <td style="text-align:right;" class="tabular-nums">6.8ms</td>
                    </tr>
                    <tr>
                      <td><strong>worker.sync.job</strong></td>
                      <td>eu-central-1</td>
                      <td><span class="badge warning">Queued</span></td>
                      <td style="text-align:right;" class="tabular-nums">512MB / 2GB</td>
                      <td style="text-align:right;" class="tabular-nums">28.4ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 3. B2B TEAM WORKSPACE BLUEPRINT -->
          <div id="blueprintWorkspace" style="display:none; flex-direction:column; gap:20px;">
            <div class="spec-section">
              <div class="section-headline">
                <h3>Multi-Tenant Organization &amp; RBAC Directory</h3>
                <span>Enterprise Governance</span>
              </div>
              <div class="comp-card" style="padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div class="hero-mark-tile" style="width:40px; height:40px; font-size:16px;">Z</div>
                    <div>
                      <div style="font-size:14px; font-weight:700;">ZeroLight Enterprise Workspace</div>
                      <div style="font-size:12px; color:var(--muted);">Global Org ID: org_zl_99182a4 &bull; SSO Enforced</div>
                    </div>
                  </div>
                  <span class="badge success">Primary Org</span>
                </div>
              </div>

              <!-- Team Permissions Matrix -->
              <div class="comp-card" style="padding:0; overflow:hidden;">
                <table class="saas-table">
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      <th>Role</th>
                      <th>Access Level</th>
                      <th>MFA Status</th>
                      <th style="text-align:right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Alex Rivera</strong> (alex@zerolight.dev)</td>
                      <td>Workspace Admin</td>
                      <td><span class="badge primary">Full Control</span></td>
                      <td><span class="badge success">Hardware Key</span></td>
                      <td style="text-align:right;"><button class="btn sm ghost" onclick="showToast('Manage permissions')">Edit</button></td>
                    </tr>
                    <tr>
                      <td><strong>Sarah Chen</strong> (sarah@zerolight.dev)</td>
                      <td>Staff Designer</td>
                      <td><span class="badge primary">Design Tokens Only</span></td>
                      <td><span class="badge success">Authenticator</span></td>
                      <td style="text-align:right;"><button class="btn sm ghost" onclick="showToast('Manage permissions')">Edit</button></td>
                    </tr>
                    <tr>
                      <td><strong>David Kim</strong> (david@zerolight.dev)</td>
                      <td>Backend Engineer</td>
                      <td><span class="badge secondary">Read &bull; API Vault</span></td>
                      <td><span class="badge warning">SMS Fallback</span></td>
                      <td style="text-align:right;"><button class="btn sm ghost" onclick="showToast('Manage permissions')">Edit</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
"""

# Insert niche blueprints before </main>
if "<!-- ================= ASSEMBLED NICHE SAAS BLUEPRINTS" not in html:
    html = html.replace('</main>', niche_views_container + '\n      </main>')

# 3. Update Export Modal tabs to include Next.js React (TSX)
old_export_tabs = """      <div class="tab-strip" style="margin-bottom:8px;">
        <div class="tab-btn active" onclick="switchExportTab(this, 'css')">CSS Variables</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'tailwind')">Tailwind v4 @theme</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'json')">Figma DTCG JSON</div>
      </div>"""

new_export_tabs = """      <div class="tab-strip" style="margin-bottom:8px;">
        <div class="tab-btn active" onclick="switchExportTab(this, 'react')">Next.js React (TSX)</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'tailwind')">Tailwind v4 @theme</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'css')">CSS Variables</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'json')">Figma DTCG JSON</div>
      </div>"""

html = html.replace(old_export_tabs, new_export_tabs)

# 4. Add JavaScript for View Switching and React TSX Generator
js_additions = """
    let currentCanvasView = 'spec';

    function switchCanvasView(viewKey) {
      currentCanvasView = viewKey;
      const specSec = document.getElementById('foundationsSection');
      const compSec = document.getElementById('componentsSection');
      const nicheContainer = document.getElementById('nicheBlueprintContainer');
      const tag = document.getElementById('viewModeTag');

      ['btnViewSpec', 'btnViewFintech', 'btnViewDevtools', 'btnViewWorkspace'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });

      ['blueprintFintech', 'blueprintDevtools', 'blueprintWorkspace'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      if (viewKey === 'spec') {
        document.getElementById('btnViewSpec').classList.add('active');
        specSec.style.display = 'flex';
        compSec.style.display = 'flex';
        nicheContainer.style.display = 'none';
        tag.textContent = 'Full Design System Specification';
      } else {
        document.getElementById('btnView' + viewKey.charAt(0).toUpperCase() + viewKey.slice(1)).classList.add('active');
        specSec.style.display = 'none';
        compSec.style.display = 'none';
        nicheContainer.style.display = 'flex';

        if (viewKey === 'fintech') {
          document.getElementById('blueprintFintech').style.display = 'flex';
          tag.textContent = 'FinTech Revenue Ops (Live Assembled SaaS)';
        } else if (viewKey === 'devtools') {
          document.getElementById('blueprintDevtools').style.display = 'flex';
          tag.textContent = 'Cloud DevTools Console (Live Assembled SaaS)';
        } else if (viewKey === 'workspace') {
          document.getElementById('blueprintWorkspace').style.display = 'flex';
          tag.textContent = 'B2B Team Workspace (Live Assembled SaaS)';
        }
      }
      showToast(`Switched canvas to: ${viewKey.toUpperCase()}`);
    }
"""

# Replace in script
html = html.replace("let state = Object.assign({}, DEFAULTS);", "let state = Object.assign({}, DEFAULTS);\n" + js_additions)

# Update renderExportCode function to support 'react'
old_render_export = """    function renderExportCode(format) {
      const textarea = document.getElementById('exportCodeTextarea');
      if (format === 'css') {"""

new_render_export = """    function renderExportCode(format) {
      const textarea = document.getElementById('exportCodeTextarea');
      if (format === 'react') {
        if (currentCanvasView === 'fintech') {
          textarea.value = `// ${state.brandName} - FinTech Revenue Dashboard (Next.js 15 + Tailwind)
"use client";

import React from "react";

export default function FinTechRevenueDashboard() {
  return (
    <div className="min-h-screen bg-[${state.primaryColor}]/5 p-8 font-['${state.bodyFont}'] text-[#09090B]">
      <header className="mb-8 flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="font-['${state.headingFont}'] text-2xl font-bold tracking-tight">${state.brandName} Revenue Ops</h1>
          <p className="text-sm text-[#64748B]">${state.brandTagline}</p>
        </div>
        <button className="h-[${state.density}] rounded-[${state.cornerRadius}] bg-[${state.primaryColor}] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
          Deploy Ledger
        </button>
      </header>

      {/* 3 Metric Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[${state.cornerRadius}] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-[#64748B]">
            <span>Monthly Recurring Revenue</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">+14.2%</span>
          </div>
          <div className="mt-2 font-['${state.headingFont}'] text-3xl font-bold tabular-nums">$148,250.00</div>
        </div>
        <div className="rounded-[${state.cornerRadius}] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-[#64748B]">
            <span>Annual Run Rate (ARR)</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">+18.4%</span>
          </div>
          <div className="mt-2 font-['${state.headingFont}'] text-3xl font-bold tabular-nums">$1,779,000.00</div>
        </div>
        <div className="rounded-[${state.cornerRadius}] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-[#64748B]">
            <span>Gross Margin</span>
            <span className="rounded-full bg-[${state.primaryColor}]/10 px-2 py-0.5 text-[${state.primaryColor}]">86.4%</span>
          </div>
          <div className="mt-2 font-['${state.headingFont}'] text-3xl font-bold tabular-nums">$128,088.00</div>
        </div>
      </div>
    </div>
  );
}`;
        } else if (currentCanvasView === 'devtools') {
          textarea.value = `// ${state.brandName} - Cloud DevTools Console (Next.js 15 + Tailwind)
"use client";

import React from "react";

export default function CloudConsoleDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-['${state.bodyFont}'] text-[#09090B]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-[${state.cornerRadius}] bg-[${state.primaryColor}] text-white font-bold flex items-center justify-center">${state.brandMark}</div>
        <div>
          <h1 className="font-['${state.headingFont}'] text-xl font-bold">${state.brandName} Edge Cluster</h1>
          <p className="text-xs text-[#64748B]">P99 Latency: 14.2ms &bull; 24 Nodes Healthy</p>
        </div>
      </div>
    </div>
  );
}`;
        } else {
          textarea.value = `// ${state.brandName} - Enterprise Workspace Screen (Next.js 15 + Tailwind)
"use client";

import React from "react";

export default function WorkspaceScreen() {
  return (
    <div className="min-h-screen bg-white p-8 font-['${state.bodyFont}'] text-[#09090B]">
      <h1 className="font-['${state.headingFont}'] text-2xl font-bold">${state.brandName} Organization Directory</h1>
      <p className="text-sm text-[#64748B] mt-1">${state.brandTagline}</p>
    </div>
  );
}`;
        }
      } else if (format === 'css') {"""

html = html.replace(old_render_export, new_render_export)

# Save back to dock-prototype.html
with open("dock-prototype.html", "w", encoding="utf-8") as f:
    f.write(html)

print("dock-prototype.html successfully upgraded with Niche SaaS Blueprint Engine and React TSX Exporter!")
