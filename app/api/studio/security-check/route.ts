import { NextResponse } from "next/server";
import { getFounderContext } from "@/lib/supabase/founder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only Preview diagnostic. It verifies the founder session and the three
// owner-scoped list RPCs without creating or changing any database records.
export async function GET() {
  try {
    const founder = await getFounderContext();

    if (!founder) {
      return NextResponse.json(
        { ok: false, error: "A verified Supabase founder session is required." },
        { status: 401 },
      );
    }

    const checks = await Promise.all([
      founder.supabase.rpc("studio_memory_list", {}),
      founder.supabase.rpc("studio_instruction_list", {}),
      founder.supabase.rpc("studio_task_list", {}),
    ]);

    const names = ["department_memory", "department_instructions", "agent_tasks"];
    const results = checks.map(({ data, error }, index) => ({
      check: names[index],
      ok: !error,
      // Report only a count; never return private department content here.
      itemsReturned: Array.isArray(data) ? data.length : data == null ? 0 : 1,
      ...(error ? { error: "RPC_READ_FAILED" } : {}),
    }));

    const ok = results.every((result) => result.ok);

    return NextResponse.json(
      {
        ok,
        identity: "verified",
        mode: "read-only",
        checks: results,
      },
      { status: ok ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "The Preview security check could not complete." },
      { status: 503 },
    );
  }
}
