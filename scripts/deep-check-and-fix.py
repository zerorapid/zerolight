with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update SURFACES and SHADOWS to be more responsive & visible
old_surfaces = """    const SURFACES = {
      zinc:  { bg: '#ffffff', canvas: '#fafafa', sec: '#f4f4f5', border: '#e4e4e7' },
      pure:  { bg: '#ffffff', canvas: '#ffffff', sec: '#f4f4f5', border: '#e5e7eb' },
      slate: { bg: '#ffffff', canvas: '#f8fafc', sec: '#f1f5f9', border: '#e2e8f0' },
      stone: { bg: '#ffffff', canvas: '#fafaf9', sec: '#f5f5f4', border: '#e7e5e4' }
    };

    const SHADOWS = {
      none: 'none',
      soft: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      lifted: '0 4px 10px -2px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)'
    };"""

new_surfaces = """    const SURFACES = {
      zinc:  { bg: '#ffffff', canvas: '#fafafa', sec: '#f4f4f5', border: '#e4e4e7', outer: '#eef0f4' },
      pure:  { bg: '#ffffff', canvas: '#ffffff', sec: '#f3f4f6', border: '#e5e7eb', outer: '#f9fafb' },
      slate: { bg: '#ffffff', canvas: '#f8fafc', sec: '#f1f5f9', border: '#cbd5e1', outer: '#e2e8f0' },
      stone: { bg: '#ffffff', canvas: '#fafaf9', sec: '#f5f5f4', border: '#d6d3d1', outer: '#e7e5e4' }
    };

    const SHADOWS = {
      none: 'none',
      soft: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      lifted: '0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)'
    };"""

assert old_surfaces in html, "SURFACES block not found"
html = html.replace(old_surfaces, new_surfaces)

# 2. Update applyState() to set --card, --outer-bg, and sync active buttons in inspector
old_apply_state_start = """    function applyState() {
      const s = SURFACES[state.surface] || SURFACES.zinc;
      const borderHex = state.borderColor || s.border;

      root.style.setProperty('--background', s.bg);
      root.style.setProperty('--canvas-bg', s.canvas);
      root.style.setProperty('--secondary', s.sec);
      root.style.setProperty('--muted', s.sec);
      root.style.setProperty('--border', borderHex);
      root.style.setProperty('--input', borderHex);"""

new_apply_state_start = """    function applyState() {
      const s = SURFACES[state.surface] || SURFACES.zinc;
      const borderHex = state.borderColor || s.border;

      root.style.setProperty('--background', s.bg);
      root.style.setProperty('--card', s.bg);
      root.style.setProperty('--canvas-bg', s.canvas);
      root.style.setProperty('--secondary', s.sec);
      root.style.setProperty('--muted', s.sec);
      root.style.setProperty('--border', borderHex);
      root.style.setProperty('--input', borderHex);
      root.style.setProperty('--outer-bg', s.outer);"""

assert old_apply_state_start in html, "applyState start not found"
html = html.replace(old_apply_state_start, new_apply_state_start)

# 3. Add active state syncing for all Token Studio preset buttons inside applyState()
apply_state_end_target = "safeSet(STORAGE_KEY, JSON.stringify(state));"
new_sync_logic = """
      // Sync inspector button active states
      const setActiveOpt = (id, attr, val) => {
        document.querySelectorAll(`#${id} .seg-opt`).forEach(btn => {
          btn.classList.toggle('active', btn.dataset[attr] === String(val));
        });
      };
      setActiveOpt('radiusPresets', 'r', state.radius);
      setActiveOpt('borderWidthGroup', 'bw', state.borderW);
      setActiveOpt('densityGroup', 'h', state.controlH);
      setActiveOpt('surfaceFillGroup', 'sf', state.surface);
      setActiveOpt('elevationGroup', 'el', state.elevation);
      setActiveOpt('fontWeightGroup', 'w', state.fontWeight);
      setActiveOpt('fontStyleGroup', 'st', state.fontStyle);
      setActiveOpt('lineHeightGroup', 'lh', state.lineHeight);
      setActiveOpt('trackingGroup', 'tr', state.tracking);
      
      const fontLabelEl = document.querySelector('#fontDropdown .dd-label');
      if (fontLabelEl) {
        const cleanFont = state.font.replace(/['",]/g, '').split(' ')[0] || 'Plus Jakarta Sans';
        fontLabelEl.textContent = cleanFont;
      }

      safeSet(STORAGE_KEY, JSON.stringify(state));"""

assert apply_state_end_target in html, "apply_state_end_target not found"
html = html.replace(apply_state_end_target, new_sync_logic)

# 4. Enhance CSS for full token responsiveness (font scaling, control height scaling, border-width)
css_enhancements = """
    /* Deep Token Inheritance Enhancements */
    .btn, .input, .textarea, .badge, .ui-dd-trigger, .ui-dd-item, .choice-card, .brand-tile {
      font-family: inherit;
      letter-spacing: var(--letter-spacing-base);
      font-style: var(--font-style-base);
      transition: background 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.15s;
    }

    .btn {
      font-size: calc(var(--font-size-base) * 0.93);
      font-weight: calc(var(--font-weight-base) + 120);
      line-height: 1.2;
    }

    .btn.sm {
      height: calc(var(--control-h) * 0.82);
      font-size: calc(var(--font-size-base) * 0.85);
      padding: 0 10px;
    }

    .btn.icon-only.sm {
      width: calc(var(--control-h) * 0.82);
    }

    .input, .textarea {
      font-size: calc(var(--font-size-base) * 0.93);
      font-weight: var(--font-weight-base);
      line-height: var(--line-height-base);
    }

    .comp-card {
      font-size: var(--font-size-base);
      line-height: var(--line-height-base);
      letter-spacing: var(--letter-spacing-base);
      border: var(--border-w) solid var(--border) !important;
      border-radius: var(--radius) !important;
      box-shadow: var(--shadow-sm) !important;
      background: color-mix(in srgb, var(--card) 92%, transparent);
      backdrop-filter: blur(var(--backdrop-blur));
      -webkit-backdrop-filter: blur(var(--backdrop-blur));
    }

    .foundation-card, .brand-hero-cluster {
      border: var(--border-w) solid var(--border) !important;
      border-radius: var(--radius) !important;
      box-shadow: var(--shadow-sm) !important;
      background: color-mix(in srgb, var(--card) 94%, transparent);
      backdrop-filter: blur(var(--backdrop-blur));
      -webkit-backdrop-filter: blur(var(--backdrop-blur));
    }

    .brand-tile, .choice-card, .color-card {
      border: var(--border-w) solid var(--border) !important;
      border-radius: calc(var(--radius) * 0.85) !important;
      box-shadow: var(--shadow-sm);
    }

    .badge {
      border: var(--border-w) solid var(--border) !important;
      border-radius: calc(var(--radius) * 0.75) !important;
      font-size: calc(var(--font-size-base) * 0.82);
    }

    .ui-dd-trigger {
      height: var(--control-h);
      border: var(--border-w) solid var(--input) !important;
      border-radius: var(--radius) !important;
      font-size: calc(var(--font-size-base) * 0.92);
    }

    .btn.primary .lucide, .brand-tile.inverted .lucide {
      --icon-color: currentColor !important;
      stroke: currentColor !important;
    }
"""

html = html.replace('  </style>', css_enhancements + '\n  </style>')

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Deep check enhancements successfully written to dock-prototype.html!")
