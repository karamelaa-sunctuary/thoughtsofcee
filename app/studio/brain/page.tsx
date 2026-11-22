import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import BrainConsole from "./BrainConsole";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function BrainPage() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret || !process.env.STUDIO_ACCESS_CODE) redirect("/studio/access");
  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");
  const configured = Boolean(process.env.GEMINI_API_KEY);

  return <main className="min-h-screen bg-[#EAE4DB] text-black">
    <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
      <Link href="/studio/agents" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#765D4B]"><ArrowLeft size={14}/> AI team</Link>
      <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Thoughts of Cee · The Brain</span>
    </header>
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-9 sm:py-14">
      <div className="flex items-center gap-3 text-[#765D4B]"><BrainCircuit size={22}/><p className="text-[10px] font-bold uppercase tracking-[.22em]">Central intelligence · supervised pilot</p></div>
      <h1 className="mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[.82] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">THE BRAIN.</h1>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-[#514941]">Your central coordinator. Give it an objective, ask it to challenge a plan or prepare specialist work orders. This supervised pilot uses Gemini for reasoning and drafting; live independent agent delegation and persistent project memory are not connected yet.</p>
      <div className="mt-7 flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[.14em]">
        <span className={configured ? "border border-[#9C8B78] bg-[#F5F0E9] px-3 py-2 text-[#514941]" : "border border-[#B98B69] bg-[#F5F0E9] px-3 py-2 text-[#765D4B]"}>{configured ? "Gemini key detected" : "Gemini connection needed"}</span>
        <span className="border border-[#CFC4B7] px-3 py-2 text-[#765D4B]">Free-tier model · no paid fallback</span>
        <span className="border border-[#CFC4B7] px-3 py-2 text-[#765D4B]">No autonomous publishing</span>
        <span className="border border-[#CFC4B7] px-3 py-2 text-[#765D4B]">Founder approval required</span>
      </div>
      <div className="mt-9"><BrainConsole configured={configured}/></div>
    </div>
  </main>;
}
