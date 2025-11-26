"""
FastAPI routes for crew pay demo system.
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from api.schemas import (
    CrewMemberResponse, PayrollCalculationRequest, PayrollResponse,
    ComparisonRequest, ComparisonResponse, BatchProcessRequest,
    BatchProcessResponse, HealthResponse
)
from models.database import get_db, CrewMember, PayrollRecord
from mainframe.batch_processor import BatchProcessor
from agents.orchestrator import CrewPayOrchestrator
from comparison.analyzer import ComparisonAnalyzer

router = APIRouter()

# ============================================================================
# CREW MEMBER ENDPOINTS
# ============================================================================

@router.get("/crew", response_model=List[CrewMemberResponse])
async def list_crew_members(
    skip: int = 0,
    limit: int = 100,
    position: str = None,
    db: Session = Depends(get_db)
):
    """Get list of crew members."""
    query = db.query(CrewMember).filter(CrewMember.status == "active")
    
    if position:
        query = query.filter(CrewMember.position == position)
    
    crew_members = query.offset(skip).limit(limit).all()
    return crew_members

@router.get("/crew/{crew_id}", response_model=CrewMemberResponse)
async def get_crew_member(crew_id: int, db: Session = Depends(get_db)):
    """Get specific crew member."""
    crew = db.query(CrewMember).filter(CrewMember.id == crew_id).first()
    
    if not crew:
        raise HTTPException(status_code=404, detail="Crew member not found")
    
    return crew

# ============================================================================
# MAINFRAME PROCESSING ENDPOINTS
# ============================================================================

@router.post("/mainframe/process", response_model=PayrollResponse)
async def process_mainframe(
    request: PayrollCalculationRequest,
    db: Session = Depends(get_db)
):
    """
    Process single crew member using MAINFRAME system.
    
    This simulates legacy batch processing but for a single crew member.
    """
    if request.system not in ["mainframe", "both"]:
        raise HTTPException(
            status_code=400,
            detail="System must be 'mainframe' or 'both'"
        )
    
    processor = BatchProcessor(db)
    
    try:
        # Process single crew (part of batch simulation)
        crew = db.query(CrewMember).filter(
            CrewMember.id == request.crew_member_id
        ).first()
        
        if not crew:
            raise HTTPException(status_code=404, detail="Crew member not found")
        
        # Use the batch processor's internal method
        payroll = processor._process_crew_member(
            crew,
            request.period_start,
            request.period_end
        )
        
        return PayrollResponse(
            payroll_id=payroll.id,
            crew_member=f"{crew.first_name} {crew.last_name}",
            period_start=payroll.period_start,
            period_end=payroll.period_end,
            credit_hours=payroll.credit_hours,
            paid_hours=payroll.paid_hours,
            base_pay=payroll.base_pay,
            per_diem_pay=payroll.per_diem_pay,
            overtime_pay=payroll.overtime_pay,
            premium_pay=payroll.premium_pay,
            gross_pay=payroll.gross_pay,
            processing_system=payroll.processing_system,
            processing_time_seconds=payroll.processing_time_seconds,
            processing_status=payroll.processing_status,
            explanation=payroll.calculation_details
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mainframe/batch", response_model=BatchProcessResponse)
async def process_mainframe_batch(
    request: BatchProcessRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Run full MAINFRAME batch processing.
    
    This processes ALL active crew members in batch mode.
    Simulates overnight batch job (with optional delay).
    """
    if request.system != "mainframe":
        raise HTTPException(
            status_code=400,
            detail="This endpoint only processes mainframe batch"
        )
    
    processor = BatchProcessor(db)
    
    try:
        stats = processor.run_batch_job(
            request.period_start,
            request.period_end,
            simulate_delay=request.simulate_delay
        )
        
        return BatchProcessResponse(
            total_crew=stats['total_crew'],
            processed=stats['processed'],
            errors=stats['errors'],
            total_pay=stats['total_pay'],
            processing_time_seconds=stats['processing_time_seconds'],
            average_time_per_crew=stats['processing_time_seconds'] / max(stats['processed'], 1),
            system="mainframe"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# AI AGENT PROCESSING ENDPOINTS
# ============================================================================

@router.post("/ai-agent/process", response_model=PayrollResponse)
async def process_ai_agent(
    request: PayrollCalculationRequest,
    db: Session = Depends(get_db)
):
    """
    Process single crew member using AI AGENT system.
    
    This uses LangGraph multi-agent orchestration for real-time processing.
    """
    if request.system not in ["ai_agent", "both"]:
        raise HTTPException(
            status_code=400,
            detail="System must be 'ai_agent' or 'both'"
        )
    
    orchestrator = CrewPayOrchestrator(db)
    
    try:
        result = orchestrator.process_crew_member(
            request.crew_member_id,
            request.period_start,
            request.period_end
        )
        
        # Fetch the saved payroll record
        payroll = db.query(PayrollRecord).filter(
            PayrollRecord.id == result['payroll_id']
        ).first()
        
        return PayrollResponse(
            payroll_id=payroll.id,
            crew_member=result['crew_member'],
            period_start=payroll.period_start,
            period_end=payroll.period_end,
            credit_hours=payroll.credit_hours,
            paid_hours=payroll.paid_hours,
            base_pay=payroll.base_pay,
            per_diem_pay=payroll.per_diem_pay,
            overtime_pay=payroll.overtime_pay,
            premium_pay=payroll.premium_pay,
            gross_pay=payroll.gross_pay,
            processing_system=payroll.processing_system,
            processing_time_seconds=payroll.processing_time_seconds,
            processing_status=payroll.processing_status,
            explanation=result['explanation']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai-agent/batch", response_model=BatchProcessResponse)
async def process_ai_agent_batch(
    request: BatchProcessRequest,
    db: Session = Depends(get_db)
):
    """
    Process ALL crew members using AI AGENT system.
    
    This processes crew members one-by-one in real-time (vs mainframe batch).
    """
    if request.system != "ai_agent":
        raise HTTPException(
            status_code=400,
            detail="This endpoint only processes AI agent batch"
        )
    
    orchestrator = CrewPayOrchestrator(db)
    
    # Get all active crew
    crew_members = db.query(CrewMember).filter(
        CrewMember.status == "active"
    ).all()
    
    total_crew = len(crew_members)
    processed = 0
    errors = 0
    total_pay = 0.0
    start_time = datetime.utcnow()
    
    for crew in crew_members:
        try:
            result = orchestrator.process_crew_member(
                crew.id,
                request.period_start,
                request.period_end
            )
            processed += 1
            total_pay += result['gross_pay']
        except Exception as e:
            errors += 1
            print(f"Error processing {crew.employee_id}: {e}")
    
    end_time = datetime.utcnow()
    processing_time = (end_time - start_time).total_seconds()
    
    return BatchProcessResponse(
        total_crew=total_crew,
        processed=processed,
        errors=errors,
        total_pay=total_pay,
        processing_time_seconds=processing_time,
        average_time_per_crew=processing_time / max(processed, 1),
        system="ai_agent"
    )

# ============================================================================
# COMPARISON ENDPOINT
# ============================================================================

@router.post("/compare", response_model=ComparisonResponse)
async def compare_systems(
    request: ComparisonRequest,
    db: Session = Depends(get_db)
):
    """
    Compare MAINFRAME vs AI AGENT systems side-by-side.
    
    Processes the same crew member with both systems and analyzes differences.
    """
    
    # Get crew member
    crew = db.query(CrewMember).filter(
        CrewMember.id == request.crew_member_id
    ).first()
    
    if not crew:
        raise HTTPException(status_code=404, detail="Crew member not found")
    
    # Process with mainframe
    mainframe_processor = BatchProcessor(db)
    mainframe_start = datetime.utcnow()
    mainframe_payroll = mainframe_processor._process_crew_member(
        crew,
        request.period_start,
        request.period_end
    )
    mainframe_time = (datetime.utcnow() - mainframe_start).total_seconds()
    
    # Process with AI agents
    ai_orchestrator = CrewPayOrchestrator(db)
    ai_result = ai_orchestrator.process_crew_member(
        crew.id,
        request.period_start,
        request.period_end
    )
    
    ai_payroll = db.query(PayrollRecord).filter(
        PayrollRecord.id == ai_result['payroll_id']
    ).first()
    
    # Compare results
    analyzer = ComparisonAnalyzer()
    comparison = analyzer.compare_payroll_records(
        mainframe_payroll,
        ai_payroll,
        mainframe_time,
        ai_result['processing_time']
    )
    
    return ComparisonResponse(
        crew_member=f"{crew.first_name} {crew.last_name}",
        period=f"{request.period_start.date()} to {request.period_end.date()}",
        mainframe_result={
            "gross_pay": mainframe_payroll.gross_pay,
            "processing_time": mainframe_time,
            "credit_hours": mainframe_payroll.credit_hours,
            "base_pay": mainframe_payroll.base_pay,
            "per_diem": mainframe_payroll.per_diem_pay,
            "premium_pay": mainframe_payroll.premium_pay
        },
        ai_agent_result={
            "gross_pay": ai_payroll.gross_pay,
            "processing_time": ai_result['processing_time'],
            "credit_hours": ai_payroll.credit_hours,
            "base_pay": ai_payroll.base_pay,
            "per_diem": ai_payroll.per_diem_pay,
            "premium_pay": ai_payroll.premium_pay,
            "explanation": ai_result['explanation']
        },
        comparison=comparison['metrics'],
        differences=comparison['differences'],
        winner=comparison['winner'],
        recommendation=comparison['recommendation']
    )

# ============================================================================
# HEALTH & STATUS
# ============================================================================

@router.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint."""
    
    # Test database
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    # Check if Anthropic API key is set
    import os
    agents_available = bool(os.getenv("ANTHROPIC_API_KEY"))
    
    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        timestamp=datetime.utcnow(),
        database=db_status,
        agents_available=agents_available,
        mainframe_available=True
    )
