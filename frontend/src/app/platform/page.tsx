import { MarketingNav } from "@/components/marketing/MarketingNav";
import Link from "next/link";

export const metadata = {
  title: "플랫폼 | F.A.C.T AI — 제조 AI 통합 플랫폼",
  description:
    "Snowflake Cortex AI 기반의 제조 데이터 통합 플랫폼. 생산·품질·영업·구매 전 공정을 하나의 AI 플랫폼으로.",
};

const modules = [
  {
    icon: "⚙️",
    name: "생산관리",
    desc: "실시간 생산 현황 모니터링, 공정 이상 자동 감지, 설비 가동률 최적화",
    metric: "OEE 15%↑",
  },
  {
    icon: "🔬",
    name: "품질관리",
    desc: "불량 패턴 AI 예측, SPC 자동 분석, 고객사 품질 리포트 자동 생성",
    metric: "불량률 62%↓",
  },
  {
    icon: "📊",
    name: "영업관리",
    desc: "수주 예측 모델, 고객별 수익성 분석, 견적-수주 파이프라인 자동화",
    metric: "수주율 28%↑",
  },
  {
    icon: "📦",
    name: "구매·자재",
    desc: "재고 소진 예측, 발주 자동 제안, 공급업체 리드타임 최적화",
    metric: "재고비용 31%↓",
  },
  {
    icon: "📋",
    name: "수주관리",
    desc: "납기 자동 계산, 수주-생산 연계 스케줄링, 납기 위험 사전 알림",
    metric: "납기 준수율 99%",
  },
  {
    icon: "🏭",
    name: "재고관리",
    desc: "창고별 재고 실시간 추적, 안전재고 AI 산정, 재고 회전율 분석",
    metric: "재고 정확도 99.7%",
  },
];

const cortexFeatures = [
  {
    name: "Cortex Analyst",
    tag: "자연어 질의",
    desc: "복잡한 SQL 없이 자연어로 데이터를 질의하세요. 생산량, 불량률, 매출 등 어떤 데이터든 한국어로 물으면 즉시 분석 결과를 제공합니다.",
    detail: "Snowflake Semantic Layer 기반 · 할루시네이션 없는 정확한 수치 답변",
  },
  {
    name: "Cortex Search",
    tag: "하이브리드 검색",
    desc: "수백만 건의 품질 기록, 도면, 검사 리포트를 벡터+키워드 하이브리드 검색으로 즉시 탐색합니다.",
    detail: "벡터 임베딩 + BM25 · 다국어 지원 · 밀리초 응답",
  },
  {
    name: "Cortex Agents",
    tag: "자율 에이전트",
    desc: "월간 보고서 작성, 이상 감지 후 담당자 알림, 발주서 자동 생성까지 — 반복 업무를 AI가 자율적으로 처리합니다.",
    detail: "Tool-use · 멀티스텝 추론 · 사람 검토 후 실행",
  },
];

const integrations = [
  "SAP ERP",
  "Oracle ERP",
  "MES (다양)",
  "WMS",
  "CRM",
  "Snowflake",
  "AWS S3",
  "Azure Blob",
  "Google Drive",
  "Slack",
  "Teams",
  "이메일",
];

const securityFeatures = [
  {
    icon: "🔐",
    title: "데이터 암호화",
    desc: "저장 데이터 AES-256, 전송 데이터 TLS 1.3 암호화. 키 관리는 고객 전용 KMS.",
  },
  {
    icon: "👁️",
    title: "접근 제어",
    desc: "역할 기반 접근 제어(RBAC), 부서·직급별 데이터 마스킹, 감사 로그 전체 보관.",
  },
  {
    icon: "🛡️",
    title: "규정 준수",
    desc: "개인정보보호법(PIPA), GDPR, 산업보안법 완전 준수. 연 2회 외부 보안 감사.",
  },
];

export default function PlatformPage() {
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
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(212,146,10,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
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
            Powered by Snowflake Cortex AI
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            하나의 플랫폼으로
            <br />
            <span style={{ color: "#D4920A" }}>모든 제조 데이터를</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: "640px",
              margin: "0 auto 40px",
            }}
          >
            Snowflake Cortex AI의 자연어 분석, 하이브리드 검색, 자율 에이전트를 제조 현장에 그대로 적용합니다.
            ERP·MES·WMS 데이터를 통합하고, AI가 인사이트를 발굴해 업무를 자동화합니다.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                background: "#D4920A",
                color: "#0a0a0a",
                padding: "14px 32px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              데모 신청하기
            </Link>
            <Link
              href="/cases"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              고객 사례 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            3계층 AI 아키텍처
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px" }}>
            데이터 수집부터 업무 자동화까지, 검증된 Snowflake 아키텍처 위에 구축
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: "0",
            alignItems: "center",
          }}
        >
          {[
            {
              layer: "01",
              title: "데이터 수집",
              color: "rgba(99,179,237,0.15)",
              borderColor: "rgba(99,179,237,0.3)",
              accent: "#63b3ed",
              items: ["ERP 연동", "MES 실시간 수집", "IoT 센서 데이터", "문서 파일 (PDF/Excel)"],
            },
            {
              layer: "02",
              title: "AI 분석",
              color: "rgba(212,146,10,0.15)",
              borderColor: "rgba(212,146,10,0.35)",
              accent: "#D4920A",
              items: ["Cortex Analyst", "Cortex Search", "Cortex Agents", "Semantic Layer"],
            },
            {
              layer: "03",
              title: "업무 자동화",
              color: "rgba(104,211,145,0.15)",
              borderColor: "rgba(104,211,145,0.3)",
              accent: "#68d391",
              items: ["보고서 자동 생성", "이상 알림·대응", "발주서 자동화", "대시보드 인사이트"],
            },
          ].map((item, i) => (
            <>
              <div
                key={item.layer}
                style={{
                  background: item.color,
                  border: `1px solid ${item.borderColor}`,
                  borderRadius: "16px",
                  padding: "32px 28px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: item.accent,
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  LAYER {item.layer}
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px" }}>
                  {item.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {item.items.map((it) => (
                    <li
                      key={it}
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.75)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ width: "4px", height: "4px", background: item.accent, borderRadius: "50%", flexShrink: 0 }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              {i < 2 && (
                <div
                  key={`arrow-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 16px",
                    color: "#D4920A",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              )}
            </>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
          Snowflake Data Cloud 위에 구축 · 온프레미스 배포 옵션 제공
        </p>
      </section>

      {/* ── Core Modules ── */}
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
              6대 핵심 모듈
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px" }}>
              제조업 전 공정을 커버하는 완성형 AI 모듈
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {modules.map((mod) => (
              <div
                key={mod.name}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "28px",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{mod.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
                  {mod.name}
                </div>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "20px" }}>
                  {mod.desc}
                </p>
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(212,146,10,0.12)",
                    border: "1px solid rgba(212,146,10,0.25)",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#D4920A",
                  }}
                >
                  {mod.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cortex AI Features ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            Snowflake Cortex AI 기능
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px" }}>
            엔터프라이즈급 AI를 제조 현장에서 바로 활용
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {cortexFeatures.map((feat) => (
            <div
              key={feat.name}
              style={{
                background: "rgba(212,146,10,0.05)",
                border: "1px solid rgba(212,146,10,0.2)",
                borderRadius: "20px",
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(212,146,10,0.15)",
                  border: "1px solid rgba(212,146,10,0.3)",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#D4920A",
                  marginBottom: "16px",
                  letterSpacing: "0.05em",
                }}
              >
                {feat.tag}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "14px" }}>{feat.name}</div>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "20px" }}>
                {feat.desc}
              </p>
              <p style={{ fontSize: "13px", color: "rgba(212,146,10,0.7)", lineHeight: 1.5 }}>
                {feat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Integrations ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            30+ 시스템과 연동
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px", marginBottom: "48px" }}>
            기존 시스템을 교체할 필요 없이, FACT AI가 데이터를 통합합니다
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {integrations.map((name) => (
              <div
                key={name}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <p style={{ marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            REST API / Webhook / DB 직접 연동 지원 · 커스텀 커넥터 개발 가능
          </p>
        </div>
      </section>

      {/* ── Security ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            엔터프라이즈 보안
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px", marginBottom: "32px" }}>
            제조 산업 기밀 데이터를 안전하게 보호합니다
          </p>
          {/* Badges */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" }}>
            {["ISO 27001", "ISMS-P", "SOC 2 Type II"].map((badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(104,211,145,0.08)",
                  border: "1px solid rgba(104,211,145,0.25)",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#68d391",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "16px" }}>✓</span> {badge}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {securityFeatures.map((feat) => (
            <div
              key={feat.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "28px",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{feat.icon}</div>
              <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>{feat.title}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{feat.desc}</p>
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
          지금 데모 신청하기
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "40px" }}>
          30분 무료 데모로 귀사 데이터에 맞춘 AI 분석을 직접 확인하세요.
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
          무료 데모 신청 →
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
