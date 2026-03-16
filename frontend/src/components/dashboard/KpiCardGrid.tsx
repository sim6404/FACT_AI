"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { clsx } from "clsx";

interface KpiItem {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: number;       // % change
  status: "good" | "warn" | "bad" | "neutral";
  dept: string;
  target?: string;
}

const KPI_DATA: KpiItem[] = [
  { id: "budget",    label: "예산 집행률",       value: "72.4",  unit: "%",  trend:  2.1,  status: "good",    dept: "경영지원", target: "75%" },
  { id: "oee",       label: "설비 OEE",           value: "84.2",  unit: "%",  trend: -1.8,  status: "warn",    dept: "생산",     target: "88%" },
  { id: "ppm",       label: "PPM 불량률",          value: "1,240", unit: "ppm",trend: -8.3,  status: "good",    dept: "품질",     target: "<1,500" },
  { id: "delivery",  label: "납기 준수율",          value: "91.6",  unit: "%",  trend: -3.2,  status: "warn",    dept: "구매",     target: "95%" },
  { id: "inventory", label: "안전재고 미달 품목",   value: "7",     unit: "개", trend:  3,    status: "bad",     dept: "자재",     target: "0" },
  { id: "prod",      label: "생산 목표 달성률",     value: "96.8",  unit: "%",  trend:  1.2,  status: "good",    dept: "생산",     target: "95%" },
  { id: "downtime",  label: "비가동 시간",          value: "2.4",   unit: "h",  trend: -0.6,  status: "good",    dept: "생산" },
  { id: "claim",     label: "클레임 처리 리드타임", value: "4.2",   unit: "일", trend: -0.8,  status: "good",    dept: "품질",     target: "<5일" },
];

const STATUS_STYLES: Record<string, { border: string; bg: string }> = {
  good:    { border: "1px solid rgba(74,140,58,0.35)",  bg: "rgba(74,140,58,0.06)" },
  warn:    { border: "1px solid rgba(212,146,10,0.35)", bg: "rgba(212,146,10,0.06)" },
  bad:     { border: "1px solid rgba(239,68,68,0.35)",  bg: "rgba(239,68,68,0.06)" },
  neutral: { border: "1px solid #383838",               bg: "transparent" },
};

const STATUS_TEXT: Record<string, string> = {
  good:    "#4A8C3A",
  warn:    "#D4920A",
  bad:     "#ef4444",
  neutral: "#888",
};

function TrendIcon({ trend }: { trend: number }) {
  if (trend > 0)  return <TrendingUp   className="w-3.5 h-3.5" style={{ color: "#4A8C3A" }} />;
  if (trend < 0)  return <TrendingDown className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />;
  return              <Minus        className="w-3.5 h-3.5" style={{ color: "#666" }} />;
}

export function KpiCardGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPI_DATA.map(kpi => {
        const s = STATUS_STYLES[kpi.status];
        return (
          <div
            key={kpi.id}
            className="kpi-card transition-all hover:scale-[1.02]"
            style={{ border: s.border, background: `${s.bg}` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <span className="text-xs leading-tight" style={{ color: "#888" }}>{kpi.label}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ background: "#2a2a2a", color: "#777", border: "1px solid #383838" }}
              >
                {kpi.dept}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold" style={{ color: STATUS_TEXT[kpi.status] }}>
                {kpi.value}
              </span>
              <span className="text-xs mb-0.5" style={{ color: "#666" }}>{kpi.unit}</span>
            </div>

            {/* Trend + Target */}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-1">
                <TrendIcon trend={kpi.trend} />
                <span className="text-xs" style={{ color: kpi.trend > 0 ? "#4A8C3A" : kpi.trend < 0 ? "#ef4444" : "#666" }}>
                  {kpi.trend > 0 ? "+" : ""}{kpi.trend}{kpi.unit === "개" ? "개" : "%"}
                </span>
                <span className="text-xs" style={{ color: "#555" }}>전주 대비</span>
              </div>
              {kpi.target && (
                <span className="text-[10px]" style={{ color: "#555" }}>목표 {kpi.target}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
