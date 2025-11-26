# Maritime Crew Operating System - AI Agent Workflows

## Overview

This document describes the AI agent system implementation for the Maritime Crew Scheduling & Management platform. The system implements a multi-agent architecture where specialized agents handle different aspects of crew operations.

## Architecture

### Agent Types

1. **CrewMatchAI** (`crew_match`) - Intelligent crew-to-vessel matching
2. **RotationPlannerAI** (`rotation_planner`) - 6-month ahead rotation planning
3. **FatigueGuardianAI** (`fatigue_guardian`) - MLC 2006 rest hour compliance monitoring
4. **CertGuardianAI** (`cert_guardian`) - Certificate expiry tracking and renewal planning
5. **TravelCoordinatorAI** (`travel_coordinator`) - Automated travel arrangement
6. **EmergencyCrewAI** (`emergency_crew`) - Rapid emergency crew replacement

### Communication Protocol

Agents communicate through a standardized message format:

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

Messages are stored in the database (`agent_messages` table) for audit and processing.

## Implemented Agents

### 1. CrewMatchAI (Agent 1)

**Purpose:** Intelligent crew-to-vessel matching with multi-criteria scoring

**API Endpoint:** `POST /api/agents/crew-match`

**Request Format:**
```json
{
  "vessel_id": "vessel_123",
  "rank": "chief_engineer",
  "required_date": "2025-12-15T00:00:00Z",
  "port": "SGSIN",
  "requirements": {
    "certificates": ["COC_CLASS_I", "STCW_BASIC"],
    "experience_years": 5,
    "vessel_type": "Container"
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "crew_id": "crew_123",
        "employee_id": "EMP001",
        "name": "John Doe",
        "total_score": 85.5,
        "technical_score": 90.0,
        "performance_score": 75.0,
        "cost_score": 70.0,
        "preference_score": 60.0,
        "continuity_score": 50.0,
        "risk_assessment": {
          "level": "low",
          "factors": []
        },
        "availability": {
          "available_from": "2025-12-01T00:00:00Z",
          "conflicts": []
        }
      }
    ],
    "status": "success"
  }
}
```

**Scoring Weights:**
- Technical Competency: 30%
- Performance History: 25%
- Cost Efficiency: 20%
- Crew Preferences: 15%
- Operational Continuity: 10%

### 2. CertGuardianAI (Agent 4)

**Purpose:** Proactive certificate tracking and renewal planning

**API Endpoints:**
- `GET /api/agents/cert-guardian/expiring?days=180` - Check expiring certificates
- `GET /api/agents/cert-guardian/alerts` - Generate expiry alerts
- `POST /api/agents/cert-guardian/renewal` - Plan certificate renewal

**Alert Thresholds:**
- 180 days: Info - Plan renewal
- 90 days: Low - Schedule course
- 60 days: Medium - Confirm booking
- 30 days: High - Urgent action
- 14 days: Critical - Emergency renewal
- 0 days: Blocker - Unfit for service

**Renewal Planning:**
The agent optimizes renewal timing based on:
- Certificate expiry date
- Active contract end dates
- Training center availability
- Travel costs

## Database Schema

### New Models

1. **AgentMessage** - Stores inter-agent communications
2. **CrewAssignment** - Stores crew assignment recommendations
3. **RotationPlan** - Stores rotation planning data
4. **RestHourRecord** - Tracks daily rest hours
5. **WeeklyRestSummary** - Weekly rest hour compliance
6. **CertificateRenewalPlan** - Certificate renewal planning
7. **CrewTravel** - Travel arrangements
8. **EmergencyReplacement** - Emergency crew replacement records

## Usage Examples

### Finding Crew Assignment

```typescript
import { getOrchestrator } from "@/lib/agents/orchestrator";

const orchestrator = getOrchestrator();
const result = await orchestrator.processCrewAssignment({
  vessel_id: "vessel_123",
  rank: "chief_engineer",
  required_date: "2025-12-15T00:00:00Z",
  port: "SGSIN",
  requirements: {
    certificates: ["COC_CLASS_I"],
    experience_years: 5,
    vessel_type: "Container"
  }
});
```

### Checking Certificate Expiry

```typescript
const orchestrator = getOrchestrator();
const result = await orchestrator.processCertificateExpiryCheck(180);
```

### Generating Certificate Alerts

```typescript
const orchestrator = getOrchestrator();
const alerts = await orchestrator.generateCertificateAlerts();
```

## Agent Status

Check the status of all agents:

```bash
GET /api/agents/status
```

Returns:
```json
{
  "success": true,
  "data": [
    {
      "agentId": "crew_match_001",
      "agentType": "crew_match",
      "name": "CrewMatchAI",
      "status": "active",
      "lastActivity": "2025-11-24T10:30:00Z",
      "pendingMessages": 0
    }
  ]
}
```

## Future Implementations

### Agent 2: RotationPlannerAI
- 6-month ahead planning
- Port optimization
- Cost forecasting
- Stochastic modeling for uncertainties

### Agent 3: FatigueGuardianAI
- Daily MLC compliance checking
- Weekly rest hour validation
- Fatigue risk scoring
- Predictive alerts

### Agent 5: TravelCoordinatorAI
- Multi-leg route optimization
- Automated booking
- Real-time tracking
- Disruption handling

### Agent 6: EmergencyCrewAI
- Rapid assessment
- Replacement search
- Expedited travel coordination
- Master coordination

## Development

### Adding a New Agent

1. Create agent class extending `BaseAgent`:
```typescript
import { BaseAgent } from "./base-agent";
import { AgentType } from "./types";

export class MyAgent extends BaseAgent {
  constructor() {
    super("my_agent_001", AgentType.MY_AGENT, "MyAgent");
  }

  protected async handleMessage(payload: any): Promise<any> {
    // Implement agent logic
  }
}
```

2. Register in orchestrator:
```typescript
this.agents.set(AgentType.MY_AGENT, new MyAgent());
```

3. Create API endpoint:
```typescript
// apps/web/src/app/api/agents/my-agent/route.ts
```

## Testing

Run database migrations:
```bash
pnpm --filter database prisma migrate dev
```

Generate Prisma client:
```bash
pnpm --filter database prisma generate
```

## Performance Considerations

- Agents process messages asynchronously
- Database queries are optimized with indexes
- Scoring algorithms are designed for scalability
- Consider caching for frequently accessed data

## Security

- All API endpoints require authentication (`requireAuth`)
- Agent messages are stored for audit purposes
- Sensitive data is not logged in production

## Monitoring

- Agent status is tracked in real-time
- Message processing errors are logged
- Performance metrics can be added to agent status
