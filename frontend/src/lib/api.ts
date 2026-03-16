/**
 * F.A.C.T API 클라이언트
 * axios 기반, 인터셉터로 토큰 자동 첨부
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 60_000,
    headers: { "Content-Type": "application/json" },
  });

  // Request: add auth token
  client.interceptors.request.use(config => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("fact_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response: global error handling
  client.interceptors.response.use(
    r => r,
    err => {
      if (err.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("fact_token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(err);
    }
  );

  return client;
}

export const api = createApiClient();

// ── API functions ────────────────────────────────────────────
export const agentApi = {
  query: (question: string, department?: string) =>
    api.post("/agent/query", { question, department }).then(r => r.data),

  getRuns: (limit = 20) =>
    api.get("/agent/runs", { params: { limit } }).then(r => r.data),

  feedback: (runId: string, isHelpful: boolean, comment?: string) =>
    api.post("/agent/feedback", { run_id: runId, is_helpful: isHelpful, comment }),
};

export const dashboardApi = {
  summary:  () => api.get("/dashboard/summary").then(r => r.data),
  alerts:   (severity?: string) => api.get("/dashboard/alerts", { params: { severity } }).then(r => r.data),
};

export const kpiApi = {
  get:   (dept: string) => api.get(`/kpi/${dept}`).then(r => r.data),
  trend: (dept: string, kpi: string, weeks = 12) =>
    api.get(`/kpi/${dept}/trend`, { params: { kpi, weeks } }).then(r => r.data),
};

export const reportsApi = {
  list:     (dept?: string) => api.get("/reports", { params: { department: dept } }).then(r => r.data),
  get:      (id: string)   => api.get(`/reports/${id}`).then(r => r.data),
  generate: (body: object) => api.post("/reports/generate", body).then(r => r.data),
  publish:  (id: string)   => api.post(`/reports/${id}/publish`).then(r => r.data),
};

export const approvalsApi = {
  list:    (status?: string) => api.get("/approvals", { params: { status } }).then(r => r.data),
  approve: (id: number, comment?: string) => api.post(`/approvals/${id}/approve`, { comment }),
  reject:  (id: number, comment?: string) => api.post(`/approvals/${id}/reject`,  { comment }),
};

export const documentsApi = {
  list:   (dept?: string, type?: string) => api.get("/documents", { params: { department: dept, doc_type: type } }).then(r => r.data),
  get:    (id: string)  => api.get(`/documents/${id}`).then(r => r.data),
  search: (query: string, dept?: string, docType?: string, limit = 10) =>
    api.post("/documents/search", { query, department: dept, doc_type: docType, limit }).then(r => r.data),
};
