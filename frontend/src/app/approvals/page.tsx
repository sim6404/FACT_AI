"use client";

import { useState } from "react";
import {
  CheckSquare, Clock, CheckCircle2, XCircle, AlertTriangle,
  User, Calendar, FileText, ChevronDown, ChevronUp,
  ThumbsUp, ThumbsDown, MessageSquare, Eye,
} from "lucide-react";

type ApprovalStatus = "대기" | "승인" | "반려" | "참조";
type ApprovalCategory = "구매요청" | "생산계획" | "품질개선" | "인사" | "기타";

interface Approval {
  id: number;
  doc_no: string;
  title: string;
  category: ApprovalCategory;
  requester: string;
  dept: string;
  requested_at: string;
  due_date: string;
  status: ApprovalStatus;
  amount?: number;
  description: string;
  comment?: string;
  urgent: boolean;
}

const INIT_APPROVALS: Approval[] = [
  { id:1,  doc_no:"AP-2603-018", title:"3월 4주차 원자재 구매요청",     category:"구매요청", requester:"박구매", dept:"구매팀",    requested_at:"2026-03-13", due_date:"2026-03-15", status:"대기",  amount:28500000, description:"천연고무 500kg, 스틸코드 200kg 긴급 발주 요청", urgent:true  },
  { id:2,  doc_no:"AP-2603-017", title:"4월 생산계획 승인 요청",          category:"생산계획", requester:"김생산", dept:"생산팀",    requested_at:"2026-03-13", due_date:"2026-03-14", status:"대기",  amount:undefined, description:"4월 라인별 생산계획 및 자재소요량 계획 승인",         urgent:true  },
  { id:3,  doc_no:"AP-2603-016", title:"SD-2341 불량 개선대책 보고",      category:"품질개선", requester:"이품질", dept:"품질팀",    requested_at:"2026-03-12", due_date:"2026-03-17", status:"대기",  amount:undefined, description:"STRW DAMPER 치수불량 원인분석 및 금형교체 대책안",    urgent:false },
  { id:4,  doc_no:"AP-2603-015", title:"2월 매입 정산 승인",              category:"구매요청", requester:"박구매", dept:"구매팀",    requested_at:"2026-03-11", due_date:"2026-03-13", status:"승인",  amount:142000000, description:"2월 원자재 전체 매입 정산 및 지급 승인 요청",          urgent:false },
  { id:5,  doc_no:"AP-2603-014", title:"설비 예방정비 계획 승인",         category:"생산계획", requester:"최생산", dept:"생산팀",    requested_at:"2026-03-10", due_date:"2026-03-12", status:"승인",  amount:5800000,  description:"A라인 프레스 설비 예방정비 계획 및 예산 승인",          urgent:false },
  { id:6,  doc_no:"AP-2603-013", title:"품질 검사장비 도입 검토 요청",    category:"품질개선", requester:"이품질", dept:"품질팀",    requested_at:"2026-03-09", due_date:"2026-03-16", status:"반려",  amount:18000000, description:"3D 측정기 도입 예산 검토 — 추가 비교견적 요청으로 반려", urgent:false, comment:"타사 견적 2건 추가 첨부 후 재상신 요망" },
  { id:7,  doc_no:"AP-2603-012", title:"CS-001 이형제 긴급 구매요청",     category:"구매요청", requester:"정물류", dept:"생산지원팀", requested_at:"2026-03-08", due_date:"2026-03-10", status:"승인",  amount:1200000,  description:"이형제 재고 소진 예정 — 50통 긴급 발주 승인 요청",     urgent:false },
  { id:8,  doc_no:"AP-2603-011", title:"현대자동차 클레임 대응 보고",     category:"품질개선", requester:"김영업", dept:"영업팀",    requested_at:"2026-03-07", due_date:"2026-03-12", status:"승인",  amount:undefined, description:"CL-2603-001 현대자동차 클레임 최종 대응 결과 보고",    urgent:false },
  { id:9,  doc_no:"AP-2603-010", title:"3월 야근수당 지급 승인",          category:"인사",     requester:"한인사", dept:"인사팀",    requested_at:"2026-03-06", due_date:"2026-03-08", status:"승인",  amount:3200000,  description:"3월 1~2주 생산팀 야근수당 지급 명세 승인",              urgent:false },
  { id:10, doc_no:"AP-2603-009", title:"ISO 9001 내부심사 일정 공지",     category:"기타",     requester:"이품질", dept:"품질팀",    requested_at:"2026-03-05", due_date:"2026-03-20", status:"참조",  amount:undefined, description:"2026년 2분기 ISO 9001 내부심사 일정 공지 — 참조",       urgent:false },
];

const STATUS_CFG: Record<ApprovalStatus, { color: string; bg: string; icon: React.ElementType }> = {
  대기: { color: "text-amber-400",   bg: "bg-amber-500/15 border-amber-500/30",   icon: Clock },
  승인: { color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30", icon: CheckCircle2 },
  반려: { color: "text-red-400",     bg: "bg-red-500/15 border-red-500/30",       icon: XCircle },
  참조: { color: "text-slate-400",   bg: "bg-slate-500/15 border-slate-500/30",   icon: Eye },
};

const CAT_COLOR: Record<ApprovalCategory, string> = {
  구매요청: "bg-amber-500/20 text-amber-400",
  생산계획: "bg-blue-500/20 text-blue-400",
  품질개선: "bg-emerald-500/20 text-emerald-400",
  인사:     "bg-purple-500/20 text-purple-400",
  기타:     "bg-slate-500/20 text-slate-400",
};

function formatAmt(n?: number) {
  if (!n) return "—";
  return `${(n / 10000).toLocaleString()}만원`;
}

function DetailModal({ item, onClose, onApprove, onReject }: {
  item: Approval;
  onClose: () => void;
  onApprove: (id: number, comment: string) => void;
  onReject:  (id: number, comment: string) => void;
}) {
  const [comment, setComment] = useState("");
  const statusCfg = STATUS_CFG[item.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" style={{ background: "#1e1e1e", border: "1px solid #383838" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-slate-500 font-mono mb-1">{item.doc_no}</div>
            <h2 className="text-base font-bold text-white">{item.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white ml-4">✕</button>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">상태</span>
            <span className={`flex items-center gap-1 font-medium ${statusCfg.color}`}>
              <StatusIcon className="w-3.5 h-3.5" /> {item.status}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">분류</span>
            <span className={`text-xs px-2 py-0.5 rounded ${CAT_COLOR[item.category]}`}>{item.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">요청자</span>
            <span className="text-white">{item.requester} / {item.dept}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">요청일 / 마감</span>
            <span className="text-white">{item.requested_at} ~ {item.due_date}</span>
          </div>
          {item.amount && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">금액</span>
              <span className="text-emerald-300 font-mono font-bold">{formatAmt(item.amount)}</span>
            </div>
          )}
          <div className="rounded-xl p-3 mt-2" style={{ background: "#2a2a2a" }}>
            <div className="text-xs text-slate-400 mb-1">상세 내용</div>
            <p className="text-sm text-white">{item.description}</p>
          </div>
          {item.comment && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
              <div className="text-xs text-red-400 mb-1">반려 사유</div>
              <p className="text-sm text-white">{item.comment}</p>
            </div>
          )}
        </div>

        {item.status === "대기" && (
          <>
            <div className="mb-3">
              <label className="text-xs text-slate-400 mb-1 block">검토 의견</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                rows={2} placeholder="승인/반려 사유를 입력하세요"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { onReject(item.id, comment); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium flex items-center justify-center gap-2 border border-red-500/20">
                <ThumbsDown className="w-4 h-4" /> 반려
              </button>
              <button onClick={() => { onApprove(item.id, comment); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 border border-emerald-500/20">
                <ThumbsUp className="w-4 h-4" /> 승인
              </button>
            </div>
          </>
        )}
        {item.status !== "대기" && (
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm">닫기</button>
        )}
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const [items, setItems]           = useState<Approval[]>(INIT_APPROVALS);
  const [selected, setSelected]     = useState<Approval | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "전체">("전체");

  const filtered = items.filter(i => statusFilter === "전체" || i.status === statusFilter);

  const counts = {
    waiting:  items.filter(i => i.status === "대기").length,
    approved: items.filter(i => i.status === "승인").length,
    rejected: items.filter(i => i.status === "반려").length,
    ref:      items.filter(i => i.status === "참조").length,
  };

  const handleApprove = (id: number, comment: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "승인" as ApprovalStatus, comment } : i));
  };
  const handleReject = (id: number, comment: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "반려" as ApprovalStatus, comment } : i));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">승인함</h1>
        <p className="text-slate-400 text-sm mt-1">전자결재 · 구매승인 · 계획승인</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "결재 대기",  value: counts.waiting,  color: "text-amber-400",   badge: counts.waiting > 0 },
          { label: "승인 완료",  value: counts.approved, color: "text-emerald-400", badge: false },
          { label: "반려",       value: counts.rejected, color: "text-red-400",     badge: false },
          { label: "참조",       value: counts.ref,      color: "text-slate-400",   badge: false },
        ].map(kpi => (
          <div key={kpi.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 relative">
            {kpi.badge && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            <div className="text-xs text-slate-400 mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* 필터 탭 */}
      <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1 w-fit">
        {(["전체", "대기", "승인", "반려", "참조"] as (ApprovalStatus | "전체")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}>
            {s} {s === "전체" ? `(${items.length})` : s === "대기" ? `(${counts.waiting})` : ""}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="space-y-2">
        {filtered.map(item => {
          const statusCfg = STATUS_CFG[item.status];
          const StatusIcon = statusCfg.icon;
          return (
            <button key={item.id} onClick={() => setSelected(item)}
              className="w-full text-left bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/50 hover:border-slate-600/50 rounded-2xl p-4 transition-all group">
              <div className="flex items-start gap-4">
                {/* 긴급 표시 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.urgent && (
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">긴급</span>
                    )}
                    <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${CAT_COLOR[item.category]}`}>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                    <span className="font-mono">{item.doc_no}</span>
                    <span>{item.requester} / {item.dept}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.requested_at}</span>
                    <span className="flex items-center gap-1 text-amber-500"><Clock className="w-3 h-3" />마감 {item.due_date}</span>
                    {item.amount && <span className="text-emerald-400 font-mono">{formatAmt(item.amount)}</span>}
                  </div>
                </div>
                <div className={`text-xs font-medium flex items-center gap-1 ${statusCfg.color} flex-shrink-0`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {item.status}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)}
          onApprove={handleApprove} onReject={handleReject} />
      )}
    </div>
  );
}
