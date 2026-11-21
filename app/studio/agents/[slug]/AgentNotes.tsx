"use client";
import { useEffect, useState } from "react";

export default function AgentNotes({ slug }: { slug: string }) {
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const key = `toc-agent-notes-v1:${slug}`;
  useEffect(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) { const parsed = JSON.parse(value); setInstructions(parsed.instructions ?? ""); setNotes(parsed.notes ?? ""); }
    } catch {}
  }, [key]);
  function save() {
    try { localStorage.setItem(key, JSON.stringify({ instructions, notes, updatedAt: new Date().toISOString() })); setSaved(true); } catch { setSaved(false); }
  }
  return <section className="mt-9 border border-[#CFC4B7] bg-[#F5F0E9] p-6">
    <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Founder input</p>
    <h2 className="mt-2 text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">MAKE THIS AGENT YOURS.</h2>
    <p className="mt-2 text-xs leading-6 text-[#6B625A]">Add your preferences, corrections, examples and instructions. These drafts are saved in this browser only for now.</p>
    <label className="mt-6 block text-[9px] font-bold uppercase tracking-[.16em] text-[#765D4B]">Instructions and preferences</label>
    <textarea value={instructions} onChange={e=>{setInstructions(e.target.value);setSaved(false)}} rows={5} placeholder="What should this agent always do? What should it avoid?" className="mt-2 w-full border border-[#CFC4B7] bg-[#EAE4DB] p-4 text-sm leading-6 outline-none focus:border-[#765D4B]"/>
    <label className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-[#765D4B]">Examples, edits and notes</label>
    <textarea value={notes} onChange={e=>{setNotes(e.target.value);setSaved(false)}} rows={5} placeholder="Paste examples, give feedback, or note changes you want us to make..." className="mt-2 w-full border border-[#CFC4B7] bg-[#EAE4DB] p-4 text-sm leading-6 outline-none focus:border-[#765D4B]"/>
    <div className="mt-4 flex items-center gap-3"><button onClick={save} className="bg-black px-5 py-3 text-[9px] font-bold uppercase tracking-[.15em] text-[#EAE4DB]">Save my input</button>{saved && <span className="text-xs text-[#765D4B]">Saved in this browser.</span>}</div>
  </section>;
}
