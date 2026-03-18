"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const cookieCategories = [
  {
    id: "essential",
    name: "필수 쿠키",
    desc: "서비스의 핵심 기능에 필요한 쿠키입니다. 이 쿠키 없이는 로그인, 세션 유지 등 기본 기능이 동작하지 않습니다.",
    required: true,
    examples: ["세션 인증 토큰", "로그인 상태 유지", "CSRF 보안 토큰", "언어 설정"],
  },
  {
    id: "analytics",
    name: "분석 쿠키",
    desc: "서비스 이용 통계를 수집하여 사용자 경험을 개선하는 데 사용됩니다. 개인을 식별하지 않는 익명 데이터만 수집합니다.",
    required: false,
    examples: ["페이지 방문 횟수", "체류 시간", "유입 경로", "사용 기능 통계"],
  },
  {
    id: "functional",
    name: "기능 쿠키",
    desc: "사용자 설정(다크 모드, 대시보드 레이아웃 등)을 기억하여 편의성을 높이는 쿠키입니다.",
    required: false,
    examples: ["UI 레이아웃 설정", "알림 기본 설정", "최근 본 보고서", "즐겨찾기 메뉴"],
  },
  {
    id: "marketing",
    name: "마케팅 쿠키",
    desc: "관심사에 맞는 광고와 콘텐츠를 제공하기 위해 사용됩니다. 동의하지 않아도 서비스 이용에는 지장이 없습니다.",
    required: false,
    examples: ["광고 효과 측정", "리타겟팅", "소셜미디어 연동", "맞춤 콘텐츠 추천"],
  },
];

export default function CookiesPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    if (id === "essential") return;
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    setSettings({ essential: true, analytics: true, functional: true, marketing: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectOptional = () => {
    setSettings({ essential: true, analytics: false, functional: false, marketing: false });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      <section style={{ paddingTop: 120, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 24, fontSize: 12, color: "#D4920A", fontWeight: 600 }}>
            법적 문서
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>쿠키 정책 및 설정</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
            시행일: 2025년 1월 1일 &nbsp;|&nbsp; (주)포디비전
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* 쿠키란 */}
        <div style={{ marginBottom: 48, padding: "24px 28px", background: "rgba(212,146,10,0.05)", border: "1px solid rgba(212,146,10,0.15)", borderRadius: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#D4920A" }}>🍪 쿠키(Cookie)란?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0 }}>
            쿠키는 웹사이트를 방문할 때 브라우저에 저장되는 작은 텍스트 파일입니다. F.A.C.T AI는 서비스 개선, 사용자 편의 향상, 보안 강화를 위해 쿠키를 사용합니다. 아래에서 각 쿠키 유형별 허용 여부를 직접 설정하실 수 있습니다.
          </p>
        </div>

        {/* 빠른 설정 버튼 */}
        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <button onClick={handleAcceptAll}
            style={{ padding: "11px 24px", background: "#D4920A", color: "#0a0a0a", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            모두 허용
          </button>
          <button onClick={handleRejectOptional}
            style={{ padding: "11px 24px", background: "rgba(255,255,255,0.06)", color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>
            필수만 허용
          </button>
          <button onClick={handleSave}
            style={{ padding: "11px 24px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
            {saved ? "✅ 저장 완료" : "현재 설정 저장"}
          </button>
        </div>

        {/* 쿠키 카테고리 설정 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {cookieCategories.map(cat => (
            <div key={cat.id}
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${settings[cat.id] ? "rgba(212,146,10,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "24px 28px", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>{cat.name}</span>
                    {cat.required && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#D4920A", background: "rgba(212,146,10,0.12)", padding: "2px 8px", borderRadius: 100 }}>필수</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: 540 }}>{cat.desc}</p>
                </div>
                {/* Toggle Switch */}
                <button onClick={() => toggle(cat.id)}
                  style={{
                    width: 48, height: 26, borderRadius: 13, border: "none", cursor: cat.required ? "not-allowed" : "pointer",
                    background: settings[cat.id] ? "#D4920A" : "rgba(255,255,255,0.15)",
                    position: "relative", flexShrink: 0, transition: "background 0.2s",
                    opacity: cat.required ? 0.6 : 1,
                  }}>
                  <span style={{
                    position: "absolute", top: 3, left: settings[cat.id] ? 25 : 3,
                    width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                  }} />
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.examples.map(ex => (
                  <span key={ex} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 10px" }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 쿠키 상세 안내 */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>브라우저에서 쿠키 제어하기</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { browser: "Chrome", path: "설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터" },
              { browser: "Safari", path: "환경설정 → 개인 정보 보호 → 쿠키 및 웹 사이트 데이터" },
              { browser: "Firefox", path: "설정 → 개인 정보 및 보안 → 쿠키 및 사이트 데이터" },
              { browser: "Edge", path: "설정 → 쿠키 및 사이트 권한 → 쿠키 및 저장된 데이터" },
            ].map(b => (
              <div key={b.browser} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{b.browser}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{b.path}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16, lineHeight: 1.7 }}>
            ※ 쿠키를 차단하면 일부 서비스 기능이 제한될 수 있습니다. 특히 필수 쿠키를 차단하면 로그인이 불가능할 수 있습니다.
          </p>
        </div>

        <div style={{ padding: "24px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
            쿠키 정책 관련 문의: <a href="mailto:ceo@4dvision.co.kr" style={{ color: "#D4920A" }}>ceo@4dvision.co.kr</a>
            &nbsp;|&nbsp; <a href="/privacy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>개인정보처리방침</a>
            &nbsp;|&nbsp; <a href="/terms" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>이용약관</a>
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
