import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import ApprovalInbox from "./ApprovalInbox";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function ApprovalsPage() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret || !process.env.STUDIO_ACCESS_CODE) redirect("/studio/access");
  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");

  return <main className="min-h-screen bg-[#EAE4DB] text-black">
    <header className="flex items-center justify-between border-b border-[#CFC4B7] px-4 py-4 sm:px-8">
      <Link href="/studio" className="text-xs font-bold uppercase tracking-[.14em] text-[#765D4B]"><ArrowLeft className="mr-2 inline" size={14}/> Studio</Link>
      <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Thoughts of Cee</span>
    </header>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="mb-8 flex items-center gap-3"><ShieldCheck size={22} className="text-[#765D4B]"/><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Founder decision centre</p></div>
      <h1 className="text-5xl leading-none tracking-tight [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] sm:text-7xl">YOUR APPROVALS.</h1>
      <p className="mb-8 mt-4 max-w-xl text-sm leading-6 text-[#514941]">Review proposed shared memories, standing instructions and agent work before anything moves forward. Designed to work on your phone as well as desktop.</p>
      <ApprovalInbox/>
    </div>
  </main>;
}
