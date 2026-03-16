"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Clock,
  RefreshCw, Plus, Search, ChevronDown, ChevronUp, FileText,
  TrendingDown, TrendingUp, Eye,
} from "lucide-react";

// ── 타입 ─────────────────────────────────────────────────────
type PpmStatus = "good" | "warning" | "critical";
type ClaimStatus = "접수" | "조사중" | "대책수립" | "완료" | "보류";
type DefectType =
  | "치수불량" | "외관불량" | "기능불량" | "재료불량"
  | "조립불량" | "이물혼입" | "포장불량" | "기타";

interface DefectRecord {
  id: number;
  date: string;
  line: string;
  product: string;
  product_code: string;
  inspection_qty: number;
  defect_qty: number;
  rework_qty: number;
  defect_type: DefectType;
  ppm: number;
  defect_amount: number;
  rework_amount: number;
  worker: string;
  cause: string;
  action: string;
}

interface Claim {
  id: number;
  claim_no: string;
  claim_date: string;
  customer: string;
  product: string;
  defect_qty: number;
  defect_amount: number;
  description: string;
  defect_type: DefectType;
  status: ClaimStatus;
  d8_step: number; // 0~8
  assignee: string;
  due_date: string;
  root_cause: string;
  action_taken: string;
}

// ── 데모 데이터 ───────────────────────────────────────────────
const INIT_DEFECTS: DefectRecord[] = [
  { id: 1,  date: "2026-03-13", line: "A라인", product: "STRW DAMPER", product_code: "SD-2341", inspection_qty: 1200, defect_qty: 3,  rework_qty: 2,  defect_type: "치수불량",  ppm: 2500, defect_amount: 450000,  rework_amount: 180000, worker: "김철수", cause: "금형 마모",        action: "금형 교체 예정" },
  { id: 2,  date: "2026-03-13", line: "B라인", product: "HORN PLATE",  product_code: "HP-1122", inspection_qty: 950,  defect_qty: 1,  rework_qty: 1,  defect_type: "외관불량",  ppm: 1053, defect_amount: 120000,  rework_amount: 60000,  worker: "이영희", cause: "사출 온도 편차",  action: "온도 파라미터 조정" },
  { id: 3,  date: "2026-03-13", line: "C라인", product: "BUSH (FRONT)",product_code: "BF-3310", inspection_qty: 800,  defect_qty: 0,  rework_qty: 0,  defect_type: "기타",      ppm: 0,    defect_amount: 0,        rework_amount: 0,      worker: "박민수", cause: "-",               action: "-" },
  { id: 4,  date: "2026-03-12", line: "A라인", product: "STRW DAMPER", product_code: "SD-2341", inspection_qty: 1200, defect_qty: 2,  rework_qty: 2,  defect_type: "조립불량",  ppm: 1667, defect_amount: 300000,  rework_amount: 180000, worker: "김철수", cause: "조립 지그 마모",  action: "지그 교체" },
  { id: 5,  date: "2026-03-12", line: "B라인", product: "HORN PLATE",  product_code: "HP-1122", inspection_qty: 950,  defect_qty: 2,  rework_qty: 0,  defect_type: "재료불량",  ppm: 2105, defect_amount: 240000,  rework_amount: 0,      worker: "이영희", cause: "원자재 이물",    action: "공급사 클레임 예정" },
  { id: 6,  date: "2026-03-12", line: "C라인", product: "BUSH (FRONT)",product_code: "BF-3310", inspection_qty: 800,  defect_qty: 1,  rework_qty: 1,  defect_type: "기능불량",  ppm: 1250, defect_amount: 180000,  rework_amount: 120000, worker: "박민수", cause: "경도 부족",       action: "배합비 재검토" },
  { id: 7,  date: "2026-03-11", line: "A라인", product: "STRW DAMPER", product_code: "SD-2341", inspection_qty: 1200, defect_qty: 1,  rework_qty: 1,  defect_type: "외관불량",  ppm: 833,  defect_amount: 150000,  rework_amount: 90000,  worker: "정지수", cause: "표면 긁힘",      action: "포장 방법 개선" },
  { id: 8,  date: "2026-03-11", line: "D라인", product: "SP2",         product_code: "SP-0200", inspection_qty: 600,  defect_qty: 4,  rework_qty: 2,  defect_type: "이물혼입",  ppm: 6667, defect_amount: 640000,  rework_amount: 200000, worker: "최강호", cause: "설비 내부 이물", action: "설비 정비 실시" },
  { id: 9,  date: "2026-03-10", line: "B라인", product: "HORN PLATE",  product_code: "HP-1122", inspection_qty: 950,  defect_qty: 0,  rework_qty: 0,  defect_type: "기타",      ppm: 0,    defect_amount: 0,        rework_amount: 0,      worker: "이영희", cause: "-",               action: "-" },
  { id: 10, date: "2026-03-10", line: "C라인", product: "BUSH (FRONT)",product_code: "BF-3310", inspection_qty: 800,  defect_qty: 2,  rework_qty: 1,  defect_type: "치수불량",  ppm: 2500, defect_amount: 360000,  rework_amount: 120000, worker: "박민수", cause: "가공 공차 초과",  action: "CNC 파라미터 수정" },
];

const INIT_CLAIMS: Claim[] = [
  { id: 1, claim_no: "CLM-2026-001", claim_date: "2026-03-10", customer: "현대자동차", product: "STRW DAMPER",  defect_qty: 12, defect_amount: 1800000, description: "조립 후 이음 발생 — 치수 불량으로 확인", defect_type: "치수불량", status: "대책수립", d8_step: 6, assignee: "김철수", due_date: "2026-03-20", root_cause: "금형 마모로 인한 치수 편차", action_taken: "금형 교체 및 재검사 실시" },
  { id: 2, claim_no: "CLM-2026-002", claim_date: "2026-03-08", customer: "기아자동차", product: "HORN PLATE",   defect_qty: 5,  defect_amount: 600000,  description: "도장 표면 기포 발생",                         defect_type: "외관불량", status: "조사중",   d8_step: 3, assignee: "이영희", due_date: "2026-03-18", root_cause: "조사 중",                           action_taken: "시료 회수 완료" },
  { id: 3, claim_no: "CLM-2026-003", claim_date: "2026-03-05", customer: "현대모비스",  product: "BUSH (FRONT)", defect_qty: 8,  defect_amount: 960000,  description: "경도 기준 미달 — 내구성 저하 우려",            defect_type: "기능불량", status: "완료",     d8_step: 8, assignee: "박민수", due_date: "2026-03-15", root_cause: "배합비 오류",                       action_taken: "배합비 수정 및 수평전개 완료" },
  { id: 4, claim_no: "CLM-2026-004", claim_date: "2026-03-03", customer: "삼성SDI",    product: "SP2",          defect_qty: 20, defect_amount: 3200000, description: "이물 혼입으로 인한 전량 반품 요청",            defect_type: "이물혼입", status: "조사중",   d8_step: 2, assignee: "최강호", due_date: "2026-03-25", root_cause: "조사 중",                           action_taken: "설비 분해 점검 중" },
  { id: 5, claim_no: "CLM-2026-005", claim_date: "2026-02-28", customer: "현대자동차", product: "STRW DAMPER",  defect_qty: 3,  defect_amount: 450000,  description: "포장 손상으로 인한 외관 불량",                 defect_type: "포장불량", status: "완료",     d8_step: 8, assignee: "정지수", due_date: "2026-03-10", root_cause: "포장재 두께 부족",                  action_taken: "포장재 규격 변경" },
  { id: 6, claim_no: "CLM-2026-006", claim_date: "2026-02-25", customer: "기아자동차", product: "BUSH (FRONT)", defect_qty: 6,  defect_amount: 720000,  description: "조립 공차 초과 — 장착 불가",                   defect_type: "조립불량", status: "보류",     d8_step: 1, assignee: "김철수", due_date: "2026-03-05", root_cause: "미확인",                            action_taken: "보류 사유: 고객 추가 샘플 요청 대기" },
];

const LINES = ["A라인", "B라인", "C라인", "D라인"];
const PRODUCTS = [
  { name: "STRW DAMPER", code: "SD-2341" },
  { name: "HORN PLATE",  code: "HP-1122" },
  { name: "BUSH (FRONT)",code: "BF-3310" },
  { name: "SP2",         code: "SP-0200" },
];
const CUSTOMERS = ["현대자동차", "기아자동차", "현대모비스", "삼성SDI", "LG에너지솔루션"];
const DEFECT_TYPES: DefectType[] = ["치수불량","외관불량","기능불량","재료불량","조립불량","이물혼입","포장불량","기타"];
const CLAIM_STATUSES: ClaimStatus[] = ["접수","조사중","대책수립","완료","보류"];

const CLAIM_STATUS_CFG: Record<ClaimStatus, { color: string; icon: React.ElementType }> = {
  "접수":    { color: "bg-slate-500/20 text-slate-400 border-slate-500/30",     icon: Clock },
  "조사중":  { color: "bg-amber-600/20 text-amber-400 border-amber-500/30",         icon: RefreshCw },
  "대책수립":{ color: "bg-amber-500/20 text-amber-400 border-amber-500/30",     icon: AlertTriangle },
  "완료":    { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  "보류":    { color: "bg-red-500/20 text-red-400 border-red-500/30",           icon: XCircle },
};

function getPpmStatus(ppm: number): PpmStatus {
  if (ppm < 500)  return "good";
  if (ppm < 2000) return "warning";
  return "critical";
}

function formatKRW(v: number) {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억원`;
  if (v >= 10_000)      return `${(v / 10_000).toFixed(0)}만원`;
  return `${v.toLocaleString()}원`;
}

// ── PPM 링 게이지 ─────────────────────────────────────────────
function PpmRing({ ppm, size = 64 }: { ppm: number; size?: number }) {
  const status = getPpmStatus(ppm);
  const colors = { good: { stroke: "#10b981", text: "#6ee7b7" }, warning: { stroke: "#f59e0b", text: "#fcd34d" }, critical: { stroke: "#ef4444", text: "#fca5a5" } }[status];
  const max = 5000;
  const pct = Math.min(ppm / max, 1);
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={size * 0.09} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.stroke} strokeWidth={size * 0.09}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x={cx} y={cy + size * 0.06} textAnchor="middle" fill={colors.text}
        fontSize={size * 0.17} fontWeight="bold" fontFamily="monospace">
        {ppm > 9999 ? "9999+" : ppm.toLocaleString()}
      </text>
      <text x={cx} y={cy + size * 0.22} textAnchor="middle" fill="#64748b" fontSize={size * 0.12}>
        PPM
      </text>
    </svg>
  );
}

// ── D8 진행 표시 ──────────────────────────────────────────────
function D8Stepper({ step }: { step: number }) {
  const steps = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"];
  return (
    <div className="flex items-center gap-0.5">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors
            ${i < step ? "bg-emerald-600 text-white" : i === step - 1 ? "bg-amber-600 text-white ring-2 ring-blue-400/50" : "bg-slate-700 text-slate-500"}`}>
            {s}
          </div>
          {i < 7 && <div className={`h-px w-3 ${i < step - 1 ? "bg-emerald-600" : "bg-slate-700"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── 불량 등록 모달 ────────────────────────────────────────────
interface DefectModalProps {
  onClose: () => void;
  onSave: (r: DefectRecord) => void;
}
function DefectModal({ onClose, onSave }: DefectModalProps) {
  const today = "2026-03-13";
  const [f, setF] = useState({
    date: today, line: LINES[0], product: PRODUCTS[0].name, product_code: PRODUCTS[0].code,
    inspection_qty: "", defect_qty: "", rework_qty: "0",
    defect_type: DEFECT_TYPES[0] as DefectType,
    defect_amount: "", rework_amount: "",
    worker: "", cause: "", action: "",
  });

  const set = (k: string, v: string) => {
    const next = { ...f, [k]: v };
    if (k === "product") {
      const p = PRODUCTS.find(p => p.name === v);
      next.product_code = p?.code ?? "";
    }
    setF(next);
  };

  const iq = parseInt(f.inspection_qty) || 0;
  const dq = parseInt(f.defect_qty) || 0;
  const ppm = iq > 0 ? Math.round((dq / iq) * 1_000_000) : 0;

  const handleSave = () => {
    if (!f.inspection_qty || !f.worker) return;
    const rq = parseInt(f.rework_qty) || 0;
    const id = Date.now();
    onSave({
      id, date: f.date, line: f.line, product: f.product, product_code: f.product_code,
      inspection_qty: iq, defect_qty: dq, rework_qty: rq,
      defect_type: f.defect_type, ppm,
      defect_amount: parseInt(f.defect_amount) || 0,
      rework_amount: parseInt(f.rework_amount) || 0,
      worker: f.worker, cause: f.cause, action: f.action,
    });
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3">
      <label className="text-xs text-slate-400 text-right">{label}</label>
      {children}
    </div>
  );
  const inp = "bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500";
  const sel = inp + " appearance-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-base font-bold text-white flex items-center gap-2"><AlertTriangle size={18} className="text-amber-400" />불량 등록</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"><XCircle size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <Row label="작업일">
            <input type="date" value={f.date} onChange={e => set("date", e.target.value)} className={inp} />
          </Row>
          <Row label="라인">
            <select value={f.line} onChange={e => set("line", e.target.value)} className={sel}>
              {LINES.map(l => <option key={l}>{l}</option>)}
            </select>
          </Row>
          <Row label="품목">
            <select value={f.product} onChange={e => set("product", e.target.value)} className={sel}>
              {PRODUCTS.map(p => <option key={p.code}>{p.name}</option>)}
            </select>
          </Row>
          <Row label="검사수량">
            <input type="number" placeholder="개" value={f.inspection_qty} onChange={e => set("inspection_qty", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="불량수량">
            <div className="flex items-center gap-2">
              <input type="number" placeholder="개" value={f.defect_qty} onChange={e => set("defect_qty", e.target.value)} className={inp + " flex-1"} min="0" />
              {iq > 0 && (
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border
                  ${getPpmStatus(ppm) === "good" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : getPpmStatus(ppm) === "warning" ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                  : "text-red-400 border-red-500/30 bg-red-500/10"}`}>
                  {ppm.toLocaleString()} PPM
                </span>
              )}
            </div>
          </Row>
          <Row label="재작업수량">
            <input type="number" placeholder="개" value={f.rework_qty} onChange={e => set("rework_qty", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="불량유형">
            <select value={f.defect_type} onChange={e => set("defect_type", e.target.value)} className={sel}>
              {DEFECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="불량금액 (원)">
            <input type="number" placeholder="0" value={f.defect_amount} onChange={e => set("defect_amount", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="재작업금액 (원)">
            <input type="number" placeholder="0" value={f.rework_amount} onChange={e => set("rework_amount", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="담당자">
            <input type="text" placeholder="성명" value={f.worker} onChange={e => set("worker", e.target.value)} className={inp} />
          </Row>
          <Row label="원인">
            <input type="text" placeholder="불량 발생 원인" value={f.cause} onChange={e => set("cause", e.target.value)} className={inp} />
          </Row>
          <Row label="조치사항">
            <input type="text" placeholder="조치/예정 내용" value={f.action} onChange={e => set("action", e.target.value)} className={inp} />
          </Row>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-slate-700">
          <button onClick={onClose} className="btn-secondary">취소</button>
          <button onClick={handleSave} disabled={!f.inspection_qty || !f.worker} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">등록</button>
        </div>
      </div>
    </div>
  );
}

// ── 클레임 등록/수정 모달 ─────────────────────────────────────
interface ClaimModalProps {
  claim?: Claim | null;
  onClose: () => void;
  onSave: (c: Claim) => void;
}
function ClaimModal({ claim, onClose, onSave }: ClaimModalProps) {
  const today = "2026-03-13";
  const isEdit = !!claim;
  const [f, setF] = useState({
    claim_no:      claim?.claim_no ?? `CLM-2026-${String(Date.now()).slice(-3)}`,
    claim_date:    claim?.claim_date ?? today,
    customer:      claim?.customer ?? CUSTOMERS[0],
    product:       claim?.product ?? PRODUCTS[0].name,
    defect_qty:    String(claim?.defect_qty ?? ""),
    defect_amount: String(claim?.defect_amount ?? ""),
    description:   claim?.description ?? "",
    defect_type:   (claim?.defect_type ?? DEFECT_TYPES[0]) as DefectType,
    status:        (claim?.status ?? "접수") as ClaimStatus,
    d8_step:       String(claim?.d8_step ?? "1"),
    assignee:      claim?.assignee ?? "",
    due_date:      claim?.due_date ?? "",
    root_cause:    claim?.root_cause ?? "",
    action_taken:  claim?.action_taken ?? "",
  });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!f.customer || !f.description || !f.assignee) return;
    onSave({
      id:            claim?.id ?? Date.now(),
      claim_no:      f.claim_no,
      claim_date:    f.claim_date,
      customer:      f.customer,
      product:       f.product,
      defect_qty:    parseInt(f.defect_qty) || 0,
      defect_amount: parseInt(f.defect_amount) || 0,
      description:   f.description,
      defect_type:   f.defect_type,
      status:        f.status,
      d8_step:       parseInt(f.d8_step) || 1,
      assignee:      f.assignee,
      due_date:      f.due_date,
      root_cause:    f.root_cause,
      action_taken:  f.action_taken,
    });
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3">
      <label className="text-xs text-slate-400 text-right pt-2">{label}</label>
      {children}
    </div>
  );
  const inp = "bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500";
  const sel = inp + " appearance-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-amber-400" />
            {isEdit ? "클레임 수정" : "클레임 등록"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"><XCircle size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <Row label="클레임번호">
            <input value={f.claim_no} onChange={e => set("claim_no", e.target.value)} className={inp} />
          </Row>
          <Row label="클레임일">
            <input type="date" value={f.claim_date} onChange={e => set("claim_date", e.target.value)} className={inp} />
          </Row>
          <Row label="고객사">
            <select value={f.customer} onChange={e => set("customer", e.target.value)} className={sel}>
              {CUSTOMERS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Row>
          <Row label="품목">
            <select value={f.product} onChange={e => set("product", e.target.value)} className={sel}>
              {PRODUCTS.map(p => <option key={p.code}>{p.name}</option>)}
            </select>
          </Row>
          <Row label="불량수량">
            <input type="number" placeholder="개" value={f.defect_qty} onChange={e => set("defect_qty", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="클레임금액(원)">
            <input type="number" placeholder="0" value={f.defect_amount} onChange={e => set("defect_amount", e.target.value)} className={inp} min="0" />
          </Row>
          <Row label="불량유형">
            <select value={f.defect_type} onChange={e => set("defect_type", e.target.value)} className={sel}>
              {DEFECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="불량 내용">
            <textarea rows={2} value={f.description} onChange={e => set("description", e.target.value)}
              className={inp + " resize-none"} placeholder="불량 내용을 입력하세요" />
          </Row>
          <Row label="처리 상태">
            <select value={f.status} onChange={e => set("status", e.target.value)} className={sel}>
              {CLAIM_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Row>
          <Row label="8D 단계">
            <select value={f.d8_step} onChange={e => set("d8_step", e.target.value)} className={sel}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>D{n}</option>)}
            </select>
          </Row>
          <Row label="담당자">
            <input value={f.assignee} onChange={e => set("assignee", e.target.value)} className={inp} placeholder="성명" />
          </Row>
          <Row label="완료예정일">
            <input type="date" value={f.due_date} onChange={e => set("due_date", e.target.value)} className={inp} />
          </Row>
          <Row label="근본원인">
            <textarea rows={2} value={f.root_cause} onChange={e => set("root_cause", e.target.value)}
              className={inp + " resize-none"} placeholder="근본 원인 (4M 분석 결과 등)" />
          </Row>
          <Row label="조치사항">
            <textarea rows={2} value={f.action_taken} onChange={e => set("action_taken", e.target.value)}
              className={inp + " resize-none"} placeholder="실시한 조치 사항" />
          </Row>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-slate-700">
          <button onClick={onClose} className="btn-secondary">취소</button>
          <button onClick={handleSave} disabled={!f.customer || !f.description || !f.assignee}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            {isEdit ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 클레임 상세 모달 ──────────────────────────────────────────
function ClaimDetailModal({ claim, onClose, onEdit }: { claim: Claim; onClose: () => void; onEdit: () => void }) {
  const cfg = CLAIM_STATUS_CFG[claim.status];
  const Icon = cfg.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div>
            <h2 className="text-base font-bold text-white">{claim.claim_no}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{claim.claim_date} · {claim.customer}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg">수정</button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"><XCircle size={20} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
              <Icon size={11} />{claim.status}
            </span>
            <span className="text-xs text-slate-500">D{claim.d8_step} 단계</span>
          </div>
          <D8Stepper step={claim.d8_step} />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">품목</p>
              <p className="text-sm text-white font-medium mt-0.5">{claim.product}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">불량유형</p>
              <p className="text-sm text-amber-300 font-medium mt-0.5">{claim.defect_type}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">불량수량</p>
              <p className="text-sm text-red-300 font-mono font-bold mt-0.5">{claim.defect_qty.toLocaleString()}개</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">클레임금액</p>
              <p className="text-sm text-amber-300 font-mono font-bold mt-0.5">{formatKRW(claim.defect_amount)}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">담당자</p>
              <p className="text-sm text-white mt-0.5">{claim.assignee}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-500">완료예정일</p>
              <p className="text-sm text-white mt-0.5">{claim.due_date || "-"}</p>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 space-y-1">
            <p className="text-xs text-slate-500">불량 내용</p>
            <p className="text-sm text-white">{claim.description}</p>
          </div>
          {claim.root_cause && (
            <div className="bg-slate-800/60 rounded-lg p-3 space-y-1">
              <p className="text-xs text-slate-500">근본원인</p>
              <p className="text-sm text-white">{claim.root_cause}</p>
            </div>
          )}
          {claim.action_taken && (
            <div className="bg-slate-800/60 rounded-lg p-3 space-y-1">
              <p className="text-xs text-slate-500">조치사항</p>
              <p className="text-sm text-white">{claim.action_taken}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function QualityPage() {
  const [defects, setDefects] = useState<DefectRecord[]>(INIT_DEFECTS);
  const [claims, setClaims]   = useState<Claim[]>(INIT_CLAIMS);
  const [tab, setTab]         = useState<"defects" | "claims" | "summary">("defects");
  const [search, setSearch]   = useState("");
  const [lineFilter, setLineFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [claimStatusFilter, setClaimStatusFilter] = useState<ClaimStatus | "전체">("전체");

  const [showDefectModal, setShowDefectModal] = useState(false);
  const [showClaimModal, setShowClaimModal]   = useState(false);
  const [editingClaim, setEditingClaim]       = useState<Claim | null>(null);
  const [detailClaim, setDetailClaim]         = useState<Claim | null>(null);

  // ── 필터된 불량 목록
  const filteredDefects = useMemo(() => defects.filter(d =>
    (lineFilter === "전체" || d.line === lineFilter) &&
    (typeFilter === "전체" || d.defect_type === typeFilter) &&
    (d.product.includes(search) || d.worker.includes(search) || d.cause.includes(search))
  ), [defects, lineFilter, typeFilter, search]);

  // ── 필터된 클레임 목록
  const filteredClaims = useMemo(() => claims.filter(c =>
    (claimStatusFilter === "전체" || c.status === claimStatusFilter) &&
    (c.customer.includes(search) || c.product.includes(search) || c.description.includes(search))
  ), [claims, claimStatusFilter, search]);

  // ── KPI 계산
  const totalInspection = defects.reduce((s, d) => s + d.inspection_qty, 0);
  const totalDefect     = defects.reduce((s, d) => s + d.defect_qty, 0);
  const totalDefectAmt  = defects.reduce((s, d) => s + d.defect_amount + d.rework_amount, 0);
  const avgPpm          = totalInspection > 0 ? Math.round((totalDefect / totalInspection) * 1_000_000) : 0;
  const criticalCount   = defects.filter(d => getPpmStatus(d.ppm) === "critical").length;
  const openClaims      = claims.filter(c => c.status !== "완료").length;
  const totalClaimAmt   = claims.reduce((s, c) => s + c.defect_amount, 0);

  // ── 라인별 요약 (월별 요약 탭용)
  const lineSummary = useMemo(() => {
    const map: Record<string, { inspection: number; defect: number; rework: number; defect_amt: number }> = {};
    defects.forEach(d => {
      if (!map[d.line]) map[d.line] = { inspection: 0, defect: 0, rework: 0, defect_amt: 0 };
      map[d.line].inspection += d.inspection_qty;
      map[d.line].defect     += d.defect_qty;
      map[d.line].rework     += d.rework_qty;
      map[d.line].defect_amt += d.defect_amount + d.rework_amount;
    });
    return Object.entries(map).map(([line, v]) => ({
      line, ...v,
      ppm: v.inspection > 0 ? Math.round((v.defect / v.inspection) * 1_000_000) : 0,
    }));
  }, [defects]);

  // ── 불량유형별 집계
  const typeSummary = useMemo(() => {
    const map: Record<string, { count: number; defect_qty: number }> = {};
    defects.filter(d => d.defect_qty > 0).forEach(d => {
      if (!map[d.defect_type]) map[d.defect_type] = { count: 0, defect_qty: 0 };
      map[d.defect_type].count++;
      map[d.defect_type].defect_qty += d.defect_qty;
    });
    return Object.entries(map).sort((a, b) => b[1].defect_qty - a[1].defect_qty);
  }, [defects]);

  const handleSaveDefect = (r: DefectRecord) => {
    setDefects(p => [r, ...p]);
    setShowDefectModal(false);
  };
  const handleSaveClaim = (c: Claim) => {
    if (editingClaim) {
      setClaims(p => p.map(x => x.id === c.id ? c : x));
    } else {
      setClaims(p => [c, ...p]);
    }
    setShowClaimModal(false);
    setEditingClaim(null);
    setDetailClaim(null);
  };

  const TABS = [
    { key: "defects" as const, label: "불량 이력" },
    { key: "claims"  as const, label: "고객 클레임" },
    { key: "summary" as const, label: "라인별 요약" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">품질 관리</h1>
          <p className="text-slate-500 text-sm mt-0.5">불량 이력 · PPM 추적 · 고객 클레임 8D</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDefectModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors">
            <Plus size={15} />불량 등록
          </button>
          <button onClick={() => { setEditingClaim(null); setShowClaimModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors">
            <Plus size={15} />클레임 등록
          </button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "종합 PPM",    value: avgPpm.toLocaleString(),     unit: "PPM", color: getPpmStatus(avgPpm) === "good" ? "emerald" : getPpmStatus(avgPpm) === "warning" ? "amber" : "red" },
          { label: "총 검사",     value: totalInspection.toLocaleString(), unit: "개",  color: "blue" },
          { label: "총 불량",     value: totalDefect.toLocaleString(), unit: "개",  color: "red" },
          { label: "손실 금액",   value: formatKRW(totalDefectAmt),   unit: "",    color: "amber" },
          { label: "위험 품목",   value: String(criticalCount),        unit: "개",  color: criticalCount > 0 ? "red" : "emerald" },
          { label: "미결 클레임", value: String(openClaims),           unit: "건",  color: openClaims > 0 ? "amber" : "emerald" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className={`card border border-${color}-500/20`}>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-bold font-mono text-${color}-300 mt-1`}>{value}<span className="text-xs ml-1">{unit}</span></p>
          </div>
        ))}
      </div>

      {/* 탭 + 검색 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === t.key ? "bg-amber-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="품목/담당자/고객사 검색"
            className="bg-transparent text-sm text-white placeholder-slate-500 flex-1 focus:outline-none" />
        </div>
      </div>

      {/* ── 불량 이력 탭 ───────────────────────────────────────── */}
      {tab === "defects" && (
        <div className="space-y-3">
          {/* 필터 */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex gap-1">
              {["전체", ...LINES].map(l => (
                <button key={l} onClick={() => setLineFilter(l)}
                  className={`px-3 py-1.5 rounded-lg border transition-all
                    ${lineFilter === l ? "bg-amber-600 border-amber-500 text-white" : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {["전체", ...DEFECT_TYPES].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg border transition-all
                    ${typeFilter === t ? "bg-amber-600 border-amber-500 text-white" : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 테이블 */}
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700 bg-slate-800/40">
                  <th className="py-3 px-3 text-left">날짜</th>
                  <th className="py-3 px-3 text-left">라인</th>
                  <th className="py-3 px-3 text-left">품목</th>
                  <th className="py-3 px-3 text-right">검사</th>
                  <th className="py-3 px-3 text-right">불량</th>
                  <th className="py-3 px-3 text-right">재작업</th>
                  <th className="py-3 px-3 text-center">PPM</th>
                  <th className="py-3 px-3 text-left">유형</th>
                  <th className="py-3 px-3 text-right">손실금액</th>
                  <th className="py-3 px-3 text-left">담당자</th>
                  <th className="py-3 px-3 text-left">원인</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.length === 0 ? (
                  <tr><td colSpan={11} className="py-10 text-center text-slate-500">조건에 맞는 불량 이력이 없습니다.</td></tr>
                ) : filteredDefects.map(d => {
                  const st = getPpmStatus(d.ppm);
                  const ppmColor = st === "good" ? "text-emerald-400" : st === "warning" ? "text-amber-400" : "text-red-400";
                  const isToday = d.date === "2026-03-13";
                  return (
                    <tr key={d.id} className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${isToday ? "bg-blue-950/20" : ""}`}>
                      <td className="py-2.5 px-3 text-slate-400">
                        {d.date}{isToday && <span className="ml-1 text-[9px] px-1 py-0.5 bg-amber-600/30 text-amber-400 rounded">오늘</span>}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-white">{d.line}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-white font-medium">{d.product}</div>
                        <div className="text-slate-500 text-[10px]">{d.product_code}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{d.inspection_qty.toLocaleString()}</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${d.defect_qty > 0 ? "text-red-300" : "text-slate-500"}`}>
                        {d.defect_qty}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono ${d.rework_qty > 0 ? "text-amber-300" : "text-slate-500"}`}>
                        {d.rework_qty}
                      </td>
                      <td className={`py-2.5 px-3 text-center font-mono font-bold ${ppmColor}`}>
                        {d.ppm > 0 ? d.ppm.toLocaleString() : "—"}
                      </td>
                      <td className="py-2.5 px-3">
                        {d.defect_qty > 0 ? (
                          <span className="px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded text-[10px]">{d.defect_type}</span>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-300">
                        {d.defect_amount + d.rework_amount > 0 ? formatKRW(d.defect_amount + d.rework_amount) : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{d.worker}</td>
                      <td className="py-2.5 px-3 text-slate-400 max-w-[160px] truncate" title={d.cause}>{d.cause || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 고객 클레임 탭 ──────────────────────────────────────── */}
      {tab === "claims" && (
        <div className="space-y-3">
          {/* 상태 필터 */}
          <div className="flex flex-wrap gap-2 text-xs">
            {(["전체", ...CLAIM_STATUSES] as (ClaimStatus | "전체")[]).map(s => {
              const count = s === "전체" ? claims.length : claims.filter(c => c.status === s).length;
              const cfg = s !== "전체" ? CLAIM_STATUS_CFG[s] : null;
              return (
                <button key={s} onClick={() => setClaimStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1
                    ${claimStatusFilter === s ? "bg-amber-600 border-amber-500 text-white" : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}>
                  {s} <span className="font-mono text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* 클레임 카드 목록 */}
          <div className="space-y-3">
            {filteredClaims.length === 0 ? (
              <div className="card text-center py-10 text-slate-500">조건에 맞는 클레임이 없습니다.</div>
            ) : filteredClaims.map(c => {
              const cfg = CLAIM_STATUS_CFG[c.status];
              const Icon = cfg.icon;
              const today = new Date("2026-03-13");
              const due   = c.due_date ? new Date(c.due_date) : null;
              const dday  = due ? Math.round((due.getTime() - today.getTime()) / 86_400_000) : null;
              return (
                <div key={c.id} className="card hover:border-slate-500 transition-colors cursor-pointer" onClick={() => setDetailClaim(c)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">{c.claim_no}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.color}`}>
                          <Icon size={10} />{c.status}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded">{c.defect_type}</span>
                        {dday !== null && c.status !== "완료" && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                            ${dday < 0 ? "bg-red-500/20 text-red-400" : dday <= 3 ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>
                            {dday < 0 ? `D+${Math.abs(dday)} 지연` : dday === 0 ? "오늘 마감" : `D-${dday}`}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white font-medium mt-1.5 truncate">{c.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{c.claim_date}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-amber-300">{c.customer}</span>
                        <span className="text-slate-600">·</span>
                        <span>{c.product}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-sm font-mono font-bold text-amber-300">{formatKRW(c.defect_amount)}</p>
                      <p className="text-xs text-slate-500">{c.defect_qty.toLocaleString()}개</p>
                      <D8Stepper step={c.d8_step} />
                      <div className="flex gap-1 mt-1">
                        <button onClick={e => { e.stopPropagation(); setDetailClaim(c); }}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setEditingClaim(c); setShowClaimModal(true); }}
                          className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded transition-colors">
                          <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 라인별 요약 탭 ──────────────────────────────────────── */}
      {tab === "summary" && (
        <div className="space-y-6">
          {/* 라인별 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {lineSummary.map(s => (
              <div key={s.line} className={`card border ${getPpmStatus(s.ppm) === "good" ? "border-emerald-500/20" : getPpmStatus(s.ppm) === "warning" ? "border-amber-500/20" : "border-red-500/20"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.line}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">검사 {s.inspection.toLocaleString()}개</p>
                  </div>
                  <PpmRing ppm={s.ppm} size={64} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-slate-500">불량</p>
                    <p className="text-red-300 font-mono font-bold">{s.defect}개</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-slate-500">재작업</p>
                    <p className="text-amber-300 font-mono font-bold">{s.rework}개</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2 col-span-2">
                    <p className="text-slate-500">손실금액</p>
                    <p className="text-amber-300 font-mono font-bold">{formatKRW(s.defect_amt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 불량유형 분석 */}
          <div className="card">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400" />불량유형 분석
            </h2>
            {typeSummary.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">불량 데이터 없음</p>
            ) : (
              <div className="space-y-2">
                {typeSummary.map(([type, v]) => {
                  const maxQty = typeSummary[0][1].defect_qty;
                  const pct = maxQty > 0 ? (v.defect_qty / maxQty) * 100 : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16 shrink-0">{type}</span>
                      <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-mono text-amber-300 w-12 text-right shrink-0">{v.defect_qty}개</span>
                      <span className="text-xs text-slate-500 w-10 text-right shrink-0">({v.count}건)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 클레임 금액 요약 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "전체 클레임",   value: String(claims.length),               unit: "건",  color: "blue" },
              { label: "미결 클레임",   value: String(openClaims),                  unit: "건",  color: openClaims > 0 ? "amber" : "emerald" },
              { label: "클레임 총액",   value: formatKRW(totalClaimAmt),            unit: "",    color: "red" },
              { label: "평균 클레임액", value: formatKRW(Math.round(totalClaimAmt / (claims.length || 1))), unit: "", color: "amber" },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className={`card border border-${color}-500/20`}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-xl font-bold font-mono text-${color}-300 mt-1`}>{value}<span className="text-xs ml-1">{unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PPM 기준 */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />PPM &lt; 500 (양호)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />PPM 500~2,000 (주의)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />PPM ≥ 2,000 (위험)</span>
      </div>

      {/* 모달 */}
      {showDefectModal && <DefectModal onClose={() => setShowDefectModal(false)} onSave={handleSaveDefect} />}
      {showClaimModal  && <ClaimModal  claim={editingClaim} onClose={() => { setShowClaimModal(false); setEditingClaim(null); }} onSave={handleSaveClaim} />}
      {detailClaim     && <ClaimDetailModal claim={detailClaim} onClose={() => setDetailClaim(null)} onEdit={() => { setEditingClaim(detailClaim); setDetailClaim(null); setShowClaimModal(true); }} />}
    </div>
  );
}
