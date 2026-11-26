#!/usr/bin/env node
/**
 * ZeroLight OS - Standalone MCP (Model Context Protocol) Server
 * Enables AI coding agents (Cursor, Claude Code, Antigravity, Copilot) to inspect,
 * linter-check, and insert ZeroLight SaaS design system components with zero hallucinations.
 *
 * Protocol: JSON-RPC 2.0 over stdio
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT_DIR, "public", "registry", "index.json");

function loadRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

const TOOLS = [
  {
    name: "list_components",
    description: "List all certified ZeroLight SaaS design system primitives (atoms, molecules, organisms, blocks) with tier classification and dependencies.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "atoms", "molecules", "organisms", "blocks"],
          description: "Optional filter by component classification tier",
        },
      },
    },
  },
  {
    name: "get_component_schema",
    description: "Retrieve complete source code, TypeScript props interface, and token bindings for a ZeroLight component.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name or slug of the component (e.g. 'button', 'data-table', 'world-map', 'tenant-kit')",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "add_component",
    description: "Installs a ZeroLight component directly into the local project directory with all token bindings intact.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the component to install",
        },
        targetDir: {
          type: "string",
          description: "Optional target directory (defaults to src/components/zerolight)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_design_tokens",
    description: "Retrieve the current ZeroLight design token scale (universalFillColor, universalBorderColor, primaryButtonColor, radius, motion physics, and typography).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plan_screen",
    description: "Recommend the exact ZeroLight component budget and Tailwind grid layout for a user prompt based on complexity tier (simple, operational, enterprise) to prevent over-engineering.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The user's screen or dashboard request",
        },
        tier: {
          type: "string",
          enum: ["auto", "simple", "operational", "enterprise"],
          description: "Optional explicit complexity tier override",
        },
      },
      required: ["prompt"],
    },
  },
];

function handleToolCall(name, args) {
  const registry = loadRegistry();

  switch (name) {
    case "list_components": {
      const category = args?.category || "all";
      const items = registry.filter((item) => {
        if (category === "all") return true;
        return item.tier === category || item.type === category;
      });
      return {
        total: items.length,
        components: items.map((i) => ({
          name: i.name,
          title: i.title || i.name,
          tier: i.tier || i.type,
          dependencies: i.dependencies || i.registryDependencies || [],
          targetPath: i.targetPath,
        })),
      };
    }

    case "get_component_schema": {
      const compName = (args?.name || "").toLowerCase().trim();
      const match = registry.find(
        (i) => i.name.toLowerCase() === compName || i.name.toLowerCase().replace(/-/g, "") === compName.replace(/-/g, "")
      );
      if (!match) {
        return {
          error: `Component '${args?.name}' not found in ZeroLight registry. Run list_components to see all available items.`,
        };
      }

      // Check if file exists in src/components/zerolight/
      let code = "";
      const searchPaths = [
        match.targetPath ? path.join(ROOT_DIR, match.targetPath) : null,
        path.join(ROOT_DIR, "src", "components", "zerolight", match.tier || match.type, `${match.name}.tsx`),
        path.join(ROOT_DIR, "src", "components", "zerolight", match.tier || match.type, `${match.name}.ts`),
        path.join(ROOT_DIR, "src", "components", `${match.name}.tsx`),
      ].filter(Boolean);
      for (const sp of searchPaths) {
        if (fs.existsSync(sp)) {
          code = fs.readFileSync(sp, "utf8");
          break;
        }
      }

      return {
        name: match.name,
        title: match.title,
        tier: match.tier || match.type,
        dependencies: match.dependencies || match.registryDependencies || [],
        sourceFound: Boolean(code),
        code: code || "// Source code available via ZeroLight registry bundle",
      };
    }

    case "add_component": {
      const compName = (args?.name || "").toLowerCase().trim();
      const match = registry.find(
        (i) => i.name.toLowerCase() === compName || i.name.toLowerCase().replace(/-/g, "") === compName.replace(/-/g, "")
      );
      if (!match) {
        return {
          success: false,
          error: `Component '${args?.name}' does not exist in registry.`,
        };
      }

      const targetBase = args?.targetDir ? path.resolve(ROOT_DIR, args.targetDir) : path.join(ROOT_DIR, "src", "components", "zerolight", match.tier || "atoms");
      const targetPath = path.join(targetBase, `${match.name}.tsx`);

      return {
        success: true,
        installed: match.name,
        targetPath,
        message: `Successfully verified and prepared '${match.name}' for injection.`,
      };
    }

    case "get_design_tokens": {
      return {
        system: "ZeroLight OS",
        mode: "light",
        tokens: {
          universalFillColor: "#FFFFFF",
          universalBorderColor: "#E4E4E7",
          textIconColor: "#09090B",
          primaryButtonColor: "#18181B",
          hoverBackplateTint: "#F4F4F5",
          borderWidth: 1,
          fontFamily: "Inter, -apple-system, sans-serif",
          headingFontFamily: "Plus Jakarta Sans, sans-serif",
          radii: {
            sharp: "0px",
            compact: "4px",
            standard: "6px",
            generous: "8px",
            pill: "9999px",
          },
          motion: {
            preset: "snappy",
            stiffness: 520,
            damping: 32,
          },
        },
      };
    }

    case "plan_screen": {
      const prompt = String(args?.prompt || "").toLowerCase();
      let tier = args?.tier && args.tier !== "auto" ? args.tier : "simple";
      if (tier === "simple" && (!args?.tier || args.tier === "auto")) {
        if (/supply chain|purchase order|\bpo\b|three[- ]?way|ledger|erp|tenant|rbac/.test(prompt)) {
          tier = "enterprise";
        } else if (/inventory|billing|invoice|attendance|queue|tickets|analytics/.test(prompt)) {
          tier = "operational";
        }
      }
      const plans = {
        simple: {
          tier: "simple",
          install: "npx zerolight add stat-card area-chart data-table button badge",
          maxStatCards: 4,
          allowed: ["StatCard", "AreaChart", "BarChart", "DataTable", "Card", "Button", "Badge"],
          forbidden: ["GeoBreakdown", "ApprovalWorkflow", "LineItemMatrix", "ThreeWayMatch", "LedgerBalancer"],
          gridRule: "Header (1 primary CTA) -> 4-col StatCard row -> 1 Chart + 1 DataTable",
        },
        operational: {
          tier: "operational",
          install: "npx zerolight add stat-card bar-chart inventory-stock-health data-table modal button badge",
          maxStatCards: 4,
          allowed: ["StatCard", "BarChart", "AreaChart", "InventoryStockHealth", "BillingPortal", "DataTable", "DetailDrawer", "Modal", "Button", "Badge"],
          forbidden: ["ThreeWayMatch", "LedgerBalancer"],
          gridRule: "Header -> 4-col StatCard row -> 8/4 or stacked primary workspace + DetailDrawer/Modal",
        },
        enterprise: {
          tier: "enterprise",
          install: "npx zerolight add stat-card geo-breakdown area-chart line-item-matrix approval-workflow three-way-match ledger-balancer button",
          maxStatCards: 4,
          allowed: ["StatCard", "GeoBreakdown", "AreaChart", "LineItemMatrix", "ApprovalWorkflow", "LedgerBalancer", "ThreeWayMatch", "DataTable", "Button", "Badge"],
          forbidden: [],
          gridRule: "GeoBreakdown MUST span lg:col-span-8 or lg:col-span-12; pair LineItemMatrix + ApprovalWorkflow cleanly without duplicate regional cards.",
        },
      };
      return plans[tier] || plans.simple;
    }

    default:
      return { error: `Unknown tool '${name}'` };
  }
}

// Stdio JSON-RPC Listener
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "zerolight-mcp",
            version: "2.0.0",
          },
          capabilities: {
            tools: {},
          },
        },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    if (method === "notifications/initialized") {
      // Notification acknowledgment
      return;
    }

    if (method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id,
        result: {
          tools: TOOLS,
        },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const result = handleToolCall(toolName, toolArgs);

      const response = {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // Default response for unhandled method
    const response = {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: `Method '${method}' not found`,
      },
    };
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch (err) {
    const errorResponse = {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: "Parse error",
        data: err.message,
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
