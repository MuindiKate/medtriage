"use client";
import { useEffect, useState } from "react";

const levelConfig: any = {
  EMERGENCY: {
    borderColor: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    badge: "#DC2626",
    label: "Emergency",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  URGENT: {
    borderColor: "#D97706",
    bg: "#FFFBEB",
    text: "#92400E",
    badge: "#D97706",
    label: "Urgent",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  ROUTINE: {
    borderColor: "#059669",
    bg: "#F0FDF4",
    text: "#065F46",
    badge: "#059669",
    label: "Routine",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

const likelihoodConfig: any = {
  high: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  moderate: { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  low: { color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
};

export default function TriageResult({ result }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, [result]);

  const config = levelConfig[result.triage_level] || levelConfig.URGENT;
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <div
      className={`space-y-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Triage Level — signature left border */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: config.bg,
          borderColor: config.borderColor,
          borderLeftWidth: "4px",
        }}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <p
                className="text-xs font-mono font-medium tracking-widest uppercase"
                style={{ color: config.text, opacity: 0.7 }}
              >
                Triage Level
              </p>
              <p
                className="text-xl font-bold font-mono"
                style={{ color: config.text }}
              >
                {config.label}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-xs font-mono font-medium tracking-widest uppercase mb-1"
              style={{ color: config.text, opacity: 0.7 }}
            >
              Confidence
            </p>
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: config.text }}
            >
              {confidencePct}%
            </p>
            <div
              className="w-20 h-1 rounded-full mt-1 ml-auto"
              style={{ background: `${config.borderColor}30` }}
            >
              <div
                className="h-1 rounded-full transition-all duration-700"
                style={{
                  width: `${confidencePct}%`,
                  background: config.borderColor,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Differentials */}
      {result.differentials?.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-3)" }}
          >
            Differential Diagnoses
          </p>
          <div className="space-y-2">
            {result.differentials.map((d: any, i: number) => {
              const lc = likelihoodConfig[d.likelihood] || likelihoodConfig.low;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ background: lc.bg, borderColor: lc.border }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {d.condition}
                    </p>
                    {d.icd_code && (
                      <p
                        className="text-xs font-mono mt-0.5"
                        style={{ color: "var(--text-3)" }}
                      >
                        {d.icd_code}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold font-mono uppercase px-2 py-1 rounded-lg"
                    style={{ color: lc.color, background: `${lc.color}15` }}
                  >
                    {d.likelihood}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Immediate Actions */}
      {result.immediate_actions?.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-3)" }}
          >
            Immediate Actions
          </p>
          <ul className="space-y-2">
            {result.immediate_actions.map((action: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className="font-mono text-xs font-bold shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--primary)",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--text-2)" }}>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {result.reasoning && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--text-3)" }}
          >
            Clinical Reasoning
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            {result.reasoning}
          </p>
        </div>
      )}

      {/* Uncertainty Flags */}
      {result.uncertainty_flags?.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "#FFFBEB",
            borderColor: "#FDE68A",
            borderLeftWidth: "4px",
            borderLeftColor: "#D97706",
          }}
        >
          <p className="text-xs font-mono font-semibold tracking-widest uppercase mb-3 text-amber-700">
            Uncertainty Flags
          </p>
          <ul className="space-y-1.5">
            {result.uncertainty_flags.map((flag: string, i: number) => (
              <li
                key={i}
                className="text-sm flex items-start gap-2 text-amber-800"
              >
                <span className="shrink-0 mt-0.5">·</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
          <span style={{ color: "var(--text-2)", fontWeight: 500 }}>
            ⚕️ Clinical Disclaimer ·{" "}
          </span>
          {result.disclaimer}
        </p>
      </div>
    </div>
  );
}