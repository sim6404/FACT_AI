"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu, X, ChevronDown,
  Cpu, BarChart3, Zap, Shield, Plug,
  Megaphone, Landmark, Heart, ShoppingCart, Factory, Building2, Bolt, Radio,
  Code2, Database, LineChart, Briefcase,
  BookOpen, FileText, Video, Users,
  Play,
} from "lucide-react";

/* ─── Menu data ─────────────────────────────────────────── */
const PLATFORM_ITEMS = [
  { icon: Cpu,       label: "AI 에이전트 플랫폼",   sub: "자율 실행 AI 에이전트",    href: "/platform/agent" },
  { icon: BarChart3, label: "데이터 분석 엔진",     sub: "실시간 KPI & 인사이트",    href: "/platform/analytics" },
  { icon: Zap,       label: "자동화 워크플로우",    sub: "업무 자동화 설계·실행",     href: "/platform/automation" },
  { icon: Shield,    label: "보안·거버넌스",        sub: "엔터프라이즈급 보안",       href: "/platform/security" },
  { icon: Plug,      label: "통합·연동",            sub: "ERP·MES·클라우드 연결",    href: "/platform/integration" },
];

const INDUSTRY_ITEMS = [
  { icon: Megaphone,    label: "광고·미디어·엔터테인먼트", href: "/industries/media" },
  { icon: Landmark,     label: "금융서비스",               href: "/industries/financial" },
  { icon: Heart,        label: "의료·헬스케어",             href: "/industries/healthcare" },
  { icon: ShoppingCart, label: "리테일·이커머스",           href: "/industries/retail" },
  { icon: Factory,      label: "제조",                     href: "/industries/manufacturing" },
  { icon: Building2,    label: "공공·정부",                 href: "/industries/government" },
  { icon: Bolt,         label: "에너지·유틸리티",           href: "/industries/energy" },
  { icon: Radio,        label: "통신",                     href: "/industries/telecom" },
];

const ROLE_ITEMS = [
  { icon: Database,   label: "데이터 엔지니어", href: "/solutions/engineer" },
  { icon: LineChart,  label: "데이터 분석가",   href: "/solutions/analyst" },
  { icon: Code2,      label: "개발자",           href: "/solutions/developer" },
  { icon: Briefcase,  label: "경영진",           href: "/solutions/executive" },
];

const RESOURCE_ITEMS = [
  { icon: BookOpen,  label: "문서·가이드",    sub: "통합 가이드 & API 레퍼런스",   href: "/resources/docs" },
  { icon: FileText,  label: "블로그",         sub: "인사이트 & 산업 동향",         href: "/resources/blog" },
  { icon: Video,     label: "웨비나·이벤트",  sub: "온라인 세미나 & 컨퍼런스",     href: "/resources/events" },
  { icon: Users,     label: "파트너 생태계",  sub: "SI·MSP 파트너 네트워크",       href: "/resources/partners" },
];

/* ─── Types ─────────────────────────────────────────────── */
type MenuKey = "platform" | "solutions" | "resources" | null;

/* ─── MegaMenuPanel ─────────────────────────────────────── */
function MegaMenuPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-screen max-w-5xl"
      style={{
        background: "rgba(12,12,12,0.98)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(212,146,10,0.18)",
        borderTop: "2px solid #D4920A",
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── NavButton ─────────────────────────────────────────── */
function NavBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors"
      style={{ color: active ? "#D4920A" : "rgba(255,255,255,0.75)" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
    >
      {label}
      <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: active ? "rotate(180deg)" : "rotate(0deg)" }} />
    </button>
  );
}

/* ─── MenuItem ───────────────────────────────────────────── */
function MenuItem({ icon: Icon, label, sub, href, onClick }: {
  icon: React.ElementType; label: string; sub?: string; href: string; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-start gap-3 p-3 rounded-xl transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,146,10,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(212,146,10,0.12)", border: "1px solid rgba(212,146,10,0.2)" }}
      >
        <Icon className="w-4 h-4" style={{ color: "#D4920A" }} />
      </div>
      <div>
        <div className="text-sm font-medium" style={{ color: "#e8e8e8" }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "#666" }}>{sub}</div>}
      </div>
    </Link>
  );
}

/* ─── MarketingNav ───────────────────────────────────────── */
export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key: MenuKey) => setActiveMenu((p) => (p === key ? null : key));

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || activeMenu ? "rgba(10,10,10,0.97)" : "transparent",
        backdropFilter: scrolled || activeMenu ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || activeMenu ? "blur(20px)" : "none",
        borderBottom: scrolled || activeMenu ? "1px solid rgba(212,146,10,0.15)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #D4920A, #f59e0b)", color: "#0a0a0a" }}
          >
            F
          </div>
          <span className="font-black text-white text-lg tracking-tight">
            F.A.C.T <span style={{ color: "#D4920A", fontSize: "0.8em", fontWeight: 900 }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0 absolute left-1/2 -translate-x-1/2">
          <NavBtn label="플랫폼" active={activeMenu === "platform"} onClick={() => toggle("platform")} />
          <NavBtn label="솔루션" active={activeMenu === "solutions"} onClick={() => toggle("solutions")} />
          <Link
            href="/cases"
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.75)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onClick={() => setActiveMenu(null)}
          >
            고객사례
          </Link>
          <NavBtn label="리소스" active={activeMenu === "resources"} onClick={() => toggle("resources")} />
          <Link
            href="/pricing"
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.75)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onClick={() => setActiveMenu(null)}
          >
            가격
          </Link>

          {/* ── Platform Mega ── */}
          {activeMenu === "platform" && (
            <MegaMenuPanel>
              <div className="p-6">
                <p className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ color: "#D4920A" }}>FACT AI 플랫폼</p>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORM_ITEMS.map((item) => (
                    <MenuItem key={item.href} {...item} onClick={() => setActiveMenu(null)} />
                  ))}
                </div>
                <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs" style={{ color: "#666" }}>F.A.C.T AI — AI 기반 기업 업무 자동화 플랫폼</span>
                  <Link href="/platform" className="text-xs font-semibold" style={{ color: "#D4920A" }} onClick={() => setActiveMenu(null)}>
                    전체 플랫폼 보기 →
                  </Link>
                </div>
              </div>
            </MegaMenuPanel>
          )}

          {/* ── Solutions Mega ── */}
          {activeMenu === "solutions" && (
            <MegaMenuPanel>
              <div className="p-6 grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: "#D4920A" }}>산업별 솔루션</p>
                  <div className="grid grid-cols-2 gap-1">
                    {INDUSTRY_ITEMS.map((item) => (
                      <MenuItem key={item.href} icon={item.icon} label={item.label} href={item.href} onClick={() => setActiveMenu(null)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: "#888" }}>직무별 솔루션</p>
                  <div className="flex flex-col gap-1">
                    {ROLE_ITEMS.map((item) => (
                      <MenuItem key={item.href} icon={item.icon} label={item.label} href={item.href} onClick={() => setActiveMenu(null)} />
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(212,146,10,0.06)", border: "1px solid rgba(212,146,10,0.15)" }}>
                    <p className="text-xs font-semibold" style={{ color: "#D4920A" }}>도입 문의 · 파트너십</p>
                    <p className="text-xs mt-1" style={{ color: "#888" }}>기업별 맞춤 제안을 받아보세요</p>
                    <a href="/contact" className="text-xs font-semibold mt-2 block" style={{ color: "#D4920A" }}>
                      문의하러 가기 →
                    </a>
                  </div>
                </div>
              </div>
            </MegaMenuPanel>
          )}

          {/* ── Resources Mega ── */}
          {activeMenu === "resources" && (
            <MegaMenuPanel>
              <div className="p-6">
                <p className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ color: "#D4920A" }}>리소스</p>
                <div className="grid grid-cols-2 gap-2">
                  {RESOURCE_ITEMS.map((item) => (
                    <MenuItem key={item.href} {...item} onClick={() => setActiveMenu(null)} />
                  ))}
                </div>
              </div>
            </MegaMenuPanel>
          )}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3 z-10">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-semibold transition-all"
            style={{ color: "rgba(255,255,255,0.85)", border: "1px solid rgba(212,146,10,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4920A"; e.currentTarget.style.color = "#D4920A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,146,10,0.35)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          >
            <Play className="w-3 h-3" />
            무료 데모
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
            style={{ background: "#D4920A", color: "#0a0a0a" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f59e0b")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#D4920A")}
          >
            ERP 로그인
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-white z-10"
          onClick={() => { setMobileOpen((p) => !p); setActiveMenu(null); }}
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)", background: "rgba(10,10,10,0.98)", borderBottom: "1px solid rgba(212,146,10,0.2)" }}>
          <MobileSection label="플랫폼" expanded={mobileExpanded === "platform"} onToggle={() => setMobileExpanded((p) => (p === "platform" ? null : "platform"))}>
            {PLATFORM_ITEMS.map((item) => <MobileItem key={item.href} href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />)}
          </MobileSection>
          <MobileSection label="솔루션" expanded={mobileExpanded === "solutions"} onToggle={() => setMobileExpanded((p) => (p === "solutions" ? null : "solutions"))}>
            <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "#D4920A" }}>산업별</p>
            {INDUSTRY_ITEMS.map((item) => <MobileItem key={item.href} href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />)}
            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "#888" }}>직무별</p>
            {ROLE_ITEMS.map((item) => <MobileItem key={item.href} href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />)}
          </MobileSection>
          <Link href="/cases" className="flex items-center px-6 py-4 text-sm border-b" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.06)" }} onClick={() => setMobileOpen(false)}>고객사례</Link>
          <MobileSection label="리소스" expanded={mobileExpanded === "resources"} onToggle={() => setMobileExpanded((p) => (p === "resources" ? null : "resources"))}>
            {RESOURCE_ITEMS.map((item) => <MobileItem key={item.href} href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />)}
          </MobileSection>
          <Link href="/pricing" className="flex items-center px-6 py-4 text-sm border-b" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.06)" }} onClick={() => setMobileOpen(false)}>가격</Link>
          <div className="px-6 py-5 flex flex-col gap-3">
            <Link href="/demo" className="py-3 text-sm text-center rounded-xl font-semibold" style={{ border: "1px solid rgba(212,146,10,0.4)", color: "#D4920A" }} onClick={() => setMobileOpen(false)}>무료 데모</Link>
            <Link href="/login" className="py-3 text-sm text-center rounded-xl font-semibold" style={{ background: "#D4920A", color: "#0a0a0a" }} onClick={() => setMobileOpen(false)}>ERP 로그인</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Mobile helpers ─────────────────────────────────────── */
function MobileSection({ label, expanded, onToggle, children }: {
  label: string; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
        {label}
        <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", color: "#666" }} />
      </button>
      {expanded && <div className="pb-3" style={{ background: "rgba(255,255,255,0.02)" }}>{children}</div>}
    </div>
  );
}

function MobileItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} className="flex items-center px-8 py-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }} onClick={onClick}>
      {label}
    </Link>
  );
}
