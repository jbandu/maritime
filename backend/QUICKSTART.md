# Quick Start Guide

## 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 2. Set Up Environment

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL` (PostgreSQL connection string)
- `ANTHROPIC_API_KEY` (optional for now, but needed for full AI agent features)

## 3. Initialize Database

```bash
python -c "from models.database import init_db; init_db()"
```

## 4. Load Sample Data

```bash
python setup_sample_data.py
```

This creates 50 crew members and 200 flights for testing.

## 5. Start the API Server

```bash
python main.py
```

Or with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 6. Test the API

Visit http://localhost:8000/docs for interactive API documentation.

Or test with curl:
```bash
# Health check
curl http://localhost:8000/api/v1/health

# List crew members
curl http://localhost:8000/api/v1/crew

# Compare systems (requires crew_id=1)
curl -X POST http://localhost:8000/api/v1/compare \
  -H "Content-Type: application/json" \
  -d '{
    "crew_member_id": 1,
    "period_start": "2024-01-01T00:00:00",
    "period_end": "2024-01-31T23:59:59"
  }'
```

## 7. Run the Demo Script

In a new terminal:
```bash
cd demo
python demo_script.py
```

Make sure the API server is running first!

## Troubleshooting

**Database connection errors:**
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- For Neon, make sure SSL is enabled

**No crew members found:**
- Run `python setup_sample_data.py` to create sample data

**API not responding:**
- Check the server is running on port 8000
- Check for errors in the server logs
- Verify environment variables are set
