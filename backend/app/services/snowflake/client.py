"""
Snowflake 연결 클라이언트
- 일반 SQL 실행
- Cortex Analyst (자연어 → SQL)
- Cortex Search (문서 검색)
- Cortex Agents
"""

import json
import asyncio
from typing import Any, Optional
from functools import lru_cache

import snowflake.connector
from snowflake.connector import DictCursor
import structlog

from app.core.config import settings

log = structlog.get_logger(__name__)


class SnowflakeClient:
    """동기 Snowflake 커넥션을 asyncio.to_thread 로 래핑"""

    def __init__(self):
        self._conn: Optional[snowflake.connector.SnowflakeConnection] = None

    def _get_conn(self) -> snowflake.connector.SnowflakeConnection:
        if self._conn is None or self._conn.is_closed():
            connect_kwargs = {
                "account":   settings.SNOWFLAKE_ACCOUNT,
                "user":      settings.SNOWFLAKE_USER,
                "warehouse": settings.SNOWFLAKE_WAREHOUSE,
                "database":  settings.SNOWFLAKE_DATABASE,
                "schema":    settings.SNOWFLAKE_SCHEMA,
                "role":      settings.SNOWFLAKE_ROLE,
                "session_parameters": {
                    "QUERY_TAG": "FACT_APP",
                    "TIMEZONE":  "Asia/Seoul",
                },
            }
            if settings.SNOWFLAKE_PRIVATE_KEY_PATH:
                from cryptography.hazmat.primitives import serialization
                with open(settings.SNOWFLAKE_PRIVATE_KEY_PATH, "rb") as f:
                    p_key = serialization.load_pem_private_key(f.read(), password=None)
                connect_kwargs["private_key"] = p_key.private_bytes(
                    serialization.Encoding.DER,
                    serialization.PrivateFormat.PKCS8,
                    serialization.NoEncryption(),
                )
            else:
                connect_kwargs["password"] = settings.SNOWFLAKE_PASSWORD

            self._conn = snowflake.connector.connect(**connect_kwargs)
            log.info("Snowflake connected", account=settings.SNOWFLAKE_ACCOUNT)
        return self._conn

    # ── Generic SQL ──────────────────────────────────────────────────────────
    async def execute(
        self,
        sql: str,
        params: Optional[dict] = None,
        warehouse: Optional[str] = None,
    ) -> list[dict]:
        def _run():
            conn = self._get_conn()
            with conn.cursor(DictCursor) as cur:
                if warehouse:
                    cur.execute(f"USE WAREHOUSE {warehouse}")
                cur.execute(sql, params or {})
                return cur.fetchall()

        rows = await asyncio.to_thread(_run)
        return [dict(r) for r in rows]

    async def execute_one(self, sql: str, params: Optional[dict] = None) -> Optional[dict]:
        rows = await self.execute(sql, params)
        return rows[0] if rows else None

    # ── Cortex Analyst ───────────────────────────────────────────────────────
    async def cortex_analyst_query(
        self,
        question: str,
        semantic_model_file: Optional[str] = None,
    ) -> dict[str, Any]:
        """
        Cortex Analyst REST API 호출.
        Snowflake REST endpoint: POST /api/v2/cortex/analyst/message
        Returns: { sql, answer_text, confidence, chart_spec }
        """
        import httpx

        token = await self._get_session_token()
        sf_host = f"https://{settings.SNOWFLAKE_ACCOUNT}.snowflakecomputing.com"
        url = f"{sf_host}/api/v2/cortex/analyst/message"

        payload = {
            "messages": [{"role": "user", "content": [{"type": "text", "text": question}]}],
            "semantic_model_file": semantic_model_file or settings.CORTEX_ANALYST_SEMANTIC_FILE,
        }

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type":  "application/json",
                    "Accept":        "application/json",
                    "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT",
                },
            )
            resp.raise_for_status()
            data = resp.json()

        message = data.get("message", {})
        content = message.get("content", [])

        result: dict[str, Any] = {
            "question":    question,
            "sql":         None,
            "answer_text": None,
            "confidence":  data.get("request_id"),
            "chart_spec":  None,
            "raw":         data,
        }

        for item in content:
            if item.get("type") == "sql":
                result["sql"] = item.get("statement")
            elif item.get("type") == "text":
                result["answer_text"] = item.get("text")
            elif item.get("type") == "suggestions":
                result["suggestions"] = item.get("suggestions", [])

        # Execute the generated SQL
        if result["sql"]:
            try:
                result["rows"] = await self.execute(result["sql"])
            except Exception as e:
                log.warning("Cortex Analyst SQL execution failed", error=str(e))
                result["rows"] = []

        return result

    # ── Cortex Search ────────────────────────────────────────────────────────
    async def cortex_search(
        self,
        query: str,
        columns: list[str] = None,
        filter_obj: Optional[dict] = None,
        limit: int = 10,
    ) -> list[dict]:
        """
        Cortex Search REST API 호출.
        POST /api/v2/cortex/search
        """
        import httpx

        token = await self._get_session_token()
        sf_host = f"https://{settings.SNOWFLAKE_ACCOUNT}.snowflakecomputing.com"
        url = f"{sf_host}/api/v2/cortex/search"

        payload: dict[str, Any] = {
            "query":           query,
            "columns":         columns or ["chunk_text", "doc_id", "doc_title", "dept_code", "page_num"],
            "limit":           limit,
            "service":         settings.CORTEX_SEARCH_SERVICE,
        }
        if filter_obj:
            payload["filter"] = filter_obj

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type":  "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()

        return data.get("results", [])

    # ── Cortex Complete (LLM) ────────────────────────────────────────────────
    async def cortex_complete(
        self,
        prompt: str,
        model: str = "snowflake-arctic-instruct",
        temperature: float = 0.1,
    ) -> str:
        sql = f"""
        SELECT SNOWFLAKE.CORTEX.COMPLETE(
            '{model}',
            [{{'role': 'user', 'content': %s}}],
            {{'temperature': {temperature}}}
        ) AS response
        """
        row = await self.execute_one(sql, (prompt,))
        return row["RESPONSE"] if row else ""

    # ── Session token (for REST APIs) ────────────────────────────────────────
    async def _get_session_token(self) -> str:
        def _run():
            conn = self._get_conn()
            with conn.cursor() as cur:
                cur.execute("SELECT CURRENT_SESSION()")
                return cur.fetchone()[0]

        session_id = await asyncio.to_thread(_run)
        # In production: use JWT with RSA key pair
        return session_id

    # ── Utility ─────────────────────────────────────────────────────────────
    async def close(self):
        if self._conn and not self._conn.is_closed():
            self._conn.close()
            log.info("Snowflake connection closed")


@lru_cache(maxsize=1)
def get_snowflake_client() -> SnowflakeClient:
    return SnowflakeClient()
