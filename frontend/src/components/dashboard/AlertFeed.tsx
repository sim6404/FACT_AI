"use client";

import { AlertTriangle, AlertCircle, Info, ChevronRight, Clock } from "lucide-react";
import { clsx } from "clsx";

interface Alert {
  id: number;
  severity: "critical" | "warning" | "info";
  dept: string;
  title: string;
  message: string;
  time: string;
  source: string;
}

const ALERTS: Alert[] = [
  {
    id: 1, severity: "critical", dept: "자재",
    title: "안전재고 위험: SUS304 (Φ50mm)",
    message: "현재 재고 1,200kg, 2주 생산계획 기준 소요량 2,800kg. 납기 고려 시 즉시 발주 필요.",
    time: "5분 전", source: "ERP 재고 시스템",
  },
  {
    id: 2, severity: "critical", dept: "생산",
    title: "설비 #M-07 비가동 발생 (프레스 라인 3)",
    message: "유압 시스템 이상 경보. 현재 비가동 2.3시간 누적. 유지보수팀 즉시 대응 필요.",
    time: "23분 전", source: "MES 설비 모니터링",
  },
  {
    id: 3, severity: "warning", dept: "품질",
    title: "반복 불량 패턴 감지: 용접부 기공 불량",
    message: "지난 3주 간 라인 #L02에서 동일 불량 유형 PPM 증가 추세. 원인 분석 보고서 확인 권장.",
    time: "1시간 전", source: "품질 검사 데이터",
  },
  {
    id: 4, severity: "warning", dept: "구매",
    title: "공급사 납기 지연 위험: A공급사 3건",
    message: "A공급사 납기 준수율 최근 4주 72.3%로 하락. 발주 #PO-2026-0312 등 3건 지연 예상.",
    time: "2시간 전", source: "구매 ERP",
  },
  {
    id: 5, severity: "info", dept: "경영지원",
    title: "주간 경영보고서 초안 자동 생성 완료",
    message: "2026년 12주차 제조운영 요약보고서 초안이 생성되었습니다. 검토 후 배포 승인 요청.",
    time: "3시간 전", source: "보고서 자동화",
  },
];

const SEVERITY_CONFIG = {
  critical: { icon: AlertCircle, bg: "bg-red-900/20 border-red-800/50",   badge: "badge-red",    text: "text-red-400"   },
  warning:  { icon: AlertTriangle, bg: "bg-amber-900/20 border-amber-800/50", badge: "badge-amber",  text: "text-amber-400" },
  info:     { icon: Info,  bg: "bg-blue-900/20 border-blue-800/50",  badge: "badge-blue",   text: "text-blue-400"  },
};

export function AlertFeed() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-amber" />
          오늘의 핵심 알림
          <span className="badge-red">
            {ALERTS.filter(a => a.severity === "critical").length}
          </span>
        </h2>
        <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          모두 보기 <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {ALERTS.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className={clsx("border rounded-lg p-3.5 cursor-pointer hover:opacity-90 transition-opacity", cfg.bg)}>
              <div className="flex items-start gap-3">
                <Icon className={clsx("w-4 h-4 mt-0.5 flex-shrink-0", cfg.text)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-slate-100">{alert.title}</span>
                    <span className={clsx("badge", cfg.badge)}>{alert.dept}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </span>
                    <span className="text-[10px] text-slate-600">출처: {alert.source}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
