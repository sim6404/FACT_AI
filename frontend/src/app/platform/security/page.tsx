import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "보안·거버넌스 | F.A.C.T AI",
  description: "엔터프라이즈급 데이터 보안과 컴플라이언스. 역할 기반 접근 제어, 감사 로그, 데이터 암호화.",
};

const securityFeatures = [
  { icon: "🔐", title: "역할 기반 접근 제어 (RBAC)", desc: "부서·직급별 데이터 접근 권한 세분화. 영업팀은 영업 데이터만, 품질팀은 품질 데이터만 조회 가능." },
  { icon: "🔒", title: "데이터 암호화", desc: "저장 데이터(AES-256) 및 전송 데이터(TLS 1.3) 완전 암호화. 키 관리 서비스(KMS) 연동." },
  { icon: "📋", title: "감사 로그", desc: "모든 데이터 접근·수정·삭제 이력을 변경 불가능한 감사 로그로 기록. 규제 대응 지원." },
  { icon: "🏢", title: "멀티 테넌트 격리", desc: "사업부·법인별 데이터 완전 격리. 하나의 플랫폼에서 복수 조직 독립 운영." },
  { icon: "🛡️", title: "이상 접근 탐지", desc: "비정상 로그인·대량 다운로드 등 이상 행위 자동 탐지 및 즉시 알림." },
  { icon: "✅", title: "컴플라이언스 지원", desc: "ISO 27001·개인정보보호법·ISMS-P 컴플라이언스 요건 충족 설계. 감사 리포트 자동 생성." },
];

const certifications = [
  { name: "ISO 27001", desc: "정보보안 관리체계" },
  { name: "개인정보보호법", desc: "국내 개인정보 법규 준수" },
  { name: "ISMS-P", desc: "정보보호 및 개인정보보호 관리체계" },
  { name: "TLS 1.3", desc: "전송 구간 암호화" },
];

export default function SecurityPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>SECURITY & GOVERNANCE</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            엔터프라이즈 수준의<br />
            <span style={{ color: "#D4920A" }}>보안을 기본으로</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
            제조 현장의 핵심 데이터를 안전하게 보호합니다.<br />
            역할 기반 접근 제어부터 완전 감사 추적까지, 보안이 플랫폼 기본값입니다.
          </p>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            보안 상담 신청
          </Link>
        </div>
      </section>

      {/* Security Features */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "48px", textAlign: "center" }}>보안 & 거버넌스 기능</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {securityFeatures.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: "16px" }}>인증 & 컴플라이언스</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "48px" }}>국내외 보안 규제 기준을 충족하도록 설계된 플랫폼</p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            {certifications.map((c) => (
              <div key={c.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px 32px", minWidth: "160px" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#D4920A", marginBottom: "8px" }}>{c.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, marginBottom: "20px" }}>보안 아키텍처 문서 요청</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>상세 보안 아키텍처 문서 및 컴플라이언스 체크리스트를 제공합니다</p>
          <a href="mailto:ceo@4dvision.co.kr" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "16px 40px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
            보안 문서 요청 →
          </a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
