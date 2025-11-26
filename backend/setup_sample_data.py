#!/usr/bin/env python3
"""
Helper script to set up sample data for testing and demos.
"""

import sys
from models.database import SessionLocal, init_db
from mainframe.data_loader import DataLoader

def main():
    """Load sample data."""
    print("Initializing database...")
    init_db()
    
    print("Creating database session...")
    db = SessionLocal()
    
    try:
        print("Generating sample data...")
        loader = DataLoader(db)
        result = loader.generate_all_sample_data(num_crew=50, num_flights=200)
        
        print(f"\n✅ Sample data created successfully!")
        print(f"   - Crew members: {len(result['crew_members'])}")
        print(f"   - Flights: {len(result['flights'])}")
        print(f"   - Assignments: {len(result['assignments'])}")
        print("\nYou can now run the API server and demo script.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
