import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Image as ImageIcon,
  Layers3,
  Plus,
  Settings2,
  Sparkles,
  WandSparkles,
} from "lucide-react";

async function endStudioSession() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("toc_studio_session");
  redirect("/studio/access");
}

function safeMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

const tools = [
  { icon: Plus, title: "Create a design", detail: "Start with a blank canvas or a social format", tag: "START HERE" },
  { icon: Sparkles, title: "AI Studio", detail: "Turn a thought into an editable creative direction", tag: "ASSISTED" },
  { icon: ImageIcon, title: "Media Library", detail: "Keep photographs, artwork and brand assets together", tag: "LIBRARY" },
  { icon: Layers3, title: "Brand Library", detail: "Your colours, typography and signature details", tag: "IDENTITY" },
];

const formats = [
  { name: "Instagram portrait", size: "1080 × 1350", ratio: "4:5" },
  { name: "Instagram story", size: "1080 × 1920", ratio: "9:16" },
  { name: "Square post", size: "1080 × 1080", ratio: "1:1" },
  { name: "Pinterest pin", size: "1000 × 1500", ratio: "2:3" },
];

export default async function CreativeStudioPage() {
  const accessCode = process.env.STUDIO_ACCESS_CODE;
  const sessionSecret = process.env.STUDIO_SESSION_SECRET;

  if (!accessCode || !sessionSecret) redirect("/studio/access");

  const expectedToken = createHmac("sha256", sessionSecret)
    .update("thoughts-of-cee-studio")
    .digest("hex");
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("toc_studio_session")?.value ?? "";

  if (!safeMatch(sessionToken, expectedToken)) redirect("/studio/access");

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-[#CFC4B7] bg-[#E4DDD3] px-6 py-7 lg:flex">
          <a href="/" className="text-[11px] font-black uppercase tracking-[0.19em]">Thoughts of Cee</a>
          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#765D4B]">Creative Studio</p>
          <div className="my-9 h-px bg-[#CFC4B7]" />
          <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A7A6B]">Workspace</p>
          <nav className="space-y-1 text-sm">
            <a href="/studio" className="flex items-center gap-3 bg-black px-3 py-3 text-[#EAE4DB]"><FolderOpen size={16} /> Overview</a>
            <a href="#projects" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><Layers3 size={16} /> My projects</a>
            <a href="#create" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><Plus size={16} /> Create</a>
            <a href="#ai-studio" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><WandSparkles size={16} /> AI Studio</a>
          </nav>
          <p className="mb-4 mt-9 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A7A6B]">Your resources</p>
          <nav className="space-y-1 text-sm">
            <a href="#brand" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><BookOpen size={16} /> Brand library</a>
            <a href="#media" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><ImageIcon size={16} /> Media library</a>
            <a href="#planner" className="flex items-center gap-3 px-3 py-3 text-[#514941] hover:bg-black/5"><Clock3 size={16} /> Social planner</a>
          </nav>
          <div className="mt-auto border-t border-[#CFC4B7] pt-5">
            <a href="#settings" className="mb-4 flex items-center gap-3 text-xs text-[#514941]"><Settings2 size={15} /> Studio settings</a>
            <form action={endStudioSession}>
              <button className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#765D4B] hover:text-black">Lock workspace ↗</button>
            </form>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#CFC4B7] px-5 py-5 sm:px-9">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#765D4B] lg:hidden">Thoughts of Cee · Studio</p>
              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-[#765D4B] lg:block">Your creative workspace</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-[10px] uppercase tracking-[0.15em] text-[#765D4B] sm:inline">Private workspace</span>
              <form action={endStudioSession}><button className="border border-[#CFC4B7] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] hover:border-black">Lock</button></form>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-9 sm:py-14">
            <div className="flex flex-col justify-between gap-8 border-b border-[#CFC4B7] pb-10 xl:flex-row xl:items-end">
              <div>
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#765D4B]">A little room to make things</p>
                <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.78] tracking-[-0.055em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">THE CREATIVE<br />SIDE OF CEE.</h1>
                <p className="mt-7 max-w-xl text-sm leading-7 text-[#514941]">A home for the visuals, ideas and little details behind the words. Start something new, keep your brand close, and let the work grow at its own pace.</p>
              </div>
              <a href="#create" className="inline-flex w-fit items-center gap-3 bg-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.17em] text-[#EAE4DB] transition hover:bg-[#765D4B]">Create something <ArrowUpRight size={15} /></a>
            </div>

            <section id="create" className="pt-10">
              <div className="mb-5 flex items-end justify-between">
                <div><p className="text-[9px] uppercase tracking-[0.2em] text-[#765D4B]">Make it yours</p><h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">YOUR CREATIVE TOOLS</h2></div>
                <span className="hidden text-[9px] uppercase tracking-[0.15em] text-[#8A7A6B] sm:block">The first set of tools</span>
              </div>
              <div className="grid gap-px border border-[#CFC4B7] bg-[#CFC4B7] sm:grid-cols-2 2xl:grid-cols-4">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return <a key={tool.title} href={tool.title === "Create a design" ? "/studio/create" : "#coming-next"} className="group min-h-[190px] bg-[#F5F0E9] p-6 transition hover:bg-white">
                    <div className="flex items-start justify-between"><Icon size={20} strokeWidth={1.5} /><span className="text-[8px] uppercase tracking-[0.18em] text-[#8A7A6B]">{tool.tag}</span></div>
                    <h3 className="mt-9 text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{tool.title}</h3>
                    <p className="mt-2 max-w-[240px] text-xs leading-6 text-[#6B625A]">{tool.detail}</p>
                  </a>;
                })}
              </div>
            </section>

            <section id="formats" className="pt-12">
              <div className="mb-5"><p className="text-[9px] uppercase tracking-[0.2em] text-[#765D4B]">Choose a starting point</p><h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">START WITH A FORMAT</h2></div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {formats.map((format, index) => <a href="/studio/create" key={format.name} className="block border border-[#CFC4B7] bg-[#F5F0E9] p-5 transition hover:border-black">
                  <div className="mb-5 flex h-28 items-center justify-center bg-[#EAE4DB]">
                    <div className={`flex items-center justify-center border border-[#765D4B]/50 bg-[#EAE4DB] ${index === 0 ? "h-20 w-14" : index === 1 ? "h-24 w-12" : index === 2 ? "h-20 w-20" : "h-24 w-16"}`}>
                      <span className="text-[8px] uppercase tracking-[0.12em] text-[#765D4B]">TOC</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold">{format.name}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#8A7A6B]">{format.size} · {format.ratio}</p>
                </div>)}
              </div>
            </section>

            <section id="projects" className="grid gap-8 border-y border-[#CFC4B7] py-10 md:grid-cols-2">
              <div><p className="text-[9px] uppercase tracking-[0.2em] text-[#765D4B]">Your work, gathered</p><h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">PROJECTS WILL LIVE HERE.</h2><p className="mt-3 max-w-md text-xs leading-6 text-[#6B625A]">Saved designs, drafts and versions will have a home here once the editor and project saving are connected.</p></div>
              <div className="flex min-h-36 items-center justify-center border border-dashed border-[#B9AA9A] text-center"><div><FolderOpen className="mx-auto mb-3 text-[#8A7A6B]" size={22} /><p className="text-[10px] uppercase tracking-[0.15em] text-[#765D4B]">No projects yet</p></div></div>
            </section>

            <section id="coming-next" className="grid gap-4 py-10 sm:grid-cols-3">
              <div className="border-l border-[#B9AA9A] pl-4"><CheckCircle2 size={16} className="mb-3 text-[#765D4B]" /><p className="text-xs font-bold">Brand foundation</p><p className="mt-1 text-[11px] leading-5 text-[#6B625A]">Palette and editorial direction carried into the Studio.</p></div>
              <div className="border-l border-[#B9AA9A] pl-4"><Layers3 size={16} className="mb-3 text-[#765D4B]" /><p className="text-xs font-bold">Editable canvas</p><p className="mt-1 text-[11px] leading-5 text-[#6B625A]">Text, image layers, positioning and export tools are next.</p></div>
              <div className="border-l border-[#B9AA9A] pl-4"><Sparkles size={16} className="mb-3 text-[#765D4B]" /><p className="text-xs font-bold">AI creative partner</p><p className="mt-1 text-[11px] leading-5 text-[#6B625A]">An assistant that understands the brand and helps shape ideas.</p></div>
            </section>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#CFC4B7] pt-5 text-[9px] uppercase tracking-[0.16em] text-[#765D4B]"><span>Thoughts of Cee · Creative Studio</span><span>Where feelings become words.</span></footer>
          </div>
        </section>
      </div>
    </main>
  );
}
