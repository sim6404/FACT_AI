import { IndustryPage } from "@/components/marketing/IndustryPage";

export default function MediaPage() {
  return (
    <IndustryPage
      data={{
        badge: "광고·미디어·엔터테인먼트 Industry",
        industry: "광고·미디어·엔터테인먼트",
        headline: "콘텐츠와 데이터의",
        headlineAccent: "AI 융합 혁신",
        subheadline: "광고 성과 분석, 콘텐츠 소비 패턴 추적, 캠페인 최적화까지. F.A.C.T AI가 미디어·엔터테인먼트 기업의 데이터를 실시간으로 분석하여 콘텐츠 전략과 수익화를 자동화합니다.",
        accentColor: "#a855f7",
        keyStats: [
          { value: "3X", label: "광고 ROI 개선" },
          { value: "70%", label: "캠페인 분석 시간 절감" },
          { value: "45%", label: "콘텐츠 추천 정확도 향상" },
          { value: "실시간", label: "시청자 행동 분석" },
        ],
        challenges: [
          "광고 캠페인 성과 데이터 수동 집계 및 분석 지연",
          "플랫폼별 분산된 콘텐츠 소비 데이터 통합 불가",
          "시청자·독자 행동 패턴 실시간 파악 어려움",
          "광고 인벤토리 최적화 수작업으로 기회 손실",
          "콘텐츠 성과 예측 없는 제작 투자 의사결정",
          "구독자 이탈 감지 및 재유치 캠페인 지연",
        ],
        solutions: [
          { title: "광고 성과 자동 분석", desc: "멀티플랫폼 광고 데이터를 통합하여 캠페인 ROI, 도달률, 전환율을 실시간 대시보드로 제공합니다." },
          { title: "콘텐츠 소비 패턴 분석", desc: "시청자·독자의 소비 행동을 AI가 분석하여 최적 콘텐츠 추천 전략을 자동 도출합니다." },
          { title: "구독자 이탈 예측", desc: "AI가 이탈 위험 구독자를 사전에 감지하고 개인화된 재유치 캠페인을 자동으로 실행합니다." },
          { title: "광고 인벤토리 최적화", desc: "AI가 광고 인벤토리 수요·공급을 실시간 분석하여 수익 극대화 전략을 자동 제안합니다." },
          { title: "콘텐츠 성과 예측", desc: "과거 데이터를 학습한 AI 모델이 신규 콘텐츠의 성과를 사전에 예측합니다." },
          { title: "자동 성과 보고서", desc: "광고주·내부 임원진을 위한 성과 보고서를 AI가 자동 생성하여 보고 업무를 줄입니다." },
        ],
        useCases: [
          { title: "광고 ROI 최적화", desc: "실시간 성과 분석과 자동 조정으로 광고 ROI를 평균 3배 개선합니다.", kpi: "3X ROI" },
          { title: "캠페인 분석 시간 절감", desc: "수동 집계·분석 작업을 AI가 대체하여 분석 시간을 70% 줄입니다.", kpi: "70%↓" },
          { title: "구독 이탈률 감소", desc: "AI 이탈 예측으로 선제적 리텐션 캠페인을 실행하여 이탈률을 30% 감소시킵니다.", kpi: "−30%" },
        ],
      }}
    />
  );
}
