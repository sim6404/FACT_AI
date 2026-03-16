"use client";

import { useState } from "react";
import {
  Settings, Save, RefreshCw, Bell, Database, Globe,
  Moon, Sun, Mail, Sliders, Shield, Clock, ChevronRight,
  CheckCircle2, AlertCircle,
} from "lucide-react";

type Section = "general" | "notification" | "backup" | "ai" | "integration";

interface Setting {
  key: string;
  label: string;
  desc?: string;
  type: "text" | "number" | "select" | "toggle" | "email";
  value: string | number | boolean;
  options?: string[];
}

const SETTINGS_CONFIG: Record<Section, { title: string; icon: React.ReactNode; items: Setting[] }> = {
  general: {
    title: "일반 설정",
    icon: <Settings size={16} />,
    items: [
      { key: "company", label: "회사명", type: "text", value: "(주)포디테크" },
      { key: "timezone", label: "시간대", type: "select", value: "Asia/Seoul", options: ["Asia/Seoul", "UTC", "America/New_York", "Europe/London"] },
      { key: "language", label: "언어", type: "select", value: "한국어", options: ["한국어", "English", "日本語"] },
      { key: "dateFormat", label: "날짜 형식", type: "select", value: "YYYY-MM-DD", options: ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"] },
      { key: "currency", label: "통화", type: "select", value: "KRW (₩)", options: ["KRW (₩)", "USD ($)", "EUR (€)", "JPY (¥)"] },
      { key: "sessionTimeout", label: "세션 만료 (분)", type: "number", value: 60 },
    ],
  },
  notification: {
    title: "알림 설정",
    icon: <Bell size={16} />,
    items: [
      { key: "emailAlert", label: "이메일 알림", desc: "중요 이벤트 발생 시 이메일 발송", type: "toggle", value: true },
      { key: "alertEmail", label: "알림 수신 이메일", type: "email", value: "admin@fourd.co.kr" },
      { key: "prodAlert", label: "생산 목표 미달 알림", desc: "달성률 90% 미만 시 알림", type: "toggle", value: true },
      { key: "qualityAlert", label: "품질 불량 즉시 알림", desc: "불량률 2% 초과 시 즉시 알림", type: "toggle", value: true },
      { key: "stockAlert", label: "재고 부족 알림", desc: "안전재고 이하 시 알림", type: "toggle", value: true },
      { key: "approvalAlert", label: "승인 요청 알림", desc: "새 결재 문서 도착 시 알림", type: "toggle", value: true },
      { key: "systemAlert", label: "시스템 오류 알림", desc: "커넥터 연결 오류 시 알림", type: "toggle", value: false },
    ],
  },
  backup: {
    title: "백업 및 복구",
    icon: <Database size={16} />,
    items: [
      { key: "autoBackup", label: "자동 백업", desc: "PostgreSQL 데이터 정기 백업", type: "toggle", value: true },
      { key: "backupFreq", label: "백업 주기", type: "select", value: "매일", options: ["매시간", "매일", "매주", "매월"] },
      { key: "backupTime", label: "백업 시간", type: "text", value: "02:00" },
      { key: "retentionDays", label: "보관 기간 (일)", type: "number", value: 30 },
      { key: "backupPath", label: "백업 경로", type: "text", value: "/mnt/backup/factdb" },
    ],
  },
  ai: {
    title: "AI 에이전트 설정",
    icon: <Sliders size={16} />,
    items: [
      { key: "aiModel", label: "AI 모델", type: "select", value: "Snowflake Cortex", options: ["Snowflake Cortex", "Claude Sonnet", "GPT-4o", "Gemini Pro"] },
      { key: "maxTokens", label: "최대 토큰 수", type: "number", value: 4096 },
      { key: "temperature", label: "Temperature", desc: "낮을수록 정확하고 높을수록 창의적", type: "number", value: 0.3 },
      { key: "ragEnabled", label: "RAG 문서 검색", desc: "질의 시 내부 문서 참조 활성화", type: "toggle", value: true },
      { key: "semanticFile", label: "Semantic Model 파일", type: "text", value: "fact_semantic_model.yaml" },
      { key: "queryHistory", label: "질의 히스토리 저장 기간 (일)", type: "number", value: 90 },
    ],
  },
  integration: {
    title: "외부 연동",
    icon: <Globe size={16} />,
    items: [
      { key: "snowflakeAccount", label: "Snowflake 계정", type: "text", value: "xy12345.ap-northeast-2.aws" },
      { key: "snowflakeUser", label: "Snowflake 사용자", type: "text", value: "FACT_SERVICE" },
      { key: "redisUrl", label: "Redis URL", type: "text", value: "redis://localhost:6379/0" },
      { key: "smtpHost", label: "SMTP 서버", type: "text", value: "smtp.fourd.co.kr" },
      { key: "smtpPort", label: "SMTP 포트", type: "number", value: 587 },
      { key: "webhookUrl", label: "Webhook URL", desc: "외부 시스템 이벤트 수신 URL", type: "text", value: "https://fact.fourd.co.kr/webhook/events" },
    ],
  },
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("general");
  const [values, setValues] = useState<Record<string, Record<string, string | number | boolean>>>(() => {
    const init: Record<string, Record<string, string | number | boolean>> = {};
    for (const [sec, cfg] of Object.entries(SETTINGS_CONFIG)) {
      init[sec] = {};
      for (const item of cfg.items) {
        init[sec][item.key] = item.value;
      }
    }
    return init;
  });
  const [saved, setSaved] = useState(false);

  function setValue(section: string, key: string, val: string | number | boolean) {
    setValues(prev => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const section = SETTINGS_CONFIG[activeSection];
  const sectionValues = values[activeSection];

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">시스템 설정</h1>
          <p className="text-slate-400 text-sm mt-1">F.A.C.T 시스템 환경 설정</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle2 size={14} /> 저장 완료
            </span>
          )}
          <button
            onClick={save}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
          >
            <Save size={14} /> 설정 저장
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 사이드 메뉴 */}
        <div className="w-52 shrink-0 space-y-1">
          {(Object.entries(SETTINGS_CONFIG) as [Section, typeof SETTINGS_CONFIG[Section]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeSection === key
                  ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className={activeSection === key ? "text-amber-400" : "text-slate-500"}>{cfg.icon}</span>
              {cfg.title}
            </button>
          ))}
        </div>

        {/* 설정 폼 */}
        <div className="flex-1 card rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
            <span className="text-amber-400">{section.icon}</span>
            {section.title}
          </h2>
          <div className="space-y-5">
            {section.items.map((item) => {
              const val = sectionValues[item.key];
              return (
                <div key={item.key} className={`flex items-center justify-between gap-4 py-3 border-b border-slate-800 ${item.type === "toggle" ? "" : ""}`}>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{item.label}</p>
                    {item.desc && <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>}
                  </div>
                  <div className="shrink-0">
                    {item.type === "toggle" ? (
                      <button
                        onClick={() => setValue(activeSection, item.key, !val)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${val ? "bg-amber-600" : "bg-slate-600"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${val ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    ) : item.type === "select" ? (
                      <select
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 min-w-[160px]"
                        value={val as string}
                        onChange={e => setValue(activeSection, item.key, e.target.value)}
                      >
                        {item.options!.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : item.type === "number" ? (
                      <input
                        type="number"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 w-28 text-right"
                        value={val as number}
                        onChange={e => setValue(activeSection, item.key, Number(e.target.value))}
                      />
                    ) : (
                      <input
                        type={item.type === "email" ? "email" : "text"}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 min-w-[220px]"
                        value={val as string}
                        onChange={e => setValue(activeSection, item.key, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 위험 구역 (general만) */}
          {activeSection === "general" && (
            <div className="mt-8 p-4 border border-red-500/30 rounded-xl bg-red-500/5">
              <h3 className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={14} /> 위험 구역
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">데이터 초기화</p>
                  <p className="text-xs text-slate-500">모든 트랜잭션 데이터를 삭제합니다. 복구 불가.</p>
                </div>
                <button className="px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 text-sm transition-colors">
                  데이터 초기화
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
