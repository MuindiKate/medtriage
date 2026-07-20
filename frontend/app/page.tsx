"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const stats = [
  { value: "1:10,000", label: "Doctor-to-patient ratio in Kenya", note: "WHO recommends 1:1,000" },
  { value: "45,000+", label: "Community health workers", note: "Making triage decisions daily" },
  { value: "0", label: "Affordable AI triage tools", note: "Built for CHW workflows" },
];

const steps = [
  {
    num: "01",
    title: "Submit patient data",
    desc: "Symptoms, vitals, age, and history — structured input designed for low-bandwidth CHW environments.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Guidelines are retrieved",
    desc: "WHO IMCI and Kenya Clinical Guidelines are retrieved by semantic similarity — responses are grounded, not guessed.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Structured assessment returned",
    desc: "Urgency level, differentials, reasoning, and uncertainty flags — with a non-negotiable disclaimer on every response.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

const differentiators = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Explainability first",
    desc: "Every response includes the full reasoning chain. In clinical contexts, why matters as much as what.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Grounded in guidelines",
    desc: "RAG architecture retrieves WHO IMCI and Kenya Clinical Guidelines before Claude reasons — never from model weights alone.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Honest about uncertainty",
    desc: "Missing vitals, ambiguous symptoms, low confidence — all flagged explicitly. Never a false certainty.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "API-first infrastructure",
    desc: "Any CHW app, NGO tool, or government system can integrate. Built to be the layer underneath.",
  },
];

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "var(--surface)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={28} />
            <span className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>
              MedTriage
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium transition-colors hidden md:block"
              style={{ color: "var(--text-2)" }}
            >
              API Docs
            </a>
            <a
              href="https://github.com/MuindiKate/medtriage"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium transition-colors hidden md:block"
              style={{ color: "var(--text-2)" }}
            >
              GitHub
            </a>
            <ThemeToggle />
            <Link
              href="/triage"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              Try Demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium mb-8 border"
              style={{
                background: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--primary-mid)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Clinical Decision Support · Sub-Saharan Africa
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-semibold leading-tight mb-6"
              style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              Better triage
              <br />
              decisions{" "}
              <em className="not-italic" style={{ color: "var(--primary-mid)" }}>
                save lives.
              </em>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
              style={{ color: "var(--text-2)" }}
            >
              An AI-powered REST API that gives community health workers
              in Kenya structured triage assessments — grounded in WHO
              guidelines, explainable by design, honest about uncertainty.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/triage"
                className="font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
                style={{ background: "var(--primary)", color: "white" }}
              >
                Try the assessment tool →
              </Link>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="font-medium px-8 py-3.5 rounded-xl transition-all text-sm border" style={{ borderColor: "var(--border-2)", color: "var(--text-2)", background: "var(--surface)" }}>View API docs</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16 px-6"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((s, i) => (
            <div key={i}>
              <p
                className="font-mono text-4xl font-bold mb-1"
                style={{ color: "var(--primary)" }}
              >
                {s.value}
              </p>
              <p className="font-medium text-sm mb-1" style={{ color: "var(--text)" }}>
                {s.label}
              </p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--primary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs font-medium tracking-widest uppercase mb-6 text-green-300">
            The Problem
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-semibold leading-snug mb-6 text-white"
            style={{ letterSpacing: "-0.01em" }}
          >
            Kenya has 1 doctor per 10,000 people.
            <br />
            The gap is filled by community health workers
            <br />
            making life-or-death decisions — alone.
          </h2>
          <p className="text-green-200 leading-relaxed max-w-2xl">
            Community health workers at rural health posts make triage decisions
            with minimal training and no decision support tools. Serious conditions
            get sent home. Minor conditions occupy scarce hospital beds. Both
            outcomes cost lives. MedTriage exists to change that.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="font-mono text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "var(--primary-mid)" }}
          >
            How it works
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-semibold mb-12"
            style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            From symptoms to assessment
            <br />
            in seconds.
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 rounded-2xl border transition-all"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--surface-2)", color: "var(--primary)" }}
                >
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: "var(--text-3)" }}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 px-6" style={{ background: "var(--surface-2)" }}>
        <div className="max-w-4xl mx-auto">
          <p
            className="font-mono text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "var(--primary-mid)" }}
          >
            Why MedTriage
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-semibold mb-12"
            style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            Built for the context,
            <br />
            not borrowed from it.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border transition-all"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--surface-2)", color: "var(--primary)" }}
                >
                  {d.icon}
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--text)" }}>
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-display text-3xl md:text-4xl font-semibold mb-4"
            style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            See it work on a real case.
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: "var(--text-2)" }}>
            Enter patient data and get a structured triage assessment —
            urgency level, differential diagnoses, reasoning, and uncertainty flags.
          </p>
          <Link
            href="/triage"
            className="inline-block font-semibold px-10 py-4 rounded-xl transition-all text-sm"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Open assessment tool →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ color: "var(--text-3)" }}
        >
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <span className="text-sm">
              MedTriage · Built by{" "}
              <a 
                href="https://github.com/MuindiKate"
                target="_blank"
                rel="noreferrer"
                className="transition-colors"
                style={{ color: "var(--text-2)" }}
              >
                Catherine Muindi
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-current"
              style={{ color: "var(--text-3)" }}
            >
              API Docs
            </a>
            <a
              href="https://github.com/MuindiKate/medtriage"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-current"
              style={{ color: "var(--text-3)" }}
            >
              GitHub
            </a>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">API live</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}