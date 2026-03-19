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

  // 반원 게이지 SVG 계산
  const radius = 40;
  const circumference = Math.PI * radius; // 반원 둘레
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
        <span className="text-xs text-gray-500">{score}점</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-gray-700">낙화 위험도</h3>

      {/* 반원 게이지 */}
      <div className="flex flex-col items-center gap-1">
        <svg width="100" height="55" viewBox="-5 -5 110 60">
          {/* 배경 반원 */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#fce4ec"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* 진행 반원 */}
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

      {/* 기여도 바 */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-10 text-gray-500">🌧️ 비</span>
          <div className="bg-blossom-100 h-1.5 flex-1 rounded-full">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-500"
              style={{ width: `${rainContribution}%` }}
            />
          </div>
          <span className="w-8 text-right text-gray-400">
            {rainContribution}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-10 text-gray-500">💨 바람</span>
          <div className="bg-blossom-100 h-1.5 flex-1 rounded-full">
            <div
              className="h-full rounded-full bg-orange-400 transition-all duration-500"
              style={{ width: `${windContribution}%` }}
            />
          </div>
          <span className="w-8 text-right text-gray-400">
            {windContribution}%
          </span>
        </div>
      </div>

      {/* 추천 메시지 */}
      <p className="bg-blossom-50 rounded-lg px-3 py-2 text-center text-xs text-gray-600">
        {recommendation}
      </p>
    </div>
  );
}
