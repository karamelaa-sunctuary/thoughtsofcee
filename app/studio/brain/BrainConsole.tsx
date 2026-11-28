"use client";

import { createElement, useState } from "react";
import { ArrowUp, LoaderCircle, RotateCcw } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; usage?: string };
const starter: Message = {
  role: "assistant",
  content: "I'm The Brain. I can use approved shared project memory when it is available, turn objectives into plans, challenge assumptions and prepare specialist work orders. Live agent execution is still being connected. What should we work on first?"
};

function inlineMarkdown(value: string) {
  return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\x60[^\x60]+\x60)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return createElement("strong", { key: index }, part.slice(2, -2));
    if (part.startsWith("*") && part.endsWith("*")) return createElement("em", { key: index }, part.slice(1, -1));
    if (part.startsWith("`") && part.endsWith("`")) return createElement("code", { key: index, className: "rounded bg-[#EEE8E0] px-1 py-0.5 text-[0.9em]" }, part.slice(1, -1));
    return part;
  });
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  return <div className="space-y-2">
    {lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={index} className="h-1"/>;
      const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
      if (heading) return createElement("h" + Math.min(heading[1].length, 3), { key: index, className: "pt-2 font-semibold leading-snug" }, inlineMarkdown(heading[2]));
      if (/^[-*_]{3,}$/.test(trimmed)) return createElement("hr", { key: index, className: "my-3 border-[#D8CEC3]" });
      if (/^>\s?/.test(trimmed)) return createElement("blockquote", { key: index, className: "border-l-2 border-[#B9AA9A] pl-3 italic text-[#6B625A]" }, inlineMarkdown(trimmed.replace(/^>\s?/, "")));
      if (/^[-*+]\s+/.test(trimmed)) return createElement("div", { key: index, className: "flex gap-2 pl-1" }, createElement("span", { className: "text-[#765D4B]" }, "•"), createElement("span", null, inlineMarkdown(trimmed.replace(/^[-*+]\s+/, ""))));
      if (/^\d+[.)]\s+/.test(trimmed)) {
        const match = /^(\d+[.)])\s+(.+)$/.exec(trimmed)!;
        return createElement("div", { key: index, className: "flex gap-2 pl-1" }, createElement("span", { className: "font-semibold text-[#765D4B]" }, match[1]), createElement("span", null, inlineMarkdown(match[2])));
      }
      return createElement("p", { key: index, className: "leading-6" }, inlineMarkdown(line));
    })}
  </div>;
}

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
        body: JSON.stringify({ messages: next.slice(-12).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "The Brain could not respond.");
      const notice = data.truncated ? "\n\n**Response limit reached:** this answer may be incomplete. Ask me to continue." : "";
      const memoryNote = data.memory === "connected" ? "\n\n_Shared approved project memory: connected._" : "\n\n_Shared project memory: unavailable for this request._";
      const usage = data.usage ? `Model: ${data.model || "Gemini"} · Tokens: ${data.usage.totalTokenCount ?? "not reported"}` : `Model: ${data.model || "Gemini"}`;
      setMessages([...next, { role: "assistant", content: data.reply + notice + memoryNote, usage }]);
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
      <div><p className="text-[10px] font-bold uppercase tracking-[.17em]">Brain console</p><p className="mt-1 text-[10px] text-[#765D4B]">Supervised conversation · approved shared memory when available</p></div>
      <button onClick={reset} disabled={busy} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#765D4B] disabled:opacity-40"><RotateCcw size={13}/> New session</button>
    </div>
    <div className="max-h-[560px] min-h-[300px] space-y-4 overflow-y-auto p-4 sm:p-6">
      {messages.map((message, index) => <div key={index} className={message.role === "user" ? "ml-auto max-w-[88%] bg-[#292522] px-4 py-3 text-sm leading-6 text-[#F5F0E9]" : "mr-auto max-w-[94%] border border-[#D8CEC3] bg-white px-4 py-3 text-sm leading-6 text-[#292522]"}>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[.15em] opacity-60">{message.role === "user" ? "You" : "The Brain"}</p>
        {message.role === "assistant" ? <MarkdownMessage content={message.content}/> : <p className="whitespace-pre-wrap">{message.content}</p>}
        {message.usage && <p className="mt-3 border-t border-[#EEE8E0] pt-2 text-[9px] text-[#8A7A6B]">{message.usage}</p>}
      </div>)}
      {busy && <div className="flex items-center gap-2 text-xs text-[#765D4B]"><LoaderCircle size={15} className="animate-spin"/> The Brain is thinking…</div>}
      {error && <p role="alert" className="border border-[#B98B69] bg-white px-3 py-2 text-xs text-[#765D4B]">{error}</p>}
    </div>
    <div className="border-t border-[#CFC4B7] p-4 sm:p-5">
      {!configured && <p className="mb-3 text-xs leading-5 text-[#765D4B]">Live AI chat is paused until the Gemini API key is configured on the server. Add GEMINI_API_KEY to the local environment or Vercel project settings. Never paste the key into this chat or browser code.</p>}
      <form onSubmit={(e) => { e.preventDefault(); void send(); }} className="flex items-end gap-2">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} rows={3} maxLength={4000} disabled={!configured || busy} placeholder="Give The Brain an objective, ask it to challenge an idea, or request a specialist work order…" className="min-h-[76px] flex-1 resize-y border border-[#CFC4B7] bg-white p-3 text-sm outline-none focus:border-[#765D4B] disabled:opacity-50"/>
        <button type="submit" disabled={!configured || busy || !draft.trim()} aria-label="Send to The Brain" className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white disabled:opacity-30"><ArrowUp size={18}/></button>
      </form>
      <p className="mt-2 text-[9px] text-[#8A7A6B]">Enter to send · Shift + Enter for a new line · Conversation history is currently kept in this browser session and is not yet saved to shared cloud memory.</p>
    </div>
  </section>;
}
