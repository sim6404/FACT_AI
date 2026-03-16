"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Plus, Search, ArrowDown, ArrowUp, AlertTriangle,
  Package, X, Save, RefreshCw, FileDown, ChevronUp,
} from "lucide-react";
import { formatKRW } from "@/lib/erp-api";

// ── 타입 ────────────────────────────────────────────────────────
type ItemCategory = "원자재" | "반제품" | "완제품" | "소모품";
type TxType = "입고" | "출고" | "재고조정";

interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category: ItemCategory;
  unit: string;
  current_qty: number;
  safety_qty: number;
  unit_cost: number;
  location: string;
  supplier?: string;
  last_updated: string;
}

interface Transaction {
  id: number;
  item_id: number;
  item_name: string;
  tx_type: TxType;
  qty: number;
  ref_no: string;
  note: string;
  created_at: string;
  created_by: string;
}

// ── 초기 데이터 ──────────────────────────────────────────────────
const INIT_ITEMS: InventoryItem[] = [
  { id:1,  item_code:"RM-001", item_name:"천연고무 (NR-40)",     category:"원자재", unit:"kg",  current_qty:280,   safety_qty:500,  unit_cost:3200,  location:"창고A-01", supplier:"한국고무",   last_updated:"2026-03-13" },
  { id:2,  item_code:"RM-002", item_name:"합성고무 (SBR)",       category:"원자재", unit:"kg",  current_qty:1250,  safety_qty:800,  unit_cost:2800,  location:"창고A-02", supplier:"금호석유",   last_updated:"2026-03-12" },
  { id:3,  item_code:"RM-003", item_name:"스틸 코드 (1.2mm)",    category:"원자재", unit:"kg",  current_qty:630,   safety_qty:400,  unit_cost:4500,  location:"창고A-03", supplier:"포스코",     last_updated:"2026-03-11" },
  { id:4,  item_code:"RM-004", item_name:"방진 접착제",          category:"원자재", unit:"L",   current_qty:95,    safety_qty:150,  unit_cost:12000, location:"창고A-04", supplier:"화학물산",   last_updated:"2026-03-13" },
  { id:5,  item_code:"RM-005", item_name:"이형제",               category:"소모품", unit:"통",  current_qty:42,    safety_qty:30,   unit_cost:8500,  location:"창고B-01", supplier:"",          last_updated:"2026-03-10" },
  { id:6,  item_code:"WIP-001",item_name:"DAMPER 반제품",        category:"반제품", unit:"ea",  current_qty:850,   safety_qty:500,  unit_cost:2100,  location:"라인A 옆",  supplier:"",          last_updated:"2026-03-13" },
  { id:7,  item_code:"WIP-002",item_name:"PLATE 반제품",         category:"반제품", unit:"ea",  current_qty:320,   safety_qty:400,  unit_cost:1800,  location:"라인B 옆",  supplier:"",          last_updated:"2026-03-13" },
  { id:8,  item_code:"FG-001", item_name:"STRW DAMPER (완제품)", category:"완제품", unit:"ea",  current_qty:2340,  safety_qty:1000, unit_cost:4200,  location:"출하창고-1", supplier:"",         last_updated:"2026-03-13" },
  { id:9,  item_code:"FG-002", item_name:"HORN PLATE (완제품)",  category:"완제품", unit:"ea",  current_qty:1120,  safety_qty:800,  unit_cost:3800,  location:"출하창고-2", supplier:"",         last_updated:"2026-03-12" },
  { id:10, item_code:"FG-003", item_name:"BUSH FRONT (완제품)",  category:"완제품", unit:"ea",  current_qty:480,   safety_qty:600,  unit_cost:2100,  location:"출하창고-1", supplier:"",         last_updated:"2026-03-13" },
  { id:11, item_code:"FG-004", item_name:"SP2 (완제품)",         category:"완제품", unit:"ea",  current_qty:960,   safety_qty:500,  unit_cost:5500,  location:"출하창고-2", supplier:"",         last_updated:"2026-03-11" },
  { id:12, item_code:"MS-001", item_name:"금형 세척제",          category:"소모품", unit:"통",  current_qty:18,    safety_qty:10,   unit_cost:25000, location:"공구창고",   supplier:"",         last_updated:"2026-03-08" },
];

const INIT_TRANSACTIONS: Transaction[] = [
  { id:1, item_id:1, item_name:"천연고무 (NR-40)",     tx_type:"입고", qty:200,   ref_no:"PO-2603-021", note:"정기입고",        created_at:"2026-03-13 09:15", created_by:"창고팀" },
  { id:2, item_id:8, item_name:"STRW DAMPER (완제품)", tx_type:"출고", qty:4500,  ref_no:"PO-2603-034", note:"현대자동차 출하",  created_at:"2026-03-12 16:30", created_by:"출하팀" },
  { id:3, item_id:2, item_name:"합성고무 (SBR)",       tx_type:"입고", qty:500,   ref_no:"PO-2603-019", note:"",               created_at:"2026-03-12 10:00", created_by:"창고팀" },
  { id:4, item_id:9, item_name:"HORN PLATE (완제품)",  tx_type:"출고", qty:800,   ref_no:"PO-2603-031", note:"기아자동차 출하",  created_at:"2026-03-11 15:00", created_by:"출하팀" },
  { id:5, item_id:4, item_name:"방진 접착제",          tx_type:"입고", qty:50,    ref_no:"구매요청-042", note:"긴급발주",        created_at:"2026-03-11 11:30", created_by:"구매팀" },
  { id:6, item_id:1, item_name:"천연고무 (NR-40)",     tx_type:"출고", qty:320,   ref_no:"WO-2603-015", note:"A라인 투입",      created_at:"2026-03-11 08:00", created_by:"생산팀" },
  { id:7, item_id:11,item_name:"SP2 (완제품)",         tx_type:"출고", qty:800,   ref_no:"PO-2603-033", note:"GM코리아 출하",   created_at:"2026-03-10 17:00", created_by:"출하팀" },
  { id:8, item_id:7, item_name:"PLATE 반제품",         tx_type:"재고조정", qty:-80, ref_no:"실사-202603", note:"실사 조정",      created_at:"2026-03-10 14:00", created_by:"품질팀" },
];

const CATEGORIES: ItemCategory[] = ["원자재", "반제품", "완제품", "소모품"];

// ── 유틸 ────────────────────────────────────────────────────────
function stockStatus(item: InventoryItem) {
  const r = item.current_qty / item.safety_qty;
  if (r <= 0.5)  return "danger";
  if (r < 1)     return "warning";
  return "ok";
}

function StockBar({ item }: { item: InventoryItem }) {
  const r = Math.min(item.current_qty / (item.safety_qty * 2), 1);
  const status = stockStatus(item);
  const color = status === "danger" ? "bg-red-500" : status === "warning" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{ width: `${r * 100}%` }} />
    </div>
  );
}

// ── 입출고 모달 ──────────────────────────────────────────────────
interface TxModalProps {
  items: InventoryItem[];
  onClose: () => void;
  onSave: (itemId: number, tx: Omit<Transaction, "id" | "item_name" | "created_at">) => void;
  defaultItemId?: number;
  defaultType?: TxType;
}

function TxModal({ items, onClose, onSave, defaultItemId, defaultType = "입고" }: TxModalProps) {
  const [form, setForm] = useState({
    item_id: defaultItemId ?? (items[0]?.id ?? 0),
    tx_type: defaultType as TxType,
    qty: 0,
    ref_no: "",
    note: "",
    created_by: "",
  });

  const selectedItem = items.find(i => i.id === form.item_id);
  const isValid = form.item_id && form.qty > 0 && form.created_by;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-base font-semibold text-white">입출고 등록</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* 구분 */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">입출고 구분 *</label>
            <div className="grid grid-cols-3 gap-2">
              {(["입고", "출고", "재고조정"] as TxType[]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tx_type: t }))}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    form.tx_type === t
                      ? t === "입고" ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                        : t === "출고" ? "bg-red-600/20 border-red-500/40 text-red-300"
                        : "bg-amber-600/20 border-amber-500/40 text-amber-300"
                      : "border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}>
                  {t === "입고" ? "📥 입고" : t === "출고" ? "📤 출고" : "📋 재고조정"}
                </button>
              ))}
            </div>
          </div>

          {/* 품목 */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">품목 *</label>
            <select value={form.item_id}
              onChange={e => setForm(f => ({ ...f, item_id: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.item_name} ({i.item_code})</option>
              ))}
            </select>
            {selectedItem && (
              <div className="text-[10px] text-slate-500 mt-1 flex gap-3">
                <span>현재: <span className="text-white font-mono">{selectedItem.current_qty.toLocaleString()} {selectedItem.unit}</span></span>
                <span>안전: <span className="text-amber-400 font-mono">{selectedItem.safety_qty.toLocaleString()} {selectedItem.unit}</span></span>
              </div>
            )}
          </div>

          {/* 수량 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                수량 * {form.tx_type === "재고조정" && <span className="text-slate-500">(음수 입력 가능)</span>}
              </label>
              <input type="number" value={form.qty || ""}
                onChange={e => setForm(f => ({ ...f, qty: Number(e.target.value) }))}
                placeholder={form.tx_type === "재고조정" ? "-10 또는 +10" : "0"}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">참조번호</label>
              <input type="text" value={form.ref_no}
                onChange={e => setForm(f => ({ ...f, ref_no: e.target.value }))}
                placeholder="발주번호·수주번호" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          {/* 담당자 + 비고 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">담당자 *</label>
              <input type="text" value={form.created_by}
                onChange={e => setForm(f => ({ ...f, created_by: e.target.value }))}
                placeholder="홍길동" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">비고</label>
              <input type="text" value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="메모" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          {/* 변경 후 재고 미리보기 */}
          {selectedItem && form.qty !== 0 && (
            <div className="bg-slate-800/60 border border-slate-600 rounded-lg px-3 py-2.5 flex justify-between text-xs">
              <span className="text-slate-500">변경 후 재고</span>
              <span className={`font-mono font-semibold ${
                selectedItem.current_qty + (form.tx_type === "출고" ? -form.qty : form.qty) < selectedItem.safety_qty
                  ? "text-red-400" : "text-emerald-400"
              }`}>
                {(selectedItem.current_qty + (form.tx_type === "출고" ? -form.qty : form.qty)).toLocaleString()} {selectedItem.unit}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-700">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors">취소</button>
          <button onClick={() => isValid && onSave(form.item_id, form)} disabled={!isValid}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-3.5 h-3.5" /> 등록
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ────────────────────────────────────────────────
export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INIT_ITEMS);
  const [transactions, setTransactions] = useState<Transaction[]>(INIT_TRANSACTIONS);
  const [filterCat, setFilterCat] = useState<ItemCategory | "전체">("전체");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"stock" | "history">("stock");
  const [showTxModal, setShowTxModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();
  const [txType, setTxType] = useState<TxType>("입고");
  const [showAlertOnly, setShowAlertOnly] = useState(false);
  const [txNextId, setTxNextId] = useState(INIT_TRANSACTIONS.length + 1);

  // 재고 경보 품목
  const alertItems = useMemo(() => items.filter(i => stockStatus(i) !== "ok"), [items]);

  // 필터된 품목
  const filteredItems = useMemo(() => {
    return items.filter(i => {
      if (filterCat !== "전체" && i.category !== filterCat) return false;
      if (showAlertOnly && stockStatus(i) === "ok") return false;
      if (search && !`${i.item_code}${i.item_name}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filterCat, search, showAlertOnly]);

  // 집계
  const stats = useMemo(() => ({
    totalItems:  items.length,
    alertCount:  alertItems.length,
    totalValue:  items.reduce((s, i) => s + i.current_qty * i.unit_cost, 0),
    categoryBreakdown: CATEGORIES.map(c => ({
      cat: c,
      count: items.filter(i => i.category === c).length,
      value: items.filter(i => i.category === c).reduce((s, i) => s + i.current_qty * i.unit_cost, 0),
    })),
  }), [items, alertItems]);

  const handleTxSave = useCallback((itemId: number, tx: Omit<Transaction, "id" | "item_name" | "created_at">) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const delta = tx.tx_type === "출고" ? -tx.qty : tx.qty;
    const newTx: Transaction = {
      ...tx,
      id: txNextId,
      item_name: item.item_name,
      created_at: new Date().toLocaleString("ko-KR").replace(". ", "-").replace(". ", "-").replace(". ", ""),
    };
    setTransactions(prev => [newTx, ...prev]);
    setItems(prev => prev.map(i => i.id === itemId
      ? { ...i, current_qty: Math.max(0, i.current_qty + delta), last_updated: new Date().toISOString().slice(0, 10) }
      : i
    ));
    setTxNextId(n => n + 1);
    setShowTxModal(false);
  }, [items, txNextId]);

  const openTx = (itemId: number, type: TxType) => {
    setSelectedItemId(itemId);
    setTxType(type);
    setShowTxModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-5">

      {/* ── 헤더 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">재고 관리</h1>
          <p className="text-slate-500 text-sm mt-0.5">원자재 · 반제품 · 완제품 재고 현황 및 입출고 관리</p>
        </div>
        <button
          onClick={() => { setSelectedItemId(undefined); setTxType("입고"); setShowTxModal(true); }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> 입출고 등록
        </button>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card border border-amber-500/30">
          <span className="text-xs text-slate-500 uppercase tracking-wide">총 품목수</span>
          <span className="text-2xl font-bold font-mono text-amber-300 block mt-1">{stats.totalItems}종</span>
        </div>
        <div className={`card border ${stats.alertCount > 0 ? "border-red-500/40" : "border-emerald-500/30"}`}>
          <span className="text-xs text-slate-500 uppercase tracking-wide">재고 경보</span>
          <span className={`text-2xl font-bold font-mono ${stats.alertCount > 0 ? "text-red-400" : "text-emerald-400"} block mt-1`}>
            {stats.alertCount}품목
          </span>
          <span className="text-xs text-slate-500">안전재고 하회</span>
        </div>
        <div className="card border border-cyan-500/30">
          <span className="text-xs text-slate-500 uppercase tracking-wide">재고 총액</span>
          <span className="text-2xl font-bold font-mono text-cyan-300 block mt-1">{formatKRW(stats.totalValue)}</span>
        </div>
        <div className="card border border-amber-500/30">
          <span className="text-xs text-slate-500 uppercase tracking-wide">이번달 입출고</span>
          <span className="text-xl font-bold font-mono text-amber-300 block mt-1">
            {transactions.filter(t => t.created_at.startsWith("2026-03")).length}건
          </span>
        </div>
      </div>

      {/* ── 재고 경보 배너 ── */}
      {alertItems.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-300">재고 경보 — {alertItems.length}개 품목 안전재고 하회</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertItems.map(i => (
              <button key={i.id} onClick={() => openTx(i.id, "입고")}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors hover:opacity-80 ${
                  stockStatus(i) === "danger"
                    ? "bg-red-500/20 border-red-500/40 text-red-300"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                }`}>
                {i.item_name}: <span className="font-mono">{i.current_qty.toLocaleString()}/{i.safety_qty.toLocaleString()} {i.unit}</span>
                <span className="ml-1.5 text-[10px]">→ 발주</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 탭 ── */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 w-fit">
        {(["stock", "history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            {t === "stock" ? "재고 현황" : "입출고 이력"}
          </button>
        ))}
      </div>

      {tab === "stock" && (
        <>
          {/* 필터 */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1">
              {(["전체", ...CATEGORIES] as const).map(c => {
                const count = c === "전체" ? items.length : items.filter(i => i.category === c).length;
                return (
                  <button key={c} onClick={() => setFilterCat(c as typeof filterCat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterCat === c ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                    }`}>
                    {c} ({count})
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAlertOnly(!showAlertOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  showAlertOnly ? "bg-red-500/20 border-red-500/40 text-red-400" : "border-slate-700 text-slate-400 hover:text-white"
                }`}>
                <AlertTriangle className="w-3 h-3" />
                경보만
              </button>
              <div className="relative w-48">
                <Search className="w-3 h-3 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="품목 검색"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          </div>

          {/* 재고 테이블 */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300 border-collapse min-w-[800px]">
                <thead>
                  <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700 text-left">
                    <th className="py-2.5 px-3">품목코드</th>
                    <th className="py-2.5 px-3">품목명</th>
                    <th className="py-2.5 px-3 text-center">분류</th>
                    <th className="py-2.5 px-3 text-right">현재고</th>
                    <th className="py-2.5 px-3 text-right">안전재고</th>
                    <th className="py-2.5 px-3 text-center">재고수준</th>
                    <th className="py-2.5 px-3 text-right">재고금액</th>
                    <th className="py-2.5 px-3 text-center">위치</th>
                    <th className="py-2.5 px-3 text-center">최근변경</th>
                    <th className="py-2.5 px-3 text-center">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr><td colSpan={10} className="text-center py-12 text-slate-500">조회된 품목이 없습니다.</td></tr>
                  ) : filteredItems.map(i => {
                    const s = stockStatus(i);
                    const rowColor = s === "danger" ? "bg-red-500/5" : s === "warning" ? "bg-amber-500/5" : "";
                    return (
                      <tr key={i.id} className={`border-b border-slate-700/40 hover:bg-slate-700/15 transition-colors ${rowColor}`}>
                        <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{i.item_code}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            {s !== "ok" && <AlertTriangle className={`w-3 h-3 shrink-0 ${s === "danger" ? "text-red-400" : "text-amber-400"}`} />}
                            <span className="text-slate-200 font-medium">{i.item_name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            i.category === "원자재" ? "bg-amber-600/20 text-amber-400"
                            : i.category === "완제품" ? "bg-emerald-500/20 text-emerald-400"
                            : i.category === "반제품" ? "bg-purple-500/20 text-purple-400"
                            : "bg-slate-500/20 text-slate-400"
                          }`}>{i.category}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                          {i.current_qty.toLocaleString()} <span className="text-slate-500 font-normal">{i.unit}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                          {i.safety_qty.toLocaleString()} <span className="text-slate-600">{i.unit}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 bg-slate-700/50 rounded-full h-1.5 min-w-[60px]">
                              <div className={`h-1.5 rounded-full ${
                                s === "danger" ? "bg-red-500" : s === "warning" ? "bg-amber-500" : "bg-emerald-500"
                              } transition-all duration-700`}
                                style={{ width: `${Math.min((i.current_qty / (i.safety_qty * 2)) * 100, 100)}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-semibold ${
                              s === "danger" ? "text-red-400" : s === "warning" ? "text-amber-400" : "text-emerald-400"
                            }`}>
                              {s === "danger" ? "위험" : s === "warning" ? "주의" : "정상"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-cyan-300">{formatKRW(i.current_qty * i.unit_cost)}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{i.location}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{i.last_updated}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => openTx(i.id, "입고")}
                              className="p-1.5 rounded-lg hover:bg-emerald-600/20 text-emerald-400/60 hover:text-emerald-400 transition-colors" title="입고">
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button onClick={() => openTx(i.id, "출고")}
                              className="p-1.5 rounded-lg hover:bg-red-600/20 text-red-400/60 hover:text-red-400 transition-colors" title="출고">
                              <ArrowUp className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 카테고리별 재고 가치 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.categoryBreakdown.map(({ cat, count, value }) => (
              <div key={cat} className="card text-center py-3">
                <div className={`text-xs font-semibold mb-1 ${
                  cat === "원자재" ? "text-amber-400" : cat === "완제품" ? "text-emerald-400"
                  : cat === "반제품" ? "text-purple-400" : "text-slate-400"
                }`}>{cat}</div>
                <div className="text-lg font-bold font-mono text-white">{count}종</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">{formatKRW(value)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">입출고 이력</span>
            <span className="text-xs text-slate-500">최근 {transactions.length}건</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 border-collapse min-w-[700px]">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700 text-left">
                  <th className="py-2.5 px-3">일시</th>
                  <th className="py-2.5 px-3">품목</th>
                  <th className="py-2.5 px-3 text-center">구분</th>
                  <th className="py-2.5 px-3 text-right">수량</th>
                  <th className="py-2.5 px-3">참조번호</th>
                  <th className="py-2.5 px-3">비고</th>
                  <th className="py-2.5 px-3 text-center">담당자</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-700/40 hover:bg-slate-700/15">
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{t.created_at}</td>
                    <td className="py-2.5 px-3 text-slate-200">{t.item_name}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.tx_type === "입고" ? "bg-emerald-500/20 text-emerald-400"
                        : t.tx_type === "출고" ? "bg-red-500/20 text-red-400"
                        : "bg-amber-600/20 text-amber-400"
                      }`}>{t.tx_type}</span>
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono font-semibold ${
                      t.tx_type === "입고" ? "text-emerald-400" : t.tx_type === "출고" ? "text-red-400" : "text-amber-400"
                    }`}>
                      {t.tx_type === "출고" ? "-" : "+"}{Math.abs(t.qty).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{t.ref_no || "-"}</td>
                    <td className="py-2.5 px-3 text-slate-400">{t.note || "-"}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{t.created_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTxModal && (
        <TxModal
          items={items}
          onClose={() => setShowTxModal(false)}
          onSave={handleTxSave}
          defaultItemId={selectedItemId}
          defaultType={txType}
        />
      )}
    </div>
  );
}
