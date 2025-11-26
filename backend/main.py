"""
FastAPI main application for Crew Pay Intelligence System.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import init_db
from api.routes import router

app = FastAPI(
    title="Crew Pay Intelligence System",
    description="Comparison system for Mainframe vs AI Agent payroll processing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["crew-pay"])


@app.on_event("startup")
async def startup():
    """Initialize database on startup."""
    init_db()
    
    # Optionally load sample data on first start
    # Uncomment to auto-load data:
    # from mainframe.data_loader import DataLoader
    # from models.database import SessionLocal
    # db = SessionLocal()
    # loader = DataLoader(db)
    # loader.generate_all_sample_data(num_crew=50, num_flights=200)
    # db.close()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Crew Pay Intelligence System API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
