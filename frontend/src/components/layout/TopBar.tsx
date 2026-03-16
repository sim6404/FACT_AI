"use client";

import { Bell, Search, Menu, ChevronDown, LogOut, Settings, Building2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const { user, logout } = useAuth();

  const MOCK_ALERTS = [
    { id: 1, type: "warning", message: "안전재고 미달: SUS304 잔량 12일치", time: "5분 전" },
    { id: 2, type: "error",   message: "설비 #M-07 비가동 이벤트 발생",     time: "23분 전" },
    { id: 3, type: "info",    message: "주간 보고서 초안 생성 완료",          time: "1시간 전" },
  ];

  return (
    <header
      className="h-16 flex items-center px-4 gap-4 border-b"
      style={{ background: "#1a1a1a", borderColor: "#2e2e2e" }}
    >
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg transition-colors lg:hidden"
        style={{ color: "#888" }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 브레드크럼 / 회사명 */}
      <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: "#666" }}>
        <Building2 className="w-3.5 h-3.5" style={{ color: "#D4920A" }} />
        <span style={{ color: "#D4920A", fontWeight: 600 }}>(주)영동테크</span>
        <span>/</span>
        <span>ERP 플랫폼</span>
      </div>

      {/* 검색 */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#555" }} />
          <input
            type="text"
            placeholder="KPI 검색, 자연어 질의..."
            className="input pl-9 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* 알림 */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(p => !p); setUserMenuOpen(false); }}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "#888" }}
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#ef4444" }}
            />
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-xl z-50"
              style={{ background: "#1e1e1e", border: "1px solid #383838", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">알림</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    {MOCK_ALERTS.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {MOCK_ALERTS.map(a => (
                    <div
                      key={a.id}
                      className="flex gap-3 p-2.5 rounded-lg cursor-pointer transition-colors"
                      style={{ color: "#aaa" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#2a2a2a")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          background: a.type === "error" ? "#ef4444" : a.type === "warning" ? "#D4920A" : "#4A8C3A"
                        }}
                      />
                      <div>
                        <p className="text-xs" style={{ color: "#e0e0e0" }}>{a.message}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#666" }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full mt-3 text-xs py-1 text-center transition-colors"
                  style={{ color: "#D4920A" }}
                >
                  모든 알림 보기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6" style={{ background: "#333" }} />

        {/* 사용자 메뉴 */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg transition-colors"
          >
            {/* 사용자 아바타 */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #D4920A, #b45309)" }}
            >
              {user?.name?.[0] ?? "?"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold" style={{ color: "#e0e0e0" }}>{user?.name ?? "-"}</div>
              <div className="text-[10px]" style={{ color: "#666" }}>{user?.department ?? ""}</div>
            </div>
            <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: "#555" }} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl z-50"
              style={{ background: "#1e1e1e", border: "1px solid #383838", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
            >
              <div className="p-2">
                {/* 사용자 정보 */}
                <div className="px-3 py-2.5 mb-1 rounded-lg" style={{ background: "#252525" }}>
                  <div className="text-xs font-semibold" style={{ color: "#e0e0e0" }}>{user?.name ?? "-"}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#888" }}>{user?.email ?? ""}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: "rgba(212,146,10,0.15)", color: "#D4920A", border: "1px solid rgba(212,146,10,0.3)" }}
                    >
                      {user?.role === "admin" ? "관리자" : "일반부서"}
                    </span>
                    <span className="text-[9px]" style={{ color: "#666" }}>{user?.department}</span>
                  </div>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: "#aaa" }}
                  onMouseEnter={e => { (e.currentTarget.style.background = "#2a2a2a"); (e.currentTarget.style.color = "#fff"); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = ""); (e.currentTarget.style.color = "#aaa"); }}
                >
                  <Settings className="w-3.5 h-3.5" /> 프로필 설정
                </button>
                <div className="my-1" style={{ borderTop: "1px solid #333" }} />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <LogOut className="w-3.5 h-3.5" /> 로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
