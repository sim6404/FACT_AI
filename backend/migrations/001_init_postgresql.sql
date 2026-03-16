-- ============================================================
-- F.A.C.T PostgreSQL 스키마 초기화
-- 애플리케이션 트랜잭션 / 워크플로 데이터 전용
-- ============================================================

-- extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- 텍스트 유사도 검색

-- ── 사용자 / 권한 ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
    code             VARCHAR(50)  PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    permissions_json JSONB        NOT NULL DEFAULT '[]',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id               SERIAL       PRIMARY KEY,
    email            VARCHAR(200) NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,
    department_code  VARCHAR(50)  NOT NULL,
    role_code        VARCHAR(50)  NOT NULL REFERENCES roles(code),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at    TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_dept     ON users(department_code);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role_code);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);

-- ── 저장된 질의 ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_queries (
    id               SERIAL       PRIMARY KEY,
    user_id          INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            VARCHAR(200) NOT NULL,
    query_text       TEXT         NOT NULL,
    department_scope VARCHAR(50),
    is_public        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_queries_user ON saved_queries(user_id);

-- ── 보고서 ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id               SERIAL       PRIMARY KEY,
    report_type      VARCHAR(50)  NOT NULL,  -- weekly_ops | monthly_mgmt | custom
    department_code  VARCHAR(50)  NOT NULL,
    title            VARCHAR(300) NOT NULL,
    period_start     DATE         NOT NULL,
    period_end       DATE         NOT NULL,
    status           VARCHAR(30)  NOT NULL DEFAULT 'draft',  -- draft | review | approved | published | rejected
    output_file_url  VARCHAR(500),
    generated_by     INTEGER      REFERENCES users(id),
    approved_by      INTEGER      REFERENCES users(id),
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_jobs (
    id               SERIAL       PRIMARY KEY,
    report_id        INTEGER      NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    job_status       VARCHAR(30)  NOT NULL DEFAULT 'queued',  -- queued | running | done | failed
    started_at       TIMESTAMPTZ,
    ended_at         TIMESTAMPTZ,
    error_message    TEXT,
    celery_task_id   VARCHAR(200)
);

CREATE INDEX IF NOT EXISTS idx_reports_dept    ON reports(department_code);
CREATE INDEX IF NOT EXISTS idx_reports_status  ON reports(status);
CREATE INDEX IF NOT EXISTS idx_report_jobs_rep ON report_jobs(report_id);

-- ── 알림 ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
    id               SERIAL       PRIMARY KEY,
    alert_type       VARCHAR(50)  NOT NULL,
    severity         VARCHAR(20)  NOT NULL,  -- critical | warning | info
    department_code  VARCHAR(50),
    entity_type      VARCHAR(50),            -- inventory | machine | supplier | quality
    entity_id        VARCHAR(200),
    title            VARCHAR(300) NOT NULL,
    message          TEXT         NOT NULL,
    source_ref       VARCHAR(200),
    status           VARCHAR(20)  NOT NULL DEFAULT 'active',  -- active | acknowledged | resolved
    acknowledged_by  INTEGER      REFERENCES users(id),
    acknowledged_at  TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status   ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_dept     ON alerts(department_code);
CREATE INDEX IF NOT EXISTS idx_alerts_created  ON alerts(created_at DESC);

-- ── 승인 워크플로 ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approvals (
    id                    SERIAL       PRIMARY KEY,
    approval_type         VARCHAR(50)  NOT NULL,  -- purchase_order | report_publish | quality_action | erp_write
    target_entity_type    VARCHAR(50)  NOT NULL,
    target_entity_id      VARCHAR(200) NOT NULL,
    requested_by          INTEGER      NOT NULL REFERENCES users(id),
    approver_id           INTEGER      REFERENCES users(id),
    status                VARCHAR(20)  NOT NULL DEFAULT 'pending',  -- pending | approved | rejected | cancelled
    request_payload_json  JSONB        NOT NULL DEFAULT '{}',
    approved_payload_json JSONB,
    reject_reason         TEXT,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    decided_at            TIMESTAMPTZ,
    expires_at            TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_approvals_status     ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_approver   ON approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_approvals_requested  ON approvals(requested_by);
CREATE INDEX IF NOT EXISTS idx_approvals_created    ON approvals(created_at DESC);

-- ── 에이전트 실행 이력 ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_runs (
    id               BIGSERIAL    PRIMARY KEY,
    run_id           UUID         NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_id          INTEGER      NOT NULL REFERENCES users(id),
    department_code  VARCHAR(50),
    question         TEXT         NOT NULL,
    route_type       VARCHAR(30)  NOT NULL,  -- structured | document | mixed | report | action
    response_summary TEXT,
    confidence_score NUMERIC(4,3),
    model_name       VARCHAR(100),
    policy_version   VARCHAR(20),
    status           VARCHAR(20)  NOT NULL DEFAULT 'done',  -- done | error | partial
    elapsed_ms       INTEGER,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_run_sources (
    id               SERIAL       PRIMARY KEY,
    agent_run_id     BIGINT       NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    source_type      VARCHAR(30)  NOT NULL,  -- snowflake_sql | document | tool
    source_ref       TEXT,
    relevance_score  NUMERIC(4,3),
    description      VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_user    ON agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_dept    ON agent_runs(department_code);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ars_run            ON agent_run_sources(agent_run_id);

-- ── 커넥터 실행 이력 ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS connector_runs (
    id               SERIAL       PRIMARY KEY,
    connector_name   VARCHAR(50)  NOT NULL,
    started_at       TIMESTAMPTZ  NOT NULL,
    ended_at         TIMESTAMPTZ,
    status           VARCHAR(20)  NOT NULL DEFAULT 'running',  -- running | done | failed
    inserted_rows    INTEGER      DEFAULT 0,
    updated_rows     INTEGER      DEFAULT 0,
    error_message    TEXT,
    metadata_json    JSONB        DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_connector_runs_name    ON connector_runs(connector_name);
CREATE INDEX IF NOT EXISTS idx_connector_runs_started ON connector_runs(started_at DESC);

-- ── 프롬프트 / 정책 버전 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prompt_policies (
    id               SERIAL       PRIMARY KEY,
    policy_name      VARCHAR(100) NOT NULL,
    version          VARCHAR(20)  NOT NULL,
    department_scope VARCHAR(50),
    route_type       VARCHAR(30),
    system_prompt    TEXT         NOT NULL,
    is_active        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_by       INTEGER      REFERENCES users(id),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (policy_name, version)
);

-- ── 기본 데이터 ────────────────────────────────────────────────
INSERT INTO roles (code, name, permissions_json) VALUES
    ('admin',        '시스템 관리자',  '["*"]'),
    ('manager',      '부서 관리자',    '["read","write","approve","report"]'),
    ('analyst',      '업무 분석가',    '["read","write","report"]'),
    ('viewer',       '열람자',         '["read"]'),
    ('approver',     '승인권자',       '["read","approve"]')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (email, name, department_code, role_code) VALUES
    ('admin@fourd.co.kr', 'F.A.C.T 관리자', 'management', 'admin')
ON CONFLICT (email) DO NOTHING;
