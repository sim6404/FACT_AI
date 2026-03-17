"use client";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import Link from "next/link";

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
    q: "계약 기간은 어떻게 되나요?",
    a: "스타터·프로 플랜은 월간 또는 연간 계약을 선택할 수 있습니다. 연간 결제 시 20% 할인이 적용됩니다. 엔터프라이즈는 별도 협의로 진행합니다.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "모든 데이터는 Snowflake Data Cloud(AWS ap-northeast-2 리전, 서울)에 저장됩니다. 엔터프라이즈 고객은 VPC 격리 환경 또는 온프레미스 배포를 선택할 수 있습니다.",
  },
  {
    q: "커스터마이징이 가능한가요?",
    a: "프로 플랜은 대시보드 레이아웃 및 KPI 항목 커스터마이징을 지원합니다. 엔터프라이즈 플랜은 AI 모델 파인튜닝, 커스텀 워크플로우, 브랜드 화이트레이블까지 지원합니다.",
  },
  {
    q: "도입 교육은 어떻게 진행되나요?",
    a: "모든 플랜에 온라인 교육 자료와 영상 튜토리얼이 제공됩니다. 프로 이상은 도입 초기 2회 화상 온보딩 세션이 포함됩니다. 엔터프라이즈는 현장 방문 교육을 제공합니다.",
  },
  {
    q: "기술 지원은 어떻게 받나요?",
    a: "스타터는 이메일 지원(평일 09-18시, 24시간 내 응답), 프로는 실시간 채팅 지원(평일 09-22시)이 추가됩니다. 엔터프라이즈는 24/7 전화 지원 및 전담 매니저가 배정됩니다.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const starterPrice = annual ? Math.round(590000 * 0.8) : 590000;
  const proPrice = annual ? Math.round(1490000 * 0.8) : 1490000;

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily:
          "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <MarketingNav />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "128px",
          paddingBottom: "64px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "350px",
            background: "radial-gradient(ellipse, rgba(212,146,10,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            투명한 가격,{" "}
            <span style={{ color: "#D4920A" }}>명확한 가치</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            숨겨진 비용 없이 필요한 기능만큼 합리적으로. 30일 무료 체험 후 결정하세요.
          </p>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <span style={{ fontSize: "14px", color: annual ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: annual ? 400 : 600 }}>
              월간 결제
            </span>
            <button
              onClick={() => setAnnual((v) => !v)}
              style={{
                width: "52px",
                height: "28px",
                borderRadius: "100px",
                background: annual ? "#D4920A" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.25s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "3px",
                  left: annual ? "26px" : "3px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.25s",
                  display: "block",
                }}
              />
            </button>
            <span style={{ fontSize: "14px", color: annual ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: annual ? 600 : 400 }}>
              연간 결제
            </span>
            {annual && (
              <span
                style={{
                  background: "rgba(104,211,145,0.15)",
                  border: "1px solid rgba(104,211,145,0.3)",
                  borderRadius: "100px",
                  padding: "3px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#68d391",
                }}
              >
                20% 절약
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "stretch" }}>

          {/* Starter */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              스타터
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "42px", fontWeight: 900 }}>₩{starterPrice.toLocaleString()}</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>/월</span>
            </div>
            {annual && (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
                연 {(starterPrice * 12).toLocaleString()}원 청구
              </div>
            )}
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "28px", marginTop: "12px" }}>
              AI 도입을 시작하는 소규모 제조사에 최적화된 플랜
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {["사용자 5명", "3개 모듈 선택", "기본 AI 질의", "외부 시스템 3개 연동", "이메일 기술 지원"].map((f) => (
                <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#68d391", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <div style={{ flexGrow: 1 }} />
            <Link
              href="/start"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              30일 무료 체험
            </Link>
          </div>

          {/* Pro — Most Popular */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(212,146,10,0.12) 0%, rgba(212,146,10,0.05) 100%)",
              border: "1px solid rgba(212,146,10,0.4)",
              borderRadius: "24px",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-13px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#D4920A",
                color: "#0a0a0a",
                fontSize: "12px",
                fontWeight: 800,
                padding: "4px 16px",
                borderRadius: "100px",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              가장 인기 있는 플랜
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#D4920A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              프로
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "42px", fontWeight: 900 }}>₩{proPrice.toLocaleString()}</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>/월</span>
            </div>
            {annual && (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
                연 {(proPrice * 12).toLocaleString()}원 청구
              </div>
            )}
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "28px", marginTop: "12px" }}>
              성장하는 제조사를 위한 완전한 AI 자동화 플랜
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "사용자 20명",
                "6개 전체 모듈",
                "고급 AI 질의 + 에이전트",
                "Cortex Search 포함",
                "주간 보고서 자동 생성",
                "외부 시스템 10개 연동",
                "SLA 99.5% 보장",
                "이메일+채팅 기술 지원",
              ].map((f) => (
                <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <span style={{ color: "#D4920A", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <div style={{ flexGrow: 1 }} />
            <Link
              href="/start"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                borderRadius: "10px",
                background: "#D4920A",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              30일 무료 체험
            </Link>
          </div>

          {/* Enterprise */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              엔터프라이즈
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "32px", fontWeight: 900 }}>별도 문의</span>
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "28px", marginTop: "12px" }}>
              대규모 조직과 복잡한 요구사항을 위한 맞춤 솔루션
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "무제한 사용자",
                "커스텀 AI 모델 파인튜닝",
                "무제한 시스템 연동",
                "온프레미스/VPC 배포",
                "전담 고객 성공 매니저",
                "SLA 99.9% 보장",
                "24/7 전화 기술 지원",
                "현장 방문 교육",
              ].map((f) => (
                <li key={f} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#68d391", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <div style={{ flexGrow: 1 }} />
            <Link
              href="/contact"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              영업팀 문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Comparison ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "40px", textAlign: "center" }}>
            플랜별 기능 비교
          </h2>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "16px 24px",
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>기능</div>
              {["스타터", "프로", "엔터프라이즈"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: i === 1 ? "#D4920A" : "rgba(255,255,255,0.7)",
                    textAlign: "center",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
            {/* Rows */}
            {features.map((feat, idx) => (
              <div
                key={feat.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "14px 24px",
                  borderBottom: idx < features.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>{feat.name}</div>
                {[feat.starter, feat.pro, feat.enterprise].map((val, ci) => (
                  <div
                    key={ci}
                    style={{
                      fontSize: "13px",
                      textAlign: "center",
                      color:
                        val === "✗"
                          ? "rgba(255,255,255,0.2)"
                          : val === "✓"
                          ? "#68d391"
                          : ci === 1
                          ? "#D4920A"
                          : "rgba(255,255,255,0.7)",
                      fontWeight: val === "✓" || val === "✗" ? 700 : 500,
                    }}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, marginBottom: "40px", textAlign: "center" }}>
          자주 묻는 질문
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${openFaq === i ? "rgba(212,146,10,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  textAlign: "left",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.4 }}>{faq.q}</span>
                <span
                  style={{
                    fontSize: "20px",
                    color: openFaq === i ? "#D4920A" : "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                    fontWeight: 300,
                    transition: "transform 0.2s, color 0.2s",
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    display: "inline-block",
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 24px 20px",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background: "rgba(212,146,10,0.05)",
          borderTop: "1px solid rgba(212,146,10,0.15)",
        }}
      >
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, marginBottom: "16px" }}>
          30일 무료로 시작하세요
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "12px" }}>
          신용카드 불필요 · 약정 없음 · 언제든 취소 가능
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "40px" }}>
          30일 체험 종료 후 자동으로 요금이 청구되지 않습니다.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/start"
            style={{
              background: "#D4920A",
              color: "#0a0a0a",
              padding: "16px 40px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            무료 체험 시작 →
          </Link>
          <Link
            href="/contact"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            영업팀 문의
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.35)",
          fontSize: "13px",
        }}
      >
        <p>© 2025 (주)포디. All rights reserved.</p>
        <p style={{ marginTop: "8px" }}>
          서울특별시 강남구 테헤란로 123, FACT AI 타워 &nbsp;|&nbsp;
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>개인정보처리방침</Link>
          &nbsp;|&nbsp;
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>이용약관</Link>
        </p>
      </footer>
    </div>
  );
}
