import { NextResponse } from "next/server";
import { z } from "zod";
import { globalTelemetry } from "@/components/zerolight/telemetry/collector";

const TelemetryEventSchema = z.object({
  intent: z.string().min(1, "Intent cannot be empty").default("Unnamed UI Generation"),
  source: z.enum(["ai_prompt", "human_studio", "reference_audit"]).default("ai_prompt"),
  activeTokens: z
    .object({
      polarity: z.string().optional(),
      fontFamily: z.string().optional(),
      headingFontFamily: z.string().optional(),
      cornerRadius: z.union([z.number(), z.string()]).optional(),
      elevation: z.string().optional(),
      direction: z.string().optional(),
      motionPhysics: z.string().optional(),
      primaryButtonColor: z.string().optional(),
      universalFillColor: z.string().optional(),
    })
    .default({}),
  componentsUsed: z.array(z.string()).default([]),
  userModifications: z
    .object({
      tokensChanged: z.array(z.string()).optional(),
      componentsAdded: z.array(z.string()).optional(),
      componentsRemoved: z.array(z.string()).optional(),
      feedbackNotes: z.string().optional(),
    })
    .optional(),
  aiFootprintsAudit: z
    .object({
      detectedFootprints: z.array(z.string()),
      eliminated: z.boolean(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parseResult = TelemetryEventSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Schema validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const recorded = globalTelemetry.recordGeneration(parseResult.data);
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
