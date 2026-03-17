import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "AI 에이전트 플랫폼 | F.A.C.T AI",
  description: "자율 실행 AI 에이전트로 반복 업무를 완전 자동화. 질의 → 분석 → 보고서 생성까지 사람 없이 수행.",
};

const capabilities = [
  { icon: "🤖", title: "자율 업무 실행", desc: "목표만 설정하면 에이전트가 데이터 수집, 분석, 보고서 생성까지 자동 수행" },
  { icon: "🔄", title: "멀티 에이전트 협업", desc: "생산·품질·영업 에이전트가 실시간 데이터를 공유하며 연계 분석" },
  { icon: "💬", title: "자연어 인터페이스", desc: "\"이번달 불량률 원인 분석해줘\"처럼 일상 언어로 복잡한 ERP 분석 수행" },
  { icon: "📅", title: "스케줄 자동화", desc: "주간 보고서, 월말 결산, KPI 알림을 설정 시각에 자동으로 생성·배포" },
  { icon: "🔗", title: "외부 시스템 연동", desc: "ERP, MES, 이메일, Slack, ERP 시스템과 연결해 데이터를 직접 처리" },
  { icon: "🛡️", title: "감사 추적 & 승인", desc: "모든 에이전트 행동을 로그로 기록, 중요 액션은 사람 승인 후 실행" },
];

const useCases = [
  { dept: "품질팀", task: "주간 PPM 보고서 자동 생성", time: "8시간 → 2분", savings: "96% 절감" },
  { dept: "생산팀", task: "이상 생산 실적 원인 자동 분석", time: "수동 → 자동", savings: "즉시 알림" },
  { dept: "영업팀", task: "고객사별 매출 달성률 주간 리포트", time: "4시간 → 5분", savings: "98% 절감" },
  { dept: "구매팀", task: "재고 임박 품목 자동 발주 제안", time: "매일 수동 → 자동", savings: "100% 자동화" },
];

export default function AgentPlatformPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>AI AGENT PLATFORM</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            사람처럼 생각하고<br />
            <span style={{ color: "#D4920A" }}>기계처럼 실행하는</span> 에이전트
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            F.A.C.T AI 에이전트는 자연어 명령 하나로 데이터 수집, 분석, 보고서 생성, 알림 발송까지<br />
            엔드투엔드 업무를 사람 개입 없이 완전 자동 처리합니다.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
              무료 데모 신청
            </Link>
            <Link href="/platform" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
              플랫폼 전체 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>에이전트 핵심 기능</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "56px", fontSize: "16px" }}>복잡한 업무도 자연어 한 문장으로 처리</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {capabilities.map((c) => (
              <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{c.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{c.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px", textAlign: "center" }}>부서별 자동화 사례</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "48px", fontSize: "16px" }}>실제 도입 기업의 업무 자동화 성과</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {useCases.map((u) => (
              <div key={u.dept} style={{ background: "rgba(212,146,10,0.05)", border: "1px solid rgba(212,146,10,0.2)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A", marginBottom: "12px" }}>{u.dept}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.5 }}>{u.task}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>{u.time}</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#D4920A" }}>{u.savings}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "16px" }}>에이전트 아키텍처</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "48px", fontSize: "16px" }}>Cortex Agents 기반 3계층 에이전트 구조</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { label: "사용자 인터페이스 레이어", desc: "자연어 채팅 · 음성 입력 · 모바일 앱", bg: "rgba(212,146,10,0.15)" },
              { label: "오케스트레이터 에이전트", desc: "의도 분류 · 서브 에이전트 라우팅 · 결과 통합", bg: "rgba(212,146,10,0.1)" },
              { label: "전문 에이전트 풀", desc: "생산 에이전트 · 품질 에이전트 · 영업 에이전트 · 보고서 에이전트", bg: "rgba(212,146,10,0.07)" },
              { label: "데이터 & 도구 레이어", desc: "ERP DB · Snowflake · MES API · 외부 서비스", bg: "rgba(212,146,10,0.04)" },
            ].map((layer, i) => (
              <div key={i} style={{ background: layer.bg, border: "1px solid rgba(212,146,10,0.2)", borderRadius: "12px", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "15px" }}>{layer.label}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{layer.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>지금 바로 에이전트를 경험하세요</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px", fontSize: "16px" }}>14일 무료 체험 · 신용카드 불필요 · 전담 온보딩 제공</p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            무료 데모 신청 →
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
