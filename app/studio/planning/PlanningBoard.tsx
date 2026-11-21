"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BrainCircuit, Plus, ShieldCheck, Trash2 } from "lucide-react";

type Task = { id: string; title: string; owner: string; status: string };
type Risk = { id: string; title: string; impact: string; mitigation: string };
type Plan = { name: string; outcome: string; deadline: string; tasks: Task[]; risks: Risk[] };

const blank: Plan = { name: "New project plan", outcome: "", deadline: "", tasks: [], risks: [] };

export default function PlanningBoard() {
  const [plan, setPlan] = useState<Plan>(blank);
  const [taskTitle, setTaskTitle] = useState("");
  const [riskTitle, setRiskTitle] = useState("");
  const [riskMitigation, setRiskMitigation] = useState("");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem("toc-studio-plan-v1"); if (raw) setPlan(JSON.parse(raw) as Plan); } catch { /* Use a blank plan. */ }
    setReady(true);
  }, []);

  const update = (patch: Partial<Plan>) => { setPlan((current) => ({ ...current, ...patch })); setSaved(false); };
  const addTask = () => {
    if (!taskTitle.trim()) return;
    update({ tasks: [...plan.tasks, { id: crypto.randomUUID(), title: taskTitle.trim(), owner: "Brain to assign", status: "Not started" }] });
    setTaskTitle("");
  };
  const addRisk = () => {
    if (!riskTitle.trim()) return;
    update({ risks: [...plan.risks, { id: crypto.randomUUID(), title: riskTitle.trim(), impact: "Needs assessment", mitigation: riskMitigation.trim() }] });
    setRiskTitle(""); setRiskMitigation("");
  };
  const save = () => { localStorage.setItem("toc-studio-plan-v1", JSON.stringify(plan)); setSaved(true); };

  return <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-9">
    <p className="mb-5 text-[10px] font-bold uppercase tracking-[.25em] text-[#765D4B]">Think it through before we do it</p>
    <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] leading-[.82] tracking-[-.05em] [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">THE PLANNING<br/>ROOM.</h1>
    <p className="mt-7 max-w-2xl text-sm leading-7 text-[#514941]">A place to turn an idea into a brief, assign work to agents, track milestones and surface risks before you approve the plan.</p>
    <section className="mt-9 grid gap-4 border border-[#CFC4B7] bg-[#F5F0E9] p-5 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center gap-3 border-b border-[#CFC4B7] pb-4"><BrainCircuit size={21} className="text-[#765D4B]"/><div><p className="text-[10px] font-bold uppercase tracking-[.18em]">The Brain's briefing desk</p><p className="mt-1 text-xs text-[#6B625A]">Define the outcome. The future orchestrator will turn it into agent assignments and a decision brief.</p></div></div>
      <label className="text-xs font-semibold">Plan name<input value={plan.name} onChange={(e) => update({ name: e.target.value })} className="mt-2 block w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal"/></label>
      <label className="text-xs font-semibold">Target date<input type="date" value={plan.deadline} onChange={(e) => update({ deadline: e.target.value })} className="mt-2 block w-full border border-[#CFC4B7] bg-white px-3 py-3 text-sm font-normal"/></label>
      <label className="text-xs font-semibold md:col-span-2">What does success look like?<textarea rows={3} value={plan.outcome} onChange={(e) => update({ outcome: e.target.value })} placeholder="Describe the result you want, who it is for, and why it matters..." className="mt-2 block w-full border border-[#CFC4B7] bg-white p-3 text-sm font-normal"/></label>
      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] text-[#765D4B]">Draft storage: this browser only for now.</p><button onClick={save} className="bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#EAE4DB]">{saved ? "Plan saved ✓" : "Save plan"}</button></div>
    </section>

    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="border border-[#CFC4B7] bg-[#F5F0E9] p-5">
        <div className="mb-4 flex items-center gap-2"><Plus size={17}/><h2 className="text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">WORKSTREAMS & TASKS</h2></div>
        <div className="flex gap-2"><input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addTask(); }} placeholder="Add a task or milestone..." className="min-w-0 flex-1 border border-[#CFC4B7] bg-white px-3 py-3 text-xs"/><button onClick={addTask} className="bg-black px-4 text-xs text-white">Add</button></div>
        <div className="mt-4 space-y-2">{plan.tasks.length ? plan.tasks.map((task) => <div key={task.id} className="flex flex-wrap items-center gap-2 border border-[#D8CEC3] bg-white p-3"><span className="min-w-0 flex-1 text-xs">{task.title}</span><select value={task.status} onChange={(e) => update({ tasks: plan.tasks.map((t) => t.id === task.id ? { ...t, status: e.target.value } : t) })} className="border border-[#D8CEC3] p-2 text-[10px]"><option>Not started</option><option>In progress</option><option>Blocked</option><option>Done</option></select><button aria-label="Delete task" onClick={() => update({ tasks: plan.tasks.filter((t) => t.id !== task.id) })}><Trash2 size={14}/></button></div>) : <p className="py-6 text-xs text-[#765D4B]">Your milestones and agent assignments will appear here.</p>}</div>
      </section>
      <section className="border border-[#CFC4B7] bg-[#F5F0E9] p-5">
        <div className="mb-4 flex items-center gap-2"><AlertTriangle size={17}/><h2 className="text-2xl [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif]">RISK REGISTER</h2></div>
        <input value={riskTitle} onChange={(e) => setRiskTitle(e.target.value)} placeholder="What could go wrong?" className="mb-2 w-full border border-[#CFC4B7] bg-white px-3 py-3 text-xs"/>
        <textarea rows={2} value={riskMitigation} onChange={(e) => setRiskMitigation(e.target.value)} placeholder="Possible mitigation or question to investigate..." className="mb-2 w-full border border-[#CFC4B7] bg-white p-3 text-xs"/>
        <button onClick={addRisk} className="border border-[#292522] px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Add risk</button>
        <div className="mt-4 space-y-2">{plan.risks.length ? plan.risks.map((risk) => <div key={risk.id} className="border border-[#D8CEC3] bg-white p-3"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold">{risk.title}</p><button aria-label="Delete risk" onClick={() => update({ risks: plan.risks.filter((r) => r.id !== risk.id) })}><Trash2 size={14}/></button></div><p className="mt-2 text-[10px] leading-5 text-[#765D4B]">{risk.mitigation || "Mitigation to be defined."}</p></div>) : <p className="py-6 text-xs text-[#765D4B]">Capture uncertainties early. The Brain will eventually add a risk review before approval.</p>}</div>
      </section>
    </div>
    <section className="mt-8 flex items-start gap-3 border-l-2 border-[#765D4B] pl-4"><ShieldCheck size={19} className="mt-1 shrink-0 text-[#765D4B]"/><div><h3 className="text-sm font-bold">Decision gate — your approval stays central</h3><p className="mt-1 max-w-3xl text-xs leading-6 text-[#6B625A]">Before execution, the Brain should present the proposed plan, agent owners, timeline, dependencies, assumptions, risks, estimated costs and confidence level. Nothing is published, purchased or pushed to the live website without your approval.</p></div></section>
    {!ready && <p className="sr-only">Loading plan</p>}
  </div>;
}
