"use client";

import { useState } from "react";
import {
  Bell, AlertTriangle, Info, CheckCircle2, XCircle,
  Filter, RefreshCw, Clock, X, ChevronRight, Zap,
  Thermometer, Package, Activity, Settings2,
} from "lucide-react";

type Severity = "critical" | "warning" | "info" | "success";
type AlertCategory = "설비" | "품질" | "재고" | "생산" | "시스템";

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: Severity;
  category: AlertCategory;
  source: string;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
}

const INIT_ALERTS: Alert[] = [
  { id:1,  title:"CNC-03 진동 임계값 초과",         message:"A라인 CNC-03 설비 진동 센서 값 8.2mm/s (임계 5.0mm/s 초과). 즉시 점검 필요.", severity:"critical", category:"설비", source:"MES 센서", timestamp:"2026-03-13 09:42", read:false, acknowledged:false },
  { id:2,  title:"BUSH FRONT 불량률 3.2% 초과",      message:"당일 BUSH FRONT 제품 불량률 3.2% — 목표 2.0% 초과. 품질 검사팀 확인 요망.", severity:"critical", category:"품질", source:"품질 시스템", timestamp:"2026-03-13 09:15", read:false, acknowledged:false },
  { id:3,  title:"원자재 SUS304 재고 부족 임박",     message:"SUS304 잔여 재고 12일치 — 안전재고(15일) 하회. 긴급 발주 검토 필요.", severity:"warning", category:"재고", source:"ERP 재고", timestamp:"2026-03-13 08:50", read:false, acknowledged:false },
  { id:4,  title:"B라인 생산 지연 발생",             message:"B라인 3교대 야간 생산량 730개 — 목표 900개 대비 19% 미달. 원인 분석 중.", severity:"warning", category:"생산", source:"MES", timestamp:"2026-03-13 08:30", read:true,  acknowledged:false },
  { id:5,  title:"프레스-07 예방정비 도래",          message:"프레스-07 설비 예방정비 주기(3,000시간) 도달 예정 3일 후. 정비 일정 확인 바람.", severity:"warning", category:"설비", source:"설비 관리", timestamp:"2026-03-13 07:00", read:true,  acknowledged:false },
  { id:6,  title:"도금 도포량 편차 감지",            message:"제품 도금 두께 편차 ±0.8μm — 규격 ±0.5μm 초과. 설비 파라미터 점검 권장.", severity:"warning", category:"품질", source:"품질 시스템", timestamp:"2026-03-12 17:45", read:true,  acknowledged:true  },
  { id:7,  title:"4월 생산계획 확정 완료",           message:"4월 생산계획이 승인 완료되어 MES에 반영되었습니다. 각 라인 확인 바랍니다.", severity:"info",     category:"생산", source:"ERP", timestamp:"2026-03-12 16:20", read:true,  acknowledged:true  },
  { id:8,  title:"Snowflake 연결 타임아웃 복구",    message:"Cortex Analyst API 연결 지연 발생 후 자동 복구 완료. 정상 운영 중.", severity:"info",     category:"시스템", source:"AI 시스템", timestamp:"2026-03-12 14:10", read:true,  acknowledged:true  },
  { id:9,  title:"ISO 9001 내부감사 일정 안내",      message:"2026년 ISO 9001 내부감사 일정: 3월 20일~21일. 각 부서 담당자 준비 바랍니다.", severity:"info",     category:"품질", source:"품질 시스템", timestamp:"2026-03-12 10:00", read:true,  acknowledged:true  },
  { id:10, title:"3월 2주차 OEE 목표 달성",         message:"3월 2주차 전체 OEE 88.3% — 목표 85% 초과 달성. 생산팀 수고하셨습니다.", severity:"success",  category:"생산", source:"MES", timestamp:"2026-03-12 08:00", read:true,  acknowledged:true  },
  { id:11, title:"협력사 평가 결과 등록 완료",       message:"Q1 협력사 평가 결과 15개사 전원 등록 완료. 검토 후 피드백 예정.", severity:"success",  category:"시스템", source:"ERP", timestamp:"2026-03-11 17:30", read:true,  acknowledged:true  },
  { id:12, title:"에어컨 라인 압력 정상 복구",       message:"C라인 공압 라인 압력 이상(0.45MPa) 발생 후 0.6MPa 정상 복구 완료.", severity:"success",  category:"설비", source:"MES 센서", timestamp:"2026-03-11 15:20", read:true,  acknowledged:true  },
];

const SEV_CFG: Record<Severity, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  critical: { label:"위험",  color:"text-red-400",    bg:"bg-red-500/20",    border:"border-red-500/30",    icon: XCircle },
  warning:  { label:"경고",  color:"text-amber-400",  bg:"bg-amber-500/20",  border:"border-amber-500/30",  icon: AlertTriangle },
  info:     { label:"정보",  color:"text-blue-400",   bg:"bg-blue-500/20",   border:"border-blue-500/30",   icon: Info },
  success:  { label:"정상",  color:"text-green-400",  bg:"bg-green-500/20",  border:"border-green-500/30",  icon: CheckCircle2 },
};

const CAT_ICONS: Record<AlertCategory, React.ElementType> = {
  설비: Thermometer, 품질: Activity, 재고: Package, 생산: Zap, 시스템: Settings2,
};

const CATEGORIES: (AlertCategory | "전체")[] = ["전체", "설비", "품질", "재고", "생산", "시스템"];
const SEVERITIES: (Severity | "전체")[] = ["전체", "critical", "warning", "info", "success"];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INIT_ALERTS);
  const [catFilter, setCatFilter] = useState<AlertCategory | "전체">("전체");
  const [sevFilter, setSevFilter] = useState<Severity | "전체">("전체");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState<Alert | null>(null);

  const filtered = alerts.filter(a => {
    if (catFilter !== "전체" && a.category !== catFilter) return false;
    if (sevFilter !== "전체" && a.severity !== sevFilter) return false;
    if (unreadOnly && a.read) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;

  const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const acknowledge = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, read: true } : a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  const openDetail = (alert: Alert) => {
    markRead(alert.id);
    setSelected(alert);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" /> 알림 현황
          </h1>
          <p className="text-slate-400 text-sm mt-1">설비 · 품질 · 재고 · 생산 실시간 알림 통합 관리</p>
        </div>
        <button onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> 전체 읽음 처리
        </button>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:"전체 알림",    value: alerts.length,                   color:"text-white",       bg:"bg-slate-800/60" },
          { label:"미확인",       value: unreadCount,                     color:"text-blue-400",    bg:"bg-blue-500/10" },
          { label:"위험 (미조치)", value: criticalCount,                   color:"text-red-400",     bg:"bg-red-500/10" },
          { label:"경고 (미조치)", value: alerts.filter(a => a.severity === "warning" && !a.acknowledged).length, color:"text-amber-400", bg:"bg-amber-500/10" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border border-slate-700/50 rounded-2xl p-4`}>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-slate-400 text-xs mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2">
        {/* 카테고리 */}
        <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${catFilter === c ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
        {/* 심각도 */}
        <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
          {SEVERITIES.map(s => {
            const cfg = s !== "전체" ? SEV_CFG[s] : null;
            return (
              <button key={s} onClick={() => setSevFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${sevFilter === s ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {s === "전체" ? "전체" : cfg!.label}
              </button>
            );
          })}
        </div>
        <button onClick={() => setUnreadOnly(!unreadOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors border ${unreadOnly ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "text-slate-400 border-slate-700/50 hover:text-white"}`}>
          <Filter className="w-3.5 h-3.5" /> 미확인만
        </button>
        <span className="text-xs text-slate-500 flex items-center px-1">{filtered.length}건</span>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-2">
        {filtered.map(alert => {
          const cfg = SEV_CFG[alert.severity];
          const SevIcon = cfg.icon;
          const CatIcon = CAT_ICONS[alert.category];
          return (
            <div key={alert.id} onClick={() => openDetail(alert)}
              className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all
                ${!alert.read ? "bg-slate-800/60 border-slate-600/50" : "bg-slate-800/30 border-slate-700/40 opacity-70"}
                hover:border-slate-500/60 hover:bg-slate-700/40`}>
              {!alert.read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
              )}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                <SevIcon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CatIcon className="w-2.5 h-2.5" />{alert.category}
                  </span>
                  {alert.acknowledged && (
                    <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">조치완료</span>
                  )}
                </div>
                <div className="text-sm font-medium text-white mt-1">{alert.title}</div>
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{alert.message}</div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timestamp}</span>
                  <span>{alert.source}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 self-center" />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm">알림이 없습니다</div>
        )}
      </div>

      {/* 상세 모달 */}
      {selected && (() => {
        const cfg = SEV_CFG[selected.severity];
        const SevIcon = cfg.icon;
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="rounded-2xl w-full max-w-lg p-6 space-y-4" style={{ background: "#1e1e1e", border: "1px solid #383838" }} onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                    <SevIcon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <h3 className="text-base font-bold text-white">{selected.title}</h3>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                {selected.message}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div><span className="text-slate-600">카테고리</span><br /><span className="text-white">{selected.category}</span></div>
                <div><span className="text-slate-600">발생 시각</span><br /><span className="text-white">{selected.timestamp}</span></div>
                <div><span className="text-slate-600">데이터 소스</span><br /><span className="text-white">{selected.source}</span></div>
                <div><span className="text-slate-600">조치 상태</span><br /><span className={selected.acknowledged ? "text-green-400" : "text-amber-400"}>{selected.acknowledged ? "조치 완료" : "미조치"}</span></div>
              </div>
              {!selected.acknowledged && (
                <button onClick={() => { acknowledge(selected.id); setSelected(prev => prev ? { ...prev, acknowledged: true } : null); }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors">
                  조치 완료 처리
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
