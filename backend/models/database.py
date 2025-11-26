"""
Database models and session management.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment or default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/crewpay")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CrewMember(Base):
    __tablename__ = "crew_members"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    position = Column(String)  # "Pilot", "Flight Attendant", etc.
    base = Column(String)  # "BUR", "TPA", etc.
    hourly_rate = Column(Float)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    payroll_records = relationship("PayrollRecord", back_populates="crew_member")


class Flight(Base):
    __tablename__ = "flights"
    
    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, index=True)
    origin = Column(String)
    destination = Column(String)
    scheduled_departure = Column(DateTime)
    scheduled_arrival = Column(DateTime)
    actual_departure = Column(DateTime, nullable=True)
    actual_arrival = Column(DateTime, nullable=True)
    aircraft_type = Column(String)
    is_international = Column(Boolean, default=False)
    is_red_eye = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assignments = relationship("CrewAssignment", back_populates="flight")


class CrewAssignment(Base):
    __tablename__ = "crew_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    crew_member_id = Column(Integer, ForeignKey("crew_members.id"))
    flight_id = Column(Integer, ForeignKey("flights.id"))
    position = Column(String)  # "Captain", "First Officer", "FA", etc.
    duty_start = Column(DateTime)
    duty_end = Column(DateTime)
    credit_hours = Column(Float, default=0.0)
    per_diem_days = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    crew_member = relationship("CrewMember")
    flight = relationship("Flight", back_populates="assignments")


class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(Integer, primary_key=True, index=True)
    crew_member_id = Column(Integer, ForeignKey("crew_members.id"))
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    
    credit_hours = Column(Float, default=0.0)
    paid_hours = Column(Float, default=0.0)
    
    base_pay = Column(Float, default=0.0)
    per_diem_pay = Column(Float, default=0.0)
    overtime_pay = Column(Float, default=0.0)
    premium_pay = Column(Float, default=0.0)
    gross_pay = Column(Float, default=0.0)
    
    processing_system = Column(String)  # "mainframe" or "ai_agent"
    processing_time_seconds = Column(Float)
    processing_status = Column(String, default="completed")
    calculation_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    crew_member = relationship("CrewMember", back_populates="payroll_records")


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
