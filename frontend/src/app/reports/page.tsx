"use client";

import { useState } from "react";
import {
  FileText, Download, Plus, Search,
  BarChart3, TrendingUp, Package, Award, ShoppingCart,
  Calendar, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Eye, Trash2, X,
} from "lucide-react";

// ── 타입 ────────────────────────────────────────────────────────
type ReportStatus = "완료" | "생성중" | "실패" | "예약";
type ReportCategory = "생산" | "품질" | "매입" | "영업" | "재고" | "종합";

interface Report {
  id: number;
  title: string;
  category: ReportCategory;
  created_at: string;
  created_by: string;
  status: ReportStatus;
  format: "PDF" | "PPTX" | "XLSX";
  size: string;
  period: string;
  description: string;
}

// ── 샘플 데이터 ──────────────────────────────────────────────────
const INIT_REPORTS: Report[] = [
  { id:1,  title:"2026년 3월 생산실적 보고서",      category:"생산", created_at:"2026-03-13 09:15", created_by:"김생산", status:"완료",  format:"PDF",  size:"2.4MB", period:"2026-03",  description:"라인별 생산수량, OEE, 다운타임 분석" },
  { id:2,  title:"1분기 품질 현황 보고서",           category:"품질", created_at:"2026-03-13 08:30", created_by:"이품질", status:"완료",  format:"PPTX", size:"5.1MB", period:"2026-Q1",  description:"PPM 추이, 클레임 현황, 개선 로드맵" },
  { id:3,  title:"3월 매입 분석 리포트",             category:"매입", created_at:"2026-03-12 16:45", created_by:"박구매", status:"완료",  format:"XLSX", size:"1.2MB", period:"2026-03",  description:"공급업체별 매입금액, 납기준수율 분석" },
  { id:4,  title:"영업 KPI 월간 보고서",             category:"영업", created_at:"2026-03-12 14:20", created_by:"최영업", status:"완료",  format:"PDF",  size:"3.7MB", period:"2026-03",  description:"매출실적, 수주잔량, 고객사별 분석" },
  { id:5,  title:"재고 현황 주간 리포트",            category:"재고", created_at:"2026-03-13 10:00", created_by:"정물류", status:"생성중", format:"XLSX", size:"—",     period:"2026-W11", description:"품목별 재고수준, 경보 품목, 회전율" },
  { id:6,  title:"경영진 종합 대시보드 보고서",      category:"종합", created_at:"2026-03-11 17:00", created_by:"김관리", status:"완료",  format:"PPTX", size:"8.3MB", period:"2026-03",  description:"전사 KPI 요약, 핵심 이슈, 개선 현황" },
  { id:7,  title:"2월 생산실적 보고서",              category:"생산", created_at:"2026-03-01 09:00", created_by:"김생산", status:"완료",  format:"PDF",  size:"2.1MB", period:"2026-02",  description:"2월 라인별 생산수량 및 효율 분석" },
  { id:8,  title:"클레임 대응 현황 보고서",          category:"품질", created_at:"2026-03-10 11:30", created_by:"이품질", status:"완료",  format:"PDF",  size:"1.8MB", period:"2026-03",  description:"고객사별 클레임 접수 및 처리 현황" },
  { id:9,  title:"공급업체 평가 분기 보고서",        category:"매입", created_at:"2026-03-08 15:00", created_by:"박구매", status:"실패",  format:"PPTX", size:"—",     period:"2026-Q1",  description:"협력사 납기, 품질, 가격 종합 평가" },
  { id:10, title:"4월 생산계획 보고서 (예약)",       category:"생산", created_at:"2026-03-14 08:00", created_by:"김생산", status:"예약",  format:"PDF",  size:"—",     period:"2026-04",  description:"4월 생산계획, 자재소요량 산출" },
];

const CATEGORY_CFG: Record<ReportCategory, { color: string; icon: React.ElementType }> = {
  생산: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30",         icon: BarChart3 },
  품질: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: Award },
  매입: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30",      icon: ShoppingCart },
  영업: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30",   icon: TrendingUp },
  재고: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",         icon: Package },
  종합: { color: "bg-rose-500/20 text-rose-400 border-rose-500/30",         icon: FileText },
};

const STATUS_CFG: Record<ReportStatus, { color: string; icon: React.ElementType; label: string }> = {
  완료:   { color: "text-emerald-400", icon: CheckCircle2, label: "완료" },
  생성중: { color: "text-blue-400",    icon: RefreshCw,    label: "생성중" },
  실패:   { color: "text-red-400",     icon: AlertCircle,  label: "실패" },
  예약:   { color: "text-amber-400",   icon: Clock,        label: "예약됨" },
};

const FORMAT_COLOR: Record<string, string> = {
  PDF:  "bg-red-500/20 text-red-400",
  PPTX: "bg-orange-500/20 text-orange-400",
  XLSX: "bg-green-500/20 text-green-400",
};

// ── Toast 컴포넌트 ────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const col = type === "success" ? "#4ade80" : type === "error" ? "#ef4444" : "#D4920A";
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium"
      style={{ background: "#1e1e1e", border: `1px solid ${col}50` }}
    >
      {type === "success"
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: col }} />
        : <AlertCircle  className="w-4 h-4 flex-shrink-0" style={{ color: col }} />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── 보고서 생성 모달 ─────────────────────────────────────────────
function CreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (r: Omit<Report, "id">) => void;
}) {
  const [form, setForm] = useState({
    title: "", category: "생산" as ReportCategory,
    format: "PDF" as Report["format"], period: "", description: "",
  });
  const isValid = form.title && form.period;

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({
      ...form,
      created_at: new Date()
        .toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
        .replace(/\. /g, "-")
        .replace(".", ""),
      created_by: "김관리",
      status: "생성중",
      size: "—",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
        style={{ background: "#141414", border: "1px solid #383838" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4" style={{ color: "#D4920A" }} /> 보고서 생성 요청
          </h2>
          <button onClick={onClose} style={{ color: "#666" }} className="hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: "#888" }}>보고서 제목 *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="예: 2026년 3월 생산실적 보고서"
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: "#1e1e1e", border: "1px solid #383838" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#888" }}>분류</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as ReportCategory }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: "#1e1e1e", border: "1px solid #383838" }}
              >
                {(Object.keys(CATEGORY_CFG) as ReportCategory[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#888" }}>출력 형식</label>
              <select
                value={form.format}
                onChange={e => setForm(f => ({ ...f, format: e.target.value as Report["format"] }))}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: "#1e1e1e", border: "1px solid #383838" }}
              >
                <option value="PDF">PDF</option>
                <option value="PPTX">PowerPoint</option>
                <option value="XLSX">Excel</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: "#888" }}>대상 기간 *</label>
            <input
              value={form.period}
              onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
              placeholder="예: 2026-03 / 2026-Q1"
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: "#1e1e1e", border: "1px solid #383838" }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: "#888" }}>설명</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="보고서 내용 요약"
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-none"
              style={{ background: "#1e1e1e", border: "1px solid #383838" }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm"
            style={{ background: "#2a2a2a", color: "#aaa" }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "#D4920A" }}
          >
            <Plus className="w-3.5 h-3.5" /> 생성 요청
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────
export default function ReportsPage() {
  const [reports, setReports]           = useState<Report[]>(INIT_REPORTS);
  const [search, setSearch]             = useState("");
  const [catFilter, setCatFilter]       = useState<ReportCategory | "전체">("전체");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "전체">("전체");
  const [showCreate, setShowCreate]     = useState(false);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = reports.filter(r => {
    const matchCat    = catFilter === "전체" || r.category === catFilter;
    const matchStatus = statusFilter === "전체" || r.status === statusFilter;
    const matchSearch = !search || r.title.includes(search) || r.created_by.includes(search);
    return matchCat && matchStatus && matchSearch;
  });

  const counts = {
    total:    reports.length,
    complete: reports.filter(r => r.status === "완료").length,
    pending:  reports.filter(r => r.status === "생성중" || r.status === "예약").length,
    failed:   reports.filter(r => r.status === "실패").length,
  };

  const handleCreate = (r: Omit<Report, "id">) => {
    setReports(prev => [{ ...r, id: Date.now() }, ...prev]);
    showToast("보고서 생성 요청이 접수되었습니다.", "success");
  };

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast("보고서가 삭제되었습니다.", "info");
  };

  const handleRetry = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "생성중" as ReportStatus } : r));
    showToast("보고서 재생성을 요청했습니다.", "info");
  };

  const handleDownload = (r: Report) => {
    const a = document.createElement("a");
    a.href = "#";
    a.download = `${r.title}.${r.format.toLowerCase()}`;
    a.click();
    showToast(`${r.title} 다운로드를 시작합니다.`, "success");
  };

  const handlePreview = (r: Report) => {
    showToast(`미리보기: ${r.title}`, "info");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">보고서 센터</h1>
          <p className="text-sm mt-1" style={{ color: "#888" }}>AI 자동 보고서 생성 · 다운로드 · 이력 관리</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors"
          style={{ background: "#D4920A" }}
        >
          <Plus className="w-4 h-4" /> 보고서 생성
        </button>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "전체 보고서",  value: counts.total,    color: "text-white",       sub: "전체 이력" },
          { label: "생성 완료",    value: counts.complete, color: "text-emerald-400", sub: "다운로드 가능" },
          { label: "생성 대기",    value: counts.pending,  color: "text-amber-400",   sub: "처리 중" },
          { label: "생성 실패",    value: counts.failed,   color: "text-red-400",     sub: "재시도 필요" },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="rounded-2xl p-4"
            style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}
          >
            <div className="text-xs mb-1" style={{ color: "#888" }}>{kpi.label}</div>
            <div className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── 빠른 생성 템플릿 ── */}
      <div className="rounded-2xl p-4" style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}>
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#666" }}
        >
          빠른 생성 템플릿
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.entries(CATEGORY_CFG) as [ReportCategory, typeof CATEGORY_CFG[ReportCategory]][]).map(([cat, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={cat}
                onClick={() => setShowCreate(true)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium hover:brightness-110 transition-all ${cfg.color}`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {cat} 보고서
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 필터 & 검색 ── */}
      <div className="flex flex-wrap gap-3">
        <div
          className="flex items-center gap-1 rounded-xl p-1"
          style={{ background: "#1e1e1e" }}
        >
          {(["전체", ...Object.keys(CATEGORY_CFG)] as (ReportCategory | "전체")[]).map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                catFilter === c
                  ? { background: "#D4920A", color: "#fff" }
                  : { color: "#888" }
              }
            >
              {c}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-1 rounded-xl p-1"
          style={{ background: "#1e1e1e" }}
        >
          {(["전체", "완료", "생성중", "예약", "실패"] as (ReportStatus | "전체")[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                statusFilter === s
                  ? { background: "#D4920A", color: "#fff" }
                  : { color: "#888" }
              }
            >
              {s}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 flex-1 min-w-[200px]"
          style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: "#555" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="보고서명 · 담당자 검색"
            className="bg-transparent text-sm focus:outline-none w-full"
            style={{ color: "#e0e0e0" }}
          />
        </div>
      </div>

      {/* ── 보고서 목록 ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}>
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "#2e2e2e" }}
        >
          <span className="text-xs font-semibold" style={{ color: "#888" }}>보고서 이력</span>
          <span className="text-xs" style={{ color: "#555" }}>{filtered.length}건</span>
        </div>
        <div className="divide-y" style={{ borderColor: "#2e2e2e" }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: "#555" }}>검색 결과가 없습니다</div>
          ) : filtered.map(r => {
            const catCfg    = CATEGORY_CFG[r.category];
            const statusCfg = STATUS_CFG[r.status];
            const CatIcon   = catCfg.icon;
            const StatIcon  = statusCfg.icon;
            return (
              <div
                key={r.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors group"
                style={{ borderColor: "#2e2e2e" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* 카테고리 아이콘 */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${catCfg.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">{r.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${catCfg.color}`}>{r.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded bg-opacity-20 ${FORMAT_COLOR[r.format]}`}>{r.format}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] flex-wrap" style={{ color: "#666" }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {r.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.created_at}
                    </span>
                    <span>{r.created_by}</span>
                    {r.size !== "—" && <span>{r.size}</span>}
                  </div>
                  {r.description && (
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: "#555" }}>{r.description}</div>
                  )}
                </div>

                {/* 상태 */}
                <div className={`flex items-center gap-1.5 text-xs font-medium ${statusCfg.color}`}>
                  <StatIcon className={`w-3.5 h-3.5 ${r.status === "생성중" ? "animate-spin" : ""}`} />
                  {statusCfg.label}
                </div>

                {/* 액션 */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {r.status === "완료" && (
                    <button
                      onClick={() => handleDownload(r)}
                      className="p-1.5 rounded-lg transition-colors text-amber-400 hover:bg-amber-500/20"
                      title="다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {r.status === "완료" && (
                    <button
                      onClick={() => handlePreview(r)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "#888" }}
                      title="미리보기"
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {r.status === "실패" && (
                    <button
                      onClick={() => handleRetry(r.id)}
                      className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-colors"
                      title="재시도"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
