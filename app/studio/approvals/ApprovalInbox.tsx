"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X, Clock3, Inbox } from "lucide-react";

type Item = Record<string, unknown> & { id: string; title?: string; content?: string; objective?: string; status?: string; scope?: string; memory_type?: string; priority?: string };

function label(value: unknown) { return typeof value === "string" ? value.replaceAll("_", " ") : ""; }

export default function ApprovalInbox() {
  const [memory, setMemory] = useState<Item[]>([]);
  const [instructions, setInstructions] = useState<Item[]>([]);
  const [tasks, setTasks] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const responses = await Promise.all([
        fetch("/api/studio/departments/memory", { cache: "no-store" }),
        fetch("/api/studio/departments/instructions", { cache: "no-store" }),
        fetch("/api/studio/departments/tasks?status=review"),
        fetch("/api/studio/departments/tasks?status=awaiting_founder"),
      ]);
      const payloads = await Promise.all(responses.map(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || (r.status === 401 ? "Founder authentication is required. Sign in to the founder account, then reload." : "The approval queue could not be loaded."));
        return data;
      }));
      setMemory((payloads[0].items ?? []).filter((x: Item) => ["draft", "pending_review"].includes(String(x.status))));
      setInstructions((payloads[1].items ?? []).filter((x: Item) => ["draft", "pending_review"].includes(String(x.status))));
      const combined = [...(payloads[2].items ?? []), ...(payloads[3].items ?? [])];
      setTasks(Array.from(new Map(combined.map((x: Item) => [x.id, x])).values()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load approvals.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function act(resource: "memory" | "instructions" | "tasks", item: Item, decision?: string) {
    const key = resource + ":" + item.id;
    setBusy(key); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/studio/departments/${resource}/${item.id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: resource === "tasks" ? JSON.stringify({ decision, rationale: "Founder decision recorded in the Studio approval inbox." }) : "{}",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "The decision could not be saved.");
      setNotice(resource === "tasks" ? `Task ${label(decision)}.` : `${resource === "memory" ? "Memory" : "Instruction"} approved.`);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "The decision could not be saved."); }
    finally { setBusy(null); }
  }

  function Card({ item, kind }: { item: Item; kind: "memory" | "instructions" | "tasks" }) {
    const key = kind + ":" + item.id;
    const heading = typeof item.title === "string" ? item.title : "Untitled task";
    const body = kind === "tasks" ? item.objective : item.content;
    return <article className="rounded-lg border border-[#CFC4B7] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-[.13em] text-[#765D4B]">
        <span>{label(kind === "memory" ? item.memory_type : kind === "instructions" ? item.scope : item.priority) || kind}</span>
        <span>·</span><span>{label(item.status)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{heading}</h3>
      {typeof body === "string" && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#514941]">{body}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {kind === "tasks" ? <>
          <button disabled={busy === key} onClick={() => void act(kind, item, "approved")} className="inline-flex items-center gap-2 bg-black px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"><Check size={14}/> Approve</button>
          <button disabled={busy === key} onClick={() => void act(kind, item, "changes_requested")} className="inline-flex items-center gap-2 border border-[#CFC4B7] px-4 py-2 text-xs font-semibold disabled:opacity-50"><RefreshCw size={14}/> Request changes</button>
          <button disabled={busy === key} onClick={() => void act(kind, item, "rejected")} className="inline-flex items-center gap-2 border border-[#CFC4B7] px-4 py-2 text-xs font-semibold disabled:opacity-50"><X size={14}/> Reject</button>
        </> : <button disabled={busy === key} onClick={() => void act(kind, item)} className="inline-flex items-center gap-2 bg-black px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"><Check size={14}/> Approve {kind === "memory" ? "memory" : "instruction"}</button>}
      </div>
    </article>;
  }

  const total = memory.length + instructions.length + tasks.length;
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Founder control</p><h2 className="mt-1 text-2xl font-semibold">Your approval inbox</h2><p className="mt-1 text-xs text-[#6B625A]">Nothing is published or approved without your decision.</p></div>
      <button onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 border border-[#CFC4B7] px-3 py-2 text-xs font-semibold disabled:opacity-50"><RefreshCw size={14}/> Refresh</button>
    </div>
    {notice && <p role="status" className="border border-[#9C8B78] bg-white p-3 text-sm">{notice}</p>}
    {error && <p role="alert" className="border border-[#B98B69] bg-white p-3 text-sm text-[#765D4B]">{error}</p>}
    {loading ? <p className="py-8 text-sm text-[#765D4B]">Loading your approval queue…</p> : total === 0 ? <div className="border border-dashed border-[#B9AA9A] bg-[#F5F0E9] px-5 py-12 text-center"><Inbox className="mx-auto mb-3 text-[#765D4B]" size={26}/><p className="font-semibold">Nothing waiting for your approval.</p><p className="mt-2 text-xs text-[#6B625A]">New memory drafts, instructions and completed agent tasks will appear here.</p></div> : <>
      {tasks.length > 0 && <section className="space-y-3"><h3 className="flex items-center gap-2 text-sm font-bold"><Clock3 size={16}/> Work awaiting your decision ({tasks.length})</h3>{tasks.map(item => <Card key={item.id} item={item} kind="tasks"/>)}</section>}
      {memory.length > 0 && <section className="space-y-3"><h3 className="text-sm font-bold">Memory drafts ({memory.length})</h3><p className="text-xs text-[#6B625A]">Approving makes these records available to the Brain as trusted project knowledge.</p>{memory.map(item => <Card key={item.id} item={item} kind="memory"/>)}</section>}
      {instructions.length > 0 && <section className="space-y-3"><h3 className="text-sm font-bold">Instruction drafts ({instructions.length})</h3><p className="text-xs text-[#6B625A]">Only approve instructions you want the agents to follow as standing guidance.</p>{instructions.map(item => <Card key={item.id} item={item} kind="instructions"/>)}</section>}
    </>}
  </section>;
}
