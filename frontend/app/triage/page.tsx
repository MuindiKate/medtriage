"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import TriageForm from "@/components/TriageForm";
import TriageResult from "@/components/TriageResult";

export default function TriagePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Something went wrong");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      {/* Nav */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={26} />
            <span
              className="font-display font-semibold"
              style={{ color: "var(--text)" }}
            >
              MedTriage
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-md"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-3)",
              }}
            >
              Assessment Tool
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--routine)" }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-3)" }}
              >
                API connected
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Page header */}
      <div
        className="px-6 py-8"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p
            className="font-mono text-xs font-medium tracking-widest uppercase mb-2"
            style={{ color: "var(--primary-mid)" }}
          >
            Clinical Decision Support
          </p>
          <h1
            className="font-display text-2xl font-semibold"
            style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            Patient Triage Assessment
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
            Results grounded in WHO IMCI and Kenya Clinical Guidelines.
            Always requires professional clinical review.
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TriageForm onSubmit={handleSubmit} loading={loading} />

        <div>
          {!result && !loading && !error && (
            <div
              className="h-full min-h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--surface-2)" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: "var(--text-3)" }}
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <p
                className="font-medium text-sm mb-1"
                style={{ color: "var(--text)" }}
              >
                Assessment will appear here
              </p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Fill in patient data and run the assessment
              </p>
            </div>
          )}

          {loading && (
            <div
              className="h-full min-h-64 flex flex-col items-center justify-center rounded-2xl border p-12 text-center"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-4"
                style={{ borderColor: "var(--primary)" }}
              />
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Analyzing patient data
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
                Retrieving guidelines · Reasoning with Claude
              </p>
            </div>
          )}

          {error && (
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "#FEF2F2",
                borderColor: "#FECACA",
                color: "#991B1B",
              }}
            >
              <p className="font-semibold text-sm mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && <TriageResult result={result} />}
        </div>
      </div>
    </main>
  );
}