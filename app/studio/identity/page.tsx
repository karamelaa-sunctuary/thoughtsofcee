import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import IdentityPanel from "./IdentityPanel";
import { createClient } from "@/lib/supabase/server";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function StudioIdentityPage({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const accessCode = process.env.STUDIO_ACCESS_CODE;
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!accessCode || !secret) redirect("/studio/access");

  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");

  const params = await searchParams;
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  let authenticated = false;
  if (configured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getClaims();
      authenticated = !error && typeof data?.claims?.sub === "string";
    } catch {
      authenticated = false;
    }
  }

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
        <Link href="/studio" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#765D4B]"><ArrowLeft size={14}/> Creative Studio</Link>
        <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Thoughts of Cee · Founder identity</span>
      </header>
      <div className="mx-auto max-w-[880px] px-5 py-12 sm:px-9">
        <div className="flex items-center gap-3 text-[#765D4B]"><ShieldCheck size={20}/><p className="text-[10px] font-bold uppercase tracking-[.2em]">Security foundation · Preview only</p></div>
        <h1 className="mt-5 text-[clamp(3.2rem,8vw,6rem)] leading-[.84] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">FOUNDER<br/>IDENTITY.</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#514941]">
          The Studio access password protects the workspace. Supabase Auth provides the verified user identity required by the private department database and its row-level security policies. Both checks remain separate.
        </p>
        {params.auth === "link_error" && (
          <p role="alert" className="mt-6 border border-[#B98B69] bg-[#F5F0E9] p-4 text-xs leading-6 text-[#8B3327]">The sign-in link could not be verified. Check the Supabase Email provider and redirect URL settings before requesting one new link.</p>
        )}
        <div className="mt-9"><IdentityPanel configured={configured} authenticated={authenticated}/></div>
      </div>
    </main>
  );
}
