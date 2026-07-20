"use client";
import { useState } from "react";

const inputStyle = {
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "10px 12px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "Inter, sans-serif",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "500",
  color: "var(--text-2)",
  marginBottom: "6px",
};

const sectionLabelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--text-3)",
  marginBottom: "12px",
  fontFamily: "JetBrains Mono, monospace",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: any) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "var(--emergency)", marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--primary-mid)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

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

  const set = (key: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

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
        respiratory_rate: form.respiratory_rate ? parseInt(form.respiratory_rate) : null,
        oxygen_saturation: form.oxygen_saturation ? parseFloat(form.oxygen_saturation) : null,
      },
      symptoms: form.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
      duration_days: form.duration ? parseInt(form.duration) : null,
      history: form.history
        ? form.history.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  const isValid = form.age && form.symptoms;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Form header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--surface-2)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: "var(--primary)" }}
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              Patient Information
            </p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>
              Fields marked <span style={{ color: "var(--emergency)" }}>*</span> are required
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Patient */}
        <div>
          <p style={sectionLabelStyle}>Patient</p>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Age (years)"
              value={form.age}
              onChange={set("age")}
              placeholder="e.g. 4"
              type="number"
              required
            />
            <div>
              <label style={labelStyle}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender")(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-mid)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <Field
              label="Weight (kg)"
              value={form.weight}
              onChange={set("weight")}
              placeholder="e.g. 14"
              type="number"
            />
          </div>
        </div>

        {/* Vitals */}
        <div>
          <p style={sectionLabelStyle}>Vitals</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Temperature (°C)"
              value={form.temperature}
              onChange={set("temperature")}
              placeholder="e.g. 39.8"
              type="number"
            />
            <Field
              label="Heart Rate (bpm)"
              value={form.heart_rate}
              onChange={set("heart_rate")}
              placeholder="e.g. 128"
              type="number"
            />
            <Field
              label="Respiratory Rate"
              value={form.respiratory_rate}
              onChange={set("respiratory_rate")}
              placeholder="e.g. 34"
              type="number"
            />
            <Field
              label="O2 Saturation (%)"
              value={form.oxygen_saturation}
              onChange={set("oxygen_saturation")}
              placeholder="e.g. 94"
              type="number"
            />
          </div>
        </div>

        {/* Clinical */}
        <div>
          <p style={sectionLabelStyle}>Clinical</p>
          <div className="space-y-3">
            <div>
              <label style={labelStyle}>
                Symptoms <span style={{ color: "var(--emergency)" }}>*</span>
                <span style={{ color: "var(--text-3)", fontWeight: 400 }}>
                  {" "}— comma separated
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. fever, difficulty breathing, chest indrawing"
                value={form.symptoms}
                onChange={(e) => set("symptoms")(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-mid)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <Field
              label="Duration (days)"
              value={form.duration}
              onChange={set("duration")}
              placeholder="e.g. 2"
              type="number"
            />
            <div>
              <label style={labelStyle}>
                Medical History
                <span style={{ color: "var(--text-3)", fontWeight: 400 }}>
                  {" "}— comma separated
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. no prior illness, no vaccinations"
                value={form.history}
                onChange={(e) => set("history")(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-mid)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="w-full font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          style={{
            background: isValid && !loading ? "var(--primary)" : "var(--surface-2)",
            color: isValid && !loading ? "white" : "var(--text-3)",
            cursor: isValid && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "white" }}
              />
              Analyzing...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Run Triage Assessment
            </>
          )}
        </button>
      </div>
    </div>
  );
}