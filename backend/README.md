# Crew Pay Intelligence System - Backend API

FastAPI backend for comparing Mainframe vs AI Agent payroll processing systems.

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL database (Neon recommended)
- Anthropic API key (for AI agents)

### Installation

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export DATABASE_URL="postgresql://user:password@host/database"
export ANTHROPIC_API_KEY="your-api-key"
```

Or create a `.env` file:
```
DATABASE_URL=postgresql://user:password@host/database
ANTHROPIC_API_KEY=your-api-key
```

3. Initialize database:
```bash
python -c "from models.database import init_db; init_db()"
```

4. (Optional) Load sample data:
```bash
python -c "
from models.database import SessionLocal
from mainframe.data_loader import DataLoader
db = SessionLocal()
loader = DataLoader(db)
loader.generate_all_sample_data(num_crew=50, num_flights=200)
db.close()
"
```

5. Start the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### Crew Members
```
GET /api/v1/crew
GET /api/v1/crew/{crew_id}
```

### Mainframe Processing
```
POST /api/v1/mainframe/process
POST /api/v1/mainframe/batch
```

### AI Agent Processing
```
POST /api/v1/ai-agent/process
POST /api/v1/ai-agent/batch
```

### Comparison
```
POST /api/v1/compare
```

## Testing

Run the test suite:
```bash
pytest tests/
```

## Railway Deployment

1. Connect your GitHub repo to Railway
2. Add a PostgreSQL service (or use external Neon database)
3. Set environment variables:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `PORT` (automatically set by Railway)
4. Deploy!

The `railway.json` file is already configured for Python/FastAPI deployment.

## Demo Script

Run the interactive demo:
```bash
cd demo
python demo_script.py
```

Make sure the backend is running first!

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
