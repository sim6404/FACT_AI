"use client";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

// ── colour tokens ──────────────────────────────────────────────────────────
const AMBER = "#D4920A";
const AMBER_DIM = "rgba(212,146,10,0.10)";
const AMBER_BORDER = "rgba(212,146,10,0.28)";
const BG = "#0a0a0a";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.50)";
const SUB = "rgba(255,255,255,0.35)";

// ── data ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: "2002", label: "설립연도" },
  { value: "23년+", label: "업력" },
  { value: "13건", label: "등록 특허·프로그램" },
  { value: "6종", label: "국내외 인증" },
];

const CERTIFICATIONS = [
  { name: "Innobiz", label: "기술혁신형 중소기업", color: "#63b3ed" },
  { name: "벤처기업", label: "중소벤처기업부 인증", color: "#68d391" },
  { name: "기업부설연구소", label: "과학기술정보통신부", color: "#b794f4" },
  { name: "CE", label: "유럽 안전 인증", color: AMBER },
  { name: "FCC", label: "미국 전파 인증", color: "#fc8181" },
  { name: "RoHS", label: "유해물질 제한 인증", color: "#76e4f7" },
];

const BUSINESS = [
  {
    icon: "🥽",
    title: "VR / AR 솔루션",
    desc: "HMD·스마트글라스용 몰입형 양안식 모바일 솔루션 개발. 국립박물관·테마파크 AR 체험 콘텐츠 공급.",
    color: "#63b3ed",
  },
  {
    icon: "🖥️",
    title: "무안경 3D 디스플레이",
    desc: "24″~55″ Polygon Lenticular 무안경 입체 디스플레이 자체 개발 및 상용화. 골프장 50개소 납품.",
    color: "#b794f4",
  },
  {
    icon: "🤖",
    title: "F.A.C.T. AI 플랫폼",
    desc: "AI 에이전트 기반 제조 업무 자동화 통합 서비스. ERP·MES·품질·영업 데이터를 Cortex AI로 분석.",
    color: AMBER,
  },
  {
    icon: "🏭",
    title: "스마트 팩토리 / T-MES",
    desc: "제조실행시스템(MES) 영문 서비스 개발·운영. 스마트팜 디지털 테마파크 플랫폼 구축.",
    color: "#68d391",
  },
];

const PATENTS = [
  "3D 입체영상 생성 장치 및 시스템 (제10-1071911호)",
  "3D 입체영상 생성 시스템 (제10-1118604호)",
  "VR/AR 기반 3D 몰입형 스마트 교육 서비스 방법",
  "Real4D ASD (입체영상 저작 도구)",
  "Real4D Realtime Player",
  "Pitch Checker",
  "4D RACER",
  "4D FRIGHT",
  "4D Avatar",
];

// 연혁 — 주요 이벤트만 선별
const TIMELINE: { year: string; month?: string; title: string; color: string }[] = [
  { year: "2002", title: "원키즈(주) 법인 설립 · 경기도 고양 출발", color: AMBER },
  { year: "2005", month: "11", title: "(주)포디비전으로 사명 변경 · 3D 입체영상 사업 본격화", color: "#63b3ed" },
  { year: "2006", month: "12", title: "Innobiz 기술혁신형 중소기업 인증 취득", color: "#68d391" },
  { year: "2007", month: "10", title: "ISO 9001:2000 인증 취득", color: "#b794f4" },
  { year: "2008", month: "03", title: "무안경 입체 모니터 CE·FCC·RoHS 국제 인증 획득", color: AMBER },
  { year: "2010", month: "03", title: "산업핵심기술개발 과제 선정 (인터랙티브 UI 기반 3D 시스템)", color: "#63b3ed" },
  { year: "2012", month: "05", title: "골프장 50개소 무안경 3D 디스플레이 납품", color: "#68d391" },
  { year: "2014", month: "06", title: "일신인베스트먼트 3억 투자 유치", color: "#fc8181" },
  { year: "2016", month: "09", title: "ICT R&D 사업 VR 분야 선정 (과학기술정보통신부)", color: "#b794f4" },
  { year: "2019", month: "12", title: "교육부 진로체험 인증 기관 선정", color: AMBER },
  { year: "2020", month: "11", title: "전국 360 돔 시어터 프랜차이즈 사업 런칭", color: "#63b3ed" },
  { year: "2022", month: "12", title: "경기도 유망 중소기업 선정", color: "#68d391" },
  { year: "2023", month: "08", title: "T-MES 영문 서비스(App·Web) 개발", color: "#b794f4" },
  { year: "2024", month: "09", title: "MeArt 앱 출시 (실시간 감성 분석 × 명화 융합)", color: "#fc8181" },
  { year: "2024", month: "10", title: "중소기업 빅데이터 분석·활용 우수사례 기업 선정", color: AMBER },
  { year: "2025", month: "05", title: "F.A.C.T. AI ERP 플랫폼 출시 · Innobiz 재인증", color: "#63b3ed" },
];

// ── component ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard','Noto Sans KR',-apple-system,sans-serif" }}>
      <MarketingNav />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "128px", paddingBottom: "88px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* glow */}
        <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "420px", background: "radial-gradient(ellipse, rgba(212,146,10,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: AMBER_DIM, border: `1px solid ${AMBER_BORDER}`, borderRadius: "100px", padding: "6px 18px", marginBottom: "32px", fontSize: "13px", color: AMBER, fontWeight: 600, letterSpacing: "0.04em" }}>
            <span style={{ width: "6px", height: "6px", background: AMBER, borderRadius: "50%", display: "inline-block" }} />
            (주)포디비전 · Since 2002
          </div>
          <h1 style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 900, lineHeight: 1.15, marginBottom: "28px", letterSpacing: "-0.02em" }}>
            상상을 현실로 —<br />
            <span style={{ color: AMBER }}>기술 혁신 23년의 여정</span>
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,19px)", color: MUTED, lineHeight: 1.75, maxWidth: "660px", margin: "0 auto 40px" }}>
            2002년 설립 이후 VR·AR·3D 디스플레이·AI까지,<br />
            (주)포디비전은 대한민국 실감 미디어와 제조 AI 혁신을 이끌어왔습니다.
          </p>
          {/* address pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "10px 20px", fontSize: "13px", color: MUTED }}>
            <span>📍</span>
            경기도 고양시 일산동구 고봉로 32-19 남중시티프라자 7동 504호
            <span style={{ width: "1px", height: "14px", background: BORDER }} />
            <span>☎ 031-901-4823</span>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "20px" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "36px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: 900, color: AMBER, marginBottom: "8px", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "14px", color: MUTED, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: AMBER_DIM, borderTop: `1px solid ${AMBER_BORDER}`, borderBottom: `1px solid ${AMBER_BORDER}` }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>Our Mission</div>
          <blockquote style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: 800, lineHeight: 1.45, margin: "0 0 28px", letterSpacing: "-0.01em" }}>
            "상상하는 모든 경험을<br />
            <span style={{ color: AMBER }}>기술로 현실에 구현한다"</span>
          </blockquote>
          <p style={{ fontSize: "17px", color: MUTED, lineHeight: 1.8, maxWidth: "620px", margin: "0 auto" }}>
            VR·AR 콘텐츠부터 AI 제조 자동화까지, (주)포디비전은 한 가지 철학으로 달려왔습니다.
            새로운 기술이 사람의 일상을 더 풍요롭게 만들 수 있다는 믿음입니다.
          </p>
        </div>
      </section>

      {/* ── Business Areas ────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Business</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 800, marginBottom: "16px" }}>핵심 사업 영역</h2>
          <p style={{ color: MUTED, fontSize: "17px" }}>정보통신·의료·교육·게임·제조 등 다양한 산업에 기술을 공급합니다</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "24px" }}>
          {BUSINESS.map((b) => (
            <div key={b.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "32px 28px", display: "flex", flexDirection: "column", gap: "16px", transition: "border-color 0.2s" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: `${b.color}18`, border: `1px solid ${b.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{b.icon}</div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "#fff" }}>{b.title}</div>
                <p style={{ fontSize: "14px", color: MUTED, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
              <div style={{ height: "2px", borderRadius: "2px", background: `linear-gradient(90deg, ${b.color}, transparent)`, marginTop: "auto" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Certifications ────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Certifications</div>
            <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 800, marginBottom: "12px" }}>인증 & 특허</h2>
            <p style={{ color: MUTED, fontSize: "17px" }}>국내외 공신력 있는 기관의 검증을 받은 기술력</p>
          </div>

          {/* cert grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: "16px", marginBottom: "48px" }}>
            {CERTIFICATIONS.map((c) => (
              <div key={c.name} style={{ background: CARD, border: `1px solid ${c.color}28`, borderRadius: "16px", padding: "24px 20px", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `${c.color}18`, border: `1px solid ${c.color}40`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "20px", fontWeight: 900, color: c.color }}>{c.name.slice(0, 1)}</span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: SUB }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* patent list */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "20px", padding: "32px 36px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: AMBER, marginBottom: "20px", letterSpacing: "0.06em" }}>등록 특허 · 프로그램 (13건)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "10px" }}>
              {PATENTS.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: MUTED }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: AMBER, flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>History</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 800 }}>회사 연혁</h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div style={{ position: "absolute", left: "88px", top: "16px", bottom: "16px", width: "1px", background: `linear-gradient(to bottom, transparent, ${BORDER} 10%, ${BORDER} 90%, transparent)` }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
                {/* year */}
                <div style={{ width: "88px", flexShrink: 0, textAlign: "right", paddingRight: "24px", position: "relative", paddingTop: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: t.color }}>{t.year}</span>
                  {t.month && <div style={{ fontSize: "11px", color: SUB, marginTop: "1px" }}>{t.month}월</div>}
                  {/* dot */}
                  <span style={{ position: "absolute", right: "-5px", top: "7px", width: "9px", height: "9px", borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}70` }} />
                </div>
                {/* card */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px 22px", flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Fields ────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Application Fields</div>
          <h2 style={{ fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, marginBottom: "12px" }}>적용 분야</h2>
          <p style={{ color: MUTED, fontSize: "16px", marginBottom: "40px" }}>정보통신부터 국방까지 폭넓은 산업 영역에 기술을 제공합니다</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {["정보통신", "방송·미디어", "의료·헬스케어", "교육·훈련", "국방·군사", "게임", "애니메이션", "가상현실", "CAD·설계", "제조·스마트팩토리"].map((f) => (
              <span key={f} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "8px 20px", fontSize: "14px", color: MUTED, fontWeight: 500, whiteSpace: "nowrap" }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Contact</div>
          <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 800, marginBottom: "16px" }}>문의하기</h2>
          <p style={{ color: MUTED, fontSize: "17px" }}>파트너십·도입 문의·채용 등 무엇이든 연락주세요.</p>
        </div>

        {sent ? (
          <div style={{ background: "rgba(104,211,145,0.07)", border: "1px solid rgba(104,211,145,0.22)", borderRadius: "20px", padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#68d391", marginBottom: "10px" }}>문의가 접수되었습니다</div>
            <p style={{ color: MUTED, fontSize: "15px", lineHeight: 1.65 }}>빠른 시일 내에 이메일로 답변드리겠습니다.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "24px", padding: "44px 40px", display: "flex", flexDirection: "column", gap: "22px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { id: "name", label: "이름", ph: "홍길동", key: "name" as const },
                { id: "company", label: "회사명", ph: "(주)예시기업", key: "company" as const },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: "block", fontSize: "13px", fontWeight: 600, color: MUTED, marginBottom: "8px" }}>{f.label}</label>
                  <input id={f.id} type="text" placeholder={f.ph} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required
                    style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: MUTED, marginBottom: "8px" }}>이메일</label>
              <input id="email" type="email" placeholder="example@company.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label htmlFor="message" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: MUTED, marginBottom: "8px" }}>문의 내용</label>
              <textarea id="message" placeholder="파트너십·도입·채용 등 자유롭게 작성해주세요." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required rows={5}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <button type="submit"
              style={{ background: AMBER, color: "#0a0a0a", padding: "15px", borderRadius: "10px", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", width: "100%" }}>
              문의 보내기 →
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: SUB, margin: 0 }}>제출 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.</p>
          </form>
        )}

        {/* Office info */}
        <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "📍", label: "주소", value: "경기도 고양시 일산동구 고봉로 32-19\n남중시티프라자 7동 504호" },
            { icon: "📞", label: "연락처", value: "TEL. 031-901-4823\nFAX. 031-629-6029\nceo@4dvision.co.kr" },
          ].map((o) => (
            <div key={o.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "22px 24px", display: "flex", gap: "14px" }}>
              <span style={{ fontSize: "22px", flexShrink: 0 }}>{o.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>{o.label}</div>
                <div style={{ fontSize: "13px", color: MUTED, lineHeight: 1.7, whiteSpace: "pre-line" }}>{o.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
