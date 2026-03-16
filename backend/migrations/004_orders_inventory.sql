-- =========================================================
-- 마이그레이션 004: 수주관리 + 재고관리 테이블
-- =========================================================

-- ── 수주 테이블 ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_orders (
    id              SERIAL PRIMARY KEY,
    order_no        VARCHAR(30)     NOT NULL UNIQUE,
    order_date      DATE            NOT NULL DEFAULT CURRENT_DATE,
    customer_name   VARCHAR(100)    NOT NULL,
    product_name    VARCHAR(100)    NOT NULL,
    product_code    VARCHAR(30),
    qty             INTEGER         NOT NULL DEFAULT 0,
    unit_price      NUMERIC(15,2)   NOT NULL DEFAULT 0,
    total_amount    NUMERIC(15,2)   NOT NULL DEFAULT 0,
    due_date        DATE,
    status          VARCHAR(20)     NOT NULL DEFAULT '접수대기'
                        CHECK (status IN ('접수대기','생산지시','생산중','출하대기','납품완료','취소')),
    manager         VARCHAR(50),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_orders_date    ON sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status  ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_due     ON sales_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders(customer_name);

-- ── 재고 품목 마스터 ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_items (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(30)     NOT NULL UNIQUE,
    name            VARCHAR(100)    NOT NULL,
    category        VARCHAR(20)     NOT NULL DEFAULT '원자재'
                        CHECK (category IN ('원자재','반제품','완제품','소모품')),
    unit            VARCHAR(10)     NOT NULL DEFAULT 'EA',
    current_qty     NUMERIC(15,3)   NOT NULL DEFAULT 0,
    safety_qty      NUMERIC(15,3)   NOT NULL DEFAULT 0,
    unit_price      NUMERIC(15,2)   NOT NULL DEFAULT 0,
    location        VARCHAR(50),
    supplier        VARCHAR(100),
    notes           TEXT,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inv_items_code     ON inventory_items(code);

-- ── 입출고 이력 ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id              SERIAL PRIMARY KEY,
    item_id         INTEGER         NOT NULL REFERENCES inventory_items(id),
    tx_date         DATE            NOT NULL DEFAULT CURRENT_DATE,
    tx_type         VARCHAR(10)     NOT NULL
                        CHECK (tx_type IN ('입고','출고','재고조정')),
    qty             NUMERIC(15,3)   NOT NULL,
    before_qty      NUMERIC(15,3)   NOT NULL DEFAULT 0,
    after_qty       NUMERIC(15,3)   NOT NULL DEFAULT 0,
    ref_no          VARCHAR(50),      -- 참조번호 (수주번호, PO번호 등)
    manager         VARCHAR(50),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_tx_item    ON inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_inv_tx_date    ON inventory_transactions(tx_date);
CREATE INDEX IF NOT EXISTS idx_inv_tx_type    ON inventory_transactions(tx_type);

-- ── 샘플 수주 데이터 ──────────────────────────────────────────
INSERT INTO sales_orders (order_no, order_date, customer_name, product_name, product_code, qty, unit_price, total_amount, due_date, status, manager, notes)
VALUES
  ('SO-2026-001','2026-03-01','현대자동차','STRW DAMPER','SD-2341',5000,15000,75000000,'2026-03-20','생산중','김철수','월간 정기 수주'),
  ('SO-2026-002','2026-03-03','기아자동차','HORN PLATE','HP-1122',3000,12000,36000000,'2026-03-18','생산지시','이영희','긴급 발주'),
  ('SO-2026-003','2026-03-05','현대모비스','BUSH (FRONT)','BF-3310',8000,8500,68000000,'2026-03-25','접수대기','박민수','2분기 계획'),
  ('SO-2026-004','2026-03-07','삼성SDI','SP2','SP-0200',2000,22000,44000000,'2026-03-15','출하대기','최강호','검수 완료 후 출고'),
  ('SO-2026-005','2026-03-10','현대자동차','STRW DAMPER','SD-2341',3000,15000,45000000,'2026-03-28','접수대기','김철수',''),
  ('SO-2026-006','2026-02-20','기아자동차','HORN PLATE','HP-1122',4000,12000,48000000,'2026-03-12','납품완료','이영희','납품 완료'),
  ('SO-2026-007','2026-02-25','현대모비스','BUSH (FRONT)','BF-3310',5000,8500,42500000,'2026-03-14','생산중','박민수',''),
  ('SO-2026-008','2026-03-11','LG에너지솔루션','SP2','SP-0200',1500,22000,33000000,'2026-03-16','생산지시','정지수','신규 고객사'),
  ('SO-2026-009','2026-03-12','현대자동차','STRW DAMPER','SD-2341',2000,15000,30000000,'2026-04-05','접수대기','김철수','4월 분'),
  ('SO-2026-010','2026-03-01','기아자동차','SP2','SP-0200',500,22000,11000000,'2026-03-13','출하대기','최강호','긴급 — 오늘 출하 예정')
ON CONFLICT (order_no) DO NOTHING;

-- ── 샘플 재고 품목 데이터 ─────────────────────────────────────
INSERT INTO inventory_items (code, name, category, unit, current_qty, safety_qty, unit_price, location, supplier)
VALUES
  ('RM-001','천연고무 (NR)',     '원자재','kg', 850,  1000, 3500, 'A-01', '한국고무'),
  ('RM-002','합성고무 (SBR)',    '원자재','kg', 420,  500,  2800, 'A-02', '금호석유화학'),
  ('RM-003','카본블랙',          '원자재','kg', 2100, 800,  1200, 'A-03', 'OCI'),
  ('RM-004','유황',              '원자재','kg', 350,  400,  800,  'A-04', '롯데케미칼'),
  ('RM-005','가황촉진제 (MBT)', '원자재','kg', 180,  200,  5500, 'A-05', '한국화학'),
  ('WIP-001','STRW DAMPER (반완)',  '반제품','EA', 320,  500,  8500, 'B-01', '-'),
  ('WIP-002','HORN PLATE (반완)',   '반제품','EA', 180,  300,  6200, 'B-02', '-'),
  ('WIP-003','BUSH (반완)',         '반제품','EA', 540,  400,  4100, 'B-03', '-'),
  ('FG-001', 'STRW DAMPER (완제)', '완제품','EA', 1200, 1500, 15000,'C-01', '-'),
  ('FG-002', 'HORN PLATE (완제)',  '완제품','EA', 680,  1000, 12000,'C-02', '-'),
  ('FG-003', 'BUSH FRONT (완제)', '완제품','EA', 950,  800,  8500, 'C-03', '-'),
  ('CS-001', '몰드 이형제',         '소모품','L',  45,   50,   12000,'D-01', '삼성정밀화학')
ON CONFLICT (code) DO NOTHING;

-- ── 샘플 입출고 이력 ──────────────────────────────────────────
INSERT INTO inventory_transactions (item_id, tx_date, tx_type, qty, before_qty, after_qty, ref_no, manager, notes)
SELECT i.id, '2026-03-13', '입고', 500, 350, 850, 'PO-2026-031', '박민수', '정기 입고'
FROM inventory_items i WHERE i.code = 'RM-001'
ON CONFLICT DO NOTHING;

INSERT INTO inventory_transactions (item_id, tx_date, tx_type, qty, before_qty, after_qty, ref_no, manager, notes)
SELECT i.id, '2026-03-13', '출고', 80, 260, 180, 'SO-2026-001', '김철수', '생산 투입'
FROM inventory_items i WHERE i.code = 'WIP-002'
ON CONFLICT DO NOTHING;

INSERT INTO inventory_transactions (item_id, tx_date, tx_type, qty, before_qty, after_qty, ref_no, manager, notes)
SELECT i.id, '2026-03-12', '입고', 300, 900, 1200, 'PO-2026-030', '이영희', '완제품 입고'
FROM inventory_items i WHERE i.code = 'FG-001'
ON CONFLICT DO NOTHING;

INSERT INTO inventory_transactions (item_id, tx_date, tx_type, qty, before_qty, after_qty, ref_no, manager, notes)
SELECT i.id, '2026-03-12', '출고', 200, 880, 680, 'SO-2026-006', '이영희', '납품 출고'
FROM inventory_items i WHERE i.code = 'FG-002'
ON CONFLICT DO NOTHING;
