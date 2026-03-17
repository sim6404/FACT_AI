"use client";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import Link from "next/link";

const industries = [
  {
    id: "auto",
    label: "자동차부품",
    pain: [
      "완성차 업체의 PPM 기준 강화로 불량 비용 급증",
      "다품종 소량 생산 전환 시 납기 관리 복잡도 폭증",
      "IATF 16949 대응 문서화 작업에 인력 낭비",
    ],
    solution: [
      "SPC 기반 AI 불량 예측으로 PPM 80% 수준까지 관리",
      "수주-생산 연계 스케줄링으로 납기 준수율 99% 달성",
      "품질 기록 자동화 및 IATF 리포트 1-클릭 생성",
    ],
    metrics: [
      { label: "PPM 감소율", value: "62%" },
      { label: "납기 준수율", value: "99.1%" },
      { label: "문서화 시간 절감", value: "74%" },
    ],
  },
  {
    id: "rubber",
    label: "고무/방진",
    pain: [
      "배합 레시피 관리가 개인 노하우에 의존, 이직 시 단절",
      "방진 성능 측정 결과와 생산 공정 데이터 연계 불가",
      "다품종 소량 주문에 적정 재고 산정 어려움",
    ],
    solution: [
      "배합 데이터 AI 학습으로 최적 레시피 자동 추천",
      "성능 데이터-공정 변수 상관관계 분석으로 불량 예방",
      "수요 예측 모델 기반 안전재고 자동 산정",
    ],
    metrics: [
      { label: "레시피 재현율", value: "98.5%" },
      { label: "불량률 감소", value: "55%" },
      { label: "재고비용 절감", value: "29%" },
    ],
  },
  {
    id: "electronics",
    label: "전자부품",
    pain: [
      "반도체·PCB 공정 데이터 방대, 수작업 분석 한계",
      "고객사별 품질 기준 상이, 규격 관리 복잡",
      "단납기 요구에 생산 계획 수시 변경 발생",
    ],
    solution: [
      "공정 파라미터 AI 최적화로 수율 향상",
      "고객사별 품질 기준 자동 분류 및 검사 자동화",
      "AI 납기 예측으로 생산 계획 변경 최소화",
    ],
    metrics: [
      { label: "수율 향상", value: "8.3%p" },
      { label: "검사 자동화율", value: "91%" },
      { label: "계획 변경 횟수", value: "67%↓" },
    ],
  },
  {
    id: "heavy",
    label: "중장비",
    pain: [
      "대형 부품 재고 금액 과다, 회전율 관리 미흡",
      "협력사 납기 지연으로 생산 라인 중단 빈발",
      "복잡한 BOM 구조로 원가 산정 오류 발생",
    ],
    solution: [
      "재고 회전율 AI 분석으로 과잉 재고 20% 이상 감축",
      "협력사 납기 리스크 스코어링으로 사전 대응",
      "BOM 기반 원가 자동 산정 및 견적 정확도 향상",
    ],
    metrics: [
      { label: "재고비용 절감", value: "23%" },
      { label: "라인 중단 감소", value: "81%" },
      { label: "원가 정확도", value: "99.2%" },
    ],
  },
];

const personas = [
  {
    icon: "👔",
    role: "경영진",
    subtitle: "CEO · COO · CFO",
    benefits: [
      "매출·원가·재고를 한 화면에서 실시간 파악",
      "주간 경영 보고서 AI 자동 생성 (매주 월요일 오전 8시)",
      "경쟁사 대비 KPI 벤치마크 및 이상 조기 경보",
    ],
    color: "rgba(212,146,10,0.15)",
    border: "rgba(212,146,10,0.3)",
    accent: "#D4920A",
  },
  {
    icon: "🏭",
    role: "현장관리자",
    subtitle: "생산팀장 · 공장장",
    benefits: [
      "설비 가동률·불량률 실시간 모니터링 대시보드",
      "공정 이상 발생 시 즉시 알림 + 원인 분석 AI 제공",
      "생산 일보·주보 자동 작성으로 야근 제거",
    ],
    color: "rgba(99,179,237,0.1)",
    border: "rgba(99,179,237,0.25)",
    accent: "#63b3ed",
  },
  {
    icon: "🔬",
    role: "품질담당자",
    subtitle: "품질팀장 · QC 엔지니어",
    benefits: [
      "불량 패턴 AI 분석으로 근본 원인 즉시 파악",
      "고객 품질 클레임 데이터와 공정 데이터 자동 연계",
      "품질 성적서·검사 리포트 자동 생성",
    ],
    color: "rgba(104,211,145,0.1)",
    border: "rgba(104,211,145,0.25)",
    accent: "#68d391",
  },
];

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState("auto");
  const active = industries.find((i) => i.id === activeTab)!;

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
          paddingBottom: "80px",
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
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(212,146,10,0.1)",
              border: "1px solid rgba(212,146,10,0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "32px",
              fontSize: "13px",
              color: "#D4920A",
              fontWeight: 600,
            }}
          >
            <span style={{ width: "6px", height: "6px", background: "#D4920A", borderRadius: "50%", display: "inline-block" }} />
            업종별 맞춤 솔루션
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            귀사의 업종에{" "}
            <span style={{ color: "#D4920A" }}>최적화된</span>
            <br />
            AI 솔루션
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            자동차부품부터 중장비까지, 각 업종의 특수성을 반영한 AI 모델과 프로세스로
            즉시 성과를 냅니다.
          </p>
        </div>
      </section>

      {/* ── Industry Tabs ── */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "40px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "6px",
            flexWrap: "wrap",
          }}
        >
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(ind.id)}
              style={{
                flex: "1 1 auto",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === ind.id ? 700 : 500,
                background: activeTab === ind.id ? "#D4920A" : "transparent",
                color: activeTab === ind.id ? "#0a0a0a" : "rgba(255,255,255,0.6)",
                transition: "all 0.2s",
              }}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Pain points */}
          <div
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#fc8181",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              현재의 고민
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {active.pain.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: "#fc8181",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div
            style={{
              background: "rgba(212,146,10,0.05)",
              border: "1px solid rgba(212,146,10,0.2)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#D4920A",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              FACT AI 솔루션
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {active.solution.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "rgba(212,146,10,0.15)",
                      border: "1px solid rgba(212,146,10,0.35)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: "#D4920A",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {active.metrics.map((m) => (
            <div
              key={m.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#D4920A", marginBottom: "6px" }}>
                {m.value}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role-based ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
              직무별 맞춤 경험
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px" }}>
              역할마다 필요한 정보를 정확히 제공합니다
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {personas.map((p) => (
              <div
                key={p.role}
                style={{
                  background: p.color,
                  border: `1px solid ${p.border}`,
                  borderRadius: "20px",
                  padding: "36px 28px",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{p.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "4px" }}>{p.role}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>
                  {p.subtitle}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {p.benefits.map((b, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: p.accent, fontWeight: 700, fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Study ── */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            고객 성공 사례
          </h2>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(212,146,10,0.08) 0%, rgba(212,146,10,0.03) 100%)",
            border: "1px solid rgba(212,146,10,0.25)",
            borderRadius: "24px",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(212,146,10,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-block",
              background: "rgba(212,146,10,0.15)",
              border: "1px solid rgba(212,146,10,0.3)",
              borderRadius: "8px",
              padding: "4px 14px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#D4920A",
              marginBottom: "20px",
              letterSpacing: "0.05em",
            }}
          >
            고객사례 · 자동차부품
          </div>
          <h3 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "12px" }}>
            (주)영동테크 — 연간 254억 매출 AI 자동관리 구현
          </h3>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "600px" }}>
            자동차 방진 부품 전문 제조사 영동테크는 FACT AI 도입 6개월 만에 품질 불량률 62% 감소,
            월간 보고서 작성 시간 90% 절감을 달성했습니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px" }}>
            {[
              { value: "62%", label: "불량률 감소" },
              { value: "90%", label: "보고서 작성 시간 절감" },
              { value: "₩1.8억", label: "연간 비용 절감" },
              { value: "6개월", label: "ROI 달성 기간" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px",
                  padding: "20px 16px",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#D4920A", marginBottom: "6px" }}>{m.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{m.label}</div>
              </div>
            ))}
          </div>
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
          귀사 업종 전문가와 상담하세요
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "40px" }}>
          업종별 전문 컨설턴트가 맞춤 도입 방안을 제안합니다.
        </p>
        <Link
          href="/contact"
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
          무료 상담 신청 →
        </Link>
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
