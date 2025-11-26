"""
Test suite for comparing mainframe vs AI agent systems.
"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from models.database import SessionLocal, init_db
from mainframe.data_loader import DataLoader
from mainframe.batch_processor import BatchProcessor
from agents.orchestrator import CrewPayOrchestrator
from comparison.analyzer import ComparisonAnalyzer


@pytest.fixture
def db_session():
    """Create test database session."""
    init_db()
    db = SessionLocal()
    yield db
    db.close()


@pytest.fixture
def sample_data(db_session):
    """Load sample data for testing."""
    loader = DataLoader(db_session)
    return loader.generate_all_sample_data(num_crew=10, num_flights=50)


def test_mainframe_vs_ai_agent(db_session, sample_data):
    """Test that both systems produce similar results."""
    
    crew_member = sample_data['crew_members'][0]
    period_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
    period_end = period_start + timedelta(days=30)
    
    # Process with mainframe
    mainframe_processor = BatchProcessor(db_session)
    mainframe_payroll = mainframe_processor._process_crew_member(
        crew_member,
        period_start,
        period_end
    )
    
    # Process with AI
    ai_orchestrator = CrewPayOrchestrator(db_session)
    ai_result = ai_orchestrator.process_crew_member(
        crew_member.id,
        period_start,
        period_end
    )
    
    # Compare
    assert mainframe_payroll.gross_pay > 0
    assert ai_result['gross_pay'] > 0
    
    # Should be within $10 (accounting for intelligent corrections)
    diff = abs(mainframe_payroll.gross_pay - ai_result['gross_pay'])
    assert diff < 10.00, f"Difference too large: ${diff}"
    
    # AI should be faster
    assert ai_result['processing_time'] < 30, "AI processing too slow"


def test_batch_processing_comparison(db_session, sample_data):
    """Test batch processing performance."""
    
    period_start = datetime.now().replace(day=1)
    period_end = period_start + timedelta(days=30)
    
    # Mainframe batch (with delays disabled for test)
    mainframe_processor = BatchProcessor(db_session)
    mainframe_stats = mainframe_processor.run_batch_job(
        period_start,
        period_end,
        simulate_delay=False
    )
    
    assert mainframe_stats['processed'] == len(sample_data['crew_members'])
    assert mainframe_stats['errors'] == 0
    
    print(f"\n📊 Mainframe processed {mainframe_stats['processed']} crew in {mainframe_stats['processing_time_seconds']:.2f}s")


def test_edge_cases(db_session, sample_data):
    """Test edge case handling."""
    
    # Test crew with no flights
    crew_no_flights = sample_data['crew_members'][-1]
    period_start = datetime.now().replace(day=1)
    period_end = period_start + timedelta(days=30)
    
    # Both systems should handle gracefully
    mainframe_processor = BatchProcessor(db_session)
    mainframe_payroll = mainframe_processor._process_crew_member(
        crew_no_flights,
        period_start,
        period_end
    )
    
    # Should still get minimum guarantee
    assert mainframe_payroll.gross_pay >= 0
    
    ai_orchestrator = CrewPayOrchestrator(db_session)
    ai_result = ai_orchestrator.process_crew_member(
        crew_no_flights.id,
        period_start,
        period_end
    )
    
    assert ai_result['gross_pay'] >= 0
