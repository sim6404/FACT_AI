import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "데이터 엔지니어를 위한 F.A.C.T AI",
  description: "데이터 파이프라인 구축·운영을 10배 빠르게. ERP·MES 데이터 통합, Snowflake 연동, API 자동 생성.",
};

const challenges = [
  "ERP, MES, 엑셀 데이터를 수동으로 통합하는 데 주 20시간 이상 소요",
  "부서마다 다른 데이터 형식 → 통합 불가능한 사일로 현상",
  "실시간 데이터 파이프라인 없이 D-1 배치 데이터로만 분석",
  "스키마 변경 시 수십 개 쿼리를 수동으로 수정해야 하는 고통",
];

const solutions = [
  { icon: "🔌", title: "노코드 데이터 파이프라인", desc: "드래그 앤 드롭으로 ERP → Snowflake 파이프라인 구축. SQL 없이 데이터 변환·정제." },
  { icon: "🗄️", title: "시맨틱 데이터 모델", desc: "비즈니스 용어 기반 시맨틱 레이어. 스키마 변경에 영향받지 않는 안정적 데이터 모델." },
  { icon: "⚡", title: "실시간 스트리밍", desc: "Kafka·CDC 기반 실시간 데이터 수집. MES 생산 데이터를 초 단위로 Snowflake에 적재." },
  { icon: "🔍", title: "데이터 품질 모니터링", desc: "이상값·누락·중복 자동 탐지. 파이프라인 이상 시 Slack·이메일 즉시 알림." },
];

const techStack = ["Python", "dbt", "Apache Kafka", "Snowflake", "Apache Airflow", "REST API", "PostgreSQL", "Redis"];

export default function EngineerPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>FOR DATA ENGINEERS</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              데이터 파이프라인<br />구축 시간을<br />
              <span style={{ color: "#D4920A" }}>10배 단축</span>
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "36px" }}>
              ERP·MES 데이터 통합, 시맨틱 레이어 구축, 실시간 파이프라인 운영을 F.A.C.T AI가 대신합니다.
            </p>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 28px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
              무료 데모 신청
            </Link>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
            <div style={{ fontSize: "13px", color: "#D4920A", fontWeight: 700, marginBottom: "16px" }}>현재 겪고 있는 고충</div>
            {challenges.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,100,100,0.8)", fontSize: "16px", flexShrink: 0 }}>✗</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>F.A.C.T AI가 해결하는 방법</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {solutions.map((s) => (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{s.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, marginBottom: "16px" }}>지원 기술 스택</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>기존에 익숙한 도구와 완벽하게 통합</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {techStack.map((t) => (
              <span key={t} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
