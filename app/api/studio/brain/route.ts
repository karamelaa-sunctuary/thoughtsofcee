import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Founder decision: the Studio must not incur paid model/API costs.
// Keep this endpoint intentionally dormant until a genuinely free runtime
// is selected, reviewed and explicitly enabled.
export async function POST() {
  return NextResponse.json({
    error: "The Brain is in free-first setup mode. No paid model API is enabled. Your knowledge library, decisions and project memory can be built without model usage; live AI chat will return when a no-cost runtime has been verified."
  }, { status: 503 });
}
