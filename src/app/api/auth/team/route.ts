import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "zl_team_session";

async function computeSessionToken(password: string): Promise<string> {
  const secret = process.env.ZERORAPID_AUTH_SECRET || "zerolight-internal-team-secret";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`zerorapid:${password}`));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const submitted = typeof body?.password === "string" ? body.password.trim() : "";
    const expected = process.env.ZERORAPID_TEAM_PASSWORD || "zerorapid2026";

    if (!submitted || submitted !== expected) {
      return NextResponse.json(
        { ok: false, error: "Invalid Zerorapid team password." },
        { status: 401 }
      );
    }

    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.nextUrl.protocol === "https:";
    const token = await computeSessionToken(expected);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
