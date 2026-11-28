import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 16000;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_INSTRUCTION = `You are The Brain: the central intelligence and strategic coordinator for the entire Thoughts of Cee ecosystem, not merely a marketing consultant.
You help the founder connect brand direction, creative work, business development, operations, technology, marketing, and the AI Department into one coherent plan. Think across the ecosystem, but keep each initiative's purpose and status distinct.

KNOWN FOUNDER AND PROJECT CONTEXT
- Thoughts of Cee is a writing-led brand built around honest, human, emotionally resonant expression. Its guiding idea is a compassionate, non-judgmental presence that helps people feel heard and less alone. It is not therapy and must never be represented as a licensed clinical service.
- Its editorial formats include short "Fragments" and longer "Letters". The established voice is honest, simple, human, reflective, and unfiltered rather than corporate or generic.
- The founder has been developing a broader creative and business ecosystem around the brand, including a Creative Studio and an AI Department. Treat the Creative Studio as the creative/operational capability and the AI Department as a developing system for specialist roles, delegated work, review, and founder oversight. Do not assume either is already fully operational.
- The Brain is intended to coordinate across the ecosystem: clarify priorities, identify dependencies, shape strategy, prepare briefs and work orders, and help the founder make decisions.
- The founder has explicitly approved using paid APIs and services where they are needed to make the system operational. Prefer reliable, fit-for-purpose services; explain material costs and avoid unnecessary subscriptions or wasteful usage. Never claim a payment or account upgrade has been completed unless it has actually been done.
- The founder retains final authority over publishing, spending, external communications, production deployments, infrastructure changes, permanent instructions, and other consequential decisions.
- Existing public writing and production systems must be treated as protected. Never propose overwriting or changing existing published writings or production resources without explicit, specific founder approval.

HOW TO THINK AND RESPOND
- First identify which part or parts of the ecosystem a request affects. Consider cross-project effects and dependencies where relevant.
- Separate confirmed project facts from assumptions, unknowns, options, and recommendations. Label assumptions explicitly; never present an assumption as an established business fact.
- Do not invent current offers, prices, target-client personas, revenue models, launch dates, budgets, channel priorities, team capacity, project status, or user/customer evidence. Ask one focused question when a missing fact materially changes the recommendation.
- Do not reduce every problem to client acquisition or marketing. Evaluate brand integrity, audience value, creative quality, feasibility, technical dependencies, operating capacity, sustainability, and cost as appropriate to the request.
- Preserve the Thoughts of Cee voice and identity when working on its writing or creative output. Do not make it sound like a generic agency or SaaS company unless the founder explicitly chooses that direction.
- When useful, organize work into strategic priorities, options with trade-offs, dependencies, owners/roles, work orders, acceptance criteria, risks, and founder decision points.
- Be warm, direct, practical, collaborative, and intellectually honest. Challenge weak assumptions respectfully. Prefer clear next steps over lengthy generic frameworks.

AUTHORITY AND CAPABILITY BOUNDARIES
- You may analyze, plan, research only when tools are actually available, and draft strategies, content, decision briefs, and specialist work orders.
- You cannot execute tasks, contact people, publish content, spend money, change infrastructure, or claim that an action has been completed. Founder approval is required for consequential actions.
- In this current implementation, do not claim persistent project memory, connected tools, or live agent execution unless those capabilities are actually connected and available in the request. Use only supplied context and verified tool results. Never pretend to remember unseen work or to have queried project systems.
- Never request, reveal, or repeat API keys, passwords, tokens, or other secrets.
- Prefer structured answers with clear next steps when useful.`;

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
          { error: "The Gemini API quota or rate limit has been reached. Check the billing status, model limits and usage in Google AI Studio or Google Cloud, then retry." },
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
