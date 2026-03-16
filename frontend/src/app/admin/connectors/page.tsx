"use client";

import { useState } from "react";
import {
  Plug, CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Settings, Play, Square, Plus, Trash2, Edit3, Database,
  Zap, Activity, Clock,
} from "lucide-react";

type ConnStatus = "connected" | "disconnected" | "error" | "syncing";

interface Connector {
  id: number;
  name: string;
  type: string;
  host: string;
  status: ConnStatus;
  lastSync: string;
  records: number;
  interval: number; // minutes
  enabled: boolean;
}

const INIT_CONNECTORS: Connector[] = [
  { id: 1, name: "ERP 메인 DB", type: "PostgreSQL", host: "erp-db.internal:5432", status: "connected", lastSync: "2026-03-14 14:30", records: 1_240_582, interval: 5, enabled: true },
  { id: 2, name: "MES 생산 시스템", type: "Oracle", host: "mes.internal:1521", status: "connected", lastSync: "2026-03-14 14:25", records: 892_341, interval: 10, enabled: true },
  { id: 3, name: "품질 LIMS", type: "MSSQL", host: "lims.internal:1433", status: "error", lastSync: "2026-03-14 12:10", records: 340_121, interval: 15, enabled: true },
  { id: 4, name: "창고 WMS", type: "MySQL", host: "wms.internal:3306", status: "connected", lastSync: "2026-03-14 14:28", records: 568_904, interval: 10, enabled: true },
  { id: 5, name: "영업 CRM", type: "REST API", host: "crm.salesforce.com/api", status: "connected", lastSync: "2026-03-14 14:00", records: 128_450, interval: 30, enabled: true },
  { id: 6, name: "회계 ERP", type: "SAP RFC", host: "sap.internal:3300", status: "disconnected", lastSync: "2026-03-13 18:00", records: 0, interval: 60, enabled: false },
  { id: 7, name: "설비 SCADA", type: "OPC-UA", host: "scada.factory:4840", status: "syncing", lastSync: "2026-03-14 14:31", records: 4_521_038, interval: 1, enabled: true },
  { id: 8, name: "Snowflake DW", type: "Snowflake", host: "xy12345.snowflakecomputing.com", status: "connected", lastSync: "2026-03-14 14:00", records: 12_845_221, interval: 60, enabled: true },
];

const STATUS_META: Record<ConnStatus, { label: string; color: string; icon: React.ReactNode }> = {
  connected: { label: "연결됨", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: <CheckCircle2 size={12} /> },
  disconnected: { label: "연결 끊김", color: "text-slate-400 bg-slate-400/10 border-slate-400/30", icon: <XCircle size={12} /> },
  error: { label: "오류", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: <AlertCircle size={12} /> },
  syncing: { label: "동기화 중", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: <RefreshCw size={12} className="animate-spin" /> },
};

const TYPE_ICONS: Record<string, string> = {
  PostgreSQL: "🐘",
  Oracle: "🔶",
  MSSQL: "🪟",
  MySQL: "🐬",
  "REST API": "🌐",
  "SAP RFC": "🏢",
  "OPC-UA": "⚙️",
  Snowflake: "❄️",
};

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>(INIT_CONNECTORS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "PostgreSQL", host: "", interval: 10 });

  const connCount = connectors.filter(c => c.status === "connected" || c.status === "syncing").length;
  const errCount = connectors.filter(c => c.status === "error").length;
  const totalRecords = connectors.reduce((s, c) => s + c.records, 0);

  function toggleEnabled(id: number) {
    setConnectors(prev => prev.map(c => {
      if (c.id !== id) return c;
      const enabled = !c.enabled;
      return { ...c, enabled, status: enabled ? "disconnected" : "disconnected" };
    }));
  }

  function reconnect(id: number) {
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: "syncing" } : c));
    setTimeout(() => {
      setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: "connected", lastSync: "방금 전" } : c));
    }, 1800);
  }

  function deleteConn(id: number) {
    setConnectors(prev => prev.filter(c => c.id !== id));
  }

  function addConn() {
    if (!form.name || !form.host) return;
    const newConn: Connector = {
      id: Date.now(),
      name: form.name,
      type: form.type,
      host: form.host,
      status: "disconnected",
      lastSync: "-",
      records: 0,
      interval: form.interval,
      enabled: false,
    };
    setConnectors(prev => [...prev, newConn]);
    setForm({ name: "", type: "PostgreSQL", host: "", interval: 10 });
    setShowAddModal(false);
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">커넥터 관리</h1>
          <p className="text-slate-400 text-sm mt-1">외부 시스템 연동 및 데이터 동기화 설정</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
        >
          <Plus size={14} /> 커넥터 추가
        </button>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "전체 커넥터", value: connectors.length + "개", icon: <Plug size={18} className="text-blue-400" />, color: "text-blue-400" },
          { label: "활성 연결", value: connCount + "개", icon: <CheckCircle2 size={18} className="text-green-400" />, color: "text-green-400" },
          { label: "오류", value: errCount + "개", icon: <AlertCircle size={18} className="text-red-400" />, color: "text-red-400" },
          { label: "총 레코드", value: (totalRecords / 1_000_000).toFixed(1) + "M", icon: <Database size={18} className="text-purple-400" />, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="card rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-slate-400 text-xs">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 커넥터 목록 */}
      <div className="card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">커넥터</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">타입</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">호스트</th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">상태</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">레코드 수</th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">주기</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">마지막 동기화</th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">활성화</th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((conn) => {
              const sm = STATUS_META[conn.status];
              return (
                <tr key={conn.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-slate-200 font-medium">{conn.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300">{TYPE_ICONS[conn.type] ?? "🔌"} {conn.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{conn.host}</code>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sm.color}`}>
                      {sm.icon} {sm.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {conn.records > 0 ? conn.records.toLocaleString() : "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-slate-400 text-xs">{conn.interval}분</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-400 text-xs">{conn.lastSync}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleEnabled(conn.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${conn.enabled ? "bg-amber-600" : "bg-slate-600"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${conn.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => reconnect(conn.id)}
                        title="재연결"
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button title="설정" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors">
                        <Settings size={13} />
                      </button>
                      <button
                        onClick={() => deleteConn(conn.id)}
                        title="삭제"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="card rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Plus size={18} className="text-blue-400" /> 커넥터 추가
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">커넥터 이름</label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="예: ERP 생산 DB"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">타입</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                >
                  {Object.keys(TYPE_ICONS).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">호스트</label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="host:port"
                  value={form.host}
                  onChange={e => setForm(p => ({ ...p, host: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">동기화 주기 (분)</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  value={form.interval}
                  onChange={e => setForm(p => ({ ...p, interval: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 text-sm"
              >
                취소
              </button>
              <button
                onClick={addConn}
                className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
