import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "개인정보처리방침 | F.A.C.T AI",
  description: "F.A.C.T AI 개인정보처리방침 — (주)포디비전이 수집·이용하는 개인정보 처리에 관한 방침입니다.",
};

const sections = [
  {
    title: "1. 개인정보의 처리 목적",
    content: `(주)포디비전(이하 '회사')은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

• 서비스 제공: F.A.C.T AI 플랫폼 계정 생성, 콘텐츠 제공, AI 분석 서비스 제공
• 고객 문의 응대: 도입 문의, 기술 지원, 파트너십 상담 처리
• 마케팅 및 광고: 신규 서비스 안내, 이벤트 정보 제공 (별도 동의 시)
• 서비스 개선: 이용 통계 분석, 오류 파악 및 기능 개선`,
  },
  {
    title: "2. 처리하는 개인정보 항목",
    content: `[필수 항목]
• 회원 가입: 이메일 주소, 비밀번호(암호화 저장), 이름
• 도입 문의: 이름, 회사명, 이메일, 연락처, 업종, 임직원 규모, 문의 내용
• 서비스 이용: 접속 로그, IP 주소, 쿠키, 서비스 이용 기록

[자동 수집 항목]
• 브라우저 종류 및 OS, 방문 일시, 서비스 이용 기록, 불량 이용 기록`,
  },
  {
    title: "3. 개인정보의 처리 및 보유 기간",
    content: `회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

• 회원 정보: 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)
• 도입 문의 기록: 처리 완료 후 1년
• 전자상거래 기록: 5년 (전자상거래법)
• 접속 로그: 3개월 (통신비밀보호법)`,
  },
  {
    title: "4. 개인정보의 제3자 제공",
    content: `회사는 정보주체의 개인정보를 1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

현재 회사는 개인정보를 제3자에게 제공하고 있지 않습니다.`,
  },
  {
    title: "5. 개인정보처리의 위탁",
    content: `회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

• Vercel Inc. — 웹 서비스 호스팅 및 CDN
• Amazon Web Services Inc. — 클라우드 인프라 운영
• Snowflake Inc. — 데이터 분석 플랫폼 운영

위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁 제한 등을 규정하고 있습니다.`,
  },
  {
    title: "6. 정보주체의 권리·의무 및 행사 방법",
    content: `정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.

• 개인정보 열람 요구
• 오류 등이 있을 경우 정정 요구
• 삭제 요구
• 처리정지 요구

권리 행사는 이메일(ceo@4dvision.co.kr) 또는 개인정보 보호법 시행령 제41조 제1항에 따라 서면, 전화, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.`,
  },
  {
    title: "7. 개인정보의 안전성 확보 조치",
    content: `회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

• 관리적 조치: 내부 관리 계획 수립·시행, 직원 정기 교육
• 기술적 조치: 개인정보처리시스템 접근권한 관리, 접근통제시스템 설치, 개인정보 암호화, 보안프로그램 설치
• 물리적 조치: 전산실·자료보관실 등의 접근 통제`,
  },
  {
    title: "8. 개인정보 자동 수집 장치의 설치·운영 및 거부",
    content: `회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.

쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 컴퓨터에 저장되기도 합니다.

이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹 브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
쿠키 설정 거부 방법: 웹 브라우저 설정 → 개인정보 → 쿠키 설정 변경`,
  },
  {
    title: "9. 개인정보 보호책임자",
    content: `회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 개인정보 관련 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
• 성명: 대표이사
• 직책: 개인정보 보호책임자
• 연락처: ceo@4dvision.co.kr / 031-901-4823

정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.`,
  },
  {
    title: "10. 개인정보처리방침의 변경",
    content: `이 개인정보처리방침은 2025년 1월 1일부터 적용됩니다. 이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.

법령, 정책 또는 보안 기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 홈페이지를 통해 고지할 것입니다.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      <section style={{ paddingTop: 120, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 24, fontSize: 12, color: "#D4920A", fontWeight: 600 }}>
            법적 문서
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>개인정보처리방침</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
            시행일: 2025년 1월 1일 &nbsp;|&nbsp; 최종 수정일: 2025년 1월 1일<br />
            (주)포디비전 (사업자등록번호: 000-00-00000)
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 48, padding: "20px 24px", background: "rgba(212,146,10,0.05)", border: "1px solid rgba(212,146,10,0.15)", borderRadius: 12 }}>
          (주)포디비전(이하 &lsquo;회사&rsquo;)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>

        {sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "#fff", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{sec.title}</h2>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, whiteSpace: "pre-line" }}>{sec.content}</div>
          </div>
        ))}

        <div style={{ marginTop: 56, padding: "24px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
            개인정보 처리에 관한 문의: <a href="mailto:ceo@4dvision.co.kr" style={{ color: "#D4920A" }}>ceo@4dvision.co.kr</a><br />
            관련 법령 안내: <a href="https://www.privacy.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: "#D4920A" }}>개인정보보호위원회 (privacy.go.kr)</a>
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
