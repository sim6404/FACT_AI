"use client";

import React from "react";
import {
  PurchaseAnalysisRow,
  formatKRW,
  formatKRWFull,
  getAchievementStatus,
} from "@/lib/erp-api";

interface Props {
  rows: PurchaseAnalysisRow[];
  loading?: boolean;
}

const WEEK_LABELS = ["1주차", "2주차", "3주차", "4주차", "5주차"];

function AchievementBadge({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-slate-500">-</span>;
  const status = getAchievementStatus(value);
  const cls =
    status === "over"
      ? "text-red-400"
      : status === "good"
      ? "text-emerald-400"
      : status === "warning"
      ? "text-amber-400"
      : "text-slate-400";
  return <span className={`font-semibold ${cls}`}>{value.toFixed(1)}%</span>;
}

export default function PurchaseAnalysisTable({ rows, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        데이터 로딩 중...
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        해당 기간의 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full text-xs text-slate-300 border-collapse min-w-[1600px]">
        <thead>
          <tr className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wide">
            <th rowSpan={2} className="px-3 py-3 text-left border-b border-r border-slate-700 sticky left-0 bg-slate-800/90 z-10 min-w-[120px]">
              공급업체
            </th>
            <th rowSpan={2} className="px-3 py-3 text-left border-b border-r border-slate-700 min-w-[100px]">
              품목
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px]">
              목표매출
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[70px]">
              표준매입<br />비율
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px]">
              표준매입액
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px] bg-blue-900/20">
              목표매입액<br /><span className="text-blue-400">(75%)</span>
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px]">
              실매출
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[70px]">
              달성%
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px]">
              전월재고
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-r border-slate-700 min-w-[90px]">
              이월
            </th>
            <th colSpan={5} className="px-3 py-2 text-center border-b border-r border-slate-700 bg-indigo-900/20">
              주차별 매입
            </th>
            <th rowSpan={2} className="px-3 py-3 text-right border-b border-slate-700 min-w-[90px] bg-cyan-900/20">
              합계
            </th>
          </tr>
          <tr className="bg-slate-800/60 text-slate-500 text-[10px]">
            {WEEK_LABELS.map((w) => (
              <th key={w} className="px-2 py-2 text-right border-b border-r border-slate-700 min-w-[80px]">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
            >
              {/* 공급업체 */}
              <td className="px-3 py-2.5 sticky left-0 bg-[#1e293b] z-10 font-medium text-white border-r border-slate-700/50">
                {row.supplier_name ?? "-"}
              </td>
              {/* 품목 */}
              <td className="px-3 py-2.5 border-r border-slate-700/50 text-slate-300">
                {row.product_line_name ?? "-"}
              </td>
              {/* 목표매출 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono">
                {formatKRW(row.sales_target)}
              </td>
              {/* 표준매입비율 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 text-slate-400">
                {row.std_purchase_ratio != null ? `${row.std_purchase_ratio}%` : "-"}
              </td>
              {/* 표준매입액 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono text-slate-400">
                {formatKRW(row.std_purchase_amt)}
              </td>
              {/* 목표매입액 75% */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono font-semibold text-blue-300 bg-blue-900/10">
                {formatKRW(row.purchase_target_75)}
              </td>
              {/* 실매출 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono">
                {formatKRW(row.actual_sales)}
              </td>
              {/* 달성% */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50">
                <AchievementBadge value={row.purchase_achievement} />
              </td>
              {/* 전월재고 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono text-slate-400">
                {formatKRW(row.prev_stock_amt)}
              </td>
              {/* 이월 */}
              <td className="px-3 py-2.5 text-right border-r border-slate-700/50 font-mono text-slate-400">
                {formatKRW(row.carryover_amt)}
              </td>
              {/* 주차별 */}
              {[
                row.week1_purchase,
                row.week2_purchase,
                row.week3_purchase,
                row.week4_purchase,
                row.week5_purchase,
              ].map((v, wi) => (
                <td key={wi} className="px-2 py-2.5 text-right border-r border-slate-700/50 font-mono text-slate-300">
                  {v ? formatKRW(v) : <span className="text-slate-600">-</span>}
                </td>
              ))}
              {/* 합계 */}
              <td className="px-3 py-2.5 text-right font-mono font-semibold text-cyan-300 bg-cyan-900/10">
                {formatKRW(row.total_purchase)}
              </td>
            </tr>
          ))}
        </tbody>
        {/* 합계 행 */}
        <tfoot>
          <tr className="bg-slate-800/90 font-semibold text-white border-t border-slate-600">
            <td className="px-3 py-3 sticky left-0 bg-slate-800 z-10 border-r border-slate-700" colSpan={2}>
              합 계
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-sm">
              {formatKRW(rows.reduce((s, r) => s + (r.sales_target ?? 0), 0))}
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 text-slate-500">-</td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-slate-400 text-sm">
              {formatKRW(rows.reduce((s, r) => s + (r.std_purchase_amt ?? 0), 0))}
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-blue-300 text-sm bg-blue-900/10">
              {formatKRW(rows.reduce((s, r) => s + (r.purchase_target_75 ?? 0), 0))}
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-sm">
              {formatKRW(rows.reduce((s, r) => s + (r.actual_sales ?? 0), 0))}
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 text-slate-500">-</td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-slate-400 text-sm">
              {formatKRW(rows.reduce((s, r) => s + (r.prev_stock_amt ?? 0), 0))}
            </td>
            <td className="px-3 py-3 text-right border-r border-slate-700 font-mono text-slate-400 text-sm">
              {formatKRW(rows.reduce((s, r) => s + (r.carryover_amt ?? 0), 0))}
            </td>
            {[1, 2, 3, 4, 5].map((w) => (
              <td key={w} className="px-2 py-3 text-right border-r border-slate-700 font-mono text-sm">
                {formatKRW(
                  rows.reduce(
                    (s, r) =>
                      s + ((r[`week${w}_purchase` as keyof PurchaseAnalysisRow] as number) ?? 0),
                    0
                  )
                )}
              </td>
            ))}
            <td className="px-3 py-3 text-right font-mono text-cyan-300 text-sm bg-cyan-900/10">
              {formatKRW(rows.reduce((s, r) => s + (r.total_purchase ?? 0), 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
