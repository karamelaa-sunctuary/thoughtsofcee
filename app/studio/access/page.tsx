"use server";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const founderEmail = "thoughtsofcee@gmail.com";

export async function requestFounderCode(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email !== founderEmail) redirect("/studio/access?sent=1");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) redirect("/studio/access?setup=1");
  const response = await fetch(`${url}/auth/v1/otp`, {
    method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: founderEmail, create_user: false }), cache: "no-store",
  });
  if (!response.ok) redirect("/studio/access?sent=1");
  redirect("/studio/access?code=1");
}

export async function verifyFounderCode(formData: FormData) {
  const token = String(formData.get("code") ?? "").trim().replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) redirect("/studio/access?code=1&error=1");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!url || !key || !secret) redirect("/studio/access?setup=1");
  const response = await fetch(`${url}/auth/v1/verify`, {
    method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: founderEmail, token, type: "email" }), cache: "no-store",
  });
  if (!response.ok) redirect("/studio/access?code=1&error=1");
  const session = await response.json();
  const access = session?.access_token;
  const refresh = session?.refresh_token;
  if (typeof access !== "string" || typeof refresh !== "string") redirect("/studio/access?code=1&error=1");
  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${access}` }, cache: "no-store",
  });
  if (!userResponse.ok) redirect("/studio/access?code=1&error=1");
  const user = await userResponse.json();
  if (String(user?.email ?? "").toLowerCase() !== founderEmail || user?.email_confirmed_at == null) redirect("/studio/access?code=1&error=1");

  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set("toc_supabase_access", access, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: Number(session.expires_in) || 3600 });
  store.set("toc_supabase_refresh", refresh, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  store.set("toc_studio_session", createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex"), { httpOnly: true, secure, sameSite: "lax", path: "/studio", maxAge: 60 * 60 * 12 });
  redirect("/studio");
}

export default async function StudioAccessPage({ searchParams }: { searchParams: Promise<{ code?: string; sent?: string; setup?: string; error?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.STUDIO_SESSION_SECRET);
  return (
    <main className="min-h-screen bg-[#EAE4DB] px-6 py-10 text-black sm:px-10">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-between">
        <header className="flex items-center justify-between border-b border-[#CFC4B7] pb-5"><a href="/" className="text-xs font-black uppercase tracking-[0.2em]">Thoughts of Cee</a><span className="text-[10px] uppercase tracking-[0.2em] text-[#765D4B]">Private Creative Studio</span></header>
        <section className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div><p className="mb-7 text-xs font-bold uppercase tracking-[0.28em] text-[#765D4B]">Founder access only</p><h1 className="max-w-3xl text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.06em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">MAKE ROOM<br/>FOR IDEAS.</h1><p className="mt-9 max-w-lg text-sm leading-7 text-[#514941]">A private place to create, shape and organise the world of Thoughts of Cee. Sign in with a one-time verification code sent to the founder email.</p></div>
          <div className="border border-[#CFC4B7] bg-[#F5F0E9] p-7 sm:p-9">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#765D4B]">Founder sign-in</p><h2 className="mb-7 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">YOUR PRIVATE ROOM.</h2>
            {!configured || params.setup === "1" ? <p className="border-l-2 border-[#765D4B] pl-4 text-sm leading-7 text-[#514941]">Supabase Auth is not configured in this Preview yet. Add SUPABASE_URL, SUPABASE_ANON_KEY and STUDIO_SESSION_SECRET to the Vercel Preview environment.</p> : params.code === "1" ? (
              <form action={verifyFounderCode} className="space-y-5"><p className="text-sm leading-6 text-[#514941]">Enter the six-digit code sent to the founder inbox.</p><label htmlFor="code" className="block text-xs font-bold uppercase tracking-[0.14em]">Email verification code</label><input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required className="w-full border border-[#CFC4B7] bg-[#EAE4DB] px-4 py-3 text-lg tracking-[0.35em] outline-none" placeholder="000000"/>{params.error === "1" && <p role="alert" className="text-xs text-[#8B3327]">That code could not be verified. Request a new one and try again.</p>}<button className="w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#EAE4DB] hover:bg-[#765D4B]">Verify & enter ↗</button></form>
            ) : params.sent === "1" ? <p role="status" className="border-l-2 border-[#765D4B] pl-4 text-sm leading-7 text-[#514941]">If the founder account is already invited and active, a sign-in code will arrive by email. Check your inbox and spam folder.</p> : (
              <form action={requestFounderCode} className="space-y-5"><label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.14em]">Founder email</label><input id="email" name="email" type="email" value={founderEmail} readOnly className="w-full border border-[#CFC4B7] bg-[#EAE4DB] px-4 py-3 text-sm outline-none"/><button className="w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#EAE4DB] hover:bg-[#765D4B]">Send me a sign-in code ↗</button></form>
            )}
            <p className="mt-7 border-t border-[#CFC4B7] pt-5 text-[10px] uppercase leading-5 tracking-[0.12em] text-[#765D4B]">Where feelings become words.</p>
          </div>
        </section>
        <footer className="flex items-center justify-between border-t border-[#CFC4B7] pt-5 text-[10px] uppercase tracking-[0.16em] text-[#765D4B]"><span>Thoughts of Cee</span><span>Founder-only · Preview</span></footer>
      </div>
    </main>
  );
}
