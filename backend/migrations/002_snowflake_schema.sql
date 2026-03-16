-- ============================================================
-- F.A.C.T Snowflake 스키마 초기화
-- 업무 분석 데이터 허브 (RAW / STG / CORE / MART / DOC)
-- ============================================================

-- 데이터베이스 / 스키마 / 역할 / 웨어하우스 생성 (ACCOUNTADMIN 필요)
USE ROLE SYSADMIN;

CREATE DATABASE IF NOT EXISTS FACT_DB;
USE DATABASE FACT_DB;

CREATE SCHEMA IF NOT EXISTS RAW;
CREATE SCHEMA IF NOT EXISTS STG;
CREATE SCHEMA IF NOT EXISTS CORE;
CREATE SCHEMA IF NOT EXISTS MART;
CREATE SCHEMA IF NOT EXISTS DOC;

-- ── Warehouse ─────────────────────────────────────────────────
CREATE WAREHOUSE IF NOT EXISTS FACT_WH_S
    WAREHOUSE_SIZE    = SMALL
    AUTO_SUSPEND      = 120
    AUTO_RESUME       = TRUE
    INITIALLY_SUSPENDED = TRUE
    COMMENT           = 'F.A.C.T 앱 전용 웨어하우스';

-- ── RBAC ──────────────────────────────────────────────────────
USE ROLE SECURITYADMIN;

CREATE ROLE IF NOT EXISTS FACT_APP_ROLE;
CREATE ROLE IF NOT EXISTS FACT_ANALYST_ROLE;
CREATE ROLE IF NOT EXISTS FACT_VIEWER_ROLE;

GRANT USAGE ON WAREHOUSE FACT_WH_S TO ROLE FACT_APP_ROLE;
GRANT USAGE ON DATABASE  FACT_DB    TO ROLE FACT_APP_ROLE;
GRANT USAGE ON ALL SCHEMAS IN DATABASE FACT_DB TO ROLE FACT_APP_ROLE;
GRANT SELECT ON ALL TABLES IN DATABASE FACT_DB TO ROLE FACT_APP_ROLE;
GRANT SELECT ON FUTURE TABLES IN DATABASE FACT_DB TO ROLE FACT_APP_ROLE;

USE ROLE SYSADMIN;
USE WAREHOUSE FACT_WH_S;
USE DATABASE FACT_DB;

-- ============================================================
-- RAW 레이어 — 원천 데이터 그대로 적재 (커넥터 입력)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS RAW;

-- ERP: 재고 수불
CREATE TABLE IF NOT EXISTS RAW.raw_erp_inventory (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    _source_file     VARCHAR(200),
    item_code        VARCHAR(50),
    item_name        VARCHAR(200),
    warehouse_code   VARCHAR(50),
    stock_qty        NUMBER(18,4),
    unit             VARCHAR(20),
    snapshot_date    DATE,
    raw_json         VARIANT
);

-- ERP: 발주
CREATE TABLE IF NOT EXISTS RAW.raw_erp_purchase_orders (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    po_number        VARCHAR(50),
    supplier_code    VARCHAR(50),
    item_code        VARCHAR(50),
    order_qty        NUMBER(18,4),
    unit_price       NUMBER(18,4),
    currency         VARCHAR(10),
    order_date       DATE,
    due_date         DATE,
    status           VARCHAR(30),
    raw_json         VARIANT
);

-- MES: 설비 이벤트
CREATE TABLE IF NOT EXISTS RAW.raw_mes_machine_events (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    machine_id       VARCHAR(50),
    machine_name     VARCHAR(100),
    event_type       VARCHAR(50),     -- RUN | STOP | ALARM | SETUP
    event_start_at   TIMESTAMP_LTZ,
    event_end_at     TIMESTAMP_LTZ,
    duration_min     NUMBER(10,2),
    reason_code      VARCHAR(50),
    reason_desc      VARCHAR(200),
    shift            VARCHAR(20),
    raw_json         VARIANT
);

-- MES: 생산 실적
CREATE TABLE IF NOT EXISTS RAW.raw_mes_production_results (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    work_order_no    VARCHAR(50),
    line_code        VARCHAR(50),
    item_code        VARCHAR(50),
    planned_qty      NUMBER(18,4),
    actual_qty       NUMBER(18,4),
    defect_qty       NUMBER(18,4),
    production_date  DATE,
    shift            VARCHAR(20),
    raw_json         VARIANT
);

-- PLM: ECO (설계변경 오더)
CREATE TABLE IF NOT EXISTS RAW.raw_plm_eco (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    eco_no           VARCHAR(50),
    title            VARCHAR(300),
    item_code        VARCHAR(50),
    reason           TEXT,
    status           VARCHAR(30),
    requested_by     VARCHAR(100),
    approved_by      VARCHAR(100),
    requested_at     DATE,
    effective_at     DATE,
    raw_json         VARIANT
);

-- 품질: 클레임
CREATE TABLE IF NOT EXISTS RAW.raw_quality_claims (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    claim_no         VARCHAR(50),
    customer_code    VARCHAR(50),
    item_code        VARCHAR(50),
    defect_type      VARCHAR(50),
    claim_qty        NUMBER(18,4),
    claim_date       DATE,
    closed_date      DATE,
    status           VARCHAR(30),
    root_cause       TEXT,
    countermeasure   TEXT,
    raw_json         VARIANT
);

-- 예산 (Excel 업로드)
CREATE TABLE IF NOT EXISTS RAW.raw_budget_excel (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    _file_name       VARCHAR(200),
    dept_code        VARCHAR(50),
    account_code     VARCHAR(50),
    account_name     VARCHAR(200),
    budget_year      INTEGER,
    budget_month     INTEGER,
    budget_amount    NUMBER(20,2),
    actual_amount    NUMBER(20,2),
    raw_json         VARIANT
);

-- 문서 메타데이터 (파일 업로드 + 인덱싱)
CREATE TABLE IF NOT EXISTS RAW.raw_docs_metadata (
    _loaded_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    doc_id           VARCHAR(100),
    doc_title        VARCHAR(500),
    doc_type         VARCHAR(50),     -- meeting | claim | eco | quality | etc
    dept_code        VARCHAR(50),
    author           VARCHAR(100),
    doc_date         DATE,
    file_path        VARCHAR(500),
    file_size_kb     INTEGER,
    status           VARCHAR(30) DEFAULT 'indexed'
);

-- ============================================================
-- CORE 레이어 — 정제된 팩트 / 디멘전
-- ============================================================

-- 디멘전
CREATE TABLE IF NOT EXISTS CORE.dim_date (
    date_key         DATE         PRIMARY KEY,
    year_num         INTEGER,
    quarter_num      INTEGER,
    month_num        INTEGER,
    week_num         INTEGER,
    day_of_week      INTEGER,
    is_weekday       BOOLEAN,
    is_holiday       BOOLEAN DEFAULT FALSE,
    holiday_name     VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS CORE.dim_department (
    dept_code        VARCHAR(50)  PRIMARY KEY,
    dept_name        VARCHAR(100) NOT NULL,
    dept_type        VARCHAR(50),
    parent_dept_code VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS CORE.dim_item (
    item_code        VARCHAR(50)  PRIMARY KEY,
    item_name        VARCHAR(200) NOT NULL,
    item_category    VARCHAR(100),
    item_type        VARCHAR(50),   -- raw_material | semi | finished
    unit             VARCHAR(20),
    safety_stock_qty NUMBER(18,4),
    lead_time_days   INTEGER,
    is_active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS CORE.dim_supplier (
    supplier_code    VARCHAR(50)  PRIMARY KEY,
    supplier_name    VARCHAR(200) NOT NULL,
    country_code     VARCHAR(10),
    payment_terms    VARCHAR(100),
    risk_tier        VARCHAR(20),  -- A | B | C
    is_active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS CORE.dim_machine (
    machine_id       VARCHAR(50)  PRIMARY KEY,
    machine_name     VARCHAR(100),
    line_code        VARCHAR(50),
    machine_type     VARCHAR(50),
    capacity_per_hr  NUMBER(10,2),
    is_critical      BOOLEAN DEFAULT FALSE
);

-- 팩트 테이블
CREATE TABLE IF NOT EXISTS CORE.fact_inventory_snapshot (
    snapshot_date    DATE,
    item_code        VARCHAR(50)  REFERENCES CORE.dim_item(item_code),
    warehouse_code   VARCHAR(50),
    current_stock_qty NUMBER(18,4),
    safety_stock_qty  NUMBER(18,4),
    shortage_qty      NUMBER(18,4),
    is_below_safety   BOOLEAN,
    PRIMARY KEY (snapshot_date, item_code, warehouse_code)
);

CREATE TABLE IF NOT EXISTS CORE.fact_purchase_order (
    po_number        VARCHAR(50)  PRIMARY KEY,
    supplier_code    VARCHAR(50)  REFERENCES CORE.dim_supplier(supplier_code),
    item_code        VARCHAR(50)  REFERENCES CORE.dim_item(item_code),
    order_qty        NUMBER(18,4),
    unit_price       NUMBER(18,4),
    currency         VARCHAR(10),
    order_date       DATE,
    due_date         DATE,
    actual_receipt_date DATE,
    status           VARCHAR(30),
    on_time          BOOLEAN,
    delay_days       INTEGER
);

CREATE TABLE IF NOT EXISTS CORE.fact_production_result (
    work_order_no    VARCHAR(50),
    line_code        VARCHAR(50),
    item_code        VARCHAR(50)  REFERENCES CORE.dim_item(item_code),
    production_date  DATE,
    shift            VARCHAR(20),
    planned_qty      NUMBER(18,4),
    actual_qty       NUMBER(18,4),
    defect_qty       NUMBER(18,4),
    good_qty         NUMBER(18,4),
    achievement_rate NUMBER(6,3),
    quality_rate     NUMBER(6,3),
    PRIMARY KEY (work_order_no, shift)
);

CREATE TABLE IF NOT EXISTS CORE.fact_machine_downtime (
    machine_id       VARCHAR(50)  REFERENCES CORE.dim_machine(machine_id),
    event_date       DATE,
    shift            VARCHAR(20),
    total_downtime_min NUMBER(10,2),
    planned_downtime_min NUMBER(10,2),
    unplanned_downtime_min NUMBER(10,2),
    availability_rate NUMBER(6,3),
    PRIMARY KEY (machine_id, event_date, shift)
);

CREATE TABLE IF NOT EXISTS CORE.fact_quality_inspection (
    inspection_id    VARCHAR(50)  PRIMARY KEY,
    item_code        VARCHAR(50)  REFERENCES CORE.dim_item(item_code),
    inspection_date  DATE,
    line_code        VARCHAR(50),
    total_inspected  INTEGER,
    defect_count     INTEGER,
    ppm              NUMBER(10,2),
    defect_type_code VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS CORE.fact_claim (
    claim_no         VARCHAR(50)  PRIMARY KEY,
    customer_code    VARCHAR(50),
    item_code        VARCHAR(50),
    defect_type      VARCHAR(50),
    claim_qty        NUMBER(18,4),
    claim_date       DATE,
    closed_date      DATE,
    lead_time_days   INTEGER,
    status           VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS CORE.fact_budget_execution (
    dept_code        VARCHAR(50),
    account_code     VARCHAR(50),
    budget_year      INTEGER,
    budget_month     INTEGER,
    budget_amount    NUMBER(20,2),
    actual_amount    NUMBER(20,2),
    execution_rate   NUMBER(6,3),
    PRIMARY KEY (dept_code, account_code, budget_year, budget_month)
);

-- ============================================================
-- MART 레이어 — 부서별 집계 마트
-- ============================================================

-- 전사 KPI 주간
CREATE TABLE IF NOT EXISTS MART.mart_exec_kpi_weekly (
    week_label       VARCHAR(10),   -- '2026-W12'
    dept_code        VARCHAR(50),
    kpi_name         VARCHAR(100),
    kpi_value        NUMBER(18,4),
    kpi_unit         VARCHAR(20),
    target_value     NUMBER(18,4),
    trend_pct        NUMBER(8,3),   -- 전주 대비 %
    status           VARCHAR(20),   -- good | warn | bad
    snapshot_at      TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (week_label, dept_code, kpi_name)
);

-- 구매 리스크 일별
CREATE TABLE IF NOT EXISTS MART.mart_procurement_risk_daily (
    snapshot_date    DATE,
    supplier_code    VARCHAR(50),
    dept_code        VARCHAR(50) DEFAULT 'procurement',
    risk_type        VARCHAR(50),
    risk_score       NUMBER(5,3),
    at_risk_po_count INTEGER,
    at_risk_po_value NUMBER(20,2),
    snapshot_at      TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (snapshot_date, supplier_code, risk_type)
);

-- 생산 OEE 일별
CREATE TABLE IF NOT EXISTS MART.mart_production_oee_daily (
    production_date  DATE,
    line_code        VARCHAR(50),
    dept_code        VARCHAR(50) DEFAULT 'production',
    availability     NUMBER(6,3),
    performance      NUMBER(6,3),
    quality_rate     NUMBER(6,3),
    oee              NUMBER(6,3),
    total_downtime_h NUMBER(8,2),
    snapshot_at      TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (production_date, line_code)
);

-- 품질 PPM 주간
CREATE TABLE IF NOT EXISTS MART.mart_quality_ppm_weekly (
    week_label       VARCHAR(10),
    item_category    VARCHAR(100),
    dept_code        VARCHAR(50) DEFAULT 'quality',
    total_inspected  BIGINT,
    defect_count     BIGINT,
    ppm              NUMBER(10,2),
    trend_pct        NUMBER(8,3),
    snapshot_at      TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (week_label, item_category)
);

-- ============================================================
-- DOC 레이어 — 문서 / Cortex Search 인덱스 대상
-- ============================================================

CREATE TABLE IF NOT EXISTS DOC.doc_registry (
    doc_id           VARCHAR(100) PRIMARY KEY,
    doc_title        VARCHAR(500) NOT NULL,
    doc_type         VARCHAR(50)  NOT NULL,
    dept_code        VARCHAR(50),
    author           VARCHAR(100),
    doc_date         DATE,
    file_path        VARCHAR(500),
    file_size_kb     INTEGER,
    status           VARCHAR(30) DEFAULT 'active',
    indexed_at       TIMESTAMP_LTZ,
    created_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS DOC.doc_chunks (
    chunk_id         VARCHAR(100) PRIMARY KEY,
    doc_id           VARCHAR(100) NOT NULL REFERENCES DOC.doc_registry(doc_id),
    chunk_seq        INTEGER,
    chunk_text       TEXT         NOT NULL,
    page_num         INTEGER,
    embedding_model  VARCHAR(100),
    created_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS DOC.doc_entities (
    entity_id        VARCHAR(100) PRIMARY KEY,
    doc_id           VARCHAR(100) NOT NULL REFERENCES DOC.doc_registry(doc_id),
    entity_type      VARCHAR(50),  -- item | supplier | machine | person
    entity_value     VARCHAR(500),
    confidence       NUMBER(4,3),
    created_at       TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Cortex Search Service (Snowflake에서 실행)
-- ============================================================

-- CREATE OR REPLACE CORTEX SEARCH SERVICE FACT_DOC_SEARCH
--   ON chunk_text
--   ATTRIBUTES doc_id, doc_title, doc_type, dept_code, page_num
--   WAREHOUSE = FACT_WH_S
--   TARGET_LAG = '1 hour'
-- AS (
--   SELECT
--       c.chunk_id,
--       c.chunk_text,
--       c.doc_id,
--       r.doc_title,
--       r.doc_type,
--       r.dept_code,
--       c.page_num
--   FROM DOC.doc_chunks c
--   JOIN DOC.doc_registry r ON c.doc_id = r.doc_id
--   WHERE r.status = 'active'
-- );

-- ============================================================
-- KPI 시맨틱 뷰 — Cortex Analyst 정확도 향상 핵심
-- ============================================================

CREATE OR REPLACE VIEW CORE.v_kpi_budget_execution AS
SELECT
    dept_code,
    budget_year,
    budget_month,
    SUM(budget_amount)  AS total_budget,
    SUM(actual_amount)  AS total_actual,
    ROUND(SAFE_DIVIDE(SUM(actual_amount), SUM(budget_amount)) * 100, 2) AS execution_rate_pct
FROM CORE.fact_budget_execution
GROUP BY dept_code, budget_year, budget_month;

CREATE OR REPLACE VIEW CORE.v_kpi_oee_daily AS
SELECT
    production_date,
    line_code,
    availability     * 100 AS availability_pct,
    performance      * 100 AS performance_pct,
    quality_rate     * 100 AS quality_rate_pct,
    oee              * 100 AS oee_pct,
    total_downtime_h
FROM MART.mart_production_oee_daily;

CREATE OR REPLACE VIEW CORE.v_kpi_ppm_weekly AS
SELECT
    week_label,
    item_category,
    total_inspected,
    defect_count,
    ppm,
    trend_pct
FROM MART.mart_quality_ppm_weekly;

CREATE OR REPLACE VIEW CORE.v_safety_stock_alert AS
SELECT
    s.item_code,
    i.item_name,
    i.safety_stock_qty,
    s.current_stock_qty,
    s.shortage_qty,
    s.snapshot_date,
    i.lead_time_days,
    s.warehouse_code
FROM CORE.fact_inventory_snapshot s
JOIN CORE.dim_item i ON s.item_code = i.item_code
WHERE s.is_below_safety = TRUE
  AND s.snapshot_date   = CURRENT_DATE;

CREATE OR REPLACE VIEW CORE.v_supplier_delivery_rate AS
SELECT
    po.supplier_code,
    s.supplier_name,
    DATE_TRUNC('month', po.due_date) AS month,
    COUNT(*)                          AS total_orders,
    SUM(CASE WHEN po.on_time THEN 1 ELSE 0 END) AS on_time_orders,
    ROUND(on_time_orders * 100.0 / NULLIF(total_orders, 0), 2) AS delivery_rate_pct
FROM CORE.fact_purchase_order po
JOIN CORE.dim_supplier s ON po.supplier_code = s.supplier_code
WHERE po.status IN ('RECEIVED', 'CLOSED')
GROUP BY po.supplier_code, s.supplier_name, DATE_TRUNC('month', po.due_date);

-- ============================================================
-- Streams & Tasks — 자동 증분 집계
-- ============================================================

CREATE STREAM IF NOT EXISTS RAW.s_production_results
    ON TABLE RAW.raw_mes_production_results
    APPEND_ONLY = TRUE;

-- Task: 매 시간 CORE 팩트 테이블 갱신
CREATE TASK IF NOT EXISTS FACT_DB.CORE.t_refresh_production
    WAREHOUSE = FACT_WH_S
    SCHEDULE  = 'USING CRON 0 * * * * Asia/Seoul'
AS
MERGE INTO CORE.fact_production_result AS tgt
USING (
    SELECT
        work_order_no,
        line_code,
        item_code,
        production_date::DATE AS production_date,
        shift,
        planned_qty,
        actual_qty,
        defect_qty,
        actual_qty - defect_qty AS good_qty,
        ROUND(actual_qty / NULLIF(planned_qty, 0), 4) AS achievement_rate,
        ROUND((actual_qty - defect_qty) / NULLIF(actual_qty, 0), 4) AS quality_rate
    FROM RAW.raw_mes_production_results
    QUALIFY ROW_NUMBER() OVER (PARTITION BY work_order_no, shift ORDER BY _loaded_at DESC) = 1
) AS src
ON tgt.work_order_no = src.work_order_no AND tgt.shift = src.shift
WHEN MATCHED THEN UPDATE SET
    actual_qty = src.actual_qty,
    defect_qty = src.defect_qty,
    good_qty   = src.good_qty,
    achievement_rate = src.achievement_rate,
    quality_rate     = src.quality_rate
WHEN NOT MATCHED THEN INSERT VALUES (
    src.work_order_no, src.line_code, src.item_code,
    src.production_date, src.shift,
    src.planned_qty, src.actual_qty, src.defect_qty,
    src.good_qty, src.achievement_rate, src.quality_rate
);

-- ALTER TASK FACT_DB.CORE.t_refresh_production RESUME;
