"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Plus, Search, Filter, Download, RefreshCw,
  ChevronDown, X, Save, Truck, CheckCircle2,
  Clock, AlertCircle, XCircle, Eye, Edit3,
} from "lucide-react";
import { formatKRW } from "@/lib/erp-api";

// ── 타입 ────────────────────────────────────────────────────────
type OrderStatus = "접수대기" | "생산지시" | "생산중" | "출하대기" | "납품완료" | "취소";

interface SalesOrder {
  id: number;
  order_no: string;
  order_date: string;
  customer_name: string;
  product_name: string;
  product_code: string;
  order_qty: number;
  unit_price: number;
  due_date: string;
  shipped_qty?: number;
  status: OrderStatus;
  remarks?: string;
  created_by?: string;
}

// ── 상태 설정 ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType; next?: OrderStatus }> = {
  "접수대기": { label: "접수대기", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: Clock,        next: "생산지시" },
  "생산지시": { label: "생산지시", color: "bg-amber-600/20 text-amber-400 border-amber-500/30",     icon: AlertCircle,  next: "생산중" },
  "생산중":   { label: "생산중",   color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",      icon: RefreshCw,    next: "출하대기" },
  "출하대기": { label: "출하대기", color: "bg-amber-500/20 text-amber-400 border-amber-500/30",   icon: Truck,        next: "납품완료" },
  "납품완료": { label: "납품완료", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  "취소":     { label: "취소",     color: "bg-red-500/20 text-red-400 border-red-500/30",         icon: XCircle },
};

// ── 초기 데모 데이터 ─────────────────────────────────────────────
const INIT_ORDERS: SalesOrder[] = [
  { id:1,  order_no:"PO-2603-041", order_date:"2026-03-10", customer_name:"현대자동차",  product_name:"STRW DAMPER",  product_code:"SD-001", order_qty:5000, unit_price:4200,  due_date:"2026-03-15", shipped_qty:0,    status:"생산중",   remarks:"긴급", created_by:"김영업" },
  { id:2,  order_no:"PO-2603-040", order_date:"2026-03-09", customer_name:"기아자동차",  product_name:"HORN PLATE",   product_code:"HP-002", order_qty:3200, unit_price:3800,  due_date:"2026-03-17", shipped_qty:0,    status:"생산지시", remarks:"", created_by:"이영업" },
  { id:3,  order_no:"PO-2603-039", order_date:"2026-03-09", customer_name:"GM코리아",    product_name:"BUSH (FRONT)", product_code:"BF-003", order_qty:2400, unit_price:2100,  due_date:"2026-03-20", shipped_qty:0,    status:"생산지시", remarks:"", created_by:"박영업" },
  { id:4,  order_no:"PO-2603-038", order_date:"2026-03-08", customer_name:"현대자동차",  product_name:"SP2",          product_code:"SP-004", order_qty:1800, unit_price:5500,  due_date:"2026-03-22", shipped_qty:0,    status:"접수대기", remarks:"도면 검토중", created_by:"김영업" },
  { id:5,  order_no:"PO-2603-037", order_date:"2026-03-07", customer_name:"르노코리아",  product_name:"STRW DAMPER",  product_code:"SD-001", order_qty:2200, unit_price:4100,  due_date:"2026-03-25", shipped_qty:0,    status:"생산중",   remarks:"", created_by:"이영업" },
  { id:6,  order_no:"PO-2603-036", order_date:"2026-03-06", customer_name:"쌍용자동차",  product_name:"HORN PLATE",   product_code:"HP-002", order_qty:1500, unit_price:3700,  due_date:"2026-03-26", shipped_qty:0,    status:"출하대기", remarks:"", created_by:"박영업" },
  { id:7,  order_no:"PO-2603-035", order_date:"2026-03-05", customer_name:"기아자동차",  product_name:"BUSH (REAR)",  product_code:"BR-005", order_qty:3600, unit_price:2300,  due_date:"2026-03-28", shipped_qty:0,    status:"생산중",   remarks:"", created_by:"김영업" },
  { id:8,  order_no:"PO-2603-034", order_date:"2026-03-04", customer_name:"현대자동차",  product_name:"STRW DAMPER",  product_code:"SD-001", order_qty:4500, unit_price:4200,  due_date:"2026-03-12", shipped_qty:4500, status:"납품완료", remarks:"", created_by:"이영업" },
  { id:9,  order_no:"PO-2603-033", order_date:"2026-03-03", customer_name:"GM코리아",    product_name:"SP2",          product_code:"SP-004", order_qty:800,  unit_price:5400,  due_date:"2026-03-10", shipped_qty:800,  status:"납품완료", remarks:"", created_by:"박영업" },
  { id:10, order_no:"PO-2603-032", order_date:"2026-03-02", customer_name:"르노코리아",  product_name:"BUSH (FRONT)", product_code:"BF-003", order_qty:1200, unit_price:2050,  due_date:"2026-03-08", shipped_qty:0,    status:"취소",     remarks:"고객 취소 요청", created_by:"김영업" },
];

const CUSTOMERS  = ["현대자동차", "기아자동차", "GM코리아", "르노코리아", "쌍용자동차"];
const PRODUCTS   = [
  { name: "STRW DAMPER",  code: "SD-001", price: 4200 },
  { name: "HORN PLATE",   code: "HP-002", price: 3800 },
  { name: "BUSH (FRONT)", code: "BF-003", price: 2100 },
  { name: "BUSH (REAR)",  code: "BR-005", price: 2300 },
  { name: "SP2",          code: "SP-004", price: 5500 },
];

// D-Day 계산
function calcDDay(due: string): number {
  const today = new Date("2026-03-13");
  const d = new Date(due);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

function DDayBadge({ due, status }: { due: string; status: OrderStatus }) {
  if (status === "납품완료" || status === "취소") return null;
  const d = calcDDay(due);
  if (d < 0)  return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/30 text-red-300">D+{Math.abs(d)} 지연</span>;
  if (d <= 2) return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">D-{d}</span>;
  if (d <= 5) return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">D-{d}</span>;
  return <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 bg-slate-700/40">D-{d}</span>;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

// ── 수주 등록/수정 모달 ─────────────────────────────────────────
interface OrderModalProps {
  order: Partial<SalesOrder> | null;
  onClose: () => void;
  onSave: (data: Partial<SalesOrder>) => void;
}

function OrderModal({ order, onClose, onSave }: OrderModalProps) {
  const isEdit = !!order?.id;
  const [form, setForm] = useState<Partial<SalesOrder>>({
    order_date: order?.order_date ?? new Date().toISOString().slice(0, 10),
    customer_name: order?.customer_name ?? "",
    product_name: order?.product_name ?? "",
    product_code: order?.product_code ?? "",
    order_qty: order?.order_qty ?? 0,
    unit_price: order?.unit_price ?? 0,
    due_date: order?.due_date ?? "",
    status: order?.status ?? "접수대기",
    remarks: order?.remarks ?? "",
    created_by: order?.created_by ?? "",
  });

  const handleProductChange = (name: string) => {
    const p = PRODUCTS.find(x => x.name === name);
    setForm(f => ({ ...f, product_name: name, product_code: p?.code ?? "", unit_price: p?.price ?? 0 }));
  };

  const totalAmt = (form.order_qty ?? 0) * (form.unit_price ?? 0);
  const isValid = form.customer_name && form.product_name && (form.order_qty ?? 0) > 0 && form.due_date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-base font-semibold text-white">{isEdit ? "수주 수정" : "신규 수주 등록"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* 수주일 + 고객사 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">수주일 *</label>
              <input type="date" value={form.order_date}
                onChange={e => setForm(f => ({ ...f, order_date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">고객사 *</label>
              <select value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                <option value="">선택</option>
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* 품목 */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">품목 *</label>
            <select value={form.product_name}
              onChange={e => handleProductChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="">선택</option>
              {PRODUCTS.map(p => <option key={p.code} value={p.name}>{p.name} ({p.code})</option>)}
            </select>
          </div>

          {/* 수량 + 단가 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">수주수량 *</label>
              <input type="number" min={1} value={form.order_qty ?? ""}
                onChange={e => setForm(f => ({ ...f, order_qty: Number(e.target.value) }))}
                placeholder="0" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">단가 (원)</label>
              <input type="number" min={0} value={form.unit_price ?? ""}
                onChange={e => setForm(f => ({ ...f, unit_price: Number(e.target.value) }))}
                placeholder="0" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          {/* 수주금액 표시 */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg px-3 py-2 flex justify-between items-center">
            <span className="text-xs text-amber-400">수주금액</span>
            <span className="text-sm font-bold font-mono text-amber-300">{formatKRW(totalAmt)}</span>
          </div>

          {/* 납기일 + 상태 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">납기일 *</label>
              <input type="date" value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">상태</label>
              <select value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 담당자 + 비고 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">담당자</label>
              <input type="text" value={form.created_by ?? ""}
                onChange={e => setForm(f => ({ ...f, created_by: e.target.value }))}
                placeholder="홍길동" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">비고</label>
              <input type="text" value={form.remarks ?? ""}
                onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="특이사항" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-700">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors">
            취소
          </button>
          <button onClick={() => isValid && onSave(form)} disabled={!isValid}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "수정 저장" : "수주 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 상태 변경 모달 ───────────────────────────────────────────────
function StatusChangeModal({ order, onClose, onConfirm }: {
  order: SalesOrder; onClose: () => void; onConfirm: (newStatus: OrderStatus) => void;
}) {
  const next = STATUS_CONFIG[order.status].next;
  if (!next) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-white mb-2">상태 변경</h3>
        <p className="text-sm text-slate-400 mb-4">
          <span className="text-white font-medium">{order.order_no}</span> 수주를
          <br />
          <StatusBadge status={order.status} /> → <StatusBadge status={next} /> 으로 변경합니까?
        </p>
        {next === "납품완료" && (
          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3 mb-4 text-xs text-emerald-300">
            납품 처리 시 출하수량이 수주수량으로 자동 기록됩니다.
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50">취소</button>
          <button onClick={() => onConfirm(next)}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> 변경 확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ────────────────────────────────────────────────
const STATUS_TABS: Array<OrderStatus | "전체"> = ["전체", "접수대기", "생산지시", "생산중", "출하대기", "납품완료", "취소"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>(INIT_ORDERS);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "전체">("전체");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState<"new" | "edit" | "status" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [nextId, setNextId] = useState(INIT_ORDERS.length + 1);

  // 필터
  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (filterStatus !== "전체" && o.status !== filterStatus) return false;
      if (search && !`${o.order_no}${o.customer_name}${o.product_name}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [orders, filterStatus, search]);

  // 집계
  const stats = useMemo(() => ({
    total:     orders.length,
    active:    orders.filter(o => !["납품완료","취소"].includes(o.status)).length,
    urgent:    orders.filter(o => !["납품완료","취소"].includes(o.status) && calcDDay(o.due_date) <= 3).length,
    completed: orders.filter(o => o.status === "납품완료").length,
    totalAmt:  orders.filter(o => o.status !== "취소").reduce((s, o) => s + o.order_qty * o.unit_price, 0),
  }), [orders]);

  const handleSave = useCallback((form: Partial<SalesOrder>) => {
    if (selectedOrder?.id) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...form } as SalesOrder : o));
    } else {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const seq = String(nextId).padStart(3, "0");
      const newOrder: SalesOrder = {
        ...form,
        id: nextId,
        order_no: `PO-26${mm}${dd.slice(0, 2)}-${seq}`,
        status: form.status ?? "접수대기",
        order_qty: form.order_qty ?? 0,
        unit_price: form.unit_price ?? 0,
        order_date: form.order_date ?? now.toISOString().slice(0, 10),
        customer_name: form.customer_name ?? "",
        product_name: form.product_name ?? "",
        product_code: form.product_code ?? "",
        due_date: form.due_date ?? "",
        shipped_qty: 0,
      } as SalesOrder;
      setOrders(prev => [newOrder, ...prev]);
      setNextId(n => n + 1);
    }
    setShowModal(null);
  }, [selectedOrder, nextId]);

  const handleStatusChange = useCallback((newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => {
      if (o.id !== selectedOrder.id) return o;
      return { ...o, status: newStatus, shipped_qty: newStatus === "납품완료" ? o.order_qty : o.shipped_qty };
    }));
    setShowModal(null);
  }, [selectedOrder]);

  const openEdit = (o: SalesOrder) => { setSelectedOrder(o); setShowModal("edit"); };
  const openStatus = (o: SalesOrder) => { setSelectedOrder(o); setShowModal("status"); };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-5">

      {/* ── 헤더 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">수주 관리</h1>
          <p className="text-slate-500 text-sm mt-0.5">고객 수주 접수 · 생산지시 · 납품 처리</p>
        </div>
        <button
          onClick={() => { setSelectedOrder(null); setShowModal("new"); }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> 신규 수주 등록
        </button>
      </div>

      {/* ── KPI 4-grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "전체 수주",   value: `${stats.total}건`,              color: "border-slate-600",       text: "text-white" },
          { label: "진행 수주",   value: `${stats.active}건`,             color: "border-amber-500/40",     text: "text-amber-300" },
          { label: "긴급 납기",   value: `${stats.urgent}건`,             color: "border-red-500/40",      text: "text-red-300" },
          { label: "이번달 수주금액", value: formatKRW(stats.totalAmt),   color: "border-emerald-500/40",  text: "text-emerald-300" },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`card border ${color}`}>
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
            <span className={`text-xl font-bold font-mono ${text} block mt-1`}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── 필터 & 검색 ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* 상태 탭 */}
        <div className="flex flex-wrap gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1">
          {STATUS_TABS.map(s => {
            const count = s === "전체" ? orders.length : orders.filter(o => o.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  filterStatus === s ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}>
                {s}
                <span className="ml-1 text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* 검색 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="수주번호 · 고객사 · 품목 검색"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* ── 수주 테이블 ── */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">수주 목록</span>
          <span className="text-xs text-slate-500">{filtered.length}건</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse min-w-[900px]">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700 text-left">
                <th className="py-2.5 px-3">수주번호</th>
                <th className="py-2.5 px-3">수주일</th>
                <th className="py-2.5 px-3">고객사</th>
                <th className="py-2.5 px-3">품목</th>
                <th className="py-2.5 px-3 text-right">수주수량</th>
                <th className="py-2.5 px-3 text-right">수주금액</th>
                <th className="py-2.5 px-3 text-center">납기일</th>
                <th className="py-2.5 px-3 text-center">D-Day</th>
                <th className="py-2.5 px-3 text-center">상태</th>
                <th className="py-2.5 px-3 text-center">담당</th>
                <th className="py-2.5 px-3 text-center">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-slate-500">조회된 수주가 없습니다.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="border-b border-slate-700/40 hover:bg-slate-700/15 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{o.order_no}</td>
                  <td className="py-2.5 px-3 text-slate-400">{o.order_date}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{o.customer_name}</td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{o.product_name}</div>
                    <div className="text-[10px] text-slate-600 font-mono">{o.product_code}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{o.order_qty.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{formatKRW(o.order_qty * o.unit_price)}</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">{o.due_date}</td>
                  <td className="py-2.5 px-3 text-center"><DDayBadge due={o.due_date} status={o.status} /></td>
                  <td className="py-2.5 px-3 text-center"><StatusBadge status={o.status} /></td>
                  <td className="py-2.5 px-3 text-center text-slate-500">{o.created_by ?? "-"}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(o)}
                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="수정">
                        <Edit3 className="w-3 h-3" />
                      </button>
                      {STATUS_CONFIG[o.status].next && (
                        <button onClick={() => openStatus(o)}
                          className="p-1.5 rounded-lg hover:bg-amber-600/20 text-amber-400 hover:text-amber-300 transition-colors" title="상태 변경">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 상태별 요약 ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(Object.entries(STATUS_CONFIG) as [OrderStatus, typeof STATUS_CONFIG[OrderStatus]][]).map(([s, cfg]) => {
          const cnt = orders.filter(o => o.status === s).length;
          const Icon = cfg.icon;
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "전체" : s)}
              className={`card text-center py-3 px-2 border cursor-pointer hover:brightness-110 transition-all ${
                filterStatus === s ? cfg.color : "border-slate-700/50 hover:border-slate-600"
              }`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${cfg.color.split(" ")[1]}`} />
              <div className={`text-lg font-bold font-mono ${cfg.color.split(" ")[1]}`}>{cnt}</div>
              <div className="text-[10px] text-slate-500">{s}</div>
            </button>
          );
        })}
      </div>

      {/* ── 모달 ── */}
      {(showModal === "new" || showModal === "edit") && (
        <OrderModal
          order={showModal === "edit" ? selectedOrder : null}
          onClose={() => { setShowModal(null); setSelectedOrder(null); }}
          onSave={handleSave}
        />
      )}
      {showModal === "status" && selectedOrder && (
        <StatusChangeModal
          order={selectedOrder}
          onClose={() => { setShowModal(null); setSelectedOrder(null); }}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
}
