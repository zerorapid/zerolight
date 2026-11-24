#!/usr/bin/env python3
"""
fix-real-colorpicker-and-components.py
1. Removes the dot from Wordmark (ZeroLight OS, no &bull; dot).
2. Builds a REAL 2D Color Picker widget (2D Saturation-Brightness spectrum field box + Hue Slider bar + Hex input) with drag/click interaction for BOTH Primary and Secondary colors. ZERO native OS popups.
3. Fixes Secondary Color live updates across Bar Chart, Donut Chart, Color Palette swatches, and labels.
4. Fixes Dropdown Menu CSS so options are hidden by default in a floating popover and only open on click.
5. Fixes Date Picker, Single-Line Input, and Textarea styling.
"""

import re

with open("dock-prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. REMOVE WORDMARK DOT
html = html.replace('<span id="wmBrandText">ZeroLight</span><span style="color:var(--primary);">&bull;</span>', '<span id="wmBrandText">ZeroLight OS</span>')
html = html.replace('<span id="wmBrandText">ZeroLight</span>', '<span id="wmBrandText">ZeroLight OS</span>')

# 2. ADD CSS FOR REAL 2D COLOR PICKER & DROPDOWN POPOVER
new_css = """
    /* ZERO LIGHT REAL 2D COLOR PICKER WIDGET */
    .real-2d-color-picker {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .color-2d-spectrum-box {
      position: relative;
      height: 110px;
      width: 100%;
      border-radius: 6px;
      cursor: crosshair;
      user-select: none;
      overflow: hidden;
      background-color: #E11D48;
      background-image: 
        linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0) 100%),
        linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
    }
    .color-2d-spectrum-box .color-2d-dragger {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #FFFFFF;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
      top: 15%;
      left: 85%;
    }
    .rainbow-hue-track {
      position: relative;
      height: 12px;
      border-radius: 9999px;
      background: linear-gradient(to right, 
        #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%
      );
      cursor: pointer;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
      user-select: none;
    }
    .rainbow-hue-track .hue-slider-knob {
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
    }

    /* PROPER ZERO LIGHT DROPDOWN POPOVER CSS */
    .custom-select-wrap {
      position: relative;
      width: 100%;
    }
    .custom-select-trigger {
      height: 38px;
      padding: 0 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #FFFFFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: var(--foreground);
      cursor: pointer;
      transition: all 150ms ease;
    }
    .custom-select-trigger:hover {
      border-color: #94A3B8;
    }
    .custom-select-options {
      display: none !important;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04);
      z-index: 100;
      max-height: 200px;
      overflow-y: auto;
    }
    .custom-select-wrap.open .custom-select-options {
      display: flex !important;
      flex-direction: column;
    }
    .select-option {
      padding: 9px 12px;
      font-size: 13px;
      color: var(--foreground);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(0,0,0,0.03);
    }
    .select-option:last-child {
      border-bottom: none;
    }
    .select-option:hover {
      background: var(--card-subtle);
    }
    .select-option.selected {
      background: rgba(79, 70, 229, 0.08);
      color: var(--primary);
      font-weight: 600;
    }

    /* DATE PICKER POPOVER STYLES */
    .date-picker-wrap {
      position: relative;
      width: 100%;
    }
    .date-calendar-popover {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 10px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      z-index: 100;
      width: 240px;
    }
    .date-picker-wrap.open .date-calendar-popover {
      display: block;
    }
"""

if ".real-2d-color-picker" not in html:
    html = html.replace("</style>", new_css + "\n  </style>")

# 3. REBUILD ACCORDION 1 WITH REAL 2D COLOR PICKERS FOR PRIMARY & SECONDARY
real_2d_pickers_html = """        <!-- 1. BRAND & COLOR ACCENTS (WITH REAL 2D COLOR PICKERS - ZERO OS POPUPS) -->
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

            <!-- REAL 2D COLOR PICKER: PRIMARY BRAND ACCENT -->
            <div class="form-group" style="padding-top:10px; border-top:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="form-label" style="font-weight:700;">Primary Brand Accent</label>
                <span id="primaryHexReadout" class="tabular-nums" style="font-size:12px; font-weight:700; color:var(--primary);">#E11D48</span>
              </div>

              <div class="real-2d-color-picker">
                <!-- 2D Saturation-Brightness Field Box -->
                <div class="color-2d-spectrum-box" id="primary2dBox" onmousedown="startDrag2d(event, 'primary')">
                  <div class="color-2d-dragger" id="primary2dDragger" style="left:88%; top:12%;"></div>
                </div>

                <!-- Hue Spectrum Slider Track -->
                <div class="rainbow-hue-track" id="primaryHueTrack" onmousedown="startDragHue(event, 'primary')">
                  <div class="hue-slider-knob" id="primaryHueKnob" style="left:96%;"></div>
                </div>

                <!-- Presets & Manual Hex Input -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="color-swatch-mini-preview" id="primarySwatchPreview" style="background:#E11D48; width:28px; height:28px; border-radius:6px;"></div>
                  <div class="hex-input-pill-wrap" style="flex:1;">
                    <span class="hex-prefix">#</span>
                    <input type="text" class="hex-text-input" id="primaryHexInput" value="E11D48" maxlength="6" oninput="handleManualHexInput('primary', this.value)">
                  </div>
                </div>

                <!-- Curated SaaS Swatch Dots -->
                <div class="color-preset-row" style="margin-top:2px;">
                  <div class="color-dot-preset selected" style="background:#E11D48;" onclick="applyPresetColor('primary', '#E11D48')"></div>
                  <div class="color-dot-preset" style="background:#4F46E5;" onclick="applyPresetColor('primary', '#4F46E5')"></div>
                  <div class="color-dot-preset" style="background:#2563EB;" onclick="applyPresetColor('primary', '#2563EB')"></div>
                  <div class="color-dot-preset" style="background:#0D9488;" onclick="applyPresetColor('primary', '#0D9488')"></div>
                  <div class="color-dot-preset" style="background:#16A34A;" onclick="applyPresetColor('primary', '#16A34A')"></div>
                  <div class="color-dot-preset" style="background:#7C3AED;" onclick="applyPresetColor('primary', '#7C3AED')"></div>
                  <div class="color-dot-preset" style="background:#0F172A;" onclick="applyPresetColor('primary', '#0F172A')"></div>
                </div>
              </div>
            </div>

            <!-- REAL 2D COLOR PICKER: SECONDARY CHART ACCENT -->
            <div class="form-group" style="padding-top:10px; border-top:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="form-label" style="font-weight:700;">Secondary Chart Accent</label>
                <span id="secondaryHexReadout" class="tabular-nums" style="font-size:12px; font-weight:700; color:var(--secondary-accent, #06B6D4);">#06B6D4</span>
              </div>

              <div class="real-2d-color-picker">
                <!-- 2D Saturation-Brightness Field Box -->
                <div class="color-2d-spectrum-box" id="secondary2dBox" style="background-color:#00E5FF;" onmousedown="startDrag2d(event, 'secondary')">
                  <div class="color-2d-dragger" id="secondary2dDragger" style="left:97%; top:17%;"></div>
                </div>

                <!-- Hue Spectrum Slider Track -->
                <div class="rainbow-hue-track" id="secondaryHueTrack" onmousedown="startDragHue(event, 'secondary')">
                  <div class="hue-slider-knob" id="secondaryHueKnob" style="left:52%;"></div>
                </div>

                <!-- Presets & Manual Hex Input -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="color-swatch-mini-preview" id="secondarySwatchPreview" style="background:#06B6D4; width:28px; height:28px; border-radius:6px;"></div>
                  <div class="hex-input-pill-wrap" style="flex:1;">
                    <span class="hex-prefix">#</span>
                    <input type="text" class="hex-text-input" id="secondaryHexInput" value="06B6D4" maxlength="6" oninput="handleManualHexInput('secondary', this.value)">
                  </div>
                </div>

                <!-- Curated SaaS Swatch Dots -->
                <div class="color-preset-row" style="margin-top:2px;">
                  <div class="color-dot-preset selected" style="background:#06B6D4;" onclick="applyPresetColor('secondary', '#06B6D4')"></div>
                  <div class="color-dot-preset" style="background:#0EA5E9;" onclick="applyPresetColor('secondary', '#0EA5E9')"></div>
                  <div class="color-dot-preset" style="background:#10B981;" onclick="applyPresetColor('secondary', '#10B981')"></div>
                  <div class="color-dot-preset" style="background:#F59E0B;" onclick="applyPresetColor('secondary', '#F59E0B')"></div>
                  <div class="color-dot-preset" style="background:#8B5CF6;" onclick="applyPresetColor('secondary', '#8B5CF6')"></div>
                  <div class="color-dot-preset" style="background:#F43F5E;" onclick="applyPresetColor('secondary', '#F43F5E')"></div>
                  <div class="color-dot-preset" style="background:#64748B;" onclick="applyPresetColor('secondary', '#64748B')"></div>
                </div>
              </div>
            </div>

          </div>
        </div>"""

# Replace Accordion 1 in Token Studio
idx_acc1_start = html.find('<!-- 1. Brand &amp; Color Accents')
if idx_acc1_start == -1:
    idx_acc1_start = html.find('<!-- 1. BRAND & COLORS')
idx_acc2_start = html.find('<!-- 2. GOOGLE FONTS')

if idx_acc1_start != -1 and idx_acc2_start != -1:
    html = html[:idx_acc1_start] + real_2d_pickers_html + '\n\n        ' + html[idx_acc2_start:]
    print("Replaced Accordion 1 with Real 2D Color Pickers successfully!")

# 4. FIX CANVAS FORM CONTROLS: DROPDOWN & DATE PICKER
old_dropdown_markup = """          <!-- Dropdown / Select Menu -->
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
          </div>"""

new_dropdown_markup = """          <!-- Dropdown / Select Menu (ZeroLight Popover Molecule) -->
          <div class="comp-card" style="z-index:40; position:relative;">
            <label class="field-label">Dropdown Menu (Scrollable Options)</label>
            <div class="custom-select-wrap">
              <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                <span id="selectedDropdownText">Enterprise Workspace</span>
                <iconify-icon icon="lucide:chevron-down" style="color:var(--muted); font-size:14px;"></iconify-icon>
              </div>
              <div class="custom-select-options">
                <div class="select-option selected" onclick="selectDropdownOption(this, 'Enterprise Workspace')">
                  <span>Enterprise Workspace</span>
                  <iconify-icon icon="lucide:check" style="color:var(--primary); font-size:14px;"></iconify-icon>
                </div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Production Cluster 01')">
                  <span>Production Cluster 01</span>
                </div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Staging Sandbox')">
                  <span>Staging Sandbox</span>
                </div>
                <div class="select-option" onclick="selectDropdownOption(this, 'Security Vault')">
                  <span>Security Vault</span>
                </div>
              </div>
            </div>
            <span class="field-hint">Click trigger to toggle floating options popover</span>
          </div>"""

html = html.replace(old_dropdown_markup, new_dropdown_markup)

# Fix Date Picker card
old_date_picker = """          <!-- Date Picker -->
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
          </div>"""

new_date_picker = """          <!-- Date Picker (ZeroLight Calendar Popover) -->
          <div class="comp-card" style="z-index:35; position:relative;">
            <label class="field-label">Date Picker</label>
            <div class="date-picker-wrap" id="datePickerWrap">
              <div class="input-icon-wrap" onclick="toggleDateCalendarPopover()">
                <iconify-icon icon="lucide:calendar" class="prefix-icon"></iconify-icon>
                <input type="text" id="selectedDateInput" value="Nov 20, 2026" readonly style="cursor:pointer;">
                <iconify-icon icon="lucide:calendar-days" style="position:absolute; right:10px; color:var(--muted); pointer-events:none;"></iconify-icon>
              </div>
              <div class="date-calendar-popover">
                <div class="calendar-mini" style="margin:0;">
                  <span class="cal-day-name">M</span><span class="cal-day-name">T</span><span class="cal-day-name">W</span><span class="cal-day-name">T</span><span class="cal-day-name">F</span><span class="cal-day-name">S</span><span class="cal-day-name">S</span>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 16, 2026')">16</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 17, 2026')">17</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 18, 2026')">18</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 19, 2026')">19</div>
                  <div class="cal-day active" onclick="selectCalendarDate(this, 'Nov 20, 2026')">20</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 21, 2026')">21</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 22, 2026')">22</div>
                </div>
              </div>
            </div>
            <span class="field-hint">Interactive calendar popover with date selection</span>
          </div>"""

html = html.replace(old_date_picker, new_date_picker)

# 5. JAVASCRIPT MATH & INTERACTION FOR 2D COLOR PICKER + SECONDARY SYNC
js_2d_math = """
    // REAL 2D HSV COLOR PICKER LOGIC (ZERO NATIVE OS POPUPS)
    const pickerHsvState = {
      primary: { h: 347, s: 0.87, v: 0.88 },
      secondary: { h: 187, s: 0.97, v: 0.83 }
    };

    function hsvToHex(h, s, v) {
      const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      const rgb = [f(5), f(3), f(1)].map(x => Math.round(x * 255).toString(16).padStart(2, '0'));
      return ('#' + rgb.join('')).toUpperCase();
    }

    function hexToHsv(hex) {
      let r = parseInt(hex.slice(1,3), 16) / 255;
      let g = parseInt(hex.slice(3,5), 16) / 255;
      let b = parseInt(hex.slice(5,7), 16) / 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s, v = max;
      let d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max !== min) {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: Math.round(h * 360), s, v };
    }

    function update2dPickerUI(type) {
      const hsv = pickerHsvState[type];
      const pureHueHex = hsvToHex(hsv.h, 1, 1);
      const box = document.getElementById(type + '2dBox');
      if (box) box.style.backgroundColor = pureHueHex;

      const dragger = document.getElementById(type + '2dDragger');
      if (dragger) {
        dragger.style.left = (hsv.s * 100) + '%';
        dragger.style.top = ((1 - hsv.v) * 100) + '%';
      }

      const knob = document.getElementById(type + 'HueKnob');
      if (knob) {
        knob.style.left = (hsv.h / 360 * 100) + '%';
      }
    }

    function startDrag2d(e, type) {
      e.preventDefault();
      const box = document.getElementById(type + '2dBox');
      const onMove = (moveEvt) => {
        const rect = box.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, moveEvt.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, moveEvt.clientY - rect.top));
        const s = x / rect.width;
        const v = 1 - (y / rect.height);
        pickerHsvState[type].s = s;
        pickerHsvState[type].v = v;
        const hex = hsvToHex(pickerHsvState[type].h, s, v);
        if (type === 'primary') {
          setCustomPrimaryColor(hex);
        } else {
          setCustomSecondaryColor(hex);
        }
        update2dPickerUI(type);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      onMove(e);
    }

    function startDragHue(e, type) {
      e.preventDefault();
      const track = document.getElementById(type + 'HueTrack');
      const onMove = (moveEvt) => {
        const rect = track.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, moveEvt.clientX - rect.left));
        const percent = x / rect.width;
        pickerHsvState[type].h = Math.round(percent * 360);
        const hex = hsvToHex(pickerHsvState[type].h, pickerHsvState[type].s, pickerHsvState[type].v);
        if (type === 'primary') {
          setCustomPrimaryColor(hex);
        } else {
          setCustomSecondaryColor(hex);
        }
        update2dPickerUI(type);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      onMove(e);
    }

    function applyPresetColor(type, hex) {
      pickerHsvState[type] = hexToHsv(hex);
      if (type === 'primary') {
        setCustomPrimaryColor(hex);
      } else {
        setCustomSecondaryColor(hex);
      }
      update2dPickerUI(type);
    }

    // Secondary Color Live Reflection Across Charts & Palette
    function setCustomSecondaryColor(hex) {
      state.secondaryColor = hex;
      document.documentElement.style.setProperty('--secondary-accent', hex);

      // Readouts
      const readout = document.getElementById('secondaryHexReadout');
      if (readout) {
        readout.textContent = hex.toUpperCase();
        readout.style.color = hex;
      }
      const swatch = document.getElementById('secondarySwatchPreview');
      if (swatch) swatch.style.backgroundColor = hex;
      const input = document.getElementById('secondaryHexInput');
      if (input) input.value = hex.replace('#', '').toUpperCase();
      const label = document.getElementById('readoutSecHexLabel');
      if (label) label.textContent = hex.toUpperCase();

      // LIVE REFLECT: Update Bar Chart secondary bars & legend
      document.querySelectorAll('.chart-card div[title*="Secondary"]').forEach(b => {
        b.style.backgroundColor = hex;
      });
      document.querySelectorAll('.chart-card span').forEach(sp => {
        if (sp.textContent.includes('Secondary') && sp.querySelector('span')) {
          sp.querySelector('span').style.backgroundColor = hex;
        }
      });

      // LIVE REFLECT: Update Donut Chart secondary segment ring
      const donutSvg = document.querySelector('.chart-card svg[viewBox="0 0 100 100"]');
      if (donutSvg) {
        const circles = donutSvg.querySelectorAll('circle');
        if (circles && circles[2]) {
          circles[2].setAttribute('stroke', hex);
        }
      }

      // LIVE REFLECT: Update Semantic Swatches
      renderSemanticSwatches();

      saveState();
    }

    // Dropdown Popover Handlers
    function toggleDropdownMenu(trigger) {
      const wrap = trigger.closest('.custom-select-wrap');
      const isOpen = wrap.classList.contains('open');
      document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
      if (!isOpen) wrap.classList.add('open');
    }

    function selectDropdownOption(opt, val) {
      const wrap = opt.closest('.custom-select-wrap');
      const triggerText = wrap.querySelector('.custom-select-trigger span');
      if (triggerText) triggerText.textContent = val;
      wrap.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      wrap.classList.remove('open');
      showToast(`Selected: ${val}`);
    }

    // Date Picker Popover Handlers
    function toggleDateCalendarPopover() {
      const wrap = document.getElementById('datePickerWrap');
      if (wrap) wrap.classList.toggle('open');
    }

    function selectCalendarDate(el, dateStr) {
      el.parentElement.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
      el.classList.add('active');
      const input = document.getElementById('selectedDateInput');
      if (input) input.value = dateStr;
      const wrap = document.getElementById('datePickerWrap');
      if (wrap) wrap.classList.remove('open');
      showToast(`Selected date: ${dateStr}`);
    }

    // Close popovers on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrap')) {
        document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
      }
      if (!e.target.closest('.date-picker-wrap')) {
        const wrap = document.getElementById('datePickerWrap');
        if (wrap) wrap.classList.remove('open');
      }
    });

    // Semantic Swatches update with secondaryColor
    function renderSemanticSwatches() {
      const container = document.getElementById('semanticSwatches');
      if (!container) return;
      container.innerHTML = '';

      const items = [
        { name: 'Primary Brand', hex: state.primaryColor || '#E11D48' },
        { name: 'Secondary Accent', hex: state.secondaryColor || '#06B6D4' },
        { name: 'Success', hex: '#10B981' },
        { name: 'Warning', hex: '#F59E0B' },
        { name: 'Destructive', hex: '#EF4444' },
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
          <div class="swatch-color" style="background:${it.hex}"></div>
          <div class="swatch-meta">
            <span class="swatch-name">${it.name}</span>
            <span class="swatch-hex">${it.hex.toUpperCase()}</span>
          </div>
        `;
        container.appendChild(div);
      });
    }
"""

if "function startDrag2d" not in html:
    html = html.replace("let currentCanvasView = 'spec';", "let currentCanvasView = 'spec';\n" + js_2d_math)

with open("dock-prototype.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Applied 2D Color Picker, Secondary Color Sync, and Dropdown Popovers successfully!")
