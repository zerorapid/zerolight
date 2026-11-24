import re

with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS root variables
html = re.sub(
    r'--primary:\s*#[0-9a-fA-F]+;',
    '--primary: #0F172A;',
    html
)
html = re.sub(
    r'--ring:\s*#[0-9a-fA-F]+;',
    '--ring: #0F172A;',
    html
)
if '--secondary-accent:' in html:
    html = re.sub(
        r'--secondary-accent:\s*#[0-9a-fA-F]+;',
        '--secondary-accent: #FFFFFF;',
        html
    )
else:
    html = html.replace(
        '--primary-foreground: #FFFFFF;',
        '--primary-foreground: #FFFFFF;\n      --secondary-accent: #FFFFFF;'
    )

# 2. Update DEFAULTS in JS
html = re.sub(
    r'primaryColor:\s*["\']#[0-9a-fA-F]+["\']',
    'primaryColor: "#0F172A"',
    html
)
html = re.sub(
    r'secondaryColor:\s*["\']#[0-9a-fA-F]+["\']',
    'secondaryColor: "#FFFFFF"',
    html
)

# 3. Update Token Studio Sidebar Pickers & Presets for Primary & Secondary
old_primary_picker_block = '''              <div class="real-2d-color-picker">
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
              </div>'''

new_primary_picker_block = '''              <div class="real-2d-color-picker">
                <!-- 2D Saturation-Brightness Field Box -->
                <div class="color-2d-spectrum-box" id="primary2dBox" onmousedown="startDrag2d(event, 'primary')">
                  <div class="color-2d-dragger" id="primary2dDragger" style="left:64%; top:84%;"></div>
                </div>

                <!-- Hue Spectrum Slider Track -->
                <div class="rainbow-hue-track" id="primaryHueTrack" onmousedown="startDragHue(event, 'primary')">
                  <div class="hue-slider-knob" id="primaryHueKnob" style="left:62%;"></div>
                </div>

                <!-- Presets & Manual Hex Input -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="color-swatch-mini-preview" id="primarySwatchPreview" style="background:#0F172A; width:28px; height:28px; border-radius:6px; border:1px solid #CBD5E1;"></div>
                  <div class="hex-input-pill-wrap" style="flex:1;">
                    <span class="hex-prefix">#</span>
                    <input type="text" class="hex-text-input" id="primaryHexInput" value="0F172A" maxlength="6" oninput="handleManualHexInput('primary', this.value)">
                  </div>
                </div>

                <!-- Curated SaaS Swatch Dots (Black Selected by Default) -->
                <div class="color-preset-row" style="margin-top:2px;">
                  <div class="color-dot-preset selected" style="background:#0F172A;" onclick="applyPresetColor('primary', '#0F172A')" title="Obsidian Black (Default)"></div>
                  <div class="color-dot-preset" style="background:#000000;" onclick="applyPresetColor('primary', '#000000')" title="Pure Ink Black"></div>
                  <div class="color-dot-preset" style="background:#4F46E5;" onclick="applyPresetColor('primary', '#4F46E5')" title="Indigo"></div>
                  <div class="color-dot-preset" style="background:#2563EB;" onclick="applyPresetColor('primary', '#2563EB')" title="Royal Blue"></div>
                  <div class="color-dot-preset" style="background:#0D9488;" onclick="applyPresetColor('primary', '#0D9488')" title="Teal"></div>
                  <div class="color-dot-preset" style="background:#16A34A;" onclick="applyPresetColor('primary', '#16A34A')" title="Emerald"></div>
                  <div class="color-dot-preset" style="background:#E11D48;" onclick="applyPresetColor('primary', '#E11D48')" title="Rose"></div>
                </div>
              </div>'''

if old_primary_picker_block in html:
    html = html.replace(old_primary_picker_block, new_primary_picker_block)
else:
    print("WARNING: old_primary_picker_block not found exactly, will use regex")

html = re.sub(
    r'<span id="primaryHexReadout"[^>]*>#[0-9a-fA-F]+</span>',
    '<span id="primaryHexReadout" class="tabular-nums" style="font-size:12px; font-weight:700; color:var(--primary);">#0F172A</span>',
    html
)

old_secondary_picker_block = '''              <div class="real-2d-color-picker">
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
              </div>'''

new_secondary_picker_block = '''              <div class="real-2d-color-picker">
                <!-- 2D Saturation-Brightness Field Box -->
                <div class="color-2d-spectrum-box" id="secondary2dBox" style="background-color:#FFFFFF;" onmousedown="startDrag2d(event, 'secondary')">
                  <div class="color-2d-dragger" id="secondary2dDragger" style="left:0%; top:0%;"></div>
                </div>

                <!-- Hue Spectrum Slider Track -->
                <div class="rainbow-hue-track" id="secondaryHueTrack" onmousedown="startDragHue(event, 'secondary')">
                  <div class="hue-slider-knob" id="secondaryHueKnob" style="left:0%;"></div>
                </div>

                <!-- Presets & Manual Hex Input -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="color-swatch-mini-preview" id="secondarySwatchPreview" style="background:#FFFFFF; width:28px; height:28px; border-radius:6px; border:1px solid #CBD5E1;"></div>
                  <div class="hex-input-pill-wrap" style="flex:1;">
                    <span class="hex-prefix">#</span>
                    <input type="text" class="hex-text-input" id="secondaryHexInput" value="FFFFFF" maxlength="6" oninput="handleManualHexInput('secondary', this.value)">
                  </div>
                </div>

                <!-- Curated SaaS Swatch Dots (White Selected by Default) -->
                <div class="color-preset-row" style="margin-top:2px;">
                  <div class="color-dot-preset selected" style="background:#FFFFFF; border:1px solid #CBD5E1;" onclick="applyPresetColor('secondary', '#FFFFFF')" title="Pure White (Default)"></div>
                  <div class="color-dot-preset" style="background:#F1F5F9; border:1px solid #CBD5E1;" onclick="applyPresetColor('secondary', '#F1F5F9')" title="Cool Slate"></div>
                  <div class="color-dot-preset" style="background:#64748B;" onclick="applyPresetColor('secondary', '#64748B')" title="Muted Slate"></div>
                  <div class="color-dot-preset" style="background:#06B6D4;" onclick="applyPresetColor('secondary', '#06B6D4')" title="Cyan"></div>
                  <div class="color-dot-preset" style="background:#0EA5E9;" onclick="applyPresetColor('secondary', '#0EA5E9')" title="Sky"></div>
                  <div class="color-dot-preset" style="background:#10B981;" onclick="applyPresetColor('secondary', '#10B981')" title="Emerald"></div>
                  <div class="color-dot-preset" style="background:#F59E0B;" onclick="applyPresetColor('secondary', '#F59E0B')" title="Amber"></div>
                </div>
              </div>'''

if old_secondary_picker_block in html:
    html = html.replace(old_secondary_picker_block, new_secondary_picker_block)
else:
    print("WARNING: old_secondary_picker_block not found exactly")

html = re.sub(
    r'<span id="secondaryHexReadout"[^>]*>#[0-9a-fA-F]+</span>',
    '<span id="secondaryHexReadout" class="tabular-nums" style="font-size:12px; font-weight:700; color:var(--secondary-accent, #FFFFFF);">#FFFFFF</span>',
    html
)

# 4. Replace Mini Date Picker with FULL ZeroLight Calendar Molecule
old_datepicker_block = '''          <!-- Date Picker (ZeroLight Calendar Popover) -->
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
          </div>'''

new_datepicker_block = '''          <!-- Date Picker & ZeroLight Full Calendar Primitive -->
          <div class="comp-card" style="z-index:35; position:relative;">
            <label class="field-label">Calendar Molecule (ZeroLight Real Month Primitive)</label>
            <div class="date-picker-wrap" id="datePickerWrap">
              <div class="input-icon-wrap" onclick="toggleDateCalendarPopover()" style="margin-bottom:8px;">
                <iconify-icon icon="lucide:calendar" class="prefix-icon"></iconify-icon>
                <input type="text" id="selectedDateInput" value="Nov 20, 2026" readonly style="cursor:pointer;">
                <iconify-icon icon="lucide:calendar-days" style="position:absolute; right:10px; color:var(--muted); pointer-events:none;"></iconify-icon>
              </div>
              <div class="date-calendar-popover" style="width:260px;">
                <!-- Full Month Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid var(--border);">
                  <span style="font-weight:700; font-size:12px; color:var(--foreground);">November 2026</span>
                  <div style="display:flex; gap:4px;">
                    <button type="button" class="btn outline xs" style="padding:2px 6px;" onclick="showToast('Previous month')"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
                    <button type="button" class="btn outline xs" style="padding:2px 6px;" onclick="showToast('Next month')"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
                  </div>
                </div>
                <!-- 7 Day Names (Su Mo Tu We Th Fr Sa) -->
                <div class="calendar-mini" style="margin:0;">
                  <span class="cal-day-name">Su</span><span class="cal-day-name">Mo</span><span class="cal-day-name">Tu</span><span class="cal-day-name">We</span><span class="cal-day-name">Th</span><span class="cal-day-name">Fr</span><span class="cal-day-name">Sa</span>
                  <!-- November 2026 Starts on Sunday (Day 1) -->
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 1, 2026')">1</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 2, 2026')">2</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 3, 2026')">3</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 4, 2026')">4</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 5, 2026')">5</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 6, 2026')">6</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 7, 2026')">7</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 8, 2026')">8</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 9, 2026')">9</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 10, 2026')">10</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 11, 2026')">11</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 12, 2026')">12</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 13, 2026')">13</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 14, 2026')">14</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 15, 2026')">15</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 16, 2026')">16</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 17, 2026')">17</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 18, 2026')">18</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 19, 2026')">19</div>
                  <div class="cal-day active" onclick="selectCalendarDate(this, 'Nov 20, 2026')">20</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 21, 2026')">21</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 22, 2026')">22</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 23, 2026')">23</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 24, 2026')">24</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 25, 2026')">25</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 26, 2026')">26</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 27, 2026')">27</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 28, 2026')">28</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 29, 2026')">29</div>
                  <div class="cal-day" onclick="selectCalendarDate(this, 'Nov 30, 2026')">30</div>
                </div>
              </div>
            </div>
            <span class="field-hint">ZeroLight full 30-day month calendar with day selection</span>
          </div>'''

if old_datepicker_block in html:
    html = html.replace(old_datepicker_block, new_datepicker_block)
else:
    print("WARNING: old_datepicker_block not found exactly")

# 5. Upgrade Pagination to Real ZeroLight Pagination Molecule
old_pagination_block = '''          <!-- Pagination -->
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
          </div>'''

new_pagination_block = '''          <!-- REAL ZEROLIGHT PAGINATION MOLECULE -->
          <div class="comp-card" style="grid-column: 1 / -1;">
            <label class="field-label">Pagination Molecule (ZeroLight Real Primitive)</label>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding:4px 0;">
              <!-- Range text & Per-page Select -->
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums;">
                  Showing <strong style="color:var(--foreground);">1–10</strong> of <strong style="color:var(--foreground);">100</strong> items
                </span>
                <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--muted); border-left:1px solid var(--border); padding-left:12px;">
                  <span>Per page:</span>
                  <div class="custom-select-wrap" style="width:68px; display:inline-block; position:relative;">
                    <div class="custom-select-trigger" style="height:28px; padding:0 8px; font-size:12px;" onclick="toggleDropdownMenu(this)">
                      <span>10</span>
                      <iconify-icon icon="lucide:chevron-down" style="font-size:12px;"></iconify-icon>
                    </div>
                    <div class="custom-select-options">
                      <div class="select-option selected" onclick="selectDropdownOption(this, '10')">10</div>
                      <div class="select-option" onclick="selectDropdownOption(this, '25')">25</div>
                      <div class="select-option" onclick="selectDropdownOption(this, '50')">50</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Numbered Page Controls -->
              <div class="pagination">
                <button class="page-btn" onclick="showToast('Previous Page')">
                  <iconify-icon icon="lucide:chevron-left"></iconify-icon>
                </button>
                <button class="page-btn active" onclick="this.parentElement.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); showToast('Page 1');">1</button>
                <button class="page-btn" onclick="this.parentElement.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); showToast('Page 2');">2</button>
                <button class="page-btn" onclick="this.parentElement.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); showToast('Page 3');">3</button>
                <span class="page-dots">&hellip;</span>
                <button class="page-btn" onclick="this.parentElement.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); showToast('Page 10');">10</button>
                <button class="page-btn" onclick="showToast('Next Page')">
                  <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                </button>
              </div>
            </div>
            <span class="field-hint">Range indicator, per-page dropdown, and numbered pagination controls</span>
          </div>'''

if old_pagination_block in html:
    html = html.replace(old_pagination_block, new_pagination_block)
else:
    print("WARNING: old_pagination_block not found exactly")

# 6. Charts: Crisp white secondary accents with hairline borders
html = html.replace(
    '<div style="width:12px; height:40%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $40k"></div>',
    '<div style="width:12px; height:40%; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.18); border-radius:3px 3px 0 0;" title="Secondary: $40k"></div>'
)
html = html.replace(
    '<div style="width:12px; height:55%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $55k"></div>',
    '<div style="width:12px; height:55%; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.18); border-radius:3px 3px 0 0;" title="Secondary: $55k"></div>'
)
html = html.replace(
    '<div style="width:12px; height:70%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $70k"></div>',
    '<div style="width:12px; height:70%; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.18); border-radius:3px 3px 0 0;" title="Secondary: $70k"></div>'
)
html = html.replace(
    '<div style="width:12px; height:85%; background:var(--secondary-accent, #06B6D4); border-radius:3px 3px 0 0;" title="Secondary: $85k"></div>',
    '<div style="width:12px; height:85%; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.18); border-radius:3px 3px 0 0;" title="Secondary: $85k"></div>'
)
html = html.replace(
    '<span style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:2px; background:var(--secondary-accent, #06B6D4);"></span> Secondary</span>',
    '<span style="display:flex; align-items:center; gap:5px;"><span style="width:8px; height:8px; border-radius:2px; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.25);"></span> Secondary</span>'
)
html = html.replace(
    '<circle cx="50" cy="50" r="38" fill="none" stroke="var(--secondary-accent, #06B6D4)" stroke-width="12" stroke-dasharray="67 240" stroke-dashoffset="-138" />',
    '<circle cx="50" cy="50" r="38" fill="none" stroke="var(--secondary-accent, #FFFFFF)" stroke-width="12" stroke-dasharray="67 240" stroke-dashoffset="-138" style="filter: drop-shadow(0 0 1px rgba(0,0,0,0.25));" />'
)
html = html.replace(
    '<span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--secondary-accent, #06B6D4);"></span> 28% API</span>',
    '<span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--secondary-accent, #FFFFFF); border:1px solid rgba(0,0,0,0.25);"></span> 28% API</span>'
)

# 7. Semantic swatches in JS
html = html.replace(
    "{ name: 'Secondary Accent', hex: state.secondaryColor || '#06B6D4' }",
    "{ name: 'Secondary Accent', hex: state.secondaryColor || '#FFFFFF' }"
)

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("SUCCESS: dock-prototype.html updated with default Black & White, full Calendar & Pagination!")
