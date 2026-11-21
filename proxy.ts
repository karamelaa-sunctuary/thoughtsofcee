import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const secret = process.env.STUDIO_SESSION_SECRET;
  const token = request.cookies.get("toc_studio_session")?.value ?? "";
  const expected = secret
    ? createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex")
    : "";
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  const authenticated =
    Boolean(secret) &&
    tokenBuffer.length === expectedBuffer.length &&
    timingSafeEqual(tokenBuffer, expectedBuffer);

  if (authenticated || request.nextUrl.pathname === "/studio/access") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Founder authentication required." }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/studio/access", request.url));
  response.cookies.set("toc_studio_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export const config = { matcher: ["/studio/:path*", "/api/studio/:path*"] };
