#!/usr/bin/env python3
"""
generate-clean-visual-dock.py
Generates the complete, pristine single-file dock-prototype.html with:
- Clean minimal header (no search, no 5 tabs, no share link; title + 3 action buttons)
- Canvas Hero Brand Lockup
- Section 1: Foundation (6 full-width cards: Colors + 11-step ramp, Elevation/Blur, Icons, Logos, Spacing/Grids, Typography)
- Section 2: Components (All 27 interactive components)
- Right Sidebar: Floating Token Studio (5 accordions + reset + pinned footer)
- 100% ZeroLight token invariants & zero emojis
"""

import os

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Studio Dock — ZeroLight OS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link id="headingFontLink" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap">
  <link id="bodyFontLink" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>

  <style>
    /* ================= SYSTEM TOKENS & RESET ================= */
    :root {
      --background: #EEF0F4;
      --canvas-bg: #FFFFFF;
      --foreground: #09090B;
      --card: #FFFFFF;
      --card-foreground: #09090B;
      --card-subtle: #F8F9FA;
      --primary: #4F46E5;
      --primary-foreground: #FFFFFF;
      --secondary: #F1F5F9;
      --secondary-foreground: #0F172A;
      --muted: #64748B;
      --muted-foreground: #64748B;
      --border: #E2E8F0;
      --input: #E2E8F0;
      --ring: #4F46E5;
      
      /* Semantic Status Tokens */
      --success: #10B981;
      --success-foreground: #FFFFFF;
      --success-subtle: #ECFDF5;
      --warning: #F59E0B;
      --warning-foreground: #FFFFFF;
      --warning-subtle: #FFFBEB;
      --destructive: #EF4444;
      --destructive-foreground: #FFFFFF;
      --destructive-subtle: #FEF2F2;
      
      /* Geometric & Density Tokens */
      --radius: 0.5rem;
      --card-radius: 0.75rem;
      --control-h: 36px;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --base-font-size: 14px;
      --motion-speed: 160ms;
      --motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
      --icon-tint: currentColor;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--background);
      color: var(--foreground);
      font-family: var(--font-body);
      font-size: var(--base-font-size);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }

    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }

    /* ================= FLOATING OUTER SHELL ================= */
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
    }

    /* ================= CLEAN MINIMAL HEADER ================= */
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 28px;
      border-bottom: 1px solid var(--border);
      background: #FFFFFF;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .title-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .dock-main-title {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--foreground);
    }

    .dock-sub-title {
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* ================= BUTTON PRIMITIVES ================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      height: var(--control-h);
      padding: 0 14px;
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 500;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: #FFFFFF;
      color: var(--foreground);
      cursor: pointer;
      transition: all var(--motion-speed) var(--motion-ease);
      user-select: none;
      white-space: nowrap;
      text-decoration: none;
    }

    .btn:hover {
      background: var(--secondary);
      border-color: #CBD5E1;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn.primary {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--primary-foreground);
    }

    .btn.primary:hover {
      opacity: 0.92;
      border-color: var(--primary);
    }

    .btn.secondary {
      background: var(--secondary);
      border-color: var(--border);
      color: var(--secondary-foreground);
    }

    .btn.secondary:hover {
      background: #E2E8F0;
    }

    .btn.outline {
      background: transparent;
      border-color: var(--border);
      color: var(--foreground);
    }

    .btn.outline:hover {
      background: var(--card-subtle);
    }

    .btn.subtle {
      background: rgba(79, 70, 229, 0.08);
      border-color: transparent;
      color: var(--primary);
    }

    .btn.subtle:hover {
      background: rgba(79, 70, 229, 0.14);
    }

    .btn.destructive {
      background: var(--destructive);
      border-color: var(--destructive);
      color: var(--destructive-foreground);
    }

    .btn.destructive:hover {
      opacity: 0.92;
    }

    .btn.ghost {
      background: transparent;
      border-color: transparent;
      color: var(--muted);
    }

    .btn.ghost:hover {
      background: var(--secondary);
      color: var(--foreground);
    }

    .btn.sm {
      height: 30px;
      padding: 0 10px;
      font-size: 12px;
    }

    .btn.lg {
      height: 42px;
      padding: 0 18px;
      font-size: 14px;
    }

    /* ================= MAIN TWO-COLUMN WORKSPACE ================= */
    .app-workspace {
      display: grid;
      grid-template-columns: 1fr 364px;
      gap: 24px;
      padding: 24px 28px;
      align-items: start;
    }

    @media (max-width: 1024px) {
      .app-workspace {
        grid-template-columns: 1fr;
      }
    }

    /* ================= LEFT CANVAS ================= */
    .canvas-flow {
      display: flex;
      flex-direction: column;
      gap: 40px;
      min-width: 0;
    }

    /* HERO BRAND LOCKUP */
    .canvas-hero {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: var(--card-radius);
      border: 1px solid var(--border);
      background: linear-gradient(180deg, #FFFFFF 0%, var(--card-subtle) 100%);
    }

    .hero-mark-tile {
      width: 48px;
      height: 48px;
      border-radius: calc(var(--radius) + 2px);
      background: var(--primary);
      color: var(--primary-foreground);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      flex-shrink: 0;
      overflow: hidden;
    }

    .hero-mark-tile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-title-group h2 {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--foreground);
    }

    .hero-title-group p {
      font-size: 13px;
      color: var(--muted);
    }

    /* SECTION CONTAINERS */
    .spec-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-headline {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
    }

    .section-headline h3 {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--foreground);
    }

    .section-headline span {
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    /* FOUNDATION CARD GRID (6 Full Width Cards) */
    .foundations-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .foundation-card {
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      background: var(--card);
      padding: 18px 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .foundation-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .foundation-card-title {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 600;
      color: var(--foreground);
    }

    .foundation-card-tag {
      font-size: 11px;
      color: var(--muted);
      font-weight: 500;
    }

    /* COLOR SWATCHES & TONAL RAMP */
    .color-swatch-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
    }

    .swatch-item {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      cursor: pointer;
      background: #FFFFFF;
      transition: transform var(--motion-speed) var(--motion-ease);
    }

    .swatch-item:hover {
      transform: translateY(-2px);
    }

    .swatch-color-box {
      height: 48px;
      width: 100%;
    }

    .swatch-meta {
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .swatch-meta-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--foreground);
    }

    .swatch-meta-hex {
      font-size: 11px;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }

    .tonal-ramp-container {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tonal-ramp-bar {
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      height: 36px;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border);
    }

    .ramp-stop {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      transition: opacity 120ms;
    }

    .ramp-stop:hover {
      opacity: 0.85;
    }

    .contrast-score-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 6px;
      font-size: 11px;
      color: var(--muted);
    }

    .score-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--success-subtle);
      color: #065F46;
      font-weight: 600;
    }

    /* ELEVATION & BLURS */
    .elevation-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .elevation-box {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;
    }

    .elevation-box.subtle {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .elevation-box.floating {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }

    .elevation-box.glass {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
    }

    .elevation-box span {
      font-size: 12px;
      font-weight: 600;
      color: var(--foreground);
    }

    .elevation-box small {
      font-size: 10px;
      color: var(--muted);
    }

    /* ICONS GALLERY */
    .icons-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
      gap: 10px;
    }

    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 6px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #FFFFFF;
      cursor: pointer;
      transition: all var(--motion-speed) var(--motion-ease);
      color: var(--icon-tint);
    }

    .icon-tile:hover {
      background: var(--secondary);
      border-color: var(--primary);
    }

    .icon-tile span {
      font-size: 10px;
      color: var(--muted);
      font-weight: 500;
    }

    /* LOGO LOCKUPS */
    .logos-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }

    .logo-preview-card {
      padding: 16px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-preview-card.standard {
      background: #FFFFFF;
    }

    .logo-preview-card.inverted {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--primary-foreground);
    }

    .logo-preview-card.inverted .logo-preview-title {
      color: var(--primary-foreground);
    }

    .logo-preview-card.inverted .logo-preview-sub {
      color: rgba(255, 255, 255, 0.8);
    }

    .logo-preview-mark {
      width: 38px;
      height: 38px;
      border-radius: calc(var(--radius) - 1px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 16px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .logo-preview-mark img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .logo-preview-card.standard .logo-preview-mark {
      background: var(--secondary);
      color: var(--foreground);
      border: 1px solid var(--border);
    }

    .logo-preview-card.inverted .logo-preview-mark {
      background: rgba(255, 255, 255, 0.2);
      color: var(--primary-foreground);
    }

    .logo-preview-title {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 700;
      color: var(--foreground);
    }

    .logo-preview-sub {
      font-size: 11px;
      color: var(--muted);
    }

    /* SPACING & GRIDS */
    .spacing-scale-row {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      padding: 10px 0;
    }

    .spacing-bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .spacing-bar {
      background: var(--primary);
      border-radius: 2px;
      opacity: 0.85;
    }

    .spacing-bar-label {
      font-size: 10px;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }

    .grid-preview-12 {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 6px;
      margin-top: 10px;
    }

    .grid-col-tile {
      height: 24px;
      background: var(--card-subtle);
      border: 1px dashed var(--border);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: var(--muted);
    }

    /* TYPOGRAPHY SCALE */
    .type-scale-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .type-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 8px;
      border-bottom: 1px solid #F1F5F9;
    }

    .type-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .type-meta {
      font-size: 11px;
      color: var(--muted);
      font-family: var(--font-body);
      min-width: 90px;
    }

    /* ================= 27 COMPONENTS GRID ================= */
    .components-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    @media (max-width: 768px) {
      .components-grid {
        grid-template-columns: 1fr;
      }
    }

    .comp-item-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .comp-item-title {
      font-family: var(--font-heading);
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }

    .comp-card {
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
      background: var(--card);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 120px;
      justify-content: center;
    }

    /* Individual Component Stying */
    /* 1. Accordion */
    .accordion-item {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .accordion-header {
      padding: 10px 14px;
      background: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .accordion-body {
      padding: 10px 14px;
      background: var(--card-subtle);
      font-size: 12px;
      color: var(--muted);
      border-top: 1px solid var(--border);
      display: none;
    }

    .accordion-item.open .accordion-body {
      display: block;
    }

    /* 2. Alert */
    .alert-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: var(--radius);
      border: 1px solid #A7F3D0;
      background: var(--success-subtle);
      color: #065F46;
      font-size: 12px;
    }

    /* 3. Avatar */
    .avatar-cluster {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-img {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      object-fit: cover;
      border: 2px solid #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .avatar-monogram {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: var(--secondary);
      color: var(--secondary-foreground);
      font-weight: 600;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* 4. Badge */
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge.primary { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
    .badge.success { background: var(--success-subtle); color: #065F46; }
    .badge.warning { background: var(--warning-subtle); color: #92400E; }
    .badge.destructive { background: var(--destructive-subtle); color: #991B1B; }

    /* 5. Breadcrumb */
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--muted);
    }

    .breadcrumbs span.active {
      color: var(--foreground);
      font-weight: 600;
    }

    /* 7. Calendar */
    .calendar-mini {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      text-align: center;
    }

    .cal-day-name {
      font-size: 10px;
      color: var(--muted);
      font-weight: 600;
      padding-bottom: 4px;
    }

    .cal-day {
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
      font-size: 11px;
      cursor: pointer;
      user-select: none;
    }

    .cal-day:hover {
      background: var(--secondary);
    }

    .cal-day.active {
      background: var(--primary);
      color: var(--primary-foreground);
      font-weight: 600;
    }

    /* 8. Divider */
    .divider-labeled {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .divider-labeled::before, .divider-labeled::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* 9. Dropdown */
    .custom-select-wrap {
      position: relative;
    }

    .custom-select-trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--control-h);
      padding: 0 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #FFFFFF;
      font-size: 13px;
      cursor: pointer;
    }

    .custom-select-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      z-index: 20;
      display: none;
      overflow: hidden;
    }

    .custom-select-menu.open {
      display: block;
    }

    .select-item {
      padding: 8px 12px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .select-item:hover {
      background: var(--secondary);
    }

    .select-item.selected {
      background: rgba(79, 70, 229, 0.06);
      color: var(--primary);
      font-weight: 600;
    }

    /* 10. Empty State */
    .empty-state-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 12px;
      gap: 6px;
    }

    /* 11. Input */
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper iconify-icon {
      position: absolute;
      left: 10px;
      color: var(--muted);
      pointer-events: none;
    }

    .input-field {
      width: 100%;
      height: var(--control-h);
      padding: 0 12px 0 34px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--foreground);
      background: #FFFFFF;
      outline: none;
      transition: border-color var(--motion-speed);
    }

    .input-field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 1px var(--primary);
    }

    /* 12. KPI Metric Card */
    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .kpi-label {
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }

    .kpi-value {
      font-family: var(--font-heading);
      font-size: 24px;
      font-weight: 700;
      color: var(--foreground);
      font-variant-numeric: tabular-nums;
    }

    /* 13. Mockup */
    .browser-mockup {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      background: #FFFFFF;
    }

    .browser-chrome {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--card-subtle);
      border-bottom: 1px solid var(--border);
    }

    .chrome-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
    }

    .chrome-url {
      flex: 1;
      height: 18px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 3px;
      font-size: 9px;
      color: var(--muted);
      display: flex;
      align-items: center;
      padding: 0 6px;
    }

    .mockup-img {
      width: 100%;
      height: 90px;
      object-fit: cover;
      display: block;
    }

    /* 15. Pagination */
    .pagination-bar {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .page-num {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: #FFFFFF;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }

    .page-num.active {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--primary-foreground);
    }

    /* 16. Skeleton / Placeholder */
    .skeleton-box {
      height: 14px;
      background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
      background-size: 200% 100%;
      animation: skeletonPulse 1.5s infinite;
      border-radius: var(--radius);
    }

    @keyframes skeletonPulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* 17. Popover */
    .popover-box {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px;
      background: #FFFFFF;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* 18. Progress & Slider */
    .slider-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .custom-range {
      width: 100%;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .progress-track {
      height: 8px;
      background: var(--secondary);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 999px;
      width: 65%;
      transition: width var(--motion-speed) var(--motion-ease);
    }

    /* 19. Rating */
    .rating-row {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }

    .star-btn {
      color: #CBD5E1;
      font-size: 18px;
      transition: color 120ms;
    }

    .star-btn.active {
      color: #F59E0B;
    }

    /* 21. Tabs */
    .tab-strip {
      display: flex;
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 3px;
      gap: 2px;
    }

    .tab-btn {
      flex: 1;
      text-align: center;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: calc(var(--radius) - 2px);
      cursor: pointer;
      color: var(--muted);
      user-select: none;
      transition: all var(--motion-speed) var(--motion-ease);
    }

    .tab-btn.active {
      background: #FFFFFF;
      color: var(--foreground);
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* 22. Tag */
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      background: var(--secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 11px;
      font-weight: 500;
      color: var(--foreground);
    }

    .tag-chip iconify-icon {
      cursor: pointer;
      color: var(--muted);
    }

    .tag-chip iconify-icon:hover {
      color: var(--foreground);
    }

    /* 23. Textarea */
    .textarea-field {
      width: 100%;
      height: 70px;
      padding: 8px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: var(--font-body);
      font-size: 12px;
      resize: none;
      outline: none;
    }

    .textarea-field:focus {
      border-color: var(--primary);
    }

    /* 25. Toggle, Radio & Checkbox */
    .toggles-cluster {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .switch-ui {
      width: 40px;
      height: 22px;
      background: var(--secondary);
      border: 1px solid var(--border);
      border-radius: 999px;
      position: relative;
      cursor: pointer;
      transition: background var(--motion-speed);
    }

    .switch-ui::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #FFFFFF;
      border-radius: 999px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      transition: transform var(--motion-speed) var(--motion-ease);
    }

    .switch-ui.checked {
      background: var(--primary);
      border-color: var(--primary);
    }

    .switch-ui.checked::after {
      transform: translateX(18px);
    }

    .checkbox-ui {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      cursor: pointer;
    }

    .custom-check-box {
      width: 18px;
      height: 18px;
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 12px;
    }

    .custom-check-box.checked {
      background: var(--primary);
      border-color: var(--primary);
    }

    /* 27. Data Table */
    .table-container {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      width: 100%;
    }

    .saas-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .saas-table th {
      background: var(--card-subtle);
      padding: 8px 12px;
      text-align: left;
      font-weight: 600;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }

    .saas-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      color: var(--foreground);
    }

    .saas-table tr:last-child td {
      border-bottom: none;
    }

    /* ================= RIGHT SIDEBAR: TOKEN STUDIO ================= */
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
    }

    .studio-acc-item {
      border-bottom: 1px solid var(--border);
    }

    .studio-acc-item:last-child {
      border-bottom: none;
    }

    .studio-acc-btn {
      width: 100%;
      padding: 12px 18px;
      background: #FFFFFF;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 600;
      color: var(--foreground);
      cursor: pointer;
      text-align: left;
    }

    .studio-acc-btn:hover {
      background: var(--card-subtle);
    }

    .studio-acc-content {
      padding: 14px 18px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .studio-acc-item:not(.open) .studio-acc-content {
      display: none;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .text-input-field {
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: var(--font-body);
      font-size: 12px;
      color: var(--foreground);
      outline: none;
    }

    .text-input-field:focus {
      border-color: var(--primary);
    }

    .color-preset-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .color-dot-preset {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 120ms;
    }

    .color-dot-preset:hover {
      transform: scale(1.1);
    }

    .color-dot-preset.selected {
      border-color: var(--foreground);
    }

    .native-color-picker-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-input-native {
      width: 28px;
      height: 28px;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      background: transparent;
    }

    .pills-selector {
      display: flex;
      gap: 4px;
    }

    .pill-opt {
      flex: 1;
      padding: 6px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      cursor: pointer;
      background: #FFFFFF;
      color: var(--muted);
    }

    .pill-opt.selected {
      background: var(--secondary);
      border-color: #CBD5E1;
      color: var(--foreground);
      font-weight: 600;
    }

    .studio-footer {
      padding: 12px 18px;
      border-top: 1px solid var(--border);
      background: var(--card-subtle);
      display: flex;
      gap: 8px;
    }

    /* ================= MODAL & DRAWER OVERLAYS ================= */
    .overlay-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .overlay-backdrop.open {
      display: flex;
    }

    .dialog-window {
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 480px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .dialog-title {
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 700;
      color: var(--foreground);
    }

    .dialog-body {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* SLIDE-OVER DRAWER (SHEET) */
    .drawer-sheet {
      position: fixed;
      top: 0;
      right: -400px;
      width: 380px;
      height: 100vh;
      background: #FFFFFF;
      border-left: 1px solid var(--border);
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
      z-index: 110;
      transition: right 240ms var(--motion-ease);
      display: flex;
      flex-direction: column;
      padding: 24px;
      gap: 16px;
    }

    .drawer-sheet.open {
      right: 0;
    }

    /* TOAST NOTIFICATION */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .toast-item {
      background: #09090B;
      color: #FFFFFF;
      padding: 10px 16px;
      border-radius: var(--radius);
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      animation: toastIn 180ms ease forwards;
      pointer-events: auto;
    }

    @keyframes toastIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* ================= PRINT VECTOR STYLESHEET ================= */
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
    }
  </style>
</head>
<body>

  <!-- FLOATING ROUNDED SHELL -->
  <div class="app-shell">
    
    <!-- MINIMAL TOP APP HEADER (NO SEARCH, NO 5 TABS, NO SHARE) -->
    <header class="app-header">
      <div class="title-stack">
        <h1 class="dock-main-title">Visual Studio Dock</h1>
        <span class="dock-sub-title">Runtime Token &amp; Design System Engine</span>
      </div>

      <div class="header-actions">
        <button type="button" class="btn sm" onclick="downloadPdfSpec()">
          <iconify-icon icon="lucide:file-text"></iconify-icon>
          <span>Download PDF</span>
        </button>
        <button type="button" class="btn sm" onclick="downloadCssTokens()">
          <iconify-icon icon="lucide:download"></iconify-icon>
          <span>Download CSS</span>
        </button>
        <button type="button" class="btn sm primary" onclick="openExportModal()">
          <iconify-icon icon="lucide:code-2"></iconify-icon>
          <span>Export Code</span>
        </button>
      </div>
    </header>

    <!-- TWO-COLUMN WORKSPACE -->
    <div class="app-workspace">
      
      <!-- LEFT CANVAS: CONTINUOUS VERTICAL FLOW -->
      <main class="canvas-flow">

        <!-- HERO BRAND LOCKUP -->
        <div class="canvas-hero">
          <div class="hero-mark-tile" id="heroMarkTile">Z</div>
          <div class="hero-title-group">
            <h2 id="heroBrandName">ZeroLight OS</h2>
            <p id="heroBrandTagline">Enterprise Brand Design System &amp; Live Token Studio</p>
          </div>
        </div>

        <!-- ================= SECTION 1: FOUNDATION (6 FULL-WIDTH CARDS) ================= -->
        <section class="spec-section" id="foundationsSection">
          <div class="section-headline">
            <h3>Section 1: Foundations</h3>
            <span>6 Full-Width Tokens &amp; Mathematical Physics</span>
          </div>

          <div class="foundations-stack">
            
            <!-- 1. Colors & 11-Step Mathematical Tonal Ramp -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">1. Colors &amp; 11-Step Mathematical Tonal Ramp</span>
                <span class="foundation-card-tag">Click to copy hex</span>
              </div>
              <div class="color-swatch-row" id="semanticSwatches">
                <!-- Swatches injected via JS -->
              </div>
              <div class="tonal-ramp-container">
                <div class="tonal-ramp-bar" id="tonalRampBar">
                  <!-- 11 Stops (50 to 950) generated dynamically -->
                </div>
                <div class="contrast-score-row">
                  <span>YIQ Luminance: <strong id="yiqScoreVal">148.5</strong></span>
                  <span class="scoreChip" id="wcagBadge" style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:#ECFDF5;color:#065F46;font-weight:600;font-size:11px;">WCAG AAA (7.2:1)</span>
                  <span style="margin-left:auto;">Formula: (R*299 + G*587 + B*114)/1000</span>
                </div>
              </div>
            </div>

            <!-- 2. Elevation and Blurs -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">2. Elevation and Blurs</span>
                <span class="foundation-card-tag">4 Layered Physics Tiles</span>
              </div>
              <div class="elevation-row">
                <div class="elevation-box">
                  <span>Flat</span>
                  <small>0px shadow (Hairline border)</small>
                </div>
                <div class="elevation-box subtle">
                  <span>Subtle</span>
                  <small>Card surface elevation</small>
                </div>
                <div class="elevation-box floating">
                  <span>Floating</span>
                  <small>Popover &amp; Dock shadow</small>
                </div>
                <div class="elevation-box glass">
                  <span>Backdrop Blur</span>
                  <small>Glassmorphism (12px blur)</small>
                </div>
              </div>
            </div>

            <!-- 3. Icons Gallery -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">3. Vector Icons</span>
                <span class="foundation-card-tag" id="activeIconLibBadge">Library: Lucide</span>
              </div>
              <div class="icons-gallery" id="iconsGallery">
                <!-- 10 icons injected via JS -->
              </div>
            </div>

            <!-- 4. Logos -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">4. Brand Logo Variations</span>
                <span class="foundation-card-tag">Dynamic Brand Sync</span>
              </div>
              <div class="logos-row">
                <div class="logo-preview-card standard">
                  <div class="logo-preview-mark" id="logoPreviewMark1">Z</div>
                  <div>
                    <div class="logo-preview-title" id="logoPreviewTitle1">ZeroLight OS</div>
                    <div class="logo-preview-sub">Standard Light Tile</div>
                  </div>
                </div>
                <div class="logo-preview-card inverted">
                  <div class="logo-preview-mark" id="logoPreviewMark2">Z</div>
                  <div>
                    <div class="logo-preview-title" id="logoPreviewTitle2">ZeroLight OS</div>
                    <div class="logo-preview-sub">Inverted Primary Tile</div>
                  </div>
                </div>
                <div class="logo-preview-card standard" style="border-radius: 999px;">
                  <div class="logo-preview-mark" style="border-radius: 999px;" id="logoPreviewMark3">Z</div>
                  <div>
                    <div class="logo-preview-title" id="logoPreviewTitle3">ZeroLight OS</div>
                    <div class="logo-preview-sub">Circular App Mark</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. Spacing and Grids -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">5. Spacing Scale &amp; 12-Column Responsive Grid</span>
                <span class="foundation-card-tag">Strict 4px/8px Geometric Base</span>
              </div>
              <div class="spacing-scale-row">
                <div class="spacing-bar-col">
                  <div class="spacing-bar" style="width: 20px; height: 4px;"></div>
                  <span class="spacing-bar-label">4px</span>
                </div>
                <div class="spacing-bar-col">
                  <div class="spacing-bar" style="width: 20px; height: 8px;"></div>
                  <span class="spacing-bar-label">8px</span>
                </div>
                <div class="spacing-bar-col">
                  <div class="spacing-bar" style="width: 20px; height: 16px;"></div>
                  <span class="spacing-bar-label">16px</span>
                </div>
                <div class="spacing-bar-col">
                  <div class="spacing-bar" style="width: 20px; height: 24px;"></div>
                  <span class="spacing-bar-label">24px</span>
                </div>
                <div class="spacing-bar-col">
                  <div class="spacing-bar" style="width: 20px; height: 32px;"></div>
                  <span class="spacing-bar-label">32px</span>
                </div>
              </div>
              <div class="grid-preview-12">
                <div class="grid-col-tile">1</div>
                <div class="grid-col-tile">2</div>
                <div class="grid-col-tile">3</div>
                <div class="grid-col-tile">4</div>
                <div class="grid-col-tile">5</div>
                <div class="grid-col-tile">6</div>
                <div class="grid-col-tile">7</div>
                <div class="grid-col-tile">8</div>
                <div class="grid-col-tile">9</div>
                <div class="grid-col-tile">10</div>
                <div class="grid-col-tile">11</div>
                <div class="grid-col-tile">12</div>
              </div>
            </div>

            <!-- 6. Typography -->
            <div class="foundation-card">
              <div class="foundation-card-head">
                <span class="foundation-card-title">6. Typography Scale &amp; Tabular Numerals</span>
                <span class="foundation-card-tag" id="activeTypeFaceBadge">Headings: Plus Jakarta Sans / Body: Inter</span>
              </div>
              <div class="type-scale-list">
                <div class="type-row">
                  <span class="type-meta">Display (30px)</span>
                  <span style="font-family:var(--font-heading); font-size:30px; font-weight:700; line-height:1.2;">ZeroLight OS Enterprise</span>
                </div>
                <div class="type-row">
                  <span class="type-meta">Heading (20px)</span>
                  <span style="font-family:var(--font-heading); font-size:20px; font-weight:600;">Autonomous Design System Engine</span>
                </div>
                <div class="type-row">
                  <span class="type-meta">Body (Live Base)</span>
                  <span style="font-size:var(--base-font-size); color:var(--foreground);">Deterministic token math with zero hardcoded hex colors and instant CSS variables.</span>
                </div>
                <div class="type-row">
                  <span class="type-meta">Tabular Numerals</span>
                  <span class="tabular-nums" style="font-size:13px; font-weight:600; color:var(--foreground);">$148,250.00 &bull; 99.98% SLA &bull; 1,284 nodes &bull; 24.8ms</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ================= SECTION 2: COMPONENTS (27 INTERACTIVE COMPONENTS) ================= -->
        <section class="spec-section" id="componentsSection">
          <div class="section-headline">
            <h3>Section 2: Components</h3>
            <span>27 Interactive Primitives Built with ZeroLight Tokens</span>
          </div>

          <div class="components-grid">

            <!-- 1. Accordion -->
            <div class="comp-item-block">
              <div class="comp-item-title">1. Accordion</div>
              <div class="comp-card">
                <div class="accordion-item open" onclick="this.classList.toggle('open')">
                  <div class="accordion-header">
                    <span>What is ZeroLight token architecture?</span>
                    <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                  </div>
                  <div class="accordion-body">
                    A mathematical, token-driven surface architecture binding all colors, geometry, and motion to dynamic CSS custom properties.
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Alert -->
            <div class="comp-item-block">
              <div class="comp-item-title">2. Alert</div>
              <div class="comp-card">
                <div class="alert-banner" id="sampleAlert">
                  <iconify-icon icon="lucide:check-circle-2" style="font-size:16px; flex-shrink:0; margin-top:1px;"></iconify-icon>
                  <div style="flex:1;">
                    <strong>Deployment Successful:</strong> Token registry compiled with 0 errors across all 27 primitives.
                  </div>
                  <iconify-icon icon="lucide:x" style="cursor:pointer;" onclick="this.closest('.alert-banner').style.display='none'; showToast('Alert dismissed');"></iconify-icon>
                </div>
              </div>
            </div>

            <!-- 3. Avatar -->
            <div class="comp-item-block">
              <div class="comp-item-title">3. Avatar</div>
              <div class="comp-card">
                <div class="avatar-cluster">
                  <img class="avatar-img" id="avatarImg1" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar">
                  <img class="avatar-img" id="avatarImg2" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar">
                  <div class="avatar-monogram" id="avatarMonogram">ZL</div>
                  <span style="font-size:12px; color:var(--muted); font-weight:500;">+1,420 Active Users</span>
                </div>
              </div>
            </div>

            <!-- 4. Badge -->
            <div class="comp-item-block">
              <div class="comp-item-title">4. Badge</div>
              <div class="comp-card">
                <div class="badge-row">
                  <span class="badge primary">Primary</span>
                  <span class="badge success">Active</span>
                  <span class="badge warning">Pending</span>
                  <span class="badge destructive">Revoked</span>
                </div>
              </div>
            </div>

            <!-- 5. Breadcrumb -->
            <div class="comp-item-block">
              <div class="comp-item-title">5. Breadcrumb</div>
              <div class="comp-card">
                <nav class="breadcrumbs">
                  <span>Workspace</span>
                  <iconify-icon icon="lucide:chevron-right" style="font-size:12px;"></iconify-icon>
                  <span>Design System</span>
                  <iconify-icon icon="lucide:chevron-right" style="font-size:12px;"></iconify-icon>
                  <span class="active">Components</span>
                </nav>
              </div>
            </div>

            <!-- 6. Button -->
            <div class="comp-item-block">
              <div class="comp-item-title">6. Button</div>
              <div class="comp-card">
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  <button class="btn primary sm" onclick="showToast('Primary clicked')">Primary</button>
                  <button class="btn secondary sm" onclick="showToast('Secondary clicked')">Secondary</button>
                  <button class="btn outline sm" onclick="showToast('Outline clicked')">Outline</button>
                  <button class="btn destructive sm" onclick="showToast('Delete clicked')">Delete</button>
                </div>
              </div>
            </div>

            <!-- 7. Calendar -->
            <div class="comp-item-block">
              <div class="comp-item-title">7. Calendar</div>
              <div class="comp-card">
                <div class="calendar-mini">
                  <span class="cal-day-name">M</span>
                  <span class="cal-day-name">T</span>
                  <span class="cal-day-name">W</span>
                  <span class="cal-day-name">T</span>
                  <span class="cal-day-name">F</span>
                  <span class="cal-day-name">S</span>
                  <span class="cal-day-name">S</span>
                  <div class="cal-day" onclick="selectCalDay(this)">12</div>
                  <div class="cal-day" onclick="selectCalDay(this)">13</div>
                  <div class="cal-day" onclick="selectCalDay(this)">14</div>
                  <div class="cal-day active" onclick="selectCalDay(this)">15</div>
                  <div class="cal-day" onclick="selectCalDay(this)">16</div>
                  <div class="cal-day" onclick="selectCalDay(this)">17</div>
                  <div class="cal-day" onclick="selectCalDay(this)">18</div>
                </div>
              </div>
            </div>

            <!-- 8. Divider -->
            <div class="comp-item-block">
              <div class="comp-item-title">8. Divider</div>
              <div class="comp-card">
                <div class="divider-labeled">OR CONTINUE WITH</div>
              </div>
            </div>

            <!-- 9. Dropdown -->
            <div class="comp-item-block">
              <div class="comp-item-title">9. Dropdown</div>
              <div class="comp-card">
                <div class="custom-select-wrap">
                  <div class="custom-select-trigger" onclick="toggleDropdownMenu(this)">
                    <span id="demoDropdownLabel">Enterprise Team</span>
                    <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                  </div>
                  <div class="custom-select-menu" id="demoDropdownMenu">
                    <div class="select-item selected" onclick="chooseSelectOption(this, 'Enterprise Team')">
                      <span>Enterprise Team</span>
                      <iconify-icon icon="lucide:check"></iconify-icon>
                    </div>
                    <div class="select-item" onclick="chooseSelectOption(this, 'Growth Tier')">
                      <span>Growth Tier</span>
                    </div>
                    <div class="select-item" onclick="chooseSelectOption(this, 'Starter Plan')">
                      <span>Starter Plan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 10. Empty State -->
            <div class="comp-item-block">
              <div class="comp-item-title">10. Empty State</div>
              <div class="comp-card">
                <div class="empty-state-box">
                  <iconify-icon icon="lucide:inbox" style="font-size:24px; color:var(--muted);"></iconify-icon>
                  <strong style="font-size:13px; font-weight:600;">No Webhooks Configured</strong>
                  <p style="font-size:11px; color:var(--muted);">Add your first endpoint to listen for realtime events.</p>
                  <button class="btn primary sm" style="margin-top:4px;" onclick="showToast('Add Webhook initiated')">Add Webhook</button>
                </div>
              </div>
            </div>

            <!-- 11. Input -->
            <div class="comp-item-block">
              <div class="comp-item-title">11. Input</div>
              <div class="comp-card">
                <div class="input-wrapper">
                  <iconify-icon icon="lucide:mail"></iconify-icon>
                  <input type="email" class="input-field" placeholder="team@zerolight.dev" value="alex@zerolight.dev">
                </div>
              </div>
            </div>

            <!-- 12. KPI Metric Card -->
            <div class="comp-item-block">
              <div class="comp-item-title">12. KPI Metric Card</div>
              <div class="comp-card">
                <div class="kpi-card">
                  <div class="kpi-header">
                    <span class="kpi-label">Monthly Recurring Revenue</span>
                    <span class="badge success">+14.2%</span>
                  </div>
                  <div class="kpi-value">$148,250.00</div>
                  <div style="height:32px; width:100%;">
                    <svg viewBox="0 0 200 40" style="width:100%; height:100%; overflow:visible;">
                      <path d="M0,35 Q40,10 80,25 T160,8 T200,5" fill="none" stroke="var(--primary)" stroke-width="2"/>
                      <path d="M0,35 Q40,10 80,25 T160,8 T200,5 L200,40 L0,40 Z" fill="var(--primary)" fill-opacity="0.1"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- 13. Mockup -->
            <div class="comp-item-block">
              <div class="comp-item-title">13. Mockup</div>
              <div class="comp-card">
                <div class="browser-mockup">
                  <div class="browser-chrome">
                    <div class="chrome-dot" style="background:#EF4444;"></div>
                    <div class="chrome-dot" style="background:#F59E0B;"></div>
                    <div class="chrome-dot" style="background:#10B981;"></div>
                    <div class="chrome-url">https://app.zerolight.dev/dashboard</div>
                  </div>
                  <img class="mockup-img" id="mockupImage" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80" alt="Mockup">
                </div>
              </div>
            </div>

            <!-- 14. Modal & Dialog -->
            <div class="comp-item-block">
              <div class="comp-item-title">14. Modal &amp; Dialog</div>
              <div class="comp-card">
                <div style="display:flex; gap:8px;">
                  <button class="btn sm" onclick="openSampleModal('standard')">Open Modal</button>
                  <button class="btn sm destructive" onclick="openSampleModal('destructive')">Destructive</button>
                </div>
              </div>
            </div>

            <!-- 15. Pagination -->
            <div class="comp-item-block">
              <div class="comp-item-title">15. Pagination</div>
              <div class="comp-card">
                <div class="pagination-bar">
                  <button class="page-num" onclick="showToast('Previous page')"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
                  <div class="page-num active" onclick="selectPageNum(this)">1</div>
                  <div class="page-num" onclick="selectPageNum(this)">2</div>
                  <div class="page-num" onclick="selectPageNum(this)">3</div>
                  <button class="page-num" onclick="showToast('Next page')"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
                </div>
              </div>
            </div>

            <!-- 16. Placeholder / Skeleton -->
            <div class="comp-item-block">
              <div class="comp-item-title">16. Placeholder</div>
              <div class="comp-card">
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div class="skeleton-box" style="width:60%;"></div>
                  <div class="skeleton-box" style="width:100%;"></div>
                  <div class="skeleton-box" style="width:80%;"></div>
                </div>
              </div>
            </div>

            <!-- 17. Popover -->
            <div class="comp-item-block">
              <div class="comp-item-title">17. Popover</div>
              <div class="comp-card">
                <div class="popover-box">
                  <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
                    <span>Filter Dimensions</span>
                    <iconify-icon icon="lucide:sliders-horizontal" style="color:var(--muted);"></iconify-icon>
                  </div>
                  <input type="text" class="text-input-field" placeholder="Tag query..." value="region:us-east-1">
                  <button class="btn primary sm" onclick="showToast('Filters applied')">Apply Filter</button>
                </div>
              </div>
            </div>

            <!-- 18. Progress & Slider -->
            <div class="comp-item-block">
              <div class="comp-item-title">18. Progress &amp; Slider</div>
              <div class="comp-card">
                <div class="slider-row">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="color:var(--muted);">Capacity Allocated</span>
                    <strong class="tabular-nums" id="sliderValReadout">65%</strong>
                  </div>
                  <input type="range" class="custom-range" id="interactiveSlider" min="0" max="100" value="65" oninput="updateSyncedProgress(this.value)">
                  <div class="progress-track">
                    <div class="progress-fill" id="syncedProgressFill" style="width:65%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 19. Rating -->
            <div class="comp-item-block">
              <div class="comp-item-title">19. Rating</div>
              <div class="comp-card">
                <div class="rating-row" id="starRatingRow">
                  <iconify-icon icon="lucide:star" class="star-btn active" onclick="setRating(1)"></iconify-icon>
                  <iconify-icon icon="lucide:star" class="star-btn active" onclick="setRating(2)"></iconify-icon>
                  <iconify-icon icon="lucide:star" class="star-btn active" onclick="setRating(3)"></iconify-icon>
                  <iconify-icon icon="lucide:star" class="star-btn active" onclick="setRating(4)"></iconify-icon>
                  <iconify-icon icon="lucide:star" class="star-btn" onclick="setRating(5)"></iconify-icon>
                  <span style="font-size:12px; font-weight:600; margin-left:6px;" id="ratingReadout">4.0 / 5</span>
                </div>
              </div>
            </div>

            <!-- 20. Sheet (Slide Drawer) -->
            <div class="comp-item-block">
              <div class="comp-item-title">20. Sheet</div>
              <div class="comp-card">
                <button class="btn sm" onclick="toggleDrawerSheet(true)">
                  <iconify-icon icon="lucide:panel-right"></iconify-icon>
                  <span>Open Profile Sheet</span>
                </button>
              </div>
            </div>

            <!-- 21. Tab -->
            <div class="comp-item-block">
              <div class="comp-item-title">21. Tab</div>
              <div class="comp-card">
                <div class="tab-strip">
                  <div class="tab-btn active" onclick="switchDemoTab(this, 'Overview')">Overview</div>
                  <div class="tab-btn" onclick="switchDemoTab(this, 'Analytics')">Analytics</div>
                  <div class="tab-btn" onclick="switchDemoTab(this, 'Settings')">Settings</div>
                </div>
                <div id="demoTabContent" style="font-size:12px; color:var(--muted); padding-top:4px;">
                  Displaying Overview metrics and active pipelines.
                </div>
              </div>
            </div>

            <!-- 22. Tag -->
            <div class="comp-item-block">
              <div class="comp-item-title">22. Tag</div>
              <div class="comp-card">
                <div class="tag-row" id="tagCluster">
                  <span class="tag-chip">Next.js 15 <iconify-icon icon="lucide:x" onclick="removeTag(this)"></iconify-icon></span>
                  <span class="tag-chip">TypeScript <iconify-icon icon="lucide:x" onclick="removeTag(this)"></iconify-icon></span>
                  <span class="tag-chip">ZeroLight <iconify-icon icon="lucide:x" onclick="removeTag(this)"></iconify-icon></span>
                </div>
              </div>
            </div>

            <!-- 23. Textarea & Form Field -->
            <div class="comp-item-block">
              <div class="comp-item-title">23. Textarea &amp; Form Field</div>
              <div class="comp-card">
                <div style="display:flex; flex-direction:column; gap:4px;">
                  <label style="font-size:11px; font-weight:600; color:var(--muted);">Release Notes</label>
                  <textarea class="textarea-field" id="formTextarea" oninput="updateCharCounter(this)">Deterministic runtime token updates with zero reload.</textarea>
                  <span style="font-size:10px; color:var(--muted); text-align:right;" id="charCounter">57 characters</span>
                </div>
              </div>
            </div>

            <!-- 24. Toast -->
            <div class="comp-item-block">
              <div class="comp-item-title">24. Toast</div>
              <div class="comp-card">
                <div style="display:flex; gap:8px;">
                  <button class="btn sm" onclick="showToast('Saved token changes successfully!')">Trigger Toast</button>
                  <button class="btn sm secondary" onclick="showToast('Webhook latency: 18.2ms')">Info Toast</button>
                </div>
              </div>
            </div>

            <!-- 25. Toggle, Radio & Checkbox -->
            <div class="comp-item-block">
              <div class="comp-item-title">25. Toggle, Radio &amp; Checkbox</div>
              <div class="comp-card">
                <div class="toggles-cluster">
                  <div class="switch-ui checked" onclick="this.classList.toggle('checked'); showToast('Toggle state changed');"></div>
                  <label class="checkbox-ui" onclick="toggleCustomCheck(this)">
                    <div class="custom-check-box checked"><iconify-icon icon="lucide:check"></iconify-icon></div>
                    <span>Auto-deploy</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 26. Tooltip -->
            <div class="comp-item-block">
              <div class="comp-item-title">26. Tooltip</div>
              <div class="comp-card">
                <div style="display:flex; gap:8px;">
                  <button class="btn sm" title="Displays details on top" onclick="showToast('Tooltip trigger: Top')">Hover Top</button>
                  <button class="btn sm secondary" title="Displays details below" onclick="showToast('Tooltip trigger: Bottom')">Hover Bottom</button>
                </div>
              </div>
            </div>

            <!-- 27. Data Table (Full Width) -->
            <div class="comp-item-block" style="grid-column: 1 / -1;">
              <div class="comp-item-title">27. Data Table</div>
              <div class="comp-card" style="padding:0; overflow:hidden;">
                <table class="saas-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th style="text-align:right;">MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Acme Corp</td>
                      <td>Enterprise</td>
                      <td><span class="badge success">Active</span></td>
                      <td style="text-align:right;" class="tabular-nums">$24,500.00</td>
                    </tr>
                    <tr>
                      <td>Starlight Systems</td>
                      <td>Growth</td>
                      <td><span class="badge primary">Trial</span></td>
                      <td style="text-align:right;" class="tabular-nums">$4,800.00</td>
                    </tr>
                    <tr>
                      <td>Pulse Metrics</td>
                      <td>Pro Annual</td>
                      <td><span class="badge warning">Past Due</span></td>
                      <td style="text-align:right;" class="tabular-nums">$1,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

      </main>

      <!-- ================= RIGHT SIDEBAR: FLOATING TOKEN STUDIO ================= -->
      <aside class="token-studio" id="tokenStudioSidebar">
        
        <div class="studio-head">
          <div class="studio-title-stack">
            <span class="studio-title">Token Studio</span>
            <span class="studio-sub">Live Inspector &amp; Runtime Physics</span>
          </div>
          <button type="button" class="btn sm ghost" onclick="resetToDefaults()" title="Reset to Defaults">
            <iconify-icon icon="lucide:rotate-ccw"></iconify-icon>
            <span>Reset</span>
          </button>
        </div>

        <div class="studio-accordions">

          <!-- ACCORDION 1: BRAND & COLORS -->
          <div class="studio-acc-item open">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>1. Brand &amp; Colors</span>
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
              <div class="form-group">
                <label class="form-label">Custom Logo Upload</label>
                <input type="file" id="customLogoUpload" accept="image/*" style="font-size:11px;" onchange="handleLogoUpload(this)">
              </div>
              <div class="form-group">
                <label class="form-label">Primary Brand Color</label>
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

          <!-- ACCORDION 2: GOOGLE FONTS -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>2. Google Fonts</span>
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
                <input type="range" class="custom-range" min="12" max="16" value="14" oninput="setFontSize(this.value)">
              </div>
            </div>
          </div>

          <!-- ACCORDION 3: OPEN-SOURCE ICONS -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>3. Open-Source Icons</span>
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
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 4: UNSPLASH IMAGERY -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>4. Unsplash Imagery</span>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </button>
            <div class="studio-acc-content">
              <div class="form-group">
                <label class="form-label">Curated SaaS Theme</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="setImageryTheme(this, 'minimal')">Minimal</div>
                  <div class="pill-opt" onclick="setImageryTheme(this, 'workspace')">Workspace</div>
                  <div class="pill-opt" onclick="setImageryTheme(this, 'abstract')">Abstract</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCORDION 5: SHAPE, SURFACE & MOTION -->
          <div class="studio-acc-item">
            <button class="studio-acc-btn" onclick="toggleStudioAccordion(this)">
              <span>5. Shape, Surface &amp; Motion</span>
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
                <label class="form-label">Control Density</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setDensity(this, '32px')">Compact</div>
                  <div class="pill-opt selected" onclick="setDensity(this, '36px')">Default</div>
                  <div class="pill-opt" onclick="setDensity(this, '42px')">Spacious</div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Light Neutral Surface</label>
                <div class="pills-selector">
                  <div class="pill-opt selected" onclick="setNeutralSurface(this, 'zinc')">Zinc</div>
                  <div class="pill-opt" onclick="setNeutralSurface(this, 'slate')">Slate</div>
                  <div class="pill-opt" onclick="setNeutralSurface(this, 'pure')">Pure</div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Motion Physics</label>
                <div class="pills-selector">
                  <div class="pill-opt" onclick="setMotionSpeed(this, '0ms')">Instant</div>
                  <div class="pill-opt selected" onclick="setMotionSpeed(this, '160ms')">Snappy</div>
                  <div class="pill-opt" onclick="setMotionSpeed(this, '300ms')">Smooth</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="studio-footer">
          <button type="button" class="btn sm" style="flex:1;" onclick="downloadCssTokens()">Download CSS</button>
          <button type="button" class="btn sm primary" style="flex:1;" onclick="openExportModal()">Export Code</button>
        </div>

      </aside>

    </div>

  </div>

  <!-- ================= MODAL & DIALOG WINDOW ================= -->
  <div class="overlay-backdrop" id="sampleModalBackdrop" onclick="if(event.target===this) closeSampleModal()">
    <div class="dialog-window">
      <h3 class="dialog-title" id="dialogTitle">Token Architecture Confirmation</h3>
      <div class="dialog-body" id="dialogBody">
        Are you sure you want to deploy the live tokens to production? All 27 components will immediately compile with the current active CSS variables.
      </div>
      <div class="dialog-actions">
        <button class="btn sm" onclick="closeSampleModal()">Cancel</button>
        <button class="btn sm primary" id="dialogConfirmBtn" onclick="confirmModalAction()">Confirm</button>
      </div>
    </div>
  </div>

  <!-- ================= EXPORT CODE MODAL ================= -->
  <div class="overlay-backdrop" id="exportCodeBackdrop" onclick="if(event.target===this) closeExportModal()">
    <div class="dialog-window" style="max-width:600px;">
      <h3 class="dialog-title">Export ZeroLight Design System</h3>
      <div class="tab-strip" style="margin-bottom:8px;">
        <div class="tab-btn active" onclick="switchExportTab(this, 'css')">CSS Variables</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'tailwind')">Tailwind v4 @theme</div>
        <div class="tab-btn" onclick="switchExportTab(this, 'json')">Figma DTCG JSON</div>
      </div>
      <textarea id="exportCodeTextarea" readonly style="width:100%; height:200px; font-family:monospace; font-size:11px; padding:10px; border:1px solid var(--border); border-radius:var(--radius); outline:none; background:var(--card-subtle);"></textarea>
      <div class="dialog-actions">
        <button class="btn sm" onclick="copyExportCode()">Copy Code</button>
        <button class="btn sm primary" onclick="closeExportModal()">Done</button>
      </div>
    </div>
  </div>

  <!-- ================= SLIDE-OVER DRAWER SHEET ================= -->
  <div class="drawer-sheet" id="profileSheet">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3 style="font-family:var(--font-heading); font-size:16px; font-weight:700;">Workspace Settings</h3>
      <button class="btn sm ghost" onclick="toggleDrawerSheet(false)"><iconify-icon icon="lucide:x"></iconify-icon></button>
    </div>
    <div style="font-size:12px; color:var(--muted);">
      Configure global tenant quotas, Webhooks, and design system policies.
    </div>
    <div class="form-group">
      <label class="form-label">Cluster Name</label>
      <input type="text" class="text-input-field" value="prod-eu-west-1">
    </div>
    <div class="form-group">
      <label class="form-label">Audit Logging</label>
      <div class="switch-ui checked" onclick="this.classList.toggle('checked');"></div>
    </div>
    <button class="btn primary sm" style="margin-top:auto;" onclick="toggleDrawerSheet(false); showToast('Settings saved');">Save Changes</button>
  </div>

  <!-- TOAST CONTAINER -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- ================= RUNTIME JAVASCRIPT ENGINE ================= -->
  <script>
    // System Defaults
    const DEFAULTS = {
      brandName: "ZeroLight OS",
      brandTagline: "Enterprise Brand Design System & Live Token Studio",
      brandMark: "Z",
      primaryColor: "#4F46E5",
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      baseFontSize: "14",
      iconLib: "lucide",
      iconTint: "currentColor",
      cornerRadius: "0.5rem",
      density: "36px",
      neutralSurface: "zinc",
      motionSpeed: "160ms"
    };

    let state = Object.assign({}, DEFAULTS);

    // Initial Bootstrap
    document.addEventListener('DOMContentLoaded', () => {
      // Clear legacy storage or load clean tokens
      try {
        const saved = localStorage.getItem('zerolight_clean_tokens_v1');
        if (saved) {
          state = Object.assign({}, DEFAULTS, JSON.parse(saved));
        }
      } catch (e) {}

      applyAllTokens();
      renderSemanticSwatches();
      renderIconsGallery();
    });

    function saveState() {
      try {
        localStorage.setItem('zerolight_clean_tokens_v1', JSON.stringify(state));
      } catch (e) {}
    }

    function resetToDefaults() {
      state = Object.assign({}, DEFAULTS);
      saveState();
      applyAllTokens();
      renderSemanticSwatches();
      renderIconsGallery();
      showToast('Tokens reset to factory defaults');
    }

    // Apply tokens to DOM
    function applyAllTokens() {
      const root = document.documentElement;
      root.style.setProperty('--primary', state.primaryColor);
      root.style.setProperty('--radius', state.cornerRadius);
      root.style.setProperty('--control-h', state.density);
      root.style.setProperty('--base-font-size', state.baseFontSize + 'px');
      root.style.setProperty('--motion-speed', state.motionSpeed);
      root.style.setProperty('--icon-tint', state.iconTint);

      // Contrast calculation
      const rgb = hexToRgb(state.primaryColor);
      if (rgb) {
        const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const fg = yiq >= 128 ? '#09090B' : '#FFFFFF';
        root.style.setProperty('--primary-foreground', fg);
        const yiqScoreEl = document.getElementById('yiqScoreVal');
        if (yiqScoreEl) yiqScoreEl.textContent = yiq.toFixed(1);
      }

      // Brand updates
      const heroName = document.getElementById('heroBrandName');
      if (heroName) heroName.textContent = state.brandName;
      const heroTagline = document.getElementById('heroBrandTagline');
      if (heroTagline) heroTagline.textContent = state.brandTagline;
      
      const heroMark = document.getElementById('heroMarkTile');
      if (heroMark) heroMark.textContent = state.brandMark;
      const m1 = document.getElementById('logoPreviewMark1');
      if (m1) m1.textContent = state.brandMark;
      const m2 = document.getElementById('logoPreviewMark2');
      if (m2) m2.textContent = state.brandMark;
      const m3 = document.getElementById('logoPreviewMark3');
      if (m3) m3.textContent = state.brandMark;

      const t1 = document.getElementById('logoPreviewTitle1');
      if (t1) t1.textContent = state.brandName;
      const t2 = document.getElementById('logoPreviewTitle2');
      if (t2) t2.textContent = state.brandName;
      const t3 = document.getElementById('logoPreviewTitle3');
      if (t3) t3.textContent = state.brandName;

      // Input field sync
      const inName = document.getElementById('inputBrandName');
      if (inName) inName.value = state.brandName;
      const inTag = document.getElementById('inputBrandTagline');
      if (inTag) inTag.value = state.brandTagline;
      const nativeCol = document.getElementById('nativeColorPicker');
      if (nativeCol) nativeCol.value = state.primaryColor;

      generateTonalRamp(state.primaryColor);
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length !== 6) return null;
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function mixRgb(c1, c2, weight) {
      return {
        r: c1.r * (1 - weight) + c2.r * weight,
        g: c1.g * (1 - weight) + c2.g * weight,
        b: c1.b * (1 - weight) + c2.b * weight
      };
    }

    // Tonal ramp generator
    function generateTonalRamp(primaryHex) {
      const bar = document.getElementById('tonalRampBar');
      if (!bar) return;
      bar.innerHTML = '';

      const rgb = hexToRgb(primaryHex) || { r: 79, g: 70, b: 229 };
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 15, g: 23, b: 42 };

      const stops = [
        { label: '50', color: rgbToHex(...Object.values(mixRgb(white, rgb, 0.1))) },
        { label: '100', color: rgbToHex(...Object.values(mixRgb(white, rgb, 0.2))) },
        { label: '200', color: rgbToHex(...Object.values(mixRgb(white, rgb, 0.4))) },
        { label: '300', color: rgbToHex(...Object.values(mixRgb(white, rgb, 0.6))) },
        { label: '400', color: rgbToHex(...Object.values(mixRgb(white, rgb, 0.8))) },
        { label: '500', color: primaryHex.toUpperCase() },
        { label: '600', color: rgbToHex(...Object.values(mixRgb(rgb, black, 0.15))) },
        { label: '700', color: rgbToHex(...Object.values(mixRgb(rgb, black, 0.35))) },
        { label: '800', color: rgbToHex(...Object.values(mixRgb(rgb, black, 0.55))) },
        { label: '900', color: rgbToHex(...Object.values(mixRgb(rgb, black, 0.75))) },
        { label: '950', color: rgbToHex(...Object.values(mixRgb(rgb, black, 0.90))) }
      ];

      stops.forEach(st => {
        const div = document.createElement('div');
        div.className = 'ramp-stop';
        div.style.background = st.color;
        const stopRgb = hexToRgb(st.color);
        const yiq = (stopRgb.r * 299 + stopRgb.g * 587 + stopRgb.b * 114) / 1000;
        div.style.color = yiq >= 128 ? '#09090B' : '#FFFFFF';
        div.textContent = st.label;
        div.title = `${st.label}: ${st.color}`;
        div.onclick = () => {
          navigator.clipboard.writeText(st.color);
          showToast(`Copied ${st.label}: ${st.color}`);
        };
        bar.appendChild(div);
      });
    }

    // Swatches render
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
    }

    // Icons gallery render (10 icons)
    function renderIconsGallery() {
      const container = document.getElementById('iconsGallery');
      if (!container) return;
      container.innerHTML = '';

      const iconNames = ['home', 'search', 'bell', 'user', 'mail', 'settings', 'layers', 'globe', 'shield', 'sparkles'];
      const prefix = state.iconLib === 'ph' ? 'ph' : (state.iconLib === 'tabler' ? 'tabler' : (state.iconLib === 'heroicons' ? 'heroicons' : 'lucide'));

      iconNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'icon-tile';
        const fullName = `${prefix}:${name}`;
        div.onclick = () => {
          navigator.clipboard.writeText(fullName);
          showToast(`Copied icon: ${fullName}`);
        };
        div.innerHTML = `
          <iconify-icon icon="${fullName}" style="font-size:20px;"></iconify-icon>
          <span>${name}</span>
        `;
        container.appendChild(div);
      });

      const badge = document.getElementById('activeIconLibBadge');
      if (badge) badge.textContent = `Library: ${state.iconLib.toUpperCase()}`;
    }

    // Brand handlers
    function updateBrandName(val) {
      state.brandName = val || 'ZeroLight OS';
      saveState();
      applyAllTokens();
    }

    function updateBrandTagline(val) {
      state.brandTagline = val || '';
      saveState();
      applyAllTokens();
    }

    function chooseBrandMark(el, mark) {
      document.querySelectorAll('.pills-selector .pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.brandMark = mark;
      saveState();
      applyAllTokens();
      showToast(`Selected Mark: ${mark}`);
    }

    function handleLogoUpload(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imgUrl = e.target.result;
          ['heroMarkTile', 'logoPreviewMark1', 'logoPreviewMark2', 'logoPreviewMark3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<img src="${imgUrl}" alt="Logo">`;
          });
          showToast('Custom logo uploaded & synced');
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function setPrimaryColor(hex) {
      state.primaryColor = hex;
      saveState();
      applyAllTokens();
      renderSemanticSwatches();
      showToast(`Brand primary set to ${hex}`);
    }

    function setSemanticPalette(el, palette) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      showToast(`Palette: ${palette}`);
    }

    // Google Fonts handlers
    function selectHeadingFont(font) {
      state.headingFont = font;
      saveState();
      document.getElementById('headingFontLabel').textContent = font;
      document.getElementById('headingFontLink').href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@500;600;700&display=swap`;
      document.documentElement.style.setProperty('--font-heading', `'${font}', -apple-system, sans-serif`);
      document.getElementById('activeTypeFaceBadge').textContent = `Headings: ${font} / Body: ${state.bodyFont}`;
      closeAllDropdowns();
      showToast(`Heading font set to ${font}`);
    }

    function selectBodyFont(font) {
      state.bodyFont = font;
      saveState();
      document.getElementById('bodyFontLabel').textContent = font;
      document.getElementById('bodyFontLink').href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600&display=swap`;
      document.documentElement.style.setProperty('--font-body', `'${font}', -apple-system, sans-serif`);
      document.getElementById('activeTypeFaceBadge').textContent = `Headings: ${state.headingFont} / Body: ${font}`;
      closeAllDropdowns();
      showToast(`Body font set to ${font}`);
    }

    function setFontSize(val) {
      state.baseFontSize = val;
      saveState();
      document.getElementById('fontSizeReadout').textContent = val + 'px';
      document.documentElement.style.setProperty('--base-font-size', val + 'px');
    }

    // Icon switcher
    function switchIconLib(el, lib) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.iconLib = lib;
      saveState();
      renderIconsGallery();
      showToast(`Switched icon library to ${lib.toUpperCase()}`);
    }

    function setIconTint(tint) {
      state.iconTint = tint;
      saveState();
      applyAllTokens();
      showToast(`Icon tint set to ${tint}`);
    }

    // Imagery theme
    function setImageryTheme(el, theme) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      
      const themeMap = {
        minimal: {
          mockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
          av1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          av2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
        },
        workspace: {
          mockup: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80",
          av1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
          av2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
        },
        abstract: {
          mockup: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
          av1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
          av2: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
        }
      };

      const selected = themeMap[theme] || themeMap.minimal;
      document.getElementById('mockupImage').src = selected.mockup;
      document.getElementById('avatarImg1').src = selected.av1;
      document.getElementById('avatarImg2').src = selected.av2;
      showToast(`Imagery theme set to ${theme}`);
    }

    // Shape & Surface
    function setCornerRadius(el, rad) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.cornerRadius = rad;
      saveState();
      applyAllTokens();
      showToast(`Corner radius: ${rad}`);
    }

    function setDensity(el, h) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.density = h;
      saveState();
      applyAllTokens();
      showToast(`Density: ${h}`);
    }

    function setNeutralSurface(el, surf) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      const root = document.documentElement;
      if (surf === 'slate') {
        root.style.setProperty('--background', '#F1F5F9');
        root.style.setProperty('--card-subtle', '#F8FAFC');
        root.style.setProperty('--border', '#CBD5E1');
      } else if (surf === 'pure') {
        root.style.setProperty('--background', '#F9FAFB');
        root.style.setProperty('--card-subtle', '#FFFFFF');
        root.style.setProperty('--border', '#E5E7EB');
      } else {
        root.style.setProperty('--background', '#EEF0F4');
        root.style.setProperty('--card-subtle', '#F8F9FA');
        root.style.setProperty('--border', '#E2E8F0');
      }
      showToast(`Neutral surface: ${surf}`);
    }

    function setMotionSpeed(el, speed) {
      el.parentElement.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      state.motionSpeed = speed;
      saveState();
      applyAllTokens();
      showToast(`Motion speed: ${speed}`);
    }

    // UI interactive handlers
    function toggleStudioAccordion(btn) {
      btn.closest('.studio-acc-item').classList.toggle('open');
    }

    function toggleDropdownMenu(trigger) {
      const menu = trigger.nextElementSibling;
      const isOpen = menu.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) menu.classList.add('open');
    }

    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-menu').forEach(m => m.classList.remove('open'));
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrap')) closeAllDropdowns();
    });

    function chooseSelectOption(item, val) {
      item.parentElement.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      document.getElementById('demoDropdownLabel').textContent = val;
      closeAllDropdowns();
      showToast(`Selected: ${val}`);
    }

    function selectCalDay(el) {
      document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
      el.classList.add('active');
      showToast(`Date chosen: Day ${el.textContent}`);
    }

    function selectPageNum(el) {
      document.querySelectorAll('.page-num').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      showToast(`Page ${el.textContent}`);
    }

    function updateSyncedProgress(val) {
      document.getElementById('sliderValReadout').textContent = val + '%';
      document.getElementById('syncedProgressFill').style.width = val + '%';
    }

    function setRating(val) {
      const stars = document.querySelectorAll('#starRatingRow .star-btn');
      stars.forEach((s, idx) => {
        if (idx < val) s.classList.add('active');
        else s.classList.remove('active');
      });
      document.getElementById('ratingReadout').textContent = val.toFixed(1) + ' / 5';
      showToast(`Rated ${val} stars`);
    }

    function switchDemoTab(el, tabName) {
      document.querySelectorAll('.tab-strip .tab-btn').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('demoTabContent').textContent = `Displaying ${tabName} metrics and active pipelines.`;
      showToast(`Switched tab to ${tabName}`);
    }

    function removeTag(el) {
      el.closest('.tag-chip').remove();
      showToast('Tag removed');
    }

    function updateCharCounter(textarea) {
      document.getElementById('charCounter').textContent = `${textarea.value.length} characters`;
    }

    function toggleCustomCheck(label) {
      const box = label.querySelector('.custom-check-box');
      box.classList.toggle('checked');
      showToast('Checkbox toggled');
    }

    // Modal dialogs
    function openSampleModal(type) {
      const backdrop = document.getElementById('sampleModalBackdrop');
      const confirmBtn = document.getElementById('dialogConfirmBtn');
      if (type === 'destructive') {
        document.getElementById('dialogTitle').textContent = 'Revoke Production Cluster?';
        document.getElementById('dialogBody').textContent = 'This action cannot be undone. All active microservices will immediately disconnect.';
        confirmBtn.className = 'btn sm destructive';
        confirmBtn.textContent = 'Revoke Access';
      } else {
        document.getElementById('dialogTitle').textContent = 'Deploy Token Architecture';
        document.getElementById('dialogBody').textContent = 'Are you sure you want to compile and apply live tokens across all 27 components?';
        confirmBtn.className = 'btn sm primary';
        confirmBtn.textContent = 'Confirm';
      }
      backdrop.classList.add('open');
    }

    function closeSampleModal() {
      document.getElementById('sampleModalBackdrop').classList.remove('open');
    }

    function confirmModalAction() {
      closeSampleModal();
      showToast('Action confirmed successfully');
    }

    // Sheet drawer
    function toggleDrawerSheet(isOpen) {
      document.getElementById('profileSheet').classList.toggle('open', isOpen);
    }

    // Toast
    function showToast(msg) {
      const container = document.getElementById('toastContainer');
      const item = document.createElement('div');
      item.className = 'toast-item';
      item.innerHTML = `
        <iconify-icon icon="lucide:check-circle" style="color:var(--success); font-size:16px;"></iconify-icon>
        <span>${msg}</span>
      `;
      container.appendChild(item);
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'all 180ms ease';
        setTimeout(() => item.remove(), 180);
      }, 2600);
    }

    // Export Code
    function openExportModal() {
      document.getElementById('exportCodeBackdrop').classList.add('open');
      renderExportCode('css');
    }

    function closeExportModal() {
      document.getElementById('exportCodeBackdrop').classList.remove('open');
    }

    function switchExportTab(el, format) {
      el.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      renderExportCode(format);
    }

    function renderExportCode(format) {
      const textarea = document.getElementById('exportCodeTextarea');
      if (format === 'css') {
        textarea.value = `:root {
  --background: ${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()};
  --canvas-bg: #FFFFFF;
  --foreground: #09090B;
  --card: #FFFFFF;
  --primary: ${state.primaryColor};
  --primary-foreground: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-foreground').trim()};
  --secondary: #F1F5F9;
  --muted: #64748B;
  --border: ${getComputedStyle(document.documentElement).getPropertyValue('--border').trim()};
  --radius: ${state.cornerRadius};
  --control-h: ${state.density};
  --font-heading: '${state.headingFont}', sans-serif;
  --font-body: '${state.bodyFont}', sans-serif;
  --motion-speed: ${state.motionSpeed};
}`;
      } else if (format === 'tailwind') {
        textarea.value = `@theme {
  --color-primary: ${state.primaryColor};
  --color-canvas: #FFFFFF;
  --color-border: ${getComputedStyle(document.documentElement).getPropertyValue('--border').trim()};
  --radius-base: ${state.cornerRadius};
  --font-heading: "${state.headingFont}", sans-serif;
  --font-body: "${state.bodyFont}", sans-serif;
}`;
      } else {
        textarea.value = JSON.stringify({
          "$schema": "https://design-tokens.github.io/community-group/format/",
          "brand": {
            "name": { "value": state.brandName },
            "tagline": { "value": state.brandTagline },
            "color": {
              "primary": { "value": state.primaryColor, "type": "color" }
            },
            "typography": {
              "heading": { "value": state.headingFont },
              "body": { "value": state.bodyFont }
            },
            "shape": {
              "radius": { "value": state.cornerRadius }
            }
          }
        }, null, 2);
      }
    }

    function copyExportCode() {
      const textarea = document.getElementById('exportCodeTextarea');
      textarea.select();
      navigator.clipboard.writeText(textarea.value);
      showToast('Copied export code to clipboard');
    }

    function downloadCssTokens() {
      const css = `:root {
  --brand-name: "${state.brandName}";
  --primary: ${state.primaryColor};
  --radius: ${state.cornerRadius};
  --control-h: ${state.density};
  --font-heading: '${state.headingFont}', sans-serif;
  --font-body: '${state.bodyFont}', sans-serif;
}`;
      const blob = new Blob([css], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tokens.css`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded tokens.css');
    }

    function downloadPdfSpec() {
      window.print();
    }
  </script>
</body>
</html>
"""

def main():
    target_path = "dock-prototype.html"
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    print(f"Successfully generated {target_path} ({len(HTML_CONTENT)} bytes)")

if __name__ == "__main__":
    main()
