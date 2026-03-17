"use client";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

const CASES = [
  { industry: "자동차 부품 제조", company: "영동테크", kpi: "PPM 31% 개선, 보고서 자동화 100%", desc: "주간 품질 보고서 작성 시간 8시간 → 0시간. AI 에이전트가 불량 원인을 자동 추적합니다.", href: "/industries/manufacturing", color: "#D4920A" },
  { industry: "금융서비스", company: "중견 금융사", kpi: "컴플라이언스 보고 85% 자동화", desc: "규제 보고서 수작업 작성 부담을 AI 자동화로 해소하고 리스크 감지 속도를 60% 향상.", href: "/industries/financial", color: "#3b82f6" },
  { industry: "리테일·이커머스", company: "유통 대기업", kpi: "재고 손실 25%↓, 프로모션 ROI 3X", desc: "AI 수요 예측으로 과잉 재고를 줄이고 캠페인 ROI를 3배 향상시킨 실제 성과.", href: "/industries/retail", color: "#f59e0b" },
  { industry: "의료·헬스케어", company: "종합병원", kpi: "행정 업무 50%↓, 병상 가동률 35%↑", desc: "반복 행정 업무 자동화로 의료진이 환자에 집중하고 병상 운영 효율을 35% 개선.", href: "/industries/healthcare", color: "#10b981" },
  { industry: "에너지·유틸리티", company: "발전 기업", kpi: "설비 장애 40%↓, 에너지 낭비 20%↓", desc: "AI 예측 정비로 비계획 설비 정지를 줄이고 에너지 운영 효율을 대폭 향상.", href: "/industries/energy", color: "#f97316" },
  { industry: "통신", company: "통신사", kpi: "이탈률 30%↓, ARPU 25%↑", desc: "AI 이탈 예측과 맞춤형 서비스 추천으로 고객 유지율과 수익성을 동시에 개선.", href: "/industries/telecom", color: "#06b6d4" },
];

export default function CasesPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "350px", background: "radial-gradient(ellipse, rgba(212,146,10,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A", letterSpacing: "0.08em" }}>CUSTOMER STORIES</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-0.02em" }}>
            고객 성공 사례
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            F.A.C.T AI를 도입한 기업들의 실제 성과를 확인하세요.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {CASES.map((c) => (
            <Link
              key={c.company}
              href={c.href}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px", transition: "border-color 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${c.color}40`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${c.color}15`, border: `1px solid ${c.color}30`, borderRadius: "100px", padding: "4px 12px", marginBottom: "20px", width: "fit-content" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: c.color }}>{c.industry}</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>{c.company}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: c.color, marginBottom: "12px" }}>{c.kpi}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, flexGrow: 1 }}>{c.desc}</p>
              <div style={{ marginTop: "20px", fontSize: "13px", fontWeight: 600, color: c.color }}>
                산업 솔루션 보기 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(212,146,10,0.04)", borderTop: "1px solid rgba(212,146,10,0.12)" }}>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, marginBottom: "16px" }}>
          귀사의 성공 사례를 만들어보세요
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", marginBottom: "32px" }}>
          기업별 맞춤 비용 문의 · ceo@4dvision.co.kr
        </p>
        <a
          href="mailto:ceo@4dvision.co.kr"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}
        >
          도입 문의하기
        </a>
      </section>

      <MarketingFooter />
    </div>
  );
}
