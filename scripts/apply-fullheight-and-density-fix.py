#!/usr/bin/env python3
"""
apply-fullheight-and-density-fix.py
Applies:
1. Full-Height Docked Token Studio architecture (no floating stub, zero dead space, pinned footer).
2. Tight content-fitted canvas card density (removed bloated min-height: 120px).
3. 6 Comprehensive Token Studio Accordions (adding Border Width, Elevation, Secondary Accent, Typography Tracking & Leading, RTL, and High Contrast).
"""

import re

with open("dock-prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. UPDATE CSS FOR FULL-HEIGHT DOCKED LAYOUT & TIGHT CARD DENSITY
old_css_workspace = """    /* ================= FLOATING OUTER SHELL ================= */
    .app-shell {
      width: 100%;
      max-width: 1600px;
      background: var(--canvas-bg);
      border-radius: 20px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: calc(100vh - 48px);
    }"""

new_css_workspace = """    /* ================= FULL-HEIGHT DOCKED SHELL ARCHITECTURE ================= */
    .app-shell {
      width: 100%;
      max-width: 1680px;
      background: var(--canvas-bg);
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: calc(100vh - 40px);
    }"""

html = html.replace(old_css_workspace, new_css_workspace)

# Update .app-workspace CSS
old_app_workspace = """    /* ================= MAIN TWO-COLUMN WORKSPACE ================= */
    .app-workspace {
      display: grid;
      grid-template-columns: 1fr 364px;
      gap: 24px;
      padding: 24px 28px;
      align-items: start;
    }"""

new_app_workspace = """    /* ================= MAIN TWO-COLUMN WORKSPACE ================= */
    .app-workspace {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 364px;
      gap: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
    }"""

html = html.replace(old_app_workspace, new_app_workspace)

# Update .canvas-flow CSS
old_canvas_flow = """    /* ================= LEFT CANVAS ================= */
    .canvas-flow {
      display: flex;
      flex-direction: column;
      gap: 40px;
      min-width: 0;
    }"""

new_canvas_flow = """    /* ================= LEFT CANVAS ================= */
    .canvas-flow {
      display: flex;
      flex-direction: column;
      gap: 32px;
      min-width: 0;
      height: 100%;
      overflow-y: auto;
      padding: 24px 28px;
    }"""

html = html.replace(old_canvas_flow, new_canvas_flow)

# Update .comp-card to remove bloated min-height: 120px
old_comp_card = """    .comp-card {
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      background: var(--card);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 120px;
      justify-content: center;
    }"""

new_comp_card = """    .comp-card {
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      background: var(--card);
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all var(--motion-speed) var(--motion-ease);
    }"""

html = html.replace(old_comp_card, new_comp_card)

# Update .token-studio to be pinned full height
old_token_studio = """    /* ================= RIGHT SIDEBAR: TOKEN STUDIO ================= */
    .token-studio {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 80px;
      overflow: hidden;
    }

    .studio-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      background: #FFFFFF;
    }

    .studio-title-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .studio-title {
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 700;
      color: var(--foreground);
    }

    .studio-sub {
      font-size: 11px;
      color: var(--muted);
    }

    .studio-accordions {
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 230px);
      overflow-y: auto;
    }"""

new_token_studio = """    /* ================= RIGHT SIDEBAR: FULL-HEIGHT DOCKED TOKEN STUDIO ================= */
    .token-studio {
      width: 364px;
      height: 100%;
      background: var(--card);
      border-left: 1px solid var(--border);
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-radius: 0;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex-shrink: 0;
    }

    .studio-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      background: #FFFFFF;
      flex-shrink: 0;
    }

    .studio-title-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .studio-title {
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 700;
      color: var(--foreground);
    }

    .studio-sub {
      font-size: 11px;
      color: var(--muted);
    }

    .studio-accordions {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-y: auto;
    }"""

html = html.replace(old_token_studio, new_token_studio)

# 2. UPDATE TOKEN STUDIO ACCORDIONS (EXPANDING TO 6 ACCORDIONS WITH ALL REQUESTED SETTINGS)
accordions_start_marker = '<div class="studio-accordions">'
accordions_end_marker = '</div>\n\n        <div class="studio-footer">'

pattern = re.compile(r'<div class="studio-accordions">.*?</div>\s*<div class="studio-footer">', re.DOTALL)

six_accordions_html = """<div class="studio-accordions">

          <!-- ACCORDION 1: BRAND IDENTITY -->
          <div class="studio-acc-item open">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>1. Brand &amp; Identity</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Brand Name</label>
                <input type="text" class="text-input-field" id="inputBrandName" value="ZeroLight OS" oninput="updateBrandName(this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Brand Tagline</label>
                <input type="text" class="text-input-field" id="inputBrandTagline" value="Enterprise Brand Design System" oninput="updateBrandTagline(this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Logo Mark Selector</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="chooseBrandMark(this, 'Z')">Z</div>
                  <div class="pill-opt" onclick="chooseBrandMark(this, 'ZL')">ZL</div>
                  <div class="pill-opt" onclick="chooseBrandMark(this, 'Zap')">Zap</div>
                  <div class="pill-opt" onclick="chooseBrandMark(this, 'Cmd')">Cmd</div>
                </div>
              </div>
              <!-- Real ZeroLight FileUpload Dropzone -->
              <div class="form-group">
                <label class="form-label">Custom Brand Logo</label>
                <input type="file" id="customLogoUpload" accept="image/*" style="display:none;" onchange="handleLogoUpload(this)">
                <div class="zl-file-upload-dropzone" onclick="document.getElementById('customLogoUpload').click()" id="logoDropZone">
                  <div class="zl-upload-icon-circle">
                    <iconify-icon icon="lucide:cloud-upload" style="font-size:18px;"></iconify-icon>
                  </div>
                  <div>
                    <span class="zl-upload-primary">Click to upload or drag &amp; drop</span>
                    <span class="zl-upload-sub">SVG, PNG, or JPG (Max 5MB)</span>
                  </div>
                </div>
                <div id="logoUploadedCard" style="display:none; align-items:center; justify-content:space-between; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius); background:var(--card-subtle);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img id="logoCardThumb" src="" style="width:24px; height:24px; object-fit:cover; border-radius:4px; border:1px solid var(--border);">
                    <div style="display:flex; flex-direction:column;">
                      <span style="font-size:11px; font-weight:600;" id="logoCardName">brand-logo.png</span>
                      <span style="font-size:10px; color:var(--success); font-weight:500;">&bull; Ready</span>
                    </div>
                  </div>
                  <button type="button" class="btn sm ghost" style="padding:2px 6px; height:22px;" onclick="removeUploadedLogo(event)">
                    <iconify-icon icon="lucide:x" style="font-size:12px;"></iconify-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 2: COLORS, CONTRAST & DUAL-ACCENT -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>2. Colors &amp; Contrast</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <label class="form-label">Primary Brand Accent</label>
                  <span id="primaryHexReadout" class="tabular-nums" style="font-size:11px; font-weight:600; color:var(--foreground);">#4F46E5</span>
                </div>
                <div class="color-preset-row">
                  <div class="color-dot-preset selected" style="background:#4F46E5;" onclick="setPrimaryColor('#4F46E5')"></div>
                  <div class="color-dot-preset" style="background:#2563EB;" onclick="setPrimaryColor('#2563EB')"></div>
                  <div class="color-dot-preset" style="background:#0D9488;" onclick="setPrimaryColor('#0D9488')"></div>
                  <div class="color-dot-preset" style="background:#16A34A;" onclick="setPrimaryColor('#16A34A')"></div>
                  <div class="color-dot-preset" style="background:#E11D48;" onclick="setPrimaryColor('#E11D48')"></div>
                  <div class="native-color-picker-wrap">
                    <input type="color" class="color-input-native" id="nativeColorPicker" value="#4F46E5" oninput="setPrimaryColor(this.value)">
                  </div>
                </div>
              </div>

              <!-- Secondary Accent Color for Dual-Accent Charts -->
              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <label class="form-label">Secondary Chart Accent</label>
                  <span id="secondaryHexReadout" class="tabular-nums" style="font-size:11px; font-weight:600; color:var(--foreground);">#06B6D4</span>
                </div>
                <div class="color-preset-row">
                  <div class="color-dot-preset selected" style="background:#06B6D4;" onclick="setSecondaryColor('#06B6D4')"></div>
                  <div class="color-dot-preset" style="background:#10B981;" onclick="setSecondaryColor('#10B981')"></div>
                  <div class="color-dot-preset" style="background:#F59E0B;" onclick="setSecondaryColor('#F59E0B')"></div>
                  <div class="color-dot-preset" style="background:#8B5CF6;" onclick="setSecondaryColor('#8B5CF6')"></div>
                  <div class="native-color-picker-wrap">
                    <input type="color" class="color-input-native" id="nativeSecondaryColorPicker" value="#06B6D4" oninput="setSecondaryColor(this.value)">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Semantic Status Palette</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="setSemanticPalette(this, 'standard')">Standard</div>
                  <div class="pill-opt" onclick="setSemanticPalette(this, 'pastel')">Pastel</div>
                  <div class="pill-opt" onclick="setSemanticPalette(this, 'vivid')">Vivid</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 3: TYPOGRAPHY, TRACKING & LEADING -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>3. Typography &amp; Rhythm</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Heading Font</label>
                <div class="custom-select-wrap">
                  <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                    <span id="headingFontLabel">Plus Jakarta Sans</span>
                    <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                  </div>
                  <div class="custom-select-menu">
                    <div class="select-item selected" onclick="selectHeadingFont('Plus Jakarta Sans')">Plus Jakarta Sans</div>
                    <div class="select-item" onclick="selectHeadingFont('Inter')">Inter</div>
                    <div class="select-item" onclick="selectHeadingFont('DM Sans')">DM Sans</div>
                    <div class="select-item" onclick="selectHeadingFont('Space Grotesk')">Space Grotesk</div>
                    <div class="select-item" onclick="selectHeadingFont('Outfit')">Outfit</div>
                    <div class="select-item" onclick="selectHeadingFont('Manrope')">Manrope</div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Body Font</label>
                <div class="custom-select-wrap">
                  <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                    <span id="bodyFontLabel">Inter</span>
                    <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                  </div>
                  <div class="custom-select-menu">
                    <div class="select-item selected" onclick="selectBodyFont('Inter')">Inter</div>
                    <div class="select-item" onclick="selectBodyFont('Plus Jakarta Sans')">Plus Jakarta Sans</div>
                    <div class="select-item" onclick="selectBodyFont('DM Sans')">DM Sans</div>
                    <div class="select-item" onclick="selectBodyFont('Space Grotesk')">Space Grotesk</div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div style="display:flex; justify-content:space-between;">
                  <label class="form-label">Base Font Size</label>
                  <span class="tabular-nums" style="font-size:11px;" id="fontSizeReadout">14px</span>
                </div>
                <input type="range" class="custom-range" min="12" max="18" value="14" oninput="setFontSize(this.value)">
              </div>

              <div class="form-group">
                <label class="form-label">Tracking / Letter Spacing</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setLetterSpacing(this, '-0.02em')">Tight</div>
                  <div class="pill-opt selected" onclick="setLetterSpacing(this, '0em')">Normal</div>
                  <div class="pill-opt" onclick="setLetterSpacing(this, '0.02em')">Wide</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Leading / Line Height</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setLineHeight(this, '1.35')">Compact</div>
                  <div class="pill-opt selected" onclick="setLineHeight(this, '1.5')">Normal</div>
                  <div class="pill-opt" onclick="setLineHeight(this, '1.7')">Relaxed</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 4: GEOMETRY, BORDER WIDTH & ELEVATION -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>4. Geometry, Borders &amp; Shadows</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Corner Radius</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setCornerRadius(this, '0rem')">0</div>
                  <div class="pill-opt" onclick="setCornerRadius(this, '0.3rem')">0.3</div>
                  <div class="pill-opt selected" onclick="setCornerRadius(this, '0.5rem')">0.5</div>
                  <div class="pill-opt" onclick="setCornerRadius(this, '0.75rem')">0.75</div>
                  <div class="pill-opt" onclick="setCornerRadius(this, '1.0rem')">1.0</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Border Width</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setBorderWidth(this, '0px')">0px (Flat)</div>
                  <div class="pill-opt selected" onclick="setBorderWidth(this, '1px')">1px (Hairline)</div>
                  <div class="pill-opt" onclick="setBorderWidth(this, '2px')">2px (Bold)</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Control Density</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setDensity(this, '32px')">Compact</div>
                  <div class="pill-opt selected" onclick="setDensity(this, '36px')">Default</div>
                  <div class="pill-opt" onclick="setDensity(this, '42px')">Spacious</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Card Elevation &amp; Shadow</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setCardElevation(this, 'flat')">Flat</div>
                  <div class="pill-opt selected" onclick="setCardElevation(this, 'soft')">Soft</div>
                  <div class="pill-opt" onclick="setCardElevation(this, 'elevated')">Elevated</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 5: DATA VISUALIZATION & ICONS -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>5. Data Visualization &amp; Icons</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Icon Library Switcher</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="switchIconLib(this, 'lucide')">Lucide</div>
                  <div class="pill-opt" onclick="switchIconLib(this, 'ph')">Phosphor</div>
                  <div class="pill-opt" onclick="switchIconLib(this, 'tabler')">Tabler</div>
                  <div class="pill-opt" onclick="switchIconLib(this, 'heroicons')">Hero</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Icon Tint Color</label>
                <div class="color-preset-row">
                  <div class="color-dot-preset selected" style="background:#09090B;" onclick="setIconTint('currentColor')"></div>
                  <div class="color-dot-preset" style="background:#4F46E5;" onclick="setIconTint('#4F46E5')"></div>
                  <div class="color-dot-preset" style="background:#0D9488;" onclick="setIconTint('#0D9488')"></div>
                  <div class="color-dot-preset" style="background:#E11D48;" onclick="setIconTint('#E11D48')"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Curated Imagery Theme</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="setImageryTheme(this, 'minimal')">Minimal</div>
                  <div class="pill-opt" onclick="setImageryTheme(this, 'workspace')">Workspace</div>
                  <div class="pill-opt" onclick="setImageryTheme(this, 'abstract')">Abstract</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 6: SURFACE, MOTION & ACCESSIBILITY -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>6. Surface, Motion &amp; A11y</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Light Neutral Surface</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="setNeutralSurface(this, 'zinc')">Zinc</div>
                  <div class="pill-opt" onclick="setNeutralSurface(this, 'slate')">Slate</div>
                  <div class="pill-opt" onclick="setNeutralSurface(this, 'pure')">Pure</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Motion Physics Speed</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setMotionSpeed(this, '0ms')">Instant</div>
                  <div class="pill-opt selected" onclick="setMotionSpeed(this, '160ms')">Snappy</div>
                  <div class="pill-opt" onclick="setMotionSpeed(this, '300ms')">Smooth</div>
                </div>
              </div>

              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <label class="form-label">High Contrast (WCAG AAA)</label>
                  <div class="switch-ui" id="switchHighContrast" onclick="toggleHighContrast(this)"></div>
                </div>
              </div>

              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <label class="form-label">Layout Direction (RTL / LTR)</label>
                  <div class="pills-selector" style="width:140px;">
                    <div class="pill-opt selected" onclick="setLayoutDirection(this, 'ltr')">LTR</div>
                    <div class="pill-opt" onclick="setLayoutDirection(this, 'rtl')">RTL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>\n\n        <div class="studio-footer">"""

html = pattern.sub(six_accordions_html, html)

# 3. ADD JS HANDLERS FOR NEW SETTINGS IN STATE
js_new_settings = """
    // Extended State for Added Token Settings
    Object.assign(DEFAULTS, {
      secondaryColor: '#06B6D4',
      borderWidth: '1px',
      cardElevation: 'soft',
      letterSpacing: '0em',
      lineHeight: '1.5',
      highContrast: false,
      direction: 'ltr'
    });

    function setSecondaryColor(hex) {
      state.secondaryColor = hex;
      document.documentElement.style.setProperty('--secondary-accent', hex);
      const readout = document.getElementById('secondaryHexReadout');
      if (readout) readout.textContent = hex.toUpperCase();
      const picker = document.getElementById('nativeSecondaryColorPicker');
      if (picker) picker.value = hex;
      saveState();
      showToast(`Secondary chart accent set to ${hex}`);
    }

    function setBorderWidth(el, w) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.borderWidth = w;
      document.documentElement.style.setProperty('--border-w', w);
      document.querySelectorAll('.comp-card, .foundation-card').forEach(c => {
        c.style.borderWidth = w;
      });
      saveState();
      showToast(`Border width set to ${w}`);
    }

    function setCardElevation(el, elev) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.cardElevation = elev;
      const root = document.documentElement;
      if (elev === 'flat') {
        root.style.setProperty('--card-shadow', 'none');
      } else if (elev === 'elevated') {
        root.style.setProperty('--card-shadow', '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)');
      } else {
        root.style.setProperty('--card-shadow', '0 1px 3px rgba(0,0,0,0.05)');
      }
      document.querySelectorAll('.comp-card, .foundation-card').forEach(c => {
        c.style.boxShadow = getComputedStyle(root).getPropertyValue('--card-shadow');
      });
      saveState();
      showToast(`Card elevation: ${elev}`);
    }

    function setLetterSpacing(el, spacing) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.letterSpacing = spacing;
      document.body.style.letterSpacing = spacing;
      saveState();
      showToast(`Letter spacing: ${spacing}`);
    }

    function setLineHeight(el, lh) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.lineHeight = lh;
      document.body.style.lineHeight = lh;
      saveState();
      showToast(`Line height: ${lh}`);
    }

    function toggleHighContrast(switchEl) {
      switchEl.classList.toggle('checked');
      const isHigh = switchEl.classList.contains('checked');
      state.highContrast = isHigh;
      if (isHigh) {
        document.documentElement.style.setProperty('--border', '#09090B');
        document.documentElement.style.setProperty('--muted', '#1E293B');
      } else {
        document.documentElement.style.setProperty('--border', '#E2E8F0');
        document.documentElement.style.setProperty('--muted', '#64748B');
      }
      saveState();
      showToast(isHigh ? 'High Contrast Mode Enabled' : 'Standard Contrast Restored');
    }

    function setLayoutDirection(el, dir) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.direction = dir;
      document.querySelector('.canvas-flow').dir = dir;
      saveState();
      showToast(`Layout direction: ${dir.toUpperCase()}`);
    }
"""

if "function setSecondaryColor" not in html:
    html = html.replace("let currentCanvasView = 'spec';", "let currentCanvasView = 'spec';\n" + js_new_settings)

# Write back updated dock-prototype.html
with open("dock-prototype.html", "w", encoding="utf-8") as f:
    f.write(html)

print("dock-prototype.html successfully upgraded with Full-Height Dock & Card Density!")
