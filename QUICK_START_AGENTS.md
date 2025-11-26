# Quick Start Guide - AI Agent System

## Prerequisites

1. Database migrations applied
2. Prisma client generated
3. Environment variables configured

## Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter database db:generate

# Run migrations (if not already done)
pnpm --filter database db:migrate
```

## Using the Agents

### 1. Crew Assignment (CrewMatchAI)

Find optimal crew for a vessel position:

```typescript
import { getOrchestrator } from "@/lib/agents/orchestrator";

const orchestrator = getOrchestrator();

const result = await orchestrator.processCrewAssignment({
  vessel_id: "vessel_123",
  rank: "chief_engineer",
  required_date: "2025-12-15T00:00:00Z",
  port: "SGSIN",
  requirements: {
    certificates: ["COC_CLASS_I", "STCW_BASIC"],
    experience_years: 5,
    vessel_type: "Container"
  }
});

console.log("Top candidates:", result.candidates);
```

### 2. Certificate Expiry Management (CertGuardianAI)

Check expiring certificates:

```typescript
const orchestrator = getOrchestrator();

// Check certificates expiring in next 180 days
const expiring = await orchestrator.processCertificateExpiryCheck(180);

// Generate alerts for all certificates
const alerts = await orchestrator.generateCertificateAlerts();

// Plan renewal for a specific certificate
const renewalPlan = await orchestrator.planCertificateRenewal("cert_123");
```

### 3. Agent Status

Check status of all agents:

```typescript
const orchestrator = getOrchestrator();
const statuses = await orchestrator.getAllAgentStatuses();

statuses.forEach(status => {
  console.log(`${status.name}: ${status.status}`);
  console.log(`Pending messages: ${status.pendingMessages}`);
});
```

## API Usage

### Crew Assignment

```bash
POST /api/agents/crew-match
Content-Type: application/json

{
  "vessel_id": "vessel_123",
  "rank": "chief_engineer",
  "required_date": "2025-12-15T00:00:00Z",
  "port": "SGSIN",
  "requirements": {
    "certificates": ["COC_CLASS_I"],
    "experience_years": 5,
    "vessel_type": "Container"
  }
}
```

### Certificate Expiry Check

```bash
GET /api/agents/cert-guardian/expiring?days=180
```

### Certificate Alerts

```bash
GET /api/agents/cert-guardian/alerts
```

### Plan Certificate Renewal

```bash
POST /api/agents/cert-guardian/renewal
Content-Type: application/json

{
  "certificate_id": "cert_123"
}
```

### Agent Status

```bash
GET /api/agents/status
```

## Example: Complete Crew Assignment Workflow

```typescript
import { getOrchestrator } from "@/lib/agents/orchestrator";

async function assignCrewToVessel() {
  const orchestrator = getOrchestrator();

  // 1. Find optimal crew
  const assignment = await orchestrator.processCrewAssignment({
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

  if (assignment.status === "success" && assignment.candidates.length > 0) {
    const topCandidate = assignment.candidates[0];
    
    console.log(`Best match: ${topCandidate.name}`);
    console.log(`Score: ${topCandidate.total_score}`);
    console.log(`Risk: ${topCandidate.risk_assessment.level}`);

    // 2. Check certificate validity
    const certAlerts = await orchestrator.generateCertificateAlerts();
    const crewCertAlerts = certAlerts.filter(
      alert => alert.crew_id === topCandidate.crew_id
    );

    if (crewCertAlerts.some(alert => alert.severity === "critical")) {
      console.warn("Warning: Crew has critical certificate alerts");
    }

    // 3. Create assignment record (manual step - to be automated)
    // await createCrewContract(...)
  }
}
```

## Error Handling

```typescript
try {
  const result = await orchestrator.processCrewAssignment(request);
} catch (error) {
  if (error.message.includes("Vessel not found")) {
    // Handle vessel not found
  } else if (error.message.includes("No eligible crew")) {
    // Handle no eligible crew
  } else {
    // Handle other errors
    console.error("Agent error:", error);
  }
}
```

## Testing

Test the agents in development:

```bash
# Start development server
pnpm dev

# Test crew assignment
curl -X POST http://localhost:3000/api/agents/crew-match \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "vessel_id": "test_vessel",
    "rank": "chief_engineer",
    "required_date": "2025-12-15T00:00:00Z",
    "port": "SGSIN",
    "requirements": {
      "certificates": ["COC_CLASS_I"],
      "experience_years": 5,
      "vessel_type": "Container"
    }
  }'
```

## Next Steps

1. Review `AGENT_SYSTEM.md` for detailed documentation
2. Check `IMPLEMENTATION_SUMMARY.md` for what's implemented
3. Implement remaining agents (Rotation Planner, Fatigue Guardian, etc.)
4. Add ML models for enhanced predictions
5. Integrate external APIs (flight booking, etc.)

## Troubleshooting

**Issue:** Agent returns no candidates
- Check that crew members exist in database
- Verify certificates are valid
- Check availability dates

**Issue:** Certificate alerts not generating
- Verify certificate expiry dates are set correctly
- Check certificate status is not "revoked"
- Ensure crew records exist

**Issue:** Agent status shows errors
- Check database connection
- Verify Prisma client is generated
- Check agent message table exists
