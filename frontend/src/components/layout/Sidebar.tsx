"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard, MessageSquare, FileText, CheckSquare,
  FolderOpen, Settings, ChevronLeft, ChevronRight,
  Bell, BarChart3, Database, Shield,
  ShoppingCart, Factory, TrendingUp, Award,
  ChevronDown, ChevronUp, Truck, Boxes,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "메인 대시보드", icon: LayoutDashboard },
  { href: "/query",     label: "AI 질의",       icon: MessageSquare },
  { href: "/reports",   label: "보고서 센터",    icon: FileText },
  { href: "/approvals", label: "승인함",         icon: CheckSquare },
  { href: "/documents", label: "문서 탐색기",    icon: FolderOpen },
];

const ERP_ITEMS = [
  { href: "/erp/purchase",   label: "매입 관리", icon: ShoppingCart, sub: "월별 매입현황분석", badge: "핵심" },
  { href: "/erp/quality",    label: "품질 관리", icon: Award,         sub: "PPM · 클레임" },
  { href: "/erp/production", label: "생산 관리", icon: Factory,       sub: "주간실적 · OEE" },
  { href: "/erp/sales",      label: "영업 관리", icon: TrendingUp,    sub: "매출실적 · OEM" },
  { href: "/erp/orders",     label: "수주 관리", icon: Truck,         sub: "수주접수 · 납기관리", badge: "신규" },
  { href: "/erp/inventory",  label: "재고 관리", icon: Boxes,         sub: "입출고 · 안전재고", badge: "신규" },
];

const TOOL_ITEMS = [
  { href: "/alerts",    label: "알림 현황",    icon: Bell },
  { href: "/analytics", label: "분석 대시보드", icon: BarChart3 },
];

const ADMIN_ITEMS = [
  { href: "/admin/connectors", label: "커넥터 관리", icon: Database },
  { href: "/admin/security",   label: "권한 정책",   icon: Shield },
  { href: "/admin/settings",   label: "시스템 설정", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [erpOpen, setErpOpen] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside
      className={clsx(
        "flex flex-col border-r transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ background: "#171717", borderColor: "#2e2e2e" }}
    >
      {/* ── 로고 (영동테크 YD 스타일) ── */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b min-h-[64px]"
        style={{ borderColor: "#2e2e2e" }}
      >
        {/* YD 로고 블록 */}
        <div className="relative flex-shrink-0 w-9 h-9">
          <div className="absolute inset-0 rounded-lg" style={{ background: "#1a1a1a", border: "1px solid #383838" }} />
          <div
            className="absolute"
            style={{
              top: "5px", left: "5px", right: "5px", bottom: "5px",
              background: "linear-gradient(135deg, #D4920A 0%, #f59e0b 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 30%, 30% 100%, 0 100%)",
              borderRadius: "2px",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-black text-white"
            style={{ fontSize: "11px", letterSpacing: "-0.5px", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
          >
            YD
          </div>
        </div>

        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white tracking-wide leading-tight">영동테크</div>
            <div className="text-[10px] mt-0.5 font-semibold tracking-wide" style={{ color: "#D4920A" }}>
              ERP · AI Platform
            </div>
          </div>
        )}
      </div>

      {/* ── 접기/펼치기 ── */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg"
        style={{ background: "#1e1e1e", border: "1px solid #383838" }}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-gray-400" />
          : <ChevronLeft  className="w-3 h-3 text-gray-400" />
        }
      </button>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">

        {/* ── 메인 메뉴 ── */}
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={clsx("sidebar-item", active && "active", collapsed && "justify-center px-2")}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}

        {/* ── ERP 모듈 ── */}
        {!collapsed ? (
          <>
            <div className="pt-3 pb-1">
              <button
                onClick={() => setErpOpen(!erpOpen)}
                className="w-full flex items-center justify-between px-3 py-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#555" }}>
                  ERP 모듈
                </span>
                {erpOpen
                  ? <ChevronUp   className="w-3 h-3" style={{ color: "#555" }} />
                  : <ChevronDown className="w-3 h-3" style={{ color: "#555" }} />
                }
              </button>
            </div>

            {erpOpen && ERP_ITEMS.map(item => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                    style={active ? {
                      background: "rgba(212,146,10,0.1)",
                      border: "1px solid rgba(212,146,10,0.28)",
                      color: "#f59e0b",
                    } : {
                      color: "#888",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#2a2a2a"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = ""; }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? "#D4920A" : "#666" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[9px] px-1 py-0.5 rounded font-bold shrink-0"
                            style={{ background: "#D4920A", color: "#fff" }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] truncate mt-0.5" style={{ color: active ? "rgba(212,146,10,0.6)" : "#555" }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <>
            <div className="pt-2 pb-1">
              <div className="w-6 h-px mx-auto" style={{ background: "#333" }} />
            </div>
            {ERP_ITEMS.map(item => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex justify-center items-center px-2 py-2.5 rounded-xl cursor-pointer transition-all"
                    style={active ? { background: "rgba(212,146,10,0.15)", color: "#f59e0b" } : { color: "#666" }}
                    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "#2a2a2a"; (e.currentTarget as HTMLDivElement).style.color = "#ccc"; } }}
                    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = ""; (e.currentTarget as HTMLDivElement).style.color = "#666"; } }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </>
        )}

        {/* ── 도구 ── */}
        {!collapsed && (
          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#555" }}>도구</span>
          </div>
        )}
        {TOOL_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div className={clsx("sidebar-item", active && "active", collapsed && "justify-center px-2")}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}

        {/* ── 관리자 (admin 역할만 표시) ── */}
        {isAdmin && !collapsed && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#555" }}>관리자</span>
            </div>
            {ADMIN_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={clsx("sidebar-item", pathname.startsWith(item.href) && "active")}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* ── 연결 상태 ── */}
      {!collapsed && (
        <div className="p-3 border-t space-y-1" style={{ borderColor: "#2e2e2e" }}>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="status-dot online" />
            <span className="text-xs" style={{ color: "#666" }}>PostgreSQL 연결됨</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="status-dot online" />
            <span className="text-xs" style={{ color: "#666" }}>Snowflake 연결됨</span>
          </div>
        </div>
      )}
    </aside>
  );
}
