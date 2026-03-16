"use client";

import { FileText, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const REPORTS = [
  { id: 1, title: "경영 운영 요약",   dept: "전사",    status: "review",    week: "12주차" },
  { id: 2, title: "구매/자재 현황",   dept: "구매",    status: "generated", week: "12주차" },
  { id: 3, title: "생산 실적 분석",   dept: "생산",    status: "done",      week: "12주차" },
  { id: 4, title: "품질 KPI 보고",    dept: "품질",    status: "pending",   week: "12주차" },
];

const STATUS_CFG: Record<string, { label: string; icon: typeof CheckCircle; cls: string }> = {
  done:      { label: "배포 완료", icon: CheckCircle,  cls: "text-accent-green" },
  review:    { label: "승인 대기", icon: Clock,         cls: "text-accent-amber" },
  generated: { label: "초안 생성", icon: FileText,      cls: "text-brand-400"   },
  pending:   { label: "생성 중",   icon: AlertCircle,   cls: "text-slate-500"   },
};

export function WeeklyReportStatus() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-purple" />
          주간 보고서 현황
        </h2>
        <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          보고서 센터 <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {REPORTS.map(r => {
          const cfg = STATUS_CFG[r.status];
          const Icon = cfg.icon;
          return (
            <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-hover cursor-pointer">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={clsx("w-3.5 h-3.5 flex-shrink-0", cfg.cls)} />
                <span className="text-xs text-slate-200 truncate">{r.title}</span>
                <span className="badge-gray text-[10px]">{r.dept}</span>
              </div>
              <span className={clsx("text-[10px] flex-shrink-0", cfg.cls)}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
