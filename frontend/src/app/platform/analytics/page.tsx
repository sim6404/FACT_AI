import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "데이터 분석 엔진 | F.A.C.T AI",
  description: "실시간 KPI 모니터링부터 예측 분석까지. Snowflake Cortex 기반 엔터프라이즈 데이터 분석 엔진.",
};

const features = [
  { icon: "⚡", title: "실시간 KPI 대시보드", desc: "생산·품질·영업 KPI를 단일 화면에서 실시간 모니터링. 이상 감지 시 즉시 알림." },
  { icon: "🔮", title: "AI 예측 분석", desc: "과거 데이터 기반 수요 예측, 설비 고장 예측, 불량 발생 예측 모델 내장." },
  { icon: "📊", title: "드릴다운 분석", desc: "부서 → 팀 → 개인 → 설비 단위까지 단계별 심층 분석 가능." },
  { icon: "🗂️", title: "시맨틱 레이어", desc: "비즈니스 용어 기반 데이터 모델. '불량률'이나 '달성률' 같은 업무 언어로 쿼리." },
  { icon: "📈", title: "트렌드 & 비교 분석", desc: "기간별·부서별·고객사별 비교 분석, 전월/전년 동기 비교 자동 생성." },
  { icon: "🌐", title: "외부 데이터 통합", desc: "날씨, 환율, 원자재 가격 등 외부 데이터와 내부 KPI를 결합해 상관관계 분석." },
];

const kpiExamples = [
  { category: "생산", kpis: ["OEE (설비종합효율)", "생산달성률", "공정별 투입시간", "불량수량 / PPM"] },
  { category: "품질", kpis: ["고객사별 PPM", "공정불량률", "리워크 비율", "클레임 건수"] },
  { category: "영업", kpis: ["매출 달성률", "고객사별 매출", "수주잔고", "납기 준수율"] },
  { category: "구매", kpis: ["매입 비율", "재고 회전율", "발주 리드타임", "공급업체 평가"] },
];

export default function AnalyticsPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>DATA ANALYTICS ENGINE</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            모든 데이터를<br />
            <span style={{ color: "#D4920A" }}>의사결정 인사이트</span>로
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            Snowflake Cortex Analyst 기반의 시맨틱 데이터 레이어로<br />
            복잡한 쿼리 없이 업무 언어로 원하는 분석 결과를 바로 얻으세요.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
              무료 데모 신청
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>분석 엔진 핵심 기능</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Examples */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>부서별 기본 제공 KPI</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "48px" }}>100+ 사전 정의 KPI 템플릿 즉시 사용 가능</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {kpiExamples.map((k) => (
              <div key={k.category} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#D4920A", marginBottom: "16px" }}>{k.category}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {k.kpis.map((kpi) => (
                    <li key={kpi} style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      • {kpi}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>데이터가 말하게 하세요</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>무료 데모에서 실제 데이터로 분석을 경험해보세요</p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            무료 데모 신청 →
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
