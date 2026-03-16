from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class AgentQueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    department: Optional[str] = None
    session_id: Optional[str] = None


class SourceRef(BaseModel):
    source_type: str   # snowflake_sql | document | tool
    source_ref:  str
    relevance_score: float = 0.0
    description: Optional[str] = None


class AgentResponse(BaseModel):
    run_id:          str
    question:        str
    route_type:      str
    department:      str
    answer:          str
    sql:             Optional[str] = None
    chart_data:      Optional[Any] = None
    sources:         list[SourceRef] = []
    confidence_score: float = 0.0
    elapsed_ms:      int = 0


class AgentRunCreate(BaseModel):
    user_id:        int
    department_code: str
    question:       str
    route_type:     str
    response_summary: str
    confidence_score: float
    model_name:     str = "cortex-analyst"
    policy_version: str = "v1"
    status:         str = "done"


class AgentFeedbackRequest(BaseModel):
    run_id:    str
    is_helpful: bool
    comment:   Optional[str] = None
