# F.A.C.T — FourD AI Convergence Transformer

> AI Agent 기반 제조 업무 자동화 통합 서비스 플랫폼

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| 배치/워커 | Celery + Redis |
| 앱 DB | PostgreSQL 16 |
| 분석/AI | Snowflake (Cortex Analyst · Search · Agents) |
| 배포 | Docker Compose → ECS/ACA/Cloud Run |

## 프로젝트 구조

```
FACT_claude/
├── frontend/               # Next.js 웹 포털
│   ├── src/
│   │   ├── app/            # App Router 페이지
│   │   │   ├── dashboard/  # 메인 대시보드
│   │   │   ├── query/      # AI 질의 화면
│   │   │   ├── reports/    # 보고서 센터
│   │   │   ├── approvals/  # 승인함
│   │   │   └── documents/  # 문서 탐색기
│   │   ├── components/
│   │   │   ├── layout/     # AppShell, Sidebar, TopBar
│   │   │   ├── dashboard/  # KPI 카드, 알림 피드
│   │   │   └── agent/      # AI 질의 패널
│   │   └── lib/
│   │       └── api.ts      # API 클라이언트
│   └── Dockerfile
│
├── backend/                # FastAPI API 서버
│   ├── app/
│   │   ├── api/v1/         # REST 엔드포인트
│   │   │   ├── agent.py    # POST /agent/query
│   │   │   ├── dashboard.py
│   │   │   ├── kpi.py
│   │   │   ├── reports.py
│   │   │   ├── approvals.py
│   │   │   └── documents.py
│   │   ├── services/
│   │   │   ├── snowflake/  # Cortex Analyst · Search · Client
│   │   │   ├── agent/      # Router + Orchestrator
│   │   │   └── report/     # PDF/PPT 생성
│   │   ├── workers/        # Celery 태스크
│   │   └── core/           # Config, DB, Logging
│   ├── migrations/
│   │   ├── 001_init_postgresql.sql   # 앱 DB 스키마
│   │   └── 002_snowflake_schema.sql  # Snowflake RAW/CORE/MART/DOC
│   └── Dockerfile
│
├── docker-compose.yml      # 전체 서비스 오케스트레이션
└── .env.example            # 환경변수 템플릿
```

## 빠른 시작

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일에서 Snowflake 계정 정보 입력

# 2. 서비스 시작
docker compose up -d

# 3. 웹 포털 접속
open http://localhost:3000
```

## 주요 API 엔드포인트

```
POST /api/v1/agent/query          # 자연어 질의
GET  /api/v1/dashboard/summary    # 대시보드 요약
GET  /api/v1/kpi/{department}     # 부서별 KPI
POST /api/v1/reports/generate     # 보고서 생성
GET  /api/v1/approvals            # 승인 대기 목록
POST /api/v1/documents/search     # 문서 의미 검색
```

## Snowflake 설정

```sql
-- 계정에서 실행 (ACCOUNTADMIN)
-- backend/migrations/002_snowflake_schema.sql 참고

-- Cortex Search Service 활성화 후
-- CORTEX_SEARCH_SERVICE = FACT_DOC_SEARCH 로 설정
```

## 에이전트 흐름

```
사용자 질문
  ↓
Router Agent (키워드 분류 → LLM 분류기)
  ├─ structured  → Cortex Analyst → SQL 실행 → 표/차트
  ├─ document    → Cortex Search → 문서 청크 → 요약
  ├─ mixed       → 양쪽 병행
  ├─ report      → 보고서 Celery 작업 큐
  └─ action      → 승인 워크플로 생성
```
