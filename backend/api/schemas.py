"""
Pydantic schemas for API requests/responses.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any

class CrewMemberResponse(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    position: str
    base: str
    hourly_rate: float
    
    class Config:
        from_attributes = True

class PayrollCalculationRequest(BaseModel):
    crew_member_id: int
    period_start: datetime
    period_end: datetime
    system: str = Field(..., pattern="^(mainframe|ai_agent|both)$")

class PayrollResponse(BaseModel):
    payroll_id: int
    crew_member: str
    period_start: datetime
    period_end: datetime
    credit_hours: float
    paid_hours: float
    base_pay: float
    per_diem_pay: float
    overtime_pay: float
    premium_pay: float
    gross_pay: float
    processing_system: str
    processing_time_seconds: float
    processing_status: str
    explanation: Optional[str] = None
    
    class Config:
        from_attributes = True

class ComparisonRequest(BaseModel):
    crew_member_id: int
    period_start: datetime
    period_end: datetime

class ComparisonResponse(BaseModel):
    crew_member: str
    period: str
    
    mainframe_result: Dict[str, Any]
    ai_agent_result: Dict[str, Any]
    
    comparison: Dict[str, Any]
    differences: List[Dict[str, Any]]
    
    winner: str  # "mainframe", "ai_agent", or "tie"
    recommendation: str

class BatchProcessRequest(BaseModel):
    period_start: datetime
    period_end: datetime
    system: str = Field(..., pattern="^(mainframe|ai_agent)$")
    simulate_delay: bool = True

class BatchProcessResponse(BaseModel):
    total_crew: int
    processed: int
    errors: int
    total_pay: float
    processing_time_seconds: float
    average_time_per_crew: float
    system: str

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    database: str
    agents_available: bool
    mainframe_available: bool
