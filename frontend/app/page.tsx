"use client";

import { useState } from "react";
import TriageForm from "@/components/TriageForm";
import TriageResult from "@/components/TriageResult";

export default function Home() {
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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">🏥 MedTriage API</h1>
            <p className="text-gray-400 text-sm">
              AI-powered triage for community health workers
            </p>
          </div>
          <span className="bg-green-900 text-green-300 text-xs px-3 py-1 rounded-full font-medium">
            v1.0.0 · Live
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <TriageForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {result && <TriageResult result={result} />}
      </div>
    </main>
  );
}