const levelConfig: any = {
  EMERGENCY: {
    bg: "bg-red-900/40",
    border: "border-red-700",
    text: "text-red-300",
    badge: "bg-red-700 text-red-100",
    icon: "🚨",
  },
  URGENT: {
    bg: "bg-yellow-900/40",
    border: "border-yellow-700",
    text: "text-yellow-300",
    badge: "bg-yellow-700 text-yellow-100",
    icon: "⚠️",
  },
  ROUTINE: {
    bg: "bg-green-900/40",
    border: "border-green-700",
    text: "text-green-300",
    badge: "bg-green-700 text-green-100",
    icon: "✅",
  },
};

const likelihoodColor: any = {
  high: "text-red-400",
  moderate: "text-yellow-400",
  low: "text-gray-400",
};

export default function TriageResult({ result }: any) {
  const config = levelConfig[result.triage_level] || levelConfig.URGENT;
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <div className="space-y-4">
      {/* Triage Level */}
      <div className={`${config.bg} ${config.border} border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <p className="text-gray-400 text-sm">Triage Level</p>
              <p className={`text-2xl font-bold ${config.text}`}>
                {result.triage_level}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Confidence</p>
            <p className="text-2xl font-bold text-white">{confidencePct}%</p>
            <div className="w-24 bg-gray-700 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Differentials */}
      {result.differentials?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-gray-200">
            Differential Diagnoses
          </h3>
          <div className="space-y-2">
            {result.differentials.map((d: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div>
                  <p className="text-white text-sm font-medium">{d.condition}</p>
                  {d.icd_code && (
                    <p className="text-gray-500 text-xs">{d.icd_code}</p>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold uppercase ${
                    likelihoodColor[d.likelihood] || "text-gray-400"
                  }`}
                >
                  {d.likelihood}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Actions */}
      {result.immediate_actions?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-gray-200">
            Immediate Actions
          </h3>
          <ul className="space-y-2">
            {result.immediate_actions.map((action: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 mt-0.5">→</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {result.reasoning && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-gray-200">Clinical Reasoning</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {result.reasoning}
          </p>
        </div>
      )}

      {/* Uncertainty Flags */}
      {result.uncertainty_flags?.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-yellow-300">
            ⚠️ Uncertainty Flags
          </h3>
          <ul className="space-y-1">
            {result.uncertainty_flags.map((flag: string, i: number) => (
              <li key={i} className="text-yellow-200 text-sm">
                • {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <p className="text-gray-500 text-xs leading-relaxed">
          ⚕️ {result.disclaimer}
        </p>
      </div>
    </div>
  );
}