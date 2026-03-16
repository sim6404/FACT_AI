"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Plus, X, Save, RefreshCw, ChevronDown,
  Factory, Clock, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { formatKRW, getCurrentYearMonth } from "@/lib/erp-api";

// ── 타입 ────────────────────────────────────────────────────────
type WorkStatus = "대기" | "진행중" | "완료" | "일시정지";

interface WorkOrder {
  id: number;
  wo_no: string;
  line_code: string;
  product_name: string;
  product_code: string;
  plan_qty: number;
  actual_qty: number;
  start_date: string;
  end_date: string;
  status: WorkStatus;
  oee?: number;
  downtime_h?: number;
  downtime_reason?: string;
  operator?: string;
  note?: string;
}

interface DailyRecord {
  id: number;
  work_date: string;
  line_code: string;
  shift: "주간" | "야간";
  plan_qty: number;
  actual_qty: number;
  defect_qty: number;
  downtime_h: number;
  downtime_reason: string;
  operator: string;
}

// ── 초기 데이터 ──────────────────────────────────────────────────
const LINES = ["A라인", "B라인", "C라인", "D라인"];
const PRODUCTS = [
  { name: "STRW DAMPER",  code: "SD-001" },
  { name: "HORN PLATE",   code: "HP-002" },
  { name: "BUSH (FRONT)", code: "BF-003" },
  { name: "BUSH (REAR)",  code: "BR-005" },
  { name: "SP2",          code: "SP-004" },
];
const DOWNTIME_REASONS = ["설비 고장", "금형 교체", "원자재 부족", "품질 문제", "작업자 부재", "계획 정지", "기타"];

const INIT_WORK_ORDERS: WorkOrder[] = [
  { id:1, wo_no:"WO-2603-015", line_code:"A라인", product_name:"STRW DAMPER", product_code:"SD-001", plan_qty:5000, actual_qty:3240, start_date:"2026-03-10", end_date:"2026-03-15", status:"진행중",  oee:87.8, downtime_h:1.5, downtime_reason:"금형 교체", operator:"김생산" },
  { id:2, wo_no:"WO-2603-014", line_code:"B라인", product_name:"HORN PLATE",  product_code:"HP-002", plan_qty:3200, actual_qty:2880, start_date:"2026-03-08", end_date:"2026-03-14", status:"진행중",  oee:73.2, downtime_h:2.0, downtime_reason:"설비 고장", operator:"이생산" },
  { id:3, wo_no:"WO-2603-013", line_code:"C라인", product_name:"BUSH (FRONT)",product_code:"BF-003", plan_qty:2400, actual_qty:1560, start_date:"2026-03-09", end_date:"2026-03-16", status:"진행중",  oee:65.5, downtime_h:3.0, downtime_reason:"품질 문제", operator:"박생산" },
  { id:4, wo_no:"WO-2603-012", line_code:"D라인", product_name:"SP2",         product_code:"SP-004", plan_qty:1800, actual_qty:0,    start_date:"2026-03-13", end_date:"2026-03-18", status:"대기",    oee:0,    downtime_h:0, operator:"최생산" },
  { id:5, wo_no:"WO-2603-011", line_code:"A라인", product_name:"BUSH (REAR)", product_code:"BR-005", plan_qty:3600, actual_qty:3600, start_date:"2026-03-01", end_date:"2026-03-07", status:"완료",    oee:91.2, downtime_h:0.5, operator:"김생산" },
  { id:6, wo_no:"WO-2603-010", line_code:"B라인", product_name:"STRW DAMPER", product_code:"SD-001", plan_qty:4200, actual_qty:4200, start_date:"2026-03-01", end_date:"2026-03-06", status:"완료",    oee:88.5, downtime_h:1.0, operator:"이생산" },
];

const INIT_DAILY: DailyRecord[] = [
  { id:1, work_date:"2026-03-13", line_code:"A라인", shift:"주간", plan_qty:600, actual_qty:532, defect_qty:8,  downtime_h:0.5, downtime_reason:"금형 교체", operator:"김생산" },
  { id:2, work_date:"2026-03-13", line_code:"B라인", shift:"주간", plan_qty:500, actual_qty:456, defect_qty:12, downtime_h:1.0, downtime_reason:"설비 고장", operator:"이생산" },
  { id:3, work_date:"2026-03-13", line_code:"C라인", shift:"주간", plan_qty:400, actual_qty:312, defect_qty:18, downtime_h:2.0, downtime_reason:"품질 문제", operator:"박생산" },
  { id:4, work_date:"2026-03-12", line_code:"A라인", shift:"주간", plan_qty:600, actual_qty:580, defect_qty:6,  downtime_h:0.3, downtime_reason:"", operator:"김생산" },
  { id:5, work_date:"2026-03-12", line_code:"A라인", shift:"야간", plan_qty:600, actual_qty:560, defect_qty:9,  downtime_h:0.5, downtime_reason:"", operator:"홍생산" },
  { id:6, work_date:"2026-03-12", line_code:"B라인", shift:"주간", plan_qty:500, actual_qty:480, defect_qty:10, downtime_h:0.5, downtime_reason:"", operator:"이생산" },
  { id:7, work_date:"2026-03-11", line_code:"A라인", shift:"주간", plan_qty:600, actual_qty:595, defect_qty:4,  downtime_h:0.0, downtime_reason:"", operator:"김생산" },
  { id:8, work_date:"2026-03-11", line_code:"C라인", shift:"주간", plan_qty:400, actual_qty:360, defect_qty:20, downtime_h:1.5, downtime_reason:"원자재 부족", operator:"박생산" },
];

// ── 상태 설정 ────────────────────────────────────────────────────
const WO_STATUS_CFG: Record<WorkStatus, { color: string; icon: React.ElementType }> = {
  "대기":   { color: "bg-slate-500/20 text-slate-400 border-slate-500/30",   icon: Clock },
  "진행중": { color: "bg-amber-600/20 text-amber-400 border-amber-500/30",       icon: RefreshCw },
  "일시정지":{ color: "bg-amber-500/20 text-amber-400 border-amber-500/30",  icon: AlertTriangle },
  "완료":   { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
};

// ── OEE 링 ────────────────────────────────────────────────────────
function OeeRing({ value }: { value: number }) {
  const pct = Math.min(value, 100);
  const r = 22, circ = 2 * Math.PI * r;
  const color = value >= 85 ? "#22c55e" : value >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg width={52} height={52} viewBox="0 0 52 52">
        <circle cx={26} cy={26} r={r} fill="none" stroke="#1e293b" strokeWidth={5} />
        <circle cx={26} cy={26} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" transform="rotate(-90 26 26)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        <text x={26} y={30} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">
          {value > 0 ? `${value.toFixed(0)}%` : "-"}
        </text>
      </svg>
      <span className="text-[9px] text-slate-500 mt-0.5">OEE</span>
    </div>
  );
}

// ── 일일 실적 입력 모달 ──────────────────────────────────────────
interface DailyModalProps {
  onClose: () => void;
  onSave: (record: Omit<DailyRecord, "id">) => void;
  initial?: Partial<DailyRecord>;
}

function DailyInputModal({ onClose, onSave, initial }: DailyModalProps) {
  const [form, setForm] = useState<Omit<DailyRecord, "id">>({
    work_date: initial?.work_date ?? new Date().toISOString().slice(0, 10),
    line_code: initial?.line_code ?? LINES[0],
    shift: initial?.shift ?? "주간",
    plan_qty: initial?.plan_qty ?? 0,
    actual_qty: initial?.actual_qty ?? 0,
    defect_qty: initial?.defect_qty ?? 0,
    downtime_h: initial?.downtime_h ?? 0,
    downtime_reason: initial?.downtime_reason ?? "",
    operator: initial?.operator ?? "",
  });

  const achievePct = form.plan_qty > 0 ? (form.actual_qty / form.plan_qty * 100) : 0;
  const isValid = form.line_code && form.operator && form.actual_qty >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-base font-semibold text-white">일일 생산 실적 입력</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">작업일 *</label>
              <input type="date" value={form.work_date}
                onChange={e => setForm(f => ({ ...f, work_date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">라인 *</label>
              <select value={form.line_code} onChange={e => setForm(f => ({ ...f, line_code: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                {LINES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">교대 *</label>
              <select value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value as "주간"|"야간" }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                <option>주간</option>
                <option>야간</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">계획수량</label>
              <input type="number" min={0} value={form.plan_qty || ""}
                onChange={e => setForm(f => ({ ...f, plan_qty: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">실적수량 *</label>
              <input type="number" min={0} value={form.actual_qty || ""}
                onChange={e => setForm(f => ({ ...f, actual_qty: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500 border-amber-500/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">불량수량</label>
              <input type="number" min={0} value={form.defect_qty || ""}
                onChange={e => setForm(f => ({ ...f, defect_qty: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          {/* 달성률 미리보기 */}
          {form.plan_qty > 0 && (
            <div className={`rounded-lg px-3 py-2 flex justify-between items-center ${
              achievePct >= 100 ? "bg-emerald-900/20 border border-emerald-700/30"
              : achievePct >= 80  ? "bg-blue-900/20 border border-blue-700/30"
              : "bg-amber-900/20 border border-amber-700/30"
            }`}>
              <span className="text-xs text-slate-400">달성률</span>
              <span className={`text-sm font-bold font-mono ${
                achievePct >= 100 ? "text-emerald-300" : achievePct >= 80 ? "text-amber-300" : "text-amber-300"
              }`}>{achievePct.toFixed(1)}%</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">다운타임(h)</label>
              <input type="number" min={0} step={0.5} value={form.downtime_h || ""}
                onChange={e => setForm(f => ({ ...f, downtime_h: Number(e.target.value) }))}
                placeholder="0.0" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">다운타임 원인</label>
              <select value={form.downtime_reason} onChange={e => setForm(f => ({ ...f, downtime_reason: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                <option value="">선택</option>
                {DOWNTIME_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">작업자 *</label>
            <input type="text" value={form.operator}
              onChange={e => setForm(f => ({ ...f, operator: e.target.value }))}
              placeholder="홍길동" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-700">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50">취소</button>
          <button onClick={() => isValid && onSave(form)} disabled={!isValid}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-3.5 h-3.5" /> 저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 작업지시 등록 모달 ───────────────────────────────────────────
interface WoModalProps {
  onClose: () => void;
  onSave: (wo: Omit<WorkOrder, "id" | "wo_no" | "actual_qty" | "oee" | "downtime_h">) => void;
}

function WorkOrderModal({ onClose, onSave }: WoModalProps) {
  const [form, setForm] = useState({
    line_code: LINES[0],
    product_name: PRODUCTS[0].name,
    product_code: PRODUCTS[0].code,
    plan_qty: 0,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
    status: "대기" as WorkStatus,
    operator: "",
    note: "",
  });

  const handleProductChange = (name: string) => {
    const p = PRODUCTS.find(x => x.name === name);
    setForm(f => ({ ...f, product_name: name, product_code: p?.code ?? "" }));
  };
  const isValid = form.line_code && form.product_name && form.plan_qty > 0 && form.end_date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-base font-semibold text-white">작업지시서 등록</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">라인 *</label>
              <select value={form.line_code} onChange={e => setForm(f => ({ ...f, line_code: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                {LINES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">상태</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as WorkStatus }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                {(Object.keys(WO_STATUS_CFG) as WorkStatus[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">품목 *</label>
            <select value={form.product_name} onChange={e => handleProductChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              {PRODUCTS.map(p => <option key={p.code} value={p.name}>{p.name} ({p.code})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">계획수량 *</label>
              <input type="number" min={1} value={form.plan_qty || ""}
                onChange={e => setForm(f => ({ ...f, plan_qty: Number(e.target.value) }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">시작일 *</label>
              <input type="date" value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">완료예정일 *</label>
              <input type="date" value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">작업자</label>
              <input type="text" value={form.operator} onChange={e => setForm(f => ({ ...f, operator: e.target.value }))}
                placeholder="홍길동" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">비고</label>
              <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-700">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50">취소</button>
          <button onClick={() => isValid && onSave(form)} disabled={!isValid}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-3.5 h-3.5" /> 등록
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ────────────────────────────────────────────────
export default function ProductionPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INIT_WORK_ORDERS);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(INIT_DAILY);
  const [tab, setTab] = useState<"workorder" | "daily" | "summary">("workorder");
  const [filterStatus, setFilterStatus] = useState<WorkStatus | "전체">("전체");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showWoModal, setShowWoModal] = useState(false);
  const [nextWoId, setNextWoId] = useState(INIT_WORK_ORDERS.length + 1);
  const [nextDailyId, setNextDailyId] = useState(INIT_DAILY.length + 1);

  const filteredWo = useMemo(() =>
    workOrders.filter(w => filterStatus === "전체" || w.status === filterStatus),
    [workOrders, filterStatus]
  );

  const stats = useMemo(() => {
    const active = workOrders.filter(w => w.status === "진행중");
    const totalPlan = workOrders.filter(w => w.status !== "대기").reduce((s, w) => s + w.plan_qty, 0);
    const totalActual = workOrders.reduce((s, w) => s + w.actual_qty, 0);
    const avgOee = active.length > 0 ? active.reduce((s, w) => s + (w.oee ?? 0), 0) / active.length : 0;
    return { active: active.length, totalActual, totalPlan, avgOee };
  }, [workOrders]);

  const todayDaily = useMemo(() => {
    const today = "2026-03-13";
    return dailyRecords.filter(d => d.work_date === today);
  }, [dailyRecords]);

  const handleWoSave = useCallback((form: Omit<WorkOrder, "id" | "wo_no" | "actual_qty" | "oee" | "downtime_h">) => {
    const mm = "03", dd = String(nextWoId).padStart(3, "0");
    const newWo: WorkOrder = { ...form, id: nextWoId, wo_no: `WO-2603-0${nextWoId}`, actual_qty: 0, oee: 0, downtime_h: 0 };
    setWorkOrders(prev => [newWo, ...prev]);
    setNextWoId(n => n + 1);
    setShowWoModal(false);
  }, [nextWoId]);

  const handleDailySave = useCallback((form: Omit<DailyRecord, "id">) => {
    setDailyRecords(prev => [{ ...form, id: nextDailyId }, ...prev]);
    setNextDailyId(n => n + 1);
    setShowDailyModal(false);
  }, [nextDailyId]);

  const updateWoStatus = (id: number, status: WorkStatus) => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-5">

      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">생산 관리</h1>
          <p className="text-slate-500 text-sm mt-0.5">작업지시 · 일일 실적 · OEE · 다운타임</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDailyModal(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> 실적 입력
          </button>
          <button onClick={() => setShowWoModal(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> 작업지시 등록
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "진행 중 작업지시", value: `${stats.active}건`, color: "border-amber-500/40 text-amber-300" },
          { label: "총 생산수량", value: `${stats.totalActual.toLocaleString()}ea`, color: "border-cyan-500/40 text-cyan-300" },
          { label: "평균 OEE", value: `${stats.avgOee.toFixed(1)}%`, color: `border-${stats.avgOee >= 85 ? "emerald" : stats.avgOee >= 70 ? "amber" : "red"}-500/40 text-${stats.avgOee >= 85 ? "emerald" : stats.avgOee >= 70 ? "amber" : "red"}-300` },
          { label: "오늘 입력 건수", value: `${todayDaily.length}건`, color: "border-purple-500/40 text-purple-300" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card border ${color.split(" ")[0]}`}>
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
            <span className={`text-xl font-bold font-mono ${color.split(" ")[1]} block mt-1`}>{value}</span>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 w-fit">
        {(["workorder", "daily", "summary"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            {t === "workorder" ? "작업지시" : t === "daily" ? "일일 실적" : "月별 요약"}
          </button>
        ))}
      </div>

      {/* 작업지시 탭 */}
      {tab === "workorder" && (
        <>
          {/* 상태 필터 */}
          <div className="flex flex-wrap gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 w-fit">
            {(["전체", ...Object.keys(WO_STATUS_CFG)] as Array<"전체" | WorkStatus>).map(s => {
              const cnt = s === "전체" ? workOrders.length : workOrders.filter(w => w.status === s).length;
              return (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}>
                  {s} ({cnt})
                </button>
              );
            })}
          </div>

          {/* 작업지시 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWo.map(w => {
              const ach = w.plan_qty > 0 ? (w.actual_qty / w.plan_qty) * 100 : 0;
              const cfg = WO_STATUS_CFG[w.status];
              const Icon = cfg.icon;
              return (
                <div key={w.id} className={`card border ${cfg.color.split(" ")[2]} space-y-3`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-mono ${cfg.color.split(" ")[1]}`}>{w.wo_no}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${cfg.color}`}>
                          <Icon className="w-2.5 h-2.5" />{w.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white">{w.product_name}</p>
                      <p className="text-xs text-slate-500">{w.line_code} · {w.product_code}</p>
                    </div>
                    <OeeRing value={w.oee ?? 0} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">달성률</span>
                      <span className={`font-semibold ${ach >= 100 ? "text-emerald-400" : ach >= 80 ? "text-amber-400" : "text-amber-400"}`}>{ach.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${ach >= 100 ? "bg-emerald-500" : ach >= 80 ? "bg-amber-600" : "bg-amber-500"} transition-all duration-700`}
                        style={{ width: `${Math.min(ach, 100)}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { l: "계획", v: w.plan_qty.toLocaleString(), c: "text-slate-400" },
                      { l: "실적", v: w.actual_qty.toLocaleString(), c: "text-white" },
                      { l: "다운", v: `${w.downtime_h?.toFixed(1) ?? 0}h`, c: "text-red-300" },
                    ].map(({ l, v, c }) => (
                      <div key={l} className="bg-slate-800/60 rounded-lg px-2 py-1.5 text-center">
                        <p className="text-[9px] text-slate-500">{l}</p>
                        <p className={`font-mono font-semibold ${c}`}>{v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{w.start_date} ~ {w.end_date}</span>
                    <span>{w.operator}</span>
                  </div>

                  {/* 상태 변경 버튼 */}
                  {w.status !== "완료" && (
                    <div className="flex gap-1.5 pt-1 border-t border-slate-700/50">
                      {w.status === "대기" && (
                        <button onClick={() => updateWoStatus(w.id, "진행중")}
                          className="flex-1 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-600/30 transition-colors">
                          ▶ 시작
                        </button>
                      )}
                      {w.status === "진행중" && (
                        <>
                          <button onClick={() => updateWoStatus(w.id, "일시정지")}
                            className="flex-1 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-600/30 transition-colors">
                            ⏸ 일시정지
                          </button>
                          <button onClick={() => updateWoStatus(w.id, "완료")}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors">
                            ✓ 완료
                          </button>
                        </>
                      )}
                      {w.status === "일시정지" && (
                        <button onClick={() => updateWoStatus(w.id, "진행중")}
                          className="flex-1 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-600/30 transition-colors">
                          ▶ 재개
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 일일 실적 탭 */}
      {tab === "daily" && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">일일 생산 실적</span>
            <button onClick={() => setShowDailyModal(true)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> 실적 입력
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 border-collapse min-w-[700px]">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700 text-left">
                  <th className="py-2.5 px-3">작업일</th>
                  <th className="py-2.5 px-3">라인</th>
                  <th className="py-2.5 px-3 text-center">교대</th>
                  <th className="py-2.5 px-3 text-right">계획</th>
                  <th className="py-2.5 px-3 text-right">실적</th>
                  <th className="py-2.5 px-3 text-right">불량</th>
                  <th className="py-2.5 px-3 text-center">달성률</th>
                  <th className="py-2.5 px-3 text-right">다운타임</th>
                  <th className="py-2.5 px-3">원인</th>
                  <th className="py-2.5 px-3 text-center">작업자</th>
                </tr>
              </thead>
              <tbody>
                {dailyRecords.map(r => {
                  const ach = r.plan_qty > 0 ? (r.actual_qty / r.plan_qty * 100) : 0;
                  return (
                    <tr key={r.id} className={`border-b border-slate-700/40 hover:bg-slate-700/15 ${r.work_date === "2026-03-13" ? "bg-blue-900/10" : ""}`}>
                      <td className="py-2.5 px-3 text-slate-400">
                        {r.work_date}
                        {r.work_date === "2026-03-13" && <span className="ml-1.5 text-[10px] text-amber-400">오늘</span>}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-white">{r.line_code}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.shift === "주간" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"}`}>
                          {r.shift}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">{r.plan_qty.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">{r.actual_qty.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-400">{r.defect_qty.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-semibold ${ach >= 100 ? "text-emerald-400" : ach >= 80 ? "text-amber-400" : "text-amber-400"}`}>
                          {ach.toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-300">{r.downtime_h > 0 ? `${r.downtime_h}h` : "-"}</td>
                      <td className="py-2.5 px-3 text-slate-500">{r.downtime_reason || "-"}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{r.operator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 월별 요약 탭 */}
      {tab === "summary" && (
        <div className="space-y-4">
          {LINES.map(line => {
            const lineRecords = dailyRecords.filter(d => d.line_code === line);
            const totalPlan = lineRecords.reduce((s, d) => s + d.plan_qty, 0);
            const totalActual = lineRecords.reduce((s, d) => s + d.actual_qty, 0);
            const totalDefect = lineRecords.reduce((s, d) => s + d.defect_qty, 0);
            const totalDowntime = lineRecords.reduce((s, d) => s + d.downtime_h, 0);
            const ach = totalPlan > 0 ? (totalActual / totalPlan * 100) : 0;
            const wo = workOrders.find(w => w.line_code === line && w.status === "진행중");
            return (
              <div key={line} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Factory className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">{line}</h3>
                    {wo && <span className="text-xs text-slate-500">— {wo.product_name}</span>}
                  </div>
                  <OeeRing value={wo?.oee ?? 0} />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "계획수량", v: totalPlan.toLocaleString(), c: "text-slate-300" },
                    { l: "실적수량", v: totalActual.toLocaleString(), c: "text-white" },
                    { l: "달성률",  v: `${ach.toFixed(1)}%`, c: ach >= 90 ? "text-emerald-400" : ach >= 75 ? "text-amber-400" : "text-red-400" },
                    { l: "불량수량", v: totalDefect.toLocaleString(), c: "text-red-400" },
                  ].map(({ l, v, c }) => (
                    <div key={l} className="bg-slate-800/50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-slate-500 mb-0.5">{l}</p>
                      <p className={`text-sm font-bold font-mono ${c}`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${ach >= 90 ? "bg-emerald-500" : ach >= 75 ? "bg-amber-500" : "bg-red-500"} transition-all`}
                      style={{ width: `${Math.min(ach, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDailyModal && (
        <DailyInputModal onClose={() => setShowDailyModal(false)} onSave={handleDailySave} />
      )}
      {showWoModal && (
        <WorkOrderModal onClose={() => setShowWoModal(false)} onSave={handleWoSave} />
      )}
    </div>
  );
}
