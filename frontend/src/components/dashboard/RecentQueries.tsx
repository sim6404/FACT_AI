"use client";

import { MessageSquare, ChevronRight, TrendingUp, FileSearch } from "lucide-react";
import Link from "next/link";

const QUERIES = [
  { id: 1, question: "다음 2주 생산계획 기준 안전재고 미달 품목과 추천 발주 수량은?", user: "이구매", time: "오전 9:12", type: "structured",  result: "7개 품목 미달 · 발주 추천 생성" },
  { id: 2, question: "지난 4주간 반복 불량 패턴과 원인 후보를 알려줘",               user: "박품질", time: "오전 8:45", type: "mixed",       result: "3개 패턴 분석 · 클레임 5건 참조" },
  { id: 3, question: "이번 주 경영회의용 제조 운영 요약본 만들어줘",                  user: "김경영", time: "오전 8:30", type: "report",      result: "보고서 초안 생성 완료" },
  { id: 4, question: "A공급사 납기 준수율 최근 6개월 추이는?",                        user: "이구매", time: "어제",       type: "structured",  result: "차트 생성 · SQL 표시됨" },
];

const TYPE_STYLES: Record<string, string> = {
  structured: "badge-blue",
  mixed:      "badge-purple",
  report:     "badge-green",
  document:   "badge-gray",
};
const TYPE_LABELS: Record<string, string> = {
  structured: "정형 분석",
  mixed:      "혼합 질의",
  report:     "보고서",
  document:   "문서 검색",
};

export function RecentQueries() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-400" />
          최근 AI 질의
        </h2>
        <Link href="/query" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          새 질의 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {QUERIES.map(q => (
          <div key={q.id} className="group p-3 rounded-lg border border-surface-border hover:border-brand-700 hover:bg-surface-hover transition-all cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-3 h-3 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`badge text-[10px] ${TYPE_STYLES[q.type]}`}>{TYPE_LABELS[q.type]}</span>
                  <span className="text-[10px] text-slate-600">{q.user} · {q.time}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{q.question}</p>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <FileSearch className="w-3 h-3" /> {q.result}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
