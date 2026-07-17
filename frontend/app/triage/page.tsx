"use client";

import { useState } from "react";
import Link from "next/link";
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
    <main className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Nav */}
      <nav className="bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>🏥</span>
            <span className="font-bold tracking-tight">MedTriage</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">API connected</span>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-2">
            Assessment Tool
          </p>
          <h1 className="text-2xl font-bold">Patient Triage Assessment</h1>
          <p className="text-slate-400 text-sm mt-1">
            Enter patient data below. Results are grounded in WHO IMCI and Kenya Clinical Guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Form */}
          <div>
            <TriageForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Right — Result */}
          <div>
            {!result && !loading && !error && (
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl p-12 text-center">
                <div>
                  <p className="text-4xl mb-4">⚕️</p>
                  <p className="text-slate-400 text-sm">
                    Fill in patient data and run the assessment.
                    <br />
                    Results will appear here.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center border border-white/5 rounded-2xl p-12 text-center">
                <div>
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">
                    Retrieving guidelines and analyzing...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-red-300">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {result && <TriageResult result={result} />}
          </div>
        </div>
      </div>
    </main>
  );
}