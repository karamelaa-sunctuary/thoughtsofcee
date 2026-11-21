"use client";

import { useState } from "react";
import { ArrowUp, LoaderCircle, RotateCcw } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
const starter: Message = {
  role: "assistant",
  content: "I'm The Brain. I can turn an objective into a plan, challenge assumptions, prepare specialist work orders and return a decision brief. I will be clear about what I can actually execute versus what is still awaiting a connected agent runtime. What should we work on first?"
};

export default function BrainConsole({ configured }: { configured: boolean }) {
  const [messages, setMessages] = useState<Message[]>([starter]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(value?: string) {
    const content = (value ?? draft).trim();
    if (!content || busy || !configured) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/studio/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "The Brain could not respond.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  }

  const reset = () => { setMessages([starter]); setDraft(""); setError(""); };

  return <section className="overflow-hidden border border-[#CFC4B7] bg-[#F5F0E9]">
    <div className="flex items-center justify-between border-b border-[#CFC4B7] px-4 py-4 sm:px-6">
      <div><p className="text-[10px] font-bold uppercase tracking-[.17em]">Brain console</p><p className="mt-1 text-[10px] text-[#765D4B]">Supervised conversation · recent context only</p></div>
      <button onClick={reset} disabled={busy} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#765D4B] disabled:opacity-40"><RotateCcw size={13}/> New session</button>
    </div>
    <div className="max-h-[560px] min-h-[300px] space-y-4 overflow-y-auto p-4 sm:p-6">
      {messages.map((message, index) => <div key={index} className={message.role === "user" ? "ml-auto max-w-[88%] bg-[#292522] px-4 py-3 text-sm leading-6 text-[#F5F0E9]" : "mr-auto max-w-[94%] border border-[#D8CEC3] bg-white px-4 py-3 text-sm leading-6 text-[#292522]"}>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[.15em] opacity-60">{message.role === "user" ? "You" : "The Brain"}</p>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>)}
      {busy && <div className="flex items-center gap-2 text-xs text-[#765D4B]"><LoaderCircle size={15} className="animate-spin"/> The Brain is thinking…</div>}
      {error && <p role="alert" className="border border-[#B98B69] bg-white px-3 py-2 text-xs text-[#765D4B]">{error}</p>}
    </div>
    <div className="border-t border-[#CFC4B7] p-4 sm:p-5">
      {!configured && <p className="mb-3 text-xs leading-5 text-[#765D4B]">Live AI chat is intentionally paused to honour the zero-cost decision. No paid API key is needed or requested. We are building secure founder memory first, then we will test a genuinely free model option before reconnecting chat.</p>}
      <form onSubmit={(e) => { e.preventDefault(); void send(); }} className="flex items-end gap-2">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} rows={3} maxLength={4000} disabled={!configured || busy} placeholder="Give The Brain an objective, ask it to challenge an idea, or request a specialist work order…" className="min-h-[76px] flex-1 resize-y border border-[#CFC4B7] bg-white p-3 text-sm outline-none focus:border-[#765D4B] disabled:opacity-50"/>
        <button type="submit" disabled={!configured || busy || !draft.trim()} aria-label="Send to The Brain" className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white disabled:opacity-30"><ArrowUp size={18}/></button>
      </form>
      <p className="mt-2 text-[9px] text-[#8A7A6B]">Enter to send · Shift + Enter for a new line · This first version does not save chat history to the cloud.</p>
    </div>
  </section>;
}
