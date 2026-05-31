import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es CausalAI, un agent IA d'inference causale et d'analyse de cause racine. A partir d'une variable cible (outcome) et d'une variable explicative supposee, plus un dataset texte de N lignes, tu distingues correlation et causalite, identifies les confounders probables, et fais une recommandation actionnable.

Format de sortie exact en MARKDOWN :
**📈 Correlation observee**
- Coefficient estime : [Pearson r entre -1 et 1] · Significativite : p < 0.0X
- Direction : [outcome augmente / diminue quand variable explicative monte]

**🔬 Diagnostic causal**
- Lien causal probable : [OUI direct / OUI indirect / NON correlation pure]
- Confiance causale : [score 0-100%]
- Confounders identifies : [3-4 variables tierces qui expliqueraient mieux ou modulent le lien]

**🎯 Cause racine probable**
- [1-2 phrases : la vraie cause primaire et pourquoi la variable analysee n'est probablement qu'un proxy]

**⚡ Actions recommandees**
- [2-3 puces : intervention concrete a tester, controle/randomisation suggere, impact attendu chiffre]

**⚠️ Limites**
- [1 puce : ce que cette analyse N'EST PAS (causal definitif) sans experience controlee]

Tu DOIS analyser reellement les donnees fournies (jamais "je ne peux pas faire de stats"). Tu joues le role d'un data scientist senior. Sois rigoureux, evite le marketing. Maximum 350 mots.`;

const SYSTEM_PROMPT_EN = `You are CausalAI, an AI causal inference and root-cause analysis agent. Given a target outcome variable and a suspected explanatory variable, plus a text dataset of N rows, you distinguish correlation from causation, identify likely confounders, and give an actionable recommendation.

Exact MARKDOWN output format:
**📈 Observed correlation**
- Estimated coefficient: [Pearson r between -1 and 1] · Significance: p < 0.0X
- Direction: [outcome rises / falls when explanatory variable rises]

**🔬 Causal diagnosis**
- Likely causal link: [YES direct / YES indirect / NO pure correlation]
- Causal confidence: [0-100% score]
- Identified confounders: [3-4 third variables that would better explain or modulate the link]

**🎯 Likely root cause**
- [1-2 sentences: the real primary cause and why the analyzed variable is likely just a proxy]

**⚡ Recommended actions**
- [2-3 bullets: concrete intervention to test, suggested control/randomization, quantified expected impact]

**⚠️ Limits**
- [1 bullet: what this analysis IS NOT (definitive causal) without a controlled experiment]

You MUST actually analyze the data (never "I can't do stats"). You play a senior data scientist. Be rigorous, avoid marketing. Maximum 350 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const outcome: string = typeof body.outcome === "string" ? body.outcome.slice(0, 120) : "";
    const driver: string = typeof body.driver === "string" ? body.driver.slice(0, 120) : "";
    const data: string = typeof body.data === "string" ? body.data.slice(0, 2000) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!outcome.trim() || !driver.trim()) {
      return NextResponse.json(
        { error: lang === "fr" ? "Entrez la variable cible et la variable explicative." : "Enter target and explanatory variable." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMock(outcome, driver, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Variable cible (outcome) : "${outcome}". Variable explicative supposee : "${driver}". Donnees fournies :\n${data || "(pas de dataset, raisonne sur le bon sens metier)"}\n\nDistingue correlation et causalite, identifie confounders, propose une intervention testable.`
      : `Target outcome: "${outcome}". Suspected explanatory variable: "${driver}". Provided data:\n${data || "(no dataset, reason from domain common sense)"}\n\nDistinguish correlation from causation, identify confounders, propose a testable intervention.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      950
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMock(outcome: string, driver: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**📈 Observed correlation**\n- Estimated coefficient: r = -0.62 · Significance: p < 0.01\n- Direction: "${outcome}" decreases when "${driver}" rises\n\n**🔬 Causal diagnosis**\n- Likely causal link: NO pure correlation (likely indirect via confounder)\n- Causal confidence: 34%\n- Identified confounders: seasonality, marketing spend shift, competitor pricing change, account onboarding cohort\n\n**🎯 Likely root cause**\nThe relationship between "${driver}" and "${outcome}" is likely mediated by a third variable — most plausibly a shift in marketing channel mix that simultaneously affected both. "${driver}" is acting as a proxy, not a cause.\n\n**⚡ Recommended actions**\n- Run a controlled A/B test holding marketing channel mix constant and varying only "${driver}" on 2 cohorts\n- Add cohort-level controls (acquisition month, plan tier) to your existing regression — expect r to drop below 0.20\n- If A/B test confirms no causal link, stop investment in this lever and prioritize the confounder ("acquisition mix")\n\n**⚠️ Limits**\n- This is an observational diagnosis — only a randomized controlled experiment can confirm causal direction.`;
  }
  return `**📈 Correlation observee**\n- Coefficient estime : r = -0.62 · Significativite : p < 0.01\n- Direction : "${outcome}" diminue quand "${driver}" augmente\n\n**🔬 Diagnostic causal**\n- Lien causal probable : NON correlation pure (probablement indirecte via un confounder)\n- Confiance causale : 34%\n- Confounders identifies : saisonnalite, changement de mix marketing, evolution prix concurrent, cohorte d'onboarding\n\n**🎯 Cause racine probable**\nLa relation entre "${driver}" et "${outcome}" est probablement mediee par une variable tierce — vraisemblablement un changement de mix de canaux marketing qui a affecte les deux simultanement. "${driver}" agit comme un proxy, pas une cause.\n\n**⚡ Actions recommandees**\n- Lancer un A/B test controle en figeant le mix marketing et en variant uniquement "${driver}" sur 2 cohortes\n- Ajouter des controles cohorte (mois d'acquisition, tier de plan) a la regression existante — attendre que r tombe sous 0.20\n- Si l'A/B confirme l'absence de causalite, arreter l'investissement sur ce levier et prioriser le confounder ("mix d'acquisition")\n\n**⚠️ Limites**\n- C'est un diagnostic observationnel — seule une experience randomisee controlee peut confirmer la direction causale.`;
}
