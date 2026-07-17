"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const stats = [
  { value: "1:10,000", label: "Doctors per patient in Kenya", sub: "WHO recommends 1:1,000" },
  { value: "45,000+", label: "Community health workers", sub: "Making triage decisions daily" },
  { value: "0", label: "AI decision support tools", sub: "Built for CHW workflows" },
];

const steps = [
  {
    num: "01",
    title: "CHW enters patient data",
    desc: "Symptoms, vitals, age, history — structured input designed for low-bandwidth environments.",
  },
  {
    num: "02",
    title: "RAG retrieval grounds the response",
    desc: "WHO IMCI guidelines and Kenya Clinical Guidelines are retrieved by semantic similarity — not guessed from model weights.",
  },
  {
    num: "03",
    title: "Claude reasons, guardrails validate",
    desc: "Structured triage assessment with confidence score, uncertainty flags, and a non-negotiable disclaimer.",
  },
];

const differentiators = [
  {
    icon: "🔍",
    title: "Explainability first",
    desc: "Every response includes the full reasoning chain. In clinical contexts, why matters as much as what.",
  },
  {
    icon: "📋",
    title: "Grounded in guidelines",
    desc: "RAG architecture retrieves WHO IMCI and Kenya Clinical Guidelines before Claude reasons — not after.",
  },
  {
    icon: "⚠️",
    title: "Honest about uncertainty",
    desc: "Missing vitals, ambiguous symptoms, low confidence — all flagged explicitly. Never a false certainty.",
  },
  {
    icon: "🔌",
    title: "API-first infrastructure",
    desc: "Any CHW app, NGO tool, or government system can integrate. Built to be the layer underneath.",
  },
];

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <span className="font-bold text-white tracking-tight">MedTriage</span>
            <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              API Docs
            </a>
            <Link
              href="/triage"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Try Demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-blue-400 text-sm font-mono tracking-widest uppercase mb-6">
              Clinical Decision Support · Sub-Saharan Africa
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Better triage decisions
              <br />
              <span className="text-blue-400">save lives.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              An AI-powered REST API that gives community health workers in Kenya
              structured triage assessments — grounded in WHO guidelines,
              explainable by design, honest about uncertainty.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/triage"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                Try the demo →
              </Link>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                View API docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold font-mono text-white mb-1">
                {s.value}
              </p>
              <p className="text-slate-300 text-sm font-medium">{s.label}</p>
              <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-bold mb-12">
            From symptoms to assessment in seconds.
          </h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 bg-[#111827] border border-white/5 rounded-2xl hover:border-blue-500/20 transition-colors"
              >
                <span className="text-blue-400 font-mono text-sm font-bold shrink-0 mt-0.5">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 px-6 bg-[#0D1424]">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3">
            Why MedTriage
          </p>
          <h2 className="text-3xl font-bold mb-12">
            Built for the context, not borrowed from it.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className="p-6 bg-[#111827] border border-white/5 rounded-2xl hover:border-blue-500/20 transition-colors"
              >
                <span className="text-2xl mb-3 block">{d.icon}</span>
                <h3 className="font-semibold text-white mb-2">{d.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            See it work on a real case.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Enter patient data and get a structured triage assessment — urgency
            level, differential diagnoses, reasoning, and uncertainty flags.
          </p>
          <Link
            href="/triage"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors"
          >
            Open assessment tool →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-slate-500 text-sm">
          <p>MedTriage API · Built by Kat Muindi</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs">API live on localhost:8000</span>
          </div>
        </div>
      </footer>
    </main>
  );
}