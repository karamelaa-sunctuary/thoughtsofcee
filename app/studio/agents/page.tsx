import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Clapperboard, Image as ImageIcon, PenLine, Palette, Sparkles, Share2, WandSparkles } from "lucide-react";

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

const agents = [
  { icon: Palette, name: "Creative Director", role: "Shapes the idea", description: "Turns a rough thought into a clear creative concept, visual direction, mood and content plan.", status: "Workspace mode", href: "/studio/create", action: "Open canvas" },
  { icon: ImageIcon, name: "Image Maker", role: "Creates the visuals", description: "Builds image briefs and, once connected, generates original brand photography, artwork and backgrounds.", status: "Image provider needed", href: "/studio/create", action: "Prepare an image brief" },
  { icon: PenLine, name: "Writing Partner", role: "Finds the words", description: "Develops fragments, captions, letters and scripts while protecting the Thoughts of Cee voice.", status: "Ready for workflow design", href: "/studio/create", action: "Start a design" },
  { icon: Clapperboard, name: "Video Producer", role: "Brings it to life", description: "Plans reels, storyboards, scenes, voiceovers and edits. Video generation will connect to a provider such as Kling or Runway.", status: "Video provider needed", href: "/studio/create", action: "Prepare a concept" },
  { icon: BookOpen, name: "Brand Guardian", role: "Keeps it consistent", description: "Checks typography, palette, tone, logo use and visual consistency across every creative.", status: "Brand rules in progress", href: "/studio/create", action: "View design tools" },
  { icon: Share2, name: "Social Strategist", role: "Gets it ready to share", description: "Adapts one idea for Instagram, TikTok, Facebook and Pinterest, including captions and posting plans.", status: "Workflow planned", href: "/studio/create", action: "Create a post" },
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
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[.25em] text-[#765D4B]">Your creative department</p>
        <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] leading-[.82] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">MEET YOUR<br/>CREATIVE AGENTS.</h1>
        <p className="mt-7 max-w-2xl text-sm leading-7 text-[#514941]">One workspace. Different specialists. They should share the same brand knowledge and pass work between one another, so an idea can move from words to design to video without starting over.</p>
        <div className="mt-10 grid gap-px border border-[#CFC4B7] bg-[#CFC4B7] sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return <article key={agent.name} className="flex min-h-[260px] flex-col bg-[#F5F0E9] p-6">
              <div className="flex items-center justify-between"><Icon size={21} strokeWidth={1.4}/><span className="text-[8px] uppercase tracking-[.15em] text-[#765D4B]">{agent.status}</span></div>
              <p className="mt-8 text-[9px] font-bold uppercase tracking-[.2em] text-[#765D4B]">{agent.role}</p>
              <h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{agent.name}</h2>
              <p className="mt-3 flex-1 text-xs leading-6 text-[#6B625A]">{agent.description}</p>
              <Link href={agent.href} className="mt-5 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.15em] underline underline-offset-4">{agent.action}<ArrowUpRight size={13}/></Link>
            </article>;
          })}
        </div>
        <section className="mt-10 border-t border-[#CFC4B7] pt-8">
          <div className="flex items-start gap-4"><Sparkles className="mt-1 shrink-0 text-[#765D4B]" size={20}/><div><h2 className="text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">HOW THE TEAM WILL WORK</h2><p className="mt-3 max-w-3xl text-xs leading-6 text-[#6B625A]">You brief the Creative Director. The Writing Partner shapes the message. The Brand Guardian checks the voice and look. The Image Maker or Video Producer creates the media. The Social Strategist prepares channel-ready versions. You approve everything before it is saved or published.</p></div></div>
          <p className="mt-6 border-l-2 border-[#765D4B] pl-4 text-xs leading-6 text-[#765D4B]">Provider note: image and video generation are not switched on yet. We need to connect secure provider credentials first; this page does not pretend those actions are already working.</p>
        </section>
      </div>
    </main>
  );
}
