import { NextResponse } from "next/server";
import { globalTelemetry } from "@/components/zerolight/telemetry/collector";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const recorded = globalTelemetry.recordGeneration({
      intent: body.intent || "Unnamed UI Generation",
      source: body.source || "ai_prompt",
      activeTokens: body.activeTokens || {},
      componentsUsed: body.componentsUsed || [],
      userModifications: body.userModifications,
      aiFootprintsAudit: body.aiFootprintsAudit,
    });
    return NextResponse.json({ ok: true, eventId: recorded.id, timestamp: recorded.timestamp });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  const events = globalTelemetry.getHistory(30);
  return NextResponse.json({ total: events.length, events });
}
