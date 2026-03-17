"use client";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";

const stats = [
  { value: "2021", label: "설립연도" },
  { value: "45명", label: "임직원" },
  { value: "12개", label: "파트너사" },
  { value: "80+", label: "도입기업" },
];

const leaders = [
  {
    name: "김민준",
    role: "CEO · 대표이사",
    bg: "KM",
    color: "#D4920A",
    desc: "전 삼성SDS 제조 솔루션 사업부 · POSTECH 산업공학 박사. 제조 AI 분야 15년 경력.",
    linkedin: "#",
  },
  {
    name: "이서연",
    role: "CTO · 최고기술책임자",
    bg: "LS",
    color: "#63b3ed",
    desc: "전 Snowflake Korea 수석 엔지니어 · KAIST 컴퓨터공학 석사. 데이터 플랫폼 아키텍처 전문가.",
    linkedin: "#",
  },
  {
    name: "박지호",
    role: "CPO · 최고제품책임자",
    bg: "PJ",
    color: "#68d391",
    desc: "전 (주)LG CNS ERP 컨설턴트 · 서울대 경영학 석사. 제조업 디지털전환 프로젝트 50건 이상 주도.",
    linkedin: "#",
  },
  {
    name: "최아인",
    role: "Head of AI",
    bg: "CA",
    color: "#b794f4",
    desc: "전 네이버 클로바 AI 리서처 · POSTECH AI 박사. NLP 기반 제조 데이터 분석 특허 3건 보유.",
    linkedin: "#",
  },
];

const timeline = [
  { year: "2021", title: "(주)포디 설립", desc: "제조 AI 전문 스타트업으로 출발. 시드 투자 30억 유치.", color: "#D4920A" },
  { year: "2022", title: "첫 번째 고객사 도입", desc: "자동차 부품사 (주)영동테크 파일럿 성공. 불량률 62% 감소 실증.", color: "#63b3ed" },
  { year: "2023", title: "Snowflake 공식 파트너 선정", desc: "Snowflake Select Technology Partner. Cortex AI 국내 최초 제조 적용.", color: "#68d391" },
  { year: "2024", title: "Series A 투자 유치", desc: "150억 규모 시리즈 A 완료. 팀 규모 20명 → 45명으로 확장.", color: "#b794f4" },
  { year: "2025", title: "도입기업 80개 달성", desc: "전국 제조업 80개사 도입. 누적 절감액 320억 돌파.", color: "#D4920A" },
];

const partners = [
  { name: "Snowflake", type: "데이터 플랫폼" },
  { name: "Amazon Web Services", type: "클라우드" },
  { name: "Microsoft Azure", type: "클라우드" },
  { name: "한국산업기술진흥원", type: "정부기관" },
  { name: "NIPA", type: "정보통신산업진흥원" },
  { name: "한국표준협회", type: "인증기관" },
];

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: "", company: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily:
          "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <MarketingNav />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "128px",
          paddingBottom: "80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(212,146,10,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(212,146,10,0.1)",
              border: "1px solid rgba(212,146,10,0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "32px",
              fontSize: "13px",
              color: "#D4920A",
              fontWeight: 600,
            }}
          >
            <span style={{ width: "6px", height: "6px", background: "#D4920A", borderRadius: "50%", display: "inline-block" }} />
            (주)포디 소개
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            (주)포디 —{" "}
            <br />
            <span style={{ color: "#D4920A" }}>제조 AI 혁신을 이끌다</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            2021년 설립 이후, 대한민국 제조업이 AI로 경쟁력을 갖출 수 있도록
            데이터 플랫폼과 AI 자동화 솔루션을 개발해왔습니다.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(212,146,10,0.04)",
          borderTop: "1px solid rgba(212,146,10,0.12)",
          borderBottom: "1px solid rgba(212,146,10,0.12)",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#D4920A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Our Mission
          </div>
          <blockquote
            style={{
              fontSize: "clamp(22px, 3vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.45,
              margin: "0 0 28px",
              letterSpacing: "-0.01em",
            }}
          >
            "모든 제조 기업이 AI로<br />
            <span style={{ color: "#D4920A" }}>경쟁력을 갖출 수 있도록</span>"
          </blockquote>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "600px", margin: "0 auto" }}>
            대기업만의 전유물이었던 AI 기술을 중소·중견 제조사도 쉽고 합리적으로
            활용할 수 있도록, 우리는 매일 더 나은 솔루션을 만들어갑니다.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "36px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", fontWeight: 900, color: "#D4920A", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
              리더십 팀
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "17px" }}>
              제조·AI·데이터 분야 최고 전문가들이 만들어가는 팀
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {leaders.map((l) => (
              <div
                key={l.name}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "18px",
                    background: `linear-gradient(135deg, ${l.color}30, ${l.color}15)`,
                    border: `1px solid ${l.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: l.color,
                  }}
                >
                  {l.bg}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{l.name}</div>
                  <div style={{ fontSize: "13px", color: l.color, fontWeight: 600 }}>{l.role}</div>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                  {l.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>회사 연혁</h2>
        </div>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "80px",
              top: "20px",
              bottom: "20px",
              width: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {timeline.map((t) => (
              <div
                key={t.year}
                style={{
                  display: "flex",
                  gap: "32px",
                  alignItems: "flex-start",
                  paddingLeft: "0",
                }}
              >
                {/* Year */}
                <div
                  style={{
                    width: "80px",
                    flexShrink: 0,
                    textAlign: "right",
                    paddingRight: "24px",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 800, color: t.color }}>{t.year}</span>
                  {/* Dot */}
                  <span
                    style={{
                      position: "absolute",
                      right: "-5px",
                      top: "5px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: t.color,
                      boxShadow: `0 0 8px ${t.color}60`,
                    }}
                  />
                </div>
                {/* Content */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px 24px",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{t.title}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            파트너 & 인증
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "17px", marginBottom: "48px" }}>
            글로벌 기술 파트너와 국내 주요 기관의 신뢰를 받고 있습니다
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {partners.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: "160px",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{p.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section style={{ padding: "80px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 800, marginBottom: "16px" }}>
            문의하기
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "17px" }}>
            궁금한 점이 있으시면 언제든 연락주세요. 1 영업일 이내 답변드립니다.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              background: "rgba(104,211,145,0.08)",
              border: "1px solid rgba(104,211,145,0.25)",
              borderRadius: "20px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
            <div style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: "#68d391" }}>
              문의가 접수되었습니다
            </div>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              1 영업일 이내에 이메일로 답변드리겠습니다.<br />감사합니다.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { id: "name", label: "이름", type: "text", placeholder: "홍길동", key: "name" as const },
                { id: "company", label: "회사명", type: "text", placeholder: "(주)예시기업", key: "company" as const },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={formData[f.key]}
                    onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}
              >
                문의 내용
              </label>
              <textarea
                id="message"
                placeholder="도입을 검토 중인 모듈, 현재 사용 중인 시스템, 기타 문의사항을 자유롭게 작성해주세요."
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: "#D4920A",
                color: "#0a0a0a",
                padding: "15px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              문의 보내기 →
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
              제출 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
            </p>
          </form>
        )}

        {/* Office address */}
        <div
          style={{
            marginTop: "32px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "24px 28px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "24px", flexShrink: 0 }}>📍</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>오피스</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              서울특별시 강남구 테헤란로 123, FACT AI 타워
              <br />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>지하철 2호선 강남역 5번 출구 도보 3분</span>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
