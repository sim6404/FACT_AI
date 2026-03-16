"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, ChevronDown, ChevronUp, Code, FileText,
  BarChart3, BookOpen, Loader2, ThumbsUp, ThumbsDown,
  Copy, RefreshCw, AlertCircle, Database, Search, Zap,
} from "lucide-react";
import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Types ──────────────────────────────────────────────────────────────────
interface Source {
  type: "snowflake" | "document" | "tool";
  ref: string;
  desc: string;
  score?: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  route_type?: "structured" | "document" | "mixed" | "report" | "action";
  sql?: string;
  sources?: Source[];
  chart_data?: unknown;
  timestamp: string;
  status?: "loading" | "done" | "error";
}

// ── Preset Questions ────────────────────────────────────────────────────────
const PRESETS = [
  { label: "안전재고 미달 품목 + 발주 추천", dept: "구매/자재" },
  { label: "이번 주 OEE 및 비가동 원인 분석", dept: "생산" },
  { label: "4주간 반복 불량 패턴 및 원인 후보", dept: "품질" },
  { label: "경영보고서 초안 생성 (이번 주)", dept: "경영지원" },
  { label: "공급사 납기 준수율 6개월 추이", dept: "구매" },
  { label: "예산 집행률 vs 목표 비교 (분기)", dept: "경영지원" },
];

const ROUTE_LABELS: Record<string, { label: string; icon: typeof Database; color: string }> = {
  structured: { label: "정형 분석", icon: Database, color: "text-brand-400" },
  document:   { label: "문서 검색", icon: Search,   color: "text-accent-purple" },
  mixed:      { label: "혼합 질의", icon: Zap,       color: "text-accent-cyan" },
  report:     { label: "보고서",    icon: FileText,  color: "text-accent-green" },
  action:     { label: "실행 요청", icon: AlertCircle, color: "text-accent-amber" },
};

// ── Mock response generator (real: POST /api/agent/query) ──────────────────
async function mockAgentQuery(question: string): Promise<Partial<ChatMessage>> {
  await new Promise(r => setTimeout(r, 1800));

  if (question.includes("안전재고") || question.includes("발주")) {
    return {
      route_type: "structured",
      content: `## 안전재고 미달 품목 분석 결과

다음 2주 생산계획 기준으로 **7개 품목**이 안전재고 미달 위험 상태입니다.

| 품목코드 | 품목명 | 현재재고 | 필요량 | 부족량 | 우선순위 |
|---------|-------|---------|-------|-------|---------|
| SUS304-50 | SUS304 Φ50mm | 1,200kg | 2,800kg | **1,600kg** | 🔴 긴급 |
| SCM435-30 | SCM435 Φ30mm | 850kg | 1,400kg | **550kg** | 🔴 긴급 |
| AL6061-20 | AL6061 Φ20mm | 2,100kg | 2,600kg | **500kg** | 🟡 주의 |
| SS400-15 | SS400 t15mm | 3,200kg | 3,500kg | **300kg** | 🟡 주의 |

### 추천 발주 수량

**SUS304 Φ50mm** 기준 추천 발주량: **2,400kg** (안전재고 20% 버퍼 포함)
- 예상 비용: ₩58,080,000 (단가 ₩24,200/kg 기준)
- 권장 납기: 2026-03-19 이전

> 이 추천은 발주 후 **승인 워크플로**를 통해 구매팀장 승인이 필요합니다.`,
      sql: `SELECT
  i.item_code,
  i.item_name,
  i.current_stock_kg,
  pp.required_qty_kg,
  (pp.required_qty_kg - i.current_stock_kg) AS shortage_kg,
  CASE
    WHEN (pp.required_qty_kg - i.current_stock_kg) / i.current_stock_kg > 0.5 THEN '긴급'
    ELSE '주의'
  END AS priority
FROM fact_inventory_snapshot i
JOIN (
  SELECT item_code, SUM(qty_kg) AS required_qty_kg
  FROM fact_production_result
  WHERE planned_date BETWEEN CURRENT_DATE AND DATEADD(day, 14, CURRENT_DATE)
  GROUP BY item_code
) pp ON i.item_code = pp.item_code
WHERE i.current_stock_kg < pp.required_qty_kg
ORDER BY shortage_kg DESC;`,
      sources: [
        { type: "snowflake", ref: "MART.fact_inventory_snapshot", desc: "재고 스냅샷 (오늘 08:00 기준)", score: 1.0 },
        { type: "snowflake", ref: "CORE.fact_production_result",  desc: "2주 생산계획 데이터",             score: 0.97 },
        { type: "snowflake", ref: "CORE.fact_material_price",     desc: "원자재 단가 (A공급사)",            score: 0.88 },
      ],
    };
  }

  if (question.includes("OEE") || question.includes("비가동")) {
    return {
      route_type: "structured",
      content: `## 이번 주 OEE 분석 (12주차)

현재 전체 OEE **84.2%** — 목표 88% 대비 **△3.8%p 미달**

### 비가동 주요 원인 (이번 주)

1. **M-07 유압 이상** (2.3h) — 긴급 수리 중
2. **M-03 금형 교환** (1.8h) — 정기 작업
3. **M-12 원자재 대기** (1.2h) — 입고 지연 영향

### OEE 구성 요소

| 항목 | 이번 주 | 전주 | 목표 |
|-----|--------|-----|-----|
| 가동률 (Availability) | 91.4% | 93.2% | 95% |
| 성능률 (Performance) | 94.8% | 95.1% | 97% |
| 양품률 (Quality) | 97.3% | 97.0% | 98% |
| **OEE** | **84.2%** | **85.6%** | **88%** |`,
      sources: [
        { type: "snowflake", ref: "MART.mart_production_oee_daily", desc: "OEE 일별 마트", score: 1.0 },
        { type: "snowflake", ref: "RAW.raw_mes_machine_events",     desc: "MES 설비 이벤트 원시 데이터",  score: 0.93 },
      ],
    };
  }

  return {
    route_type: "mixed",
    content: `질문을 분석했습니다. 관련 데이터를 조회하여 답변드립니다.\n\n${question}에 대한 분석 결과를 정리하겠습니다. 현재 연동된 ERP/MES 데이터 및 문서를 기반으로 답변을 생성합니다.`,
    sources: [
      { type: "snowflake", ref: "CORE.*", desc: "CORE 레이어 종합 조회", score: 0.85 },
    ],
  };
}

// ── Main Component ──────────────────────────────────────────────────────────
export function AgentQueryPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sqlOpen, setSqlOpen]   = useState<Record<string, boolean>>({});
  const [srcOpen, setSrcOpen]   = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question: string = input.trim()) => {
    if (!question || loading) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    const loadingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      status: "loading",
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const result = await mockAgentQuery(question);
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, ...result, status: "done" }
            : m
        )
      );
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, content: "오류가 발생했습니다. 다시 시도해 주세요.", status: "error" }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            AI 질의
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Cortex Analyst · Cortex Search · 부서별 전문 에이전트</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">F.A.C.T AI에게 물어보세요</h2>
              <p className="text-sm text-slate-500 mt-1">ERP, MES, 품질, 문서까지 자연어로 분석합니다</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.label)}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-surface-border hover:border-brand-600 hover:bg-surface-hover text-left transition-all group"
                >
                  <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5 group-hover:text-brand-300" />
                  <div>
                    <p className="text-sm text-slate-200 group-hover:text-white">{p.label}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{p.dept}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            sqlOpen={sqlOpen}
            srcOpen={srcOpen}
            onToggleSql={id => setSqlOpen(p => ({ ...p, [id]: !p[id] }))}
            onToggleSrc={id => setSrcOpen(p => ({ ...p, [id]: !p[id] }))}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-surface-border">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="자연어로 질문하세요. (예: 이번 주 OEE가 낮은 원인은?)"
              rows={2}
              className="input resize-none pr-12 py-3 text-sm leading-relaxed"
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-600">
              Enter 전송 · Shift+Enter 줄바꿈
            </div>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="btn-primary h-12 px-4 flex-shrink-0"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ───────────────────────────────────────────────────────────
interface BubbleProps {
  msg: ChatMessage;
  sqlOpen: Record<string, boolean>;
  srcOpen: Record<string, boolean>;
  onToggleSql: (id: string) => void;
  onToggleSrc: (id: string) => void;
}

function MessageBubble({ msg, sqlOpen, srcOpen, onToggleSql, onToggleSrc }: BubbleProps) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-2xl bg-brand-700/30 border border-brand-600/30 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-slate-100">{msg.content}</p>
          <p className="text-[10px] text-slate-500 mt-1 text-right">{msg.timestamp}</p>
        </div>
      </div>
    );
  }

  if (msg.status === "loading") {
    return (
      <div className="flex gap-3 animate-fade-in">
        <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="card flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Router Agent 분석 중</span>
            <span className="inline-flex gap-1">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const route = msg.route_type ? ROUTE_LABELS[msg.route_type] : null;
  const RouteIcon = route?.icon;

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0 mt-1">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 space-y-3">
        {/* Route badge */}
        {route && RouteIcon && (
          <div className="flex items-center gap-2">
            <RouteIcon className={clsx("w-3.5 h-3.5", route.color)} />
            <span className={clsx("text-xs font-medium", route.color)}>{route.label}</span>
            <span className="text-xs text-slate-600">{msg.timestamp}</span>
          </div>
        )}

        {/* Answer */}
        <div className="card prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({children}) => <div className="overflow-x-auto"><table className="text-xs border-collapse w-full">{children}</table></div>,
              th: ({children}) => <th className="border border-surface-border px-3 py-1.5 text-left text-slate-300 bg-surface-DEFAULT font-medium">{children}</th>,
              td: ({children}) => <td className="border border-surface-border px-3 py-1.5 text-slate-400">{children}</td>,
              code: ({children, className}) => {
                const isBlock = className?.includes("language-");
                return isBlock
                  ? <code className="block bg-surface-DEFAULT rounded p-3 text-xs font-mono text-slate-300 overflow-x-auto">{children}</code>
                  : <code className="bg-surface-DEFAULT rounded px-1 py-0.5 text-xs font-mono text-accent-cyan">{children}</code>;
              },
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>

        {/* SQL toggle */}
        {msg.sql && (
          <div>
            <button
              onClick={() => onToggleSql(msg.id)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              생성된 SQL 보기
              {sqlOpen[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {sqlOpen[msg.id] && (
              <div className="mt-2 relative">
                <pre className="bg-surface-DEFAULT border border-surface-border rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {msg.sql}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(msg.sql!)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-surface-hover hover:bg-surface-border text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sources toggle */}
        {msg.sources && msg.sources.length > 0 && (
          <div>
            <button
              onClick={() => onToggleSrc(msg.id)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              참조 출처 {msg.sources.length}건
              {srcOpen[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {srcOpen[msg.id] && (
              <div className="mt-2 space-y-1.5">
                {msg.sources.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-DEFAULT border border-surface-border">
                    <Database className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-300">{s.ref}</p>
                      <p className="text-[10px] text-slate-500">{s.desc}</p>
                    </div>
                    {s.score && (
                      <span className="text-[10px] text-slate-600 flex-shrink-0">
                        {(s.score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {msg.status === "done" && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-accent-green transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> 도움됨
            </button>
            <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-accent-red transition-colors">
              <ThumbsDown className="w-3.5 h-3.5" /> 부정확
            </button>
            <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> 재생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
