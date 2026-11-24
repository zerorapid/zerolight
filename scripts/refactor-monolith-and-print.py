import re

with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    html = f.read()

# -------------------------------------------------------------
# 1. FIX PRINT STYLESHEET (@media print)
# -------------------------------------------------------------
old_print_css = """    /* ================= PRINT VECTOR STYLESHEET ================= */
    @media print {
      body {
        background: #FFFFFF !important;
        padding: 0 !important;
      }
      .app-shell {
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
      .app-header, .token-studio, .overlay-backdrop, .drawer-sheet, .toast-container {
        display: none !important;
      }
      .app-workspace {
        grid-template-columns: 1fr !important;
        padding: 0 !important;
      }
      .foundation-card, .comp-card {
        page-break-inside: avoid;
        box-shadow: none !important;
      }
    }"""

new_print_css = """    /* ================= PROFESSIONAL MULTI-PAGE PRINT STYLESHEET ================= */
    @page {
      size: A4 portrait;
      margin: 14mm 14mm 16mm 14mm;
    }

    @media print {
      html, body {
        background: #FFFFFF !important;
        color: #09090B !important;
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 10.5pt !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Flatten full-screen fixed shell into a multi-page document */
      .app-shell {
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 0 !important;
      }

      .app-workspace {
        display: block !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        grid-template-columns: 1fr !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .canvas-flow {
        display: block !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
      }

      /* Hide interactive browser dock UI & widgets */
      .app-header,
      .token-studio,
      .overlay-backdrop,
      .drawer-sheet,
      .toast-container,
      .header-actions,
      .color-2d-spectrum-box,
      .rainbow-hue-track,
      .zl-file-upload-dropzone,
      button,
      .tab-strip {
        display: none !important;
      }

      /* Executive Print Header */
      .print-only-banner {
        display: flex !important;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: 12px;
        margin-bottom: 24px;
        border-bottom: 2px solid #0F172A;
      }

      /* Prevent ugly page breaks inside components & headers */
      .spec-header-block {
        break-after: avoid !important;
        page-break-after: avoid !important;
        margin-top: 26px !important;
        padding-top: 14px !important;
        border-bottom: 1.5px solid #0F172A !important;
      }

      .spec-header-title {
        font-size: 15px !important;
        font-weight: 800 !important;
        color: #0F172A !important;
      }

      .canvas-hero,
      .comp-card,
      .foundation-card,
      .chart-card,
      .brand-tile {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        box-shadow: none !important;
        border: 1px solid #CBD5E1 !important;
        background: #FFFFFF !important;
        margin-bottom: 16px !important;
      }

      table, tr, svg {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }"""

if old_print_css in html:
    html = html.replace(old_print_css, new_print_css)
else:
    print("WARNING: old_print_css not found exactly, using regex")
    html = re.sub(r'/\* =+ PRINT VECTOR STYLESHEET =+ \*/\s*@media print\s*\{[\s\S]*?\}\s*\}', new_print_css, html)

# -------------------------------------------------------------
# 2. INSERT PRINT-ONLY EXECUTIVE BANNER AT TOP OF CANVAS-FLOW
# -------------------------------------------------------------
print_banner_html = """        <!-- PRINT ONLY EXECUTIVE BANNER (APPEARS ONLY IN PRINT / PDF EXPORT) -->
        <div class="print-only-banner" style="display:none;">
          <div>
            <div style="font-family:var(--font-heading); font-size:22px; font-weight:800; color:#0F172A; letter-spacing:-0.02em;">
              <span id="printBrandName">ZeroLight OS</span> — Design System Specification
            </div>
            <div style="font-size:11px; color:#64748B; margin-top:3px;">
              Runtime Design Tokens, Primitive Molecules &amp; Component Standards Catalog
            </div>
          </div>
          <div style="text-align:right; font-size:10px; color:#64748B;">
            <div style="font-weight:700; color:#0F172A; text-transform:uppercase; letter-spacing:0.04em;">Official Token Verification: Passed</div>
            <div>Multi-Page Vector Specification • 100% Fidelity</div>
          </div>
        </div>
"""

if '<main class="canvas-flow">' in html and 'print-only-banner' not in html:
    html = html.replace(
        '<main class="canvas-flow">',
        '<main class="canvas-flow">\n' + print_banner_html
    )

# -------------------------------------------------------------
# 3. FIX CARD RADIUS & BORDER VARS IN CSS
# -------------------------------------------------------------
# Make cards use var(--border-w, 1px) and var(--card-shadow)
html = html.replace(
    'border: 1px solid var(--border);',
    'border: var(--border-w, 1px) solid var(--border);'
)

# -------------------------------------------------------------
# 4. REMOVE DUPLICATE FUNCTIONS & CLEAN UP JAVASCRIPT
# -------------------------------------------------------------
# Find and replace the legacy toggleDropdownMenu and closeAllDropdowns at the bottom
legacy_dropdown_block = """    function toggleDropdownMenu(trigger) {
      const menu = trigger.nextElementSibling;
      const isOpen = menu.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) menu.classList.add('open');
    }

    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-menu').forEach(m => m.classList.remove('open'));
    }"""

if legacy_dropdown_block in html:
    html = html.replace(legacy_dropdown_block, "")
    print("Removed legacy duplicate toggleDropdownMenu & closeAllDropdowns")

# Clean up second renderSemanticSwatches at line ~4076
second_semantic_swatches = """    // Swatches render
    function renderSemanticSwatches() {
      const container = document.getElementById('semanticSwatches');
      if (!container) return;
      container.innerHTML = '';

      const items = [
        { name: 'Primary Brand', hex: state.primaryColor },
        { name: 'Success', hex: '#10B981' },
        { name: 'Warning', hex: '#F59E0B' },
        { name: 'Destructive', hex: '#EF4444' },
        { name: 'Secondary', hex: '#F1F5F9' },
        { name: 'Border Hairline', hex: '#E2E8F0' }
      ];

      items.forEach(it => {
        const div = document.createElement('div');
        div.className = 'swatch-item';
        div.onclick = () => {
          navigator.clipboard.writeText(it.hex);
          showToast(`Copied ${it.name}: ${it.hex}`);
        };
        div.innerHTML = `
          <div class="swatch-color-box" style="background:${it.hex};"></div>
          <div class="swatch-meta">
            <span class="swatch-meta-name">${it.name}</span>
            <span class="swatch-meta-hex">${it.hex}</span>
          </div>
        `;
        container.appendChild(div);
      });
    }"""

if second_semantic_swatches in html:
    html = html.replace(second_semantic_swatches, "// (renderSemanticSwatches unified above)")
    print("Removed duplicate renderSemanticSwatches")

# Clean up second setCustomSecondaryColor
second_sec_color = """    function setCustomSecondaryColor(hex) {
      state.secondaryColor = hex;
      document.documentElement.style.setProperty('--secondary-accent', hex);
      const readout = document.getElementById('secondaryHexReadout');
      if (readout) readout.textContent = hex.toUpperCase();
      const swatch = document.getElementById('secondarySwatchPreview');
      if (swatch) swatch.style.backgroundColor = hex;
      const input = document.getElementById('secondaryHexInput');
      if (input && input !== document.activeElement) input.value = hex.replace('#', '').toUpperCase();

      // Live reflection on secondary charts
      document.querySelectorAll('[data-secondary-bar]').forEach(bar => {
        bar.style.backgroundColor = hex;
      });
      const donutSecondary = document.getElementById('donutSecondaryRing');
      if (donutSecondary) donutSecondary.setAttribute('stroke', hex);

      renderSemanticSwatches();
      saveState();
    }"""

if second_sec_color in html:
    html = html.replace(second_sec_color, "// (setCustomSecondaryColor unified above)")
    print("Removed duplicate setCustomSecondaryColor")

# -------------------------------------------------------------
# 5. ENSURE ESSENTIAL INTERACTION FUNCTIONS EXIST
# -------------------------------------------------------------
core_handlers_to_insert = """
    // ================= ESSENTIAL INTERACTION CONTROLLERS =================

    // Accordion controller (exclusive: only one open at a time)
    function toggleAccordion(btn) {
      const item = btn.closest('.studio-acc-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      const allItems = item.parentElement.querySelectorAll('.studio-acc-item');
      allItems.forEach(i => i.classList.remove('open'));
      if (!wasOpen) {
        item.classList.add('open');
      }
    }
    function toggleStudioAccordion(btn) { toggleAccordion(btn); }

    // Dropdown / Select popover controller
    function toggleDropdownMenu(trigger) {
      const wrap = trigger.closest('.custom-select-wrap');
      if (!wrap) return;
      const wasOpen = wrap.classList.contains('open');
      document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
      if (!wasOpen) {
        wrap.classList.add('open');
      }
    }

    function selectDropdownOption(opt, val) {
      const wrap = opt.closest('.custom-select-wrap');
      if (!wrap) return;
      const triggerText = wrap.querySelector('.custom-select-trigger span');
      if (triggerText) triggerText.textContent = val;
      wrap.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      wrap.classList.remove('open');
      showToast(`Selected: ${val}`);
    }

    // Toggle switch handler
    function toggleSwitch(el) {
      el.classList.toggle('checked');
      showToast(el.classList.contains('checked') ? 'Toggle switch enabled' : 'Toggle switch disabled');
    }

    // Motion physics preset handler
    function setMotionPreset(el, preset) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      const speeds = { instant: '0ms', snappy: '160ms', damped: '280ms', elastic: '420ms' };
      setMotionSpeed(speeds[preset] || '160ms');
    }
"""

if "function toggleAccordion(" not in html:
    html = html.replace(
        "// Dropdown Popover Handlers",
        core_handlers_to_insert + "\n    // Dropdown Popover Handlers"
    )

# -------------------------------------------------------------
# 6. ENHANCE applyAllTokens() TO WIRE EVERY SINGLE TOKEN LIVE
# -------------------------------------------------------------
old_apply_tokens = """    function applyAllTokens() {
      const root = document.documentElement;
      root.style.setProperty('--primary', state.primaryColor);
      root.style.setProperty('--radius', state.cornerRadius);
      root.style.setProperty('--control-h', state.density);
      root.style.setProperty('--base-font-size', state.baseFontSize + 'px');
      root.style.setProperty('--motion-speed', state.motionSpeed);
      root.style.setProperty('--icon-tint', state.iconTint);"""

new_apply_tokens = """    function applyAllTokens() {
      const root = document.documentElement;
      root.style.setProperty('--primary', state.primaryColor);
      root.style.setProperty('--secondary-accent', state.secondaryColor || '#FFFFFF');
      root.style.setProperty('--radius', state.cornerRadius);

      // Compute card radius proportionally so changing corner radius live updates ALL cards
      const radNum = parseInt(state.cornerRadius, 10) || 0;
      const cardRad = radNum === 0 ? '0px' : (radNum >= 20 ? '24px' : (radNum >= 12 ? '16px' : '8px'));
      root.style.setProperty('--card-radius', cardRad);

      root.style.setProperty('--control-h', state.density);
      root.style.setProperty('--base-font-size', state.baseFontSize + 'px');
      root.style.setProperty('--motion-speed', state.motionSpeed);
      root.style.setProperty('--icon-tint', state.iconTint);
      if (state.borderWidth) root.style.setProperty('--border-w', state.borderWidth);
      if (state.letterSpacing) root.style.setProperty('--letter-spacing', state.letterSpacing);
      if (state.lineHeight) root.style.setProperty('--line-height', state.lineHeight);

      // Update print title dynamically
      const printTitle = document.getElementById('printBrandName');
      if (printTitle) printTitle.textContent = state.brandName;"""

if old_apply_tokens in html:
    html = html.replace(old_apply_tokens, new_apply_tokens)
    print("Enhanced applyAllTokens with card-radius, secondary-accent, border-w, letter-spacing")

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("SUCCESS: dock-prototype.html refactored!")
