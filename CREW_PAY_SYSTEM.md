# Crew Pay Intelligence System

A comprehensive comparison system demonstrating Mainframe vs AI Agent payroll processing for airline crew members.

## Overview

This system was built to demonstrate the capabilities of AI agent-based payroll processing compared to traditional mainframe batch systems. It includes:

1. **Mock Mainframe System** - Simulates legacy batch processing
2. **AI Agent System** - LangGraph multi-agent orchestration (stub implementation)
3. **Comparison API** - Side-by-side comparison endpoints
4. **Test Suite** - Comprehensive testing framework
5. **Demo Script** - Interactive presentation tool

## Project Structure

```
backend/
├── api/                    # FastAPI routes and schemas
│   ├── routes.py           # All API endpoints
│   ├── schemas.py          # Pydantic models
│   └── dependencies.py     # Shared dependencies
├── models/                 # Database models
│   └── database.py         # SQLAlchemy models and session
├── mainframe/              # Mainframe simulation
│   ├── batch_processor.py  # Batch payroll processor
│   └── data_loader.py      # Sample data generator
├── agents/                 # AI agent system
│   └── orchestrator.py     # LangGraph orchestrator (stub)
├── comparison/             # Comparison logic
│   └── analyzer.py         # Comparison analyzer
├── tests/                  # Test suite
│   ├── test_mainframe.py
│   ├── test_ai_agents.py
│   └── test_comparison.py
├── main.py                 # FastAPI application
└── requirements.txt        # Python dependencies

demo/
├── demo_script.py          # Interactive demo script
├── presentation_script.md  # Presentation talking points
└── dashboard.html          # Simple visualization dashboard
```

## Quick Start

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your DATABASE_URL and ANTHROPIC_API_KEY
   ```

3. **Initialize database:**
   ```bash
   python -c "from models.database import init_db; init_db()"
   ```

4. **Load sample data:**
   ```bash
   python backend/setup_sample_data.py
   ```

5. **Start API server:**
   ```bash
   cd backend
   python main.py
   ```

### Run Demo

```bash
cd demo
python demo_script.py
```

## API Endpoints

### Health Check
- `GET /api/v1/health` - System health status

### Crew Members
- `GET /api/v1/crew` - List all crew members
- `GET /api/v1/crew/{id}` - Get specific crew member

### Mainframe Processing
- `POST /api/v1/mainframe/process` - Process single crew member
- `POST /api/v1/mainframe/batch` - Process all crew (batch mode)

### AI Agent Processing
- `POST /api/v1/ai-agent/process` - Process single crew member
- `POST /api/v1/ai-agent/batch` - Process all crew (real-time)

### Comparison
- `POST /api/v1/compare` - Side-by-side comparison

## Railway Deployment

The backend is configured for Railway deployment:

1. **Connect GitHub repo** to Railway
2. **Add PostgreSQL service** (or use external Neon)
3. **Set environment variables:**
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `PORT` (auto-set by Railway)
4. **Deploy!**

The `backend/railway.json` file configures:
- Build: NIXPACKS (auto-detects Python)
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Testing

Run the test suite:
```bash
cd backend
pytest tests/
```

## Features

### Mainframe System
- Simulates overnight batch processing
- Rigid rule-based calculations
- Sequential processing with delays
- Basic error handling

### AI Agent System
- Real-time processing (5-10 seconds)
- Intelligent edge case handling
- Multi-agent orchestration
- Natural language explanations
- Automatic compliance checking

### Comparison System
- Side-by-side analysis
- Performance benchmarking
- Accuracy validation
- Difference detection
- Winner determination
- Recommendations

## Demo Flow

1. **Introduction** - Overview of the problem
2. **Mainframe Demo** - Show legacy system limitations
3. **AI Agent Demo** - Demonstrate modern approach
4. **Comparison** - Side-by-side analysis
5. **ROI Analysis** - Business impact and savings

## Next Steps

To fully implement the AI agent system:

1. **Integrate LangGraph** - Replace stub orchestrator with actual LangGraph agents
2. **Add Anthropic Claude** - Implement real AI agent calls
3. **Enhance Agents** - Build specialized agents for:
   - Flight Time Calculator
   - Per Diem Calculator
   - Premium Pay Calculator
   - Guarantee Calculator
   - Compliance Checker
   - Validator
   - Explainer
4. **Add Monitoring** - Track agent performance and costs
5. **Production Hardening** - Error handling, retries, logging

## Documentation

- **API Docs**: http://localhost:8000/docs (when server is running)
- **Backend README**: `backend/README.md`
- **Quick Start**: `backend/QUICKSTART.md`
- **Presentation Script**: `demo/presentation_script.md`

## License

Private - All rights reserved
