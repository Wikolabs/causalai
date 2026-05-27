# CausalAI — Inférence causale & A/B Testing scientifique

> Au-delà de la corrélation. Mesurez les vrais effets de causalité de vos décisions.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![DoWhy](https://img.shields.io/badge/DoWhy-0.11-blue?style=flat)](https://www.pywhy.org/dowhy)
[![EconML](https://img.shields.io/badge/EconML-0.15-green?style=flat)](https://econml.azurewebsites.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)

---

## Vue d'ensemble

CausalAI est une plateforme d'inférence causale et d'A/B testing statistiquement rigoureux. Elle dépasse les simples comparaisons de moyennes pour estimer les effets causaux réels (CATE — Conditional Average Treatment Effect), identifier les confoundeurs, et concevoir des expériences avec la puissance statistique appropriée.

**Domaine :** Data Science / Expérimentation / Marketing Science  
**Dataset :** [Hillstrom Email Marketing (Kaggle)](https://www.kaggle.com/datasets/goldenlock/hillstrom-dataset) — 64 000 clients, campagne email  
**Port VM :** 3038 | **Sous-domaine :** causalai.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts, D3.js | DAG causal editor, courbes uplift, power calculator |
| Backend | FastAPI (Python 3.11), Uvicorn | API expériences, analyses causales |
| Inférence causale | **DoWhy** (causal graph), **EconML** (CATE estimation) | Effets causaux + hétérogénéité de traitement |
| Statistics | statsmodels, scipy, numpy | T-test, Mann-Whitney, correction multiple |
| ML | scikit-learn (X-Learner, S-Learner, T-Learner) | Uplift modeling |
| Base de données | PostgreSQL 16 | Expériences, datasets, résultats |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3038) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
dowhy==0.11.1
econml==0.15.1
statsmodels==0.14.2
scipy==1.13.0
scikit-learn==1.4.2
pandas==2.2.2
numpy==1.26.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
matplotlib==3.9.0
```

---

## Architecture mono-repo

```
causalai/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx             # Dashboard expériences
│   │   ├── experiment/new/      # Création expérience + power calc
│   │   ├── experiment/[id]/     # Résultats détaillés
│   │   └── causal-graph/        # Éditeur DAG causal
│   └── src/components/
│       ├── PowerCalculator.tsx  # Calculateur taille échantillon
│       ├── CausalDAG.tsx        # D3.js DAG visualisation
│       ├── UpliftChart.tsx      # Courbe CATE par segment
│       ├── SRMCheck.tsx         # Sample Ratio Mismatch alert
│       └── ForestPlot.tsx       # Effect sizes par sous-groupe
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── experiments.py   # CRUD expériences
│   │   │   ├── analysis.py      # POST /analyze (ATE, CATE)
│   │   │   └── power.py         # POST /power-calc
│   │   ├── services/
│   │   │   ├── causal_engine.py # DoWhy graph + effect estimation
│   │   │   ├── uplift.py        # EconML T-Learner, X-Learner
│   │   │   ├── stats.py         # T-test, SRM, correction multiple
│   │   │   └── power.py         # Sample size calculator
│   │   └── models/
│   │       ├── experiment.py
│   │       └── result.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'primaryBorderColor': '#0e7490', 'lineColor': '#374151', 'secondaryColor': '#ecfeff'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3038)"]
        NEXT["Next.js 14\nDashboard + DAG Editor"]
        API["FastAPI"]

        subgraph CAUSAL["🧪 Moteur causal"]
            DOWHY["DoWhy\nGraphe causal"]
            ECONML["EconML\nCATE / Uplift"]
            STATS["statsmodels\nTests stat + SRM"]
            POWER["Power Calculator\nSample size"]
        end

        PG[("PostgreSQL\nExpériences + Résultats")]
    end

    USER["Data Scientist"] --> NEXT --> API
    API --> CAUSAL
    CAUSAL --> PG
    API --> PG
```

### Séquence — Analyse causale complète

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant DS as Data Scientist
    participant API as FastAPI
    participant DW as DoWhy
    participant EML as EconML
    participant ST as statsmodels

    DS->>API: POST /analyze {dataset, treatment, outcome, covariates}

    API->>ST: srm_test(control_n, treatment_n)
    ST-->>API: srm_ok=true, chi2=0.82, p=0.36

    API->>ST: balance_check(covariates, treatment)
    ST-->>API: covariate_balance: [SMD<0.1 all vars]

    API->>DW: CausalModel(graph, treatment, outcome)
    DW->>DW: identify_effect() → backdoor criterion
    DW->>DW: estimate_effect(method=propensity_score_weighting)
    DW-->>API: ATE=+0.042, 95%CI=[0.031, 0.053], p<0.001

    API->>EML: XLearner(control_data, treatment_data)
    EML-->>API: CATE_by_segment [{segment, effect, CI}...]

    API->>ST: bonferroni_correction(p_values_multiple_metrics)
    ST-->>API: adjusted_p_values[]

    API-->>DS: {ate, cate_segments, is_significant, recommendation}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    EXPERIMENT {
        uuid id PK
        string name
        string hypothesis
        string treatment_description
        string primary_metric
        string[] secondary_metrics
        float alpha
        float power
        float mde
        int required_sample_size
        string status
        timestamp started_at
        timestamp ended_at
    }
    EXPERIMENT_RESULT {
        uuid id PK
        uuid experiment_id FK
        float ate
        float ate_lower_ci
        float ate_upper_ci
        float p_value
        boolean is_significant
        jsonb cate_by_segment
        boolean srm_ok
        jsonb covariate_balance
        string recommendation
        timestamp computed_at
    }
    CAUSAL_GRAPH {
        uuid id PK
        uuid experiment_id FK
        jsonb nodes
        jsonb edges
        string[] confounders
        string[] instruments
    }

    EXPERIMENT ||--o{ EXPERIMENT_RESULT : "génère"
    EXPERIMENT ||--o| CAUSAL_GRAPH : "utilise"
```

---

## PRD

### Problème
90% des équipes produit font des A/B tests incorrectement : pas de calcul de puissance préalable (→ under-powered), peek problem (arrêt prématuré dès qu'on voit p<0.05), non-vérification du SRM, pas de correction pour les tests multiples. Résultat : des décisions produit prises sur des faux positifs.

### Solution
CausalAI impose la rigueur statistique à chaque étape : power analysis obligatoire avant le lancement, SRM check à J+1, séquential testing avec alpha-spending, correction Bonferroni/BH pour les métriques secondaires, et estimation CATE (hétérogénéité de l'effet) par segment.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Data Scientist | Estimer les effets causaux, modéliser les confondeurs |
| Product Manager | Valider scientifiquement les décisions produit |
| Marketing Analyst | Mesurer l'uplift réel des campagnes par segment |

### OKRs
- 0 test lancé sans power analysis préalable (enforcement dans UI)
- Détection SRM < 1h après lancement
- Taux de faux positifs < 5% (contrôle du α global)

---

## User Stories

```
US-01 [PM] En tant que Product Manager,
      je veux un calculateur de taille d'échantillon
      qui me dit combien d'utilisateurs j'ai besoin avant de lancer
      afin d'éviter les tests under-powered.

US-02 [Data Scientist] En tant que Data Scientist,
      je veux dessiner le graphe causal de mon expérience
      et identifier automatiquement les confondeurs
      afin de choisir la bonne méthode d'estimation.

US-03 [Système] En tant que système de monitoring,
      je veux vérifier le SRM (Sample Ratio Mismatch) à J+1
      et alerter si le ratio contrôle/traitement dévie de plus de 5%
      afin de détecter les bugs d'assignation.

US-04 [Analyst] En tant qu'analyste,
      je veux voir les effets du traitement par segment (CATE)
      afin d'identifier quels utilisateurs bénéficient le plus.

US-05 [PM] En tant que PM,
      je veux un rapport de résultats en langage naturel
      afin de le partager avec les stakeholders non-techniques.
```

---

## Règles métier

Simulables dans l'UI avec des données mock (dataset Hillstrom embarqué).

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Power analysis obligatoire | Blocage lancement si sample_size non calculé | ✅ Calculator UI |
| R2 | SRM check | Chi2 test sur ratio N_control / N_treatment | ✅ Badge SRM |
| R3 | Balance check | Standardized Mean Difference < 0.1 par covariate | ✅ Forest plot |
| R4 | Alpha spending | O'Brien-Fleming pour arrêt anticipé | ✅ Sequential chart |
| R5 | Multiple testing | Bonferroni (conservateur) ou Benjamini-Hochberg | ✅ Toggle correction |
| R6 | CATE par segment | X-Learner sur âge, channel, géo, device | ✅ Segment selector |
| R7 | Uplift minimum (MDE) | Configurable : 1%, 2%, 5% selon le cas | ✅ MDE slider |
| R8 | Rapport auto | Génération texte : "L'effet du traitement est significatif (p<0.001)..." | ✅ |
| R9 | Randomization check | Vérifier que la randomisation est bien aléatoire (Fisher exact) | ✅ |
| R10 | Causal graph DAG | Identifier backdoor paths + instrumental variables | ✅ D3.js editor |

---

## Spécification API

**Base URL :** `http://causalai.wikolabs.com/api/v1`

### POST /power-calc
```json
{"baseline_rate": 0.12, "mde": 0.02, "alpha": 0.05, "power": 0.80, "test_type": "two_sided"}
// Response: {"required_n_per_group": 3142, "total_n": 6284, "weeks_to_collect": 3.2}
```

### POST /analyze
```json
{
  "experiment_id": "exp_uuid",
  "control_data": [...],
  "treatment_data": [...],
  "outcome_col": "converted",
  "treatment_col": "is_treated",
  "covariates": ["age", "channel", "region"],
  "causal_graph": {"nodes": [...], "edges": [...]}
}
// Response: {ate, p_value, ci, srm_ok, cate_segments, recommendation}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Power Calculator** | Sliders : baseline rate, MDE, α, power → N requis en temps réel |
| **DAG Editor** | D3.js : ajouter nœuds (traitement, outcome, confondeur), tracer les flèches |
| **SRM Dashboard** | Graphique N_control vs N_treatment au fil du temps |
| **Uplift Heatmap** | CATE par (segment × temps) — données Hillstrom pré-calculées |
| **Forest Plot** | Effet par sous-groupe avec intervalles de confiance |
| **Report Generator** | Template rapport en langage naturel (mock) |

---

## Dataset

**Kaggle :** [Hillstrom Email Marketing Dataset](https://www.kaggle.com/datasets/goldenlock/hillstrom-dataset)

```bash
kaggle datasets download -d goldenlock/hillstrom-dataset -p backend/app/data/
```

**Contenu :** 64 000 clients randomisés en 3 groupes (email femmes, email hommes, contrôle). Variables : historique achat, canal, visite 2 semaines, conversion. Cas d'usage parfait pour démontrer l'uplift modeling et la détection d'effets hétérogènes.

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: causalai, POSTGRES_USER: ca_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
    volumes: [pg_data:/var/lib/postgresql/data]
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://ca_user:${POSTGRES_PASSWORD}@postgres/causalai
    depends_on: [postgres]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3038:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Power calculator interactif
- [ ] SRM check automatique + alerte
- [ ] ATE estimation (DoWhy propensity weighting)
- [ ] Rapport résultats en langage naturel

### Phase 2 — Avancé
- [ ] CATE par segment (EconML X-Learner)
- [ ] DAG editor (D3.js)
- [ ] Sequential testing avec alpha-spending
- [ ] Correction Bonferroni / BH

### Phase 3 — Expert
- [ ] Instrumental Variables estimation
- [ ] Difference-in-Differences
- [ ] Synthetic Control Method
- [ ] Intégration LaunchDarkly / Amplitude

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
