import { NextRequest, NextResponse } from "next/server";

const founderEmail = "thoughtsofcee@gmail.com";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/studio/access") return NextResponse.next();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  let access = request.cookies.get("toc_supabase_access")?.value;
  const refresh = request.cookies.get("toc_supabase_refresh")?.value;
  if (!url || !key) return deny(request);

  let userResponse = access ? await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${access}` }, cache: "no-store" }) : null;
  let refreshed: any = null;
  if ((!userResponse || !userResponse.ok) && refresh) {
    const refreshResponse = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }), cache: "no-store",
    });
    if (refreshResponse.ok) {
      refreshed = await refreshResponse.json();
      access = refreshed.access_token;
      userResponse = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${access}` }, cache: "no-store" });
    }
  }
  if (!userResponse?.ok) return deny(request);
  const user = await userResponse.json();
  if (String(user?.email ?? "").toLowerCase() !== founderEmail || user?.email_confirmed_at == null) return deny(request);

  const response = NextResponse.next();
  if (refreshed) {
    response.cookies.set("toc_supabase_access", refreshed.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: Number(refreshed.expires_in) || 3600 });
    response.cookies.set("toc_supabase_refresh", refreshed.refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return response;
}

function deny(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "Founder authentication required." }, { status: 401 });
  const response = NextResponse.redirect(new URL("/studio/access", request.url));
  response.cookies.delete("toc_supabase_access");
  response.cookies.delete("toc_supabase_refresh");
  response.cookies.delete("toc_studio_session");
  return response;
}

export const config = { matcher: ["/studio/:path*", "/api/studio/:path*"] };
