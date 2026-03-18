import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "이용약관 | F.A.C.T AI",
  description: "F.A.C.T AI 서비스 이용약관 — (주)포디비전이 제공하는 서비스의 이용 조건 및 절차에 관한 약관입니다.",
};

const sections = [
  {
    title: "제1조 (목적)",
    content: `이 약관은 (주)포디비전(이하 '회사')이 제공하는 F.A.C.T AI 플랫폼 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (정의)",
    content: `① '서비스'라 함은 회사가 제공하는 F.A.C.T AI 플랫폼 및 이와 관련된 제반 서비스를 의미합니다.
② '이용자'라 함은 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ '회원'이라 함은 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.
④ '아이디(ID)'라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.`,
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    content: `① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
② 회사는 합리적인 사유가 발생할 경우에는 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있습니다.
③ 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.`,
  },
  {
    title: "제4조 (서비스의 제공 및 변경)",
    content: `① 회사는 다음과 같은 업무를 수행합니다.
• AI 에이전트 기반 데이터 분석 서비스 제공
• 제조·ERP 연동 자동화 솔루션 제공
• 보고서 자동 생성 및 승인 워크플로우 서비스
• 기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 이용자에게 제공하는 일체의 업무

② 회사는 서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우 변경사항을 사전에 공지합니다.`,
  },
  {
    title: "제5조 (서비스 이용 시간)",
    content: `① 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다.
② 회사는 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 사전에 공지합니다.`,
  },
  {
    title: "제6조 (회원가입)",
    content: `① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
② 회사는 다음 각 호에 해당하는 신청에 대하여 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
• 허위 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우
• 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하여 신청하는 경우`,
  },
  {
    title: "제7조 (회원의 의무)",
    content: `① 이용자는 다음 행위를 하여서는 안 됩니다.
• 신청 또는 변경 시 허위 내용 등록
• 회사에 게시된 정보의 변경
• 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
• 회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해
• 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
• 외설 또는 폭력적인 메시지, 화상, 음성 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위`,
  },
  {
    title: "제8조 (서비스 이용 요금)",
    content: `① 서비스 이용 요금은 회사가 정한 요금 정책에 따릅니다. 요금 상세는 서비스 내 가격 안내 페이지(/pricing)에서 확인할 수 있습니다.
② 요금 정책은 회사의 사정에 따라 변경될 수 있으며, 변경 시 30일 전에 사전 고지합니다.
③ 유료 서비스를 이용하는 회원은 계약 기간 중 요금을 납부해야 하며, 미납 시 서비스 이용이 제한될 수 있습니다.`,
  },
  {
    title: "제9조 (면책조항)",
    content: `① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
③ AI 분석 결과는 참고용으로 제공되며, 회사는 AI 분석 결과에 기반한 비즈니스 의사결정의 결과에 대해 법적 책임을 지지 않습니다.`,
  },
  {
    title: "제10조 (분쟁 해결 및 준거법)",
    content: `① 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.
② 회사와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.

부칙
이 약관은 2025년 1월 1일부터 시행합니다.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      <section style={{ paddingTop: 120, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 24, fontSize: 12, color: "#D4920A", fontWeight: 600 }}>
            법적 문서
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>서비스 이용약관</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
            시행일: 2025년 1월 1일 &nbsp;|&nbsp; 최종 수정일: 2025년 1월 1일<br />
            (주)포디비전 (WORLD WIDE 4D SOLUTION)
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
          {[
            { label: "개인정보처리방침", href: "/privacy" },
            { label: "쿠키 설정", href: "/cookies" },
            { label: "도입 문의", href: "/contact" },
          ].map(link => (
            <a key={link.href} href={link.href}
              style={{ padding: "8px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              {link.label}
            </a>
          ))}
        </div>

        {sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, color: "#fff", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{sec.title}</h2>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, whiteSpace: "pre-line" }}>{sec.content}</div>
          </div>
        ))}

        <div style={{ marginTop: 56, padding: "24px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
            약관 관련 문의: <a href="mailto:ceo@4dvision.co.kr" style={{ color: "#D4920A" }}>ceo@4dvision.co.kr</a><br />
            주소: 경기도 고양시 일산동 고봉로 32-19 남정씨티프라자 7차 504호
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
