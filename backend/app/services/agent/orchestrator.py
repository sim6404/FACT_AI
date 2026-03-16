"""
Agent Orchestrator
사용자 질문 → Router → Specialist Agents → 응답 조합
"""

import time
import uuid
from typing import Optional, AsyncIterator
import structlog

from app.services.agent.router import route_question, RouteType
from app.services.snowflake.cortex_analyst import query_structured
from app.services.snowflake.client import get_snowflake_client
from app.schemas.agent import AgentRunCreate, AgentResponse, SourceRef

log = structlog.get_logger(__name__)


async def run_agent(
    question: str,
    user_id: int,
    department_hint: Optional[str] = None,
    policy_version: str = "v1",
) -> AgentResponse:
    """
    메인 에이전트 실행 진입점.
    1) Router로 분류
    2) 적절한 specialist 호출
    3) 응답 조합 → DB 저장
    """
    run_id = str(uuid.uuid4())
    start  = time.perf_counter()

    routing = route_question(question)
    if department_hint:
        routing["department"] = department_hint

    route_type = routing["route_type"]
    department = routing["department"]

    log.info("Agent run started", run_id=run_id, route=route_type, dept=department)

    sources:  list[SourceRef] = []
    sql:      Optional[str]   = None
    answer:   str             = ""
    chart_data = None

    # ── Route dispatch ────────────────────────────────────────────────────────
    if route_type in (RouteType.STRUCTURED, RouteType.MIXED):
        analyst_result = await query_structured(question, department=department)
        answer    = analyst_result.get("answer_text") or "분석 결과를 가져왔습니다."
        sql       = analyst_result.get("sql")
        rows      = analyst_result.get("rows", [])

        if sql:
            sources.append(SourceRef(
                source_type="snowflake_sql",
                source_ref=sql[:200],
                relevance_score=routing["confidence"],
            ))

    if route_type in (RouteType.DOCUMENT, RouteType.MIXED):
        client = get_snowflake_client()
        doc_results = await client.cortex_search(
            query=question,
            filter_obj={"dept_code": department} if department else None,
            limit=5,
        )
        for doc in doc_results:
            sources.append(SourceRef(
                source_type="document",
                source_ref=doc.get("doc_id", ""),
                relevance_score=doc.get("score", 0.0),
            ))
        if route_type == RouteType.DOCUMENT:
            # Build answer from doc search
            snippets = "\n\n".join(d.get("chunk_text", "") for d in doc_results[:3])
            answer = f"관련 문서에서 발췌한 내용입니다:\n\n{snippets}"

    if route_type == RouteType.REPORT:
        answer = "보고서 초안 생성을 시작합니다. 잠시 후 보고서 센터에서 확인하실 수 있습니다."

    if route_type == RouteType.ACTION:
        answer = "실행 요청이 접수되었습니다. 승인 워크플로를 생성합니다."

    elapsed = time.perf_counter() - start
    log.info("Agent run completed", run_id=run_id, elapsed_ms=int(elapsed * 1000))

    return AgentResponse(
        run_id=run_id,
        question=question,
        route_type=route_type,
        department=department,
        answer=answer,
        sql=sql,
        chart_data=chart_data,
        sources=sources,
        confidence_score=routing["confidence"],
        elapsed_ms=int(elapsed * 1000),
    )
