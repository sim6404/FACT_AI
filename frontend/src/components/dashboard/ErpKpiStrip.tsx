"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { purchaseApi, qualityApi, productionApi, salesApi, formatKRW, getCurrentYearMonth } from "@/lib/erp-api";
import { ShoppingCart, Award, Factory, TrendingUp, ArrowRight } from "lucide-react";

interface StripCard {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
  color: string;
  loading?: boolean;
}

function Card({ href, icon, label, primary, secondary, color, loading }: StripCard) {
  return (
    <Link href={href} className="block group">
      <div className={`card border ${color} hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-700/60`}>
            {icon}
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors mt-1" />
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        {loading ? (
          <div className="h-5 w-24 bg-slate-700/60 rounded animate-pulse" />
        ) : (
          <>
            <p className="text-base font-bold text-white font-mono leading-tight">{primary}</p>
            <p className="text-xs text-slate-500 mt-0.5">{secondary}</p>
          </>
        )}
      </div>
    </Link>
  );
}

export function ErpKpiStrip() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    purchaseAch: "-",
    purchaseTarget: "-",
    avgPpm: "-",
    criticalItems: 0,
    oeeAvg: "-",
    productionAch: "-",
    salesAch: "-",
    salesActual: "-",
  });

  useEffect(() => {
    const ym = getCurrentYearMonth();
    Promise.allSettled([
      purchaseApi.getSummary(ym),
      qualityApi.getPpm(ym),
      productionApi.getWeekly({ year_month: ym }),
      salesApi.getPerformance(ym),
    ]).then(([purchase, quality, production, sales]) => {
      const d = { ...data };

      if (purchase.status === "fulfilled") {
        const s = purchase.value;
        d.purchaseTarget = formatKRW(s.total_purchase_target_75);
        const ach = s.total_actual_purchase && s.total_purchase_target_75
          ? (s.total_actual_purchase / s.total_purchase_target_75 * 100).toFixed(1) + "%"
          : "-";
        d.purchaseAch = ach;
      }

      if (quality.status === "fulfilled") {
        const rows: any[] = Array.isArray(quality.value) ? quality.value : (quality.value as any).items;
        const avg = rows.length > 0
          ? rows.reduce((s: number, r: { ppm: number }) => s + (r.ppm ?? 0), 0) / rows.length
          : 0;
        d.avgPpm = avg.toFixed(0);
        d.criticalItems = rows.filter((r: { ppm: number }) => (r.ppm ?? 0) >= 2000).length;
      }

      if (production.status === "fulfilled") {
        const rows: any[] = Array.isArray(production.value) ? production.value : (production.value as any).items;
        const avgOee = rows.length > 0
          ? rows.reduce((s: number, r: { oee: number }) => s + (r.oee ?? 0), 0) / rows.length
          : 0;
        d.oeeAvg = avgOee.toFixed(1) + "%";
        const totalPlan = rows.reduce((s: number, r: { plan_qty: number }) => s + (r.plan_qty ?? 0), 0);
        const totalActual = rows.reduce((s: number, r: { actual_qty: number }) => s + (r.actual_qty ?? 0), 0);
        d.productionAch = totalPlan > 0 ? (totalActual / totalPlan * 100).toFixed(1) + "%" : "-";
      }

      if (sales.status === "fulfilled") {
        const rows: any[] = Array.isArray(sales.value) ? sales.value : (sales.value as any).items;
        const totalTarget = rows.reduce((s: number, r: { sales_target: number }) => s + (r.sales_target ?? 0), 0);
        const totalActual = rows.reduce((s: number, r: { actual_sales: number }) => s + (r.actual_sales ?? 0), 0);
        d.salesAch = totalTarget > 0 ? (totalActual / totalTarget * 100).toFixed(1) + "%" : "-";
        d.salesActual = formatKRW(totalActual);
      }

      setData(d);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards: StripCard[] = [
    {
      href: "/erp/purchase",
      icon: <ShoppingCart className="w-4 h-4 text-blue-400" />,
      label: "매입 달성률",
      primary: data.purchaseAch,
      secondary: `목표 ${data.purchaseTarget}`,
      color: "border-blue-500/25",
      loading,
    },
    {
      href: "/erp/quality",
      icon: <Award className="w-4 h-4 text-amber-400" />,
      label: "평균 PPM",
      primary: data.avgPpm === "-" ? "-" : Number(data.avgPpm).toLocaleString(),
      secondary: `위험품목 ${data.criticalItems}개`,
      color: data.criticalItems > 0 ? "border-red-500/25" : "border-amber-500/25",
      loading,
    },
    {
      href: "/erp/production",
      icon: <Factory className="w-4 h-4 text-emerald-400" />,
      label: "생산 달성률",
      primary: data.productionAch,
      secondary: `OEE ${data.oeeAvg}`,
      color: "border-emerald-500/25",
      loading,
    },
    {
      href: "/erp/sales",
      icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
      label: "영업 달성률",
      primary: data.salesAch,
      secondary: data.salesActual,
      color: "border-cyan-500/25",
      loading,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          ERP 핵심 지표
        </h2>
        <span className="text-[10px] text-slate-600">{getCurrentYearMonth()}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => <Card key={c.href} {...c} />)}
      </div>
    </div>
  );
}
