"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ZeroLightDispatcher,
  IntentPayload,
} from "@/components/zerolight/dispatcher";

interface BusEvent {
  eventId: string;
  apertureId: string;
  timestamp: string;
  delta: any;
}

const PRESET_INTENTS: {
  label: string;
  command: string;
  payload: IntentPayload;
}[] = [
  {
    label: "Adjust Invoice INV-9021",
    command: "override discount for invoice INV-9021 tier:Enterprise balance:$18,400",
    payload: {
      id: "intent-inv-9021",
      aperture: "discount_override",
      props: {
        invoiceId: "INV-9021",
        baseAmount: 18400,
        clientTier: "Enterprise",
      },
    },
  },
  {
    label: "Route Batch BAT-408",
    command: "dispatch batch BAT-408 units:850 destination:Austin Fulfillment Center",
    payload: {
      id: "intent-bat-408",
      aperture: "batch_dispatch",
      props: {
        batchId: "BAT-408",
        unitCount: 850,
        destination: "Austin Fulfillment Center",
      },
    },
  },
  {
    label: "Route Batch BAT-771 (Critical)",
    command: "dispatch batch BAT-771 units:1200 destination:Chicago Metro Depot",
    payload: {
      id: "intent-bat-771",
      aperture: "batch_dispatch",
      props: {
        batchId: "BAT-771",
        unitCount: 1200,
        destination: "Chicago Metro Depot",
      },
    },
  },
  {
    label: "Simulate Unknown Intent",
    command: "execute unknown micro-action: compliance_attestation",
    payload: {
      id: "intent-fault-test",
      aperture: "compliance_attestation",
      props: {
        target: "SOC2-TYPE-II",
      },
    },
  },
];

export default function IntentWorkbenchPage() {
  const [commandInput, setCommandInput] = useState<string>("");
  const [mountedIntents, setMountedIntents] = useState<IntentPayload[]>([
    PRESET_INTENTS[0].payload,
    PRESET_INTENTS[1].payload,
  ]);
  const [events, setEvents] = useState<BusEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSettled = (id: string, delta: any) => {
    const busEvent: BusEvent = {
      eventId: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      apertureId: id,
      timestamp: new Date().toISOString(),
      delta,
    };

    setEvents((prev) => [busEvent, ...prev]);
    setSelectedEventId(busEvent.eventId);
  };

  const dispatchIntent = (payload: IntentPayload) => {
    // Generate fresh unique ID so multiple dispatches can run concurrently
    const uniqueId = `${payload.aperture}-${Date.now().toString().slice(-4)}`;
    const instancePayload: IntentPayload = {
      ...payload,
      id: uniqueId,
    };
    setMountedIntents((prev) => [instancePayload, ...prev]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = commandInput.trim().toLowerCase();
    if (!query) return;

    if (query.includes("batch") || query.includes("bat-") || query.includes("route")) {
      const match = query.match(/bat-?(\d+)/i);
      const batchNum = match ? `BAT-${match[1]}` : `BAT-${Math.floor(100 + Math.random() * 900)}`;
      dispatchIntent({
        id: `intent-${Date.now()}`,
        aperture: "batch_dispatch",
        props: {
          batchId: batchNum,
          unitCount: 650,
          destination: "Seattle Distribution Dock",
        },
      });
    } else if (query.includes("invoice") || query.includes("inv-") || query.includes("discount")) {
      const match = query.match(/inv-?(\d+)/i);
      const invNum = match ? `INV-${match[1]}` : `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      dispatchIntent({
        id: `intent-${Date.now()}`,
        aperture: "discount_override",
        props: {
          invoiceId: invNum,
          baseAmount: 24500,
          clientTier: "VIP",
        },
      });
    } else {
      // Fallback uncataloged intent simulation
      dispatchIntent({
        id: `intent-${Date.now()}`,
        aperture: query.replace(/[^a-z0-9_]/gi, "_"),
        props: {
          rawCommand: commandInput,
        },
      });
    }

    setCommandInput("");
  };

  const handleClearViewport = () => {
    setMountedIntents([]);
  };

  const handleRestoreDefaults = () => {
    setMountedIntents([PRESET_INTENTS[0].payload, PRESET_INTENTS[1].payload]);
  };

  const handleClearBus = () => {
    setEvents([]);
    setSelectedEventId(null);
  };

  const handleCopyPayload = (payload: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeEvent =
    events.find((e) => e.eventId === selectedEventId) || events[0] || null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm shadow-rose-900/40">
              ZL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-wide text-neutral-100">
                  ZeroLight Intent Dispatcher &amp; Test Bench
                </h1>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50">
                  Dispatcher v2.0
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Centralized Intent Registry • Compound Zero-Dependency Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs/atoms"
              className="text-xs font-mono px-3 py-1.5 rounded border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Atomic Lab Docs →</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1 rounded">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ROUTING BUS: NOMINAL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Natural Language Command Bar */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <label
              htmlFor="command-bar"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Natural Language Intent Dispatcher</span>
            </label>
            <span className="text-[11px] font-mono text-neutral-500">
              Type or select intent chip to mount aperture
            </span>
          </div>

          <form onSubmit={handleCommandSubmit} className="relative flex items-center">
            <input
              id="command-bar"
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="e.g. 'Route Batch BAT-408' or 'Adjust Invoice INV-9021'..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-mono transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-neutral-950 text-xs font-semibold rounded font-sans transition-colors"
            >
              Dispatch
            </button>
          </form>

          {/* Preset Intent Trigger Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium">
              Registered Micro-Action Presets:
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_INTENTS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => dispatchIntent(preset.payload)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <span className="text-rose-500 font-bold">+</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Aperture Viewport */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-neutral-100">
                Active Dynamic Viewport
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                {mountedIntents.length} Mounted
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="text-xs font-mono px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition"
              >
                Reset Default Pair
              </button>
              <button
                type="button"
                onClick={handleClearViewport}
                className="text-xs font-mono px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition"
              >
                Clear Viewport
              </button>
            </div>
          </div>

          {mountedIntents.length === 0 ? (
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/20 p-8 text-center space-y-2">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                [VIEWPORT EMPTY]
              </div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No micro-action apertures currently mounted. Click any preset intent chip above or dispatch a command to dynamically mount an operational aperture.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mountedIntents.map((intent) => (
                <div key={intent.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 px-1">
                    <span>Intent ID: {intent.id}</span>
                    <span>Aperture Class: {intent.aperture}</span>
                  </div>
                  <ZeroLightDispatcher
                    payload={intent}
                    onSettled={handleSettled}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Committed Delta Bus Feed */}
        <section className="space-y-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                  <span>Committed Delta Bus Feed</span>
                  <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {events.length} {events.length === 1 ? "Delta" : "Deltas"} Logged
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Real-time immutable ledger capturing settled state machines dispatched through ZeroLight runtime.
                </p>
              </div>
            </div>

            {events.length > 0 && (
              <button
                type="button"
                onClick={handleClearBus}
                className="text-xs font-mono text-neutral-400 hover:text-neutral-200 px-2.5 py-1 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 transition-colors"
              >
                Clear Ledger
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/20 p-8 text-center space-y-2">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                [DELTA STREAM QUIET]
              </div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No settlements emitted yet. Complete and authorize an action in any active aperture above to emit live structured JSON deltas onto this bus.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Event Ledger Stream */}
              <div className="lg:col-span-5 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {events.map((evt) => {
                  const isSelected = activeEvent?.eventId === evt.eventId;
                  return (
                    <div
                      key={evt.eventId}
                      onClick={() => setSelectedEventId(evt.eventId)}
                      className={`cursor-pointer rounded-md p-3 border transition-all text-left font-mono ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-600 shadow-sm"
                          : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-neutral-200">
                          {evt.eventId}
                        </span>
                        <span className="text-neutral-500 tabular-nums">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mb-1">
                        Origin: {evt.apertureId}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        {evt.delta?.batchId ? (
                          <>
                            <span className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-rose-300">
                              {evt.delta.batchId}
                            </span>
                            <span>{evt.delta.transportMode}</span>
                            <span className="text-neutral-500">•</span>
                            <span className="text-neutral-300">{evt.delta.unitCount} units</span>
                          </>
                        ) : evt.delta?.invoiceId ? (
                          <>
                            <span className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-rose-300">
                              {evt.delta.invoiceId}
                            </span>
                            <span className="text-rose-400">-{evt.delta.percentage}%</span>
                            <span className="text-neutral-500">→</span>
                            <span className="text-emerald-400">
                              ${evt.delta.adjustedTotal?.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-neutral-400">Custom Delta Record</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Payload Inspector (Raw Telemetry) */}
              <div className="lg:col-span-7 rounded-lg border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-neutral-300 font-semibold">
                      Raw Delta Telemetry: {activeEvent?.eventId}
                    </span>
                  </div>
                  {activeEvent && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyPayload(activeEvent.delta, activeEvent.eventId)
                      }
                      className="text-[11px] font-sans px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      {copiedId === activeEvent.eventId ? "Copied!" : "Copy JSON"}
                    </button>
                  )}
                </div>

                <div className="p-4 flex-1 overflow-x-auto bg-neutral-950 font-mono text-xs leading-relaxed text-neutral-300 min-h-[220px]">
                  {activeEvent ? (
                    <pre className="text-neutral-300 selection:bg-neutral-800">
                      <code>{JSON.stringify(activeEvent.delta, null, 2)}</code>
                    </pre>
                  ) : (
                    <div className="text-neutral-600 italic">
                      Select an event from the stream to view raw delta telemetry.
                    </div>
                  )}
                </div>

                {activeEvent && (
                  <div className="px-4 py-2 bg-neutral-900/90 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 flex justify-between items-center">
                    <span>Bus Target: stream://zerolight.events.v1</span>
                    <span className="text-emerald-400">State: Immutable Trace</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* System Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-4 text-center text-xs text-neutral-500 font-mono">
        ZeroLight Dispatch Engine • Centralized Intent Registry • Principal Frontend Systems Architecture
      </footer>
    </main>
  );
}
