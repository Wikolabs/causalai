import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "CausalAI — Passez de la corrélation à la causalité",
  description: "IA causale sur vos données — graphes causaux auto-découverts, simulations counterfactuelles et recommandations d'actions prouvées.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-body)", background: "#f0fdfa" }}>{children}</body>
    </html>
  );
}
