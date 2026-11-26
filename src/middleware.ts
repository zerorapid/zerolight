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

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow public auth & static/Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/team") ||
    pathname === "/login" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt"
  ) {
    return NextResponse.next();
  }

  const expectedPassword = process.env.ZERORAPID_TEAM_PASSWORD || "zerorapid2026";
  const expectedCookie = await computeSessionToken(expectedPassword);
  const hasValidSession = req.cookies.get(SESSION_COOKIE)?.value === expectedCookie;

  // Registry routes (/r/* and /registry/*): allow valid session cookie OR registry token
  if (pathname.startsWith("/r/") || pathname.startsWith("/registry/")) {
    if (hasValidSession) return NextResponse.next();
    const regToken = process.env.ZERORAPID_REGISTRY_TOKEN;
    if (regToken) {
      const provided =
        searchParams.get("token") || req.headers.get("x-zerolight-token") || "";
      if (provided === regToken) return NextResponse.next();
    } else if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }
    return NextResponse.json(
      { error: "Unauthorized: Zerorapid team session or registry token required." },
      { status: 401 }
    );
  }

  if (!hasValidSession) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
