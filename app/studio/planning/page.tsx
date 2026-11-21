import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlanningBoard from "./PlanningBoard";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function StudioPlanningPage() {
  const accessCode = process.env.STUDIO_ACCESS_CODE;
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!accessCode || !secret) redirect("/studio/access");
  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");
  return <main className="min-h-screen bg-[#EAE4DB] text-black">
    <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
      <Link href="/studio/agents" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#765D4B]"><ArrowLeft size={14}/> AI team</Link>
      <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Thoughts of Cee · Planning room</span>
    </header>
    <PlanningBoard />
  </main>;
}
