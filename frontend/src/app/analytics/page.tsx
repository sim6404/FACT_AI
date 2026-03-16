"use client";

import { useState } from "react";
import {
  BarChart2, TrendingUp, TrendingDown, RefreshCw,
  Calendar, Download, Filter, ChevronDown,
} from "lucide-react";

type Period = "week" | "month" | "quarter" | "year";

const KPI_DATA = [
  { label: "생산 달성률", value: 94.2, prev: 91.5, unit: "%", trend: "up", color: "text-blue-400" },
  { label: "품질 합격률", value: 98.7, prev: 99.1, unit: "%", trend: "down", color: "text-red-400" },
  { label: "설비 가동률", value: 87.3, prev: 84.2, unit: "%", trend: "up", color: "text-green-400" },
  { label: "납기 준수율", value: 96.1, prev: 95.8, unit: "%", trend: "up", color: "text-purple-400" },
  { label: "재고 회전율", value: 12.4, prev: 11.9, unit: "회", trend: "up", color: "text-amber-400" },
  { label: "원가 절감률", value: 3.2, prev: 2.8, unit: "%", trend: "up", color: "text-cyan-400" },
];

const MONTHLY_PROD = [
  { month: "10월", plan: 1800, actual: 1720, rate: 95.6 },
  { month: "11월", plan: 1900, actual: 1850, rate: 97.4 },
  { month: "12월", plan: 2000, actual: 1880, rate: 94.0 },
  { month: "1월", plan: 1700, actual: 1590, rate: 93.5 },
  { month: "2월", plan: 1600, actual: 1530, rate: 95.6 },
  { month: "3월", plan: 2100, actual: 1978, rate: 94.2 },
];

const DEPT_QUALITY = [
  { dept: "기계 1팀", total: 4820, pass: 4762, fail: 58, rate: 98.8 },
  { dept: "기계 2팀", total: 3910, pass: 3854, fail: 56, rate: 98.6 },
  { dept: "전장 팀", total: 2340, pass: 2298, fail: 42, rate: 98.2 },
  { dept: "조립 팀", total: 5620, pass: 5545, fail: 75, rate: 98.7 },
  { dept: "도장 팀", total: 1870, pass: 1832, fail: 38, rate: 97.9 },
];

const TOP_DEFECTS = [
  { type: "치수 불량", count: 98, pct: 36.3 },
  { type: "표면 결함", count: 67, pct: 24.8 },
  { type: "조립 불량", count: 54, pct: 20.0 },
  { type: "도장 불량", count: 32, pct: 11.9 },
  { type: "기타", count: 19, pct: 7.0 },
];

const INVENTORY_STATUS = [
  { category: "원자재", amount: 1_240_000_000, target: 1_100_000_000, pct: 113 },
  { category: "재공품", amount: 680_000_000, target: 700_000_000, pct: 97 },
  { category: "완제품", amount: 920_000_000, target: 850_000_000, pct: 108 },
  { category: "부품", amount: 340_000_000, target: 360_000_000, pct: 94 },
];

function fmtAmt(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}십억`;
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`;
  if (v >= 10_000) return `${(v / 10_000).toFixed(0)}만`;
  return v.toLocaleString();
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeTab, setActiveTab] = useState<"production" | "quality" | "inventory">("production");

  const maxProd = Math.max(...MONTHLY_PROD.map(d => d.plan));
  const maxDefect = Math.max(...TOP_DEFECTS.map(d => d.count));

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">분석 대시보드</h1>
          <p className="text-slate-400 text-sm mt-1">제조 핵심 지표 종합 분석</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg p-1" style={{ background: '#1e1e1e', border: '1px solid #383838' }}>
            {(["week", "month", "quarter", "year"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  period === p ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {p === "week" ? "주간" : p === "month" ? "월간" : p === "quarter" ? "분기" : "연간"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm border border-slate-700">
            <Download size={14} /> 보고서
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
            <RefreshCw size={14} /> 새로고침
          </button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_DATA.map((kpi) => {
          const diff = kpi.value - kpi.prev;
          const isUp = kpi.trend === "up";
          return (
            <div key={kpi.label} className="card rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>
                {kpi.value}{kpi.unit}
              </p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{diff > 0 ? "+" : ""}{diff.toFixed(1)}{kpi.unit} 전월比</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 rounded-lg p-1 w-fit" style={{ background: '#1e1e1e', border: '1px solid #383838' }}>
        {[
          { key: "production", label: "생산 현황" },
          { key: "quality", label: "품질 분석" },
          { key: "inventory", label: "재고 현황" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 생산 현황 탭 */}
      {activeTab === "production" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 월별 생산 차트 */}
          <div className="lg:col-span-2 card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-400" />
              월별 생산 실적 (최근 6개월)
            </h3>
            <div className="space-y-4">
              {MONTHLY_PROD.map((d) => (
                <div key={d.month} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{d.month}</span>
                    <span>{d.actual.toLocaleString()} / {d.plan.toLocaleString()}대 ({d.rate}%)</span>
                  </div>
                  <div className="h-5 bg-slate-800 rounded-full overflow-hidden relative">
                    {/* 계획 */}
                    <div
                      className="absolute inset-y-0 left-0 bg-slate-600 rounded-full"
                      style={{ width: `${(d.plan / maxProd) * 100}%` }}
                    />
                    {/* 실적 */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${d.rate >= 95 ? "bg-blue-500" : "bg-amber-500"}`}
                      style={{ width: `${(d.actual / maxProd) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1"><span className="w-3 h-2 bg-slate-600 rounded-sm inline-block" /> 계획</div>
              <div className="flex items-center gap-1"><span className="w-3 h-2 bg-blue-500 rounded-sm inline-block" /> 실적 ≥95%</div>
              <div className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-500 rounded-sm inline-block" /> 실적 &lt;95%</div>
            </div>
          </div>

          {/* 부서별 품질 */}
          <div className="card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">부서별 품질 합격률</h3>
            <div className="space-y-3">
              {DEPT_QUALITY.map((d) => (
                <div key={d.dept} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{d.dept}</span>
                    <span className={d.rate >= 98.5 ? "text-green-400" : "text-amber-400"}>{d.rate}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.rate >= 98.5 ? "bg-green-500" : "bg-amber-500"}`}
                      style={{ width: `${(d.rate - 95) * 20}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">불량 {d.fail}건 / {d.total.toLocaleString()}건</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 품질 분석 탭 */}
      {activeTab === "quality" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 불량 유형 */}
          <div className="card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-5">불량 유형 분포 (파레토)</h3>
            <div className="space-y-3">
              {TOP_DEFECTS.map((d, i) => (
                <div key={d.type} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{d.type}</span>
                      <span className="text-slate-400">{d.count}건 ({d.pct}%)</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(d.count / maxDefect) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-400">누적 상위 3개 유형이 전체 불량의 <span className="text-amber-400 font-semibold">81.1%</span>를 차지합니다. 집중 개선 필요.</p>
            </div>
          </div>

          {/* 부서별 상세 */}
          <div className="card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">부서별 품질 상세</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400 text-xs">부서</th>
                    <th className="text-right py-2 text-slate-400 text-xs">생산</th>
                    <th className="text-right py-2 text-slate-400 text-xs">합격</th>
                    <th className="text-right py-2 text-slate-400 text-xs">불량</th>
                    <th className="text-right py-2 text-slate-400 text-xs">합격률</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPT_QUALITY.map((d) => (
                    <tr key={d.dept} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-2 text-slate-300">{d.dept}</td>
                      <td className="py-2 text-right text-slate-300">{d.total.toLocaleString()}</td>
                      <td className="py-2 text-right text-green-400">{d.pass.toLocaleString()}</td>
                      <td className="py-2 text-right text-red-400">{d.fail}</td>
                      <td className="py-2 text-right">
                        <span className={`font-semibold ${d.rate >= 98.5 ? "text-green-400" : "text-amber-400"}`}>
                          {d.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 재고 현황 탭 */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-5">재고 카테고리별 현황</h3>
            <div className="space-y-4">
              {INVENTORY_STATUS.map((inv) => {
                const overTarget = inv.pct > 100;
                return (
                  <div key={inv.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">{inv.category}</span>
                      <span className={overTarget ? "text-amber-400" : "text-green-400"}>
                        {inv.pct}% <span className="text-slate-500 text-xs">(목표比)</span>
                      </span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${overTarget ? "bg-amber-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min(inv.pct, 120)}%` }}
                      />
                      {/* 목표선 */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{ left: "83.3%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>현재: {fmtAmt(inv.amount)}원</span>
                      <span>목표: {fmtAmt(inv.target)}원</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400">원자재 및 완제품 재고가 목표를 초과합니다. 구매 및 출하 계획 검토 권장.</p>
            </div>
          </div>

          <div className="card rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">재고 회전율 추이</h3>
            <div className="space-y-3">
              {[
                { month: "10월", rate: 11.2 },
                { month: "11월", rate: 11.5 },
                { month: "12월", rate: 10.8 },
                { month: "1월", rate: 11.9 },
                { month: "2월", rate: 12.1 },
                { month: "3월", rate: 12.4 },
              ].map((d) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-8">{d.month}</span>
                  <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(d.rate / 14) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{d.rate}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">회</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">목표 회전율</span>
              <span className="text-cyan-400 font-semibold">13.0회</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
