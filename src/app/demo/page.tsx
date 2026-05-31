"use client";
import { useState } from "react";

const PRODUCT = "CausalAI";

const PAL = {
  bg: "#15102A",
  bg2: "#1E1838",
  surface: "rgba(255,255,255,0.045)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.10)",
  txt1: "#F5EAD2",
  txt2: "#B8A485",
  txt3: "#807055",
  accent: "#F59E0B",
  accentSoft: "rgba(245,158,11,0.12)",
  accentBorder: "rgba(245,158,11,0.30)",
  accentGlow: "rgba(245,158,11,0.18)",
  navBg: "rgba(21,16,42,0.82)",
};

const EXAMPLE_DATA_FR = `mois,churn_rate,nb_tickets_support,marketing_spend
2025-01,3.1,820,42000
2025-02,3.4,910,41000
2025-03,4.2,1050,38000
2025-04,4.8,1180,35000
2025-05,5.3,1310,33000
2025-06,5.9,1440,30000`;

const EXAMPLE_DATA_EN = `month,churn_rate,support_tickets,marketing_spend
2025-01,3.1,820,42000
2025-02,3.4,910,41000
2025-03,4.2,1050,38000
2025-04,4.8,1180,35000
2025-05,5.3,1310,33000
2025-06,5.9,1440,30000`;

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [outcome, setOutcome] = useState("");
  const [driver, setDriver] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — distinguer correlation et causalite",
    desc: "Entrez la variable cible (ex: churn), une variable explicative supposee (ex: tickets support), et collez quelques lignes de donnees. CausalAI distingue correlation et causalite, identifie les confounders et propose une intervention testable. Aucun branchement BI reel — POC qui illustre la couche d'inference causale.",
    inputLabel: "Variables + donnees",
    placeholderOutcome: "Variable cible (ex: taux_churn)",
    placeholderDriver: "Variable explicative supposee (ex: nb_tickets_support)",
    placeholderData: "Donnees (CSV, JSON, ou texte libre)",
    loadExample: "Charger un exemple",
    generate: "Analyser la causalite", generating: "Inference en cours...",
    briefTitle: "Diagnostic causal", emptyHint: "Le diagnostic causal s'affiche ici une fois genere.",
    mockBQ: "Connecter BigQuery", mockSnow: "Connecter Snowflake",
    mockTab: "Exporter vers Tableau", mockSlack: "Partager sur Slack",
    sentBQ: "Connecteur BigQuery configure (mode demo, pas de dataset reel branche)",
    sentSnow: "Connecteur Snowflake configure (mode demo, pas de warehouse reel)",
    sentTab: "Dashboard exporte vers Tableau (mode demo, pas de workbook reel)",
    sentSlack: "Diagnostic partage dans #wikolabs-analytics (mode demo, pas de Slack reel)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — pas de connexion BigQuery/Snowflake/Tableau, pas d'execution stat reelle. L'IA simule l'analyse causale a partir des elements fournis.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — separate correlation from causation",
    desc: "Enter the target variable (e.g. churn), a suspected driver (e.g. support tickets), and paste a few rows of data. CausalAI separates correlation from causation, identifies confounders and suggests a testable intervention. No real BI hook — POC showing the causal inference layer.",
    inputLabel: "Variables + data",
    placeholderOutcome: "Target variable (e.g. churn_rate)",
    placeholderDriver: "Suspected driver (e.g. support_tickets)",
    placeholderData: "Data (CSV, JSON, or free text)",
    loadExample: "Load example",
    generate: "Analyze causality", generating: "Inferring...",
    briefTitle: "Causal diagnosis", emptyHint: "The causal diagnosis will appear here once generated.",
    mockBQ: "Connect BigQuery", mockSnow: "Connect Snowflake",
    mockTab: "Export to Tableau", mockSlack: "Share on Slack",
    sentBQ: "BigQuery connector configured (demo mode, no real dataset wired)",
    sentSnow: "Snowflake connector configured (demo mode, no real warehouse)",
    sentTab: "Dashboard exported to Tableau (demo mode, no real workbook)",
    sentSlack: "Diagnosis shared in #wikolabs-analytics (demo mode, no real Slack)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no BigQuery/Snowflake/Tableau connection, no real stat run. The AI simulates causal analysis from the provided elements.",
  };

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!outcome.trim() || !driver.trim()) {
      setError(lang === "fr" ? "Entrez les 2 variables." : "Enter both variables.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome, driver, data, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setOutcome(lang === "fr" ? "taux_churn" : "churn_rate");
    setDriver(lang === "fr" ? "nb_tickets_support" : "support_tickets");
    setData(lang === "fr" ? EXAMPLE_DATA_FR : EXAMPLE_DATA_EN);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-textarea { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 12px; resize: vertical; min-height: 130px; transition: border-color .2s, background .2s; line-height: 1.55; }
        .wk-textarea:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #04080F; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        .wk-md li strong { display: inline; font-size: inherit; letter-spacing: 0; text-transform: none; margin: 0; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#04080F" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#04080F" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0 }}>{t.inputLabel}</h2>
              <button onClick={loadExample} style={{ background: "transparent", color: PAL.accent, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>{t.loadExample}</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <input className="wk-input" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder={t.placeholderOutcome} />
              <input className="wk-input" value={driver} onChange={(e) => setDriver(e.target.value)} placeholder={t.placeholderDriver} />
              <textarea className="wk-textarea" value={data} onChange={(e) => setData(e.target.value)} placeholder={t.placeholderData} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `✨ ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#F87171", fontSize: 13, padding: "8px 12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#22C55E" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.sentBQ)}>📊 {t.mockBQ}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.sentSnow)}>❄️ {t.mockSnow}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.sentTab)}>📈 {t.mockTab}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.sentSlack)}>💬 {t.mockSlack}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: PAL.surface, border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.4)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
