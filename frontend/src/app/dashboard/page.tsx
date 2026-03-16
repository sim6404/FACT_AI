"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  TrendingUp, Package, AlertTriangle, CheckCircle2,
  Clock, Factory, ShoppingCart, Award, Truck,
  ChevronRight, Plus, RefreshCw, Target,
  ArrowUp, ArrowDown, Minus,
} from "lucide-react";

// ── 데모 데이터 ───────────────────────────────────────────────
const DEMO_MONTH = "2026-03";

const DEMO_PRODUCTION_LINES = [
  { line: "A라인", product: "STRW DAMPER", plan: 1200, actual: 1054, oee: 87.8, status: "running" },
  { line: "B라인", product: "HORN PLATE",  plan: 950,  actual: 891,  oee: 73.2, status: "running" },
  { line: "C라인", product: "BUSH (FRONT)", plan: 800,  actual: 624,  oee: 65.5, status: "warning" },
  { line: "D라인", product: "SP2",          plan: 600,  actual: 0,    oee: 0,    status: "stopped" },
];

const DEMO_ORDERS_URGENT = [
  { order_no: "PO-2603-041", customer: "현대자동차", product: "STRW DAMPER", qty: 5000, due_date: "2026-03-15", d_day: 2 },
  { order_no: "PO-2603-038", customer: "기아자동차",  product: "HORN PLATE",  qty: 3200, due_date: "2026-03-17", d_day: 4 },
  { order_no: "PO-2603-035", customer: "GM코리아",    product: "BUSH",        qty: 2400, due_date: "2026-03-20", d_day: 7 },
];

const DEMO_ALERTS = [
  { type: "danger",  icon: "quality",   msg: "C라인 PPM 2,840 — 기준초과 (≥2,000)", time: "18분 전" },
  { type: "warning", icon: "inventory", msg: "천연고무 (NR-40) 재고 부족 — 안전재고 하회", time: "32분 전" },
  { type: "danger",  icon: "quality",   msg: "현대자동차 클레임 접수 — BUSH 변형 불량", time: "1시간 전" },
  { type: "warning", icon: "order",     msg: "PO-2603-033 납기 지연 위험 (D+1)", time: "2시간 전" },
  { type: "info",    icon: "order",     msg: "신규 수주 접수 — 기아자동차 SP2 2,000ea", time: "3시간 전" },
];

const DEMO_KPI = {
  monthly_sales:    { value: 18.4, target: 21.2, unit: "억원", trend: 12.3 },
  prod_achievement: { value: 87.2, target: 100,  unit: "%",    trend: -2.1 },
  open_orders:      { value: 23,   target: null,  unit: "건",   trend: 5 },
  ppm_avg:          { value: 1240, target: 500,   unit: "PPM",  trend: -180 },
  purchase_ach:     { value: 82.5, target: 100,   unit: "%",    trend: 3.2 },
  inventory_alerts: { value: 3,    target: 0,     unit: "품목",  trend: 1 },
};

// 이번달 일별 생산 추이 (1~13일)
const DEMO_DAILY = [980,1010,1050,850,960,1100,1080,990,1040,1150,1020,980,1060];

// ── 유틸 ──────────────────────────────────────────────────────
function dDayBadge(d: number) {
  if (d <= 1) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">D-{d}</span>;
  if (d <= 3) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">D-{d}</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700 text-slate-400">D-{d}</span>;
}

function lineStatusDot(s: string) {
  if (s === "running") return <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />;
  if (s === "warning") return <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />;
  return <span className="w-2 h-2 rounded-full bg-red-400" />;
}

function trendIcon(v: number) {
  if (v > 0) return <ArrowUp   className="w-3 h-3 text-emerald-400" />;
  if (v < 0) return <ArrowDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-slate-500" />;
}

// ── KPI Card ──────────────────────────────────────────────────
function KpiCard({
  label, value, unit, target, trend, color = "blue", icon: Icon, href,
}: {
  label: string; value: number; unit: string; target: number | null;
  trend: number; color?: string; icon: React.ElementType; href: string;
}) {
  const pct = target ? Math.min((value / target) * 100, 130) : null;
  const colorMap: Record<string, string> = {
    blue: "text-amber-300 border-amber-500/30",
    cyan: "text-cyan-300 border-cyan-500/30",
    emerald: "text-emerald-300 border-emerald-500/30",
    amber: "text-amber-300 border-amber-500/30",
    red: "text-red-300 border-red-500/30",
    purple: "text-purple-300 border-purple-500/30",
  };
  const cls = colorMap[color] ?? colorMap.blue;

  return (
    <Link href={href}>
      <div className={`card border ${cls} hover:brightness-110 transition-all cursor-pointer`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-bold font-mono ${cls.split(" ")[0]}`}>
              {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(1) : value.toLocaleString()}
              <span className="text-sm font-normal ml-1 text-slate-400">{unit}</span>
            </p>
          </div>
          <Icon className={`w-5 h-5 ${cls.split(" ")[0]} opacity-60`} />
        </div>
        {pct !== null && (
          <div className="mt-2">
            <div className="w-full bg-slate-700/50 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${color === "red" ? "bg-red-500" : color === "amber" ? "bg-amber-500" : "bg-amber-600"}`}
                style={{ width: `${pct}%`, transition: "width 0.8s ease" }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 mt-1.5">
          {trendIcon(trend)}
          <span className="text-[10px] text-slate-500">
            {trend > 0 ? "+" : ""}{typeof trend === "number" && !Number.isInteger(trend) ? trend.toFixed(1) : trend} 전월비
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── 생산 라인 현황 ─────────────────────────────────────────────
function ProductionLineCard({ line }: { line: typeof DEMO_PRODUCTION_LINES[0] }) {
  const ach = line.plan > 0 ? (line.actual / line.plan) * 100 : 0;
  const barColor = ach >= 90 ? "bg-emerald-500" : ach >= 75 ? "bg-amber-500" : ach > 0 ? "bg-red-500" : "bg-slate-700";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-700/40 last:border-0">
      <div className="flex items-center gap-1.5 w-20 shrink-0">
        {lineStatusDot(line.status)}
        <span className="text-xs font-semibold text-white">{line.line}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
          <span className="truncate">{line.product}</span>
          <span className="font-mono shrink-0 ml-2">{line.actual.toLocaleString()} / {line.plan.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${barColor} transition-all duration-700`} style={{ width: `${Math.min(ach, 100)}%` }} />
        </div>
      </div>
      <div className="text-right w-16 shrink-0">
        <div className={`text-xs font-mono font-semibold ${ach >= 90 ? "text-emerald-400" : ach >= 75 ? "text-amber-400" : ach > 0 ? "text-red-400" : "text-slate-600"}`}>
          {line.status === "stopped" ? "정지" : `${ach.toFixed(0)}%`}
        </div>
        <div className="text-[10px] text-slate-600">OEE {line.oee > 0 ? `${line.oee}%` : "-"}</div>
      </div>
    </div>
  );
}

// ── 알림 아이템 ────────────────────────────────────────────────
function AlertItem({ alert }: { alert: typeof DEMO_ALERTS[0] }) {
  const iconMap: Record<string, React.ElementType> = {
    quality: Award, inventory: Package, order: Truck,
  };
  const Icon = iconMap[alert.icon] ?? AlertTriangle;
  const colorMap: Record<string, string> = {
    danger: "text-red-400 bg-red-500/10 border-red-500/20",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    info: "text-amber-400 bg-amber-600/10 border-amber-500/20",
  };
  const cls = colorMap[alert.type] ?? colorMap.info;

  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${cls} mb-2`}>
      <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${cls.split(" ")[0]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300 leading-relaxed">{alert.msg}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{alert.time}</p>
      </div>
    </div>
  );
}

// ── 일별 생산 미니 차트 ────────────────────────────────────────
function DailyMiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data) * 1.1;
  const labels = data.map((_, i) => `${i + 1}일`);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => {
        const h = (v / max) * 100;
        const isToday = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className={`w-full rounded-t-sm ${isToday ? "bg-amber-600" : "bg-slate-600 group-hover:bg-slate-500"} transition-colors`}
              style={{ height: `${h}%` }}
            />
            {/* tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
              <div className="bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] text-white whitespace-nowrap">
                {labels[i]}: {v.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 메인 대시보드 ──────────────────────────────────────────────
export default function DashboardPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const today = time.toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
  const timeStr = time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  const runningLines = DEMO_PRODUCTION_LINES.filter(l => l.status !== "stopped").length;
  const todayTotal = DEMO_PRODUCTION_LINES.reduce((s, l) => s + l.actual, 0);
  const todayPlan  = DEMO_PRODUCTION_LINES.reduce((s, l) => s + l.plan,   0);

  return (
    <div className="space-y-5 animate-fade-in">

        {/* ── 헤더 ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">운영 현황 대시보드</h1>
            <p className="text-sm text-slate-500 mt-0.5">{today} · {timeStr}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
              가동 라인 <span className="text-emerald-400 font-bold ml-1">{runningLines}/{DEMO_PRODUCTION_LINES.length}</span>
            </span>
            <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
              오늘 생산 <span className="text-amber-400 font-bold font-mono ml-1">{todayTotal.toLocaleString()}ea</span>
            </span>
            <button
              onClick={() => setTime(new Date())}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 transition-colors"
              title="새로고침"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── KPI 6-grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="이번달 매출" value={DEMO_KPI.monthly_sales.value} unit="억원"
            target={DEMO_KPI.monthly_sales.target} trend={DEMO_KPI.monthly_sales.trend}
            color="blue" icon={TrendingUp} href="/erp/sales" />
          <KpiCard label="생산 달성률" value={DEMO_KPI.prod_achievement.value} unit="%"
            target={DEMO_KPI.prod_achievement.target} trend={DEMO_KPI.prod_achievement.trend}
            color="cyan" icon={Factory} href="/erp/production" />
          <KpiCard label="진행 수주" value={DEMO_KPI.open_orders.value} unit="건"
            target={null} trend={DEMO_KPI.open_orders.trend}
            color="purple" icon={Truck} href="/erp/orders" />
          <KpiCard label="평균 PPM" value={DEMO_KPI.ppm_avg.value} unit="PPM"
            target={DEMO_KPI.ppm_avg.target} trend={DEMO_KPI.ppm_avg.trend}
            color={DEMO_KPI.ppm_avg.value >= 2000 ? "red" : DEMO_KPI.ppm_avg.value >= 500 ? "amber" : "emerald"}
            icon={Award} href="/erp/quality" />
          <KpiCard label="매입 달성률" value={DEMO_KPI.purchase_ach.value} unit="%"
            target={DEMO_KPI.purchase_ach.target} trend={DEMO_KPI.purchase_ach.trend}
            color="emerald" icon={ShoppingCart} href="/erp/purchase" />
          <KpiCard label="재고 경보" value={DEMO_KPI.inventory_alerts.value} unit="품목"
            target={null} trend={DEMO_KPI.inventory_alerts.trend}
            color={DEMO_KPI.inventory_alerts.value > 0 ? "red" : "emerald"}
            icon={Package} href="/erp/inventory" />
        </div>

        {/* ── 메인 2-col ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── LEFT 3/5 ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* 생산 라인 현황 */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-semibold text-white">오늘 생산 라인 현황</h2>
                </div>
                <Link href="/erp/production" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  전체 보기 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div>
                {DEMO_PRODUCTION_LINES.map((line, i) => (
                  <ProductionLineCard key={i} line={line} />
                ))}
              </div>

              {/* 전체 달성률 */}
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-500">전체 달성률</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                      style={{ width: `${Math.min((todayTotal / todayPlan) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold font-mono text-cyan-300">
                    {((todayTotal / todayPlan) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 긴급 납기 수주 */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">긴급 납기 수주</h2>
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full font-semibold">
                    D-7 이내 {DEMO_ORDERS_URGENT.length}건
                  </span>
                </div>
                <Link href="/erp/orders" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  수주 관리 <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-700">
                      <th className="py-1.5 px-2 text-left">수주번호</th>
                      <th className="py-1.5 px-2 text-left">고객사</th>
                      <th className="py-1.5 px-2 text-left">품목</th>
                      <th className="py-1.5 px-2 text-right">수량</th>
                      <th className="py-1.5 px-2 text-center">납기일</th>
                      <th className="py-1.5 px-2 text-center">D-Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_ORDERS_URGENT.map((o, i) => (
                      <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-2 px-2 font-mono text-slate-400">{o.order_no}</td>
                        <td className="py-2 px-2 font-medium text-white">{o.customer}</td>
                        <td className="py-2 px-2 text-slate-300">{o.product}</td>
                        <td className="py-2 px-2 text-right font-mono text-slate-300">{o.qty.toLocaleString()}</td>
                        <td className="py-2 px-2 text-center text-slate-400">{o.due_date}</td>
                        <td className="py-2 px-2 text-center">{dDayBadge(o.d_day)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 이번달 일별 생산 추이 */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">이번달 일별 생산 추이</h2>
                  <span className="text-[10px] text-slate-500">{DEMO_MONTH}</span>
                </div>
                <span className="text-xs text-slate-500">일일 목표: <span className="text-white font-mono">1,050ea</span></span>
              </div>
              <DailyMiniChart data={DEMO_DAILY} />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1.5 px-0.5">
                <span>1일</span>
                <span>5일</span>
                <span>10일</span>
                <span className="text-amber-400 font-semibold">오늘(13일)</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT 2/5 ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* 알림 패널 */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">주요 알림</h2>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                  {DEMO_ALERTS.filter(a => a.type === "danger").length} 위험
                </span>
              </div>
              <div>
                {DEMO_ALERTS.map((a, i) => <AlertItem key={i} alert={a} />)}
              </div>
            </div>

            {/* 빠른 작업 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                빠른 작업
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "수주 등록",   href: "/erp/orders",     color: "purple", icon: Truck },
                  { label: "실적 입력",   href: "/erp/production", color: "cyan",   icon: Factory },
                  { label: "불량 등록",   href: "/erp/quality",    color: "red",    icon: Award },
                  { label: "매입 입력",   href: "/erp/purchase",   color: "emerald",icon: ShoppingCart },
                  { label: "재고 확인",   href: "/erp/inventory",  color: "amber",  icon: Package },
                  { label: "매출 현황",   href: "/erp/sales",      color: "blue",   icon: TrendingUp },
                ].map(({ label, href, color, icon: Icon }) => (
                  <Link key={label} href={href}>
                    <div className={`flex items-center gap-2 p-2.5 rounded-xl border border-${color}-500/20 bg-${color}-500/5 hover:bg-${color}-500/10 hover:border-${color}-500/40 transition-all cursor-pointer group`}>
                      <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                      <span className={`text-xs text-${color}-300 group-hover:text-${color}-200`}>{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 이번달 목표 달성 요약 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                이번달 목표 달성
              </h2>
              <div className="space-y-3">
                {[
                  { label: "매출",  value: 18.4, target: 21.2, unit: "억원", pct: 86.8 },
                  { label: "생산",  value: 87.2, target: 100,  unit: "%",    pct: 87.2 },
                  { label: "매입",  value: 82.5, target: 100,  unit: "%",    pct: 82.5 },
                  { label: "PPM",   value: 1240, target: 500,  unit: "",     pct: null, isInverse: true },
                ].map(({ label, value, unit, pct, isInverse }) => {
                  const barPct = pct ?? 0;
                  const color = isInverse
                    ? (value <= 500 ? "emerald" : value <= 2000 ? "amber" : "red")
                    : (barPct >= 90 ? "emerald" : barPct >= 70 ? "amber" : "red");
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{label}</span>
                        <span className={`font-mono font-semibold text-${color}-400`}>
                          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(1) : value.toLocaleString()}{unit}
                          {pct !== null && ` (${pct.toFixed(0)}%)`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-${color}-500 transition-all duration-700`}
                          style={{ width: `${isInverse ? Math.min((500 / value) * 100, 100) : Math.min(barPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오늘 처리 대기 */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                처리 대기
              </h2>
              <div className="space-y-2">
                {[
                  { label: "수주 승인 대기",     count: 3, href: "/erp/orders",     color: "blue" },
                  { label: "미처리 클레임",       count: 2, href: "/erp/quality",    color: "red" },
                  { label: "발주 확인 대기",      count: 1, href: "/erp/purchase",   color: "amber" },
                  { label: "재고 발주 검토",      count: 3, href: "/erp/inventory",  color: "orange" },
                ].map(({ label, count, href, color }) => (
                  <Link key={label} href={href}>
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={`text-xs font-bold font-mono text-${color}-400 bg-${color}-500/10 border border-${color}-500/20 px-2 py-0.5 rounded-full`}>
                        {count}건
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 데모 안내 ── */}
        <div className="text-[10px] text-slate-600 text-center pb-2">
          * 대시보드 데이터는 데모용 샘플입니다. 실제 ERP 데이터 연동 후 자동 갱신됩니다.
        </div>

    </div>
  );
}
