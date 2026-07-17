"use client";

import { useState } from "react";

export default function TriageForm({ onSubmit, loading }: any) {
  const [form, setForm] = useState({
    age: "",
    gender: "female",
    weight: "",
    temperature: "",
    heart_rate: "",
    respiratory_rate: "",
    oxygen_saturation: "",
    symptoms: "",
    duration: "",
    history: "",
  });

  const handleSubmit = () => {
    const payload = {
      patient: {
        age: parseInt(form.age),
        gender: form.gender,
        weight_kg: form.weight ? parseFloat(form.weight) : null,
      },
      vitals: {
        temperature_c: form.temperature ? parseFloat(form.temperature) : null,
        heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
        respiratory_rate: form.respiratory_rate
          ? parseInt(form.respiratory_rate)
          : null,
        oxygen_saturation: form.oxygen_saturation
          ? parseFloat(form.oxygen_saturation)
          : null,
      },
      symptoms: form.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
      duration_days: form.duration ? parseInt(form.duration) : null,
      history: form.history
        ? form.history.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  const field = (
    label: string,
    key: string,
    placeholder: string,
    type = "text"
  ) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={(form as any)[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold">Patient Assessment</h2>

      {/* Patient Info */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Patient
        </p>
        <div className="grid grid-cols-3 gap-3">
          {field("Age (years)", "age", "e.g. 4", "number")}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          {field("Weight (kg)", "weight", "e.g. 14", "number")}
        </div>
      </div>

      {/* Vitals */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Vitals
        </p>
        <div className="grid grid-cols-2 gap-3">
          {field("Temperature (°C)", "temperature", "e.g. 39.8", "number")}
          {field("Heart Rate (bpm)", "heart_rate", "e.g. 128", "number")}
          {field("Respiratory Rate", "respiratory_rate", "e.g. 34", "number")}
          {field("O2 Saturation (%)", "oxygen_saturation", "e.g. 94", "number")}
        </div>
      </div>

      {/* Clinical */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Clinical
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Symptoms{" "}
              <span className="text-gray-600">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. fever, difficulty breathing, chest indrawing"
              value={form.symptoms}
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          {field("Duration (days)", "duration", "e.g. 2", "number")}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Medical History{" "}
              <span className="text-gray-600">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. no prior illness, no vaccinations"
              value={form.history}
              onChange={(e) => setForm({ ...form, history: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !form.age || !form.symptoms}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Analyzing..." : "Run Triage Assessment →"}
      </button>
    </div>
  );
}