# Maritime Crew Management System - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Application](#frontend-application)
6. [Backend Services](#backend-services)
7. [Database Schema](#database-schema)
8. [AI Agent System](#ai-agent-system)
9. [Authentication & Authorization](#authentication--authorization)
10. [API Endpoints](#api-endpoints)
11. [Components](#components)
12. [Setup & Installation](#setup--installation)
13. [Deployment](#deployment)
14. [Development Workflow](#development-workflow)
15. [Testing](#testing)
16. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **Maritime Crew Management System** is a comprehensive platform for managing maritime crew operations, certificates, contracts, and compliance. The system combines traditional web application architecture with AI-powered agent workflows to automate crew assignment, certificate management, and operational planning.

### Key Features

- **Crew Management**: Complete crew member profiles, employment history, and status tracking
- **Certificate Management**: Track crew certificates, expiry dates, and renewal planning
- **Contract Management**: Manage crew contracts, assignments, and vessel assignments
- **AI Agent System**: Automated crew matching, certificate monitoring, and compliance checking
- **Dashboard**: Real-time insights into crew operations, alerts, and statistics
- **Compliance Tracking**: MLC 2006 rest hour compliance, STCW certificate validation
- **Travel Coordination**: Automated travel arrangements for crew sign-on/sign-off
- **Emergency Management**: Rapid crew replacement workflows

### Use Cases

- Maritime crewing companies managing large fleets
- Ship operators requiring compliance monitoring
- Crew agencies coordinating assignments
- Vessel operators planning rotations

---

## Architecture

### System Architecture

The system follows a **monorepo architecture** with separate frontend and backend applications:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │   API Routes │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  AI Agents     │                       │
│                    │  Orchestrator  │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                    ┌───────▼────────┐                       │
│                    │   Backend API  │                       │
│                    │   (FastAPI)    │                       │
│                    └───────┬────────┘                       │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │   PostgreSQL   │                       │
│                    │   (Neon/DB)    │                       │
│                    └────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Monorepo Structure

The project uses **Turborepo** for monorepo management and **pnpm** for package management:

- **apps/web**: Next.js 14 frontend application
- **packages/database**: Prisma schema and database package
- **packages/ui**: Shared UI components
- **backend**: Python FastAPI backend service

---

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form + Zod validation
- **Package Manager**: pnpm
- **Build Tool**: Turborepo

### Backend

- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy
- **API Documentation**: OpenAPI/Swagger (auto-generated)
- **Testing**: pytest
- **AI Framework**: LangGraph (for agent orchestration)
- **LLM**: Anthropic Claude (via API)

### Database

- **Database**: PostgreSQL (Neon recommended)
- **ORM**: Prisma (frontend), SQLAlchemy (backend)
- **Migrations**: Prisma Migrate

### Infrastructure

- **Deployment**: Railway
- **Package Management**: pnpm workspaces
- **Monorepo**: Turborepo

---

## Project Structure

```
maritime-crew-system/
├── apps/
│   └── web/                          # Next.js frontend application
│       ├── src/
│       │   ├── app/                  # Next.js App Router pages
│       │   │   ├── (auth)/          # Authentication routes
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── (dashboard)/      # Protected dashboard routes
│       │   │   │   ├── dashboard/
│       │   │   │   ├── certificates/
│       │   │   │   └── crew/
│       │   │   ├── api/              # API routes
│       │   │   │   ├── agents/      # AI agent endpoints
│       │   │   │   ├── auth/        # Authentication endpoints
│       │   │   │   ├── certificates/ # Certificate management
│       │   │   │   ├── crew/        # Crew management
│       │   │   │   └── dashboard/   # Dashboard data
│       │   │   └── layout.tsx       # Root layout
│       │   ├── components/          # React components
│       │   │   ├── certificates/    # Certificate components
│       │   │   ├── layout/          # Layout components
│       │   │   └── ui/              # UI primitives (shadcn)
│       │   ├── lib/                 # Utility libraries
│       │   │   ├── agents/          # AI agent system
│       │   │   │   ├── base-agent.ts
│       │   │   │   ├── crew-match-agent.ts
│       │   │   │   ├── cert-guardian-agent.ts
│       │   │   │   ├── orchestrator.ts
│       │   │   │   └── types.ts
│       │   │   ├── auth/            # Authentication utilities
│       │   │   ├── db.ts            # Prisma client
│       │   │   └── utils.ts         # General utilities
│       │   └── types/               # TypeScript type definitions
│       ├── public/                  # Static assets
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── database/                    # Database package
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Prisma schema
│   │   ├── index.ts                 # Package exports
│   │   └── package.json
│   └── ui/                          # Shared UI components
│       ├── index.ts
│       └── package.json
│
├── backend/                         # Python FastAPI backend
│   ├── api/                         # API routes and schemas
│   │   ├── routes.py                # FastAPI routes
│   │   ├── schemas.py               # Pydantic models
│   │   └── dependencies.py          # Shared dependencies
│   ├── agents/                      # AI agent system (Python)
│   │   ├── orchestrator.py          # LangGraph orchestrator
│   │   └── __init__.py
│   ├── models/                      # Database models
│   │   ├── database.py              # SQLAlchemy models
│   │   └── __init__.py
│   ├── mainframe/                   # Mainframe simulation
│   │   ├── batch_processor.py
│   │   └── data_loader.py
│   ├── comparison/                  # Comparison logic
│   │   └── analyzer.py
│   ├── tests/                       # Test suite
│   ├── main.py                      # FastAPI application
│   ├── requirements.txt
│   └── README.md
│
├── demo/                            # Demo scripts and presentations
│   ├── demo_script.py
│   ├── presentation_script.md
│   └── dashboard.html
│
├── .env.example                     # Environment variables template
├── package.json                     # Root package.json
├── pnpm-workspace.yaml              # pnpm workspace config
├── turbo.json                       # Turborepo config
├── README.md                        # Main README
├── AGENT_SYSTEM.md                  # AI agent system docs
├── QUICK_START_AGENTS.md            # Quick start guide
├── IMPLEMENTATION_SUMMARY.md        # Implementation status
└── CREW_PAY_SYSTEM.md               # Crew pay system docs
```

---

## Frontend Application

### Next.js App Router Structure

The frontend uses Next.js 14's App Router with route groups for organization:

- `(auth)`: Public authentication routes (login, register)
- `(dashboard)`: Protected dashboard routes requiring authentication
- `api`: API route handlers (Next.js API routes)

### Key Features

#### Authentication

- **NextAuth.js** integration with credentials provider
- JWT-based session management
- Protected routes via middleware
- Password hashing with bcryptjs

#### State Management

- **React Query** for server state management
- Automatic caching and refetching
- Optimistic updates support

#### UI Components

- **shadcn/ui** component library
- Tailwind CSS for styling
- Responsive design
- Accessible components (Radix UI)

### Pages

1. **Dashboard** (`/dashboard`): Main dashboard with statistics and activity
2. **Certificates** (`/certificates`): Certificate management interface
3. **Crew** (`/crew`): Crew member management
4. **Login** (`/login`): User authentication
5. **Register** (`/register`): User registration

---

## Backend Services

### Python FastAPI Backend

The backend provides RESTful APIs for:

- Crew member management
- Payroll processing (mainframe simulation)
- AI agent processing
- System comparison

### Key Modules

#### API Routes (`api/routes.py`)

- `/api/v1/crew`: Crew member endpoints
- `/api/v1/mainframe/process`: Mainframe payroll processing
- `/api/v1/ai-agent/process`: AI agent payroll processing
- `/api/v1/compare`: System comparison endpoint
- `/api/v1/health`: Health check

#### Mainframe Simulation (`mainframe/`)

Simulates legacy batch processing system:
- Batch payroll processing
- Sequential processing with delays
- Rule-based calculations

#### AI Agent System (`agents/`)

LangGraph-based agent orchestration:
- Multi-agent coordination
- Real-time processing
- Intelligent decision making

---

## Database Schema

### Core Models

#### User Management
- **User**: System users (email, password, role)

#### Crew Management
- **CrewMaster**: Crew member profiles (employee ID, personal info, status)
- **CrewContract**: Employment contracts (vessel, rank, dates, wages)
- **CrewAssignment**: AI-generated assignment recommendations

#### Certificate Management
- **CertificateType**: Certificate definitions (code, name, validity period)
- **CrewCertificate**: Crew member certificates (issue/expiry dates, status)
- **CertificateRenewalPlan**: Automated renewal planning

#### Vessel Management
- **Vessel**: Vessel information (IMO number, type, flag state, status)

#### Compliance & Planning
- **RestHourRecord**: Daily rest hour tracking (MLC 2006 compliance)
- **WeeklyRestSummary**: Weekly compliance summaries
- **RotationPlan**: 6-month rotation planning data

#### Travel & Emergency
- **CrewTravel**: Travel arrangements (flights, hotels, visas)
- **EmergencyReplacement**: Emergency crew replacement records

#### Agent System
- **AgentMessage**: Inter-agent communication storage

### Relationships

- CrewMaster → CrewCertificate (one-to-many)
- CrewMaster → CrewContract (one-to-many)
- CrewContract → RestHourRecord (one-to-many)
- Vessel → CrewContract (one-to-many)
- CertificateType → CrewCertificate (one-to-many)

### Indexes

Key indexes for performance:
- Crew status, employee ID
- Certificate expiry dates, status
- Contract dates, status
- Vessel IMO numbers
- Agent message types, priorities

See `DATABASE_SCHEMA.md` for detailed schema documentation.

---

## AI Agent System

### Architecture

The AI agent system implements a multi-agent architecture where specialized agents handle different aspects of crew operations.

#### Agent Types

1. **CrewMatchAI** (`crew_match`): Intelligent crew-to-vessel matching
2. **RotationPlannerAI** (`rotation_planner`): 6-month ahead rotation planning
3. **FatigueGuardianAI** (`fatigue_guardian`): MLC 2006 rest hour compliance
4. **CertGuardianAI** (`cert_guardian`): Certificate expiry tracking
5. **TravelCoordinatorAI** (`travel_coordinator`): Automated travel arrangements
6. **EmergencyCrewAI** (`emergency_crew`): Rapid emergency replacement

### Implemented Agents

#### CrewMatchAI

**Purpose**: Find optimal crew members for vessel positions

**Features**:
- Multi-criteria scoring (technical, performance, cost, preferences, continuity)
- Eligibility filtering (certificates, availability, experience)
- Risk assessment
- Top 5 candidate ranking

**API**: `POST /api/agents/crew-match`

**Scoring Weights**:
- Technical Competency: 30%
- Performance History: 25%
- Cost Efficiency: 20%
- Crew Preferences: 15%
- Operational Continuity: 10%

#### CertGuardianAI

**Purpose**: Proactive certificate expiry tracking and renewal planning

**Features**:
- Multi-level alert system (180/90/60/30/14/0 days)
- Automatic renewal planning
- Cost optimization
- Integration with contract schedules

**API Endpoints**:
- `GET /api/agents/cert-guardian/expiring?days=180`
- `GET /api/agents/cert-guardian/alerts`
- `POST /api/agents/cert-guardian/renewal`

**Alert Thresholds**:
- 180 days: Info - Plan renewal
- 90 days: Low - Schedule course
- 60 days: Medium - Confirm booking
- 30 days: High - Urgent action
- 14 days: Critical - Emergency renewal
- 0 days: Blocker - Unfit for service

### Agent Communication

Agents communicate through a standardized message format stored in the database:

```typescript
{
  agent_id: string;
  timestamp: string;
  message_type: "request_assignment" | "response_assignment" | "alert" | "notification" | "status_update";
  payload: Record<string, any>;
  priority: "low" | "medium" | "high" | "critical";
  requesting_agent?: string;
}
```

### Agent Orchestrator

The `AgentOrchestrator` class manages all agents:
- Centralized agent registration
- Request routing
- Status monitoring
- Singleton pattern for global access

See `AGENT_SYSTEM.md` for detailed agent documentation.

---

## Authentication & Authorization

### NextAuth.js Configuration

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Password Hashing**: bcryptjs
- **Protected Routes**: Middleware-based route protection

### User Roles

- `user`: Standard user access
- `admin`: Administrative access (future implementation)

### Session Management

- JWT tokens stored in HTTP-only cookies
- Session data includes user ID and role
- Automatic token refresh

### Protected Routes

Routes under `(dashboard)` require authentication:
- `/dashboard`
- `/certificates`
- `/crew`

Public routes:
- `/login`
- `/register`
- `/` (redirects to dashboard)

---

## API Endpoints

### Frontend API Routes (Next.js)

#### Authentication
- `POST /api/auth/register`: User registration
- `POST /api/auth/[...nextauth]`: NextAuth endpoints

#### Certificates
- `GET /api/certificates`: List certificates
- `GET /api/certificates/[id]`: Get certificate details
- `POST /api/certificates`: Create certificate
- `PUT /api/certificates/[id]`: Update certificate
- `GET /api/certificates/expiring`: Get expiring certificates
- `GET /api/certificates/types`: Get certificate types
- `POST /api/certificates/upload`: Upload certificate document

#### Crew
- `GET /api/crew`: List crew members

#### Dashboard
- `GET /api/dashboard/stats`: Dashboard statistics
- `GET /api/dashboard/alerts`: System alerts
- `GET /api/dashboard/activity`: Recent activity

#### AI Agents
- `POST /api/agents/crew-match`: Crew assignment request
- `GET /api/agents/cert-guardian/expiring`: Check expiring certificates
- `GET /api/agents/cert-guardian/alerts`: Generate certificate alerts
- `POST /api/agents/cert-guardian/renewal`: Plan certificate renewal
- `GET /api/agents/status`: Get all agent statuses

### Backend API Routes (FastAPI)

#### Health
- `GET /api/v1/health`: System health check

#### Crew Members
- `GET /api/v1/crew`: List crew members
- `GET /api/v1/crew/{id}`: Get crew member details

#### Mainframe Processing
- `POST /api/v1/mainframe/process`: Process single crew member
- `POST /api/v1/mainframe/batch`: Batch process all crew

#### AI Agent Processing
- `POST /api/v1/ai-agent/process`: Process single crew member
- `POST /api/v1/ai-agent/batch`: Process all crew members

#### Comparison
- `POST /api/v1/compare`: Compare mainframe vs AI agent systems

See `API_DOCUMENTATION.md` for detailed API documentation.

---

## Components

### Certificate Components

- **CertificateCard**: Display certificate information
- **CertificateTable**: Tabular certificate listing
- **CertificateForm**: Create/edit certificate form
- **CertificateFilters**: Filter certificates by status, type, etc.
- **StatusBadge**: Visual status indicator

### Layout Components

- **Header**: Top navigation bar
- **Sidebar**: Side navigation menu

### UI Components (shadcn/ui)

- **Button**: Button component
- **Card**: Card container
- **Input**: Form input
- **Select**: Dropdown select
- **Table**: Data table
- **Badge**: Status badge
- **DropdownMenu**: Dropdown menu

See `COMPONENTS.md` for detailed component documentation.

---

## Setup & Installation

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database (Neon recommended)
- Python 3.9+ (for backend)

### Installation Steps

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Application URL (e.g., `http://localhost:3000`)

4. **Generate Prisma Client**
   ```bash
   pnpm --filter database prisma generate
   ```

5. **Run database migrations**
   ```bash
   pnpm --filter database prisma migrate dev
   ```

6. **Seed the database (optional)**
   ```bash
   pnpm --filter database prisma db seed
   ```

7. **Start development server**
   ```bash
   pnpm dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Backend Setup (Optional)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Set:
   - `DATABASE_URL`: PostgreSQL connection string
   - `ANTHROPIC_API_KEY`: Anthropic API key (for AI agents)

4. **Initialize database**
   ```bash
   python -c "from models.database import init_db; init_db()"
   ```

5. **Start FastAPI server**
   ```bash
   python main.py
   ```

See `DEVELOPMENT_GUIDE.md` for detailed development setup.

---

## Deployment

### Railway Deployment

The project is configured for Railway deployment:

1. **Create Railway project** and connect GitHub repository

2. **Add PostgreSQL service** (or use external Neon database)

3. **Set environment variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate secret
   - `NEXTAUTH_URL`: Railway app URL

4. **Configure build**:
   - Root directory: `/`
   - Build command: `pnpm install && pnpm build`
   - Start command: `cd apps/web && pnpm start`

5. **Run migrations** (one-time):
   ```bash
   railway run pnpm --filter @maritime-crew-system/database db:push
   ```

### Environment Variables

**Frontend (.env.local)**:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

**Backend (.env)**:
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=...
PORT=8000
```

---

## Development Workflow

### Running Commands

- `pnpm dev`: Start all apps in development mode
- `pnpm build`: Build all apps
- `pnpm lint`: Lint all packages
- `pnpm format`: Format code with Prettier
- `pnpm type-check`: Type check all packages

### Database Commands

- `pnpm --filter database db:migrate`: Run migrations
- `pnpm --filter database db:generate`: Generate Prisma Client
- `pnpm --filter database db:studio`: Open Prisma Studio
- `pnpm --filter database db:seed`: Seed database

### Code Organization

- **Frontend**: TypeScript strict mode, ESLint + Prettier
- **Backend**: Python with type hints, pytest for testing
- **Database**: Prisma schema with migrations

### Git Workflow

- Feature branches for new features
- Pull requests for code review
- Commit messages follow conventional commits

---

## Testing

### Frontend Testing

- Unit tests: Component testing (to be implemented)
- Integration tests: API route testing (to be implemented)
- E2E tests: Playwright/Cypress (to be implemented)

### Backend Testing

- Unit tests: `pytest tests/`
- API tests: FastAPI TestClient
- Database tests: SQLAlchemy test fixtures

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests (when implemented)
pnpm test
```

---

## Troubleshooting

### Common Issues

#### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check database is accessible
- Ensure SSL settings match database provider

#### Prisma Client Errors

- Run `pnpm --filter database prisma generate`
- Clear `.next` cache: `rm -rf apps/web/.next`

#### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches application URL
- Clear browser cookies

#### Build Errors

- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear Turborepo cache: `pnpm turbo clean`
- Check TypeScript errors: `pnpm type-check`

### Getting Help

- Check existing documentation files
- Review error messages in console/logs
- Check database migrations status
- Verify environment variables

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

## License

Private - All rights reserved

---

**Last Updated**: November 2025  
**Version**: 1.0.0
