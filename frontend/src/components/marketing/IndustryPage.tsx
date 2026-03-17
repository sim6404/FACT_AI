"use client";
import Link from "next/link";
import { MarketingNav } from "./MarketingNav";
import { MarketingFooter } from "./MarketingFooter";
import { Check, ArrowRight } from "lucide-react";

export interface IndustryData {
  badge: string;
  industry: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  accentColor: string;
  keyStats: { value: string; label: string }[];
  challenges: string[];
  solutions: { title: string; desc: string }[];
  useCases: { title: string; desc: string; kpi: string }[];
  testimonial?: { quote: string; name: string; title: string; company: string };
}

export function IndustryPage({ data }: { data: IndustryData }) {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "800px", height: "400px", background: `radial-gradient(ellipse, ${data.accentColor}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${data.accentColor}15`, border: `1px solid ${data.accentColor}35`, borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: data.accentColor, letterSpacing: "0.08em" }}>{data.badge}</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.12, marginBottom: "24px", letterSpacing: "-0.03em", maxWidth: "800px" }}>
            {data.headline}
            <br />
            <span style={{ color: data.accentColor }}>{data.headlineAccent}</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "620px" }}>
            {data.subheadline}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="mailto:ceo@4dvision.co.kr"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: data.accentColor, color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}
            >
              도입 문의하기 <ArrowRight style={{ width: "16px", height: "16px" }} />
            </a>
            <Link
              href="/platform"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 28px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
            >
              플랫폼 살펴보기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${data.keyStats.length}, 1fr)`, gap: "32px", textAlign: "center" }}>
          {data.keyStats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: data.accentColor, marginBottom: "6px" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            {data.industry} 업계의 공통 과제
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "40px", fontSize: "16px" }}>
            F.A.C.T AI가 해결하는 핵심 문제들
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {data.challenges.map((c) => (
              <div key={c} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px 20px" }}>
                <span style={{ color: data.accentColor, fontSize: "18px", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>×</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            F.A.C.T AI 솔루션
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "40px", fontSize: "16px" }}>
            AI 에이전트가 업무를 자동화하는 방법
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {data.solutions.map((s, i) => (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${data.accentColor}15`, border: `1px solid ${data.accentColor}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: data.accentColor, marginBottom: "16px" }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "40px", letterSpacing: "-0.02em" }}>
            도입 성과 사례
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {data.useCases.map((uc) => (
              <div key={uc.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: data.accentColor }}>{uc.kpi}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{uc.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {data.testimonial && (
        <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "32px" }}>
              "{data.testimonial.quote}"
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `${data.accentColor}20`, border: `1px solid ${data.accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: data.accentColor, fontSize: "16px" }}>
                {data.testimonial.name[0]}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{data.testimonial.name}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{data.testimonial.title} · {data.testimonial.company}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: `linear-gradient(135deg, ${data.accentColor}08 0%, transparent 60%)`, borderTop: `1px solid ${data.accentColor}20` }}>
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>
          {data.industry} 업계에 맞는<br />
          <span style={{ color: data.accentColor }}>맞춤형 AI 솔루션</span>을 받아보세요
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", marginBottom: "40px" }}>
          기업별 맞춤 비용 문의 · 무료 데모 체험 · 도입 컨설팅
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="mailto:ceo@4dvision.co.kr"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: data.accentColor, color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}
          >
            ceo@4dvision.co.kr 문의하기
          </a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
