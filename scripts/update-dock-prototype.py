import sys

with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Brand Hero & Print styles to <style>
style_addition = """
    /* Brand Hero Lockup (Relocated above Foundations) */
    .brand-hero-cluster {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 24px;
      background: var(--card);
      border: var(--border-w) solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(var(--backdrop-blur));
      flex-wrap: wrap;
    }
    .brand-hero-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }
    .brand-mark-hero {
      width: 52px;
      height: 52px;
      border-radius: calc(var(--radius) * 0.85);
      background: var(--primary);
      color: var(--primary-foreground);
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: -0.02em;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      transition: background 0.2s ease, border-radius 0.2s ease;
    }
    .brand-mark-hero img { width: 100%; height: 100%; object-fit: cover; }
    .brand-hero-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
    }
    .brand-hero-subtitle {
      font-size: 13.5px;
      color: var(--muted-foreground);
      margin-top: 4px;
    }
    .brand-hero-badges {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    @media print {
      body {
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .app-shell {
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        height: auto !important;
        overflow: visible !important;
      }
      .app-header, .inspector, .overlay, .drawer-panel, .toast-banner, .mobile-studio-btn {
        display: none !important;
      }
      .app-body {
        display: block !important;
        padding: 0 !important;
      }
      .canvas {
        height: auto !important;
        overflow: visible !important;
        border: none !important;
        padding: 20px !important;
        background: #ffffff !important;
      }
      .canvas-inner {
        max-width: 100% !important;
        gap: 32px !important;
      }
      .brand-hero-cluster, .foundation-card, .comp-card {
        box-shadow: none !important;
        border: 1px solid #d4d4d8 !important;
        page-break-inside: avoid;
      }
      .comp-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
"""

content = content.replace('  </style>', style_addition + '\n  </style>')

# 2. Replace Header: remove search & studio, remove ZeroLight OS from header, add download/export buttons
header_start_token = '<header class="app-header">'
header_end_token = '</header>'

idx1 = content.find(header_start_token)
idx2 = content.find(header_end_token, idx1) + len(header_end_token)

new_header = """    <header class="app-header">
      <div class="title-stack">
        <span class="dock-main-title" style="font-size:13.5px;font-weight:700;letter-spacing:-0.01em;color:var(--foreground);">Visual Studio Dock</span>
        <span style="font-size:11.5px;color:var(--muted-foreground);font-weight:500;">Runtime Token &amp; Design System Engine</span>
      </div>
      <div class="toolbar-right">
        <button type="button" class="btn sm" id="headerDownloadPdfBtn" onclick="downloadPdfSpec()" data-tip="Download Clean PDF Spec" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Download PDF</span>
        </button>
        <button type="button" class="btn sm" id="headerDownloadCssBtn" onclick="downloadCssTokens()" data-tip="Download CSS Tokens" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>Download CSS</span>
        </button>
        <button type="button" class="btn sm primary" id="headerExportCodeBtn" onclick="openExportModal()" data-tip="Export Code &amp; Snippets" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>Export Code</span>
        </button>
      </div>
    </header>"""

content = content[:idx1] + new_header + content[idx2:]

# 3. Insert Brand Hero Lockup directly above Foundations section
foundations_token = '<section class="ds-section" id="sec-foundations">'
brand_hero_html = """<!-- BRAND HERO LOCKUP (Relocated above Foundations) -->
          <div class="brand-hero-cluster">
            <div class="brand-hero-left">
              <div class="brand-mark-hero js-brand-mark">Z</div>
              <div>
                <h1 class="brand-hero-title js-brand-name">ZeroLight OS</h1>
                <p class="brand-hero-subtitle js-brand-tagline">Clean, light-mode brand design system • 6-Tier Spatial Architecture</p>
              </div>
            </div>
            <div class="brand-hero-badges">
              <span class="badge accent">Production Ready</span>
              <span class="badge">Deterministic Tokens</span>
              <button class="btn sm" onclick="copyHex('npx zerolight init')" data-tip="Copy CLI Command">
                <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>CLI Snippet</span>
              </button>
            </div>
          </div>

          """

content = content.replace(foundations_token, brand_hero_html + foundations_token)

# 4. Safeguard JS event listeners for filterInput and toggleStudioBtn
old_filter_js = """    // Search Filter
    document.getElementById('filterInput').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.comp-slot').forEach(s => {
        s.hidden = !s.dataset.name.includes(q);
      });
    });"""

new_filter_js = """    // Search Filter (safeguarded)
    const filterInputEl = document.getElementById('filterInput');
    if (filterInputEl) {
      filterInputEl.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.comp-slot').forEach(s => {
          s.hidden = !s.dataset.name.includes(q);
        });
      });
    }"""

content = content.replace(old_filter_js, new_filter_js)

old_studio_toggle_js = "document.getElementById('toggleStudioBtn').addEventListener('click', () => studioAside.classList.add('mobile-open'));"
new_studio_toggle_js = "const toggleBtnEl = document.getElementById('toggleStudioBtn'); if (toggleBtnEl) toggleBtnEl.addEventListener('click', () => studioAside.classList.add('mobile-open'));"
content = content.replace(old_studio_toggle_js, new_studio_toggle_js)

# 5. Add downloadPdfSpec and downloadCssTokens JS helpers
js_helpers = """
    function downloadPdfSpec() {
      showToast('Preparing PDF Spec Print View...');
      setTimeout(() => {
        window.print();
      }, 250);
    }

    function downloadCssTokens() {
      const slug = state.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
      downloadFile(`${slug}-tokens.css`, buildCSS());
    }
"""

content = content.replace('    function openExportModal() {', js_helpers + '\n    function openExportModal() {')

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success! dock-prototype.html has been updated cleanly.')
