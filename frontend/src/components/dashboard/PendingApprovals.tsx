"use client";

import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const APPROVALS = [
  { id: 1, type: "발주 승인",     title: "SUS304 긴급 발주 2,000kg",   dept: "구매", amount: "₩48,400,000", urgency: "urgent" },
  { id: 2, type: "보고서 배포",   title: "12주차 경영보고서 배포",       dept: "경영지원", amount: null,       urgency: "normal" },
  { id: 3, type: "품질 조치",     title: "L02 용접공정 긴급 조치안",     dept: "품질",  amount: null,         urgency: "urgent" },
];

export function PendingApprovals() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-amber" />
          승인 대기
          <span className="badge-amber">{APPROVALS.length}</span>
        </h2>
        <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          승인함 <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {APPROVALS.map(a => (
          <div key={a.id} className="p-3 rounded-lg bg-surface-DEFAULT border border-surface-border hover:border-brand-600 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="badge-gray text-[10px]">{a.type}</span>
                  {a.urgency === "urgent" && <span className="badge-red text-[10px]">긴급</span>}
                </div>
                <p className="text-xs text-slate-200 truncate">{a.title}</p>
                {a.amount && <p className="text-xs text-accent-amber mt-0.5">{a.amount}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="p-1.5 rounded bg-green-900/30 hover:bg-green-900/50 text-accent-green transition-colors">
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded bg-red-900/30 hover:bg-red-900/50 text-accent-red transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
