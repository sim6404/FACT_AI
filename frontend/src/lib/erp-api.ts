/**
 * F.A.C.T ERP API 클라이언트
 * 자동차 부품 제조업 특화 (고무/방진 부품)
 */

import { api } from "./api";

// ── 타입 정의 ──────────────────────────────────────────────────────

export interface PurchaseAnalysisRow {
  id?: number;
  year_month: string;
  product_line_id?: number;
  product_line_name?: string;
  supplier_id?: number;
  supplier_name?: string;
  sales_target: number;
  std_purchase_ratio: number;
  std_purchase_amt?: number;
  purchase_target_75?: number;
  actual_sales?: number;
  purchase_achievement?: number;
  prev_stock_amt?: number;
  carryover_amt?: number;
  week1_purchase?: number;
  week2_purchase?: number;
  week3_purchase?: number;
  week4_purchase?: number;
  week5_purchase?: number;
  total_purchase?: number;
  notes?: string | null;
}

export interface PurchaseAnalysisSummary {
  year_month: string;
  total_sales_target: number;
  total_std_purchase_amt: number;
  total_purchase_target_75: number;
  total_actual_purchase: number;
  avg_achievement_pct: number;
  supplier_count: number;
}

export interface QualityDefectRow {
  product_type: string;
  inspection_qty?: number;
  defect_qty?: number;
  ppm?: number;
  defect_amount?: number;
  rework_qty?: number;
  rework_amount?: number;
}

export interface SalesPerformanceRow {
  id?: number;
  year_month?: string;
  customer_name: string;
  sales_target?: number;
  actual_sales?: number;
  achievement_pct?: number;
  gap_amount?: number;
  remarks?: string | null;
}

export interface ProductionWeeklyRow {
  id?: number;
  year_week: string;
  line_code: string;
  plan_qty: number;
  actual_qty: number;
  oee?: number;
  total_downtime_h?: number;
  notes?: string | null;
}

export interface ProductLine {
  id: number;
  code: string;
  name: string;
  std_purchase_ratio: number;
}

// ── 매입관리 API ───────────────────────────────────────────────────

export const purchaseApi = {
  /** 월별 매입현황분석 목록 조회 */
  getAnalysis: (yearMonth: string) =>
    api.get(`/erp/purchase/analysis`, {
      params: { year_month: yearMonth },
    }).then((r) => r.data),

  /** 월별 집계 요약 */
  getSummary: (yearMonth: string): Promise<PurchaseAnalysisSummary> =>
    api.get(`/erp/purchase/analysis/summary`, {
      params: { year_month: yearMonth },
    }).then((r) => r.data),

  /** 공급업체별 집계 */
  getBySupplier: (yearMonth: string) =>
    api.get(`/erp/purchase/analysis/suppliers`, {
      params: { year_month: yearMonth },
    }).then((r) => r.data),

  /** 행 생성/수정 (upsert) */
  upsert: (row: Partial<PurchaseAnalysisRow> & { year_month: string }) =>
    api.post(`/erp/purchase/analysis`, row).then((r) => r.data),

  /** 벌크 upsert */
  bulkUpsert: (yearMonth: string, rows: object[]) =>
    api.post(`/erp/purchase/analysis/bulk`, { year_month: yearMonth, rows }).then((r) => r.data),

  /** 품목 라인 목록 */
  getProductLines: (): Promise<ProductLine[]> =>
    api.get(`/erp/purchase/product-lines`).then((r) => r.data),

  /** 공급업체 목록 */
  getSuppliers: () =>
    api.get(`/erp/purchase/suppliers`).then((r) => r.data),
};

// ── 품질관리 API ───────────────────────────────────────────────────

export const qualityApi = {
  /** PPM 현황 목록 */
  getPpm: (yearMonth: string): Promise<{ items: QualityDefectRow[] } | QualityDefectRow[]> =>
    api.get(`/erp/quality/ppm`, {
      params: { year_month: yearMonth },
    }).then((r) => r.data),

  /** PPM 상세 (품목별) */
  getPpmDetail: (yearMonth: string, productType: string) =>
    api.get(`/erp/quality/ppm/detail`, {
      params: { year_month: yearMonth, product_type: productType },
    }).then((r) => r.data),

  /** PPM 추이 */
  getPpmTrend: (productType: string, months = 6) =>
    api.get(`/erp/quality/ppm/trend`, {
      params: { product_type: productType, months },
    }).then((r) => r.data),

  /** 불량 이력 입력 */
  createDefect: (data: object) =>
    api.post(`/erp/quality/defect`, data).then((r) => r.data),

  /** 고객 클레임 목록 */
  getClaims: (params?: { year_month?: string; status?: string }) =>
    api.get(`/erp/quality/claims`, { params }).then((r) => r.data),

  /** 클레임 등록 */
  createClaim: (data: object) =>
    api.post(`/erp/quality/claims`, data).then((r) => r.data),
};

// ── 생산관리 API ───────────────────────────────────────────────────

export const productionApi = {
  /** 주간 생산 실적 */
  getWeekly: (params?: { year_month?: string; year_week?: string; line_code?: string }): Promise<{ items: ProductionWeeklyRow[] } | ProductionWeeklyRow[]> =>
    api.get(`/erp/production/weekly`, { params }).then((r) => r.data),

  /** 월별 생산 실적 */
  getMonthly: (params?: { year_month?: string; months?: number }): Promise<{ items: any[] } | any[]> =>
    api.get(`/erp/production/monthly`, { params }).then((r) => r.data),

  /** 주간 실적 입력 */
  upsertWeekly: (data: object) =>
    api.post(`/erp/production/weekly`, data).then((r) => r.data),

  /** OEE 추이 */
  getOeeTrend: (lineCode?: string, months = 6) =>
    api.get(`/erp/production/oee/trend`, {
      params: { line_code: lineCode, months },
    }).then((r) => r.data),
};

// ── 영업관리 API ───────────────────────────────────────────────────

export const salesApi = {
  /** 고객사별 매출 실적 */
  getPerformance: (yearMonth: string): Promise<{ items: SalesPerformanceRow[] } | SalesPerformanceRow[]> =>
    api.get(`/erp/sales/performance`, { params: { year_month: yearMonth } }).then((r) => r.data),

  /** 실적 입력/수정 */
  upsertPerformance: (data: object) =>
    api.post(`/erp/sales/performance`, data).then((r) => r.data),

  /** HKMC OEM 진도 */
  getHkmcProgress: (baseDate?: string): Promise<{ items: any[] } | any[]> =>
    api.get(`/erp/sales/hkmc-progress`, { params: { base_date: baseDate } }).then((r) => r.data),

  /** 매출 추이 */
  getTrend: (customerName?: string, months = 6) =>
    api.get(`/erp/sales/performance/trend`, {
      params: { customer_name: customerName, months },
    }).then((r) => r.data),
};

// ── 유틸리티 ───────────────────────────────────────────────────────

/** 금액 단축 포맷: 1.2억원 / 3,500만원 */
export function formatKRW(amount: number | null | undefined): string {
  if (amount == null) return "-";
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 100_000_000) return `${sign}${(abs / 100_000_000).toFixed(1)}억원`;
  if (abs >= 10_000)       return `${sign}${(abs / 10_000).toFixed(0)}만원`;
  return `${sign}${abs.toLocaleString()}원`;
}

/** 금액 전체 포맷: 1,234,567원 */
export function formatKRWFull(amount: number | null | undefined): string {
  if (amount == null) return "-";
  return `${amount.toLocaleString()}원`;
}

/** 현재 연월 (예: "2026-03") */
export function getCurrentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** 현재 연도-주차 (예: "2026-W11") */
export function getCurrentYearWeek(): string {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - startOfYear.getTime()) / 86_400_000 + startOfYear.getDay() + 1) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** PPM 상태 분류 */
export function getPpmStatus(ppm: number): "good" | "warning" | "critical" {
  if (ppm < 500)  return "good";
  if (ppm < 2000) return "warning";
  return "critical";
}

/**
 * 달성률 상태 분류
 * over     : ≥ 100% (초과 달성 — 매입에서는 주의)
 * good     : 80 ~ 100%
 * warning  : 60 ~ 80%
 * critical : < 60%
 */
export function getAchievementStatus(pct: number | null | undefined): "over" | "good" | "warning" | "critical" {
  if (pct == null) return "critical";
  if (pct >= 100) return "over";
  if (pct >= 80)  return "good";
  if (pct >= 60)  return "warning";
  return "critical";
}
