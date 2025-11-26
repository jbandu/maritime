# API Documentation

Complete API reference for the Maritime Crew Management System.

## Table of Contents

1. [Frontend API Routes (Next.js)](#frontend-api-routes-nextjs)
2. [Backend API Routes (FastAPI)](#backend-api-routes-fastapi)
3. [Authentication](#authentication)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)

---

## Frontend API Routes (Next.js)

All frontend API routes are located in `apps/web/src/app/api/` and require authentication unless otherwise specified.

### Authentication

#### Register User

**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "clx123...",
    "email": "user@example.com"
  }
}
```

**Errors**:
- `400`: Invalid input data
- `409`: Email already exists

---

#### NextAuth Endpoints

**Endpoint**: `/api/auth/[...nextauth]`

**Description**: NextAuth.js authentication endpoints (login, logout, session, etc.)

**Endpoints**:
- `POST /api/auth/signin`: Sign in
- `POST /api/auth/signout`: Sign out
- `GET /api/auth/session`: Get current session
- `GET /api/auth/csrf`: Get CSRF token

See [NextAuth.js documentation](https://next-auth.js.org/getting-started/rest-api) for details.

---

### Certificates

#### List Certificates

**Endpoint**: `GET /api/certificates`

**Description**: Get list of certificates with optional filtering

**Query Parameters**:
- `status` (optional): Filter by status (`valid`, `expiring_soon`, `expired`, `revoked`)
- `crewId` (optional): Filter by crew member ID
- `skip` (optional): Pagination offset (default: 0)
- `take` (optional): Number of results (default: 50)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cert_123",
      "crewId": "crew_456",
      "certificateType": {
        "code": "COC_CLASS_I",
        "name": "Certificate of Competency Class I"
      },
      "certificateNumber": "COC-12345",
      "issueDate": "2023-01-15T00:00:00Z",
      "expiryDate": "2028-01-15T00:00:00Z",
      "status": "valid",
      "verificationStatus": "verified"
    }
  ],
  "total": 100
}
```

---

#### Get Certificate

**Endpoint**: `GET /api/certificates/[id]`

**Description**: Get detailed certificate information

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cert_123",
    "crewId": "crew_456",
    "crew": {
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe"
    },
    "certificateType": {
      "code": "COC_CLASS_I",
      "name": "Certificate of Competency Class I"
    },
    "certificateNumber": "COC-12345",
    "issueDate": "2023-01-15T00:00:00Z",
    "expiryDate": "2028-01-15T00:00:00Z",
    "documentUrl": "https://...",
    "status": "valid",
    "verificationStatus": "verified"
  }
}
```

---

#### Create Certificate

**Endpoint**: `POST /api/certificates`

**Description**: Create a new certificate

**Request Body**:
```json
{
  "crewId": "crew_456",
  "certificateTypeId": "type_123",
  "certificateNumber": "COC-12345",
  "issueDate": "2023-01-15T00:00:00Z",
  "expiryDate": "2028-01-15T00:00:00Z",
  "documentUrl": "https://..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cert_123",
    ...
  }
}
```

---

#### Update Certificate

**Endpoint**: `PUT /api/certificates/[id]`

**Description**: Update certificate information

**Request Body**:
```json
{
  "expiryDate": "2028-06-15T00:00:00Z",
  "status": "expiring_soon"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cert_123",
    ...
  }
}
```

---

#### Get Expiring Certificates

**Endpoint**: `GET /api/certificates/expiring`

**Description**: Get certificates expiring within specified days

**Query Parameters**:
- `days` (optional): Days ahead to check (default: 90)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cert_123",
      "crew": {
        "employeeId": "EMP001",
        "name": "John Doe"
      },
      "certificateType": {
        "code": "COC_CLASS_I",
        "name": "Certificate of Competency Class I"
      },
      "expiryDate": "2025-12-15T00:00:00Z",
      "daysUntilExpiry": 45,
      "status": "expiring_soon"
    }
  ]
}
```

---

#### Get Certificate Types

**Endpoint**: `GET /api/certificates/types`

**Description**: Get list of all certificate types

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "type_123",
      "code": "COC_CLASS_I",
      "name": "Certificate of Competency Class I",
      "category": "Competency",
      "validityPeriodMonths": 60,
      "mandatory": true
    }
  ]
}
```

---

#### Upload Certificate Document

**Endpoint**: `POST /api/certificates/upload`

**Description**: Upload certificate document file

**Request**: Multipart form data
- `file`: Certificate document file
- `certificateId`: Certificate ID

**Response**:
```json
{
  "success": true,
  "data": {
    "documentUrl": "https://storage.example.com/certificates/cert_123.pdf"
  }
}
```

---

### Crew

#### List Crew Members

**Endpoint**: `GET /api/crew`

**Description**: Get list of crew members

**Query Parameters**:
- `status` (optional): Filter by status (`active`, `inactive`, `on_leave`, `terminated`)
- `skip` (optional): Pagination offset
- `take` (optional): Number of results

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "crew_123",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1985-05-15T00:00:00Z",
      "nationality": "Philippines",
      "email": "john.doe@example.com",
      "phone": "+63 912 345 6789",
      "status": "active"
    }
  ],
  "total": 50
}
```

---

### Dashboard

#### Get Dashboard Statistics

**Endpoint**: `GET /api/dashboard/stats`

**Description**: Get dashboard statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "totalCrew": 150,
    "activeContracts": 45,
    "expiringCertificates": 12,
    "pendingAssignments": 5,
    "complianceAlerts": 3
  }
}
```

---

#### Get Dashboard Alerts

**Endpoint**: `GET /api/dashboard/alerts`

**Description**: Get system alerts

**Query Parameters**:
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `critical`)
- `limit` (optional): Number of alerts (default: 20)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "alert_123",
      "type": "certificate_expiry",
      "priority": "high",
      "message": "Certificate COC_CLASS_I for EMP001 expires in 30 days",
      "crewId": "crew_456",
      "createdAt": "2025-11-24T10:00:00Z"
    }
  ]
}
```

---

#### Get Recent Activity

**Endpoint**: `GET /api/dashboard/activity`

**Description**: Get recent system activity

**Query Parameters**:
- `limit` (optional): Number of activities (default: 20)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "activity_123",
      "type": "certificate_created",
      "description": "Certificate COC_CLASS_I created for EMP001",
      "userId": "user_123",
      "createdAt": "2025-11-24T09:00:00Z"
    }
  ]
}
```

---

### AI Agents

#### Crew Assignment Request

**Endpoint**: `POST /api/agents/crew-match`

**Description**: Find optimal crew members for a vessel position

**Request Body**:
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

**Response**:
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

---

#### Check Expiring Certificates

**Endpoint**: `GET /api/agents/cert-guardian/expiring`

**Description**: Check certificates expiring within specified days

**Query Parameters**:
- `days` (optional): Days ahead to check (default: 180)

**Response**:
```json
{
  "success": true,
  "data": {
    "expiring_certificates": [
      {
        "certificate_id": "cert_123",
        "crew_id": "crew_456",
        "crew_name": "John Doe",
        "certificate_type": "COC_CLASS_I",
        "expiry_date": "2025-12-15T00:00:00Z",
        "days_until_expiry": 21
      }
    ],
    "total": 15
  }
}
```

---

#### Generate Certificate Alerts

**Endpoint**: `GET /api/agents/cert-guardian/alerts`

**Description**: Generate certificate expiry alerts

**Response**:
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "certificate_id": "cert_123",
        "crew_id": "crew_456",
        "crew_name": "John Doe",
        "certificate_type": "COC_CLASS_I",
        "expiry_date": "2025-12-15T00:00:00Z",
        "days_until_expiry": 21,
        "severity": "high",
        "alert_level": "30_days",
        "recommended_action": "Schedule renewal course immediately"
      }
    ],
    "total": 15
  }
}
```

---

#### Plan Certificate Renewal

**Endpoint**: `POST /api/agents/cert-guardian/renewal`

**Description**: Plan certificate renewal

**Request Body**:
```json
{
  "certificate_id": "cert_123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "renewal_plan": {
      "id": "plan_123",
      "certificate_id": "cert_123",
      "crew_id": "crew_456",
      "renewal_date": "2025-12-01T00:00:00Z",
      "training_center": "Maritime Training Center",
      "training_location": "Manila, Philippines",
      "estimated_cost": 5000.00,
      "travel_cost": 1200.00,
      "status": "planned"
    }
  }
}
```

---

#### Get Agent Status

**Endpoint**: `GET /api/agents/status`

**Description**: Get status of all agents

**Response**:
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
    },
    {
      "agentId": "cert_guardian_001",
      "agentType": "cert_guardian",
      "name": "CertGuardianAI",
      "status": "active",
      "lastActivity": "2025-11-24T10:25:00Z",
      "pendingMessages": 2
    }
  ]
}
```

---

## Backend API Routes (FastAPI)

Backend API routes are located at `/api/v1` and provide additional functionality for crew pay processing and system comparison.

### Health Check

**Endpoint**: `GET /api/v1/health`

**Description**: System health check

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-24T10:00:00Z",
  "database": "connected",
  "agents_available": true,
  "mainframe_available": true
}
```

---

### Crew Members

#### List Crew Members

**Endpoint**: `GET /api/v1/crew`

**Query Parameters**:
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Number of results (default: 100)
- `position` (optional): Filter by position

**Response**: Array of crew member objects

---

#### Get Crew Member

**Endpoint**: `GET /api/v1/crew/{crew_id}`

**Response**: Crew member object

---

### Mainframe Processing

#### Process Single Crew Member

**Endpoint**: `POST /api/v1/mainframe/process`

**Request Body**:
```json
{
  "crew_member_id": 1,
  "period_start": "2025-11-01T00:00:00Z",
  "period_end": "2025-11-30T00:00:00Z",
  "system": "mainframe"
}
```

**Response**: Payroll calculation result

---

#### Batch Process All Crew

**Endpoint**: `POST /api/v1/mainframe/batch`

**Request Body**:
```json
{
  "period_start": "2025-11-01T00:00:00Z",
  "period_end": "2025-11-30T00:00:00Z",
  "system": "mainframe",
  "simulate_delay": true
}
```

**Response**: Batch processing statistics

---

### AI Agent Processing

#### Process Single Crew Member

**Endpoint**: `POST /api/v1/ai-agent/process`

**Request Body**:
```json
{
  "crew_member_id": 1,
  "period_start": "2025-11-01T00:00:00Z",
  "period_end": "2025-11-30T00:00:00Z",
  "system": "ai_agent"
}
```

**Response**: Payroll calculation result with AI explanation

---

#### Batch Process All Crew

**Endpoint**: `POST /api/v1/ai-agent/batch`

**Request Body**:
```json
{
  "period_start": "2025-11-01T00:00:00Z",
  "period_end": "2025-11-30T00:00:00Z",
  "system": "ai_agent"
}
```

**Response**: Batch processing statistics

---

### Comparison

#### Compare Systems

**Endpoint**: `POST /api/v1/compare`

**Request Body**:
```json
{
  "crew_member_id": 1,
  "period_start": "2025-11-01T00:00:00Z",
  "period_end": "2025-11-30T00:00:00Z"
}
```

**Response**: Side-by-side comparison of mainframe vs AI agent results

---

## Authentication

### Frontend API Authentication

Frontend API routes use NextAuth.js session-based authentication:

1. User logs in via `/api/auth/signin`
2. Session token stored in HTTP-only cookie
3. API routes check session via `getServerSession()`
4. Unauthenticated requests return `401 Unauthorized`

### Backend API Authentication

Backend API routes currently do not require authentication (for demo purposes). In production, implement API key or OAuth2 authentication.

---

## Request/Response Formats

### Request Format

- **Content-Type**: `application/json` for JSON requests
- **Multipart**: `multipart/form-data` for file uploads
- **Query Parameters**: Standard URL query parameters

### Response Format

Standard response format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error response format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

---

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (resource already exists)
- `500`: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Detailed error message",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `DATABASE_ERROR`: Database operation failed
- `AGENT_ERROR`: AI agent processing error

---

## Rate Limiting

Currently not implemented. Consider implementing rate limiting for production:

- API routes: 100 requests per minute per IP
- Agent endpoints: 10 requests per minute per user

---

## API Versioning

- Frontend API: No versioning (Next.js routes)
- Backend API: Versioned via URL path (`/api/v1/...`)

Future versions will use `/api/v2/...` etc.

---

## OpenAPI Documentation

Backend API includes auto-generated OpenAPI documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

**Last Updated**: November 2025
