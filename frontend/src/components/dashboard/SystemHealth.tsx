"use client";

import { Activity, Database, Cpu, HardDrive } from "lucide-react";
import { clsx } from "clsx";

const SYSTEMS = [
  { id: "snowflake", label: "Snowflake",       status: "online",  latency: "42ms",  icon: Database },
  { id: "erp",       label: "ERP 커넥터",       status: "online",  latency: "128ms", icon: Activity },
  { id: "mes",       label: "MES 커넥터",       status: "online",  latency: "95ms",  icon: Cpu },
  { id: "redis",     label: "Redis 큐",         status: "online",  latency: "3ms",   icon: HardDrive },
  { id: "worker",    label: "Worker 프로세스",  status: "online",  latency: null,    icon: Activity },
];

export function SystemHealth() {
  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-accent-cyan" />
        시스템 상태
      </h2>
      <div className="space-y-1.5">
        {SYSTEMS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <div className={clsx("status-dot", s.status)} />
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
              {s.latency && (
                <span className="text-[10px] text-slate-600 font-mono">{s.latency}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
