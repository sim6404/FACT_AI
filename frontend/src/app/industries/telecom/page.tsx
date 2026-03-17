import { IndustryPage } from "@/components/marketing/IndustryPage";

export default function TelecomPage() {
  return (
    <IndustryPage
      data={{
        badge: "통신 Industry",
        industry: "통신",
        headline: "네트워크 데이터로",
        headlineAccent: "AI 서비스 혁신",
        subheadline: "네트워크 최적화, 고객 이탈 예측, 서비스 품질 관리까지. F.A.C.T AI가 통신사의 방대한 네트워크·고객 데이터를 실시간 분석하여 서비스 품질과 수익성을 동시에 향상시킵니다.",
        accentColor: "#06b6d4",
        keyStats: [
          { value: "30%", label: "고객 이탈률 감소" },
          { value: "50%", label: "네트워크 장애 예측률 향상" },
          { value: "25%", label: "ARPU 향상" },
          { value: "실시간", label: "네트워크 품질 모니터링" },
        ],
        challenges: [
          "방대한 네트워크 트래픽 데이터 실시간 분석 어려움",
          "고객 이탈 신호 조기 감지 및 선제적 대응 불가",
          "5G 투자 대비 수익화 전략 데이터 부재",
          "서비스 품질(QoS) 저하 원인 분석 지연",
          "고객 맞춤형 요금제·부가서비스 추천 시스템 부재",
          "규제 보고(방통위, 과기정통부) 수작업 처리 부담",
        ],
        solutions: [
          { title: "네트워크 품질 실시간 모니터링", desc: "기지국별 트래픽, 지연, 패킷 손실을 AI가 실시간 분석하고 품질 저하 구간을 즉시 감지합니다." },
          { title: "고객 이탈 예측", desc: "사용 패턴, 불만 이력, 경쟁사 비교 데이터를 AI가 분석하여 이탈 위험 고객을 조기에 식별합니다." },
          { title: "맞춤형 서비스 추천", desc: "AI가 고객 사용 패턴을 분석하여 최적 요금제, 부가서비스, 업셀링 기회를 자동으로 제안합니다." },
          { title: "5G 투자 최적화", desc: "수요 예측과 ROI 분석을 통해 5G 기지국 배치 및 투자 우선순위를 데이터 기반으로 결정합니다." },
          { title: "장애 예측 정비", desc: "네트워크 장비 상태 데이터를 AI가 분석하여 장애 발생 전 선제적 정비를 실행합니다." },
          { title: "규제 보고 자동화", desc: "방통위, 과기정통부 등 규제 보고서를 AI가 자동 생성하여 컴플라이언스 부담을 줄입니다." },
        ],
        useCases: [
          { title: "고객 이탈률 감소", desc: "AI 이탈 예측과 선제적 리텐션 캠페인으로 이탈률을 30% 줄입니다.", kpi: "30%↓" },
          { title: "ARPU 향상", desc: "맞춤형 서비스 추천으로 가입자당 평균 수익을 25% 높입니다.", kpi: "+25%" },
          { title: "장애 예방 효과", desc: "예측 정비로 계획 외 네트워크 장애를 50% 줄여 서비스 안정성을 높입니다.", kpi: "50%↓" },
        ],
      }}
    />
  );
}
