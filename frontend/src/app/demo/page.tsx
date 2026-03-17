"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const industries = ["제조업", "금융서비스", "통신", "유통/리테일", "의료/바이오", "공공/정부", "에너지/유틸리티", "미디어/엔터테인먼트", "기타"];
const companySizes = ["50명 미만", "50~200명", "200~500명", "500~2,000명", "2,000명 이상"];
const interests = ["AI 에이전트 플랫폼", "데이터 분석 대시보드", "보고서 자동화", "ERP 연동", "품질관리 자동화", "승인 워크플로우"];

export default function DemoPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", industry: "", size: "", message: "" });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailBody = encodeURIComponent(
      `이름: ${form.name}\n회사: ${form.company}\n이메일: ${form.email}\n전화: ${form.phone}\n업종: ${form.industry}\n규모: ${form.size}\n관심 기능: ${selectedInterests.join(", ")}\n\n문의내용:\n${form.message}`
    );
    window.location.href = `mailto:ceo@4dvision.co.kr?subject=F.A.C.T AI 무료 데모 신청 - ${form.company}&body=${mailBody}`;
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />

      <section style={{ paddingTop: "130px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
          {/* Left: Info */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>FREE DEMO</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              귀사 데이터로<br />
              <span style={{ color: "#D4920A" }}>직접 경험</span>하는<br />
              F.A.C.T AI
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "40px" }}>
              데모 신청 후 영업일 1일 이내 전담 솔루션 엔지니어가 연락드립니다.<br />
              귀사의 실제 업무 환경에 맞춘 맞춤형 시연을 무료로 제공합니다.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
              {[
                { icon: "✓", text: "귀사 데이터 구조 기반 맞춤 시연" },
                { icon: "✓", text: "14일 무료 체험 계정 제공" },
                { icon: "✓", text: "전담 온보딩 엔지니어 1:1 지원" },
                { icon: "✓", text: "기존 ERP/MES 연동 가능 여부 사전 검토" },
                { icon: "✓", text: "신용카드 불필요 · 약정 없음" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "#D4920A", fontWeight: 800, fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#D4920A", marginBottom: "12px" }}>즉시 문의</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>📧 ceo@4dvision.co.kr</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>📞 031-901-4823</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>📞 031-629-6029</div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div style={{ background: "rgba(212,146,10,0.08)", border: "1px solid rgba(212,146,10,0.3)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>신청이 완료되었습니다</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>영업일 1일 이내에 전담 엔지니어가 연락드리겠습니다.<br />ceo@4dvision.co.kr로도 바로 문의하실 수 있습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "28px" }}>무료 데모 신청</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  {[
                    { key: "name", label: "담당자 이름 *", type: "text", required: true },
                    { key: "company", label: "회사명 *", type: "text", required: true },
                    { key: "email", label: "이메일 *", type: "email", required: true },
                    { key: "phone", label: "연락처", type: "tel", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block" }}>{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={(form as Record<string, string>)[field.key]}
                        onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block" }}>업종</label>
                  <select
                    value={form.industry}
                    onChange={(e) => setForm(prev => ({ ...prev, industry: e.target.value }))}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none" }}
                  >
                    <option value="">업종 선택</option>
                    {industries.map(i => <option key={i} value={i} style={{ background: "#1a1a1a" }}>{i}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block" }}>회사 규모</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm(prev => ({ ...prev, size: e.target.value }))}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none" }}
                  >
                    <option value="">규모 선택</option>
                    {companySizes.map(s => <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", display: "block" }}>관심 기능 (복수 선택)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {interests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        style={{
                          fontSize: "12px",
                          padding: "6px 14px",
                          borderRadius: "100px",
                          border: selectedInterests.includes(item) ? "1px solid #D4920A" : "1px solid rgba(255,255,255,0.12)",
                          background: selectedInterests.includes(item) ? "rgba(212,146,10,0.15)" : "rgba(255,255,255,0.04)",
                          color: selectedInterests.includes(item) ? "#D4920A" : "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block" }}>문의사항 (선택)</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="현재 가장 큰 업무 고충이나 궁금한 점을 적어주세요"
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: "100%", background: "#D4920A", color: "#0a0a0a", padding: "14px", borderRadius: "10px", fontWeight: 800, fontSize: "16px", border: "none", cursor: "pointer" }}
                >
                  무료 데모 신청하기
                </button>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "12px" }}>
                  제출 시 이메일 클라이언트가 열립니다. ceo@4dvision.co.kr로 직접 발송됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
