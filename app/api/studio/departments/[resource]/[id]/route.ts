import { NextResponse } from "next/server";
import { getFounderContext } from "@/lib/supabase/founder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DECISIONS = ["approved", "rejected", "changes_requested", "deferred"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const founder = await getFounderContext();
    if (!founder) return NextResponse.json({ error: "Verified founder identity required." }, { status: 401 });

    const { resource, id } = await context.params;
    if (!UUID.test(id)) return NextResponse.json({ error: "A valid record ID is required." }, { status: 400 });

    if (resource === "memory") {
      const { data, error } = await founder.supabase.rpc("studio_memory_approve", { p_id: id });
      if (error) return NextResponse.json({ error: "Memory approval could not be completed." }, { status: 503 });
      if (data !== true) return NextResponse.json({ error: "Memory was not found or is not awaiting review." }, { status: 409 });
      return NextResponse.json({ ok: true, id, status: "approved" });
    }

    if (resource === "instructions") {
      const { data, error } = await founder.supabase.rpc("studio_instruction_approve", { p_id: id });
      if (error) return NextResponse.json({ error: "Instruction approval could not be completed." }, { status: 503 });
      if (data !== true) return NextResponse.json({ error: "Instruction was not found or is not awaiting review." }, { status: 409 });
      return NextResponse.json({ ok: true, id, status: "approved" });
    }

    if (resource === "tasks") {
      let body: unknown;
      try { body = await request.json(); } catch {
        return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
      }
      if (!isObject(body)) return NextResponse.json({ error: "A JSON object is required." }, { status: 400 });

      const decision = body.decision;
      const rationale = body.rationale == null ? null : typeof body.rationale === "string" ? body.rationale.trim() : undefined;
      if (typeof decision !== "string" || !DECISIONS.includes(decision as (typeof DECISIONS)[number])) {
        return NextResponse.json({ error: "decision must be approved, rejected, changes_requested or deferred." }, { status: 400 });
      }
      if (rationale === undefined || (rationale && rationale.length > 4000)) {
        return NextResponse.json({ error: "rationale must be a string no longer than 4,000 characters." }, { status: 400 });
      }

      const { data, error } = await founder.supabase.rpc("studio_task_decide", {
        p_task_id: id, p_decision: decision, p_rationale: rationale,
      });
      if (error) return NextResponse.json({ error: "Task decision could not be completed. It may not be awaiting a founder decision." }, { status: 409 });
      if (typeof data !== "string") return NextResponse.json({ error: "Task decision was not recorded." }, { status: 503 });

      return NextResponse.json({ ok: true, task_id: id, decision, decision_id: data });
    }

    return NextResponse.json({ error: "Unknown department resource." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Department action service is unavailable." }, { status: 503 });
  }
}
