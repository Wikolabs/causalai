export default function Home() {
  const color = "#14b8a6";
  const colorLight = "#f0fdfa";
  const colorDark = "#0f766e";

  return (
    <main style={{ fontFamily: "var(--font-body)" }}>
      {/* NAVBAR */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #ccfbf1", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color }}>CausalAI</span>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer"
              style={{ background: color, color: "#fff", padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Réserver une démo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${colorLight} 0%, #fff 60%)`, padding: "80px 24px 64px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "#ccfbf1", color, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            IA causale &amp; counterfactuelle
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#134e4a", lineHeight: 1.15, marginBottom: 24 }}>
            Comprenez pourquoi.<br />
            <span style={{ color }}>Pas seulement quoi.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#4b5563", marginBottom: 40, lineHeight: 1.7 }}>
            IA causale sur vos données — graphes causaux auto-découverts, simulations counterfactuelles et recommandations d&apos;actions prouvées.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer"
              style={{ background: color, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              Réserver une démo
            </a>
            <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20CausalAI%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer"
              style={{ background: "#25d366", color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              WhatsApp
            </a>
          </div>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {[
              { value: "Auto", label: "graphe découvert" },
              { value: "100%", label: "explainable" },
              { value: "ROI", label: "démontré" },
              { value: "<1j", label: "analyse" },
            ].map((m) => (
              <div key={m.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", boxShadow: "0 1px 4px rgba(20,184,166,0.1)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color }}>{m.value}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#134e4a", textAlign: "center", marginBottom: 48 }}>
            De la donnée à la décision causale
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              {
                icon: "🕸️",
                title: "Graphes causaux",
                desc: "Découverte automatique des relations de cause à effet dans vos données — sans hypothèse préalable, sans biais de confirmation.",
              },
              {
                icon: "🔄",
                title: "Simulations counterfactuelles",
                desc: "Répondez à « Que se serait-il passé si... ? » — testez vos décisions sur des scénarios alternatifs avant de les implémenter.",
              },
              {
                icon: "✅",
                title: "Recommandations prouvées",
                desc: "Chaque recommandation d'action est accompagnée de son effet causal estimé et de son intervalle de confiance. Fini les corrélations trompeuses.",
              },
            ].map((f) => (
              <div key={f.title} style={{ background: colorLight, borderRadius: 16, padding: 32, border: "1px solid #ccfbf1" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#134e4a", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: colorLight, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#134e4a", textAlign: "center", marginBottom: 48 }}>
            Comment ça marche ?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                step: "01",
                title: "Importez vos données",
                desc: "CSV, SQL, data warehouse — CausalAI accepte vos données observationnelles ou expérimentales sans prétraitement complexe.",
              },
              {
                step: "02",
                title: "Découverte du graphe causal",
                desc: "L'algorithme identifie automatiquement les relations de causalité directes et indirectes entre vos variables métier.",
              },
              {
                step: "03",
                title: "Simulations et recommandations",
                desc: "Interrogez le modèle causal : impact d'une action, estimation d'effet, plan d'expérience optimal — réponses en langage naturel.",
              },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", gap: 24, alignItems: "flex-start", background: "#fff", borderRadius: 16, padding: 28 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 900, color: "#ccfbf1", minWidth: 56 }}>{s.step}</div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#134e4a", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: color, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Prenez de meilleures décisions grâce à la causalité
          </h2>
          <p style={{ color: "#ccfbf1", fontSize: 18, marginBottom: 36 }}>Analyse pilote sur vos données en 24h.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer"
              style={{ background: "#fff", color, padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              Réserver une démo
            </a>
            <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20CausalAI%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer"
              style={{ background: "#25d366", color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#134e4a", color: "#99f6e4", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>CausalAI</div>
          <p style={{ fontSize: 14, marginBottom: 4 }}>
            <a href="mailto:team@wikolabs.com" style={{ color: "#99f6e4", textDecoration: "none" }}>team@wikolabs.com</a>
            {" · "}
            <a href="https://wikolabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#99f6e4", textDecoration: "none" }}>wikolabs.com</a>
          </p>
          <p style={{ color: "#99f6e4", marginTop: 8, fontSize: 13, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:team@wikolabs.com" style={{ color: "#99f6e4", textDecoration: "none" }}>team@wikolabs.com</a>
            <span>·</span>
            <a href="tel:+261386626100" style={{ color: "#99f6e4", textDecoration: "none" }}>+261 38 66 261 00</a>
            <span>·</span>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" style={{ color: "#99f6e4", textDecoration: "none" }}>Prendre RDV</a>
          </p>
          <p style={{ fontSize: 13, color: "#14b8a6" }}>© 2026 Wikolabs. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
