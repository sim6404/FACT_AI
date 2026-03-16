from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from app.services.snowflake.client import get_snowflake_client

router = APIRouter()


class DocumentSearchRequest(BaseModel):
    query: str
    department: Optional[str] = None
    doc_type: Optional[str] = None   # meeting | claim | eco | quality
    limit: int = 10


@router.get("")
async def list_documents(
    department: Optional[str] = None,
    doc_type: Optional[str] = None,
    limit: int = 20,
):
    client = get_snowflake_client()
    try:
        rows = await client.execute("""
            SELECT doc_id, doc_title, doc_type, dept_code, created_at, author
            FROM FACT_DB.DOC.doc_registry
            WHERE (:dept IS NULL OR dept_code = :dept)
              AND (:type IS NULL OR doc_type  = :type)
            ORDER BY created_at DESC
            LIMIT :lim
        """, {"dept": department, "type": doc_type, "lim": limit})
    except Exception:
        rows = []
    return {"items": rows}


@router.get("/{doc_id}")
async def get_document(doc_id: str):
    client = get_snowflake_client()
    try:
        row = await client.execute_one(
            "SELECT * FROM FACT_DB.DOC.doc_registry WHERE doc_id = %(id)s",
            {"id": doc_id},
        )
    except Exception:
        row = None
    if not row:
        from fastapi import HTTPException
        raise HTTPException(404, "Document not found")
    return row


@router.post("/search")
async def search_documents(req: DocumentSearchRequest):
    """Cortex Search 기반 의미 검색"""
    client = get_snowflake_client()
    filter_obj = {}
    if req.department: filter_obj["dept_code"] = req.department
    if req.doc_type:   filter_obj["doc_type"]  = req.doc_type

    results = await client.cortex_search(
        query=req.query,
        filter_obj=filter_obj or None,
        limit=req.limit,
    )
    return {"query": req.query, "results": results, "count": len(results)}
