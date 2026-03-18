"use client";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";

const TIERS = [
  {
    key: "starter",
    name: "스타터",
    tagline: "AI 도입을 시작하는 중소 기업에 최적화",
    highlight: false,
    features: [
      "사용자 5명",
      "3개 모듈 선택",
      "기본 AI 자연어 질의",
      "외부 시스템 3개 연동",
      "이메일 기술 지원",
      "온라인 교육 자료",
    ],
  },
  {
    key: "pro",
    name: "프로",
    tagline: "성장하는 기업을 위한 완전한 AI 자동화 플랜",
    highlight: true,
    badge: "가장 인기",
    features: [
      "사용자 20명",
      "6개 전체 모듈",
      "고급 AI 질의 + 에이전트 자동화",
      "Cortex Search 문서 검색",
      "주간 보고서 자동 생성",
      "외부 시스템 10개 연동",
      "SLA 99.5% 보장",
      "이메일 + 채팅 기술 지원",
    ],
  },
  {
    key: "enterprise",
    name: "엔터프라이즈",
    tagline: "대규모 조직과 복잡한 요구사항을 위한 맞춤형",
    highlight: false,
    features: [
      "무제한 사용자",
      "커스텀 AI 모델 파인튜닝",
      "무제한 시스템 연동",
      "온프레미스 / VPC 전용 배포",
      "전담 고객 성공 매니저 배정",
      "SLA 99.9% 보장",
      "24/7 전화 기술 지원",
      "현장 방문 도입 교육",
    ],
  },
];

const features = [
  { name: "사용자 수", starter: "5명", pro: "20명", enterprise: "무제한" },
  { name: "AI 모듈 수", starter: "3개", pro: "6개 전체", enterprise: "6개 + 커스텀" },
  { name: "Cortex Analyst (자연어 질의)", starter: "기본", pro: "고급", enterprise: "고급" },
  { name: "Cortex Search", starter: "✗", pro: "✓", enterprise: "✓" },
  { name: "Cortex Agents (자동화)", starter: "✗", pro: "✓", enterprise: "✓" },
  { name: "주간 보고서 자동 생성", starter: "✗", pro: "✓", enterprise: "✓" },
  { name: "외부 시스템 연동 수", starter: "3개", pro: "10개", enterprise: "무제한" },
  { name: "데이터 보관 기간", starter: "1년", pro: "3년", enterprise: "무제한" },
  { name: "SLA 보장", starter: "✗", pro: "99.5%", enterprise: "99.9%" },
  { name: "전담 고객 성공 매니저", starter: "✗", pro: "✗", enterprise: "✓" },
  { name: "온프레미스/VPC 배포", starter: "✗", pro: "✗", enterprise: "✓" },
  { name: "기술 지원", starter: "이메일", pro: "이메일+채팅", enterprise: "24/7 전화" },
];

const faqs = [
  {
    q: "비용은 어떻게 산정되나요?",
    a: "기업 규모, 사용 모듈 수, 데이터 연동 범위, 배포 방식(클라우드/온프레미스)에 따라 맞춤형으로 산정됩니다. ceo@4dvision.co.kr로 문의 주시면 담당자가 48시간 내 제안서를 드립니다.",
  },
  {
    q: "계약 기간은 어떻게 되나요?",
    a: "월간 또는 연간 계약을 선택할 수 있으며, 연간 계약 시 더 유리한 조건이 적용됩니다. 엔터프라이즈는 별도 협의로 진행합니다.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "모든 데이터는 국내 클라우드 환경(AWS ap-northeast-2 서울 리전)에 저장됩니다. 엔터프라이즈 고객은 VPC 격리 환경 또는 온프레미스 배포를 선택할 수 있습니다.",
  },
  {
    q: "커스터마이징이 가능한가요?",
    a: "프로 플랜은 대시보드 레이아웃 및 KPI 항목 커스터마이징을 지원합니다. 엔터프라이즈 플랜은 AI 모델 파인튜닝, 커스텀 워크플로우, 브랜드 화이트레이블까지 지원합니다.",
  },
  {
    q: "도입 교육은 어떻게 진행되나요?",
    a: "모든 플랜에 온라인 교육 자료와 영상 튜토리얼이 제공됩니다. 프로 이상은 도입 초기 2회 화상 온보딩 세션이 포함됩니다. 엔터프라이즈는 현장 방문 교육을 제공합니다.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "128px", paddingBottom: "64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "350px", background: "radial-gradient(ellipse, rgba(212,146,10,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A", letterSpacing: "0.08em" }}>기업별 맞춤 비용</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-0.02em" }}>
            합리적인 도입 비용,{" "}
            <span style={{ color: "#D4920A" }}>기업에 맞게 설계</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            기업 규모와 요구사항에 맞는 맞춤형 비용을 제안해 드립니다.<br />
            도입 문의 후 48시간 내 담당자가 제안서를 드립니다.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:ceo@4dvision.co.kr"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}
            >
              <Mail style={{ width: "18px", height: "18px" }} />
              ceo@4dvision.co.kr 문의하기
            </a>
            <a
              href="tel:031-901-4823"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 28px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", textDecoration: "none" }}
            >
              <Phone style={{ width: "18px", height: "18px" }} />
              031-901-4823
            </a>
            <a
              href="tel:010-9039-0329"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", padding: "14px 28px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", textDecoration: "none" }}
            >
              <Phone style={{ width: "18px", height: "18px" }} />
              010-9039-0329
            </a>
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "stretch" }}>
          {TIERS.map((tier) => (
            <div
              key={tier.key}
              style={{
                background: tier.highlight
                  ? "linear-gradient(135deg, rgba(212,146,10,0.12) 0%, rgba(212,146,10,0.05) 100%)"
                  : "rgba(255,255,255,0.03)",
                border: tier.highlight ? "1px solid rgba(212,146,10,0.4)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {tier.badge && (
                <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "#D4920A", color: "#0a0a0a", fontSize: "12px", fontWeight: 800, padding: "4px 16px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                  {tier.badge}
                </div>
              )}
              <div style={{ fontSize: "13px", fontWeight: 700, color: tier.highlight ? "#D4920A" : "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                {tier.name}
              </div>
              <p style={{ fontSize: "14px", color: tier.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "28px" }}>
                {tier.tagline}
              </p>

              {/* Contact CTA */}
              <div
                style={{
                  background: "rgba(212,146,10,0.08)",
                  border: "1px solid rgba(212,146,10,0.2)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  marginBottom: "28px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>기업별 커스터마이징 비용 문의</div>
                <a
                  href="mailto:ceo@4dvision.co.kr"
                  style={{ fontSize: "15px", fontWeight: 700, color: "#D4920A", textDecoration: "none" }}
                >
                  ceo@4dvision.co.kr
                </a>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: tier.highlight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.7)", alignItems: "flex-start" }}>
                    <Check style={{ width: "16px", height: "16px", color: tier.highlight ? "#D4920A" : "#68d391", flexShrink: 0, marginTop: "1px" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:ceo@4dvision.co.kr"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "14px",
                  borderRadius: "10px",
                  background: tier.highlight ? "#D4920A" : "rgba(255,255,255,0.08)",
                  border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.15)",
                  color: tier.highlight ? "#0a0a0a" : "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                도입 문의하기
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "40px", textAlign: "center" }}>
            플랜별 기능 비교
          </h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>기능</div>
              {["스타터", "프로", "엔터프라이즈"].map((t, i) => (
                <div key={t} style={{ fontSize: "13px", fontWeight: 700, color: i === 1 ? "#D4920A" : "rgba(255,255,255,0.7)", textAlign: "center" }}>{t}</div>
              ))}
            </div>
            {features.map((feat, idx) => (
              <div
                key={feat.name}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: idx < features.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", alignItems: "center" }}
              >
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>{feat.name}</div>
                {[feat.starter, feat.pro, feat.enterprise].map((val, ci) => (
                  <div key={ci} style={{ fontSize: "13px", textAlign: "center", color: val === "✗" ? "rgba(255,255,255,0.2)" : val === "✓" ? "#68d391" : ci === 1 ? "#D4920A" : "rgba(255,255,255,0.7)", fontWeight: val === "✓" || val === "✗" ? 700 : 500 }}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "40px", textAlign: "center" }}>
          자주 묻는 질문
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${openFaq === i ? "rgba(212,146,10,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", overflow: "hidden" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#fff", textAlign: "left", gap: "16px" }}
              >
                <span style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{ fontSize: "20px", color: openFaq === i ? "#D4920A" : "rgba(255,255,255,0.4)", flexShrink: 0, fontWeight: 300, transition: "transform 0.2s, color 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "inline-block" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: "rgba(212,146,10,0.05)", borderTop: "1px solid rgba(212,146,10,0.15)" }}>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, marginBottom: "16px" }}>
          비용 문의 & 데모 신청
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "8px" }}>
          기업별 맞춤 비용 문의 · 무료 데모 체험 · 도입 컨설팅
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "40px" }}>
          문의 후 48시간 내 전문 담당자가 연락드립니다.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="mailto:ceo@4dvision.co.kr"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}
          >
            <Mail style={{ width: "18px", height: "18px" }} />
            ceo@4dvision.co.kr
          </a>
          <a
            href="tel:031-901-4823"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "16px 32px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", textDecoration: "none" }}
          >
            <Phone style={{ width: "16px", height: "16px" }} />
            031-901-4823
          </a>
          <a
            href="tel:010-9039-0329"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", padding: "16px 32px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", textDecoration: "none" }}
          >
            <Phone style={{ width: "16px", height: "16px" }} />
            010-9039-0329
          </a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
