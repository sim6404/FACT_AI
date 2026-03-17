import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "자동화 워크플로우 | F.A.C.T AI",
  description: "코딩 없이 업무 자동화 설계. 보고서 자동생성·승인 워크플로우·알림 자동화를 노코드로 구축하세요.",
};

const workflowTypes = [
  { icon: "📋", title: "보고서 자동화", desc: "주간·월간 보고서를 지정된 시각에 자동 생성하고 담당자에게 이메일 발송", example: "매주 월요일 9시 품질 보고서 자동 생성" },
  { icon: "✅", title: "승인 워크플로우", desc: "발주·구매·4M 변경 요청 등 승인 프로세스를 디지털화, 결재선 자동 라우팅", example: "구매 요청 → 팀장 → 본부장 자동 순회" },
  { icon: "🚨", title: "이상 감지 알림", desc: "KPI 임계값 이탈 시 담당자에게 즉시 알림. 설비 고장, 불량 급등 자동 감지", example: "PPM 10,000 초과 시 품질팀장 즉시 알림" },
  { icon: "📊", title: "데이터 수집 자동화", desc: "ERP, MES, Excel 등 다양한 소스에서 데이터를 정해진 주기로 자동 수집·정제", example: "MES 생산 실적 1시간 단위 자동 동기화" },
  { icon: "🔔", title: "에스컬레이션 관리", desc: "미처리 이슈가 SLA 초과 시 상위 담당자로 자동 에스컬레이션", example: "품질 이슈 24시간 미처리 시 팀장 에스컬레이션" },
  { icon: "📤", title: "외부 연동 자동화", desc: "고객사 포털 업로드, 협력사 발주 메일, ERP 자동 분개 등 외부 시스템 연동 자동화", example: "납품 완료 시 고객사 포털 자동 업로드" },
];

const steps = [
  { step: "01", title: "트리거 설정", desc: "시간 기반, 이벤트 기반, 조건 기반 중 선택" },
  { step: "02", title: "액션 구성", desc: "데이터 수집 → 분석 → 변환 → 배포 단계를 블록으로 조립" },
  { step: "03", title: "승인 라인 지정", desc: "중요 단계에 사람 검토/승인 포인트 삽입" },
  { step: "04", title: "활성화 & 모니터링", desc: "워크플로우 실행 이력, 오류 현황 실시간 대시보드 확인" },
];

export default function AutomationPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>AUTOMATION WORKFLOW</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            반복 업무는 자동으로<br />
            <span style={{ color: "#D4920A" }}>핵심 업무에만 집중</span>하세요
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            코딩 없이 드래그 앤 드롭으로 업무 자동화 워크플로우를 설계하세요.<br />
            보고서 생성, 승인 프로세스, 이상 감지 알림을 한 번에 설정합니다.
          </p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            무료 데모 신청
          </Link>
        </div>
      </section>

      {/* Workflow Types */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>자동화 워크플로우 유형</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "48px" }}>다양한 업무 패턴을 즉시 사용 가능한 템플릿으로 제공</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {workflowTypes.map((w) => (
              <div key={w.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{w.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{w.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>{w.desc}</p>
                <div style={{ background: "rgba(212,146,10,0.08)", border: "1px solid rgba(212,146,10,0.15)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#D4920A" }}>
                  예시: {w.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>4단계로 워크플로우 구축</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
            {steps.map((s) => (
              <div key={s.step} style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(212,146,10,0.15)", border: "1px solid rgba(212,146,10,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "18px", fontWeight: 800, color: "#D4920A" }}>{s.step}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>지금 첫 워크플로우를 만들어보세요</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>20개 이상의 사전 빌드 워크플로우 템플릿 즉시 사용</p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            무료 데모 신청 →
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
