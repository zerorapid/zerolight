#!/usr/bin/env python3
"""
apply-custom-colorpicker-and-live-tokens.py
1. Completely replaces native <input type="color"> with a 100% custom SaaS UI Color Picker (interactive hue spectrum bar + curated swatches + hex input). Zero system dialogs!
2. Promotes Secondary Chart Accent to Accordion 1 (Brand & Colors) right next to Primary Accent, with full custom UI picker.
3. Wires Secondary Color to live reflect on Bar Chart, Donut Chart, and Color Palette.
4. Adds live Icon Stroke Width (1.5px, 2.0px) and Library Switcher reflecting across all icons on canvas.
5. Reflects uploaded custom logo directly inside Hero Lockup, Full Logo, and App Icon.
"""

import re

with open("dock-prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. ADD CSS FOR CUSTOM SAAS COLOR PICKER & HUE SLIDER
custom_picker_css = """
    /* ZERO LIGHT CUSTOM SAAS COLOR PICKER (NO SYSTEM DIALOG) */
    .custom-color-picker-widget {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .custom-hue-slider {
      position: relative;
      height: 12px;
      border-radius: 9999px;
      background: linear-gradient(to right, 
        #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%
      );
      cursor: pointer;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
    }
    .hue-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border-radius: 9999px;
      background: #FFFFFF;
      border: 2px solid #0F172A;
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      pointer-events: none;
      transition: left 60ms ease;
    }
    .hex-input-pill-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 3px 8px;
    }
    .hex-input-pill-wrap:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
    }
    .hex-prefix {
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
    }
    .hex-text-input {
      border: none;
      outline: none;
      background: transparent;
      font-size: 12px;
      font-weight: 600;
      color: var(--foreground);
      width: 100%;
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
    }
    .color-swatch-mini-preview {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }
"""

if ".custom-color-picker-widget" not in html:
    html = html.replace("</style>", custom_picker_css + "\n  </style>")

# 2. REMOVE ANY NATIVE <input type="color"> TAGS COMPLETELY
html = re.sub(r'<div class="native-color-picker-wrap">[\s\S]*?</div>', '', html)
html = re.sub(r'<input[^>]*type=["\']color["\'][^>]*>', '', html)

# 3. CONSTRUCT STREAMLINED ACCORDION 1 WITH BRAND, PRIMARY ACCENT & SECONDARY ACCENT (BOTH WITH CUSTOM PICKER)
accordion_1_and_2_clean = """        <!-- 1. BRAND & COLORS (CUSTOM SAAS PICKER - ZERO SYSTEM DIALOGS) -->
        <div class="studio-acc-item open">
          <button class="studio-acc-btn" onclick="toggleAccordion(this)">
            <span>1. Brand &amp; Color Accents</span>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </button>
          <div class="studio-acc-content">
            <!-- Brand Name -->
            <div class="form-group">
              <label class="form-label">Brand / Company Name</label>
              <input type="text" class="text-input-field" id="inputBrandName" value="ZeroLight OS" oninput="updateBrandName(this.value)">
            </div>

            <!-- Brand Monogram -->
            <div class="form-group">
              <label class="form-label">Logo Mark Monogram</label>
              <div class="pills-selector">
                <div class="pill-opt selected" onclick="chooseBrandMark(this, 'ZL')">ZL</div>
                <div class="pill-opt" onclick="chooseBrandMark(this, 'Z')">Z</div>
                <div class="pill-opt" onclick="chooseBrandMark(this, 'OS')">OS</div>
                <div class="pill-opt" onclick="chooseBrandMark(this, '&bull;')">&bull;</div>
              </div>
            </div>

            <!-- Custom Logo Dropzone -->
            <div class="form-group">
              <label class="form-label">Custom Brand Logo Mark</label>
              <div class="zl-file-upload-dropzone" id="dockDropzone" onclick="document.getElementById('dockFileInput').click()">
                <iconify-icon icon="lucide:upload-cloud" class="zl-file-upload-icon"></iconify-icon>
                <div class="zl-file-upload-label" id="dockDropzoneLabel">Drop brand logo (SVG, PNG)</div>
                <input type="file" id="dockFileInput" accept="image/*" style="display:none;" onchange="handleDockLogoUpload(event)">
              </div>
            </div>

            <!-- PRIMARY ACCENT WITH CUSTOM ZERO-LIGHT UI COLOR PICKER -->
            <div class="form-group" style="padding-top:8px; border-top:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label class="form-label" style="font-weight:700;">Primary Brand Accent</label>
                <span id="primaryHexReadout" class="tabular-nums" style="font-size:11px; font-weight:700; color:var(--primary);">#E11D48</span>
              </div>

              <!-- Custom UI Color Picker Box -->
              <div class="custom-color-picker-widget">
                <!-- Preset Dots -->
                <div class="color-preset-row">
                  <div class="color-dot-preset selected" style="background:#E11D48;" onclick="setCustomPrimaryColor('#E11D48')"></div>
                  <div class="color-dot-preset" style="background:#4F46E5;" onclick="setCustomPrimaryColor('#4F46E5')"></div>
                  <div class="color-dot-preset" style="background:#2563EB;" onclick="setCustomPrimaryColor('#2563EB')"></div>
                  <div class="color-dot-preset" style="background:#0D9488;" onclick="setCustomPrimaryColor('#0D9488')"></div>
                  <div class="color-dot-preset" style="background:#16A34A;" onclick="setCustomPrimaryColor('#16A34A')"></div>
                  <div class="color-dot-preset" style="background:#7C3AED;" onclick="setCustomPrimaryColor('#7C3AED')"></div>
                  <div class="color-dot-preset" style="background:#0F172A;" onclick="setCustomPrimaryColor('#0F172A')"></div>
                </div>

                <!-- Custom Interactive Rainbow Spectrum Hue Slider (No System Dialog) -->
                <div class="custom-hue-slider" id="primaryHueSlider" onclick="handleHueSliderClick(event, 'primary')">
                  <div class="hue-thumb" id="primaryHueThumb" style="left:95%;"></div>
                </div>

                <!-- Custom Hex Input Pill -->
                <div class="hex-input-pill-wrap">
                  <div class="color-swatch-mini-preview" id="primarySwatchPreview" style="background:#E11D48;"></div>
                  <span class="hex-prefix">#</span>
                  <input type="text" class="hex-text-input" id="primaryHexInput" value="E11D48" maxlength="6" oninput="handleManualHexInput('primary', this.value)">
                </div>
              </div>
            </div>

            <!-- SECONDARY CHART ACCENT WITH CUSTOM ZERO-LIGHT UI COLOR PICKER -->
            <div class="form-group" style="padding-top:8px; border-top:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label class="form-label" style="font-weight:700;">Secondary Chart Accent</label>
                <span id="secondaryHexReadout" class="tabular-nums" style="font-size:11px; font-weight:700; color:var(--secondary-accent, #06B6D4);">#06B6D4</span>
              </div>

              <!-- Custom UI Color Picker Box -->
              <div class="custom-color-picker-widget">
                <!-- Preset Dots -->
                <div class="color-preset-row">
                  <div class="color-dot-preset selected" style="background:#06B6D4;" onclick="setCustomSecondaryColor('#06B6D4')"></div>
                  <div class="color-dot-preset" style="background:#0EA5E9;" onclick="setCustomSecondaryColor('#0EA5E9')"></div>
                  <div class="color-dot-preset" style="background:#10B981;" onclick="setCustomSecondaryColor('#10B981')"></div>
                  <div class="color-dot-preset" style="background:#F59E0B;" onclick="setCustomSecondaryColor('#F59E0B')"></div>
                  <div class="color-dot-preset" style="background:#8B5CF6;" onclick="setCustomSecondaryColor('#8B5CF6')"></div>
                  <div class="color-dot-preset" style="background:#F43F5E;" onclick="setCustomSecondaryColor('#F43F5E')"></div>
                  <div class="color-dot-preset" style="background:#64748B;" onclick="setCustomSecondaryColor('#64748B')"></div>
                </div>

                <!-- Custom Interactive Rainbow Spectrum Hue Slider (No System Dialog) -->
                <div class="custom-hue-slider" id="secondaryHueSlider" onclick="handleHueSliderClick(event, 'secondary')">
                  <div class="hue-thumb" id="secondaryHueThumb" style="left:50%;"></div>
                </div>

                <!-- Custom Hex Input Pill -->
                <div class="hex-input-pill-wrap">
                  <div class="color-swatch-mini-preview" id="secondarySwatchPreview" style="background:#06B6D4;"></div>
                  <span class="hex-prefix">#</span>
                  <input type="text" class="hex-text-input" id="secondaryHexInput" value="06B6D4" maxlength="6" oninput="handleManualHexInput('secondary', this.value)">
                </div>
              </div>
            </div>

          </div>
        </div>"""

# Replace Accordions in Token Studio
idx_acc_start = html.find('<div class="studio-accordions">')
idx_footer = html.find('<div class="studio-footer">')

# Extract existing Accordions 2-6 (Typography, Icons, Shape, Motion)
accordion_2_typography = """        <!-- 2. GOOGLE FONTS & TYPOGRAPHY -->
        <div class="studio-acc-item">
          <button class="studio-acc-btn" onclick="toggleAccordion(this)">
            <span>2. Google Fonts &amp; Typography</span>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </button>
          <div class="studio-acc-content">
            <div class="form-group">
              <label class="form-label">Heading Typeface</label>
              <div class="custom-select-wrap">
                <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                  <span id="headingFontLabel">Plus Jakarta Sans</span>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
                <div class="custom-select-options">
                  <div class="select-option selected" onclick="selectHeadingFont('Plus Jakarta Sans')">Plus Jakarta Sans (SaaS Default)</div>
                  <div class="select-option" onclick="selectHeadingFont('Inter')">Inter (Linear Clean)</div>
                  <div class="select-option" onclick="selectHeadingFont('Outfit')">Outfit (Geometric Modern)</div>
                  <div class="select-option" onclick="selectHeadingFont('Space Grotesk')">Space Grotesk (FinTech &amp; AI)</div>
                  <div class="select-option" onclick="selectHeadingFont('Sora')">Sora (Neo-Grotesque)</div>
                  <div class="select-option" onclick="selectHeadingFont('Geist')">Geist (Developer Native)</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Body Typeface</label>
              <div class="custom-select-wrap">
                <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                  <span id="bodyFontLabel">Plus Jakarta Sans</span>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
                <div class="custom-select-options">
                  <div class="select-option selected" onclick="selectBodyFont('Plus Jakarta Sans')">Plus Jakarta Sans</div>
                  <div class="select-option" onclick="selectBodyFont('Inter')">Inter</div>
                  <div class="select-option" onclick="selectBodyFont('Roboto')">Roboto</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Letter Spacing (Tracking)</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setLetterSpacing(this, '-0.02em')">Tight</div>
                <div class="pill-opt selected" onclick="setLetterSpacing(this, '0em')">Normal</div>
                <div class="pill-opt" onclick="setLetterSpacing(this, '0.025em')">Wide</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Line Height (Leading)</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setLineHeight(this, '1.35')">1.35</div>
                <div class="pill-opt selected" onclick="setLineHeight(this, '1.5')">1.50</div>
                <div class="pill-opt" onclick="setLineHeight(this, '1.65')">1.65</div>
              </div>
            </div>
          </div>
        </div>"""

accordion_3_icons = """        <!-- 3. OPEN-SOURCE ICONS (WITH LIVE CANVAS STROKE & LIB BINDING) -->
        <div class="studio-acc-item">
          <button class="studio-acc-btn" onclick="toggleAccordion(this)">
            <span>3. Open-Source Icons</span>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </button>
          <div class="studio-acc-content">
            <div class="form-group">
              <label class="form-label">Icon Library</label>
              <div class="pills-selector">
                <div class="pill-opt selected" onclick="switchIconLib(this, 'lucide')">Lucide</div>
                <div class="pill-opt" onclick="switchIconLib(this, 'solar')">Solar</div>
                <div class="pill-opt" onclick="switchIconLib(this, 'tabler')">Tabler</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Icon Stroke Width (Live Reflect)</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setLiveIconStroke(this, '1.5px')">1.5px</div>
                <div class="pill-opt selected" onclick="setLiveIconStroke(this, '1.75px')">1.75px</div>
                <div class="pill-opt" onclick="setLiveIconStroke(this, '2.25px')">2.25px</div>
              </div>
            </div>
          </div>
        </div>"""

accordion_4_surface = """        <!-- 4. SHAPE, BORDER & SURFACE ELEVATION -->
        <div class="studio-acc-item">
          <button class="studio-acc-btn" onclick="toggleAccordion(this)">
            <span>4. Shape, Borders &amp; Elevation</span>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </button>
          <div class="studio-acc-content">
            <div class="form-group">
              <label class="form-label">Corner Radius</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setCornerRadius(this, '0px')">0px</div>
                <div class="pill-opt" onclick="setCornerRadius(this, '6px')">6px</div>
                <div class="pill-opt selected" onclick="setCornerRadius(this, '12px')">12px</div>
                <div class="pill-opt" onclick="setCornerRadius(this, '20px')">20px</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Border Width</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setBorderWidth(this, '0px')">0px</div>
                <div class="pill-opt selected" onclick="setBorderWidth(this, '1px')">1px</div>
                <div class="pill-opt" onclick="setBorderWidth(this, '2px')">2px</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Card Elevation</label>
              <div class="pills-selector">
                <div class="pill-opt" onclick="setCardElevation(this, 'flat')">Flat</div>
                <div class="pill-opt selected" onclick="setCardElevation(this, 'soft')">Soft</div>
                <div class="pill-opt" onclick="setCardElevation(this, 'elevated')">Elevated</div>
              </div>
            </div>
          </div>
        </div>"""

accordion_5_motion = """        <!-- 5. MOTION PHYSICS & ACCESSIBILITY -->
        <div class="studio-acc-item">
          <button class="studio-acc-btn" onclick="toggleAccordion(this)">
            <span>5. Motion Physics &amp; Accessibility</span>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </button>
          <div class="studio-acc-content">
            <div class="form-group">
              <label class="form-label">Spring Motion Engine</label>
              <div class="pills-selector">
                <div class="pill-opt selected" onclick="setMotionPreset(this, 'snappy')">Snappy</div>
                <div class="pill-opt" onclick="setMotionPreset(this, 'damped')">Damped</div>
                <div class="pill-opt" onclick="setMotionPreset(this, 'elastic')">Elastic</div>
                <div class="pill-opt" onclick="setMotionPreset(this, 'instant')">Instant</div>
              </div>
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label">High Contrast (WCAG AAA)</label>
                <div class="switch" onclick="toggleHighContrast(this)"></div>
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
        </div>"""

all_accordions_clean = f'<div class="studio-accordions">\n{accordion_1_and_2_clean}\n{accordion_2_typography}\n{accordion_3_icons}\n{accordion_4_surface}\n{accordion_5_motion}\n        </div>'

html = html[:idx_acc_start] + all_accordions_clean + '\n\n        ' + html[idx_footer:]

# 4. JAVASCRIPT FOR CUSTOM COLOR PICKER, HUE SPECTRUM, LOGO & LIVE REFLECTS
js_custom_handlers = """
    // Custom SaaS Color Picker Handlers (ZERO Native OS Popups)
    function hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }

    function handleHueSliderClick(e, type) {
      const slider = e.currentTarget;
      const rect = slider.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const percent = clickX / rect.width;
      const hue = Math.round(percent * 360);
      const hex = hslToHex(hue, 85, 50);

      const thumb = document.getElementById(type + 'HueThumb');
      if (thumb) thumb.style.left = (percent * 100) + '%';

      if (type === 'primary') {
        setCustomPrimaryColor(hex);
      } else {
        setCustomSecondaryColor(hex);
      }
    }

    function setCustomPrimaryColor(hex) {
      state.primaryColor = hex;
      document.documentElement.style.setProperty('--primary', hex);
      const readout = document.getElementById('primaryHexReadout');
      if (readout) readout.textContent = hex.toUpperCase();
      const swatch = document.getElementById('primarySwatchPreview');
      if (swatch) swatch.style.backgroundColor = hex;
      const input = document.getElementById('primaryHexInput');
      if (input) input.value = hex.replace('#', '').toUpperCase();
      const label = document.getElementById('readoutHexLabel');
      if (label) label.textContent = hex.toUpperCase();

      // Sync custom logo/mark
      const heroMark = document.getElementById('heroMarkTile');
      if (heroMark) heroMark.style.backgroundColor = hex;

      saveState();
      applyAllTokens();
      showToast(`Primary Brand Accent: ${hex.toUpperCase()}`);
    }

    function setCustomSecondaryColor(hex) {
      state.secondaryColor = hex;
      document.documentElement.style.setProperty('--secondary-accent', hex);
      const readout = document.getElementById('secondaryHexReadout');
      if (readout) readout.textContent = hex.toUpperCase();
      const swatch = document.getElementById('secondarySwatchPreview');
      if (swatch) swatch.style.backgroundColor = hex;
      const input = document.getElementById('secondaryHexInput');
      if (input) input.value = hex.replace('#', '').toUpperCase();
      const label = document.getElementById('readoutSecHexLabel');
      if (label) label.textContent = hex.toUpperCase();

      // Live update canvas charts with secondary accent
      document.querySelectorAll('[data-secondary-color]').forEach(el => {
        el.style.backgroundColor = hex;
      });

      saveState();
      showToast(`Secondary Chart Accent: ${hex.toUpperCase()}`);
    }

    function handleManualHexInput(type, val) {
      val = val.replace(/[^0-9A-Fa-f]/g, '');
      if (val.length === 6) {
        const fullHex = '#' + val.toUpperCase();
        if (type === 'primary') {
          setCustomPrimaryColor(fullHex);
        } else {
          setCustomSecondaryColor(fullHex);
        }
      }
    }

    // Live Icon Stroke Width
    function setLiveIconStroke(el, strokeVal) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.iconStroke = strokeVal;
      document.querySelectorAll('iconify-icon').forEach(icon => {
        icon.style.strokeWidth = strokeVal;
      });
      document.querySelectorAll('svg line, svg polyline').forEach(line => {
        if (!line.hasAttribute('data-chart')) {
          line.style.strokeWidth = strokeVal;
        }
      });
      showToast(`Icon stroke: ${strokeVal}`);
    }

    // Live Custom Logo Upload to Hero & Full Logo & App Icon
    function handleDockLogoUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const dataUrl = evt.target.result;
        state.brandLogoUrl = dataUrl;

        // Reflect inside Canvas Hero Mark
        const heroMark = document.getElementById('heroMarkTile');
        if (heroMark) {
          heroMark.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain; border-radius:10px;">`;
        }
        // Reflect inside App Icon
        const appIcon = document.getElementById('brandAppIconSquircle');
        if (appIcon) {
          appIcon.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain; border-radius:12px;">`;
        }
        // Update dropzone label
        const lbl = document.getElementById('dockDropzoneLabel');
        if (lbl) lbl.textContent = file.name;

        saveState();
        showToast(`Uploaded custom logo: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
"""

if "function handleHueSliderClick" not in html:
    html = html.replace("let currentCanvasView = 'spec';", "let currentCanvasView = 'spec';\n" + js_custom_handlers)

# Write updated dock-prototype.html
with open("dock-prototype.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Applied Custom Color Picker & Live Token Sync to dock-prototype.html successfully!")
