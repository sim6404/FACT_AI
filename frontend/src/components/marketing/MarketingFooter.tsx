"use client";
import Link from "next/link";

const FOOTER_LINKS = {
  플랫폼: [
    { label: "AI 에이전트 플랫폼", href: "/platform/agent" },
    { label: "데이터 분석 엔진", href: "/platform/analytics" },
    { label: "자동화 워크플로우", href: "/platform/automation" },
    { label: "보안·거버넌스", href: "/platform/security" },
    { label: "통합·연동", href: "/platform/integration" },
  ],
  솔루션: [
    { label: "광고·미디어", href: "/industries/media" },
    { label: "금융서비스", href: "/industries/financial" },
    { label: "의료·헬스케어", href: "/industries/healthcare" },
    { label: "리테일·이커머스", href: "/industries/retail" },
    { label: "제조", href: "/industries/manufacturing" },
    { label: "공공·정부", href: "/industries/government" },
    { label: "에너지·유틸리티", href: "/industries/energy" },
    { label: "통신", href: "/industries/telecom" },
  ],
  리소스: [
    { label: "문서·가이드", href: "/resources/docs" },
    { label: "블로그", href: "/resources/blog" },
    { label: "웨비나·이벤트", href: "/resources/events" },
    { label: "파트너 생태계", href: "/resources/partners" },
  ],
  서비스: [
    { label: "도입 문의", href: "/contact" },
    { label: "파트너십 신청", href: "/contact" },
    { label: "고객사례", href: "/cases" },
    { label: "무료 데모 신청", href: "/demo" },
    { label: "가격 문의", href: "/pricing" },
  ],
};

export function MarketingFooter() {
  return (
    <footer
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "64px 24px 32px",
        fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "260px repeat(4, 1fr)", gap: "48px", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #D4920A, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "14px", color: "#0a0a0a", flexShrink: 0 }}>
                F
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "16px", color: "#fff", letterSpacing: "-0.01em" }}>
                  F.A.C.T <span style={{ color: "#D4920A" }}>AI</span>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>by (주)포디비전</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "20px" }}>
              AI 기반 제조·기업 업무 자동화 통합 플랫폼. 데이터에서 인사이트로, 인사이트에서 자동화로.
            </p>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a
                href="mailto:ceo@4dvision.co.kr"
                style={{ fontSize: "13px", color: "#D4920A", textDecoration: "none" }}
              >
                ceo@4dvision.co.kr
              </a>
              <a href="tel:031-901-4823" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                TEL. 031-901-4823
              </a>
              <a href="tel:010-9039-0329" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                MOB. 010-9039-0329
              </a>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                FAX. 031-629-6029
              </span>
              <a href="https://www.4dvision.co.kr" target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                www.4dvision.co.kr
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                {category}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#D4920A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Links Row — 눈에 잘 띄게 */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginRight: "4px" }}>법적 고지</span>
            {[
              { label: "개인정보처리방침", href: "/privacy" },
              { label: "서비스 이용약관", href: "/terms" },
              { label: "쿠키 설정", href: "/cookies" },
            ].map((l, i) => (
              <span key={l.href} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {i > 0 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px" }}>|</span>}
                <Link
                  href={l.href}
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#D4920A"; e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.textDecoration = "none"; }}
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>
                (주)포디비전 · WORLD WIDE 4D SOLUTION
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", lineHeight: 1.8 }}>
                경기도 고양시 일산동 고봉로 32-19 남정씨티프라자 7차 504호
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", marginTop: "2px" }}>
                COPYRIGHT 2007–2026 4D VISION ALL RIGHTS RESERVED
              </div>
            </div>
            <Link
              href="/contact"
              style={{ fontSize: "13px", color: "#D4920A", textDecoration: "none", fontWeight: 600, padding: "8px 18px", border: "1px solid rgba(212,146,10,0.3)", borderRadius: "8px" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,146,10,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              도입 문의하기 →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
