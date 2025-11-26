"""
Tests for mainframe batch processor.
"""

import pytest
from datetime import datetime, timedelta
from models.database import SessionLocal, init_db
from mainframe.batch_processor import BatchProcessor
from mainframe.data_loader import DataLoader


@pytest.fixture
def db_session():
    """Create test database session."""
    init_db()
    db = SessionLocal()
    yield db
    db.close()


def test_process_single_crew_member(db_session):
    """Test processing a single crew member."""
    loader = DataLoader(db_session)
    crew_members = loader.generate_crew_members(1)
    crew = crew_members[0]
    
    processor = BatchProcessor(db_session)
    period_start = datetime.now().replace(day=1)
    period_end = period_start + timedelta(days=30)
    
    payroll = processor._process_crew_member(crew, period_start, period_end)
    
    assert payroll is not None
    assert payroll.crew_member_id == crew.id
    assert payroll.processing_system == "mainframe"
    assert payroll.gross_pay >= 0


def test_batch_job(db_session):
    """Test full batch job."""
    loader = DataLoader(db_session)
    loader.generate_all_sample_data(num_crew=5, num_flights=20)
    
    processor = BatchProcessor(db_session)
    period_start = datetime.now().replace(day=1)
    period_end = period_start + timedelta(days=30)
    
    stats = processor.run_batch_job(period_start, period_end, simulate_delay=False)
    
    assert stats['processed'] > 0
    assert stats['errors'] >= 0
    assert stats['total_pay'] > 0
