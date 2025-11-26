"""
Shared dependencies for API routes.
"""

from sqlalchemy.orm import Session
from models.database import get_db

# Re-export get_db for convenience
__all__ = ["get_db"]
