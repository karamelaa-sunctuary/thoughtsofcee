import { NextResponse } from "next/server";
import { getFounderContext } from "@/lib/supabase/founder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEMORY_TYPES = ["brand", "project", "decision", "research", "lesson", "working_context", "agent_feedback"] as const;
const STATUSES = ["draft", "pending_review", "approved", "superseded", "archived"] as const;
const TASK_STATUSES = ["draft", "ready", "assigned", "running", "review", "awaiting_founder", "approved", "completed", "changes_requested", "rejected", "blocked", "failed", "cancelled"] as const;
const PRIORITIES = ["low", "normal", "high", "urgent"] as const;
const SCOPES = ["global", "project", "agent"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeDiagnosticMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/https?:\/\/[^\s"'<>]+/gi, "[url]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[token]")
    .replace(/(key|secret|token|password|authorization)\s*[:=]\s*[^\s,;]+/gi, "$1=[redacted]")
    .slice(0, 240);
}

function logDepartmentFailure(stage: string, error: unknown) {
  const detail = isObject(error) ? error : {};
  console.error("[studio-departments] request failed", {
    stage,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode: typeof detail.code === "string" ? detail.code.slice(0, 40) : undefined,
    message: safeDiagnosticMessage(error instanceof Error ? error.message : detail.message),
  });
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  let stage = "founder_context";
  try {
    const founder = await getFounderContext();
    if (!founder) return NextResponse.json({ error: "Verified founder identity required." }, { status: 401 });

    const { resource } = await context.params;
    const filter = new URL(request.url).searchParams;
    const status = filter.get("status");
    const scope = filter.get("scope");

    if (resource === "memory") {
      stage = "memory_list_rpc";
      if (status && !STATUSES.includes(status as (typeof STATUSES)[number])) {
        return NextResponse.json({ error: "Unsupported memory status." }, { status: 400 });
      }
      const { data, error } = await founder.supabase.rpc("studio_memory_list", { p_status: status });
      if (error) {
        logDepartmentFailure(stage, error);
        return NextResponse.json({ error: "Memory could not be loaded." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, items: data ?? [] });
    }

    if (resource === "instructions") {
      stage = "instruction_list_rpc";
      if (scope && !SCOPES.includes(scope as (typeof SCOPES)[number])) {
        return NextResponse.json({ error: "Unsupported instruction scope." }, { status: 400 });
      }
      const { data, error } = await founder.supabase.rpc("studio_instruction_list", { p_scope: scope });
      if (error) {
        logDepartmentFailure(stage, error);
        return NextResponse.json({ error: "Instructions could not be loaded." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, items: data ?? [] });
    }

    if (resource === "tasks") {
      stage = "task_list_rpc";
      if (status && !TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) {
        return NextResponse.json({ error: "Unsupported task status." }, { status: 400 });
      }
      const { data, error } = await founder.supabase.rpc("studio_task_list", { p_status: status });
      if (error) {
        logDepartmentFailure(stage, error);
        return NextResponse.json({ error: "Tasks could not be loaded." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, items: data ?? [] });
    }

    return NextResponse.json({ error: "Unknown department resource." }, { status: 404 });
  } catch (error) {
    logDepartmentFailure(stage, error);
    return NextResponse.json({ error: "Department service is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const founder = await getFounderContext();
    if (!founder) return NextResponse.json({ error: "Verified founder identity required." }, { status: 401 });

    const { resource } = await context.params;
    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (!isObject(body)) return NextResponse.json({ error: "A JSON object is required." }, { status: 400 });

    if (resource === "memory") {
      const memoryType = body.memory_type;
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const content = typeof body.content === "string" ? body.content.trim() : "";
      const sourceRef = body.source_ref == null ? null : typeof body.source_ref === "string" ? body.source_ref.trim() : undefined;
      const provenance = body.provenance == null ? null : typeof body.provenance === "string" ? body.provenance.trim() : undefined;

      if (typeof memoryType !== "string" || !MEMORY_TYPES.includes(memoryType as (typeof MEMORY_TYPES)[number])) {
        return NextResponse.json({ error: "Unsupported memory_type." }, { status: 400 });
      }
      if (!title || title.length > 200 || !content || content.length > 20000) {
        return NextResponse.json({ error: "Title is required (max 200 characters); content is required (max 20,000 characters)." }, { status: 400 });
      }
      if (sourceRef === undefined || provenance === undefined || (sourceRef && sourceRef.length > 2000) || (provenance && provenance.length > 4000)) {
        return NextResponse.json({ error: "source_ref or provenance is invalid or too long." }, { status: 400 });
      }

      const { data, error } = await founder.supabase.rpc("studio_memory_create", {
        p_memory_type: memoryType, p_title: title, p_content: content,
        p_source_ref: sourceRef, p_provenance: provenance,
      });
      if (error || typeof data !== "string") return NextResponse.json({ error: "Memory draft could not be created." }, { status: 503 });
      return NextResponse.json({ ok: true, id: data, status: "draft" }, { status: 201 });
    }

    if (resource === "instructions") {
      const scope = body.scope;
      const scopeRef = body.scope_ref == null ? null : typeof body.scope_ref === "string" ? body.scope_ref.trim() : undefined;
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const content = typeof body.content === "string" ? body.content.trim() : "";

      if (typeof scope !== "string" || !SCOPES.includes(scope as (typeof SCOPES)[number])) {
        return NextResponse.json({ error: "scope must be global, project or agent." }, { status: 400 });
      }
      if (scopeRef === undefined || (scopeRef && scopeRef.length > 500)) {
        return NextResponse.json({ error: "scope_ref is invalid or too long." }, { status: 400 });
      }
      if (!title || title.length > 200 || !content || content.length > 20000) {
        return NextResponse.json({ error: "Title is required (max 200 characters); content is required (max 20,000 characters)." }, { status: 400 });
      }

      const { data, error } = await founder.supabase.rpc("studio_instruction_create", {
        p_scope: scope, p_scope_ref: scopeRef, p_title: title, p_content: content,
      });
      if (error || typeof data !== "string") return NextResponse.json({ error: "Instruction draft could not be created." }, { status: 503 });
      return NextResponse.json({ ok: true, id: data, status: "draft" }, { status: 201 });
    }

    if (resource === "tasks") {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const objective = typeof body.objective === "string" ? body.objective.trim() : "";
      const priority = body.priority === undefined ? "normal" : body.priority;
      const criteria = body.acceptance_criteria === undefined ? [] : body.acceptance_criteria;

      if (!title || title.length > 240 || !objective || objective.length > 20000) {
        return NextResponse.json({ error: "Title is required (max 240 characters); objective is required (max 20,000 characters)." }, { status: 400 });
      }
      if (typeof priority !== "string" || !PRIORITIES.includes(priority as (typeof PRIORITIES)[number])) {
        return NextResponse.json({ error: "Unsupported task priority." }, { status: 400 });
      }
      if (!Array.isArray(criteria) || criteria.length > 30 || criteria.some((item) => typeof item !== "string" || item.trim().length === 0 || item.length > 500)) {
        return NextResponse.json({ error: "acceptance_criteria must be an array of up to 30 non-empty strings (max 500 characters each)." }, { status: 400 });
      }

      const { data, error } = await founder.supabase.rpc("studio_task_create", {
        p_title: title, p_objective: objective, p_priority: priority, p_acceptance_criteria: criteria,
      });
      if (error || typeof data !== "string") return NextResponse.json({ error: "Task draft could not be created." }, { status: 503 });
      return NextResponse.json({ ok: true, id: data, status: "draft" }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown department resource." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Department service is unavailable." }, { status: 503 });
  }
}
