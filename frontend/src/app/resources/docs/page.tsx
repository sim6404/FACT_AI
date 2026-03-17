import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "개발자 문서 | F.A.C.T AI",
  description: "F.A.C.T AI 플랫폼 API 레퍼런스, 퀵스타트 가이드, SDK 문서, 통합 가이드.",
};

const docSections = [
  {
    category: "시작하기",
    docs: [
      { title: "플랫폼 개요 및 아키텍처", desc: "F.A.C.T AI의 전체 구조와 핵심 개념 이해", badge: "필수" },
      { title: "5분 퀵스타트", desc: "계정 생성부터 첫 번째 AI 쿼리 실행까지", badge: "필수" },
      { title: "API 키 발급 및 인증", desc: "API 키 생성, 권한 설정, 보안 관리", badge: "필수" },
      { title: "샌드박스 환경 설정", desc: "프로덕션 영향 없는 개발·테스트 환경 구축", badge: null },
    ],
  },
  {
    category: "API 레퍼런스",
    docs: [
      { title: "에이전트 API", desc: "AI 에이전트 쿼리, 작업 실행, 결과 조회", badge: "v2.0" },
      { title: "분석 API", desc: "데이터 조회, KPI 계산, 트렌드 분석", badge: "v2.0" },
      { title: "보고서 API", desc: "보고서 생성, 템플릿 관리, 스케줄링", badge: "v2.0" },
      { title: "웹훅 API", desc: "이벤트 구독, 웹훅 엔드포인트 설정", badge: "v1.5" },
    ],
  },
  {
    category: "SDK & 라이브러리",
    docs: [
      { title: "Python SDK", desc: "pip install fact-ai-sdk | 전체 API 래퍼", badge: "v1.2.0" },
      { title: "Node.js / TypeScript SDK", desc: "npm install @fact-ai/sdk | TypeScript 완전 지원", badge: "v1.1.0" },
      { title: "REST API 직접 호출", desc: "언어 무관 HTTP 기반 직접 연동 가이드", badge: null },
    ],
  },
  {
    category: "통합 가이드",
    docs: [
      { title: "SAP ERP 연동", desc: "SAP RFC/BAPI를 통한 실시간 데이터 동기화", badge: null },
      { title: "더존 WEHAGO 연동", desc: "WEHAGO Open API를 통한 회계·HR 데이터 통합", badge: null },
      { title: "Snowflake 직접 연결", desc: "Snowflake Native App 및 Cortex API 설정", badge: null },
      { title: "Excel / CSV 데이터 업로드", desc: "벌크 데이터 업로드 및 자동 스키마 감지", badge: null },
    ],
  },
];

export default function DocsPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      <section style={{ paddingTop: "130px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>DEVELOPER DOCS</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>개발자 문서</h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", marginBottom: "56px" }}>
            API 레퍼런스, SDK 가이드, 통합 문서를 한 곳에서 확인하세요.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {docSections.map((section) => (
              <div key={section.category}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#D4920A", marginBottom: "16px" }}>{section.category}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                  {section.docs.map((doc) => (
                    <div key={doc.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700 }}>{doc.title}</h3>
                        {doc.badge && (
                          <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(212,146,10,0.15)", color: "#D4920A", padding: "2px 8px", borderRadius: "4px", flexShrink: 0, marginLeft: "8px" }}>{doc.badge}</span>
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{doc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "60px", background: "rgba(212,146,10,0.06)", border: "1px solid rgba(212,146,10,0.2)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "12px" }}>문서에서 원하는 내용을 찾지 못하셨나요?</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>기술 지원팀이 직접 도와드립니다</p>
            <a href="mailto:ceo@4dvision.co.kr" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "12px 28px", borderRadius: "10px", fontWeight: 800, fontSize: "14px", textDecoration: "none" }}>
              기술 지원 문의
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
