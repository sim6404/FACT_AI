import { IndustryPage } from "@/components/marketing/IndustryPage";

export default function ManufacturingPage() {
  return (
    <IndustryPage
      data={{
        badge: "제조 Industry",
        industry: "제조",
        headline: "스마트 팩토리를 넘어",
        headlineAccent: "AI 자율운영 공장",
        subheadline: "생산·품질·구매·영업 데이터를 AI가 실시간 통합 분석하여 현장 담당자의 의사결정을 자동화합니다. 주간 보고서부터 불량 원인 추적까지, F.A.C.T AI가 제조 현장의 모든 업무를 자동화합니다.",
        accentColor: "#D4920A",
        keyStats: [
          { value: "78%", label: "보고서 작성 시간 절감" },
          { value: "31%", label: "PPM 개선율" },
          { value: "2.4억", label: "연간 업무비용 절감" },
          { value: "48h", label: "도입 후 첫 자동화 완료" },
        ],
        challenges: [
          "주간 보고서 수작업 작성에 8시간 이상 소요",
          "ERP·MES·SCM 데이터 사일로로 통합 분석 불가",
          "품질 불량 원인 추적에 평균 3일 소요",
          "설비 가동률·OEE 실시간 모니터링 부재",
          "구매 매입비율 초과 경보 시스템 없음",
          "부서간 승인 워크플로우 비효율",
        ],
        solutions: [
          { title: "AI 자연어 질의", desc: "\"이번 주 2라인 불량률 원인 분석해줘\" 같은 자연어로 즉시 데이터 분석 결과를 받습니다." },
          { title: "주간 보고서 자동 생성", desc: "생산·품질·영업·구매 데이터를 자동 집계하여 PDF·PPT 보고서를 매주 자동 생성합니다." },
          { title: "PPM 드릴다운 분석", desc: "품번별, 공정별, 고객사별 PPM을 실시간 추적하고 이상 발생 시 즉시 알림을 발송합니다." },
          { title: "설비 가동률 모니터링", desc: "설비별 OEE·가동률을 실시간 대시보드로 확인하고 비가동 원인을 AI가 자동 분류합니다." },
          { title: "구매 매입비율 관리", desc: "매출 대비 매입비율을 자동 계산하고 목표 초과 시 경보를 발생시켜 구매비용을 통제합니다." },
          { title: "전자결재 자동화", desc: "4M 변경, 품질 승인, 주간 보고 등 결재 프로세스를 디지털 워크플로우로 자동화합니다." },
        ],
        useCases: [
          { title: "주간 보고서 자동화", desc: "매주 월요일 아침 7시, 전주 실적이 담긴 보고서가 임원진에게 자동 발송됩니다.", kpi: "0분" },
          { title: "불량 원인 추적 단축", desc: "AI 자동 분류로 불량 원인 파악 시간이 3일에서 2시간으로 단축됩니다.", kpi: "−93%" },
          { title: "구매비용 절감", desc: "매입비율 실시간 모니터링으로 불필요한 구매를 사전에 차단합니다.", kpi: "연 2억+" },
        ],
        testimonial: {
          quote: "도입 3개월 만에 주간 품질 보고서 작성 시간이 8시간에서 0시간으로 줄었습니다. PPM도 31% 개선됐습니다.",
          name: "김민준",
          title: "품질혁신팀장",
          company: "자동차 부품 제조사",
        },
      }}
    />
  );
}
