import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DepartmentsWorkspace from "./DepartmentsWorkspace";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function DepartmentsPage() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret || !process.env.STUDIO_ACCESS_CODE) redirect("/studio/access");
  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
        <Link href="/studio" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#765D4B]"><ArrowLeft size={14}/> Creative Studio</Link>
        <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Founder workspace · Departments</span>
      </header>
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-9 sm:py-14">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#765D4B]">The operating foundation</p>
        <h1 className="mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[.82] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">MEMORY.<br/>INSTRUCTIONS.<br/>TASKS.</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#514941]">A founder-controlled home for the knowledge, rules and work that keep the team aligned. Create drafts here; nothing is approved, published or executed automatically.</p>
        <DepartmentsWorkspace />
      </div>
    </main>
  );
}
