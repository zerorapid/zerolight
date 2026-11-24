import { NextResponse } from "next/server";
import { z } from "zod";

const AuditUrlSchema = z.object({
  url: z.string().trim().min(3, "Enter a valid website URL."),
});

const PRIVATE_HOST_PATTERN =
  /^(localhost|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|\[::1\]|::1|.*\.local|.*\.internal)$/i;

function normalizeAndValidatePublicUrl(rawInput: string): URL {
  const withProtocol = /^https?:\/\//i.test(rawInput) ? rawInput : `https://${rawInput}`;
  const parsed = new URL(withProtocol);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }

  const cleanHost = parsed.hostname.replace(/^\[|\]$/g, "");
  if (!cleanHost || PRIVATE_HOST_PATTERN.test(cleanHost)) {
    throw new Error("Localhost and private network addresses cannot be audited.");
  }

  return parsed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = AuditUrlSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { ok: false, error: parsedBody.error.issues[0]?.message || "Invalid URL payload." },
        { status: 400 }
      );
    }

    let targetUrl: URL;
    try {
      targetUrl = normalizeAndValidatePublicUrl(parsedBody.data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid website URL.";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(targetUrl.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "ZeroAuditorBot/1.0 (+https://zerorapid.in)",
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
      });

      const finalUrl = response.url ? new URL(response.url) : targetUrl;
      if (PRIVATE_HOST_PATTERN.test(finalUrl.hostname.replace(/^\[|\]$/g, ""))) {
        return NextResponse.json(
          { ok: false, error: "Redirect target resolved to a restricted network host." },
          { status: 403 }
        );
      }

      if (!response.ok) {
        return NextResponse.json(
          { ok: false, error: `Target returned HTTP ${response.status}. Ensure the site is publicly accessible.` },
          { status: 502 }
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("html") && !contentType.includes("text/plain")) {
        return NextResponse.json(
          { ok: false, error: `Unsupported content-type "${contentType}". Expected HTML document.` },
          { status: 415 }
        );
      }

      const rawHtml = await response.text();
      const html = rawHtml.slice(0, 150_000);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : finalUrl.hostname;

      return NextResponse.json({
        ok: true,
        url: finalUrl.toString(),
        title,
        html,
        charCount: html.length,
      });
    } finally {
      clearTimeout(timer);
    }
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    const msg = isAbort
      ? "Timed out after 8 seconds while fetching target site."
      : err instanceof Error
      ? err.message
      : "Failed to audit target URL.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
