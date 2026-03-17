import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "데이터 분석가를 위한 F.A.C.T AI",
  description: "SQL 없이 자연어로 분석. 실시간 KPI 대시보드, AI 예측 인사이트, 자동 보고서 생성.",
};

const pain = [
  "매주 반복되는 보고서 작성에 2~3일 소요",
  "원하는 분석을 위해 IT팀에 쿼리를 의뢰하고 며칠을 기다림",
  "엑셀 피벗으로는 한계에 부딪히는 다변량 분석",
  "과거 데이터 분석으로는 이미 늦은 '사후 대응'만 반복",
];

const benefits = [
  { icon: "💬", title: "자연어 질의", desc: "\"지난 분기 고객사별 불량률 비교해줘\" — SQL 없이 자연어로 즉시 분석. AI가 쿼리를 대신 작성합니다." },
  { icon: "📊", title: "인터랙티브 대시보드", desc: "드래그 앤 드롭으로 대시보드 직접 구성. 부서별 맞춤 KPI 화면 10분 만에 완성." },
  { icon: "🔮", title: "예측 인사이트", desc: "다음 달 매출·불량률·재고 수준을 AI가 예측. '왜' 그런 예측인지 근거도 함께 제공." },
  { icon: "📋", title: "보고서 자동 생성", desc: "주간·월간 보고서를 버튼 하나로 생성. PPT·PDF·Excel 등 원하는 형식으로 즉시 다운로드." },
];

const reportTime = [
  { task: "주간 생산 보고서", before: "3시간", after: "5분" },
  { task: "월간 품질 분석", before: "1일", after: "15분" },
  { task: "고객사별 매출 분석", before: "4시간", after: "2분" },
  { task: "공정별 불량 원인 분석", before: "반나절", after: "10분" },
];

export default function AnalystPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>FOR DATA ANALYSTS</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            보고서 작성에서<br />
            <span style={{ color: "#D4920A" }}>인사이트 발굴로</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            반복 보고서 작성은 AI에게 맡기세요.<br />
            분석가는 진짜 중요한 인사이트를 찾는 일에만 집중할 수 있습니다.
          </p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            무료 데모 신청
          </Link>
        </div>
      </section>

      {/* Pain vs Solution */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "rgba(255,100,100,0.9)", marginBottom: "24px" }}>❌ 지금 현실</h3>
            {pain.map((p, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{p}</div>
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#D4920A", marginBottom: "24px" }}>✓ F.A.C.T AI 이후</h3>
            {benefits.map((b) => (
              <div key={b.title} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>{b.icon} {b.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time Savings */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>보고서 작성 시간 비교</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "48px" }}>실제 도입 고객사 측정값</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reportTime.map((r) => (
              <div key={r.task} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 600 }}>{r.task}</span>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "rgba(255,100,100,0.7)", textDecoration: "line-through" }}>{r.before}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>→</span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#D4920A" }}>{r.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
