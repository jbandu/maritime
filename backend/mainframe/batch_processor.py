"""
Mainframe batch processor - simulates legacy batch payroll processing.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.database import CrewMember, PayrollRecord, CrewAssignment, Flight
import time
import random


class BatchProcessor:
    """Simulates legacy mainframe batch processing."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def _process_crew_member(
        self,
        crew: CrewMember,
        period_start: datetime,
        period_end: datetime
    ) -> PayrollRecord:
        """Process a single crew member's payroll."""
        
        start_time = time.time()
        
        # Get all assignments in period
        assignments = self.db.query(CrewAssignment).filter(
            CrewAssignment.crew_member_id == crew.id,
            CrewAssignment.duty_start >= period_start,
            CrewAssignment.duty_start <= period_end
        ).all()
        
        # Calculate credit hours (simplified)
        credit_hours = sum([a.credit_hours for a in assignments])
        if credit_hours == 0:
            # Calculate from duty times
            for assignment in assignments:
                if assignment.duty_start and assignment.duty_end:
                    hours = (assignment.duty_end - assignment.duty_start).total_seconds() / 3600
                    credit_hours += hours
        
        # Minimum guarantee
        paid_hours = max(credit_hours, 75.0)  # 75 hour guarantee
        
        # Base pay
        base_pay = paid_hours * crew.hourly_rate
        
        # Per diem (simplified: $2.50 per hour)
        per_diem_pay = credit_hours * 2.50
        
        # Overtime (hours over 75)
        overtime_hours = max(0, credit_hours - 75.0)
        overtime_pay = overtime_hours * crew.hourly_rate * 1.5
        
        # Premium pay (simplified)
        premium_pay = 0.0
        for assignment in assignments:
            flight = assignment.flight
            if flight and flight.is_red_eye:
                premium_pay += 50.0  # $50 per red-eye
        
        gross_pay = base_pay + per_diem_pay + overtime_pay + premium_pay
        
        processing_time = time.time() - start_time
        
        # Add some delay to simulate mainframe processing
        time.sleep(random.uniform(0.1, 0.3))
        
        payroll = PayrollRecord(
            crew_member_id=crew.id,
            period_start=period_start,
            period_end=period_end,
            credit_hours=credit_hours,
            paid_hours=paid_hours,
            base_pay=base_pay,
            per_diem_pay=per_diem_pay,
            overtime_pay=overtime_pay,
            premium_pay=premium_pay,
            gross_pay=gross_pay,
            processing_system="mainframe",
            processing_time_seconds=processing_time,
            processing_status="completed",
            calculation_details="Mainframe batch calculation"
        )
        
        self.db.add(payroll)
        self.db.commit()
        self.db.refresh(payroll)
        
        return payroll
    
    def run_batch_job(
        self,
        period_start: datetime,
        period_end: datetime,
        simulate_delay: bool = True
    ) -> dict:
        """Run full batch job for all active crew."""
        
        start_time = time.time()
        
        crew_members = self.db.query(CrewMember).filter(
            CrewMember.status == "active"
        ).all()
        
        total_crew = len(crew_members)
        processed = 0
        errors = 0
        total_pay = 0.0
        
        for crew in crew_members:
            try:
                payroll = self._process_crew_member(crew, period_start, period_end)
                processed += 1
                total_pay += payroll.gross_pay
                
                # Simulate batch delay
                if simulate_delay:
                    time.sleep(random.uniform(0.5, 1.5))
                    
            except Exception as e:
                errors += 1
                print(f"Error processing {crew.employee_id}: {e}")
        
        processing_time = time.time() - start_time
        
        return {
            "total_crew": total_crew,
            "processed": processed,
            "errors": errors,
            "total_pay": total_pay,
            "processing_time_seconds": processing_time
        }
