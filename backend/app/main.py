"""CausalAI demo backend — production-ready POC.

In production: this service would run DoWhy / EconML pipelines on real datasets,
estimate ATE via propensity-score matching / IV / DiD, and integrate with the
client's BI warehouse. For the demo: it only invokes the LLM and returns a
plausible causal narrative based on the user's outcome/driver/csv_data.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="CausalAI Demo Backend",
    description="POC backend — Groq/Gemini LLM. No real stats engine.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es CausalAI, un agent IA d'inference causale et d'analyse de cause racine. A partir d'une variable cible (outcome) et d'une variable explicative supposee, plus un dataset texte de N lignes, tu distingues correlation et causalite, identifies les confounders probables, et fais une recommandation actionnable.

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

Tu DOIS analyser reellement les donnees fournies (jamais "je ne peux pas faire de stats"). Tu joues le role d'un data scientist senior. Sois rigoureux, evite le marketing. Maximum 350 mots."""

SYSTEM_PROMPT_EN = """You are CausalAI, an AI causal inference and root-cause analysis agent. Given a target outcome variable and a suspected explanatory variable, plus a text dataset of N rows, you distinguish correlation from causation, identify likely confounders, and give an actionable recommendation.

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

You MUST actually analyze the data (never "I can't do stats"). You play a senior data scientist. Be rigorous, avoid marketing. Maximum 350 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    outcome: str = Field(..., min_length=1, max_length=120)
    driver: str = Field(..., min_length=1, max_length=120)
    csv_data: str = Field(default="", max_length=2000)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "causalai-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    outcome = req.outcome.strip()
    driver = req.driver.strip()
    csv_data = req.csv_data.strip()
    if not outcome or not driver:
        raise HTTPException(status_code=400, detail="empty_outcome_or_driver")

    now_iso = datetime.now(timezone.utc).isoformat()
    no_data_fr = "(pas de dataset, raisonne sur le bon sens metier)"
    no_data_en = "(no dataset, reason from domain common sense)"
    user_msg = (
        f"Variable cible (outcome) : \"{outcome}\". Variable explicative supposee : \"{driver}\". "
        f"Donnees fournies :\n{csv_data or no_data_fr}\n\n"
        f"Distingue correlation et causalite, identifie confounders, propose une intervention testable."
        if req.lang == "fr"
        else f"Target outcome: \"{outcome}\". Suspected explanatory variable: \"{driver}\". "
             f"Provided data:\n{csv_data or no_data_en}\n\n"
             f"Distinguish correlation from causation, identify confounders, propose a testable intervention."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(outcome, driver, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=950,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(outcome, driver, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(outcome: str, driver: str, lang: str) -> str:
    if lang == "en":
        return (
            f"**📈 Observed correlation**\n"
            f"- Estimated coefficient: r = -0.62 · Significance: p < 0.01\n"
            f"- Direction: \"{outcome}\" decreases when \"{driver}\" rises\n\n"
            f"**🔬 Causal diagnosis**\n"
            f"- Likely causal link: NO pure correlation (likely indirect via confounder)\n"
            f"- Causal confidence: 34%\n"
            f"- Identified confounders: seasonality, marketing spend shift, competitor pricing change, account onboarding cohort\n\n"
            f"**🎯 Likely root cause**\n"
            f"The relationship between \"{driver}\" and \"{outcome}\" is likely mediated by a third variable — "
            f"most plausibly a shift in marketing channel mix that simultaneously affected both. \"{driver}\" "
            f"is acting as a proxy, not a cause.\n\n"
            f"**⚡ Recommended actions**\n"
            f"- Run a controlled A/B test holding marketing channel mix constant and varying only \"{driver}\" on 2 cohorts\n"
            f"- Add cohort-level controls (acquisition month, plan tier) to your existing regression — expect r to drop below 0.20\n"
            f"- If A/B test confirms no causal link, stop investment in this lever and prioritize the confounder (\"acquisition mix\")\n\n"
            f"**⚠️ Limits**\n"
            f"- This is an observational diagnosis — only a randomized controlled experiment can confirm causal direction."
        )
    return (
        f"**📈 Correlation observee**\n"
        f"- Coefficient estime : r = -0.62 · Significativite : p < 0.01\n"
        f"- Direction : \"{outcome}\" diminue quand \"{driver}\" augmente\n\n"
        f"**🔬 Diagnostic causal**\n"
        f"- Lien causal probable : NON correlation pure (probablement indirecte via un confounder)\n"
        f"- Confiance causale : 34%\n"
        f"- Confounders identifies : saisonnalite, changement de mix marketing, evolution prix concurrent, cohorte d'onboarding\n\n"
        f"**🎯 Cause racine probable**\n"
        f"La relation entre \"{driver}\" et \"{outcome}\" est probablement mediee par une variable tierce — "
        f"vraisemblablement un changement de mix de canaux marketing qui a affecte les deux simultanement. "
        f"\"{driver}\" agit comme un proxy, pas une cause.\n\n"
        f"**⚡ Actions recommandees**\n"
        f"- Lancer un A/B test controle en figeant le mix marketing et en variant uniquement \"{driver}\" sur 2 cohortes\n"
        f"- Ajouter des controles cohorte (mois d'acquisition, tier de plan) a la regression existante — attendre que r tombe sous 0.20\n"
        f"- Si l'A/B confirme l'absence de causalite, arreter l'investissement sur ce levier et prioriser le confounder (\"mix d'acquisition\")\n\n"
        f"**⚠️ Limites**\n"
        f"- C'est un diagnostic observationnel — seule une experience randomisee controlee peut confirmer la direction causale."
    )
