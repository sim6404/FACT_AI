import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function PartnersPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />
      <section style={{ paddingTop: "130px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>PARTNER ECOSYSTEM</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "20px", letterSpacing: "-0.02em" }}>파트너 생태계</h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "48px" }}>
            F.A.C.T AI와 함께 성장하는 SI·MSP·컨설팅 파트너를 모집합니다.<br />
            파트너 혜택, 인증 프로그램, 기술 지원을 제공합니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
            {[
              { tier: "실버 파트너", desc: "기술 인증 + 리셀러 자격 + 공동 마케팅" },
              { tier: "골드 파트너", desc: "전담 SE + 우선 영업 기회 + 고급 교육" },
              { tier: "플래티넘 파트너", desc: "공동 개발 + 독점 지역 + 임원 채널" },
            ].map((p) => (
              <div key={p.tier} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#D4920A", marginBottom: "8px" }}>{p.tier}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <a href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4920A", color: "#0a0a0a", padding: "14px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            파트너십 신청하기 →
          </a>
          <a href="mailto:ceo@4dvision.co.kr" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 28px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", textDecoration: "none", marginTop: "12px" }}>
            📧 ceo@4dvision.co.kr
          </a>
          <div style={{ marginTop: "12px", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
            📞 031-901-4823 &nbsp;|&nbsp; 📱 010-9039-0329
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
