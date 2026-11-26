import { NextRequest, NextResponse } from "next/server";

/**
 * Public ZeroLight middleware — allows open browsing of the component catalog,
 * /llms.txt, and /r/* + /registry/* JSON payloads for web chats and CLI installs.
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
