"""
Router Agent — 사용자 질문을 분류하고 적절한 에이전트로 라우팅
route_type: structured | document | mixed | report | action
"""

import re
from typing import Optional
from enum import Enum
import structlog

log = structlog.get_logger(__name__)


class RouteType(str, Enum):
    STRUCTURED = "structured"   # KPI / 정형 데이터 질의 → Cortex Analyst
    DOCUMENT   = "document"     # 문서 검색 → Cortex Search
    MIXED      = "mixed"        # 정형 + 문서 혼합
    REPORT     = "report"       # 보고서 생성
    ACTION     = "action"       # 실행 요청 (발주, 알림 등)


class DepartmentCode(str, Enum):
    MANAGEMENT  = "management"
    PROCUREMENT = "procurement"
    PRODUCTION  = "production"
    QUALITY     = "quality"
    SALES       = "sales"
    RND         = "rnd"


# ── Keyword rules (경량 분류기, LLM call 없이) ──────────────────────────────
_STRUCTURED_KEYWORDS = [
    "재고", "발주", "OEE", "PPM", "납기", "생산", "설비", "예산", "집행",
    "가동", "비가동", "KPI", "실적", "목표", "달성", "단가", "수불",
    "분기", "주간", "월간", "추이", "비교", "현황",
]
_DOCUMENT_KEYWORDS = [
    "회의록", "클레임", "ECO", "설계변경", "품질보고서", "조치이력",
    "작업일지", "문서", "보고서 내용", "지난 미팅", "이전 회의",
]
_REPORT_KEYWORDS  = ["보고서 만들어", "요약본", "초안", "PPT", "PDF", "보고서 생성", "작성해줘"]
_ACTION_KEYWORDS  = ["발주해줘", "등록해줘", "승인 요청", "알림 보내", "ERP에 반영"]

_DEPT_KEYWORDS: dict[DepartmentCode, list[str]] = {
    DepartmentCode.MANAGEMENT:  ["경영", "예산", "집행", "전사", "임원"],
    DepartmentCode.PROCUREMENT: ["구매", "발주", "공급사", "납기", "원자재", "자재"],
    DepartmentCode.PRODUCTION:  ["생산", "MES", "설비", "OEE", "가동", "공정", "라인"],
    DepartmentCode.QUALITY:     ["품질", "PPM", "불량", "검사", "클레임", "이상"],
    DepartmentCode.SALES:       ["영업", "수주", "견적", "고객"],
    DepartmentCode.RND:         ["설계", "R&D", "ECO", "개발", "도면"],
}


def _count_keywords(text: str, keywords: list[str]) -> int:
    text_lower = text.lower()
    return sum(1 for kw in keywords if kw in text_lower)


def route_question(question: str) -> dict:
    """
    경량 키워드 기반 라우팅.
    프로덕션에서는 Cortex Complete 또는 별도 분류 모델로 교체.
    """
    structured_score = _count_keywords(question, _STRUCTURED_KEYWORDS)
    document_score   = _count_keywords(question, _DOCUMENT_KEYWORDS)
    report_score     = _count_keywords(question, _REPORT_KEYWORDS)
    action_score     = _count_keywords(question, _ACTION_KEYWORDS)

    if action_score > 0:
        route = RouteType.ACTION
    elif report_score > 0:
        route = RouteType.REPORT
    elif structured_score > 0 and document_score > 0:
        route = RouteType.MIXED
    elif document_score > structured_score:
        route = RouteType.DOCUMENT
    else:
        route = RouteType.STRUCTURED

    # 부서 추론
    dept_scores = {
        dept: _count_keywords(question, kws)
        for dept, kws in _DEPT_KEYWORDS.items()
    }
    dept = max(dept_scores, key=lambda d: dept_scores[d])
    if dept_scores[dept] == 0:
        dept = DepartmentCode.MANAGEMENT  # default

    log.info(
        "Router classified",
        route=route,
        dept=dept,
        s_score=structured_score,
        d_score=document_score,
    )

    return {
        "route_type": route,
        "department": dept,
        "confidence": min(1.0, max(structured_score, document_score, report_score, action_score) / 3),
    }
