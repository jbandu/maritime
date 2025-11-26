"""
Data loader for generating sample crew and flight data.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.database import CrewMember, Flight, CrewAssignment
import random


class DataLoader:
    """Loads sample data for testing and demos."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_all_sample_data(self, num_crew: int = 50, num_flights: int = 200):
        """Generate complete sample dataset."""
        
        crew_members = self.generate_crew_members(num_crew)
        flights = self.generate_flights(num_flights)
        assignments = self.generate_assignments(crew_members, flights)
        
        return {
            "crew_members": crew_members,
            "flights": flights,
            "assignments": assignments
        }
    
    def generate_crew_members(self, count: int):
        """Generate sample crew members."""
        
        positions = ["Captain", "First Officer", "Flight Attendant"]
        bases = ["BUR", "TPA", "MCO", "FLL"]
        first_names = ["John", "Jane", "Mike", "Sarah", "David", "Emily", "Chris", "Lisa"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
        
        crew_members = []
        
        for i in range(count):
            crew = CrewMember(
                employee_id=f"AVL{1000 + i:04d}",
                first_name=random.choice(first_names),
                last_name=random.choice(last_names),
                position=random.choice(positions),
                base=random.choice(bases),
                hourly_rate=random.uniform(45.0, 120.0),
                status="active"
            )
            self.db.add(crew)
            crew_members.append(crew)
        
        self.db.commit()
        
        for crew in crew_members:
            self.db.refresh(crew)
        
        return crew_members
    
    def generate_flights(self, count: int):
        """Generate sample flights."""
        
        origins = ["BUR", "TPA", "MCO", "FLL", "LAX", "JFK"]
        destinations = ["BUR", "TPA", "MCO", "FLL", "LAX", "JFK", "LHR", "CDG"]
        
        flights = []
        base_date = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        
        for i in range(count):
            origin = random.choice(origins)
            dest = random.choice(destinations)
            
            # Random date in current month
            day = random.randint(1, 28)
            hour = random.randint(6, 22)
            
            departure = base_date.replace(day=day, hour=hour)
            arrival = departure + timedelta(hours=random.uniform(2, 6))
            
            flight = Flight(
                flight_number=f"AV{random.randint(100, 999)}",
                origin=origin,
                destination=dest,
                scheduled_departure=departure,
                scheduled_arrival=arrival,
                actual_departure=departure + timedelta(minutes=random.randint(-30, 30)),
                actual_arrival=arrival + timedelta(minutes=random.randint(-30, 30)),
                aircraft_type="B737",
                is_international=dest in ["LHR", "CDG"],
                is_red_eye=hour >= 22 or hour <= 5
            )
            self.db.add(flight)
            flights.append(flight)
        
        self.db.commit()
        
        for flight in flights:
            self.db.refresh(flight)
        
        return flights
    
    def generate_assignments(self, crew_members, flights):
        """Generate crew assignments."""
        
        assignments = []
        
        for flight in flights:
            # Assign 2-4 crew per flight
            num_crew = random.randint(2, 4)
            selected_crew = random.sample(crew_members, min(num_crew, len(crew_members)))
            
            for crew in selected_crew:
                assignment = CrewAssignment(
                    crew_member_id=crew.id,
                    flight_id=flight.id,
                    position=crew.position,
                    duty_start=flight.scheduled_departure - timedelta(hours=1),
                    duty_end=flight.scheduled_arrival + timedelta(hours=1),
                    credit_hours=(flight.scheduled_arrival - flight.scheduled_departure).total_seconds() / 3600,
                    per_diem_days=1.0
                )
                self.db.add(assignment)
                assignments.append(assignment)
        
        self.db.commit()
        
        return assignments
