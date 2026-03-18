"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/lib/auth";

const AUTH_ROUTES = ["/login", "/signup"];
const MARKETING_ROUTES = ["/", "/platform", "/solutions", "/pricing", "/about", "/blog", "/cases", "/demo", "/contact", "/privacy", "/terms", "/cookies"];
const MARKETING_PREFIXES = ["/blog", "/industries", "/resources", "/platform/", "/solutions/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isMarketingRoute = MARKETING_ROUTES.includes(pathname) || MARKETING_PREFIXES.some(p => pathname.startsWith(p));

  useEffect(() => {
    if (!loading && !user && !isAuthRoute && !isMarketingRoute) {
      router.push("/login");
    }
  }, [user, loading, isAuthRoute, isMarketingRoute, router, pathname]);

  // 마케팅/인증 페이지: 셸 없이 렌더링
  if (isAuthRoute || isMarketingRoute) {
    return <>{children}</>;
  }

  // 인증 확인 중 또는 미로그인 → 로딩 스피너
  if (loading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0d0d0d" }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "rgba(212,146,10,0.2)", borderTopColor: "#D4920A" }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarCollapsed(p => !p)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
