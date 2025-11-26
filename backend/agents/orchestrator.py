"""
AI Agent orchestrator - uses LangGraph multi-agent system for intelligent payroll processing.
"""

from datetime import datetime
from sqlalchemy.orm import Session
from models.database import CrewMember, PayrollRecord, CrewAssignment
import time
import os
from typing import Dict, Any


class CrewPayOrchestrator:
    """Orchestrates AI agents for crew payroll processing."""
    
    def __init__(self, db: Session):
        self.db = db
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
    
    def process_crew_member(
        self,
        crew_member_id: int,
        period_start: datetime,
        period_end: datetime
    ) -> Dict[str, Any]:
        """
        Process crew member payroll using AI agents.
        
        This simulates the LangGraph multi-agent system.
        In production, this would call actual LangGraph agents.
        """
        
        start_time = time.time()
        
        crew = self.db.query(CrewMember).filter(
            CrewMember.id == crew_member_id
        ).first()
        
        if not crew:
            raise ValueError(f"Crew member {crew_member_id} not found")
        
        # Get assignments
        assignments = self.db.query(CrewAssignment).filter(
            CrewAssignment.crew_member_id == crew_member_id,
            CrewAssignment.duty_start >= period_start,
            CrewAssignment.duty_start <= period_end
        ).all()
        
        # Simulate AI agent processing
        # In production, this would call LangGraph agents
        
        # Flight Time Calculator Agent
        credit_hours = sum([a.credit_hours for a in assignments])
        if credit_hours == 0:
            for assignment in assignments:
                if assignment.duty_start and assignment.duty_end:
                    hours = (assignment.duty_end - assignment.duty_start).total_seconds() / 3600
                    credit_hours += hours
        
        # Per Diem Calculator Agent (intelligent)
        per_diem_days = 0.0
        for assignment in assignments:
            flight = assignment.flight
            if flight:
                # Intelligent per diem calculation
                if flight.is_international:
                    per_diem_days += 1.5  # International gets more
                else:
                    per_diem_days += 1.0
        
        # Premium Pay Calculator Agent
        premium_pay = 0.0
        for assignment in assignments:
            flight = assignment.flight
            if flight:
                if flight.is_red_eye:
                    premium_pay += 75.0  # AI catches more premium opportunities
                # Check for holiday, etc.
        
        # Guarantee Calculator Agent
        paid_hours = max(credit_hours, 75.0)
        
        # Base pay
        base_pay = paid_hours * crew.hourly_rate
        
        # Per diem
        per_diem_pay = per_diem_days * 50.0  # $50 per day
        
        # Overtime
        overtime_hours = max(0, credit_hours - 75.0)
        overtime_pay = overtime_hours * crew.hourly_rate * 1.5
        
        gross_pay = base_pay + per_diem_pay + overtime_pay + premium_pay
        
        processing_time = time.time() - start_time
        
        # Generate explanation (simulated AI explanation)
        explanation = (
            f"Processed payroll for {crew.first_name} {crew.last_name} "
            f"({crew.employee_id}). Calculated {credit_hours:.2f} credit hours "
            f"from {len(assignments)} assignments. Applied {per_diem_days:.1f} "
            f"per diem days. Detected premium pay opportunities totaling ${premium_pay:.2f}. "
            f"Final gross pay: ${gross_pay:,.2f}."
        )
        
        payroll = PayrollRecord(
            crew_member_id=crew_member_id,
            period_start=period_start,
            period_end=period_end,
            credit_hours=credit_hours,
            paid_hours=paid_hours,
            base_pay=base_pay,
            per_diem_pay=per_diem_pay,
            overtime_pay=overtime_pay,
            premium_pay=premium_pay,
            gross_pay=gross_pay,
            processing_system="ai_agent",
            processing_time_seconds=processing_time,
            processing_status="completed",
            calculation_details=explanation
        )
        
        self.db.add(payroll)
        self.db.commit()
        self.db.refresh(payroll)
        
        return {
            "payroll_id": payroll.id,
            "crew_member": f"{crew.first_name} {crew.last_name}",
            "gross_pay": gross_pay,
            "processing_time": processing_time,
            "explanation": explanation
        }
