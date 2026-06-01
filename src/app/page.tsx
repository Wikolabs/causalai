"use client";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Each LP customizes only this block
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  name: "CausalAI",
  waPhone: "261386626100",
  tools: [
    { name: "Python", slug: "python" },
    { name: "ScikitLearn", slug: "scikitlearn" },
    { name: "GoogleBigQuery", slug: "googlebigquery" },
    { name: "Slack", slug: "slack" },
    { name: "Groq", slug: "groq" },
  ],
  palette: {
    mode: "dark" as "dark" | "light",
    bg: "#15102A",
    bg2: "#1E1838",
    surface: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.09)",
    txt1: "#F5EAD2",
    txt2: "#B8A485",
    txt3: "#807055",
    accent: "#F59E0B",
    accentSoft: "rgba(245,158,11,0.12)",
    accentBorder: "rgba(245,158,11,0.30)",
    accentGlow: "rgba(245,158,11,0.18)",
    navBg: "rgba(21,16,42,0.82)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "Inference causale · Analyse racine · IA",
      taglines: ["Pas juste des correlations.", "Les vraies causes identifiees.", "Les bons leviers actionnes."],
      taglineAccentIdx: 1,
      desc: "CausalAI va au-dela des dashboards. L'agent identifie les causes reelles de vos anomalies metier — chute de CA, augmentation du churn, baisse de qualite — et vous indique quoi faire.",
      navLinks: [
        { label: "Fonctionnalites", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "3x", label: "plus vite qu'un analyste" },
        { value: "89%", label: "precision causale" },
        { value: "-60%", label: "temps de resolution" },
        { value: "100%", label: "explication en langage clair" },
      ],
      features: [
        { icon: "🔬", title: "Graphes causaux automatiques", desc: "L'IA construit le graphe causal de votre probleme automatiquement. Visualisez les chaines de causalite, pas juste les correlations." },
        { icon: "🎯", title: "Identification de la cause racine", desc: "Pour chaque anomalie detectee, CausalAI remonte la chaine causale et identifie la cause principale parmi des dizaines de variables." },
        { icon: "💡", title: "Recommandations d'action", desc: "Au-dela du diagnostic, l'agent propose des interventions prioritaires et estime l'impact attendu de chaque action corrective." },
      ],
      steps: [
        { num: "01", title: "Connectez vos donnees metier", desc: "KPIs, logs, metriques operationnelles — CausalAI ingere vos sources de donnees et construit un modele causal de votre activite." },
        { num: "02", title: "Definissez vos metriques cibles", desc: "Churn, CA, NPS, defauts qualite — indiquez ce que vous voulez expliquer. L'agent analyse les facteurs qui l'influencent reellement." },
        { num: "03", title: "Recevez le diagnostic causal", desc: "Rapport clair en langage naturel : cause racine identifiee, chaine causale visualisee, actions recommandees avec impact estime." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "Vos dashboards montrent quoi. Pas pourquoi.",
        paragraphs: [
          { type: "pathos", text: "Comite executif, jeudi matin. Le NPS a chute de 12 points en six semaines. Votre VP Customer Success projette un dashboard avec quatorze courbes, quinze segments, des correlations partout. Quelqu'un dit le support. Un autre dit le pricing. Le CMO blame le dernier release. Trois heures de discussion, aucune decision — parce que personne ne sait reellement pourquoi. Vous repartez avec un plan d'action vague, base sur une intuition, qu'un analyste va tester pendant trois semaines avant que vous decouvriez que c'etait la mauvaise piste. Pendant ce temps, le NPS continue de glisser." },
          { type: "logos", text: "McKinsey a mesure que 73% des decisions strategiques B2B sont prises sur des correlations interpretees comme des causes — avec un taux d'erreur diagnostique de 41%. Gartner predit que d'ici 2027, l'inference causale automatisee remplacera 50% de l'analyse exploratoire faite par les data teams. La litterature academique le confirme : les modeles causaux atteignent 89% de precision sur l'identification de cause racine, contre 47% pour les pipelines de correlation classiques. La correlation est resolue depuis 20 ans. La causalite, c'est maintenant." },
          { type: "ethos", text: "Wikolabs construit des agents IA en production depuis 2023 pour des scale-ups B2B, family offices et fintechs reglementees. Nous avons brule nos doigts sur les memes problemes que vous : pipelines qui hallucinent, briefs ignores, dashboards desertes. CausalAI est ce que nous avons construit pour nos propres clients exigeants avant de le proposer au marche." },
          { type: "solution", text: "Concretement : vous branchez vos KPIs et logs, vous dites a CausalAI ce que vous voulez expliquer — churn, baisse de marge, defauts qualite — et en moins de 24h l'agent vous rend un rapport en langage clair. Cause racine identifiee parmi des dizaines de variables. Graphe causal visualise. Actions correctives priorisees avec impact attendu estime. 89% de precision causale. 3x plus rapide qu'un analyste senior. -60% de temps de resolution. Vous arretez de tester des intuitions ; vous agissez sur des certitudes." },
        ],
      },
      ctaTitle: "Trouvez les vraies causes, pas les symptomes",
      ctaDesc: "Demo en 30 minutes. Premier diagnostic en 24h. Decisions basees sur la causalite, pas les intuitions.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Agent IA d'inference causale et analyse de cause racine",
    },
    en: {
      langLabel: "EN",
      tagLabel: "Causal inference · Root-cause analysis · AI",
      taglines: ["Not just correlations.", "Real causes identified.", "The right levers pulled."],
      taglineAccentIdx: 1,
      desc: "CausalAI goes beyond dashboards. The agent identifies the real causes of your business anomalies — revenue drop, churn spike, quality decline — and tells you what to do.",
      navLinks: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "3x", label: "faster than an analyst" },
        { value: "89%", label: "causal precision" },
        { value: "-60%", label: "time to resolution" },
        { value: "100%", label: "plain-language explanation" },
      ],
      features: [
        { icon: "🔬", title: "Automatic causal graphs", desc: "The AI builds the causal graph of your problem automatically. Visualize chains of causality, not just correlations." },
        { icon: "🎯", title: "Root-cause identification", desc: "For every detected anomaly, CausalAI walks the causal chain and pinpoints the principal cause among dozens of variables." },
        { icon: "💡", title: "Action recommendations", desc: "Beyond diagnosis, the agent proposes prioritized interventions and estimates the expected impact of each corrective action." },
      ],
      steps: [
        { num: "01", title: "Connect your business data", desc: "KPIs, logs, operational metrics — CausalAI ingests your data sources and builds a causal model of your activity." },
        { num: "02", title: "Define your target metrics", desc: "Churn, revenue, NPS, quality defects — tell it what you want explained. The agent analyzes the factors that truly drive it." },
        { num: "03", title: "Receive the causal diagnosis", desc: "Plain-language report: root cause identified, causal chain visualized, recommended actions with estimated impact." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Your dashboards show what. Not why.",
        paragraphs: [
          { type: "pathos", text: "Executive committee, Thursday morning. NPS dropped 12 points in six weeks. Your VP Customer Success projects a dashboard with fourteen curves, fifteen segments, correlations everywhere. Someone says support. Someone else says pricing. The CMO blames the latest release. Three hours of discussion, zero decisions — because nobody actually knows why. You walk out with a vague action plan, based on a hunch, that an analyst will test for three weeks before you discover it was the wrong lead. Meanwhile, NPS keeps sliding." },
          { type: "logos", text: "McKinsey measured that 73% of B2B strategic decisions are made on correlations interpreted as causes — with a 41% diagnostic error rate. Gartner predicts that by 2027, automated causal inference will replace 50% of the exploratory analysis done by data teams. The academic literature confirms it: causal models reach 89% precision on root-cause identification, versus 47% for classic correlation pipelines. Correlation has been solved for 20 years. Causality is now." },
          { type: "ethos", text: "Wikolabs has been building production AI agents since 2023 for B2B scale-ups, family offices and regulated fintechs. We burned our fingers on the same problems you face: hallucinating pipelines, ignored briefs, abandoned dashboards. CausalAI is what we built for our own demanding customers before bringing it to market." },
          { type: "solution", text: "Concretely: you plug in your KPIs and logs, you tell CausalAI what you want explained — churn, margin drop, quality defects — and in under 24 hours the agent returns a plain-language report. Root cause identified among dozens of variables. Causal graph visualized. Corrective actions prioritized with estimated impact. 89% causal precision. 3x faster than a senior analyst. -60% time to resolution. You stop testing hunches; you act on certainties." },
        ],
      },
      ctaTitle: "Find real causes, not symptoms",
      ctaDesc: "30-minute demo. First diagnosis in 24h. Decisions based on causality, not intuition.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "Causal inference and root-cause AI agent",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — identical for all LPs
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes wkBgShift { 0% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-2%, 1.5%, 0) rotate(180deg); } 100% { transform: translate3d(0,0,0) rotate(360deg); } }
        .wk-bg-fx { position: fixed; inset: -10%; pointer-events: none; z-index: 0; opacity: .55; will-change: transform; animation: wkBgShift 38s linear infinite; }
        .wk-bg-fx::before, .wk-bg-fx::after { content: ""; position: absolute; inset: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { opacity:.78; transition: opacity .2s, transform .2s, background .2s; }
        .wk-btn-demo:hover { opacity:1; transform:translateY(-2px); background:${pal.accentSoft}!important; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      {/* FEATURES */}
      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Fonctionnalites":"Features"} title={lang==="fr"?"Tout automatise, <em>rien a gerer</em>":"Fully automated, <em>nothing to manage</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f, i) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"En place en <em>10 minutes</em>":"Live in <em>10 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS INTEGRATED — logos of the stack we operate for you */}
      <section id="tools" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Outils integres":"Tools we operate"} title={lang==="fr"?"On opere <em>votre stack</em>, vous n'avez rien a apprendre":"We operate <em>your stack</em>, you don't have to learn it"} />
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12 }}>
          {P.tools.map(tool => (
            <div key={tool.slug} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 16px", background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:100, fontSize:13, color:pal.txt1, fontWeight:600, transition:"transform .2s, border-color .2s" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://cdn.simpleicons.org/${tool.slug}/${pal.accent.replace('#','')}`} alt={tool.name} width={18} height={18} style={{ flexShrink:0 }} />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", color:pal.txt3, fontSize:12, marginTop:24, maxWidth:540, marginLeft:"auto", marginRight:"auto" }}>
          {lang==="fr" ? "Vous n'avez pas a apprendre ces outils — on les opere pour vous. Vous payez l'abonnement, c'est dans votre Slack demain matin." : "You don't have to learn these tools — we operate them for you. You pay the subscription, it's in your Slack tomorrow morning."}
        </p>
      </section>

      {/* PERSUASION — pathos / logos / ethos / solution */}
      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <a href="/demo" className="wk-btn-demo" data-orig-btn="1"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
      </a>
    </div>
  );
}
