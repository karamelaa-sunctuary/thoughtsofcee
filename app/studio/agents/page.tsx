import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BrainCircuit, BookOpen, HeartHandshake, Clapperboard, Compass, FileText, Globe, Image as ImageIcon, PenLine, Palette, Share2, Sparkles, ChartNoAxesCombined, ShieldCheck } from "lucide-react";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

const agents = [
  { icon: BrainCircuit, name: "The Brain", role: "Chief of Staff · Orchestrator", description: "Your central AI lead. Understands the goal, assigns work to the right agents, combines their outputs, presents recommendations, tracks decisions and raises risks before anything reaches you.", status: "Core coordinator", href: "/studio/planning", action: "Open planning room", featured: true },
  { icon: Palette, name: "Creative Director Agent", role: "Creative direction", description: "Shapes concepts, visual identity, campaigns, moodboards and creative briefs. Can call on image and video tools when providers are connected.", status: "Existing agent", href: "/studio/create", action: "Open creative canvas" },
  { icon: HeartHandshake, name: "Audience & Storytelling Agent", role: "Psychology-informed audience insight", description: "Studies human experience, narrative engagement and audience needs to recommend what to say, why it matters and how to approach it sensitively. Not a psychologist and never provides diagnosis or therapy.", status: "Skill specification added", href: "/studio/planning", action: "Plan audience content" },
  { icon: FileText, name: "Editorial Agent", role: "Writing and editorial quality", description: "Reviews writing, protects the Thoughts of Cee voice, improves clarity and prepares fragments, letters, captions and scripts.", status: "Existing agent", href: "/studio/planning", action: "Plan editorial work" },
  { icon: Globe, name: "Website Manager Agent", role: "Website and publishing", description: "Plans website updates, checks content readiness, prepares publishing tasks and flags changes that need review.", status: "Existing agent", href: "/studio/planning", action: "Plan website work" },
  { icon: Share2, name: "Content Distribution Agent", role: "Social and distribution", description: "Turns approved content into channel-specific versions and prepares a distribution schedule across social platforms.", status: "Existing agent", href: "/studio/planning", action: "Plan distribution" },
  { icon: ChartNoAxesCombined, name: "Business Intelligence Agent", role: "Performance and business insight", description: "Looks at goals, performance, audience signals, costs and opportunities; highlights trends, assumptions and commercial risks.", status: "Existing agent", href: "/studio/planning", action: "Review goals and risks" },
  { icon: BookOpen, name: "Thoughts of Cee Memory Agent", role: "Shared knowledge and continuity", description: "Keeps approved brand guidance, project context, decisions and reusable knowledge available to the team, with clear boundaries around what is remembered.", status: "Existing agent", href: "/studio/planning", action: "Review project context" },
];

export default async function StudioAgentsPage() {
  const accessCode = process.env.STUDIO_ACCESS_CODE;
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!accessCode || !secret) redirect("/studio/access");
  const expected = createHmac("sha256", secret).update("thoughts-of-cee-studio").digest("hex");
  const store = await cookies();
  const token = store.get("toc_studio_session")?.value ?? "";
  if (!safeMatch(token, expected)) redirect("/studio/access");

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
        <Link href="/studio" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#765D4B]"><ArrowLeft size={14}/> Creative Studio</Link>
        <span className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Thoughts of Cee</span>
      </header>
      <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-9">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[.25em] text-[#765D4B]">Your AI department</p>
        <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] leading-[.82] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">THE TEAM<br/>BEHIND THE WORK.</h1>
        <p className="mt-7 max-w-2xl text-sm leading-7 text-[#514941]">Your existing specialist agents, gathered in one place—with one central Brain to coordinate them. This is the team structure and workspace; connecting each agent's actual model, tools and permissions is the next integration step.</p>
        <Link href="/studio/planning" className="mt-7 inline-flex items-center gap-2 bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#EAE4DB]">Open the planning room <ArrowUpRight size={14}/></Link>
        <div className="mt-10 grid gap-px border border-[#CFC4B7] bg-[#CFC4B7] sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return <article key={agent.name} className={`flex min-h-[270px] flex-col p-6 ${agent.featured ? "bg-[#292522] text-[#EAE4DB] sm:col-span-2 xl:col-span-3" : "bg-[#F5F0E9]"}`}>
              <div className="flex items-center justify-between"><Icon size={22} strokeWidth={1.4}/><span className={`text-[8px] uppercase tracking-[.15em] ${agent.featured ? "text-[#D1B9A2]" : "text-[#765D4B]"}`}>{agent.status}</span></div>
              <p className={`mt-8 text-[9px] font-bold uppercase tracking-[.2em] ${agent.featured ? "text-[#D1B9A2]" : "text-[#765D4B]"}`}>{agent.role}</p>
              <h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{agent.name}</h2>
              <p className={`mt-3 max-w-3xl flex-1 text-xs leading-6 ${agent.featured ? "text-[#E0D7CD]" : "text-[#6B625A]"}`}>{agent.description}</p>
              <Link href={agent.href} className={`mt-5 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.15em] underline underline-offset-4 ${agent.featured ? "text-[#EAE4DB]" : "text-black"}`}>{agent.action}<ArrowUpRight size={13}/></Link>
            </article>;
          })}
        </div>
        <section className="mt-10 grid gap-6 border-t border-[#CFC4B7] pt-8 md:grid-cols-2">
          <div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-[#765D4B]" size={20}/><div><h2 className="text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">RISK BEFORE APPROVAL</h2><p className="mt-3 text-xs leading-6 text-[#6B625A]">The Brain should return a decision brief: recommendation, evidence, assumptions, risks, dependencies, cost or time implications, confidence and what needs your approval. It should never silently publish, spend or change production.</p></div></div>
          <div className="flex items-start gap-4"><Compass className="mt-1 shrink-0 text-[#765D4B]" size={20}/><div><h2 className="text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">ONE TEAM, SHARED PLAN</h2><p className="mt-3 text-xs leading-6 text-[#6B625A]">The Brain coordinates. Specialists contribute. The planning room gathers goals, workstreams, owners, milestones, risks and decisions. You stay the final decision-maker.</p></div></div>
        </section>
      </div>
    </main>
  );
}
