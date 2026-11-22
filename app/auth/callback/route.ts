import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/studio/identity?auth=link_error", url.origin));

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/studio/identity?auth=link_error", url.origin));
    return NextResponse.redirect(new URL("/studio/identity?auth=verified", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/studio/identity?auth=link_error", url.origin));
  }
}
