"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  salesApi,
  SalesPerformanceRow,
  formatKRW,
  formatKRWFull,
  getCurrentYearMonth,
  getAchievementStatus,
} from "@/lib/erp-api";

// ── 고객사 실적 카드 ──────────────────────────────────────────
function CustomerCard({ row }: { row: SalesPerformanceRow }) {
  const ach = row.achievement_pct ?? 0;
  const status = getAchievementStatus(ach);
  const color =
    status === "good" ? "emerald" : status === "over" ? "cyan" : status === "warning" ? "amber" : "red";
  const barColor =
    status === "good" ? "bg-emerald-500" : status === "over" ? "bg-cyan-500"
    : status === "warning" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{row.customer_name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{row.year_month}</p>
        </div>
        <span className={`text-xl font-bold font-mono text-${color}-300`}>
          {ach.toFixed(1)}%
        </span>
      </div>

      {/* 진척 바 */}
      <div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${Math.min(ach, 100)}%`, transition: "width 0.7s" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/60 rounded-lg px-2.5 py-2">
          <p className="text-slate-500">매출 목표</p>
          <p className="text-slate-300 font-mono font-semibold mt-0.5">{formatKRW(row.sales_target)}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg px-2.5 py-2">
          <p className="text-slate-500">실 매출</p>
          <p className="text-white font-mono font-semibold mt-0.5">{formatKRW(row.actual_sales)}</p>
        </div>
      </div>

      {row.gap_amount !== undefined && (
        <div className={`text-xs px-2.5 py-1.5 rounded-lg ${
          (row.gap_amount ?? 0) >= 0 ? "bg-emerald-900/20 text-emerald-400" : "bg-red-900/20 text-red-400"
        }`}>
          격차: {(row.gap_amount ?? 0) >= 0 ? "+" : ""}{formatKRW(row.gap_amount)}
        </div>
      )}
    </div>
  );
}

// ── HKMC OEM 진도 테이블 ──────────────────────────────────────
interface HkmcRow {
  id: number;
  model_code: string;
  model_name: string;
  target_volume: number;
  current_volume: number;
  progress_pct: number;
  status: string;
  target_date: string;
  remarks: string;
}

function HkmcTable({ rows }: { rows: HkmcRow[] }) {
  if (!rows.length)
    return <p className="text-center text-slate-500 text-sm py-8">OEM 진도 데이터 없음</p>;

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      on_track: "badge-success",
      delayed: "badge-danger",
      completed: "badge-info",
      planning: "badge-warning",
    };
    const labels: Record<string, string> = {
      on_track: "정상", delayed: "지연", completed: "완료", planning: "계획",
    };
    return (
      <span className={`badge ${map[s] ?? "badge-info"} text-[10px]`}>
        {labels[s] ?? s}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-slate-300 border-collapse">
        <thead>
          <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700">
            <th className="py-2 px-3 text-left">모델</th>
            <th className="py-2 px-3 text-left">모델명</th>
            <th className="py-2 px-3 text-right">목표수량</th>
            <th className="py-2 px-3 text-right">현재수량</th>
            <th className="py-2 px-3 text-center w-40">진도</th>
            <th className="py-2 px-3 text-center">상태</th>
            <th className="py-2 px-3 text-left">목표일</th>
            <th className="py-2 px-3 text-left">비고</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
              <td className="py-3 px-3 font-bold text-amber-300">{r.model_code}</td>
              <td className="py-3 px-3 font-medium text-white">{r.model_name}</td>
              <td className="py-3 px-3 text-right font-mono">{r.target_volume.toLocaleString()}</td>
              <td className="py-3 px-3 text-right font-mono text-cyan-300">{r.current_volume.toLocaleString()}</td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        r.status === "completed" ? "bg-cyan-500"
                        : r.status === "delayed" ? "bg-red-500"
                        : "bg-amber-600"
                      }`}
                      style={{ width: `${Math.min(r.progress_pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
                    {r.progress_pct?.toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-3 text-center">{statusBadge(r.status)}</td>
              <td className="py-3 px-3 text-slate-400">{r.target_date}</td>
              <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── 연간 목표 대비 게이지 ─────────────────────────────────────
function AnnualTarget({ rows }: { rows: SalesPerformanceRow[] }) {
  const ANNUAL_TARGET = 25_400_000_000; // 254억
  const totalActual = rows.reduce((s, r) => s + (r.actual_sales ?? 0), 0);
  const pct = (totalActual / ANNUAL_TARGET) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">2026년 연간 매출 목표</h2>
        <span className="text-xs text-slate-500">목표: 254억원</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="w-full bg-slate-700/50 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-500">
            <span>0</span>
            <span>254억원</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold font-mono text-cyan-300">{pct.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">{formatKRWFull(totalActual)}</p>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function SalesPage() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [salesRows, setSalesRows] = useState<SalesPerformanceRow[]>([]);
  const [hkmcRows, setHkmcRows] = useState<HkmcRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"performance" | "hkmc">("performance");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, h] = await Promise.all([
        salesApi.getPerformance(yearMonth),
        salesApi.getHkmcProgress(),
      ]);
      setSalesRows(s.items ?? s);
      setHkmcRows(h.items ?? h);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [yearMonth]);

  useEffect(() => { load(); }, [load]);

  const shiftMonth = (delta: number) => {
    const [y, m] = yearMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta);
    setYearMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const totalTarget = salesRows.reduce((s, r) => s + (r.sales_target ?? 0), 0);
  const totalActual = salesRows.reduce((s, r) => s + (r.actual_sales ?? 0), 0);
  const overallAch = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
  const hkmcOnTrack = hkmcRows.filter((r) => r.status === "on_track" || r.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">영업 실적 관리</h1>
          <p className="text-slate-500 text-sm mt-0.5">고객사별 매출 실적 · HKMC OEM 진도</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-1 py-1">
          <button onClick={() => shiftMonth(-1)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">‹</button>
          <input type="month" value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="bg-transparent border-none text-white text-sm font-medium px-2 focus:outline-none" />
          <button onClick={() => shiftMonth(1)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">›</button>
        </div>
      </div>

      {/* 연간 목표 대비 */}
      <AnnualTarget rows={salesRows} />

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "월 매출 달성률", value: `${overallAch.toFixed(1)}%`, sub: "전 고객사 합계", color: overallAch >= 100 ? "emerald" : overallAch >= 80 ? "amber" : "red" },
          { label: "실 매출 합계", value: formatKRW(totalActual), sub: yearMonth, color: "cyan" },
          { label: "HKMC OEM", value: `${hkmcOnTrack}/${hkmcRows.length}`, sub: "정상 진행 모델", color: "blue" },
          { label: "고객사 수", value: `${salesRows.length}개사`, sub: "활성 거래처", color: "purple" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`card border border-${color}-500/30`}>
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
            <span className={`text-xl font-bold font-mono text-${color}-300 block mt-1`}>{value}</span>
            <span className="text-xs text-slate-500">{sub}</span>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 w-fit">
        {(["performance", "hkmc"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}>
            {t === "performance" ? "고객사별 실적" : "HKMC OEM 진도"}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {tab === "performance" ? (
        loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="card h-40 animate-pulse bg-slate-800/40" />)}
          </div>
        ) : salesRows.length === 0 ? (
          <div className="card text-center py-16 text-slate-500">{yearMonth} 영업 데이터가 없습니다.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {salesRows.map((row, i) => <CustomerCard key={i} row={row} />)}
            </div>

            {/* 누계 테이블 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white mb-4">고객사별 실적 요약</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="text-slate-500 uppercase tracking-wide border-b border-slate-700">
                      <th className="py-2 px-3 text-left">고객사</th>
                      <th className="py-2 px-3 text-right">목표</th>
                      <th className="py-2 px-3 text-right">실적</th>
                      <th className="py-2 px-3 text-right">달성률</th>
                      <th className="py-2 px-3 text-right">격차</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesRows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-700/40 hover:bg-slate-700/20">
                        <td className="py-2.5 px-3 font-medium text-white">{r.customer_name}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">{formatKRW(r.sales_target)}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatKRW(r.actual_sales)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`font-semibold ${
                            (r.achievement_pct ?? 0) >= 100 ? "text-emerald-400"
                            : (r.achievement_pct ?? 0) >= 80 ? "text-amber-400" : "text-red-400"
                          }`}>{r.achievement_pct?.toFixed(1)}%</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          <span className={(r.gap_amount ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {(r.gap_amount ?? 0) >= 0 ? "+" : ""}{formatKRW(r.gap_amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-slate-600 font-semibold bg-slate-800/50">
                      <td className="py-2.5 px-3 text-white">합 계</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatKRW(totalTarget)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-cyan-300">{formatKRW(totalActual)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-semibold ${overallAch >= 100 ? "text-emerald-400" : overallAch >= 80 ? "text-amber-400" : "text-red-400"}`}>
                          {overallAch.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span className={(totalActual - totalTarget) >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {(totalActual - totalTarget) >= 0 ? "+" : ""}{formatKRW(totalActual - totalTarget)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">HKMC OEM 모델별 진도 현황</h2>
            <div className="flex gap-2 text-xs text-slate-500">
              <span>LX3 · MX5 · CN7 등</span>
            </div>
          </div>
          <HkmcTable rows={hkmcRows} />
        </div>
      )}
    </div>
  );
}
