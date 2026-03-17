"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Users,
  Shield,
  Globe,
  FileText,
  Cpu,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";

// ─── Colour tokens ─────────────────────────────────────────────────────────
const AMBER = "#D4920A";
const AMBER_LIGHT = "#f59e0b";
const AMBER_DIM = "rgba(212,146,10,0.12)";
const AMBER_BORDER = "rgba(212,146,10,0.25)";
const BG_PAGE = "#0a0a0a";
const BG_CARD = "#141414";
const BG_CARD2 = "#1a1a1a";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT_MUTED = "rgba(255,255,255,0.5)";
const TEXT_SECONDARY = "rgba(255,255,255,0.7)";

// ─── Reusable small components ──────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
      style={{
        background: AMBER_DIM,
        border: `1px solid ${AMBER_BORDER}`,
        color: AMBER,
      }}
    >
      {children}
    </span>
  );
}

function AmberButton({
  href,
  children,
  large,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-all ${large ? "px-8 py-4 text-base" : "px-5 py-2.5 text-sm"}`}
      style={{ background: AMBER, color: "#0a0a0a" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = AMBER_LIGHT)}
      onMouseLeave={(e) => (e.currentTarget.style.background = AMBER)}
    >
      {children}
    </Link>
  );
}

function GhostButton({
  href,
  children,
  large,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all ${large ? "px-8 py-4 text-base" : "px-5 py-2.5 text-sm"}`}
      style={{
        border: "1px solid rgba(255,255,255,0.18)",
        color: "rgba(255,255,255,0.85)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = AMBER_BORDER;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.background = AMBER_DIM;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </Link>
  );
}

// ─── Section 1: Hero ────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
      style={{ background: BG_PAGE, paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      {/* Radial amber glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(212,146,10,0.13) 0%, transparent 70%)",
        }}
      />
      {/* Grid lines texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(212,146,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,146,10,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: AMBER_DIM,
              border: `1px solid ${AMBER_BORDER}`,
              color: AMBER,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: AMBER }}
            />
            F.A.C.T AI 기반 기업 업무 자동화 플랫폼
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            color: "#fff",
            letterSpacing: "-0.03em",
          }}
        >
          제조 업무 자동화의
          <br />
          <span style={{ color: AMBER }}>새로운 기준</span>
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: TEXT_SECONDARY,
          }}
        >
          F.A.C.T AI 에이전트가 생산·품질·영업·구매 데이터를 실시간 분석하여
          <br className="hidden md:block" />
          현장 담당자의 의사결정을 자동화합니다.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <AmberButton href="/demo" large>
            무료 데모 신청 <ArrowRight className="w-5 h-5" />
          </AmberButton>
          <GhostButton href="/platform" large>
            플랫폼 살펴보기 <ChevronRight className="w-5 h-5" />
          </GhostButton>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${BORDER}`, background: BORDER }}
        >
          {[
            { value: "120+", label: "도입 기업 수" },
            { value: "78%", label: "업무 자동화율" },
            { value: "42%↓", label: "평균 PPM 감소" },
            { value: "3.2x", label: "투자 대비 ROI" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 px-4"
              style={{ background: BG_CARD }}
            >
              <span
                className="font-black text-3xl mb-1"
                style={{ color: AMBER }}
              >
                {stat.value}
              </span>
              <span className="text-xs" style={{ color: TEXT_MUTED }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Trusted By ──────────────────────────────────────────────────

function TrustedBySection() {
  const logos = [
    "현대모비스",
    "삼성SDI",
    "LG이노텍",
    "평화산업",
    "한화솔루션",
    "LS일렉트릭",
  ];
  return (
    <section
      className="py-12 px-6"
      style={{
        background: BG_CARD,
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center text-sm mb-8 tracking-widest uppercase"
          style={{ color: TEXT_MUTED }}
        >
          이미 선도 제조기업들이 신뢰합니다
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {logos.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center px-6 py-3 rounded-xl"
              style={{
                background: BG_CARD2,
                border: `1px solid ${BORDER}`,
                minWidth: "140px",
              }}
            >
              <span
                className="font-bold text-sm tracking-tight"
                style={{ color: TEXT_SECONDARY }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Why FACT ────────────────────────────────────────────────────

function WhyFactSection() {
  const cards = [
    {
      icon: <Cpu className="w-6 h-6" style={{ color: AMBER }} />,
      title: "AI 에이전트 자동화",
      desc: "자연어 질의 한 번으로 생산·품질·영업 리포트를 즉시 생성합니다. F.A.C.T AI 에이전트가 복잡한 다단계 분석을 자동으로 수행합니다.",
      points: [
        "한국어 자연어 질의 지원",
        "멀티 에이전트 오케스트레이션",
        "자동 주간·월간 보고서 생성",
      ],
    },
    {
      icon: <BarChart3 className="w-6 h-6" style={{ color: AMBER }} />,
      title: "실시간 데이터 분석",
      desc: "ERP·MES·SCM 데이터를 단일 플랫폼에 통합하여 현장 이상을 실시간으로 감지하고 즉각 알림을 발송합니다.",
      points: [
        "PPM·불량률 실시간 모니터링",
        "임계값 초과 즉시 알림",
        "AI Cortex Analyst 연동",
      ],
    },
    {
      icon: <Users className="w-6 h-6" style={{ color: AMBER }} />,
      title: "전사 업무 통합",
      desc: "생산, 품질, 영업, 구매 부서가 하나의 AI 플랫폼에서 협업하고 승인 워크플로우를 자동화합니다.",
      points: [
        "부서간 데이터 사일로 해소",
        "전자결재·승인 자동화",
        "역할 기반 접근 제어",
      ],
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: BG_PAGE }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>핵심 역량</SectionLabel>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            왜 F.A.C.T AI인가요?
          </h2>
          <p
            className="max-w-xl mx-auto"
            style={{ color: TEXT_SECONDARY, fontSize: "1.05rem" }}
          >
            20년간 쌓인 제조 현장 노하우와 최신 AI 기술의 결합으로, 현장에서
            즉시 사용 가능한 자동화를 제공합니다.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl p-8 transition-all group"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  AMBER_BORDER;
                (e.currentTarget as HTMLDivElement).style.background =
                  BG_CARD2;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
                (e.currentTarget as HTMLDivElement).style.background = BG_CARD;
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: AMBER_DIM, border: `1px solid ${AMBER_BORDER}` }}
              >
                {card.icon}
              </div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#fff" }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: TEXT_SECONDARY }}>
                {card.desc}
              </p>
              <ul className="flex flex-col gap-2 mt-auto">
                {card.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: TEXT_SECONDARY }}
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: AMBER }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Platform Overview ───────────────────────────────────────────

function PlatformSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "생산관리",
      heading: "생산 현장을 AI가 실시간으로 감시합니다",
      desc: "설비 가동률, 생산량, OEE 지표를 AI가 자동 집계하고 이상 징후를 사전에 탐지합니다. 라인 변경, 작업 지시, 실적 마감까지 자동화합니다.",
      features: [
        "OEE·설비가동률 실시간 대시보드",
        "생산 계획 대비 실적 자동 분석",
        "이상 징후 예측 알림 (AI 기반)",
        "작업 지시 자동 생성 및 배포",
        "AI 기반 이력 데이터 분석",
        "주간·월간 생산 리포트 자동 생성",
      ],
      accent: "#3b82f6",
      chartData: [65, 78, 72, 88, 82, 91, 87, 94],
    },
    {
      label: "품질관리",
      heading: "PPM을 낮추는 가장 빠른 방법",
      desc: "불량 데이터를 AI가 자동 분류하고 근본 원인을 추적합니다. 4M 변동 감지부터 고객 클레임 대응까지 품질 업무 전반을 자동화합니다.",
      features: [
        "PPM·불량률 실시간 추이 분석",
        "불량 원인 AI 자동 분류",
        "4M 변동 감지 및 알림",
        "고객 클레임 자동 접수·처리",
        "품질 비용 자동 산출",
        "IATF 16949 대응 문서 자동화",
      ],
      accent: "#10b981",
      chartData: [38, 31, 29, 22, 18, 14, 12, 9],
    },
    {
      label: "영업관리",
      heading: "수주부터 매출까지 한눈에",
      desc: "CRM 데이터와 ERP 매출 데이터를 AI가 통합 분석하여 수주 예측, 고객별 수익성, 담당자별 성과를 자동으로 리포팅합니다.",
      features: [
        "수주·매출 예측 AI 모델",
        "고객별 수익성 자동 분석",
        "견적 자동 생성 및 승인 워크플로우",
        "담당자별 KPI 대시보드",
        "미수금 현황 실시간 모니터링",
        "영업 주간 보고서 자동 작성",
      ],
      accent: "#8b5cf6",
      chartData: [42, 51, 58, 63, 71, 79, 85, 92],
    },
    {
      label: "구매자재",
      heading: "재고 최적화와 납기 자동관리",
      desc: "공급업체 납기, 재고 수준, 단가 변동을 AI가 모니터링하여 발주 타이밍을 자동 추천하고 구매 리드타임을 단축합니다.",
      features: [
        "최적 발주점 AI 자동 계산",
        "공급업체 납기 준수율 모니터링",
        "재고 과잉·부족 사전 알림",
        "단가 비교 및 구매 협상 지원",
        "자재 BOM 자동 관리",
        "구매 비용 절감 리포트",
      ],
      accent: "#f97316",
      chartData: [55, 60, 57, 68, 72, 75, 80, 83],
    },
  ];

  const active = tabs[activeTab];

  return (
    <section className="py-24 px-6" style={{ background: BG_CARD }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>플랫폼 모듈</SectionLabel>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            업무 영역별 AI 자동화
          </h2>
          <p style={{ color: TEXT_SECONDARY, fontSize: "1.05rem" }}>
            생산·품질·영업·구매 각 모듈이 유기적으로 연결되어 전사 데이터를
            통합합니다.
          </p>
        </div>

        {/* Tab buttons */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-10"
          role="tablist"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={
                activeTab === i
                  ? {
                      background: AMBER,
                      color: "#0a0a0a",
                    }
                  : {
                      background: BG_CARD2,
                      color: TEXT_SECONDARY,
                      border: `1px solid ${BORDER}`,
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="grid md:grid-cols-2 gap-8 rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {/* Left: info */}
          <div className="p-8 md:p-10" style={{ background: BG_PAGE }}>
            <h3
              className="font-bold text-xl mb-3"
              style={{ color: "#fff" }}
            >
              {active.heading}
            </h3>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: TEXT_SECONDARY }}
            >
              {active.desc}
            </p>
            <ul className="flex flex-col gap-3">
              {active.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: TEXT_SECONDARY }}
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: AMBER }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <AmberButton href={`/${tabs[activeTab].label === "생산관리" ? "production" : tabs[activeTab].label === "품질관리" ? "quality" : tabs[activeTab].label === "영업관리" ? "sales" : "purchase"}`}>
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </AmberButton>
            </div>
          </div>

          {/* Right: mock dashboard */}
          <div
            className="p-8 flex flex-col gap-4"
            style={{ background: BG_CARD2 }}
          >
            {/* Mock header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                {active.label} 대시보드
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                실시간 연동중
              </span>
            </div>

            {/* Mock KPI row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "오늘 실적", value: "98.4%", delta: "+2.1%" },
                { label: "이슈 건수", value: "3건", delta: "-5건" },
                { label: "자동화율", value: "76%", delta: "+12%" },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl p-3"
                  style={{ background: BG_PAGE, border: `1px solid ${BORDER}` }}
                >
                  <div className="text-xs mb-1" style={{ color: TEXT_MUTED }}>
                    {kpi.label}
                  </div>
                  <div
                    className="font-bold text-base"
                    style={{ color: "#fff" }}
                  >
                    {kpi.value}
                  </div>
                  <div className="text-xs" style={{ color: "#10b981" }}>
                    {kpi.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock chart bars */}
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: BG_PAGE, border: `1px solid ${BORDER}` }}
            >
              <span className="text-xs mb-2" style={{ color: TEXT_MUTED }}>
                최근 8주 추이
              </span>
              <div className="flex items-end gap-1.5 h-24">
                {active.chartData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all"
                    style={{
                      height: `${val}%`,
                      background:
                        i === active.chartData.length - 1
                          ? AMBER
                          : `rgba(212,146,10,${0.25 + i * 0.07})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mock alert */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: "rgba(212,146,10,0.06)",
                border: `1px solid ${AMBER_BORDER}`,
              }}
            >
              <Zap
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: AMBER }}
              />
              <div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: AMBER }}>
                  AI 인사이트
                </div>
                <div className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  전주 대비 이상 발생률 18% 감소. 2라인 정비 일정 최적화 권고.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Features Grid ────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: <Cpu className="w-5 h-5" style={{ color: AMBER }} />,
      title: "엔터프라이즈 AI 클라우드",
      desc: "엔터프라이즈급 AI 데이터 클라우드와 네이티브 연동. Cortex Analyst, Cortex Search, Cortex Agents를 동시에 활용합니다.",
    },
    {
      icon: <Globe className="w-5 h-5" style={{ color: AMBER }} />,
      title: "한국어 자연어 질의",
      desc: "\"이번 주 2라인 불량률 원인 분석해줘\" 같은 자연어 질문에 AI가 즉시 데이터를 분석하고 답변합니다.",
    },
    {
      icon: <FileText className="w-5 h-5" style={{ color: AMBER }} />,
      title: "주간보고서 자동생성",
      desc: "매주 월요일 아침 7시, 전주 실적이 담긴 PDF·PPT 보고서가 자동으로 생성되어 임원진에게 발송됩니다.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" style={{ color: AMBER }} />,
      title: "실시간 PPM 모니터링",
      desc: "생산 라인별 PPM을 실시간 추적하고 임계값 초과 시 즉각 알림을 발송합니다. 품질 담당자의 야간 작업을 없애줍니다.",
    },
    {
      icon: <Shield className="w-5 h-5" style={{ color: AMBER }} />,
      title: "보안 인증",
      desc: "ISO 27001, ISMS-P 인증. 온프레미스·프라이빗 클라우드 배포 지원. 기업 데이터를 외부에 유출하지 않는 구조.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" style={{ color: AMBER }} />,
      title: "모바일 완전 대응",
      desc: "현장 작업자부터 경영진까지 모바일에서 동일한 경험. PWA 지원으로 앱 설치 없이 스마트폰에서 즉시 접근 가능.",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: BG_PAGE }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>주요 기능</SectionLabel>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            강력한 기능, 쉬운 사용
          </h2>
          <p style={{ color: TEXT_SECONDARY, fontSize: "1.05rem" }}>
            복잡한 설정 없이 도입 첫날부터 AI 자동화를 경험하세요.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="rounded-2xl p-6 transition-all"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  AMBER_BORDER;
                (e.currentTarget as HTMLDivElement).style.background =
                  BG_CARD2;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
                (e.currentTarget as HTMLDivElement).style.background = BG_CARD;
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: AMBER_DIM,
                  border: `1px solid ${AMBER_BORDER}`,
                }}
              >
                {feat.icon}
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{ color: "#fff" }}
              >
                {feat.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Stats Banner ─────────────────────────────────────────────────

function StatsBannerSection() {
  return (
    <section
      className="py-20 px-6"
      style={{
        background: `linear-gradient(135deg, #1a0f00 0%, #0f0900 40%, #1a1100 100%)`,
        borderTop: `1px solid ${AMBER_BORDER}`,
        borderBottom: `1px solid ${AMBER_BORDER}`,
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <p
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: AMBER }}
        >
          고객 성과
        </p>
        <h2
          className="font-black mb-12"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          254억원 매출 관리 자동화 달성
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { value: "254억+", label: "자동화 처리 매출 누계" },
            { value: "38만건+", label: "AI가 처리한 업무 건수" },
            { value: "1,200시간", label: "월간 절감 인력 시간" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                className="font-black mb-2"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  color: AMBER,
                }}
              >
                {stat.value}
              </span>
              <span className="text-sm" style={{ color: TEXT_MUTED }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: Testimonials ─────────────────────────────────────────────────

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "도입 3개월 만에 주간 품질 보고서 작성 시간이 8시간에서 0시간으로 줄었습니다. 팀원들이 분석에만 집중할 수 있게 됐고, PPM도 31% 개선됐습니다.",
      name: "김민준",
      title: "품질혁신팀장",
      company: "현대모비스",
      stars: 5,
    },
    {
      quote:
        "F.A.C.T AI 덕분에 기존 데이터 인프라와 연동이 빨랐습니다. 영업 데이터와 생산 데이터를 동시에 보며 의사결정하는 게 이제 일상이 됐어요.",
      name: "박서연",
      title: "디지털전환 담당 이사",
      company: "LG이노텍",
      stars: 5,
    },
    {
      quote:
        "중소기업도 대기업과 동일한 AI 분석 인프라를 쓸 수 있다는 게 F.A.C.T AI의 가장 큰 장점입니다. 구매자재 발주 자동화만으로 연간 2억원을 절감했습니다.",
      name: "이정훈",
      title: "대표이사",
      company: "평화산업",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: BG_CARD }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>고객 후기</SectionLabel>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            현장의 목소리
          </h2>
          <p style={{ color: TEXT_SECONDARY }}>
            실제 도입 기업 담당자들이 직접 전하는 경험입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl p-7"
              style={{
                background: BG_PAGE,
                border: `1px solid ${BORDER}`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    style={{ color: AMBER, fill: AMBER }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed mb-6 flex-1"
                style={{ color: TEXT_SECONDARY }}
              >
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: AMBER_DIM, color: AMBER, border: `1px solid ${AMBER_BORDER}` }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#fff" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: TEXT_MUTED }}>
                    {t.title} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 8: Pricing Preview ──────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "스타터",
      price: "비용 문의",
      sub: "기업 규모별 맞춤 산정",
      highlight: false,
      desc: "중소기업을 위한 핵심 AI 자동화 패키지",
      features: [
        "최대 10명 사용자",
        "생산·품질 모듈 포함",
        "AI 자연어 질의 1,000건/월",
        "주간 보고서 자동생성",
        "이메일 알림 지원",
        "표준 온보딩 지원",
      ],
    },
    {
      name: "프로",
      price: "비용 문의",
      sub: "기업 규모별 맞춤 산정",
      highlight: true,
      desc: "성장하는 중견기업을 위한 전사 자동화",
      features: [
        "최대 50명 사용자",
        "전 모듈 (생산·품질·영업·구매)",
        "AI 질의 무제한",
        "일·주·월간 보고서 자동생성",
        "Slack·Teams 알림 연동",
        "전담 고객 성공 매니저",
        "커스텀 대시보드 구성",
        "API 연동 지원",
      ],
    },
    {
      name: "엔터프라이즈",
      price: "맞춤 견적",
      sub: "계약 조건 협의 가능",
      highlight: false,
      desc: "대기업·그룹사를 위한 완전 맞춤형 솔루션",
      features: [
        "사용자 무제한",
        "온프레미스·프라이빗 클라우드 배포",
        "SSO·LDAP 연동",
        "전용 AI 클라우드 환경 구성",
        "전담 엔지니어 배정",
        "SLA 99.9% 보장",
        "전사 커스터마이징",
        "임원급 보고 체계 구성",
      ],
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: BG_PAGE }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>가격 안내</SectionLabel>
          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            투명한 가격 정책
          </h2>
          <p style={{ color: TEXT_SECONDARY, fontSize: "1.05rem" }}>
            기업별 커스터마이징 비용 문의 —{" "}
            <a href="mailto:ceo@4dvision.co.kr" style={{ color: AMBER, textDecoration: "none" }}>
              ceo@4dvision.co.kr
            </a>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col rounded-2xl p-7 relative"
              style={{
                background: plan.highlight ? BG_CARD2 : BG_CARD,
                border: plan.highlight
                  ? `1.5px solid ${AMBER}`
                  : `1px solid ${BORDER}`,
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: AMBER, color: "#0a0a0a" }}
                >
                  가장 인기 있는 플랜
                </div>
              )}

              <div className="mb-5">
                <h3
                  className="font-black text-lg mb-1"
                  style={{ color: "#fff" }}
                >
                  {plan.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
                  {plan.desc}
                </p>
                <div
                  className="font-black text-3xl mb-0.5"
                  style={{ color: plan.highlight ? AMBER : "#fff" }}
                >
                  {plan.price}
                </div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>
                  {plan.sub}
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: TEXT_SECONDARY }}
                  >
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: AMBER }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:ceo@4dvision.co.kr"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center transition-all"
                style={
                  plan.highlight
                    ? { background: AMBER, color: "#0a0a0a" }
                    : {
                        border: `1px solid ${BORDER}`,
                        color: "#fff",
                        background: "transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (plan.highlight) {
                    e.currentTarget.style.background = AMBER_LIGHT;
                  } else {
                    e.currentTarget.style.borderColor = AMBER_BORDER;
                    e.currentTarget.style.background = AMBER_DIM;
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.highlight) {
                    e.currentTarget.style.background = AMBER;
                  } else {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                도입 문의하기
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: TEXT_MUTED }}>
          문의 후 48시간 내 전문 담당자가 연락드립니다 · TEL. 031-901-4823
        </p>
      </div>
    </section>
  );
}

// ─── Section 9: CTA ──────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section
      className="py-28 px-6 text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #1a0f00 0%, #0f0900 50%, #1a1200 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,146,10,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionLabel>지금 시작하세요</SectionLabel>
        <h2
          className="font-black mb-5"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#fff",
            letterSpacing: "-0.03em",
          }}
        >
          제조 현장의 AI 혁신,
          <br />
          <span style={{ color: AMBER }}>오늘 바로 시작하세요</span>
        </h2>
        <p
          className="mb-10 leading-relaxed"
          style={{ color: TEXT_SECONDARY, fontSize: "1.1rem" }}
        >
          14일 무료 체험으로 F.A.C.T AI의 모든 기능을 경험해보세요.
          <br />
          신용카드 없이 5분 안에 시작할 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AmberButton href="/start" large>
            무료 데모 신청하기 <ArrowRight className="w-5 h-5" />
          </AmberButton>
          <GhostButton href="/contact" large>
            영업팀 상담 요청 <ChevronRight className="w-5 h-5" />
          </GhostButton>
        </div>
        <p className="text-xs mt-6" style={{ color: TEXT_MUTED }}>
          평일 기준 24시간 이내 전담 컨설턴트가 연락드립니다.
        </p>
      </div>
    </section>
  );
}

// ─── Section 10: Footer ───────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      heading: "플랫폼",
      links: [
        { label: "생산관리 모듈", href: "/platform/production" },
        { label: "품질관리 모듈", href: "/platform/quality" },
        { label: "영업관리 모듈", href: "/platform/sales" },
        { label: "구매자재 모듈", href: "/platform/purchase" },
        { label: "AI 에이전트", href: "/platform/agent" },
        { label: "보고서 센터", href: "/platform/reports" },
      ],
    },
    {
      heading: "솔루션",
      links: [
        { label: "자동차 부품", href: "/solutions/auto-parts" },
        { label: "전자·반도체", href: "/solutions/electronics" },
        { label: "화학·소재", href: "/solutions/chemical" },
        { label: "중견기업 패키지", href: "/solutions/mid-market" },
        { label: "대기업 엔터프라이즈", href: "/solutions/enterprise" },
      ],
    },
    {
      heading: "리소스",
      links: [
        { label: "고객 사례", href: "/cases" },
        { label: "기술 블로그", href: "/blog" },
        { label: "API 문서", href: "/docs/api" },
        { label: "도입 가이드", href: "/docs/guide" },
        { label: "자주 묻는 질문", href: "/faq" },
        { label: "보안 센터", href: "/security" },
      ],
    },
    {
      heading: "회사",
      links: [
        { label: "회사 소개", href: "/about" },
        { label: "채용 공고", href: "/careers" },
        { label: "파트너 프로그램", href: "/partners" },
        { label: "뉴스룸", href: "/news" },
        { label: "문의하기", href: "/contact" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "#050505",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, ${AMBER}, ${AMBER_LIGHT})`,
                  color: "#0a0a0a",
                }}
              >
                F
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                F.A.C.T{" "}
                <span style={{ color: AMBER, fontSize: "0.8em" }}>AI</span>
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: TEXT_MUTED }}
            >
              AI 기반 기업 업무 자동화 플랫폼.
              <br />
              (주)포디비전이 만든 차세대 ERP.
            </p>
            <div className="flex flex-col gap-1.5">
              <a href="mailto:ceo@4dvision.co.kr" className="text-xs transition-colors" style={{ color: AMBER }}>
                ceo@4dvision.co.kr
              </a>
              <span className="text-xs" style={{ color: TEXT_MUTED }}>
                TEL. 031-901-4823
              </span>
              <span className="text-xs" style={{ color: TEXT_MUTED }}>
                경기도 고양시 일산동 고봉로 32-19
              </span>
              <a href="https://www.4dvision.co.kr" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ color: TEXT_MUTED }}>
                www.4dvision.co.kr
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: "#fff" }}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: TEXT_MUTED }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = TEXT_MUTED)
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${BORDER}` }} className="pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              © 2007–2026 (주)포디비전 · F.A.C.T AI. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "개인정보처리방침", href: "/privacy" },
                { label: "서비스 이용약관", href: "/terms" },
                { label: "쿠키 정책", href: "/cookies" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs transition-colors"
                  style={{ color: TEXT_MUTED }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = TEXT_MUTED)
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: AMBER_DIM,
                  color: AMBER,
                  border: `1px solid ${AMBER_BORDER}`,
                }}
              >
                ISO 27001
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                ISMS-P
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                4D VISION
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: BG_PAGE, minHeight: "100vh" }}>
      <MarketingNav />
      <HeroSection />
      <TrustedBySection />
      <WhyFactSection />
      <PlatformSection />
      <FeaturesSection />
      <StatsBannerSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
