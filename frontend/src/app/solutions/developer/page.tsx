import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "개발자를 위한 F.A.C.T AI",
  description: "REST API, SDK, 웹훅으로 AI 에이전트를 자유롭게 커스터마이징. 개발자 친화적 플랫폼.",
};

const apiFeatures = [
  { icon: "📡", title: "REST API 완전 지원", desc: "모든 기능을 REST API로 제공. OpenAPI 3.0 스펙 문서 자동 생성. Postman 컬렉션 즉시 제공." },
  { icon: "🧩", title: "Python & Node.js SDK", desc: "공식 SDK로 몇 줄의 코드로 AI 에이전트, 분석, 자동화 기능을 앱에 통합." },
  { icon: "🔔", title: "웹훅 & 이벤트", desc: "KPI 이상, 보고서 완성, 승인 완료 등 이벤트 발생 시 웹훅으로 즉시 알림." },
  { icon: "🔑", title: "API 키 관리", desc: "팀별·서비스별 API 키 발급, 권한 범위 설정, 사용량 모니터링 대시보드 제공." },
  { icon: "🧪", title: "샌드박스 환경", desc: "실제 프로덕션 데이터에 영향 없이 개발·테스트할 수 있는 독립 샌드박스 환경." },
  { icon: "📚", title: "개발자 문서", desc: "퀵스타트 가이드, API 레퍼런스, 튜토리얼, 코드 샘플로 구성된 풍부한 개발자 문서." },
];

const codeSnippet = `# F.A.C.T AI Python SDK 예시
from fact_ai import Client

client = Client(api_key="your_api_key")

# AI 에이전트에 질문
result = client.agent.query(
    question="이번달 고객사별 매출 달성률 분석해줘",
    context="manufacturing"
)

print(result.answer)
print(result.data)  # 구조화된 데이터 반환

# 보고서 자동 생성
report = client.reports.generate(
    type="weekly_quality",
    week="2026-W09",
    format="pdf"
)
report.save("quality_report.pdf")`;

export default function DeveloperPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>FOR DEVELOPERS</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              AI 기능을 앱에<br />
              <span style={{ color: "#D4920A" }}>몇 줄로 통합</span>
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "36px" }}>
              완전한 API, SDK, 웹훅으로 F.A.C.T AI의 모든 기능을 여러분의 애플리케이션에 자유롭게 통합하세요.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/resources/docs" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "12px 24px", borderRadius: "10px", fontWeight: 800, fontSize: "14px", textDecoration: "none" }}>
                문서 보기
              </Link>
              <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "12px 24px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                API 키 신청
              </Link>
            </div>
          </div>
          <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", fontFamily: "monospace" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
            </div>
            <pre style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", margin: 0, overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {codeSnippet}
            </pre>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>개발자 도구 & 기능</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {apiFeatures.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>지금 바로 빌드 시작</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>무료 API 키로 샌드박스 환경에서 바로 개발을 시작하세요</p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            API 키 무료 신청 →
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
