import os

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Visual Studio Dock — ZeroLight OS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* ZeroLight Spatial Token Invariants */
      --outer-bg: #eef0f4;
      --background: #ffffff;
      --canvas-bg: #fafafa;
      --card: #ffffff;
      --foreground: #09090b;
      --muted-foreground: #64748b;
      --border: #e4e4e7;
      --input: #e4e4e7;

      /* Brand & Accents */
      --primary: #0f172a;
      --primary-foreground: #ffffff;
      --secondary: #f4f4f5;
      --secondary-foreground: #0f172a;
      --muted: #f4f4f5;
      --chart-primary: #0284c7;
      --chart-secondary: #0d9488;
      --success: #10b981;
      --success-foreground: #ffffff;
      --warning: #f59e0b;
      --warning-foreground: #ffffff;
      --destructive: #ef4444;
      --destructive-foreground: #ffffff;
      --ring: #0f172a;

      /* Dynamic Studio Geometry */
      --radius: 0.5rem;
      --border-w: 1px;
      --control-h: 36px;

      /* Typography */
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-size-base: 14px;
      --font-weight-base: 400;
      --font-style-base: normal;
      --letter-spacing-base: -0.011em;
      --line-height-base: 1.5;

      /* Elevation & Atmosphere */
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
      --shadow-shell: 0 16px 40px -12px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(15, 23, 42, 0.04);
      --shadow-float: 0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05);
      --shadow-popover: 0 12px 28px -6px rgba(9, 9, 11, 0.14), 0 4px 10px -4px rgba(9, 9, 11, 0.06);
      --backdrop-blur: 0px;

      /* Icons */
      --icon-stroke: 1.85;
      --icon-scale: 1;
      --icon-color: currentColor;

      /* Motion */
      --spring-stiffness: 400;
      --spring-damping: 28;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-sans);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-base);
      font-style: var(--font-style-base);
      letter-spacing: var(--letter-spacing-base);
      line-height: var(--line-height-base);
      color: var(--foreground);
      background: var(--outer-bg);
      height: 100vh;
      overflow: hidden;
      padding: 14px;
      -webkit-font-smoothing: antialiased;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .tabular-nums {
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }

    .lucide {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: var(--icon-color);
      stroke-width: var(--icon-stroke);
      stroke-linecap: round;
      stroke-linejoin: round;
      transform: scale(var(--icon-scale));
      flex-shrink: 0;
      transition: transform 0.15s ease, stroke-width 0.15s ease;
    }

    /* Clean Tooltip */
    [data-tip] { position: relative; }
    [data-tip]::after {
      content: attr(data-tip);
      position: absolute;
      bottom: calc(100% + 7px);
      left: 50%;
      transform: translateX(-50%) translateY(2px);
      background: #0f172a;
      color: #fafafa;
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      z-index: 400;
      transition: opacity 0.14s ease, transform 0.14s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    }
    [data-tip]:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    [data-tip-pos="bottom"]::after {
      bottom: auto;
      top: calc(100% + 7px);
    }

    /* Overall Shell */
    .app-shell {
      width: 100%;
      height: 100%;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: var(--shadow-shell);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top Clean Header */
    .app-header {
      padding: 14px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
      background: var(--background);
      z-index: 10;
    }

    .title-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .dock-main-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--foreground);
    }

    .dock-sub-title {
      font-size: 11.5px;
      color: var(--muted-foreground);
      font-weight: 500;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    /* Split Workspace */
    .app-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 364px;
      gap: 14px;
      padding: 0 14px 14px;
      background: var(--background);
    }

    /* Canvas */
    .canvas {
      height: 100%;
      overflow-y: auto;
      padding: 22px 24px 80px;
      background: var(--canvas-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      scroll-behavior: smooth;
    }

    .canvas-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    /* Brand Hero Lockup (Relocated Above Foundations) */
    .brand-hero-cluster {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 24px;
      background: color-mix(in srgb, var(--card) 94%, transparent);
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

    /* Section Headers */
    .ds-section { display: flex; flex-direction: column; gap: 16px; }
    .ds-section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }
    .ds-section-title { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; }
    .ds-section-desc { font-size: 12.5px; color: var(--muted-foreground); }

    /* Surface Card */
    .foundation-card {
      background: color-mix(in srgb, var(--card) 94%, transparent);
      border: var(--border-w) solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(var(--backdrop-blur));
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .f-card-label { font-size: 12px; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.04em; }

    /* Component Grid */
    .comp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 14px;
    }

    .comp-slot {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .comp-slot-title {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .comp-card {
      background: color-mix(in srgb, var(--card) 92%, transparent);
      color: var(--foreground);
      border: var(--border-w) solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(var(--backdrop-blur));
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 84px;
      justify-content: center;
    }

    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .col { display: flex; flex-direction: column; gap: 8px; width: 100%; }

    @media (max-width: 900px) {
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
    }

    /* ================= ZEROLIGHT PRIMITIVES ================= */
    .btn {
      height: var(--control-h);
      padding: 0 14px;
      border-radius: var(--radius);
      border: var(--border-w) solid var(--input);
      background: var(--background);
      color: var(--foreground);
      font-family: inherit;
      font-size: calc(var(--font-size-base) * 0.93);
      font-weight: calc(var(--font-weight-base) + 120);
      letter-spacing: var(--letter-spacing-base);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      box-shadow: var(--shadow-sm);
      outline: none;
      transition: all 0.15s ease;
      user-select: none;
    }
    .btn:hover { background: var(--secondary); border-color: rgba(0,0,0,0.12); }
    .btn:active { transform: scale(0.97); }

    .btn.primary {
      background: var(--primary);
      color: var(--primary-foreground);
      border-color: var(--primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .btn.primary:hover { opacity: 0.92; background: var(--primary); }

    .btn.secondary {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border-color: transparent;
    }

    .btn.outline {
      background: transparent;
      border: var(--border-w) solid var(--border);
      color: var(--foreground);
    }

    .btn.ghost {
      border-color: transparent;
      box-shadow: none;
      background: transparent;
      color: var(--foreground);
    }
    .btn.ghost:hover { background: var(--secondary); }

    .btn.danger {
      background: var(--destructive);
      color: var(--destructive-foreground);
      border-color: var(--destructive);
    }

    .btn.success {
      background: var(--success);
      color: var(--success-foreground);
      border-color: var(--success);
    }

    .btn.subtle {
      background: rgba(0,0,0,0.03);
      border-color: transparent;
    }

    .btn.sm {
      height: calc(var(--control-h) * 0.82);
      padding: 0 10px;
      font-size: calc(var(--font-size-base) * 0.85);
    }
    .btn.icon-only { width: var(--control-h); padding: 0; justify-content: center; }
    .btn.icon-only.sm { width: calc(var(--control-h) * 0.82); }

    .btn.primary .lucide, .brand-tile.inverted .lucide {
      --icon-color: currentColor !important;
      stroke: currentColor !important;
    }

    .input, .textarea {
      width: 100%;
      height: var(--control-h);
      padding: 0 12px;
      border-radius: var(--radius);
      border: var(--border-w) solid var(--input);
      background: var(--background);
      color: var(--foreground);
      font-family: inherit;
      font-size: calc(var(--font-size-base) * 0.93);
      font-weight: var(--font-weight-base);
      letter-spacing: var(--letter-spacing-base);
      outline: none;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .input:focus, .textarea:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 16%, transparent);
    }
    .textarea { height: 72px; padding: 10px 12px; resize: vertical; }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2.5px 8px;
      border-radius: calc(var(--radius) * 0.75);
      border: var(--border-w) solid var(--border);
      background: var(--secondary);
      color: var(--foreground);
      font-size: calc(var(--font-size-base) * 0.82);
      font-weight: 500;
      line-height: 1.2;
    }
    .badge.accent, .badge.brand { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
    .badge.success { background: rgba(16, 185, 129, 0.1); color: #059669; border-color: rgba(16, 185, 129, 0.25); }
    .badge.warning { background: rgba(245, 158, 11, 0.1); color: #d97706; border-color: rgba(245, 158, 11, 0.25); }
    .badge.danger { background: rgba(239, 68, 68, 0.1); color: #dc2626; border-color: rgba(239, 68, 68, 0.25); }
    .badge.outline { background: transparent; }

    /* Switches */
    .switch {
      width: 40px;
      height: 22px;
      border-radius: 9999px;
      background: var(--secondary);
      border: 1px solid var(--border);
      position: relative;
      cursor: pointer;
      transition: background 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
    }
    .switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 9999px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .switch.on { background: var(--primary); border-color: var(--primary); }
    .switch.on::after { transform: translateX(18px); }

    /* Kbd Token */
    .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border-radius: 4px;
      background: var(--secondary);
      border: 1px solid var(--border);
      box-shadow: 0 1px 0 rgba(0,0,0,0.1);
      font-size: 10.5px;
      font-weight: 600;
      color: var(--muted-foreground);
    }

    /* Currency Pill & Payment Chip */
    .currency-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 9px;
      border-radius: 9999px;
      background: var(--secondary);
      border: 1px solid var(--border);
      font-size: 12px;
      font-weight: 600;
    }
    .payment-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: var(--radius);
      border: var(--border-w) solid var(--border);
      background: var(--card);
      font-size: 12px;
      font-weight: 500;
    }
    .card-brand-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 4px;
      border-radius: 3px;
      background: #0f172a;
      color: #ffffff;
    }

    /* Avatar Stack */
    .avatar-stack { display: flex; align-items: center; }
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 9999px;
      background: var(--secondary);
      border: 2px solid var(--card);
      display: grid;
      place-items: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--foreground);
      margin-left: -8px;
      flex-shrink: 0;
      position: relative;
    }
    .avatar:first-child { margin-left: 0; }
    .avatar.lead { background: var(--primary); color: var(--primary-foreground); }
    .avatar-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      background: var(--success);
      border: 1.5px solid var(--card);
    }

    /* Typing Dots */
    .typing-dots { display: inline-flex; align-items: center; gap: 3.5px; }
    .typing-dots span {
      width: 5px;
      height: 5px;
      border-radius: 9999px;
      background: var(--muted-foreground);
      animation: pulseDot 1.4s infinite ease-in-out both;
    }
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes pulseDot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

    /* Slider & Progress */
    .slider-track-wrap { width: 100%; display: flex; align-items: center; gap: 10px; }
    input[type="range"].zl-slider { flex: 1; height: 4px; accent-color: var(--primary); cursor: pointer; }
    .progress-bar-wrap {
      width: 100%;
      height: 7px;
      background: var(--secondary);
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.05);
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    /* StatCard Widget */
    .stat-card-widget {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-label { font-size: 12px; font-weight: 500; color: var(--muted-foreground); }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--foreground); }
    .trend-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }
    .trend-pill.up { background: rgba(16, 185, 129, 0.12); color: #059669; }

    /* SVG Sparkline */
    .sparkline-svg {
      width: 100%;
      height: 44px;
      overflow: visible;
    }

    /* Conjoined Field */
    .conjoined-field { display: flex; align-items: stretch; width: 100%; }
    .conjoined-prefix {
      padding: 0 10px;
      background: var(--secondary);
      border: var(--border-w) solid var(--input);
      border-right: none;
      border-radius: var(--radius) 0 0 var(--radius);
      font-size: 12px;
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
    }
    .conjoined-field input { border-radius: 0; border-right: none; }
    .conjoined-btn { border-radius: 0 var(--radius) var(--radius) 0; border-left: none; }

    /* Alert Banner */
    .alert-banner {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius);
      border: var(--border-w) solid var(--border);
      background: var(--secondary);
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12.5px;
    }
    .alert-banner.info { border-color: rgba(2, 132, 199, 0.25); background: rgba(2, 132, 199, 0.06); }

    /* Choice Card */
    .choice-card {
      border: var(--border-w) solid var(--border);
      border-radius: var(--radius);
      padding: 12px;
      cursor: pointer;
      background: var(--card);
      transition: all 0.15s ease;
    }
    .choice-card.selected {
      border-color: var(--primary);
      background: color-mix(in srgb, var(--primary) 5%, var(--background));
    }

    /* DataTable */
    .data-table-preview {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }
    .data-table-preview th {
      padding: 8px 10px;
      background: var(--secondary);
      font-weight: 600;
      color: var(--muted-foreground);
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .data-table-preview td {
      padding: 9px 10px;
      border-bottom: 1px solid var(--border);
      color: var(--foreground);
    }
    .data-table-preview tr:last-child td { border-bottom: none; }
    .data-table-preview tr:hover td { background: var(--secondary); }

    /* Custom Dropdown */
    .ui-dd { position: relative; width: 100%; }
    .ui-dd-trigger {
      width: 100%;
      height: var(--control-h);
      padding: 0 11px;
      border-radius: var(--radius);
      border: var(--border-w) solid var(--input);
      background: var(--background);
      color: var(--foreground);
      font-family: inherit;
      font-size: calc(var(--font-size-base) * 0.92);
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }
    .ui-dd-menu {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-popover);
      padding: 4px;
      display: none;
      flex-direction: column;
      gap: 2px;
      z-index: 200;
    }
    .ui-dd.open .ui-dd-menu { display: flex; }
    .ui-dd-item {
      padding: 7px 10px;
      border-radius: calc(var(--radius) * 0.75);
      border: none;
      background: transparent;
      color: var(--foreground);
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
    }
    .ui-dd-item:hover { background: var(--secondary); }
    .ui-dd-item.active { font-weight: 600; background: var(--secondary); }
    .ui-dd-item .dd-check { opacity: 0; width: 14px; height: 14px; }
    .ui-dd-item.active .dd-check { opacity: 1; }

    /* 11-Step Tonal Ramp */
    .tonal-ramp-strip {
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      gap: 3px;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .tonal-chip {
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 4px;
      cursor: pointer;
      transition: transform 0.15s ease;
    }
    .tonal-chip:hover { transform: translateY(-2px); }
    .tonal-chip-label { font-size: 9.5px; font-weight: 600; }

    /* ================= TOKEN STUDIO (RIGHT ASIDE) ================= */
    .inspector {
      height: 100%;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 20;
      box-shadow: var(--shadow-sm);
    }

    .inspector-head {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--background);
    }

    .inspector-title { font-size: 13.5px; font-weight: 700; letter-spacing: -0.01em; }
    .inspector-sub { font-size: 11px; color: var(--muted-foreground); }

    .inspector-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px 28px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .studio-sec {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }

    .studio-sec-btn {
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: var(--foreground);
      cursor: pointer;
    }
    .studio-sec-btn:hover { background: var(--secondary); }
    .studio-chevron { transition: transform 0.18s ease; color: var(--muted-foreground); }
    .studio-sec.open .studio-chevron { transform: rotate(180deg); }

    .studio-sec-body {
      display: none;
      padding: 12px;
      border-top: 1px solid var(--border);
      flex-direction: column;
      gap: 12px;
      background: var(--canvas-bg);
    }
    .studio-sec.open .studio-sec-body { display: flex; }

    .t-field { display: flex; flex-direction: column; gap: 5px; }
    .t-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 500;
      color: var(--muted-foreground);
    }
    .t-readout {
      font-size: 10.5px;
      font-weight: 600;
      background: var(--secondary);
      padding: 1px 6px;
      border-radius: 4px;
      color: var(--foreground);
    }

    .seg-ctrl {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
      background: var(--secondary);
      padding: 2.5px;
      border-radius: 8px;
    }
    .seg-ctrl.c-2 { grid-template-columns: repeat(2, 1fr); }
    .seg-ctrl.c-3 { grid-template-columns: repeat(3, 1fr); }
    .seg-ctrl.c-5 { grid-template-columns: repeat(5, 1fr); }

    .seg-item {
      padding: 4px 6px;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      color: var(--muted-foreground);
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .seg-item.active {
      background: var(--background);
      color: var(--foreground);
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }

    .swatch-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      border: 1px solid rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.15s ease;
    }
    .swatch:hover { transform: scale(1.15); }
    .swatch.active { box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring); }

    .color-picker-wrap {
      position: relative;
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      border: 1px dashed var(--muted-foreground);
      display: grid;
      place-items: center;
      cursor: pointer;
      overflow: hidden;
    }
    .color-picker-wrap input { position: absolute; inset: -6px; opacity: 0; cursor: pointer; }

    .studio-upload-btn {
      width: 100%;
      height: 34px;
      border-radius: var(--radius);
      border: 1px dashed var(--input);
      background: var(--background);
      color: var(--foreground);
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: pointer;
    }

    .inspector-foot {
      padding: 12px 14px;
      border-top: 1px solid var(--border);
      background: var(--background);
      display: flex;
      gap: 8px;
    }

    /* Toast Notification */
    .toast-banner {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      z-index: 1000;
    }
    .toast-banner.show { transform: translateY(0); opacity: 1; }

    /* Modals & Dialogs */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      display: none;
      place-items: center;
      z-index: 500;
      padding: 16px;
    }
    .modal-overlay.open { display: grid; }
    .modal-card {
      width: 100%;
      max-width: 520px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: var(--shadow-float);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 380px;
      height: 100%;
      background: var(--background);
      border-left: 1px solid var(--border);
      box-shadow: var(--shadow-float);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 600;
    }
    .drawer-panel.open { transform: translateX(0); }

    /* Print Stylesheet */
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
      .app-header, .inspector, .modal-overlay, .drawer-panel, .toast-banner {
        display: none !important;
      }
      .app-body { display: block !important; padding: 0 !important; }
      .canvas {
        height: auto !important;
        overflow: visible !important;
        border: none !important;
        padding: 20px !important;
        background: #ffffff !important;
      }
      .brand-hero-cluster, .foundation-card, .comp-card {
        box-shadow: none !important;
        border: 1px solid #d4d4d8 !important;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <!-- SINGLE OVERALL SHELL CONTAINER -->
  <div class="app-shell">

    <!-- CLEAN TOP HEADER (NO SEARCH, NO NICHE TABS) -->
    <header class="app-header">
      <div class="title-stack">
        <h1 class="dock-main-title">Visual Studio Dock</h1>
        <span class="dock-sub-title">Runtime Token &amp; Design System Engine</span>
      </div>

      <div class="toolbar-right">
        <button type="button" class="btn sm" onclick="downloadPdfSpec()" data-tip="Download Clean PDF Spec" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Download PDF</span>
        </button>
        <button type="button" class="btn sm" onclick="downloadCssTokens()" data-tip="Download CSS Tokens" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>Download CSS</span>
        </button>
        <button type="button" class="btn sm primary" onclick="openExportModal()" data-tip="Export Code Snippets" data-tip-pos="bottom">
          <svg class="lucide" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>Export Code</span>
        </button>
      </div>
    </header>

    <!-- INNER BODY SPLIT -->
    <div class="app-body">

      <!-- MAIN CANVAS -->
      <main class="canvas">
        <div class="canvas-inner">

          <!-- BRAND HERO LOCKUP (RELOCATED ABOVE FOUNDATIONS) -->
          <div class="brand-hero-cluster">
            <div class="brand-hero-left">
              <div class="brand-mark-hero js-brand-mark">Z</div>
              <div>
                <h2 class="brand-hero-title js-brand-name">ZeroLight OS</h2>
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

          <!-- DISTRICT 0: FOUNDATIONS -->
          <section class="ds-section" id="sec-foundations">
            <div class="ds-section-head">
              <h2 class="ds-section-title">Foundations &amp; Mathematical Physics</h2>
              <span class="ds-section-desc">11-Step Tonal Ramp, YIQ/WCAG Invariants &amp; Typography</span>
            </div>

            <!-- Mathematical Invariants & WCAG Scorecard -->
            <div class="grid-2">
              <div class="foundation-card">
                <div class="f-card-label">Deterministic Text Contrast &amp; Motion Physics</div>
                <div class="col" style="gap:10px;">
                  <div style="font-size:12.5px;color:var(--muted-foreground);">
                    YIQ Luminance: <strong style="color:var(--foreground);" id="formulaReadout">(R×299 + G×587 + B×114) / 1000 = 940 (Pass)</strong>
                  </div>
                  <div style="font-size:12.5px;color:var(--muted-foreground);">
                    Spring Equation: <strong style="color:var(--foreground);">F = -k·x - c·v (k = <span id="kVal">400</span>, c = <span id="cVal">28</span>)</strong>
                  </div>
                  <div class="row" style="margin-top:4px;">
                    <span class="badge success" id="wcagBadge">WCAG: 14.2:1 (AAA Pass)</span>
                    <span class="kbd">⌘K</span>
                    <span class="badge outline">Tabular Nums Active</span>
                  </div>
                </div>
              </div>

              <!-- Brand Lockup Placeholders -->
              <div class="foundation-card">
                <div class="f-card-label">Brand Identity Placeholders</div>
                <div class="grid-2">
                  <div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius);display:flex;align-items:center;gap:10px;">
                    <div class="brand-mark-hero" style="width:34px;height:34px;font-size:14px;" id="dispMark1">Z</div>
                    <div>
                      <div style="font-weight:700;font-size:13.5px;" class="js-brand-name">ZeroLight OS</div>
                      <div style="font-size:11px;color:var(--muted-foreground);">Standard Tile</div>
                    </div>
                  </div>
                  <div style="padding:12px;border:1px solid var(--primary);border-radius:var(--radius);background:var(--primary);color:var(--primary-foreground);display:flex;align-items:center;gap:10px;">
                    <div style="width:34px;height:34px;border-radius:calc(var(--radius)*0.75);background:var(--primary-foreground);color:var(--primary);display:grid;place-items:center;font-weight:700;font-size:14px;" id="dispMark2">Z</div>
                    <div>
                      <div style="font-weight:700;font-size:13.5px;" class="js-brand-name">ZeroLight OS</div>
                      <div style="font-size:11px;opacity:0.8;">Inverted Hero</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 11-Step Mathematical Tonal Ramp -->
            <div class="foundation-card">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div class="f-card-label">11-Step Mathematical Tonal Ramp (50 to 950)</div>
                <span style="font-size:11px;color:var(--muted-foreground);">Click swatch to copy hex</span>
              </div>
              <div class="tonal-ramp-strip" id="tonalRampContainer">
                <!-- Populated dynamically via JS -->
              </div>
            </div>

            <!-- Typography Specimen Scale -->
            <div class="foundation-card">
              <div class="f-card-label">Typography Scale &amp; Tabular Metrics</div>
              <div class="col" style="gap:12px;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:10px;">
                  <span style="font-size:12px;color:var(--muted-foreground);">Display</span>
                  <span style="font-size:28px;font-weight:800;letter-spacing:-0.03em;" class="js-brand-name">ZeroLight OS</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:10px;">
                  <span style="font-size:12px;color:var(--muted-foreground);">Heading</span>
                  <span style="font-size:18px;font-weight:700;letter-spacing:-0.02em;">Deterministic SaaS Brand Interface Architecture</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:10px;">
                  <span style="font-size:12px;color:var(--muted-foreground);">Body</span>
                  <span style="font-size:13.5px;">Crisp typography strictly bound to live token scale and active tracking.</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <span style="font-size:12px;color:var(--muted-foreground);">Tabular Nums</span>
                  <span class="tabular-nums" style="font-size:14px;font-weight:600;">$148,250.00 • 99.99% SLA • 1,420 RPS • 14.2ms</span>
                </div>
              </div>
            </div>
          </section>

          <!-- DISTRICT 1: ATOMS (ZeroLight Primitives) -->
          <section class="ds-section" id="sec-atoms">
            <div class="ds-section-head">
              <h2 class="ds-section-title">District 1: Atoms</h2>
              <span class="ds-section-desc">ZeroLight Foundational Primitives strictly consuming tokens</span>
            </div>
            <div class="comp-grid" id="atomsGrid">
              <!-- Populated via JS -->
            </div>
          </section>

          <!-- DISTRICT 2: MOLECULES (Composite SaaS Patterns) -->
          <section class="ds-section" id="sec-molecules">
            <div class="ds-section-head">
              <h2 class="ds-section-title">District 2: Molecules</h2>
              <span class="ds-section-desc">StatCard KPI, Area Sparkline, ConjoinedField &amp; Overlays</span>
            </div>
            <div class="comp-grid" id="moleculesGrid">
              <!-- Populated via JS -->
            </div>
          </section>

          <!-- DISTRICT 3: ORGANISMS (Enterprise Modules) -->
          <section class="ds-section" id="sec-organisms">
            <div class="ds-section-head">
              <h2 class="ds-section-title">District 3: Organisms</h2>
              <span class="ds-section-desc">Enterprise DataTable, TenantKit &amp; BillingPortal</span>
            </div>
            <div class="grid-2">
              <!-- DataTable -->
              <div class="comp-card" style="padding:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <strong style="font-size:13px;">Virtual DataTable (Column Grid)</strong>
                  <button class="btn sm" onclick="showToast('Exported 3 rows as TSV')">TSV Export</button>
                </div>
                <table class="data-table-preview">
                  <thead>
                    <tr>
                      <th>Service Key</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th style="text-align:right;">Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>api.edge.prod</strong></td>
                      <td>us-east-1</td>
                      <td><span class="badge success">99.98%</span></td>
                      <td style="text-align:right;" class="tabular-nums">14.2ms</td>
                    </tr>
                    <tr>
                      <td><strong>db.aurora.read</strong></td>
                      <td>ap-south-1</td>
                      <td><span class="badge success">Active</span></td>
                      <td style="text-align:right;" class="tabular-nums">6.8ms</td>
                    </tr>
                    <tr>
                      <td><strong>worker.sync.job</strong></td>
                      <td>eu-central-1</td>
                      <td><span class="badge warning">Queued</span></td>
                      <td style="text-align:right;" class="tabular-nums">28.4ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- TenantKit & BillingPortal -->
              <div class="comp-card" style="padding:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                  <strong style="font-size:13px;">TenantKit &amp; Stripe Billing Tier</strong>
                  <span class="badge brand">Pro Annual</span>
                </div>
                <div class="col" style="gap:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-radius:var(--radius);background:var(--secondary);border:1px solid var(--border);">
                    <div class="row">
                      <div class="brand-mark-hero" style="width:24px;height:24px;font-size:11px;">Z</div>
                      <span style="font-size:12.5px;font-weight:600;">ZeroLight Enterprise Workspace</span>
                    </div>
                    <span class="badge success" style="font-size:10px;">Primary Org</span>
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;">
                      <span style="color:var(--muted-foreground);">API Monthly Quota</span>
                      <strong class="tabular-nums">84,200 / 100,000 req</strong>
                    </div>
                    <div class="progress-bar-wrap">
                      <div class="progress-bar-fill" style="width:84.2%;"></div>
                    </div>
                  </div>
                  <div class="row" style="justify-content:space-between;margin-top:4px;">
                    <div class="payment-chip">
                      <span class="card-brand-badge">VISA</span>
                      <span class="tabular-nums">•••• 4242</span>
                    </div>
                    <button class="btn sm" onclick="showToast('Manage Billing Modal Opened')">Manage Billing</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <!-- FLOATING TOKEN STUDIO (RIGHT ASIDE) -->
      <aside class="inspector" id="tokenStudioAside">
        <div class="inspector-head">
          <div>
            <div class="inspector-title">Token Studio</div>
            <div class="inspector-sub">Runtime Mathematical Tuning</div>
          </div>
          <button class="btn sm ghost icon-only" onclick="resetStudioTokens()" data-tip="Reset Defaults">
            <svg class="lucide" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>

        <div class="inspector-scroll">

          <!-- 1. Brand Identity & Colors -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>1. Brand Identity &amp; Colors</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Brand Name</label>
                <input type="text" class="input" id="inBrandName" value="ZeroLight OS" oninput="updateBrandName(this.value)" />
              </div>
              <div class="t-field">
                <label class="t-label">Brand Tagline</label>
                <input type="text" class="input" id="inBrandTagline" value="Clean, light-mode brand design system" oninput="updateBrandTagline(this.value)" />
              </div>
              <div class="t-field">
                <label class="t-label">Logo Monogram</label>
                <div class="seg-ctrl c-5" id="logoMarkGroup">
                  <button type="button" class="seg-opt active" onclick="setMonogram('Z', this)">Z</button>
                  <button type="button" class="seg-opt" onclick="setMonogram('ZL', this)">ZL</button>
                  <button type="button" class="seg-opt" onclick="setMonogram('◆', this)">◆</button>
                  <button type="button" class="seg-opt" onclick="setMonogram('▲', this)">▲</button>
                  <button type="button" class="seg-opt" onclick="setMonogram('⚡', this)">⚡</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Custom Logo Image</label>
                <label class="studio-upload-btn" for="logoUploadInput">
                  <svg class="lucide" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  <span>Upload Brand Logo</span>
                </label>
                <input type="file" accept="image/*" id="logoUploadInput" style="display:none;" onchange="handleLogoUpload(this)" />
              </div>
              <div class="t-field">
                <label class="t-label">Primary Brand Hue <span class="t-readout" id="readoutPrimary">#0F172A</span></label>
                <div class="swatch-row" id="accentSwatches">
                  <button type="button" class="swatch active" style="background:#0f172a" onclick="setPrimaryColor('#0f172a', this)" data-tip="Obsidian"></button>
                  <button type="button" class="swatch" style="background:#0284c7" onclick="setPrimaryColor('#0284c7', this)" data-tip="Sky"></button>
                  <button type="button" class="swatch" style="background:#0d9488" onclick="setPrimaryColor('#0d9488', this)" data-tip="Teal"></button>
                  <button type="button" class="swatch" style="background:#6366f1" onclick="setPrimaryColor('#6366f1', this)" data-tip="Indigo"></button>
                  <button type="button" class="swatch" style="background:#e11d48" onclick="setPrimaryColor('#e11d48', this)" data-tip="Rose"></button>
                  <button type="button" class="swatch" style="background:#ea580c" onclick="setPrimaryColor('#ea580c', this)" data-tip="Orange"></button>
                  <div class="color-picker-wrap" data-tip="Custom Color">
                    <svg class="lucide" style="width:12px;height:12px;" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                    <input type="color" id="customColorPicker" value="#0f172a" oninput="setPrimaryColor(this.value, null)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Corner Geometry & Density -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>2. Corner Geometry &amp; Density</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Corner Radius <span class="t-readout" id="readoutRadius">0.5rem</span></label>
                <div class="seg-ctrl c-5" id="radiusPresets">
                  <button type="button" class="seg-opt" onclick="setRadius('0rem', this)">0 Sharp</button>
                  <button type="button" class="seg-opt" onclick="setRadius('0.3rem', this)">0.3</button>
                  <button type="button" class="seg-opt active" onclick="setRadius('0.5rem', this)">0.5</button>
                  <button type="button" class="seg-opt" onclick="setRadius('0.75rem', this)">0.75</button>
                  <button type="button" class="seg-opt" onclick="setRadius('1rem', this)">1.0</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Control Height</label>
                <div class="seg-ctrl c-3" id="densityGroup">
                  <button type="button" class="seg-opt" onclick="setControlHeight('32px', this)">32 Compact</button>
                  <button type="button" class="seg-opt active" onclick="setControlHeight('36px', this)">36 Standard</button>
                  <button type="button" class="seg-opt" onclick="setControlHeight('42px', this)">42 Spacious</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Hairline Border Width</label>
                <div class="seg-ctrl" id="borderWidthGroup">
                  <button type="button" class="seg-opt" onclick="setBorderWidth('0px', this)">0px</button>
                  <button type="button" class="seg-opt active" onclick="setBorderWidth('1px', this)">1px</button>
                  <button type="button" class="seg-opt" onclick="setBorderWidth('1.5px', this)">1.5px</button>
                  <button type="button" class="seg-opt" onclick="setBorderWidth('2px', this)">2px</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Typography & Dynamic Google Fonts -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>3. Typography &amp; Dynamic Fonts</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Font Family</label>
                <div class="ui-dd" id="fontDropdown">
                  <button type="button" class="ui-dd-trigger" onclick="toggleDd('fontDropdown')">
                    <span class="dd-label" id="fontLabel">Plus Jakarta Sans</span>
                    <svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div class="ui-dd-menu">
                    <button type="button" class="ui-dd-item active" onclick="setFontFamily('Plus Jakarta Sans', this)"><span>Plus Jakarta Sans</span><svg class="lucide dd-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>
                    <button type="button" class="ui-dd-item" onclick="setFontFamily('Inter', this)"><span>Inter</span><svg class="lucide dd-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>
                    <button type="button" class="ui-dd-item" onclick="setFontFamily('Space Grotesk', this)"><span>Space Grotesk</span><svg class="lucide dd-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>
                    <button type="button" class="ui-dd-item" onclick="setFontFamily('DM Sans', this)"><span>DM Sans</span><svg class="lucide dd-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>
                    <button type="button" class="ui-dd-item" onclick="setFontFamily('Outfit', this)"><span>Outfit</span><svg class="lucide dd-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>
                  </div>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Font Size Base <span class="t-readout" id="readoutFontSize">14px</span></label>
                <input type="range" class="zl-slider" min="12" max="16" step="0.5" value="14" oninput="setFontSize(this.value)" />
              </div>
            </div>
          </div>

          <!-- 4. Surface, Elevation & Blur -->
          <div class="studio-sec">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>4. Surface, Elevation &amp; Blur</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Neutral Surface Palette</label>
                <div class="seg-ctrl" id="surfaceFillGroup">
                  <button type="button" class="seg-opt active" onclick="setSurface('zinc', this)">Zinc</button>
                  <button type="button" class="seg-opt" onclick="setSurface('pure', this)">Pure</button>
                  <button type="button" class="seg-opt" onclick="setSurface('slate', this)">Slate</button>
                  <button type="button" class="seg-opt" onclick="setSurface('stone', this)">Stone</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Card Elevation</label>
                <div class="seg-ctrl c-3" id="elevationGroup">
                  <button type="button" class="seg-opt" onclick="setElevation('none', this)">Flat</button>
                  <button type="button" class="seg-opt active" onclick="setElevation('soft', this)">Subtle</button>
                  <button type="button" class="seg-opt" onclick="setElevation('lifted', this)">Lifted</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Backdrop Blur <span class="t-readout" id="readoutBlur">0px</span></label>
                <input type="range" class="zl-slider" min="0" max="16" step="2" value="0" oninput="setBackdropBlur(this.value)" />
              </div>
            </div>
          </div>

          <!-- 5. Spring Motion Physics Engine -->
          <div class="studio-sec">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>5. Spring Motion Physics Engine</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Motion Preset</label>
                <div class="seg-ctrl" id="motionPresetGroup">
                  <button type="button" class="seg-opt" onclick="setSpring(700, 45, 'Instant', this)">Instant</button>
                  <button type="button" class="seg-opt" onclick="setSpring(520, 32, 'Snappy', this)">Snappy</button>
                  <button type="button" class="seg-opt active" onclick="setSpring(400, 28, 'Damped', this)">Damped</button>
                  <button type="button" class="seg-opt" onclick="setSpring(280, 30, 'Gentle', this)">Gentle</button>
                </div>
              </div>
              <button type="button" class="btn sm" style="width:100%;margin-top:4px;" onclick="testSpringRecoil()">
                <svg class="lucide" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Test Spring Recoil</span>
              </button>
              <div style="height:32px;background:var(--secondary);border-radius:6px;border:1px solid var(--border);padding:4px;display:flex;align-items:center;">
                <div id="springPuck" style="width:24px;height:24px;border-radius:4px;background:var(--primary);transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
              </div>
            </div>
          </div>

        </div>

        <div class="inspector-foot">
          <button type="button" class="btn sm" style="flex:1;" onclick="copyHex('npx zerolight add button stat-card area-chart datatable')">
            <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>CLI Snippet</span>
          </button>
          <button type="button" class="btn sm primary" style="flex:1;" onclick="openExportModal()">
            <svg class="lucide" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Export Code</span>
          </button>
        </div>
      </aside>

    </div>
  </div>

  <!-- TOAST BANNER -->
  <div class="toast-banner" id="globalToast">
    <svg class="lucide" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
    <span id="toastMsg">Action completed</span>
  </div>

  <!-- EXPORT MODAL -->
  <div class="modal-overlay" id="exportModal">
    <div class="modal-card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h3 style="font-size:15px;font-weight:700;">ZeroLight Design System Code Export</h3>
        <button type="button" class="btn sm ghost icon-only" onclick="closeExportModal()">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="seg-ctrl c-3" style="max-width:320px;">
        <button type="button" class="seg-opt active" onclick="switchExportTab('css', this)">CSS Variables</button>
        <button type="button" class="seg-opt" onclick="switchExportTab('tailwind', this)">Tailwind v4</button>
        <button type="button" class="seg-opt" onclick="switchExportTab('figma', this)">Figma DTCG</button>
      </div>

      <textarea id="cssExportArea" readonly style="width:100%;height:150px;background:var(--secondary);border:1px solid var(--border);border-radius:6px;padding:10px;font-family:monospace;font-size:11.5px;color:var(--foreground);outline:none;resize:none;"></textarea>

      <div class="row" style="justify-content:space-between;">
        <button type="button" class="btn sm" onclick="downloadExportFile()">Download File</button>
        <div class="row">
          <button type="button" class="btn sm" onclick="closeExportModal()">Close</button>
          <button type="button" class="btn sm primary" onclick="copyHex(document.getElementById('cssExportArea').value)">Copy to Clipboard</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const ATOMS = [
      {
        name: "Button Hierarchy",
        html: `<div class="row">
          <button class="btn primary" onclick="showToast('Primary Action (YIQ Contrast Active)')">Primary</button>
          <button class="btn secondary" onclick="showToast('Secondary Action')">Secondary</button>
          <button class="btn outline" onclick="showToast('Outline Action')">Outline</button>
          <button class="btn ghost" onclick="showToast('Ghost Action')">Ghost</button>
          <button class="btn danger sm" onclick="showToast('Danger Action')">Delete</button>
        </div>`
      },
      {
        name: "IconButton & Tooltips",
        html: `<div class="row">
          <button class="btn sm icon-only" data-tip="Copy Tokens" onclick="showToast('Copied!')">
            <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
          <button class="btn sm icon-only" data-tip="Search ⌘K" onclick="showToast('Command Palette Triggered')">
            <svg class="lucide" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button class="btn sm icon-only" data-tip="Live Telemetry" onclick="showToast('Telemetry OK')">
            <svg class="lucide" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </button>
          <button class="btn sm icon-only" data-tip="Settings" onclick="showToast('Settings Opened')">
            <svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>`
      },
      {
        name: "Badge Matrix (Dotless Categorical)",
        html: `<div class="row">
          <span class="badge accent">Primary</span>
          <span class="badge success">Operational</span>
          <span class="badge warning">Warning</span>
          <span class="badge danger">Failed</span>
          <span class="badge outline">Outline</span>
        </div>`
      },
      {
        name: "Switch & Checkbox (Spring Physics)",
        html: `<div class="row" style="gap:14px;">
          <label class="row" style="cursor:pointer;">
            <div class="switch on" onclick="this.classList.toggle('on');showToast('Auto-Sync Toggled')"></div>
            <span style="font-size:12.5px;font-weight:500;">Live Sync</span>
          </label>
          <label class="row" style="cursor:pointer;">
            <input type="checkbox" checked style="accent-color:var(--primary);width:15px;height:15px;" onchange="showToast(this.checked ? 'Checked' : 'Unchecked')" />
            <span style="font-size:12.5px;">Require MFA</span>
          </label>
        </div>`
      },
      {
        name: "CurrencyPill & PaymentCard",
        html: `<div class="row">
          <div class="currency-pill"><span>$</span><strong class="tabular-nums">USD</strong></div>
          <div class="currency-pill"><span>€</span><strong class="tabular-nums">EUR</strong></div>
          <div class="payment-chip">
            <span class="card-brand-badge">VISA</span>
            <span class="tabular-nums">•••• 8821</span>
            <span class="badge success" style="font-size:9.5px;padding:1px 4px;">Verified</span>
          </div>
        </div>`
      },
      {
        name: "Kbd Tokens & Shortcuts",
        html: `<div class="row">
          <span class="kbd">⌘K</span><span style="font-size:12px;color:var(--muted-foreground)">Search</span>
          <span class="kbd">Shift+P</span><span style="font-size:12px;color:var(--muted-foreground)">Palette</span>
          <span class="kbd">Esc</span><span style="font-size:12px;color:var(--muted-foreground)">Dismiss</span>
        </div>`
      },
      {
        name: "Avatar Stack & Status Dot",
        html: `<div class="row">
          <div class="avatar-stack">
            <div class="avatar lead">ZL<span class="avatar-dot"></span></div>
            <div class="avatar">JR</div>
            <div class="avatar">AK</div>
            <div class="avatar">+4</div>
          </div>
          <span style="font-size:12px;color:var(--muted-foreground);">Core Engineering</span>
        </div>`
      },
      {
        name: "TypingIndicator & MessageStatus",
        html: `<div class="row" style="gap:16px;">
          <div class="row">
            <span style="font-size:12px;color:var(--muted-foreground)">Agent typing:</span>
            <div class="typing-dots"><span></span><span></span><span></span></div>
          </div>
          <div class="row">
            <span style="font-size:12px;color:var(--muted-foreground)">Delivered:</span>
            <svg class="lucide" style="color:var(--chart-primary)" viewBox="0 0 24 24"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          </div>
        </div>`
      },
      {
        name: "Continuous Slider & Progress",
        html: `<div class="col" style="gap:8px;">
          <div class="slider-track-wrap">
            <input type="range" class="zl-slider" min="0" max="100" value="72" oninput="document.getElementById('sliderVal1').textContent = this.value + '%'" />
            <span class="tabular-nums" style="font-size:11.5px;font-weight:600;" id="sliderVal1">72%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:72%;"></div>
          </div>
        </div>`
      }
    ];

    const MOLECULES = [
      {
        name: "StatCard with TrendDelta (KPI Header)",
        html: `<div class="stat-card-widget">
          <div class="stat-header">
            <span class="stat-label">Monthly Recurring Revenue</span>
            <span class="trend-pill up">
              <svg class="lucide" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
              <span class="tabular-nums">+14.8%</span>
            </span>
          </div>
          <div class="stat-value tabular-nums">$148,250.00</div>
          <div style="font-size:11.5px;color:var(--muted-foreground);">vs. $129,100 last 30d • 99.99% retention</div>
        </div>`
      },
      {
        name: "Mini AreaChart (D3-Style SVG Telemetry)",
        html: `<div class="col" style="gap:4px;">
          <div style="display:flex;justify-content:space-between;font-size:11.5px;">
            <span style="color:var(--muted-foreground)">Throughput</span>
            <strong class="tabular-nums">1,420 RPS</strong>
          </div>
          <svg class="sparkline-svg" viewBox="0 0 200 44" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 38 Q 25 10, 50 24 T 100 12 T 150 20 T 200 6 L 200 44 L 0 44 Z" fill="url(#areaGrad)"/>
            <path d="M0 38 Q 25 10, 50 24 T 100 12 T 150 20 T 200 6" fill="none" stroke="var(--chart-primary)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>`
      },
      {
        name: "ConjoinedField (API Endpoint Builder)",
        html: `<div class="conjoined-field">
          <span class="conjoined-prefix">https://api.</span>
          <input class="input" value="zerolight.dev/v1/auth" />
          <button class="btn sm conjoined-btn" data-tip="Copy Endpoint" onclick="copyHex('https://api.zerolight.dev/v1/auth')">
            <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>`
      },
      {
        name: "Operational AlertBanner",
        html: `<div class="alert-banner info">
          <svg class="lucide" style="color:var(--chart-primary);margin-top:2px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div style="flex:1;">
            <strong>ZeroLight Plug &amp; Play:</strong> Zero monolithic dependencies. Primitives export as standalone JSON payloads.
          </div>
        </div>`
      },
      {
        name: "SplitButton (Primary CTA + Context Menu)",
        html: `<div class="row">
          <div style="display:inline-flex;">
            <button class="btn primary" style="border-top-right-radius:0;border-bottom-right-radius:0;" onclick="showToast('Deployment started...')">Deploy Production</button>
            <button class="btn primary" style="border-top-left-radius:0;border-bottom-left-radius:0;padding:0 8px;border-left:1px solid rgba(255,255,255,0.2);" onclick="showToast('Deployment presets opened')">
              <svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>`
      },
      {
        name: "Choicebox (Card Selector)",
        html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="choice-card selected" onclick="selectChoice(this)"><strong>Stripe Card</strong><br><span style="color:var(--muted-foreground);font-size:11.5px;">Standard billing</span></div>
          <div class="choice-card" onclick="selectChoice(this)"><strong>ACH Invoice</strong><br><span style="color:var(--muted-foreground);font-size:11.5px;">Net-30 terms</span></div>
        </div>`
      }
    ];

    function renderGrid(containerId, list) {
      document.getElementById(containerId).innerHTML = list.map(item => `
        <div class="comp-slot">
          <span class="comp-slot-title">
            <span>${item.name}</span>
            <span class="badge outline" style="font-size:9.5px;padding:1px 4px;">ZeroLight</span>
          </span>
          <div class="comp-card">${item.html}</div>
        </div>
      `).join('');
    }

    renderGrid('atomsGrid', ATOMS);
    renderGrid('moleculesGrid', MOLECULES);

    // ================= STATE & REACTIVE ENGINE =================
    const STORAGE_KEY = 'zerolight_studio_tokens_v7';
    const DEFAULTS = {
      brandName: 'ZeroLight OS',
      brandTagline: 'Clean, light-mode brand design system',
      brandMark: 'Z',
      primary: '#0f172a',
      font: 'Plus Jakarta Sans',
      fontSize: 14,
      radius: '0.5rem',
      controlH: '36px',
      borderW: '1px',
      surface: 'zinc',
      elevation: 'soft',
      blur: 0,
      stiffness: 400,
      damping: 28
    };

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { saved = {}; }
    let state = { ...DEFAULTS, ...saved };
    let uploadedLogoUrl = '';
    const root = document.documentElement;

    const SURFACES = {
      zinc:  { bg: '#ffffff', canvas: '#fafafa', sec: '#f4f4f5', border: '#e4e4e7', outer: '#eef0f4' },
      pure:  { bg: '#ffffff', canvas: '#ffffff', sec: '#f3f4f6', border: '#e5e7eb', outer: '#f9fafb' },
      slate: { bg: '#ffffff', canvas: '#f8fafc', sec: '#f1f5f9', border: '#cbd5e1', outer: '#e2e8f0' },
      stone: { bg: '#ffffff', canvas: '#fafaf9', sec: '#f5f5f4', border: '#d6d3d1', outer: '#e7e5e4' }
    };

    const SHADOWS = {
      none: 'none',
      soft: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      lifted: '0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)'
    };

    function hexToRgb(hex) {
      const c = hex.replace('#', '');
      return {
        r: parseInt(c.substring(0, 2), 16) || 0,
        g: parseInt(c.substring(2, 4), 16) || 0,
        b: parseInt(c.substring(4, 6), 16) || 0
      };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => {
        const h = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return h.length === 1 ? '0' + h : h;
      }).join('');
    }

    function interpolateRgb(rgb1, rgb2, factor) {
      return {
        r: rgb1.r + (rgb2.r - rgb1.r) * factor,
        g: rgb1.g + (rgb2.g - rgb1.g) * factor,
        b: rgb1.b + (rgb2.b - rgb1.b) * factor
      };
    }

    function generateTonalRamp(baseHex) {
      const base = hexToRgb(baseHex);
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 15, g: 23, b: 42 };

      const stops = [
        { name: '50',  factor: 0.92, mixWith: white },
        { name: '100', factor: 0.82, mixWith: white },
        { name: '200', factor: 0.65, mixWith: white },
        { name: '300', factor: 0.45, mixWith: white },
        { name: '400', factor: 0.25, mixWith: white },
        { name: '500', factor: 0.00, mixWith: white }, // base
        { name: '600', factor: 0.15, mixWith: black },
        { name: '700', factor: 0.35, mixWith: black },
        { name: '800', factor: 0.55, mixWith: black },
        { name: '900', factor: 0.72, mixWith: black },
        { name: '950', factor: 0.86, mixWith: black }
      ];

      return stops.map(s => {
        const rgb = s.factor === 0 ? base : interpolateRgb(base, s.mixWith, s.factor);
        return {
          stop: s.name,
          hex: rgbToHex(rgb.r, rgb.g, rgb.b),
          isDark: ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000 < 140
        };
      });
    }

    function getContrastYIQ(hex) {
      const { r, g, b } = hexToRgb(hex);
      return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 140 ? '#09090b' : '#ffffff';
    }

    function renderTonalRamp() {
      const ramp = generateTonalRamp(state.primary);
      const container = document.getElementById('tonalRampContainer');
      container.innerHTML = ramp.map(chip => `
        <div class="tonal-chip" style="background:${chip.hex};color:${chip.isDark ? '#ffffff' : '#09090b'};" onclick="copyHex('${chip.hex}')" data-tip="${chip.stop}: ${chip.hex}">
          <span class="tonal-chip-label">${chip.stop}</span>
        </div>
      `).join('');
    }

    function applyState() {
      const s = SURFACES[state.surface] || SURFACES.zinc;

      root.style.setProperty('--background', s.bg);
      root.style.setProperty('--card', s.bg);
      root.style.setProperty('--canvas-bg', s.canvas);
      root.style.setProperty('--secondary', s.sec);
      root.style.setProperty('--muted', s.sec);
      root.style.setProperty('--border', s.border);
      root.style.setProperty('--input', s.border);
      root.style.setProperty('--outer-bg', s.outer);

      root.style.setProperty('--primary', state.primary);
      root.style.setProperty('--primary-foreground', getContrastYIQ(state.primary));
      root.style.setProperty('--ring', state.primary);

      root.style.setProperty('--font-sans', `'${state.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
      root.style.setProperty('--font-heading', `'${state.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
      root.style.setProperty('--font-size-base', `${state.fontSize}px`);

      root.style.setProperty('--radius', state.radius);
      root.style.setProperty('--control-h', state.controlH);
      root.style.setProperty('--border-w', state.borderW);
      root.style.setProperty('--shadow-sm', SHADOWS[state.elevation] || SHADOWS.soft);
      root.style.setProperty('--backdrop-blur', `${state.blur}px`);

      // Text and Brand updates
      document.querySelectorAll('.js-brand-name').forEach(el => el.textContent = state.brandName);
      document.querySelectorAll('.js-brand-tagline').forEach(el => el.textContent = state.brandTagline);

      const markContent = uploadedLogoUrl ? `<img src="${uploadedLogoUrl}" alt="Logo" />` : state.brandMark;
      document.querySelectorAll('.js-brand-mark').forEach(el => el.innerHTML = markContent);
      document.getElementById('dispMark1').innerHTML = markContent;
      document.getElementById('dispMark2').innerHTML = markContent;

      // Inputs & Readouts
      document.getElementById('inBrandName').value = state.brandName;
      document.getElementById('inBrandTagline').value = state.brandTagline;
      document.getElementById('readoutPrimary').textContent = state.primary.toUpperCase();
      document.getElementById('customColorPicker').value = state.primary;
      document.getElementById('readoutRadius').textContent = state.radius;
      document.getElementById('readoutFontSize').textContent = `${state.fontSize}px`;
      document.getElementById('readoutBlur').textContent = `${state.blur}px`;

      // Calculate YIQ and WCAG
      const { r, g, b } = hexToRgb(state.primary);
      const yiq = Math.round((r * 299 + g * 587 + b * 114) / 1000);
      document.getElementById('formulaReadout').textContent = `(R×${r} + G×${g} + B×${b}) / 1000 = ${yiq} (${yiq >= 140 ? 'Dark Text' : 'White Text'})`;
      
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const ratio = ((1 + 0.05) / (lum + 0.05)).toFixed(1);
      document.getElementById('wcagBadge').textContent = `WCAG: ${ratio}:1 (${ratio >= 7 ? 'AAA Pass' : ratio >= 4.5 ? 'AA Pass' : 'Custom'})`;

      renderTonalRamp();

      // Sync active button highlights in Token Studio
      const syncActive = (id, attr, val) => {
        document.querySelectorAll(`#${id} .seg-opt`).forEach(btn => {
          btn.classList.toggle('active', btn.dataset[attr] === String(val) || btn.textContent.trim().startsWith(String(val)));
        });
      };
      syncActive('radiusPresets', 'r', state.radius);
      syncActive('densityGroup', 'h', state.controlH);
      syncActive('borderWidthGroup', 'bw', state.borderW);
      syncActive('surfaceFillGroup', 'sf', state.surface);
      syncActive('elevationGroup', 'el', state.elevation);

      document.querySelectorAll('#accentSwatches .swatch').forEach(s => {
        s.classList.toggle('active', s.style.backgroundColor.toLowerCase() === state.primary.toLowerCase());
      });

      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    // Interactive Handlers
    function toggleSec(btn) { btn.parentElement.classList.toggle('open'); }
    function toggleDd(id) { document.getElementById(id).classList.toggle('open'); }

    function updateBrandName(name) { state.brandName = name || 'Brand OS'; applyState(); }
    function updateBrandTagline(tagline) { state.brandTagline = tagline; applyState(); }

    function setMonogram(m, btn) {
      uploadedLogoUrl = '';
      state.brandMark = m;
      document.querySelectorAll('#logoMarkGroup .seg-opt').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      applyState();
      showToast(`Monogram updated: ${m}`);
    }

    function handleLogoUpload(input) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        uploadedLogoUrl = e.target.result;
        applyState();
        showToast('Custom logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }

    function setPrimaryColor(hex, btn) {
      state.primary = hex;
      applyState();
      showToast(`Primary Hue: ${hex.toUpperCase()}`);
    }

    function setRadius(r, btn) {
      state.radius = r;
      applyState();
      showToast(`Corner Radius: ${r}`);
    }

    function setControlHeight(h, btn) {
      state.controlH = h;
      applyState();
      showToast(`Control Height: ${h}`);
    }

    function setBorderWidth(w, btn) {
      state.borderW = w;
      applyState();
      showToast(`Border Width: ${w}`);
    }

    function setFontFamily(font, btn) {
      state.font = font;
      document.getElementById('fontLabel').textContent = font;
      document.querySelectorAll('#fontDropdown .ui-dd-item').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      document.getElementById('fontDropdown').classList.remove('open');
      applyState();
      showToast(`Font Family: ${font}`);
    }

    function setFontSize(size) {
      state.fontSize = Number(size);
      applyState();
    }

    function setSurface(surface, btn) {
      state.surface = surface;
      applyState();
      showToast(`Surface Palette: ${surface.toUpperCase()}`);
    }

    function setElevation(el, btn) {
      state.elevation = el;
      applyState();
      showToast(`Elevation: ${el.toUpperCase()}`);
    }

    function setBackdropBlur(val) {
      state.blur = Number(val);
      applyState();
    }

    function setSpring(k, d, name, btn) {
      state.stiffness = k;
      state.damping = d;
      document.getElementById('kVal').textContent = k;
      document.getElementById('cVal').textContent = d;
      applyState();
      showToast(`Motion: ${name} (${k}/${d})`);
    }

    function testSpringRecoil() {
      const puck = document.getElementById('springPuck');
      puck.style.transform = 'translateX(180px)';
      setTimeout(() => { puck.style.transform = 'translateX(0px)'; }, 380);
      showToast('Testing Spring Recoil Dynamics...');
    }

    function resetStudioTokens() {
      state = { ...DEFAULTS };
      uploadedLogoUrl = '';
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      applyState();
      showToast('Reset to ZeroLight Default Invariants');
    }

    function selectChoice(card) {
      card.parentElement.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      showToast('Choice updated');
    }

    // Toast Manager
    let toastTimeout;
    function showToast(msg) {
      const toast = document.getElementById('globalToast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function copyHex(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      showToast(`Copied to clipboard: ${text}`);
    }

    // Export Suite
    let currentExportTab = 'css';

    function buildCSS() {
      return `/* ${state.brandName} — Design System Tokens */\\n:root {\\n  --primary: ${state.primary};\\n  --primary-foreground: ${getContrastYIQ(state.primary)};\\n  --radius: ${state.radius};\\n  --control-h: ${state.controlH};\\n  --border-w: ${state.borderW};\\n  --font-sans: '${state.font}', sans-serif;\\n  --font-size-base: ${state.fontSize}px;\\n  --spring-stiffness: ${state.stiffness};\\n  --spring-damping: ${state.damping};\\n}`;
    }

    function buildTailwind() {
      return `@theme {\\n  --color-primary: ${state.primary};\\n  --color-primary-foreground: ${getContrastYIQ(state.primary)};\\n  --radius-base: ${state.radius};\\n  --font-sans: '${state.font}', sans-serif;\\n}`;
    }

    function buildFigmaDTCG() {
      return JSON.stringify({
        "color": {
          "primary": { "$value": state.primary, "$type": "color" },
          "primaryForeground": { "$value": getContrastYIQ(state.primary), "$type": "color" }
        },
        "dimension": {
          "radius": { "$value": state.radius, "$type": "dimension" },
          "controlHeight": { "$value": state.controlH, "$type": "dimension" }
        },
        "typography": {
          "fontFamily": { "$value": state.font, "$type": "fontFamily" },
          "fontSizeBase": { "$value": `${state.fontSize}px`, "$type": "fontSize" }
        }
      }, null, 2);
    }

    function switchExportTab(tab, btn) {
      currentExportTab = tab;
      btn.parentElement.querySelectorAll('.seg-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const area = document.getElementById('cssExportArea');
      if (tab === 'css') area.value = buildCSS();
      else if (tab === 'tailwind') area.value = buildTailwind();
      else if (tab === 'figma') area.value = buildFigmaDTCG();
    }

    function openExportModal() {
      document.getElementById('cssExportArea').value = buildCSS();
      document.getElementById('exportModal').classList.add('open');
    }

    function closeExportModal() {
      document.getElementById('exportModal').classList.remove('open');
    }

    function downloadPdfSpec() {
      showToast('Preparing PDF Spec Print View...');
      setTimeout(() => { window.print(); }, 250);
    }

    function downloadCssTokens() {
      const slug = state.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([buildCSS()], { type: 'text/css' }));
      a.download = `${slug}-tokens.css`;
      a.click();
      showToast(`Downloaded ${slug}-tokens.css`);
    }

    function downloadExportFile() {
      const slug = state.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
      const a = document.createElement('a');
      const text = document.getElementById('cssExportArea').value;
      const ext = currentExportTab === 'figma' ? 'json' : 'css';
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      a.download = `${slug}-tokens.${ext}`;
      a.click();
      showToast(`Downloaded ${slug}-tokens.${ext}`);
    }

    document.addEventListener('click', e => {
      if (!e.target.closest('.ui-dd')) {
        document.querySelectorAll('.ui-dd.open').forEach(dd => dd.classList.remove('open'));
      }
    });

    // Initialize
    applyState();
  </script>
</body>
</html>"""

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

print("Successfully built complete ZeroLight Visual Studio Dock in dock-prototype.html")
