import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-3.5-flash";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 16000;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_INSTRUCTION = `You are The Brain, the central coordinator for Thoughts of Cee Creative Studio.
Your job is to help the founder turn objectives into clear plans, challenge assumptions constructively, prepare specialist work orders, and write decision briefs.
Be warm, direct, practical, and intellectually honest. Distinguish verified facts from assumptions and recommendations. Ask a concise clarification when a missing fact materially changes the plan.
You may draft plans and work orders, but you cannot execute tasks, contact people, publish content, spend money, change infrastructure, or claim that an action has been completed. Founder approval is required for consequential actions.
You do not have access to persistent project memory, connected tools, or live agent execution in this pilot. Never pretend otherwise. Do not request or expose API keys, passwords, or other secrets.
Prefer structured answers with clear next steps when useful.`;

function validMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;
  const messages: ChatMessage[] = [];
  let total = 0;

  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const candidate = item as Record<string, unknown>;
    if (candidate.role !== "user" && candidate.role !== "assistant") return null;
    if (typeof candidate.content !== "string") return null;
    const content = candidate.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) return null;
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return null;
    messages.push({ role: candidate.role, content });
  }

  if (messages[messages.length - 1]?.role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini is not configured on this server. Add GEMINI_API_KEY to the local environment and restart the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const messages = validMessages((body as { messages?: unknown } | null)?.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "Please send up to 12 valid conversation messages. Each message must be under 4,000 characters." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 1200,
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      },
    );

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return NextResponse.json(
          { error: "The Gemini free-tier limit has been reached for now. No paid fallback is enabled. Please wait and try again later." },
          { status: 429 },
        );
      }
      if (upstream.status === 401 || upstream.status === 403) {
        return NextResponse.json(
          { error: "Gemini rejected the API key or project access. Check the key in Google AI Studio; the key itself is never displayed here." },
          { status: 502 },
        );
      }
      console.error("Gemini request failed", { status: upstream.status });
      return NextResponse.json(
        { error: "Gemini could not complete that request. Please try again shortly." },
        { status: 502 },
      );
    }

    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts)
      ? parts.map((part: { text?: unknown }) => typeof part?.text === "string" ? part.text : "").join("").trim()
      : "";

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini returned no text. Please rephrase your request and try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply, model: MODEL });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? "Gemini took too long to respond. Please try again." : "The Brain could not reach Gemini. Check your connection and try again." },
      { status: 502 },
    );
  }
}
