import { CloudRain, Wind } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { RISK_COLOR, RISK_LABEL } from "@/lib/utils/petal-fall";
import { PetalFallRisk as PetalFallRiskType } from "@/types/region";

interface Props {
  risk: PetalFallRiskType;
  compact?: boolean;
  className?: string;
}

export function PetalFallRisk({ risk, compact = false, className }: Props) {
  const { score, level, rainContribution, windContribution, recommendation } =
    risk;

  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const colorMap = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
    extreme: "#7b1fa2",
  };
  const gaugeColor = colorMap[level];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            RISK_COLOR[level]
          )}
        >
          낙화 위험 {RISK_LABEL[level]}
        </div>
        <span className="text-text-muted text-xs">{score}점</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-text-secondary text-sm font-semibold">낙화 위험도</h3>

      <div className="flex flex-col items-center gap-1">
        <svg width="100" height="55" viewBox="-5 -5 110 60">
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#3d1545"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${offset}`}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="-mt-2 text-center">
          <p className="text-2xl font-bold" style={{ color: gaugeColor }}>
            {score}
          </p>
          <p className="text-xs font-semibold" style={{ color: gaugeColor }}>
            {RISK_LABEL[level]}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex w-12 items-center gap-1 text-blue-700">
            <CloudRain size={11} /> 비
          </span>
          <div className="bg-sakura-800 h-1.5 flex-1 rounded-full">
            <div
              className="h-full rounded-full bg-blue-700 transition-all duration-500"
              style={{ width: `${rainContribution}%` }}
            />
          </div>
          <span className="text-text-dim w-8 text-right">
            {rainContribution}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex w-12 items-center gap-1 text-blue-300">
            <Wind size={11} /> 바람
          </span>
          <div className="bg-sakura-800 h-1.5 flex-1 rounded-full">
            <div
              className="h-full rounded-full bg-blue-300 transition-all duration-500"
              style={{ width: `${windContribution}%` }}
            />
          </div>
          <span className="text-text-dim w-8 text-right">
            {windContribution}%
          </span>
        </div>
      </div>

      <p className="bg-sakura-800 text-text-secondary rounded-lg px-3 py-2 text-center text-xs">
        {recommendation}
      </p>
    </div>
  );
}
