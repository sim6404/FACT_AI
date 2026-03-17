import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "경영진을 위한 F.A.C.T AI",
  description: "경영 의사결정에 필요한 모든 KPI를 실시간으로. 임원 대시보드, AI 브리핑, 사업부 성과 비교.",
};

const executiveKpis = [
  { label: "전사 매출 달성률", value: "96.5%", status: "warning", desc: "목표 대비 현황 실시간 추적" },
  { label: "전체 불량률 (PPM)", value: "16,281", status: "normal", desc: "전월 대비 8% 개선" },
  { label: "설비 종합효율 (OEE)", value: "87.3%", status: "good", desc: "업계 평균 상회" },
  { label: "인력 가동률", value: "98%", status: "good", desc: "주간 현황 자동 집계" },
];

const features = [
  { icon: "📊", title: "임원 전용 대시보드", desc: "세부 데이터에 빠지지 않고 핵심 KPI만 한눈에. 드릴다운이 필요할 때만 상세 화면으로 이동." },
  { icon: "🤖", title: "AI 경영 브리핑", desc: "매일 아침 전날 주요 이슈, 이상 KPI, 주목할 트렌드를 AI가 요약해서 이메일로 전달." },
  { icon: "📈", title: "사업부 성과 비교", desc: "생산·품질·영업·구매 부서별 성과를 동일 기준으로 비교. 부서 간 벤치마킹 인사이트 제공." },
  { icon: "🔮", title: "예측 경보 시스템", desc: "현재 추세를 AI가 분석해 월말·분기말 목표 달성 가능 여부를 미리 경보. 선제 대응 가능." },
  { icon: "✅", title: "모바일 승인", desc: "어디서나 결재 가능. 주요 의사결정 항목을 모바일에서 바로 검토하고 승인." },
  { icon: "📋", title: "이사회 보고 자동화", desc: "월간·분기 이사회 보고 자료를 자동 생성. 데이터 기반 의사결정을 위한 근거 자료 포함." },
];

const roi = [
  { metric: "보고서 취합 시간", before: "주 20시간", after: "주 1시간", saving: "95%" },
  { metric: "경영 의사결정 속도", before: "D+3 ~ D+7", after: "실시간", saving: "즉시" },
  { metric: "데이터 오류 발견 시간", before: "월 마감 후", after: "실시간", saving: "사전 예방" },
];

export default function ExecutivePage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>FOR EXECUTIVES</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            보고받는 대신<br />
            <span style={{ color: "#D4920A" }}>직접 보는</span> 경영
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            주간 보고서를 기다리지 마세요. 전사 KPI를 실시간으로 확인하고,<br />
            AI가 이상 징후를 먼저 알려줍니다.
          </p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            임원 대시보드 데모 신청
          </Link>
        </div>
      </section>

      {/* KPI Preview */}
      <section style={{ padding: "60px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, marginBottom: "36px", textAlign: "center" }}>임원 대시보드 KPI 예시</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {executiveKpis.map((kpi) => (
              <div key={kpi.label} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${kpi.status === "good" ? "rgba(34,197,94,0.3)" : kpi.status === "warning" ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>{kpi.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: kpi.status === "good" ? "#22c55e" : kpi.status === "warning" ? "#fbbf24" : "#fff", marginBottom: "8px" }}>{kpi.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{kpi.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>경영진을 위한 기능</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>도입 효과</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {roi.map((r) => (
              <div key={r.metric} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px 28px", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "24px", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 600 }}>{r.metric}</span>
                <span style={{ fontSize: "14px", color: "rgba(255,100,100,0.7)", textDecoration: "line-through" }}>{r.before}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>→</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#D4920A" }}>{r.after}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{r.saving} 절감</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>임원 전용 데모를 경험하세요</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>귀사의 실제 데이터 구조에 맞춘 맞춤형 임원 대시보드 시연</p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            맞춤 데모 신청 →
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
