-- ============================================================
-- F.A.C.T ERP 핵심 스키마 (PostgreSQL)
-- 자동차 부품 제조업 (고무/방진) 주간회의 자동화 기반
-- ============================================================

-- ──────────────────────────────────────────
-- 1. 기준 데이터 (마스터)
-- ──────────────────────────────────────────

-- 공급업체 (협력사)
CREATE TABLE IF NOT EXISTS suppliers (
    id           SERIAL PRIMARY KEY,
    code         VARCHAR(20) UNIQUE NOT NULL,  -- 'aia', 'pyounghwa', 'suklim', 'keystone', etc.
    name         VARCHAR(100) NOT NULL,         -- '아이아', '평화산업', '석림', '키스톤'
    category     VARCHAR(50),                   -- '완성품공급', '원재료'
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO suppliers (code, name, category) VALUES
('aia',       '아이아 (SECO AIA)', '완성품공급'),
('pyounghwa', '평화산업',          '완성품공급'),
('suklim',    '석림',              '완성품공급'),
('keystone',  '키스톤',            '완성품공급'),
('bangsan',   '방산',              '원재료'),
('youngdong', '영동테크',          '원재료'),
('samik',     '삼익',              '완성품공급')
ON CONFLICT (code) DO NOTHING;

-- 제품 라인
CREATE TABLE IF NOT EXISTS product_lines (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(30) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    supplier_id     INT REFERENCES suppliers(id),
    purchase_ratio  NUMERIC(5,2),  -- 표준 매입 비율 (%) e.g. 55, 64, 65
    monthly_target  BIGINT,        -- 월 목표 생산수량 (ea)
    unit_price      NUMERIC(12,2), -- 단가
    is_active       BOOLEAN DEFAULT TRUE
);

INSERT INTO product_lines (code, name, supplier_id, purchase_ratio) VALUES
('STRW_DAMPER', 'STRW DAMPER',  (SELECT id FROM suppliers WHERE code='aia'),       55),
('HORN_PLATE',  'HORN PLATE',   (SELECT id FROM suppliers WHERE code='aia'),       64),
('SP2',         'SP2',          (SELECT id FROM suppliers WHERE code='aia'),       65),
('BANG_AS',     '방진 A/S',     (SELECT id FROM suppliers WHERE code='aia'),       65),
('BANG_RAW',    '방진 원재료',  (SELECT id FROM suppliers WHERE code='aia'),        7),
('BUSH',        'BUSH',         (SELECT id FROM suppliers WHERE code='pyounghwa'), 66),
('SUKLIM_PROD', '석림 제품',    (SELECT id FROM suppliers WHERE code='suklim'),    69),
('KEYSTONE_PR', '키스톤 제품',  (SELECT id FROM suppliers WHERE code='keystone'),  47),
('YOUNGDONG_R', '영동테크 원재료', (SELECT id FROM suppliers WHERE code='youngdong'), 30),
('SAMIK_PROD',  '삼익 제품',    (SELECT id FROM suppliers WHERE code='samik'),     35)
ON CONFLICT (code) DO NOTHING;

-- ──────────────────────────────────────────
-- 2. 월별매출대비매입현황분석 (핵심 ERP 테이블)
-- 매월 각 제품라인별 계획/실적/매입 현황
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_sales_analysis (
    id                      SERIAL PRIMARY KEY,
    year_month              VARCHAR(7) NOT NULL,   -- '2026-03'
    product_line_id         INT REFERENCES product_lines(id),
    supplier_id             INT REFERENCES suppliers(id),

    -- 매출 계획
    sales_target            BIGINT DEFAULT 0,      -- 목표 매출 (원)
    std_purchase_ratio      NUMERIC(5,2),          -- 표준 매입 비율 (%)
    std_purchase_amt        BIGINT DEFAULT 0,      -- 매출계획 대비 표준 매입액

    -- 매입 목표
    review_purchase_amt     BIGINT DEFAULT 0,      -- 생산계획반영 검토매입액
    purchase_target_75      BIGINT DEFAULT 0,      -- 목표매입액 (75%)

    -- 실적
    actual_sales            BIGINT DEFAULT 0,      -- 실매출 (원)
    appropriate_purchase    BIGINT DEFAULT 0,      -- 실매출대비 적정매입액
    excess_vs_target        BIGINT DEFAULT 0,      -- 매입목표 대비 초과금액 (음수=초과절감)
    purchase_achievement    NUMERIC(5,1),          -- 매입 목표 대비 실매입 현황 (%)

    -- 전월 재고 및 이월
    prev_stock_amt          BIGINT DEFAULT 0,      -- 전월 재고금액
    carryover_amt           BIGINT DEFAULT 0,      -- 이월금액 (5월 이월분 등)

    -- 주차별 매입 실적
    week1_purchase          BIGINT DEFAULT 0,
    week2_purchase          BIGINT DEFAULT 0,
    week3_purchase          BIGINT DEFAULT 0,
    week4_purchase          BIGINT DEFAULT 0,
    week5_purchase          BIGINT DEFAULT 0,

    -- 총 매입
    total_purchase          BIGINT DEFAULT 0,      -- 총 실 매입액

    -- 비고
    notes                   TEXT,

    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(year_month, product_line_id)
);

-- ──────────────────────────────────────────
-- 3. 품질 불량 현황 (PPM 추적)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quality_defect_log (
    id              SERIAL PRIMARY KEY,
    year_month      VARCHAR(7) NOT NULL,   -- '2026-03'
    week_num        INT,                   -- 주차 (1-5)
    product_type    VARCHAR(50) NOT NULL,  -- 'BUSH', '댐퍼', '혼플레이트', '방진AS', '이너씰', '순고무'
    part_number     VARCHAR(50),           -- 품번
    inspection_qty  INT DEFAULT 0,         -- 검사수 (ea)
    defect_qty      INT DEFAULT 0,         -- 불량수 (ea)
    ppm             NUMERIC(10,2),         -- 불량률 PPM (자동계산 또는 입력)
    defect_amount   BIGINT DEFAULT 0,      -- 불량 금액 (원)
    defect_type     VARCHAR(100),          -- 불량 유형 (기포불량 등)
    rework_qty      INT DEFAULT 0,         -- 리워크 수량
    rework_amount   BIGINT DEFAULT 0,      -- 리워크 금액
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 고객 클레임
CREATE TABLE IF NOT EXISTS customer_claims (
    id              SERIAL PRIMARY KEY,
    claim_date      DATE NOT NULL,
    customer_name   VARCHAR(100),          -- '평화산업', '아이아', '니프코'
    product_type    VARCHAR(50),
    part_number     VARCHAR(50),
    claim_type      VARCHAR(100),          -- 클레임 유형
    qty             INT DEFAULT 0,
    amount          BIGINT DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'open',  -- open/processing/closed
    action_plan     TEXT,
    resolved_at     DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 4. 생산 실적
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS production_weekly (
    id              SERIAL PRIMARY KEY,
    year_week       VARCHAR(8) NOT NULL,   -- '2026-W10'
    product_line_id INT REFERENCES product_lines(id),
    line_code       VARCHAR(20),           -- 생산 라인 코드
    plan_qty        INT DEFAULT 0,         -- 계획 수량
    actual_qty      INT DEFAULT 0,         -- 실적 수량
    achievement     NUMERIC(5,1),          -- 달성률 (%)
    worker_count    INT DEFAULT 0,         -- 투입 인원
    overtime_hours  NUMERIC(5,1) DEFAULT 0, -- 특근 시간
    downtime_hours  NUMERIC(5,1) DEFAULT 0, -- 비가동 시간
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year_week, product_line_id, line_code)
);

-- 월별 생산 계획 vs 실적
CREATE TABLE IF NOT EXISTS production_monthly (
    id              SERIAL PRIMARY KEY,
    year_month      VARCHAR(7) NOT NULL,
    product_line_id INT REFERENCES product_lines(id),
    plan_qty        INT DEFAULT 0,
    actual_qty      INT DEFAULT 0,
    oee             NUMERIC(5,2),          -- OEE (%)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year_month, product_line_id)
);

-- ──────────────────────────────────────────
-- 5. 영업 실적 (고객사별)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_performance (
    id              SERIAL PRIMARY KEY,
    year_month      VARCHAR(7) NOT NULL,
    customer_segment VARCHAR(50) NOT NULL,  -- '자동차', '삼익THK', '평화산업', 'SECOAIA'
    target_amt      BIGINT DEFAULT 0,       -- 목표 금액 (만원)
    actual_amt      BIGINT DEFAULT 0,       -- 실적 금액 (만원)
    shortfall_amt   BIGINT DEFAULT 0,       -- 미달 금액 (만원)
    achievement     NUMERIC(5,1),           -- 달성률 (%)
    key_issues      TEXT,                   -- 주요 내용
    action_plan     TEXT,                   -- 개선 대책
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year_month, customer_segment)
);

-- HKMC OEM 생산 진도
CREATE TABLE IF NOT EXISTS hkmc_production_progress (
    id              SERIAL PRIMARY KEY,
    base_date       DATE NOT NULL,
    vehicle_model   VARCHAR(50),           -- 'LX3', 'MX5', 'CN7' 등
    plant           VARCHAR(50),           -- 'HKMC', '코모스울산' 등
    monthly_plan    INT DEFAULT 0,         -- 월 계획량
    actual_qty      INT DEFAULT 0,         -- 실적 수량
    achievement     NUMERIC(5,1),          -- 달성률
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 6. 주간 회의 보고서 (자동 생성 이력)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_meeting_reports (
    id              SERIAL PRIMARY KEY,
    report_date     DATE NOT NULL,
    year_week       VARCHAR(8) NOT NULL,
    week_num        INT,                   -- 월 기준 주차 (1주차)
    status          VARCHAR(20) DEFAULT 'draft',  -- draft/review/published
    pdf_url         TEXT,
    pptx_url        TEXT,
    generated_by    INT,
    approved_by     INT,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 7. 인덱스
-- ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_psa_year_month ON purchase_sales_analysis(year_month);
CREATE INDEX IF NOT EXISTS idx_qdl_year_month ON quality_defect_log(year_month);
CREATE INDEX IF NOT EXISTS idx_qdl_product_type ON quality_defect_log(product_type);
CREATE INDEX IF NOT EXISTS idx_prod_year_week ON production_weekly(year_week);
CREATE INDEX IF NOT EXISTS idx_sales_year_month ON sales_performance(year_month);
