# ZeroLight ⚡

> **A proprietary, zero-dependency, ephemeral design system and runtime engine tailored strictly for B2B SaaS micro-actions.**

ZeroLight is engineered from first principles using native HTML5 elements, TypeScript strict mode, and high-density Tailwind CSS utility classes. **It has zero external UI dependencies** (no shadcn/ui, no Radix, no framer-motion).

---

## 💡 The Core Philosophy: Ephemeral Forms

Traditional B2B SaaS forms clutter interfaces and persist indefinitely. In ZeroLight:

1. **Active State**: High-density interactive controls exist **only during decision time**.
2. **Settled / Trace State**: The moment the operator authorizes or signs, the form dissolves into a single-line, immutable, audited trace receipt with an active status dot, timestamp, summary, and a subtle "Modify" trigger to re-open if needed.
3. **Monotonic Audit Bus**: Every settled micro-action emits a strongly-typed delta payload to the downstream event ledger.

---

## 🤖 How You or Any AI Can Build a ZeroLight Form

ZeroLight is designed to be **100% LLM-friendly**. Any AI (Claude, ChatGPT, Gemini, Cursor, v0, Windsurf) can generate new SaaS micro-action forms instantly using the blueprint below.

### The Universal Prompt for Any AI

Copy and paste this into any AI assistant:

```text
Act as a Principal Frontend Engineer. Using the ZeroLight architecture, build a new compound micro-action component for: [DESCRIBE YOUR USE CASE, e.g. "Refund Approval" or "API Key Scope Rotation"].

RULES:
1. Wrap the component with `<Aperture<T>>` from '@/components/zerolight/aperture'.
2. Use ZeroLight atoms from '@/components/zerolight/atoms' (MonoValue, SegmentPill, ApertureSlider, ApertureSwitch, ApertureAction, TraceDot, KeyBadge, etc.).
3. DO NOT import shadcn/ui, Radix, or external animation libraries.
4. Active state must display high-density native controls and a "Sign & Collapse" or "Authorize" commit button.
5. On commit, call `settle(summary, delta)` so the form dissolves into an immutable single-line receipt.
```

---

### Step-by-Step Code Example: Building a Form

Here is the exact pattern to create any form (e.g. `RefundApproval`):

```tsx
"use client";

import React, { useState } from "react";
import { Aperture } from "@/components/zerolight/aperture";
import {
  MonoValue,
  SegmentPill,
  ApertureSlider,
  ApertureSwitch,
  ApertureAction,
  KeyBadge,
} from "@/components/zerolight/atoms";

export interface RefundDelta {
  refundId: string;
  orderId: string;
  originalAmount: number;
  refundPercentage: number;
  refundAmount: number;
  restockFeeWaived: boolean;
  reason: string;
  timestamp: string;
}

export function RefundApproval({
  id,
  orderId,
  originalAmount,
  onSettled,
}: {
  id: string;
  orderId: string;
  originalAmount: number;
  onSettled?: (delta: RefundDelta) => void;
}) {
  const [percentage, setPercentage] = useState<number>(50);
  const [reason, setReason] = useState<string>("Damaged in Transit");
  const [waiveRestock, setWaiveRestock] = useState<boolean>(true);

  const refundAmount = Math.round((originalAmount * (percentage / 100)) * 100) / 100;

  return (
    <Aperture<RefundDelta>
      id={id}
      title="Refund Authorization"
      badgeText={orderId}
      badgeVariant="warning"
      onSettle={(record) => onSettled?.(record.payload)}
    >
      {({ settle, dismiss }) => {
        const handleCommit = () => {
          const delta: RefundDelta = {
            refundId: id,
            orderId,
            originalAmount,
            refundPercentage: percentage,
            refundAmount,
            restockFeeWaived: waiveRestock,
            reason,
            timestamp: new Date().toISOString(),
          };

          const summary = `${orderId} • Refund $${refundAmount.toLocaleString()} (${percentage}%) • [${reason}]`;
          settle(summary, delta);
        };

        return (
          <div className="space-y-4">
            {/* Real-time Math Display */}
            <div className="flex justify-between items-center p-3 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">Approved Refund:</span>
              <MonoValue
                value={refundAmount}
                previousValue={originalAmount}
                prefix="$"
                variant="success"
                size="md"
              />
            </div>

            {/* Slider */}
            <ApertureSlider
              label="Refund Concession"
              unit="%"
              min={10}
              max={100}
              value={percentage}
              onChange={setPercentage}
            />

            {/* Pills */}
            <div className="flex gap-2">
              {["Damaged in Transit", "Late Delivery", "Customer Goodwill"].map((r) => (
                <SegmentPill
                  key={r}
                  label={r}
                  selected={reason === r}
                  onSelect={() => setReason(r)}
                />
              ))}
            </div>

            {/* Toggle */}
            <ApertureSwitch
              checked={waiveRestock}
              onChange={setWaiveRestock}
              label="Waive 15% Restocking Fee"
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <ApertureAction label="Cancel" variant="ghost" onClick={dismiss} />
              <ApertureAction label="Authorize & Collapse" variant="primary" onClick={handleCommit} />
            </div>
          </div>
        );
      }}
    </Aperture>
  );
}
```

---

## 🧱 The 14 Indivisible Atoms

Located in `src/components/zerolight/atoms/`:

| Atom | Description |
| :--- | :--- |
| **`TraceDot`** | Operational status heartbeat with active pulse, settled emerald, staged gray, and fault rose states. |
| **`MonoValue`** | Tabular numeric alignment with strike-through delta comparisons and hardware-accelerated value shimmer. |
| **`SegmentPill`** | Compact operational mode pill with spring bounce (`active:scale-95`) and selection glow. |
| **`ApertureSlider`** | Native range constraint actuator with embedded numeric telemetry badge. |
| **`ApertureSwitch`** | Binary toggle with spring-damped sliding thumb physics and peripheral emerald glow. |
| **`ApertureAction`** | Semantically distinct triggers: `primary` (commit), `ghost` (dismiss), and `undo` (modify). |
| **`TrendDelta`** | Math delta badge (`+12%`, `-$40`) with inverse metric support (e.g. lower latency is green). |
| **`CapacityMeter`** | Quota progress bar with smooth spring interpolation and 90% threshold critical pulsing. |
| **`CopyTrigger`** | One-click clipboard copy with ripple burst and checkmark icon morph. |
| **`AuditTimestamp`** | Monospace timestamp formatter supporting compact, ISO-8601, and pill views. |
| **`EntityAvatar`** | Deterministic 2-letter fallback avatar with string-hash background tinting. |
| **`MicroInput`** | Ultra-compact inline currency/rate field with prefix ($) and suffix (%). |
| **`KeyBadge`** | Monospace compliance & entity tag badge (`neutral`, `emerald`, `amber`, `outline`). |
| **`KbdShortcut`** | High-density keyboard chord keycap display (`⌘+K`, `Esc`). |

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/zerorapid/zerolight.git
cd zerolight

# Install dependencies
npm install

# Run the development server
npm run dev

# Or build and run production
npm run build
npm run start
```

Visit:
- **`http://localhost:3000`** — Operational Workbench & Intent Dispatcher
- **`http://localhost:3000/docs/atoms`** — Interactive Living Atomic Laboratory

---

## 📜 License

MIT License. Crafted from first principles.
