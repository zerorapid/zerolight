import fs from "node:fs";
import path from "node:path";

export interface GenerationTelemetryEvent {
  id: string;
  timestamp: string;
  intent: string;
  source: "ai_prompt" | "human_studio" | "reference_audit";
  activeTokens: {
    polarity?: string;
    fontFamily?: string;
    headingFontFamily?: string;
    cornerRadius?: number | string;
    elevation?: string;
    direction?: string;
    motionPhysics?: string;
    primaryButtonColor?: string;
    universalFillColor?: string;
  };
  componentsUsed: string[];
  userModifications?: {
    tokensChanged?: string[];
    componentsAdded?: string[];
    componentsRemoved?: string[];
    feedbackNotes?: string;
  };
  aiFootprintsAudit?: {
    detectedFootprints: string[];
    eliminated: boolean;
  };
}

export class TelemetryCollector {
  private logPath: string;

  constructor(customLogPath?: string) {
    this.logPath =
      customLogPath ||
      path.join(process.cwd(), ".agents", "memory", "generation-telemetry.jsonl");
  }

  public recordGeneration(event: Omit<GenerationTelemetryEvent, "id" | "timestamp">): GenerationTelemetryEvent {
    const fullEvent: GenerationTelemetryEvent = {
      id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };

    try {
      const dir = path.dirname(this.logPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(this.logPath, JSON.stringify(fullEvent) + "\n", "utf8");
    } catch (e) {
      console.warn("Could not write generation telemetry:", e);
    }

    return fullEvent;
  }

  public getHistory(limit = 50): GenerationTelemetryEvent[] {
    if (!fs.existsSync(this.logPath)) return [];
    try {
      const lines = fs
        .readFileSync(this.logPath, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean);
      return lines.slice(-limit).map((l) => JSON.parse(l));
    } catch {
      return [];
    }
  }
}

export const globalTelemetry = new TelemetryCollector();
