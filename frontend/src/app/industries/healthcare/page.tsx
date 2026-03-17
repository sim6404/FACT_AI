import { IndustryPage } from "@/components/marketing/IndustryPage";

export default function HealthcarePage() {
  return (
    <IndustryPage
      data={{
        badge: "의료·헬스케어 Industry",
        industry: "의료·헬스케어",
        headline: "의료 데이터를 통해",
        headlineAccent: "환자 중심 AI 혁신",
        subheadline: "임상 데이터 분석, 운영 효율화, 규제 보고까지. F.A.C.T AI가 의료기관의 복잡한 데이터를 통합 분석하여 의료 서비스 품질과 운영 효율을 동시에 향상시킵니다.",
        accentColor: "#10b981",
        keyStats: [
          { value: "50%", label: "행정 업무 시간 절감" },
          { value: "35%", label: "병상 회전율 개선" },
          { value: "99%", label: "보고서 정확도" },
          { value: "24/7", label: "실시간 모니터링" },
        ],
        challenges: [
          "복잡한 규제 보고(건강보험, 심평원 등) 수작업 처리",
          "의료진 스케줄, 병상 가동률 최적화 어려움",
          "환자 데이터 분산으로 통합 케어 경로 설계 불가",
          "의료 재료·약품 재고 관리 비효율",
          "의료 사고 예방을 위한 선제적 모니터링 부재",
          "임상 성과 지표 수동 집계 및 보고 지연",
        ],
        solutions: [
          { title: "임상 성과 자동 보고", desc: "심평원, 의료 질 평가 등 규제 요건에 맞는 보고서를 AI가 자동 생성합니다." },
          { title: "병상·운영 최적화", desc: "병상 가동률, 수술실 활용도, 의료진 스케줄을 AI가 분석하여 최적 운영 계획을 제안합니다." },
          { title: "의료 재료 재고 관리", desc: "소모품·약품 소비 패턴을 AI가 학습하여 최적 발주 시점과 수량을 자동 제안합니다." },
          { title: "환자 데이터 통합 분석", desc: "EMR, HIS, 검사 결과 등 분산 데이터를 통합하여 환자별 케어 인사이트를 제공합니다." },
          { title: "이상 징후 조기 감지", desc: "환자 바이탈 데이터와 임상 지표를 AI가 실시간 모니터링하여 이상 징후를 조기에 감지합니다." },
          { title: "행정 업무 자동화", desc: "진료 기록, 청구 코딩, 동의서 처리 등 반복 행정 업무를 AI가 자동화합니다." },
        ],
        useCases: [
          { title: "행정 업무 자동화", desc: "보고서 작성·청구 처리 등 행정 업무를 AI가 대체하여 의료진이 환자에 집중할 수 있습니다.", kpi: "50%↓" },
          { title: "병상 가동률 향상", desc: "AI 기반 병상 배정 최적화로 병상 회전율을 35% 개선합니다.", kpi: "+35%" },
          { title: "재고 낭비 절감", desc: "의료 재료 적정 재고 유지로 낭비를 30% 이상 줄입니다.", kpi: "−30%" },
        ],
      }}
    />
  );
}
