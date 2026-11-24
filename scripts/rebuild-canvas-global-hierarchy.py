#!/usr/bin/env python3
"""
rebuild-canvas-global-hierarchy.py
Rebuilds the Visual Studio Dock canvas according to the user's exact specifications:
- Completely removes canvas mode tab menu and FinTech/DevTools/Workspace templates.
- Completely removes artificial numbering labels (e.g. "1. Brand", "5. Breadcrumb", "12. KPI Metric Card").
- Completely removes monospace tags, unknown labels, shortcut clutter (<kbd>).
- Strict Global Hierarchy (12 clean sections from Brand Logos to Data Viz & Chat).
- Full interactive states, dynamic token bindings, and content-fitted cards.
"""

import re

with open("dock-prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. NEW CSS STYLES FOR THE 12-SECTION GLOBAL HIERARCHY
new_component_css = """
    /* ================= GLOBAL HIERARCHY MODERN SPEC STYLES ================= */
    .spec-header-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 12px;
      margin-bottom: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    .spec-header-title {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      color: var(--foreground);
      letter-spacing: -0.01em;
    }
    .spec-header-desc {
      font-size: 12px;
      color: var(--muted);
    }

    /* Brand Logos Grid */
    .brand-variants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .brand-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 20px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      min-height: 110px;
      text-align: center;
    }
    .brand-app-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary) 0%, #1E1B4B 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 26px;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    .browser-tab-mock {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 8px 8px 0 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      font-size: 12px;
      color: var(--foreground);
      font-weight: 500;
    }
    .favicon-dot {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      background: var(--primary);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
    }

    /* Typescale Table */
    .typescale-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .typescale-table th {
      text-align: left;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }
    .typescale-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .typescale-table tr:last-child td {
      border-bottom: none;
    }

    /* Icon Showcase */
    .icon-styles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
    }
    .icon-style-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      text-align: center;
    }
    .icon-duotone-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--primary-subtle, rgba(225,29,72,0.1));
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    /* Buttons Anatomy & States */
    .button-state-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    /* Input & Form Elements */
    .field-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--foreground);
      margin-bottom: 4px;
      display: block;
    }
    .field-hint {
      font-size: 11px;
      color: var(--muted);
      margin-top: 3px;
    }
    .input-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .input-icon-wrap .prefix-icon {
      position: absolute;
      left: 10px;
      font-size: 14px;
      color: var(--muted);
      pointer-events: none;
    }
    .input-icon-wrap .suffix-clear {
      position: absolute;
      right: 10px;
      font-size: 13px;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border-radius: 4px;
    }
    .input-icon-wrap .suffix-clear:hover {
      background: var(--card-subtle);
      color: var(--foreground);
    }
    .input-icon-wrap input {
      width: 100%;
      height: 36px;
      padding: 0 32px 0 32px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #FFFFFF;
      color: var(--foreground);
      font-size: 13px;
      outline: none;
      transition: all 150ms ease;
    }
    .input-icon-wrap input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.12);
    }

    /* Textarea */
    .spec-textarea {
      width: 100%;
      height: 72px;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #FFFFFF;
      color: var(--foreground);
      font-family: inherit;
      font-size: 13px;
      resize: none;
      outline: none;
      transition: all 150ms ease;
    }
    .spec-textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.12);
    }

    /* Filter Chips */
    .filter-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      color: var(--foreground);
      cursor: pointer;
      transition: all 150ms ease;
    }
    .filter-chip.active {
      background: var(--primary);
      color: #FFFFFF;
      border-color: var(--primary);
    }
    .filter-chip .chip-dismiss {
      font-size: 12px;
      opacity: 0.7;
      display: flex;
      align-items: center;
    }
    .filter-chip .chip-dismiss:hover {
      opacity: 1;
    }

    /* Avatar Stack */
    .avatar-stack {
      display: flex;
      align-items: center;
    }
    .avatar-stack .spec-avatar {
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      border: 2px solid #FFFFFF;
      margin-left: -8px;
      background: #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      overflow: hidden;
    }
    .avatar-stack .spec-avatar:first-child {
      margin-left: 0;
    }
    .avatar-stack .spec-avatar.more-count {
      background: #F1F5F9;
      color: var(--muted);
      font-size: 10px;
    }

    /* Tooltip Demonstration */
    .tooltip-target-box {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .spec-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #0F172A;
      color: #FFFFFF;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      pointer-events: none;
    }
    .spec-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: #0F172A;
    }

    /* Data Visualization Charts */
    .chart-panel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .chart-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chart-card-title {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 700;
      color: var(--foreground);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Chat Workspace */
    .chat-stream-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-bubble-row {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }
    .chat-bubble-row.outgoing {
      justify-content: flex-end;
    }
    .chat-bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.45;
    }
    .chat-bubble.incoming {
      background: #F1F5F9;
      color: #0F172A;
      border-bottom-left-radius: 4px;
    }
    .chat-bubble.outgoing {
      background: var(--primary);
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
    }
    .chat-meta {
      font-size: 10px;
      color: var(--muted);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
"""

if ".spec-header-block" not in html:
    html = html.replace("</style>", new_component_css + "\n  </style>")

# 2. CONSTRUCT THE CLEAN 12-SECTION GLOBAL HIERARCHY CANVAS FLOW
new_canvas_html = """      <!-- LEFT CANVAS: CONTINUOUS SPECIFICATION FLOW (GLOBAL HIERARCHY) -->
      <main class="canvas-flow">

        <!-- BRAND IDENTITY & HERO LOCKUP -->
        <div class="canvas-hero" style="border:1px solid var(--border); border-radius:var(--card-radius); background:var(--card); margin-bottom:8px;">
          <div class="hero-mark-tile" id="heroMarkTile">Z</div>
          <div class="hero-title-group">
            <h2 id="heroBrandName">ZeroLight OS</h2>
            <p id="heroBrandTagline">Enterprise Brand Design System &amp; Live Runtime Tokens</p>
          </div>
        </div>

        <!-- ================= LEVEL 0: BRAND LOGO VARIANTS ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Brand Identity &amp; Logo Variants</div>
          <div class="spec-header-desc">Full logomark, wordmark, app icon, and micro favicon indicators</div>
        </div>

        <div class="brand-variants-grid">
          <!-- Wordmark -->
          <div class="brand-tile">
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em;">Wordmark</span>
            <div style="font-family:var(--font-heading); font-size:22px; font-weight:800; color:var(--foreground); letter-spacing:-0.03em;">
              <span id="wmBrandText">ZeroLight</span><span style="color:var(--primary);">&bull;</span>
            </div>
            <span style="font-size:11px; color:var(--muted);">Proportional font geometry</span>
          </div>

          <!-- Full Logo Lockup -->
          <div class="brand-tile">
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em;">Full Logo Lockup</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:6px; background:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-family:var(--font-heading); font-weight:800; font-size:14px;">Z</div>
              <span style="font-family:var(--font-heading); font-size:16px; font-weight:700; color:var(--foreground);">ZeroLight OS</span>
            </div>
            <span style="font-size:11px; color:var(--muted);">Symbol + Monogram + Name</span>
          </div>

          <!-- App Icon Squircle -->
          <div class="brand-tile">
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em;">App Icon</span>
            <div class="brand-app-icon" id="brandAppIconSquircle">Z</div>
            <span style="font-size:11px; color:var(--muted);">iOS &amp; macOS Desktop Icon</span>
          </div>

          <!-- Favicon Preview -->
          <div class="brand-tile">
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em;">Favicon Preview</span>
            <div class="browser-tab-mock">
              <div class="favicon-dot">Z</div>
              <span>ZeroLight &mdash; Dashboard</span>
            </div>
            <span style="font-size:11px; color:var(--muted);">16&times;16 &bull; 32&times;32 Tab Mark</span>
          </div>
        </div>

        <!-- ================= LEVEL 1: COLOR PALETTE & TONAL RAMP ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Color Palette &amp; Semantic Swatches</div>
          <div class="spec-header-desc">Primary brand ramp, secondary chart accent, and semantic status surfaces</div>
        </div>

        <div class="foundation-card">
          <div class="foundation-card-head">
            <span class="foundation-card-title">Semantic Surface Swatches</span>
            <span class="foundation-card-tag">Click to copy hex</span>
          </div>
          <div class="color-swatch-row" id="semanticSwatches">
            <!-- Swatches dynamically mounted by JS -->
          </div>
          <div class="tonal-ramp-container" style="margin-top:14px;">
            <div class="tonal-ramp-bar" id="tonalRampBar">
              <!-- Dynamic 11-step tonal ramp -->
            </div>
            <div class="contrast-score-row" style="margin-top:8px;">
              <span>Primary: <strong id="readoutHexLabel">#E11D48</strong></span>
              <span class="scoreChip" id="wcagBadge" style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:var(--success-subtle);color:var(--success);font-weight:600;font-size:11px;">WCAG AAA</span>
              <span style="margin-left:auto;">Secondary: <strong id="readoutSecHexLabel">#06B6D4</strong></span>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 2: TYPOGRAPHY & TYPESCALE ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Typography &amp; Typescale Hierarchy</div>
          <div class="spec-header-desc">Dynamic font catalog pairing, line-height leading, and letter-spacing tracking</div>
        </div>

        <div class="foundation-card">
          <table class="typescale-table">
            <thead>
              <tr>
                <th style="width:140px;">Role</th>
                <th style="width:100px;">Size / Weight</th>
                <th>Specimen Preview</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Display</strong></td>
                <td>32px &bull; Bold 700</td>
                <td style="font-family:var(--font-heading); font-size:32px; font-weight:700; line-height:1.2;">Next-Gen Cloud Ledger</td>
              </tr>
              <tr>
                <td><strong>Heading 1</strong></td>
                <td>24px &bull; Bold 700</td>
                <td style="font-family:var(--font-heading); font-size:24px; font-weight:700;">Enterprise Telemetry Ops</td>
              </tr>
              <tr>
                <td><strong>Heading 2</strong></td>
                <td>20px &bull; SemiBold 600</td>
                <td style="font-family:var(--font-heading); font-size:20px; font-weight:600;">Global Infrastructure Overview</td>
              </tr>
              <tr>
                <td><strong>Heading 3</strong></td>
                <td>16px &bull; SemiBold 600</td>
                <td style="font-family:var(--font-heading); font-size:16px; font-weight:600;">Security Protocols &amp; Key Rotation</td>
              </tr>
              <tr>
                <td><strong>Body</strong></td>
                <td>14px &bull; Regular 400</td>
                <td style="font-size:14px; color:var(--foreground); line-height:1.5;">ZeroLight provides token-driven design engineering with native mathematical physics and zero runtime overhead.</td>
              </tr>
              <tr>
                <td><strong>Caption</strong></td>
                <td>12px &bull; Medium 500</td>
                <td style="font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums;">Updated 4 minutes ago &bull; SHA-256: 7f3b890a &bull; Latency: 24ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ================= LEVEL 3: ICONOGRAPHY SYSTEM ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Iconography System</div>
          <div class="spec-header-desc">Stroke, fill, and dual-tone styles across Lucide and Iconify open-source sets</div>
        </div>

        <div class="icon-styles-grid">
          <div class="icon-style-card">
            <span style="font-size:11px; font-weight:600; color:var(--muted);">Outline 1.5px</span>
            <div style="font-size:22px; color:var(--foreground); display:flex; gap:8px;">
              <iconify-icon icon="lucide:shield-check"></iconify-icon>
              <iconify-icon icon="lucide:zap"></iconify-icon>
              <iconify-icon icon="lucide:activity"></iconify-icon>
            </div>
            <span style="font-size:11px; color:var(--muted);">Stroke 1.5px</span>
          </div>

          <div class="icon-style-card">
            <span style="font-size:11px; font-weight:600; color:var(--muted);">Outline 2.0px</span>
            <div style="font-size:22px; color:var(--foreground); display:flex; gap:8px;">
              <iconify-icon icon="lucide:server"></iconify-icon>
              <iconify-icon icon="lucide:database"></iconify-icon>
              <iconify-icon icon="lucide:key"></iconify-icon>
            </div>
            <span style="font-size:11px; color:var(--muted);">Stroke 2.0px</span>
          </div>

          <div class="icon-style-card">
            <span style="font-size:11px; font-weight:600; color:var(--muted);">Solid / Fill</span>
            <div style="font-size:22px; color:var(--foreground); display:flex; gap:8px;">
              <iconify-icon icon="solar:shield-check-bold"></iconify-icon>
              <iconify-icon icon="solar:bolt-bold"></iconify-icon>
              <iconify-icon icon="solar:star-bold"></iconify-icon>
            </div>
            <span style="font-size:11px; color:var(--muted);">Filled Glyphs</span>
          </div>

          <div class="icon-style-card">
            <span style="font-size:11px; font-weight:600; color:var(--muted);">Dual-Tone</span>
            <div style="display:flex; gap:8px;">
              <div class="icon-duotone-box"><iconify-icon icon="lucide:sparkles"></iconify-icon></div>
              <div class="icon-duotone-box"><iconify-icon icon="lucide:cpu"></iconify-icon></div>
              <div class="icon-duotone-box"><iconify-icon icon="lucide:globe"></iconify-icon></div>
            </div>
            <span style="font-size:11px; color:var(--muted);">Backplate + Stroke</span>
          </div>
        </div>

        <!-- ================= LEVEL 4: BUTTONS & ACTIONS ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Actions &amp; Button System</div>
          <div class="spec-header-desc">Visual variants, icon anatomies, and interactive states</div>
        </div>

        <div class="foundation-card" style="display:flex; flex-direction:column; gap:16px;">
          <!-- Variants -->
          <div>
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:8px;">Core Visual Variants</span>
            <div class="button-state-grid">
              <button class="btn primary sm" onclick="showToast('Primary Action')">Primary</button>
              <button class="btn secondary sm" onclick="showToast('Secondary Action')">Secondary</button>
              <button class="btn outline sm" onclick="showToast('Outline Action')">Outline</button>
              <button class="btn ghost sm" onclick="showToast('Ghost Action')">Ghost</button>
              <button class="btn destructive sm" onclick="showToast('Destructive Action')">Destructive</button>
            </div>
          </div>

          <!-- Icon Variations -->
          <div>
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:8px;">Icon Variations</span>
            <div class="button-state-grid">
              <button class="btn primary sm">
                <iconify-icon icon="lucide:plus"></iconify-icon>
                <span>Icon Left</span>
              </button>
              <button class="btn outline sm">
                <span>Icon Right</span>
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </button>
              <button class="btn secondary sm" style="width:30px; padding:0; justify-content:center;" title="Bookmark">
                <iconify-icon icon="lucide:bookmark"></iconify-icon>
              </button>
              <button class="btn outline sm" style="width:30px; padding:0; justify-content:center;" title="Settings">
                <iconify-icon icon="lucide:settings"></iconify-icon>
              </button>
            </div>
          </div>

          <!-- Interactive States -->
          <div>
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:8px;">Button States</span>
            <div class="button-state-grid">
              <button class="btn primary sm">Rest</button>
              <button class="btn primary sm" style="filter:brightness(0.92); box-shadow:0 0 0 2px rgba(225,29,72,0.25);">Focus / Hover</button>
              <button class="btn primary sm" disabled style="opacity:0.45; cursor:not-allowed;">Disabled</button>
              <button class="btn primary sm" style="pointer-events:none;">
                <span class="spinner" style="width:12px; height:12px; border-width:2px; border-color:#FFFFFF; border-right-color:transparent; margin-right:6px;"></span>
                <span>Loading</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 5: FORM CONTROLS & INPUT FIELDS ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Form Controls &amp; Input System</div>
          <div class="spec-header-desc">Inputs with icons, clear triggers, custom select, date picker, textarea, and fieldsets</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; align-items:start;">
          <!-- Text Input with Icons -->
          <div class="comp-card">
            <label class="field-label">Single-Line Input with Icons</label>
            <div class="input-icon-wrap">
              <iconify-icon icon="lucide:mail" class="prefix-icon"></iconify-icon>
              <input type="text" id="sampleInputWithIcons" value="alex@zerolight.dev" placeholder="Enter work email">
              <span class="suffix-clear" onclick="document.getElementById('sampleInputWithIcons').value=''; showToast('Input cleared');" title="Clear input">
                <iconify-icon icon="lucide:x"></iconify-icon>
              </span>
            </div>
            <span class="field-hint">Prefix icon &amp; interactive clear button</span>
          </div>

          <!-- Dropdown / Select Menu -->
          <div class="comp-card">
            <label class="field-label">Dropdown Menu (Scrollable Options)</label>
            <div class="custom-select-wrap">
              <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                <span id="selectedDropdownText">Enterprise Workspace</span>
                <iconify-icon icon="lucide:chevron-down"></iconify-icon>
              </div>
              <div class="custom-select-options">
                <div class="select-option selected" onclick="selectDropdownOption(this, 'Enterprise Workspace')">
                  <span>Enterprise Workspace</span>
                  <iconify-icon icon="lucide:check" style="color:var(--primary);"></iconify-icon>
                </div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Production Cluster 01')">Production Cluster 01</div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Staging Sandbox')">Staging Sandbox</div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Security Vault')">Security Vault</div>
              </div>
            </div>
            <span class="field-hint">Custom styled with search &amp; check indicator</span>
          </div>

          <!-- Date Picker -->
          <div class="comp-card">
            <label class="field-label">Date Picker</label>
            <div class="input-icon-wrap">
              <iconify-icon icon="lucide:calendar" class="prefix-icon"></iconify-icon>
              <input type="text" value="Nov 20, 2026" readonly style="cursor:pointer;" onclick="showToast('Date calendar selected');">
              <iconify-icon icon="lucide:calendar-days" style="position:absolute; right:10px; color:var(--muted); pointer-events:none;"></iconify-icon>
            </div>
            <div class="calendar-mini" style="margin-top:8px;">
              <span class="cal-day-name">M</span><span class="cal-day-name">T</span><span class="cal-day-name">W</span><span class="cal-day-name">T</span><span class="cal-day-name">F</span><span class="cal-day-name">S</span><span class="cal-day-name">S</span>
              <div class="cal-day">16</div><div class="cal-day">17</div><div class="cal-day">18</div><div class="cal-day">19</div>
              <div class="cal-day active" onclick="selectCalDay(this)">20</div><div class="cal-day" onclick="selectCalDay(this)">21</div><div class="cal-day" onclick="selectCalDay(this)">22</div>
            </div>
          </div>

          <!-- Textarea -->
          <div class="comp-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label class="field-label" style="margin-bottom:0;">Multi-Line Text Area</label>
              <span style="font-size:11px; color:var(--muted); font-variant-numeric:tabular-nums;" id="charCountReadout">84 / 200</span>
            </div>
            <textarea class="spec-textarea" placeholder="Add an operational summary..." oninput="document.getElementById('charCountReadout').textContent = this.value.length + ' / 200'">Production deployment completed with zero downtime across all regional edge zones.</textarea>
            <span class="field-hint">Dynamic character limit counter</span>
          </div>
        </div>

        <!-- ================= LEVEL 6: SELECTION CONTROLS ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Selection Controls</div>
          <div class="spec-header-desc">Radio button groups, tactile toggle switches, and multi-state checkboxes</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; align-items:start;">
          <!-- Radio Group -->
          <div class="comp-card">
            <label class="field-label">Radio Button Group</label>
            <div class="radio-group" style="margin-top:4px;">
              <label class="radio-label">
                <input type="radio" name="planSelect" checked>
                <div class="radio-circle"></div>
                <span>Autonomous Scaling</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="planSelect">
                <div class="radio-circle"></div>
                <span>Manual Provisioning</span>
              </label>
            </div>
          </div>

          <!-- Toggle Switches -->
          <div class="comp-card">
            <label class="field-label">Toggle Switches (Tactile Spring)</label>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:13px; color:var(--foreground);">Two-Factor Authentication</span>
                <div class="switch checked" onclick="toggleSwitch(this)"></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:13px; color:var(--foreground);">Audit Telemetry Stream</span>
                <div class="switch" onclick="toggleSwitch(this)"></div>
              </div>
            </div>
          </div>

          <!-- Checkboxes -->
          <div class="comp-card">
            <label class="field-label">Checkboxes</label>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:4px;">
              <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--primary); width:15px; height:15px;">
                <span>Checked Option</span>
              </label>
              <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                <input type="checkbox" style="accent-color:var(--primary); width:15px; height:15px;">
                <span>Unchecked Option</span>
              </label>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 7: CHIPS, TAGS & BADGES ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Chips, Tags &amp; Status Badges</div>
          <div class="spec-header-desc">Status indicators, categorical tag pills, and dismissible filter chips</div>
        </div>

        <div class="comp-card">
          <!-- Status Badges -->
          <div>
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:8px;">Status Badges</span>
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
              <span class="badge success" style="display:inline-flex; align-items:center; gap:5px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:var(--success);"></span>
                <span>Active</span>
              </span>
              <span class="badge warning" style="display:inline-flex; align-items:center; gap:5px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:var(--warning);"></span>
                <span>Pending</span>
              </span>
              <span class="badge primary" style="display:inline-flex; align-items:center; gap:5px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:var(--primary);"></span>
                <span>Failed</span>
              </span>
              <span class="badge" style="display:inline-flex; align-items:center; gap:5px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:var(--muted);"></span>
                <span>Archived</span>
              </span>
            </div>
          </div>

          <!-- Filter Chips -->
          <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
            <span style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:8px;">Dismissible Filter Chips</span>
            <div class="filter-chip-row">
              <div class="filter-chip active" onclick="this.classList.toggle('active')">
                <span>Production</span>
                <span class="chip-dismiss" onclick="event.stopPropagation(); this.parentElement.remove(); showToast('Filter removed');">&times;</span>
              </div>
              <div class="filter-chip" onclick="this.classList.toggle('active')">
                <span>US-East</span>
                <span class="chip-dismiss" onclick="event.stopPropagation(); this.parentElement.remove(); showToast('Filter removed');">&times;</span>
              </div>
              <div class="filter-chip" onclick="this.classList.toggle('active')">
                <span>Postgres v16</span>
                <span class="chip-dismiss" onclick="event.stopPropagation(); this.parentElement.remove(); showToast('Filter removed');">&times;</span>
              </div>
              <div class="filter-chip" onclick="this.classList.toggle('active')">
                <span>Latency &lt; 20ms</span>
                <span class="chip-dismiss" onclick="event.stopPropagation(); this.parentElement.remove(); showToast('Filter removed');">&times;</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 8: NAVIGATION & PROGRESSION ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Navigation &amp; Progression</div>
          <div class="spec-header-desc">Hierarchical breadcrumbs, segmented tab menus, and numbered pagination</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; align-items:start;">
          <!-- Breadcrumbs -->
          <div class="comp-card">
            <label class="field-label">Breadcrumb Trail</label>
            <nav class="breadcrumbs">
              <span>Organization</span>
              <iconify-icon icon="lucide:chevron-right" style="font-size:12px;"></iconify-icon>
              <span>Design System</span>
              <iconify-icon icon="lucide:chevron-right" style="font-size:12px;"></iconify-icon>
              <span class="active">Components</span>
            </nav>
          </div>

          <!-- Tab Menu -->
          <div class="comp-card">
            <label class="field-label">Tab Navigation Menu</label>
            <div class="tab-strip" style="background:#FFFFFF; border:1px solid var(--border);">
              <div class="tab-btn active" onclick="this.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Overview</div>
              <div class="tab-btn" onclick="this.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Analytics</div>
              <div class="tab-btn" onclick="this.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">Settings</div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="comp-card" style="grid-column: 1 / -1;">
            <label class="field-label">Pagination Controls</label>
            <div class="pagination">
              <button class="page-btn" onclick="showToast('Previous Page')">
                <iconify-icon icon="lucide:chevron-left"></iconify-icon>
              </button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span class="page-dots">&hellip;</span>
              <button class="page-btn">10</button>
              <button class="page-btn" onclick="showToast('Next Page')">
                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 9: AVATARS & TOOLTIPS ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Avatars &amp; Tooltips</div>
          <div class="spec-header-desc">Single user avatars, monogram fallbacks, stacked team groups, and tactile popovers</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; align-items:start;">
          <!-- Avatar System -->
          <div class="comp-card">
            <label class="field-label">Avatar Variations &amp; Stack</label>
            <div style="display:flex; align-items:center; gap:16px; margin-top:4px;">
              <!-- Single Avatar with Dot -->
              <div style="position:relative; width:34px; height:34px;">
                <div style="width:34px; height:34px; border-radius:9999px; background:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">JR</div>
                <span style="position:absolute; bottom:0; right:0; width:9px; height:9px; border-radius:9999px; background:var(--success); border:2px solid #FFFFFF;"></span>
              </div>

              <!-- Stack Group -->
              <div class="avatar-stack">
                <div class="spec-avatar" style="background:#3B82F6; color:#FFFFFF;">AK</div>
                <div class="spec-avatar" style="background:#10B981; color:#FFFFFF;">SL</div>
                <div class="spec-avatar" style="background:#F59E0B; color:#FFFFFF;">DM</div>
                <div class="spec-avatar more-count">+4</div>
              </div>
            </div>
          </div>

          <!-- Tooltip Demonstration -->
          <div class="comp-card">
            <label class="field-label">Tactile Hover Tooltip</label>
            <div style="padding-top:16px; display:flex; justify-content:center;">
              <div class="tooltip-target-box">
                <div class="spec-tooltip">Verified with YIQ Math</div>
                <button class="btn outline sm">
                  <iconify-icon icon="lucide:info"></iconify-icon>
                  <span>Hover Target</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 10: DATA VISUALIZATION (THE 3 CORE CHARTS) ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Data Visualization</div>
          <div class="spec-header-desc">Dual-accent telemetry: Line trend graph, comparative bar chart, and donut breakdown</div>
        </div>

        <div class="chart-panel-grid">
          <!-- 1. LINE GRAPH -->
          <div class="chart-card">
            <div class="chart-card-title">
              <span>Telemetry Revenue Trend</span>
              <span class="badge success">+14.2%</span>
            </div>
            <div style="height:140px; width:100%; position:relative;">
              <svg viewBox="0 0 320 120" style="width:100%; height:100%; overflow:visible;">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <!-- Grid hairlines -->
                <line x1="0" y1="20" x2="320" y2="20" stroke="var(--border)" stroke-dasharray="3 3" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="var(--border)" stroke-dasharray="3 3" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="var(--border)" stroke-dasharray="3 3" />
                <!-- Area -->
                <polygon points="0,100 0,70 50,65 100,80 150,45 200,50 250,25 300,35 320,15 320,100" fill="url(#lineGrad)" />
                <!-- Line -->
                <polyline points="0,70 50,65 100,80 150,45 200,50 250,25 300,35 320,15" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <!-- Highlight Point -->
                <circle cx="250" cy="25" r="4" fill="#FFFFFF" stroke="var(--primary)" stroke-width="2.5" />
              </svg>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--muted); font-variant-numeric:tabular-nums;">
              <span>Oct 01</span><span>Oct 15</span><span>Nov 01</span><span>Nov 20</span>
            </div>
          </div>

          <!-- 2. BAR GRAPH -->
          <div class="chart-card">
            <div class="chart-card-title">
              <span>Primary vs. Secondary Run-Rate</span>
              <span style="font-size:11px; color:var(--muted); font-weight:normal;">Normalized</span>
            </div>
            <div style="height:140px; width:100%; display:flex; align-items:flex-end; gap:14px; padding:10px 0 0 0;">
              <!-- Bar Group 1 -->
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%;">
                <div style="flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; gap:4px;">
                  <div style="width:12px; height:65%; background:var(--primary); border-radius:3px 3px 0 0;" title="Primary: $65k"></div>
                  <div style="width:12px; height:40%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $40k"></div>
                </div>
                <span style="font-size:10px; color:var(--muted);">Q1</span>
              </div>
              <!-- Bar Group 2 -->
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%;">
                <div style="flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; gap:4px;">
                  <div style="width:12px; height:80%; background:var(--primary); border-radius:3px 3px 0 0;" title="Primary: $80k"></div>
                  <div style="width:12px; height:55%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $55k"></div>
                </div>
                <span style="font-size:10px; color:var(--muted);">Q2</span>
              </div>
              <!-- Bar Group 3 -->
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%;">
                <div style="flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; gap:4px;">
                  <div style="width:12px; height:92%; background:var(--primary); border-radius:3px 3px 0 0;" title="Primary: $92k"></div>
                  <div style="width:12px; height:70%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $70k"></div>
                </div>
                <span style="font-size:10px; color:var(--muted);">Q3</span>
              </div>
              <!-- Bar Group 4 -->
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%;">
                <div style="flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; gap:4px;">
                  <div style="width:12px; height:100%; background:var(--primary); border-radius:3px 3px 0 0;" title="Primary: $100k"></div>
                  <div style="width:12px; height:85%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $85k"></div>
                </div>
                <span style="font-size:10px; color:var(--muted);">Q4</span>
              </div>
            </div>
            <div style="display:flex; justify-content:center; gap:16px; font-size:11px; color:var(--muted); border-top:1px solid var(--border); padding-top:6px;">
              <span style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:2px; background:var(--primary);"></span> Primary</span>
              <span style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:2px; background:var(--secondary-accent, #06B6D4);"></span> Secondary</span>
            </div>
          </div>

          <!-- 3. DONUT / PIE CHART -->
          <div class="chart-card">
            <div class="chart-card-title">
              <span>Traffic Distribution</span>
              <span style="font-size:11px; color:var(--muted);">100% Total</span>
            </div>
            <div style="height:140px; display:flex; align-items:center; justify-content:center; position:relative;">
              <svg viewBox="0 0 100 100" style="width:110px; height:110px; transform:rotate(-90deg);">
                <!-- Ring Background -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="12" />
                <!-- Primary Segment (58%) -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--primary)" stroke-width="12" stroke-dasharray="138 240" stroke-dashoffset="0" />
                <!-- Secondary Segment (28%) -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--secondary-accent, #06B6D4)" stroke-width="12" stroke-dasharray="67 240" stroke-dashoffset="-138" />
                <!-- Neutral Segment (14%) -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="#94A3B8" stroke-width="12" stroke-dasharray="33 240" stroke-dashoffset="-205" />
              </svg>
              <!-- Center Metric -->
              <div style="position:absolute; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-family:var(--font-heading); font-size:16px; font-weight:800; color:var(--foreground);" class="tabular-nums">58%</span>
                <span style="font-size:9px; color:var(--muted); text-transform:uppercase;">Direct</span>
              </div>
            </div>
            <div style="display:flex; justify-content:center; gap:12px; font-size:11px; color:var(--muted); border-top:1px solid var(--border); padding-top:6px;">
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--primary);"></span> 58% Direct</span>
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--secondary-accent, #06B6D4);"></span> 28% API</span>
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:#94A3B8);"></span> 14% Other</span>
            </div>
          </div>
        </div>

        <!-- ================= LEVEL 11: MESSAGING & CHAT WORKSPACE ================= -->
        <div class="spec-header-block">
          <div class="spec-header-title">Messaging &amp; Chat Workspace</div>
          <div class="spec-header-desc">Interactive chat bubbles with sender, assistant replies, delivery timestamps, and receipts</div>
        </div>

        <div class="chat-stream-box">
          <!-- Incoming Assistant Message -->
          <div class="chat-bubble-row">
            <div style="width:28px; height:28px; border-radius:9999px; background:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0;">AI</div>
            <div>
              <div class="chat-bubble incoming">
                ZeroLight Design System tokens have been loaded. All math physics, colors, and typestyles are synced with the live runtime inspector.
              </div>
              <div class="chat-meta">
                <span>ZeroLight Assistant</span> &bull; <span>10:42 AM</span>
              </div>
            </div>
          </div>

          <!-- Outgoing User Message -->
          <div class="chat-bubble-row outgoing">
            <div style="display:flex; flex-direction:column; align-items:flex-end;">
              <div class="chat-bubble outgoing">
                Verify that primary and secondary accents respond across charts, buttons, and app icons.
              </div>
              <div class="chat-meta">
                <span>10:43 AM</span> &bull; <iconify-icon icon="lucide:check-check" style="color:var(--primary);"></iconify-icon>
              </div>
            </div>
          </div>
        </div>

      </main>"""

# Find exact start and end of <main class="canvas-flow">...</main>
start_main = html.find('<main class="canvas-flow">')
end_main = html.find('</main>', start_main)

if start_main != -1 and end_main != -1:
    html = html[:start_main] + new_canvas_html + html[end_main + len('</main>'):]
    print("Replaced <main class=\"canvas-flow\"> block successfully!")
else:
    print("Could not find <main class=\"canvas-flow\"> boundaries!")

# 3. CLEAN UP ANY REMAINING OBSOLETE CANVAS SWITCH SCRIPT CODE
html = re.sub(r'function switchCanvasView\([^)]*\)\s*\{[^}]*\}', '// Canvas view switching removed in favor of single unified global hierarchy', html)

with open("dock-prototype.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated dock-prototype.html cleanly!")
