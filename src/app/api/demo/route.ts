import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: { outcome?: string; driver?: string; data?: string; lang?: "fr" | "en" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const outcome = typeof body.outcome === "string" ? body.outcome.slice(0, 120) : "";
  const driver = typeof body.driver === "string" ? body.driver.slice(0, 120) : "";
  const csv_data = typeof body.data === "string" ? body.data.slice(0, 2000) : "";
  const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

  if (!outcome.trim() || !driver.trim()) {
    return NextResponse.json(
      {
        error:
          lang === "fr"
            ? "Entrez la variable cible et la variable explicative."
            : "Enter target and explanatory variable.",
      },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome, driver, csv_data, lang }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    }
    return NextResponse.json({
      brief: j.brief,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
