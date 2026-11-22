"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, ClipboardList, BrainCircuit, Plus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

type Resource = "memory" | "instructions" | "tasks";
type RecordItem = Record<string, unknown> & { id?: string; title?: string; content?: string; objective?: string; status?: string; created_at?: string; memory_type?: string; scope?: string; priority?: string };

const tabs: { id: Resource; label: string; description: string }[] = [
  { id: "memory", label: "Memory", description: "Approved knowledge and context for continuity." },
  { id: "instructions", label: "Instructions", description: "Draft operating guidance for the team." },
  { id: "tasks", label: "Tasks", description: "Work requests and objectives for future assignment." },
];

function readable(value: unknown) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export default function DepartmentsWorkspace() {
  const [active, setActive] = useState<Resource>("memory");
  const [items, setItems] = useState<Record<Resource, RecordItem[]>>({ memory: [], instructions: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memoryType, setMemoryType] = useState("brand");
  const [scope, setScope] = useState("global");
  const [priority, setPriority] = useState("normal");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const resources: Resource[] = ["memory", "instructions", "tasks"];
      const responses = await Promise.all(resources.map(async (resource) => {
        const response = await fetch(`/api/studio/departments/${resource}`, { cache: "no-store", credentials: "same-origin" });
        const payload = await response.json();
        if (!response.ok || payload?.ok !== true || !Array.isArray(payload.items)) {
          throw new Error(payload?.error || `Could not load ${resource}.`);
        }
        return [resource, payload.items as RecordItem[]] as const;
      }));
      setItems(Object.fromEntries(responses) as Record<Resource, RecordItem[]>);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Department records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeItems = useMemo(() => items[active] ?? [], [items, active]);

  async function createDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !title.trim() || !content.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const body = active === "memory"
        ? { memory_type: memoryType, title: title.trim(), content: content.trim(), provenance: "Created by founder in the Studio departments workspace." }
        : active === "instructions"
          ? { scope, title: title.trim(), content: content.trim() }
          : { title: title.trim(), objective: content.trim(), priority };
      const response = await fetch(`/api/studio/departments/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok !== true) throw new Error(payload?.error || "Draft could not be saved.");
      setTitle("");
      setContent("");
      setNotice("Draft saved. It has not been approved or executed.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Draft could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="grid gap-px border border-[#CFC4B7] bg-[#CFC4B7] md:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.id === "memory" ? BrainCircuit : tab.id === "instructions" ? BookOpen : ClipboardList;
          return <button key={tab.id} type="button" onClick={() => { setActive(tab.id); setError(""); setNotice(""); }} aria-pressed={active === tab.id} className={`min-h-[130px] p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#765D4B] ${active === tab.id ? "bg-[#292522] text-[#EAE4DB]" : "bg-[#F5F0E9] hover:bg-white"}`}>
            <div className="flex items-center justify-between"><Icon size={19}/><span className={`text-[9px] uppercase tracking-[.16em] ${active === tab.id ? "text-[#D1B9A2]" : "text-[#765D4B]"}`}>{items[tab.id].length} records</span></div>
            <h2 className="mt-6 text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{tab.label}</h2>
            <p className={`mt-1 text-[11px] leading-5 ${active === tab.id ? "text-[#E0D7CD]" : "text-[#6B625A]"}`}>{tab.description}</p>
          </button>;
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-[#CFC4B7] pb-4">
            <div><p className="text-[9px] uppercase tracking-[.2em] text-[#765D4B]">Your records</p><h2 className="mt-2 text-3xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{active.toUpperCase()}</h2></div>
            <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 border border-[#B9AA9A] px-3 py-2 text-[9px] font-bold uppercase tracking-[.13em] disabled:opacity-40"><RefreshCw size={13} className={loading ? "animate-spin" : ""}/> Refresh</button>
          </div>
          {loading && activeItems.length === 0 ? <p className="py-8 text-xs text-[#765D4B]">Loading records…</p> : activeItems.length === 0 ? (
            <div className="mt-4 border border-dashed border-[#B9AA9A] p-8 text-center"><BookOpen size={20} className="mx-auto text-[#8A7A6B]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[.15em]">Nothing here yet</p><p className="mt-2 text-xs text-[#6B625A]">Your first {active === "memory" ? "memory" : active === "instructions" ? "instruction" : "task"} can start as a draft.</p></div>
          ) : (
            <div className="mt-4 space-y-3">
              {activeItems.map((item, index) => <article key={readable(item.id) || index} className="border border-[#CFC4B7] bg-[#F5F0E9] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#765D4B]">{readable(item.status) || "Saved"}</span><span className="text-[9px] uppercase tracking-[.12em] text-[#8A7A6B]">{readable(item.memory_type || item.scope || item.priority)}</span></div>
                <h3 className="mt-3 text-xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">{readable(item.title) || "Untitled record"}</h3>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#514941]">{readable(item.content || item.objective)}</p>
                {item.created_at ? <p className="mt-3 text-[9px] text-[#8A7A6B]">{new Date(String(item.created_at)).toLocaleString()}</p> : null}
              </article>)}
            </div>
          )}
        </div>

        <aside className="h-fit border border-[#CFC4B7] bg-[#F5F0E9] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#765D4B]"><Plus size={16}/><p className="text-[9px] font-bold uppercase tracking-[.18em]">Create a draft</p></div>
          <h2 className="mt-3 text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">ADD TO {active.toUpperCase()}</h2>
          <form onSubmit={createDraft} className="mt-5 space-y-4">
            <label className="block text-[10px] font-bold uppercase tracking-[.12em]">Title<input required maxLength={200} value={title} onChange={e => setTitle(e.target.value)} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"/></label>
            {active === "memory" ? <label className="block text-[10px] font-bold uppercase tracking-[.12em]">Memory type<select value={memoryType} onChange={e => setMemoryType(e.target.value)} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal"><option value="brand">Brand</option><option value="project">Project</option><option value="decision">Decision</option><option value="research">Research</option><option value="lesson">Lesson</option><option value="working_context">Working context</option><option value="agent_feedback">Agent feedback</option></select></label> : null}
            {active === "instructions" ? <label className="block text-[10px] font-bold uppercase tracking-[.12em]">Instruction scope<select value={scope} onChange={e => setScope(e.target.value)} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal"><option value="global">Global</option><option value="project">Project</option><option value="agent">Agent</option></select></label> : null}
            {active === "tasks" ? <label className="block text-[10px] font-bold uppercase tracking-[.12em]">Priority<select value={priority} onChange={e => setPriority(e.target.value)} className="mt-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label> : null}
            <label className="block text-[10px] font-bold uppercase tracking-[.12em]">{active === "tasks" ? "Objective" : "Content"}<textarea required maxLength={20000} rows={7} value={content} onChange={e => setContent(e.target.value)} className="mt-2 w-full resize-y border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal leading-6 outline-none focus:border-black"/></label>
            <button type="submit" disabled={saving || !title.trim() || !content.trim()} className="w-full bg-black px-5 py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB] disabled:opacity-40">{saving ? "Saving…" : "Save as draft"}</button>
          </form>
          <div className="mt-5 flex gap-2 border-t border-[#CFC4B7] pt-4 text-[10px] leading-5 text-[#765D4B]"><AlertCircle size={14} className="mt-0.5 shrink-0"/><p>Drafts are saved to the private department database. They are not approved, assigned, published or executed by this action.</p></div>
          {notice ? <p role="status" className="mt-4 flex items-start gap-2 text-xs text-[#42634C]"><CheckCircle2 size={15} className="mt-0.5 shrink-0"/>{notice}</p> : null}
          {error ? <p role="alert" className="mt-4 text-xs leading-5 text-[#8B3327]">{error}</p> : null}
        </aside>
      </div>
    </section>
  );
}
