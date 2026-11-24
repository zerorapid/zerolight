import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Visual Studio Dock — ZeroLight Design System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* ZeroLight Spatial Token Invariants */
      --outer-bg: #f4f5f8;
      --canvas-bg: #fafafa;
      --surface: #ffffff;
      --foreground: #09090b;
      --muted-foreground: #64748b;
      --border: rgba(0, 0, 0, 0.08);
      --border-subtle: rgba(0, 0, 0, 0.04);
      --input-border: #e2e8f0;

      /* Primary Brand & Accents */
      --primary: #0f172a;
      --primary-foreground: #ffffff;
      --secondary: #f1f5f9;
      --secondary-foreground: #0f172a;
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
      --radius: 8px;
      --card-radius: 12px;
      --pill-radius: 9999px;
      --border-w: 1px;
      --control-h: 36px;

      /* Typography */
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-size-base: 13.5px;
      --font-weight-base: 400;
      --letter-spacing-base: -0.012em;
      --line-height-base: 1.5;

      /* Elevation & Atmosphere */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
      --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(0, 0, 0, 0.03);
      --shadow-float: 0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02);
      --shadow-shell: 0 16px 40px -12px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(15, 23, 42, 0.04);
      --backdrop-blur: 0px;

      /* Live SVG Icon Tokens */
      --icon-stroke: 1.85;
      --icon-scale: 1;
      --icon-color: currentColor;

      /* ZeroLight Spring Physics */
      --spring-stiffness: 400;
      --spring-damping: 28;
    }

    [data-theme="dark"] {
      --outer-bg: #030712;
      --canvas-bg: #090d16;
      --surface: #0e1526;
      --foreground: #f8fafc;
      --muted-foreground: #94a3b8;
      --border: rgba(255, 255, 255, 0.09);
      --border-subtle: rgba(255, 255, 255, 0.04);
      --input-border: #1e293b;
      --primary: #f8fafc;
      --primary-foreground: #090d16;
      --secondary: #1e293b;
      --secondary-foreground: #f8fafc;
      --ring: #f8fafc;
      --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.25), 0 6px 16px -4px rgba(0, 0, 0, 0.2);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-sans);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-base);
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

    /* Tooltip */
    [data-tip] { position: relative; }
    [data-tip]::after {
      content: attr(data-tip);
      position: absolute;
      bottom: calc(100% + 7px);
      left: 50%;
      transform: translateX(-50%) translateY(2px);
      background: #0f172a;
      color: #ffffff;
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

    /* App Shell */
    .app-shell {
      width: 100%;
      height: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow-shell);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Top Navigation Bar */
    .app-header {
      padding: 12px 20px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
      z-index: 10;
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-mark {
      width: 28px;
      height: 28px;
      background: var(--primary);
      color: var(--primary-foreground);
      border-radius: calc(var(--radius) * 0.75);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: -0.02em;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      flex-shrink: 0;
    }

    .brand-text-stack {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .brand-title {
      font-weight: 700;
      font-size: 15px;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand-subtitle {
      font-size: 11px;
      font-weight: 500;
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Tier Navigation Pills */
    .tier-nav {
      display: flex;
      align-items: center;
      gap: 3px;
      background: var(--secondary);
      padding: 3px;
      border-radius: 9999px;
      border: 1px solid var(--border);
    }

    .tier-btn {
      padding: 4px 11px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 500;
      color: var(--muted-foreground);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }
    .tier-btn:hover { color: var(--foreground); }
    .tier-btn.active {
      background: var(--surface);
      color: var(--foreground);
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .tier-dot {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: var(--muted-foreground);
    }
    .tier-btn.active .tier-dot { background: var(--chart-primary); }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .math-badge {
      padding: 4px 9px;
      border-radius: 6px;
      background: var(--secondary);
      border: 1px solid var(--border);
      font-size: 11px;
      font-weight: 600;
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Split Workspace */
    .app-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 350px;
      background: var(--canvas-bg);
      overflow: hidden;
    }

    /* Canvas */
    .canvas {
      height: 100%;
      overflow-y: auto;
      padding: 24px 28px 80px;
      scroll-behavior: smooth;
    }

    .canvas-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    /* District Sections */
    .ds-district {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .district-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      gap: 12px;
    }

    .district-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .district-badge {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 2px 7px;
      border-radius: 4px;
      background: var(--secondary);
      color: var(--muted-foreground);
      border: 1px solid var(--border);
    }

    .district-title {
      font-family: var(--font-heading);
      font-size: 16.5px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .district-desc {
      font-size: 12.5px;
      color: var(--muted-foreground);
    }

    /* ZeroLight Surface Cards */
    .zl-card {
      background: var(--surface);
      border: var(--border-w) solid var(--border);
      border-radius: var(--card-radius);
      padding: 18px 20px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 14px;
      backdrop-filter: blur(var(--backdrop-blur));
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .zl-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .zl-card-title {
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--muted-foreground);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Grid Layouts */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

    @media (max-width: 900px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    }

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
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .comp-slot-card {
      background: var(--surface);
      border: var(--border-w) solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
      box-shadow: var(--shadow-sm);
      min-height: 74px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .col { display: flex; flex-direction: column; gap: 8px; width: 100%; }

    /* ================= ZEROLIGHT ATOM PRIMITIVES ================= */
    .btn {
      height: var(--control-h);
      padding: 0 13px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--foreground);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 500;
      letter-spacing: -0.01em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      outline: none;
      transition: all 0.15s ease;
      white-space: nowrap;
      user-select: none;
    }
    .btn:hover { background: var(--secondary); border-color: rgba(0,0,0,0.12); }
    .btn:active { transform: scale(0.97); }

    .btn.primary {
      background: var(--primary);
      color: var(--primary-foreground);
      border-color: var(--primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .btn.primary:hover { opacity: 0.92; background: var(--primary); }

    .btn.secondary {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border-color: transparent;
    }
    .btn.secondary:hover { background: rgba(0,0,0,0.08); }

    .btn.outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--foreground);
    }

    .btn.ghost {
      background: transparent;
      border-color: transparent;
      color: var(--foreground);
    }
    .btn.ghost:hover { background: var(--secondary); }

    .btn.danger {
      background: var(--destructive);
      color: var(--destructive-foreground);
      border-color: var(--destructive);
    }
    .btn.danger:hover { opacity: 0.92; }

    .btn.success {
      background: var(--success);
      color: var(--success-foreground);
      border-color: var(--success);
    }

    .btn.subtle {
      background: rgba(0,0,0,0.03);
      border-color: transparent;
    }

    .btn.sm { height: 30px; padding: 0 9px; font-size: 12px; }
    .btn.lg { height: 42px; padding: 0 18px; font-size: 14px; }
    .btn.icon-only { width: var(--control-h); padding: 0; justify-content: center; }
    .btn.icon-only.sm { width: 30px; }

    /* Inputs */
    .input {
      width: 100%;
      height: var(--control-h);
      padding: 0 11px;
      border-radius: var(--radius);
      border: 1px solid var(--input-border);
      background: var(--surface);
      color: var(--foreground);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .input::placeholder { color: var(--muted-foreground); }
    .input:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 15%, transparent);
    }

    /* Badges & Tags */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2.5px 8px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: -0.01em;
      line-height: 1.2;
      border: 1px solid var(--border);
      background: var(--secondary);
      color: var(--foreground);
    }
    .badge.brand { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
    .badge.success { background: rgba(16, 185, 129, 0.1); color: #059669; border-color: rgba(16, 185, 129, 0.25); }
    .badge.warning { background: rgba(245, 158, 11, 0.1); color: #d97706; border-color: rgba(245, 158, 11, 0.25); }
    .badge.danger { background: rgba(239, 68, 68, 0.1); color: #dc2626; border-color: rgba(239, 68, 68, 0.25); }
    .badge.outline { background: transparent; }

    /* Switch */
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

    /* Payment Card & Currency Pill */
    .payment-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 12px;
      font-weight: 500;
    }
    .card-brand-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 4px;
      border-radius: 3px;
      background: #1e293b;
      color: #ffffff;
      text-transform: uppercase;
    }

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
      font-family: inherit;
      font-size: 10.5px;
      font-weight: 600;
      color: var(--muted-foreground);
    }

    /* Avatar Cluster */
    .avatar-stack { display: flex; align-items: center; }
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 9999px;
      background: var(--secondary);
      border: 2px solid var(--surface);
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
      border: 1.5px solid var(--surface);
    }

    /* Message Status & Typing */
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

    /* Slider */
    .slider-track-wrap { width: 100%; display: flex; align-items: center; gap: 10px; }
    input[type="range"].zl-slider {
      flex: 1;
      height: 4px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    /* Progress */
    .progress-bar-wrap {
      width: 100%;
      height: 7px;
      background: var(--secondary);
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    /* ================= ZEROLIGHT MOLECULE PRIMITIVES ================= */
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
    .trend-pill.down { background: rgba(239, 68, 68, 0.12); color: #dc2626; }

    /* SVG Mini Sparkline & Area Chart */
    .sparkline-svg {
      width: 100%;
      height: 44px;
      overflow: visible;
    }

    /* Search Bar with Conjoined Pill */
    .search-bar-unified {
      display: flex;
      align-items: center;
      border: 1px solid var(--input-border);
      border-radius: var(--radius);
      background: var(--surface);
      height: var(--control-h);
      padding: 0 8px;
      gap: 8px;
      width: 100%;
    }
    .search-bar-unified input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 12.5px;
      color: var(--foreground);
    }

    /* Conjoined Field */
    .conjoined-field {
      display: flex;
      align-items: stretch;
      width: 100%;
    }
    .conjoined-prefix {
      padding: 0 10px;
      background: var(--secondary);
      border: 1px solid var(--input-border);
      border-right: none;
      border-radius: var(--radius) 0 0 var(--radius);
      font-size: 12px;
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
    }
    .conjoined-field input {
      flex: 1;
      border-radius: 0;
      border-right: none;
    }
    .conjoined-btn {
      border-radius: 0 var(--radius) var(--radius) 0;
      border-left: none;
    }

    /* Alert Banner */
    .alert-banner {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--secondary);
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12.5px;
    }
    .alert-banner.info { border-color: rgba(2, 132, 199, 0.25); background: rgba(2, 132, 199, 0.06); color: var(--foreground); }
    .alert-banner.warning { border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.08); }

    /* Dropdown Component */
    .ui-dd { position: relative; width: 100%; }
    .ui-dd-trigger {
      width: 100%;
      height: var(--control-h);
      padding: 0 11px;
      border-radius: var(--radius);
      border: 1px solid var(--input-border);
      background: var(--surface);
      color: var(--foreground);
      font-family: inherit;
      font-size: 12.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .ui-dd-menu {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-float);
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

    /* ================= ZEROLIGHT ORGANISM PRIMITIVES ================= */
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
      font-size: 11.5px;
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

    .tenant-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: var(--radius);
      background: var(--secondary);
      border: 1px solid var(--border);
      font-size: 12.5px;
      font-weight: 600;
      width: 100%;
      justify-content: space-between;
    }

    /* ================= TOKEN STUDIO INSPECTOR ================= */
    .inspector {
      height: 100%;
      background: var(--surface);
      border-left: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 20;
    }

    .inspector-head {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--surface);
    }

    .inspector-title { font-size: 13.5px; font-weight: 700; letter-spacing: -0.01em; }
    .inspector-sub { font-size: 11px; color: var(--muted-foreground); }

    .inspector-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .studio-sec {
      background: var(--surface);
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
      background: var(--surface);
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
    .swatch.active { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--ring); }

    .inspector-foot {
      padding: 12px 14px;
      border-top: 1px solid var(--border);
      background: var(--surface);
      display: flex;
      gap: 8px;
    }

    /* Toast Notification */
    .toast-box {
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
    .toast-box.show { transform: translateY(0); opacity: 1; }

    /* Modal Dialog */
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
      max-width: 480px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: var(--shadow-float);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  </style>
</head>
<body>

  <div class="app-shell">

    <!-- TOP NAVIGATION BAR -->
    <header class="app-header">
      <div class="brand-cluster">
        <div class="brand-mark" id="topLogoMark">Z</div>
        <div class="brand-text-stack">
          <div class="brand-title">
            <span id="topBrandName">ZeroLight OS</span>
            <span class="badge brand" style="font-size:10px;padding:1px 6px;">v2.6</span>
          </div>
          <div class="brand-subtitle">Visual Studio Dock • 6-Tier Spatial Architecture</div>
        </div>
      </div>

      <!-- District Navigation Bar -->
      <nav class="tier-nav">
        <button class="tier-btn active" onclick="filterDistrict('all', this)"><span class="tier-dot"></span>All Districts</button>
        <button class="tier-btn" onclick="filterDistrict('sec-foundations', this)"><span class="tier-dot"></span>0 Foundations</button>
        <button class="tier-btn" onclick="filterDistrict('sec-atoms', this)"><span class="tier-dot"></span>1 Atoms</button>
        <button class="tier-btn" onclick="filterDistrict('sec-molecules', this)"><span class="tier-dot"></span>2 Molecules</button>
        <button class="tier-btn" onclick="filterDistrict('sec-organisms', this)"><span class="tier-dot"></span>3 Organisms</button>
      </nav>

      <div class="header-actions">
        <div class="math-badge" data-tip="Live Mathematical Contrast Formula">
          <svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          <span id="yiqContrastLabel">YIQ: 940 (Passed)</span>
        </div>
        <button class="btn sm" onclick="togglePolarity()" data-tip="Toggle Light / Dark Polarity">
          <svg class="lucide" id="polarityIcon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
        <button class="btn sm primary" onclick="exportTokens()">
          <svg class="lucide" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>Export CSS</span>
        </button>
      </div>
    </header>

    <!-- MAIN BODY SPLIT -->
    <div class="app-body">

      <!-- MAIN CANVAS -->
      <main class="canvas" id="mainCanvas">
        <div class="canvas-inner">

          <!-- DISTRICT 0: FOUNDATIONS -->
          <section class="ds-district" id="sec-foundations">
            <div class="district-header">
              <div class="district-title-wrap">
                <span class="district-badge">District 0</span>
                <h2 class="district-title">Foundations &amp; Mathematical Physics</h2>
              </div>
              <span class="district-desc">YIQ Contrast Engine, Spring Dynamics &amp; Tokens</span>
            </div>

            <div class="grid-2">
              <!-- Mathematical Engine -->
              <div class="zl-card">
                <div class="zl-card-header">
                  <span class="zl-card-title">
                    <svg class="lucide" viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Mathematical Physics Invariants
                  </span>
                  <span class="badge success">Deterministic</span>
                </div>
                <div class="col" style="gap:10px;">
                  <div style="font-size:12.5px;color:var(--muted-foreground);">
                    Automatic Contrast: <strong style="color:var(--foreground);" id="formulaReadout">(R×299 + G×587 + B×114) / 1000 = 940 ≥ 128 (Clean High Contrast)</strong>
                  </div>
                  <div style="font-size:12.5px;color:var(--muted-foreground);">
                    Spring Equation: <strong style="color:var(--foreground);">F = -k·x - c·v (k = <span id="kVal">400</span>, c = <span id="cVal">28</span>)</strong>
                  </div>
                  <div class="row" style="margin-top:4px;">
                    <span class="kbd">⌘K</span>
                    <span style="font-size:12px;color:var(--muted-foreground);">Quick Palette Trigger</span>
                    <span class="kbd" style="margin-left:auto;">Tabular-Nums Active</span>
                  </div>
                </div>
              </div>

              <!-- Brand Identity -->
              <div class="zl-card">
                <div class="zl-card-header">
                  <span class="zl-card-title">Brand Identity Lockups</span>
                  <span class="badge outline">Live Tokens</span>
                </div>
                <div class="grid-2">
                  <div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius);display:flex;align-items:center;gap:10px;">
                    <div class="brand-mark" style="width:34px;height:34px;font-size:14px;" id="dispMark1">Z</div>
                    <div>
                      <div style="font-weight:700;font-size:13.5px;" id="dispName1">ZeroLight OS</div>
                      <div style="font-size:11px;color:var(--muted-foreground);">Core Lockup</div>
                    </div>
                  </div>
                  <div style="padding:12px;border:1px solid var(--primary);border-radius:var(--radius);background:var(--primary);color:var(--primary-foreground);display:flex;align-items:center;gap:10px;">
                    <div style="width:34px;height:34px;border-radius:calc(var(--radius)*0.75);background:var(--primary-foreground);color:var(--primary);display:grid;place-items:center;font-weight:700;font-size:14px;" id="dispMark2">Z</div>
                    <div>
                      <div style="font-weight:700;font-size:13.5px;" id="dispName2">ZeroLight OS</div>
                      <div style="font-size:11px;opacity:0.8;">Inverted Hero</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Color Palette Matrix -->
            <div class="zl-card">
              <div class="zl-card-header">
                <span class="zl-card-title">Dual-Accent Semantic Color Swatches</span>
                <span style="font-size:11.5px;color:var(--muted-foreground);">Click to copy hex</span>
              </div>
              <div class="grid-4">
                <div class="col" style="padding:10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;" onclick="copyHex('#0f172a')" data-tip="Copy Hex">
                  <div style="height:38px;border-radius:6px;background:var(--primary);margin-bottom:6px;"></div>
                  <span style="font-size:12px;font-weight:600;">Primary Brand</span>
                  <span class="tabular-nums" style="font-size:11px;color:var(--muted-foreground);" id="hexPrimaryLabel">#0F172A</span>
                </div>
                <div class="col" style="padding:10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;" onclick="copyHex('#0284c7')" data-tip="Copy Hex">
                  <div style="height:38px;border-radius:6px;background:var(--chart-primary);margin-bottom:6px;"></div>
                  <span style="font-size:12px;font-weight:600;">Chart Primary</span>
                  <span class="tabular-nums" style="font-size:11px;color:var(--muted-foreground);">#0284C7</span>
                </div>
                <div class="col" style="padding:10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;" onclick="copyHex('#0d9488')" data-tip="Copy Hex">
                  <div style="height:38px;border-radius:6px;background:var(--chart-secondary);margin-bottom:6px;"></div>
                  <span style="font-size:12px;font-weight:600;">Chart Secondary</span>
                  <span class="tabular-nums" style="font-size:11px;color:var(--muted-foreground);">#0D9488</span>
                </div>
                <div class="col" style="padding:10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;" onclick="copyHex('#10b981')" data-tip="Copy Hex">
                  <div style="height:38px;border-radius:6px;background:var(--success);margin-bottom:6px;"></div>
                  <span style="font-size:12px;font-weight:600;">Operational Success</span>
                  <span class="tabular-nums" style="font-size:11px;color:var(--muted-foreground);">#10B981</span>
                </div>
              </div>
            </div>
          </section>

          <!-- DISTRICT 1: ATOMS -->
          <section class="ds-district" id="sec-atoms">
            <div class="district-header">
              <div class="district-title-wrap">
                <span class="district-badge">District 1</span>
                <h2 class="district-title">Atoms (Zero Domain Logic Primitives)</h2>
              </div>
              <span class="district-desc">43 Foundational Controls bound strictly to tokens</span>
            </div>

            <div class="comp-grid" id="atomsGrid">
              <!-- Handcrafted ZeroLight Primitives populated via JS -->
            </div>
          </section>

          <!-- DISTRICT 2: MOLECULES -->
          <section class="ds-district" id="sec-molecules">
            <div class="district-header">
              <div class="district-title-wrap">
                <span class="district-badge">District 2</span>
                <h2 class="district-title">Molecules (Composite SaaS Patterns)</h2>
              </div>
              <span class="district-desc">45 Controls: StatCards, Area Charts, Geo Maps &amp; Pickers</span>
            </div>

            <div class="comp-grid" id="moleculesGrid">
              <!-- Handcrafted ZeroLight Molecules populated via JS -->
            </div>
          </section>

          <!-- DISTRICT 3: ORGANISMS -->
          <section class="ds-district" id="sec-organisms">
            <div class="district-header">
              <div class="district-title-wrap">
                <span class="district-badge">District 3</span>
                <h2 class="district-title">Organisms (Enterprise SaaS Modules)</h2>
              </div>
              <span class="district-desc">18 Modules: DataTable, CommandPalette, TenantKit &amp; Billing</span>
            </div>

            <div class="grid-2">
              <!-- DataTable Preview -->
              <div class="zl-card">
                <div class="zl-card-header">
                  <span class="zl-card-title">DataTable (Virtual Column Grid)</span>
                  <div class="row">
                    <span class="badge outline">TSV Export</span>
                    <button class="btn sm" onclick="showToast('Exported 3 rows as TSV')">Export</button>
                  </div>
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

              <!-- TenantKit & Billing Module -->
              <div class="zl-card">
                <div class="zl-card-header">
                  <span class="zl-card-title">TenantKit &amp; Stripe Billing Tier</span>
                  <span class="badge brand">Pro Annual</span>
                </div>
                <div class="col" style="gap:12px;">
                  <div class="tenant-badge">
                    <div class="row">
                      <div class="brand-mark" style="width:24px;height:24px;font-size:11px;">Z</div>
                      <span>ZeroLight Enterprise Workspace</span>
                    </div>
                    <span class="badge success">Primary Org</span>
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
                  <div class="row" style="justify-content:space-between;">
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

      <!-- TOKEN STUDIO INSPECTOR (RIGHT ASIDE) -->
      <aside class="inspector">
        <div class="inspector-head">
          <div>
            <div class="inspector-title">ZeroLight Token Studio</div>
            <div class="inspector-sub">Runtime Mathematical Tuning</div>
          </div>
          <button class="btn sm ghost icon-only" onclick="resetStudioTokens()" data-tip="Reset All Defaults">
            <svg class="lucide" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>

        <div class="inspector-scroll">

          <!-- 1. Polarity & Brand Identity -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>1. Polarity &amp; Brand Identity</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Brand Name</label>
                <input type="text" class="input" id="inBrandName" value="ZeroLight OS" oninput="updateBrandName(this.value)" />
              </div>
              <div class="t-field">
                <label class="t-label">Logo Monogram</label>
                <div class="seg-ctrl c-5">
                  <button class="seg-item active" onclick="setMonogram('Z', this)">Z</button>
                  <button class="seg-item" onclick="setMonogram('ZL', this)">ZL</button>
                  <button class="seg-item" onclick="setMonogram('◆', this)">◆</button>
                  <button class="seg-item" onclick="setMonogram('▲', this)">▲</button>
                  <button class="seg-item" onclick="setMonogram('⚡', this)">⚡</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Primary Brand Hue <span class="t-readout" id="readoutPrimary">#0F172A</span></label>
                <div class="swatch-row">
                  <button class="swatch active" style="background:#0f172a" onclick="setPrimaryColor('#0f172a', this)" data-tip="Obsidian"></button>
                  <button class="swatch" style="background:#0284c7" onclick="setPrimaryColor('#0284c7', this)" data-tip="Sky"></button>
                  <button class="swatch" style="background:#0d9488" onclick="setPrimaryColor('#0d9488', this)" data-tip="Teal"></button>
                  <button class="swatch" style="background:#6366f1" onclick="setPrimaryColor('#6366f1', this)" data-tip="Indigo"></button>
                  <button class="swatch" style="background:#e11d48" onclick="setPrimaryColor('#e11d48', this)" data-tip="Rose"></button>
                  <button class="swatch" style="background:#ea580c" onclick="setPrimaryColor('#ea580c', this)" data-tip="Orange"></button>
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
                <label class="t-label">Corner Radius <span class="t-readout" id="readoutRadius">8px</span></label>
                <div class="seg-ctrl c-5">
                  <button class="seg-item" onclick="setRadius('0px', '0px', this)">0 Sharp</button>
                  <button class="seg-item" onclick="setRadius('4px', '6px', this)">4px</button>
                  <button class="seg-item active" onclick="setRadius('8px', '12px', this)">8px</button>
                  <button class="seg-item" onclick="setRadius('12px', '16px', this)">12px</button>
                  <button class="seg-item" onclick="setRadius('9999px', '18px', this)">Pill</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Control Height</label>
                <div class="seg-ctrl c-3">
                  <button class="seg-item" onclick="setControlHeight('32px', this)">32 Compact</button>
                  <button class="seg-item active" onclick="setControlHeight('36px', this)">36 Standard</button>
                  <button class="seg-item" onclick="setControlHeight('42px', this)">42 Spacious</button>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Hairline Border Width</label>
                <div class="seg-ctrl">
                  <button class="seg-item" onclick="setBorderWidth('0px', this)">0px</button>
                  <button class="seg-item active" onclick="setBorderWidth('1px', this)">1px</button>
                  <button class="seg-item" onclick="setBorderWidth('1.5px', this)">1.5px</button>
                  <button class="seg-item" onclick="setBorderWidth('2px', this)">2px</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Typography & Google Fonts -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>3. Typography &amp; Dynamic Fonts</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Font Family</label>
                <div class="ui-dd" id="fontPickerDd">
                  <button type="button" class="ui-dd-trigger" onclick="toggleDd('fontPickerDd')">
                    <span id="fontLabel">Plus Jakarta Sans</span>
                    <svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div class="ui-dd-menu">
                    <button class="ui-dd-item active" onclick="setFontFamily('Plus Jakarta Sans', this)">Plus Jakarta Sans (Default)</button>
                    <button class="ui-dd-item" onclick="setFontFamily('Inter', this)">Inter (Precision)</button>
                    <button class="ui-dd-item" onclick="setFontFamily('Space Grotesk', this)">Space Grotesk (Tech)</button>
                    <button class="ui-dd-item" onclick="setFontFamily('DM Sans', this)">DM Sans (Editorial)</button>
                    <button class="ui-dd-item" onclick="setFontFamily('Outfit', this)">Outfit (Clean Geometric)</button>
                  </div>
                </div>
              </div>
              <div class="t-field">
                <label class="t-label">Font Size Base <span class="t-readout" id="readoutFontSize">13.5px</span></label>
                <input type="range" class="zl-slider" min="12" max="16" step="0.5" value="13.5" oninput="setFontSize(this.value)" />
              </div>
            </div>
          </div>

          <!-- 4. Spring Motion Physics Engine -->
          <div class="studio-sec open">
            <button type="button" class="studio-sec-btn" onclick="toggleSec(this)">
              <span>4. Spring Motion Physics Engine</span>
              <span class="studio-chevron"><svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="studio-sec-body">
              <div class="t-field">
                <label class="t-label">Motion Preset</label>
                <div class="seg-ctrl">
                  <button class="seg-item" onclick="setSpring(700, 45, 'Instant', this)">Instant</button>
                  <button class="seg-item" onclick="setSpring(520, 32, 'Snappy', this)">Snappy</button>
                  <button class="seg-item active" onclick="setSpring(400, 28, 'Damped', this)">Damped</button>
                  <button class="seg-item" onclick="setSpring(280, 30, 'Gentle', this)">Gentle</button>
                </div>
              </div>
              <button class="btn sm" style="width:100%;margin-top:4px;" onclick="testSpringRecoil()">
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
          <button class="btn sm" style="flex:1;" onclick="copyCliCommand()">
            <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>CLI Snippet</span>
          </button>
          <button class="btn sm primary" style="flex:1;" onclick="exportTokens()">
            <svg class="lucide" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Export Code</span>
          </button>
        </div>
      </aside>

    </div>
  </div>

  <!-- TOAST BANNER -->
  <div class="toast-box" id="globalToast">
    <svg class="lucide" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
    <span id="toastMsg">Action completed successfully</span>
  </div>

  <!-- EXPORT MODAL -->
  <div class="modal-overlay" id="exportModal">
    <div class="modal-card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h3 style="font-size:15px;font-weight:700;">ZeroLight CSS Tokens &amp; CLI Export</h3>
        <button class="btn sm ghost icon-only" onclick="closeExportModal()">
          <svg class="lucide" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <p style="font-size:12px;color:var(--muted-foreground);">
        Add components on-demand using ZeroLight Plug &amp; Play Registry:
      </p>
      <div style="background:var(--secondary);padding:10px;border-radius:6px;border:1px solid var(--border);font-size:12px;display:flex;align-items:center;justify-content:space-between;">
        <code id="cliSnippetCode">npx zerolight add button stat-card area-chart datatable</code>
        <button class="btn sm" onclick="copyHex('npx zerolight add button stat-card area-chart datatable')">Copy</button>
      </div>
      <textarea id="cssExportArea" readonly style="width:100%;height:140px;background:var(--secondary);border:1px solid var(--border);border-radius:6px;padding:10px;font-family:monospace;font-size:11.5px;color:var(--foreground);outline:none;resize:none;"></textarea>
      <div class="row" style="justify-content:flex-end;">
        <button class="btn sm" onclick="closeExportModal()">Close</button>
        <button class="btn sm primary" onclick="copyHex(document.getElementById('cssExportArea').value)">Copy CSS Variables</button>
      </div>
    </div>
  </div>

  <script>
    const ATOMS = [
      {
        name: "Button Hierarchy",
        html: \`<div class="row">
          <button class="btn primary" onclick="showToast('Primary Action (YIQ Contrast Active)')">Primary</button>
          <button class="btn secondary" onclick="showToast('Secondary Action')">Secondary</button>
          <button class="btn outline" onclick="showToast('Outline Action')">Outline</button>
          <button class="btn ghost" onclick="showToast('Ghost Action')">Ghost</button>
          <button class="btn danger sm" onclick="showToast('Danger Action')">Delete</button>
        </div>\`
      },
      {
        name: "IconButton & Tooltips",
        html: \`<div class="row">
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
        </div>\`
      },
      {
        name: "Badge Matrix (Categorical & Dotless)",
        html: \`<div class="row">
          <span class="badge brand">Primary</span>
          <span class="badge success">Operational</span>
          <span class="badge warning">Warning</span>
          <span class="badge danger">Failed</span>
          <span class="badge outline">Outline</span>
        </div>\`
      },
      {
        name: "Switch & Checkbox (Tactile Spring)",
        html: \`<div class="row" style="gap:14px;">
          <label class="row" style="cursor:pointer;">
            <div class="switch on" onclick="this.classList.toggle('on');showToast('Auto-Sync Toggled')"></div>
            <span style="font-size:12.5px;font-weight:500;">Live Sync</span>
          </label>
          <label class="row" style="cursor:pointer;">
            <input type="checkbox" checked style="accent-color:var(--primary);width:15px;height:15px;" onchange="showToast(this.checked ? 'Checked' : 'Unchecked')" />
            <span style="font-size:12.5px;">Require MFA</span>
          </label>
        </div>\`
      },
      {
        name: "CurrencyPill & PaymentCard",
        html: \`<div class="row">
          <div class="currency-pill"><span>$</span><strong class="tabular-nums">USD</strong></div>
          <div class="currency-pill"><span>€</span><strong class="tabular-nums">EUR</strong></div>
          <div class="payment-chip">
            <span class="card-brand-badge">VISA</span>
            <span class="tabular-nums">•••• 8821</span>
            <span class="badge success" style="font-size:9.5px;padding:1px 4px;">Verified</span>
          </div>
        </div>\`
      },
      {
        name: "Kbd Tokens & Shortcuts",
        html: \`<div class="row">
          <span class="kbd">⌘K</span><span style="font-size:12px;color:var(--muted-foreground)">Search</span>
          <span class="kbd">Shift+P</span><span style="font-size:12px;color:var(--muted-foreground)">Palette</span>
          <span class="kbd">Esc</span><span style="font-size:12px;color:var(--muted-foreground)">Dismiss</span>
        </div>\`
      },
      {
        name: "Avatar Stack & Status Dot",
        html: \`<div class="row">
          <div class="avatar-stack">
            <div class="avatar lead">ZL<span class="avatar-dot"></span></div>
            <div class="avatar">JR</div>
            <div class="avatar">AK</div>
            <div class="avatar">+4</div>
          </div>
          <span style="font-size:12px;color:var(--muted-foreground);">Core Engineering</span>
        </div>\`
      },
      {
        name: "TypingIndicator & MessageStatus",
        html: \`<div class="row" style="gap:16px;">
          <div class="row">
            <span style="font-size:12px;color:var(--muted-foreground)">Agent typing:</span>
            <div class="typing-dots"><span></span><span></span><span></span></div>
          </div>
          <div class="row">
            <span style="font-size:12px;color:var(--muted-foreground)">Delivered:</span>
            <svg class="lucide" style="color:var(--chart-primary)" viewBox="0 0 24 24"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          </div>
        </div>\`
      },
      {
        name: "Slider & Dynamic Progress",
        html: \`<div class="col" style="gap:8px;">
          <div class="slider-track-wrap">
            <input type="range" class="zl-slider" min="0" max="100" value="72" oninput="document.getElementById('sliderVal1').textContent = this.value + '%'" />
            <span class="tabular-nums" style="font-size:11.5px;font-weight:600;" id="sliderVal1">72%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:72%;"></div>
          </div>
        </div>\`
      }
    ];

    const MOLECULES = [
      {
        name: "StatCard with TrendDelta (KPI Header)",
        html: \`<div class="stat-card-widget">
          <div class="stat-header">
            <span class="stat-label">Monthly Recurring Revenue</span>
            <span class="trend-pill up">
              <svg class="lucide" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
              <span class="tabular-nums">+14.8%</span>
            </span>
          </div>
          <div class="stat-value tabular-nums">$148,250.00</div>
          <div style="font-size:11.5px;color:var(--muted-foreground);">vs. $129,100 last 30d • 99.99% retention</div>
        </div>\`
      },
      {
        name: "Mini AreaChart (D3-Style SVG Telemetry)",
        html: \`<div class="col" style="gap:4px;">
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
        </div>\`
      },
      {
        name: "SearchBar with Conjoined ⌘K Pill",
        html: \`<div class="search-bar-unified">
          <svg class="lucide" style="color:var(--muted-foreground)" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search tokens, components, routes..." />
          <span class="kbd">⌘K</span>
        </div>\`
      },
      {
        name: "ConjoinedField (API Endpoint URL Builder)",
        html: \`<div class="conjoined-field">
          <span class="conjoined-prefix">https://api.</span>
          <input class="input" value="zerolight.dev/v1/auth" />
          <button class="btn sm conjoined-btn" data-tip="Copy Endpoint" onclick="showToast('Endpoint Copied')">
            <svg class="lucide" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
        </div>\`
      },
      {
        name: "Operational AlertBanner",
        html: \`<div class="alert-banner info">
          <svg class="lucide" style="color:var(--chart-primary);margin-top:2px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div style="flex:1;">
            <strong>ZeroLight Plug &amp; Play Mode:</strong> Zero monolithic dependencies. Primitives export as standalone JSON payloads.
          </div>
        </div>\`
      },
      {
        name: "SplitButton (Primary CTA + Context Menu)",
        html: \`<div class="row">
          <div style="display:inline-flex;">
            <button class="btn primary" style="border-top-right-radius:0;border-bottom-right-radius:0;" onclick="showToast('Deployment started...')">Deploy Production</button>
            <button class="btn primary" style="border-top-left-radius:0;border-bottom-left-radius:0;padding:0 8px;border-left:1px solid rgba(255,255,255,0.2);" onclick="showToast('Deployment presets opened')">
              <svg class="lucide" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>\`
      }
    ];

    function renderGrid(containerId, list) {
      document.getElementById(containerId).innerHTML = list.map(item => \`
        <div class="comp-slot">
          <span class="comp-slot-title">
            <span>\${item.name}</span>
            <span class="badge outline" style="font-size:9.5px;padding:1px 4px;">ZeroLight</span>
          </span>
          <div class="comp-slot-card">\${item.html}</div>
        </div>
      \`).join('');
    }

    renderGrid('atomsGrid', ATOMS);
    renderGrid('moleculesGrid', MOLECULES);

    // Filter District Navigation
    function filterDistrict(targetId, btn) {
      document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetId === 'all') {
        document.querySelectorAll('.ds-district').forEach(sec => sec.style.display = 'flex');
      } else {
        document.querySelectorAll('.ds-district').forEach(sec => {
          sec.style.display = (sec.id === targetId) ? 'flex' : 'none';
        });
      }
    }

    // Toast Manager
    let toastTimeout;
    function showToast(msg) {
      const toast = document.getElementById('globalToast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    function copyHex(text) {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard: ' + text);
    }

    // Token Studio Handlers
    function toggleSec(btn) {
      btn.parentElement.classList.toggle('open');
    }

    function toggleDd(id) {
      document.getElementById(id).classList.toggle('open');
    }

    function updateBrandName(name) {
      document.getElementById('topBrandName').textContent = name;
      document.getElementById('dispName1').textContent = name;
      document.getElementById('dispName2').textContent = name;
    }

    function setMonogram(m, btn) {
      btn.parentElement.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('topLogoMark').textContent = m;
      document.getElementById('dispMark1').textContent = m;
      document.getElementById('dispMark2').textContent = m;
      showToast('Logo Monogram: ' + m);
    }

    function setPrimaryColor(hex, btn) {
      btn.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--primary', hex);
      document.documentElement.style.setProperty('--ring', hex);
      document.getElementById('readoutPrimary').textContent = hex.toUpperCase();
      document.getElementById('hexPrimaryLabel').textContent = hex.toUpperCase();
      
      // Calculate YIQ
      const r = parseInt(hex.slice(1,3), 16) || 15;
      const g = parseInt(hex.slice(3,5), 16) || 23;
      const b = parseInt(hex.slice(5,7), 16) || 42;
      const yiq = Math.round((r * 299 + g * 587 + b * 114) / 1000);
      document.getElementById('formulaReadout').textContent = \`(R×\${r} + G×\${g} + B×\${b}) / 1000 = \${yiq} (\${yiq >= 128 ? 'Dark Ink Text' : 'White Ink Text'})\`;
      showToast('Primary Hue: ' + hex);
    }

    function setRadius(r, cardR, btn) {
      btn.parentElement.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--radius', r);
      document.documentElement.style.setProperty('--card-radius', cardR);
      document.getElementById('readoutRadius').textContent = r;
      showToast('Corner Geometry: ' + r);
    }

    function setControlHeight(h, btn) {
      btn.parentElement.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--control-h', h);
      showToast('Control Height: ' + h);
    }

    function setBorderWidth(w, btn) {
      btn.parentElement.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--border-w', w);
      showToast('Hairline Border: ' + w);
    }

    function setFontFamily(font, btn) {
      document.querySelectorAll('#fontPickerDd .ui-dd-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('fontLabel').textContent = font;
      document.documentElement.style.setProperty('--font-sans', \`'\${font}', -apple-system, BlinkMacSystemFont, sans-serif\`);
      document.documentElement.style.setProperty('--font-heading', \`'\${font}', -apple-system, BlinkMacSystemFont, sans-serif\`);
      document.getElementById('fontPickerDd').classList.remove('open');
      showToast('Typography Font: ' + font);
    }

    function setFontSize(val) {
      document.documentElement.style.setProperty('--font-size-base', val + 'px');
      document.getElementById('readoutFontSize').textContent = val + 'px';
    }

    function setSpring(k, d, name, btn) {
      btn.parentElement.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('kVal').textContent = k;
      document.getElementById('cVal').textContent = d;
      showToast('Motion Physics: ' + name + ' (' + k + '/' + d + ')');
    }

    function testSpringRecoil() {
      const puck = document.getElementById('springPuck');
      puck.style.transform = 'translateX(180px)';
      setTimeout(() => {
        puck.style.transform = 'translateX(0px)';
      }, 350);
      showToast('Testing Spring Recoil Dynamics...');
    }

    function togglePolarity() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      showToast(isDark ? 'Switched to Light Polarity' : 'Switched to Dark Polarity');
    }

    function resetStudioTokens() {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--radius');
      document.documentElement.style.removeProperty('--control-h');
      document.documentElement.style.removeProperty('--font-sans');
      document.documentElement.removeAttribute('data-theme');
      showToast('Reset to ZeroLight Default Invariants');
    }

    function exportTokens() {
      const css = \`:root {
  --zl-primary: \${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0f172a'};
  --zl-radius: \${getComputedStyle(document.documentElement).getPropertyValue('--radius').trim() || '8px'};
  --zl-control-h: \${getComputedStyle(document.documentElement).getPropertyValue('--control-h').trim() || '36px'};
  --zl-font-sans: \${getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim() || "'Plus Jakarta Sans', sans-serif"};
  --zl-border-w: \${getComputedStyle(document.documentElement).getPropertyValue('--border-w').trim() || '1px'};
  --zl-spring-stiffness: 400;
  --zl-spring-damping: 28;
}\`;
      document.getElementById('cssExportArea').value = css;
      document.getElementById('exportModal').classList.add('open');
    }

    function closeExportModal() {
      document.getElementById('exportModal').classList.remove('open');
    }

    function copyCliCommand() {
      copyHex('npx zerolight add button stat-card area-chart datatable');
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve(process.cwd(), 'dock-prototype.html'), htmlContent, 'utf8');
console.log('Successfully generated ZeroLight Visual Studio Dock in dock-prototype.html');
