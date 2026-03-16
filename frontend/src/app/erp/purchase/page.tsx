"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  purchaseApi,
  PurchaseAnalysisRow,
  PurchaseAnalysisSummary,
  formatKRW,
  getCurrentYearMonth,
  getAchievementStatus,
} from "@/lib/erp-api";
import PurchaseAnalysisTable from "@/components/erp/PurchaseAnalysisTable";

// ── KPI Summary 카드 ──────────────────────────────────────────
function SummaryCard({
  label,
  value,
  sub,
  color = "blue",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "blue" | "cyan" | "emerald" | "amber" | "red";
}) {
  const border = {
    blue: "border-amber-500/40",
    cyan: "border-cyan-500/40",
    emerald: "border-emerald-500/40",
    amber: "border-amber-500/40",
    red: "border-red-500/40",
  }[color];
  const text = {
    blue: "text-amber-300",
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    red: "text-red-300",
  }[color];
  return (
    <div className={`card border ${border} flex flex-col gap-1`}>
      <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-xl font-bold font-mono ${text}`}>{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}

// ── 주차별 입력 모달 ──────────────────────────────────────────
interface WeeklyInputModalProps {
  row: PurchaseAnalysisRow | null;
  yearMonth: string;
  onClose: () => void;
  onSaved: () => void;
}

function WeeklyInputModal({ row, yearMonth, onClose, onSaved }: WeeklyInputModalProps) {
  const [values, setValues] = useState({
    week1_purchase: row?.week1_purchase ?? 0,
    week2_purchase: row?.week2_purchase ?? 0,
    week3_purchase: row?.week3_purchase ?? 0,
    week4_purchase: row?.week4_purchase ?? 0,
    week5_purchase: row?.week5_purchase ?? 0,
    prev_stock_amt: row?.prev_stock_amt ?? 0,
    carryover_amt: row?.carryover_amt ?? 0,
    actual_sales: row?.actual_sales ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!row) return;
    setSaving(true);
    try {
      await purchaseApi.upsert({
        year_month: yearMonth,
        product_line_id: row.product_line_id,
        supplier_id: row.supplier_id,
        sales_target: row.sales_target,
        std_purchase_ratio: row.std_purchase_ratio,
        ...values,
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const weekKeys = [
    "week1_purchase",
    "week2_purchase",
    "week3_purchase",
    "week4_purchase",
    "week5_purchase",
  ] as const;
  const weekLabels = ["1주차", "2주차", "3주차", "4주차", "5주차"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-1">주차별 매입 입력</h3>
        <p className="text-xs text-slate-500 mb-5">
          {row?.supplier_name} — {row?.product_line_name} ({yearMonth})
        </p>

        <div className="space-y-3">
          {/* 기본 정보 */}
          {[
            { key: "actual_sales" as const, label: "실매출 (원)" },
            { key: "prev_stock_amt" as const, label: "전월재고 (원)" },
            { key: "carryover_amt" as const, label: "이월 (원)" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xs text-slate-400 w-28 shrink-0">{label}</label>
              <input
                type="number"
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                value={values[key]}
                onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
              />
            </div>
          ))}

          <hr className="border-slate-700 my-2" />

          {/* 주차별 입력 */}
          {weekKeys.map((key, i) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xs text-slate-400 w-28 shrink-0">{weekLabels[i]} 매입 (원)</label>
              <input
                type="number"
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                value={values[key]}
                onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
              />
            </div>
          ))}

          {/* 합계 미리보기 */}
          <div className="flex items-center gap-3 mt-2 bg-cyan-900/20 border border-cyan-700/30 rounded-lg px-3 py-2">
            <span className="text-xs text-cyan-400 w-28 shrink-0">예상 합계</span>
            <span className="text-sm font-mono font-semibold text-cyan-300">
              {formatKRW(
                weekKeys.reduce((s, k) => s + (values[k] ?? 0), 0) + (values.carryover_amt ?? 0)
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function PurchasePage() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [rows, setRows] = useState<PurchaseAnalysisRow[]>([]);
  const [summary, setSummary] = useState<PurchaseAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<PurchaseAnalysisRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        purchaseApi.getAnalysis(yearMonth),
        purchaseApi.getSummary(yearMonth),
      ]);
      setRows(r.items ?? r);
      setSummary(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [yearMonth]);

  useEffect(() => {
    load();
  }, [load]);

  // 월 이동 헬퍼
  const shiftMonth = (delta: number) => {
    const [y, m] = yearMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta);
    setYearMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  };

  // 달성률 전체 평균
  const avgAchievement =
    rows.length > 0
      ? rows.reduce((s, r) => s + (r.purchase_achievement ?? 0), 0) / rows.length
      : null;

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-6">
      {/* ── 헤더 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">월별 매출대비 매입현황분석</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            목표매입액 = 매출계획 × 표준매입비율 × 75%
          </p>
        </div>

        {/* 월 선택 */}
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-1 py-1">
          <button
            onClick={() => shiftMonth(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            ‹
          </button>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="bg-transparent border-none text-white text-sm font-medium px-2 focus:outline-none"
          />
          <button
            onClick={() => shiftMonth(1)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── KPI 카드 ── */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard
            label="목표 매입액 (75%)"
            value={formatKRW(summary.total_purchase_target_75)}
            sub="표준매입액 × 75%"
            color="blue"
          />
          <SummaryCard
            label="실제 매입 합계"
            value={formatKRW(summary.total_actual_purchase)}
            sub="이월 포함 누계"
            color="cyan"
          />
          <SummaryCard
            label="평균 달성률"
            value={
              avgAchievement != null ? `${avgAchievement.toFixed(1)}%` : "-"
            }
            sub="전 공급업체 평균"
            color={
              avgAchievement == null
                ? "blue"
                : avgAchievement >= 100
                ? "red"
                : avgAchievement >= 80
                ? "emerald"
                : avgAchievement >= 60
                ? "amber"
                : "red"
            }
          />
          <SummaryCard
            label="참여 공급업체"
            value={`${summary.supplier_count ?? rows.length}개사`}
            sub={`${yearMonth} 기준`}
            color="emerald"
          />
        </div>
      )}

      {/* ── 달성률 바 ── */}
      {rows.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            공급업체별 달성률
          </h2>
          <div className="space-y-2">
            {rows.map((row, i) => {
              const pct = Math.min(row.purchase_achievement ?? 0, 120);
              const status = getAchievementStatus(row.purchase_achievement);
              const barColor =
                status === "over"
                  ? "bg-red-500"
                  : status === "good"
                  ? "bg-emerald-500"
                  : status === "warning"
                  ? "bg-amber-500"
                  : "bg-slate-600";
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-24 shrink-0 truncate">
                    {row.supplier_name}
                  </span>
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${pct / 1.2}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-300 w-12 text-right">
                    {row.purchase_achievement != null
                      ? `${row.purchase_achievement.toFixed(1)}%`
                      : "-"}
                  </span>
                  <button
                    onClick={() => setEditRow(row)}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                  >
                    입력
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 메인 테이블 ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            {yearMonth} 매입현황 상세
          </h2>
          <div className="flex gap-2">
            <span className="badge-info text-xs">총 {rows.length}행</span>
            <button
              onClick={load}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              ↻ 새로고침
            </button>
          </div>
        </div>
        <PurchaseAnalysisTable rows={rows} loading={loading} />
      </div>

      {/* ── 범례 ── */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          달성률 80~100% (양호)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          달성률 60~80% (주의)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          달성률 100% 초과 또는 60% 미만
        </span>
        <span className="ml-auto">
          * 목표매입액 = 매출계획 × 표준매입비율 × 75%
        </span>
      </div>

      {/* ── 주차별 입력 모달 ── */}
      {editRow && (
        <WeeklyInputModal
          row={editRow}
          yearMonth={yearMonth}
          onClose={() => setEditRow(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
