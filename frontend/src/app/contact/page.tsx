"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const inquiryTypes = [
  { id: "intro", label: "도입 문의", icon: "🏭", desc: "F.A.C.T AI 플랫폼 도입 및 견적 문의" },
  { id: "demo", label: "데모 신청", icon: "🎯", desc: "제품 시연 및 무료 체험 신청" },
  { id: "partner", label: "파트너십 신청", icon: "🤝", desc: "리셀러·SI·기술 파트너십 신청" },
  { id: "other", label: "기타 문의", icon: "💬", desc: "기술 지원, 언론, 채용 등 기타" },
];

const industries = ["제조업", "금융서비스", "통신", "유통/리테일", "의료/바이오", "공공/정부", "에너지/유틸리티", "미디어/엔터테인먼트", "기타"];
const companySizes = ["50명 미만", "50~200명", "200~500명", "500~2,000명", "2,000명 이상"];

const contactInfo = [
  { icon: "📧", label: "이메일", value: "ceo@4dvision.co.kr", link: "mailto:ceo@4dvision.co.kr" },
  { icon: "📞", label: "전화", value: "031-901-4823", link: "tel:031-901-4823" },
  { icon: "📱", label: "휴대폰", value: "010-9039-0329", link: "tel:010-9039-0329" },
  { icon: "📠", label: "팩스", value: "031-629-6029", link: null },
  { icon: "📍", label: "주소", value: "경기도 고양시 일산동 고봉로 32-19\n남정씨티프라자 7차 504호", link: null },
];

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState("intro");
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", industry: "", size: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = inquiryTypes.find(t => t.id === selectedType)?.label ?? "";
    const mailBody = encodeURIComponent(
      `문의 유형: ${typeLabel}\n이름: ${form.name}\n회사: ${form.company}\n이메일: ${form.email}\n전화: ${form.phone}\n업종: ${form.industry}\n규모: ${form.size}\n\n문의내용:\n${form.message}`
    );
    window.location.href = `mailto:ceo@4dvision.co.kr?subject=[${typeLabel}] F.A.C.T AI — ${form.company}&body=${mailBody}`;
    setSubmitted(true);
  };

  const inp = (field: string, placeholder: string, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={(form as Record<string, string>)[field]}
      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
      required
      style={{
        width: "100%", padding: "12px 16px",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box",
      }}
    />
  );

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 64, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(212,146,10,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: "#D4920A", fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, background: "#D4920A", borderRadius: "50%", display: "inline-block" }} />
            Contact Us
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
            도입 문의 · 파트너십 신청
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            F.A.C.T AI 도입을 검토 중이시거나 파트너십에 관심 있으신가요?<br />
            영업일 기준 1일 이내로 담당자가 연락드립니다.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 96px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>

        {/* Form */}
        <div>
          {/* Inquiry Type */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>문의 유형 선택</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {inquiryTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    padding: "18px 20px", borderRadius: 14, textAlign: "left", cursor: "pointer",
                    background: selectedType === t.id ? "rgba(212,146,10,0.12)" : "rgba(255,255,255,0.03)",
                    border: selectedType === t.id ? "1.5px solid rgba(212,146,10,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color: "#fff", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: selectedType === t.id ? "#D4920A" : "#fff" }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          {submitted ? (
            <div style={{ background: "rgba(212,146,10,0.08)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>문의가 접수되었습니다</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                <strong style={{ color: "#D4920A" }}>{form.company}</strong> 담당자님께 영업일 1일 이내 연락드리겠습니다.<br />
                이메일({form.email})로 접수 확인 메일이 발송됩니다.
              </p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", company: "", email: "", phone: "", industry: "", size: "", message: "" }); }}
                style={{ marginTop: 28, padding: "12px 32px", background: "#D4920A", color: "#0a0a0a", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                새 문의 작성
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>담당자 이름 *</label>
                  {inp("name", "홍길동")}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>회사명 *</label>
                  {inp("company", "(주)예시기업")}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>이메일 *</label>
                  {inp("email", "name@company.com", "email")}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>연락처</label>
                  {inp("phone", "010-0000-0000", "tel")}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>업종</label>
                  <select value={form.industry} onChange={e => setForm(prev => ({ ...prev, industry: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: form.industry ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 14, outline: "none" }}>
                    <option value="">업종 선택</option>
                    {industries.map(i => <option key={i} value={i} style={{ background: "#1a1a1a" }}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>임직원 규모</label>
                  <select value={form.size} onChange={e => setForm(prev => ({ ...prev, size: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: form.size ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 14, outline: "none" }}>
                    <option value="">규모 선택</option>
                    {companySizes.map(s => <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>문의 내용 *</label>
                <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} required rows={6}
                  placeholder={selectedType === "partner" ? "파트너십 유형(리셀러/SI/기술 파트너), 보유 고객사 규모, 협력 희망 분야를 작성해 주세요." : "현재 사용 중인 시스템, 도입 목적, 검토 일정 등을 자유롭게 작성해 주세요."}
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
              <button type="submit"
                style={{ background: "#D4920A", color: "#0a0a0a", padding: "15px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", width: "100%" }}>
                {inquiryTypes.find(t => t.id === selectedType)?.label} 보내기 →
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                제출 시 <a href="/privacy" style={{ color: "rgba(212,146,10,0.7)", textDecoration: "underline" }}>개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 100 }}>
          {/* Contact Info */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>직접 연락하기</h3>
            {contactInfo.map(c => (
              <div key={c.label} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{c.label}</div>
                  {c.link ? (
                    <a href={c.link} style={{ fontSize: 14, color: "#D4920A", textDecoration: "none", fontWeight: 600 }}>{c.value}</a>
                  ) : (
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Response Time */}
          <div style={{ background: "rgba(212,146,10,0.06)", border: "1px solid rgba(212,146,10,0.2)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#D4920A", marginBottom: 12 }}>⚡ 빠른 응답 보장</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["도입 문의", "영업일 1일 이내"], ["파트너십", "영업일 2일 이내"], ["기술 지원", "4시간 이내"]].map(([type, time]) => (
                <div key={type} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  <span>{type}</span>
                  <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Office Hours */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>🕘 운영 시간</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
              평일 09:00 – 18:00<br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>토·일·공휴일 휴무</span>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>빠른 바로가기</div>
            {[
              { label: "무료 데모 신청", href: "/demo", desc: "30분 맞춤 시연" },
              { label: "가격 안내", href: "/pricing", desc: "플랜별 요금 확인" },
              { label: "파트너 생태계", href: "/resources/partners", desc: "파트너 혜택 확인" },
            ].map(link => (
              <a key={link.href} href={link.href}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textDecoration: "none", color: "#fff" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{link.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{link.desc}</div>
                </div>
                <span style={{ color: "#D4920A", fontSize: 16 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
