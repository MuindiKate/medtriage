"use client";
import { useEffect, useState } from "react";

const levelConfig: any = {
  EMERGENCY: {
    bg: "bg-red-950/50",
    border: "border-red-700/50",
    text: "text-red-400",
    pulse: "bg-red-500",
    icon: "🚨",
    label: "Emergency",
  },
  URGENT: {
    bg: "bg-amber-950/50",
    border: "border-amber-700/50",
    text: "text-amber-400",
    pulse: "bg-amber-500",
    icon: "⚠️",
    label: "Urgent",
  },
  ROUTINE: {
    bg: "bg-emerald-950/50",
    border: "border-emerald-700/50",
    text: "text-emerald-400",
    pulse: "bg-emerald-500",
    icon: "✅",
    label: "Routine",
  },
};

const likelihoodConfig: any = {
  high: { color: "text-red-400", bg: "bg-red-950/40 border-red-800/40" },
  moderate: { color: "text-amber-400", bg: "bg-amber-950/40 border-amber-800/40" },
  low: { color: "text-slate-400", bg: "bg-slate-800/40 border-slate-700/40" },
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
      className={`space-y-4 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* Triage Level Card */}
      <div className={`${config.bg} ${config.border} border rounded-2xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Pulse indicator */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <div
                className={`absolute w-12 h-12 ${config.pulse} rounded-full opacity-20 animate-ping`}
              />
              <div className={`w-6 h-6 ${config.pulse} rounded-full`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-mono mb-0.5">
                Triage Level
              </p>
              <p className={`text-2xl font-bold font-mono ${config.text}`}>
                {config.label}
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div className="text-right">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-mono mb-1">
              Confidence
            </p>
            <p className="text-3xl font-bold font-mono text-white">
              {confidencePct}
              <span className="text-lg text-slate-400">%</span>
            </p>
            <div className="w-20 bg-slate-800 rounded-full h-1 mt-2 ml-auto">
              <div
                className={`${config.pulse} h-1 rounded-full transition-all duration-700`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Differentials */}
      {result.differentials?.length > 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-4">
            Differential Diagnoses
          </p>
          <div className="space-y-2">
            {result.differentials.map((d: any, i: number) => {
              const lc = likelihoodConfig[d.likelihood] || likelihoodConfig.low;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border ${lc.bg}`}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{d.condition}</p>
                    {d.icd_code && (
                      <p className="text-slate-500 text-xs font-mono mt-0.5">
                        {d.icd_code}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-bold uppercase font-mono ${lc.color}`}>
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
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-4">
            Immediate Actions
          </p>
          <ul className="space-y-2">
            {result.immediate_actions.map((action: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="text-blue-400 font-mono text-xs mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {result.reasoning && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-3">
            Clinical Reasoning
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
        </div>
      )}

      {/* Uncertainty Flags */}
      {result.uncertainty_flags?.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-5">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-mono mb-3">
            ⚠️ Uncertainty Flags
          </p>
          <ul className="space-y-1.5">
            {result.uncertainty_flags.map((flag: string, i: number) => (
              <li key={i} className="text-amber-200/80 text-sm flex items-start gap-2">
                <span className="text-amber-500 shrink-0">·</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-white/5 rounded-2xl p-4">
        <p className="text-slate-500 text-xs leading-relaxed">
          <span className="text-slate-400 font-medium">⚕️ Disclaimer · </span>
          {result.disclaimer}
        </p>
      </div>
    </div>
  );
}