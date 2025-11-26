"""
Tests for AI agent orchestrator.
"""

import pytest
from datetime import datetime, timedelta
from models.database import SessionLocal, init_db
from agents.orchestrator import CrewPayOrchestrator
from mainframe.data_loader import DataLoader


@pytest.fixture
def db_session():
    """Create test database session."""
    init_db()
    db = SessionLocal()
    yield db
    db.close()


def test_process_crew_member(db_session):
    """Test AI agent processing."""
    loader = DataLoader(db_session)
    crew_members = loader.generate_crew_members(1)
    crew = crew_members[0]
    
    orchestrator = CrewPayOrchestrator(db_session)
    period_start = datetime.now().replace(day=1)
    period_end = period_start + timedelta(days=30)
    
    result = orchestrator.process_crew_member(crew.id, period_start, period_end)
    
    assert result is not None
    assert 'payroll_id' in result
    assert 'gross_pay' in result
    assert 'explanation' in result
    assert result['gross_pay'] >= 0
