import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "통합·연동 | F.A.C.T AI",
  description: "ERP·MES·클라우드·외부 서비스와 즉시 연동. 사전 빌드 커넥터로 복잡한 개발 없이 데이터 통합.",
};

const connectors = [
  { category: "ERP 시스템", items: ["SAP ERP", "Oracle ERP", "더존 WEHAGO", "영림원 K-System", "커스텀 ERP"] },
  { category: "MES / 생산", items: ["Siemens MES", "Rockwell", "커스텀 MES", "PLC 데이터 수집", "SCADA 연동"] },
  { category: "클라우드 스토리지", items: ["AWS S3", "Azure Blob", "Google Cloud Storage", "Snowflake", "네이버 클라우드"] },
  { category: "협업 & 알림", items: ["Slack", "Microsoft Teams", "이메일 (SMTP)", "SMS (국내 통신사)", "카카오 알림톡"] },
  { category: "문서 & 파일", items: ["Excel / CSV", "Google Sheets", "SharePoint", "OneDrive", "FTP/SFTP"] },
  { category: "데이터베이스", items: ["PostgreSQL", "MySQL", "MSSQL", "Oracle DB", "MongoDB"] },
];

const integrationMethods = [
  { icon: "🔌", title: "REST API", desc: "표준 REST API로 모든 시스템과 연동. Swagger 문서 자동 생성 제공." },
  { icon: "🔄", title: "웹훅", desc: "이벤트 발생 시 외부 시스템에 즉시 데이터 전송. 실시간 연동 지원." },
  { icon: "📦", title: "사전 빌드 커넥터", desc: "SAP, 더존 등 50+ 사전 빌드 커넥터로 코딩 없이 즉시 연결." },
  { icon: "🗄️", title: "DB 직접 연결", desc: "기존 데이터베이스에 직접 접속해 실시간 데이터 동기화." },
];

export default function IntegrationPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>INTEGRATION & CONNECTIVITY</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            기존 시스템과<br />
            <span style={{ color: "#D4920A" }}>즉시 연결</span>되는 플랫폼
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            이미 사용 중인 ERP, MES, 클라우드 서비스를 그대로 유지하세요.<br />
            F.A.C.T AI가 모든 데이터 소스를 하나로 통합합니다.
          </p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            연동 가능 여부 확인
          </Link>
        </div>
      </section>

      {/* Integration Methods */}
      <section style={{ padding: "60px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: "40px", textAlign: "center" }}>연동 방식</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {integrationMethods.map((m) => (
              <div key={m.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{m.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{m.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connectors */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>지원 시스템 & 커넥터</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "48px" }}>50+ 사전 빌드 커넥터 · 커스텀 연동 개발 지원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {connectors.map((c) => (
              <div key={c.category} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#D4920A", marginBottom: "16px" }}>{c.category}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {c.items.map((item) => (
                    <span key={item} style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 10px", color: "rgba(255,255,255,0.7)" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>우리 시스템과 연동 가능한가요?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>전담 기술 팀이 현재 사용 중인 시스템과의 연동 가능 여부를 무료로 검토합니다</p>
          <a href="mailto:ceo@4dvision.co.kr" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            연동 검토 요청 →
          </a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
