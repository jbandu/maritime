# Database Schema Documentation

Complete database schema documentation for the Maritime Crew Management System.

## Table of Contents

1. [Overview](#overview)
2. [Database Models](#database-models)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Enums](#enums)
6. [Migrations](#migrations)

---

## Overview

The database uses **PostgreSQL** with **Prisma** as the ORM. The schema is defined in `packages/database/prisma/schema.prisma`.

### Database Provider

- **Type**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Via `DATABASE_URL` environment variable

---

## Database Models

### User

**Table**: `users`

**Description**: System users for authentication

**Fields**:
- `id` (String, Primary Key, CUID): Unique user ID
- `email` (String, Unique): User email address
- `password` (String): Hashed password (bcrypt)
- `role` (String, Default: "user"): User role (user, admin)
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes**: None (email is unique)

---

### CrewMaster

**Table**: `crew_masters`

**Description**: Crew member master data

**Fields**:
- `id` (String, Primary Key, CUID): Unique crew ID
- `employeeId` (String, Unique): Employee ID number
- `firstName` (String): First name
- `lastName` (String): Last name
- `dateOfBirth` (DateTime): Date of birth
- `nationality` (String): Nationality
- `email` (String?, Unique): Email address (optional)
- `phone` (String?): Phone number (optional)
- `status` (CrewStatus, Default: active): Crew status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- One-to-many with `CrewCertificate`
- One-to-many with `CrewContract`
- One-to-many with `CrewAssignment`
- One-to-many with `CertificateRenewalPlan`
- One-to-many with `CrewTravel`

**Indexes**:
- `status`: For filtering by crew status
- `employeeId`: For quick lookup by employee ID

---

### CertificateType

**Table**: `certificate_types`

**Description**: Certificate type definitions

**Fields**:
- `id` (String, Primary Key, CUID): Unique certificate type ID
- `code` (String, Unique): Certificate code (e.g., "COC_CLASS_I")
- `name` (String): Certificate name
- `category` (String): Category (e.g., "Competency", "Safety")
- `validityPeriodMonths` (Int?): Validity period in months
- `mandatory` (Boolean, Default: false): Whether certificate is mandatory
- `description` (String?): Description
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- One-to-many with `CrewCertificate`

**Indexes**:
- `category`: For filtering by category
- `mandatory`: For filtering mandatory certificates

---

### CrewCertificate

**Table**: `crew_certificates`

**Description**: Crew member certificates

**Fields**:
- `id` (String, Primary Key, CUID): Unique certificate ID
- `crewId` (String, Foreign Key): Crew member ID
- `certificateTypeId` (String, Foreign Key): Certificate type ID
- `certificateNumber` (String): Certificate number
- `issueDate` (DateTime): Issue date
- `expiryDate` (DateTime): Expiry date
- `documentUrl` (String?): URL to certificate document
- `verificationStatus` (VerificationStatus, Default: pending): Verification status
- `status` (CertificateStatus, Default: valid): Certificate status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewMaster`
- Many-to-one with `CertificateType`
- One-to-many with `CertificateRenewalPlan`

**Indexes**:
- `crewId`: For filtering by crew member
- `certificateTypeId`: For filtering by certificate type
- `expiryDate`: For expiry date queries
- `status`: For filtering by status
- `verificationStatus`: For filtering by verification status
- Unique constraint: `(crewId, certificateTypeId, certificateNumber)`

---

### Vessel

**Table**: `vessels`

**Description**: Vessel information

**Fields**:
- `id` (String, Primary Key, CUID): Unique vessel ID
- `imoNumber` (String, Unique): IMO number
- `vesselName` (String): Vessel name
- `vesselType` (String): Vessel type (e.g., "Container", "Bulk Carrier")
- `flagState` (String): Flag state
- `grossTonnage` (Float?): Gross tonnage
- `operationalStatus` (VesselStatus, Default: operational): Operational status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- One-to-many with `CrewContract`
- One-to-many with `CrewAssignment`
- One-to-many with `RotationPlan`
- One-to-many with `EmergencyReplacement`

**Indexes**:
- `imoNumber`: For quick lookup by IMO number
- `operationalStatus`: For filtering by status

---

### CrewContract

**Table**: `crew_contracts`

**Description**: Crew employment contracts

**Fields**:
- `id` (String, Primary Key, CUID): Unique contract ID
- `crewId` (String, Foreign Key): Crew member ID
- `vesselId` (String, Foreign Key): Vessel ID
- `rank` (Rank): Crew rank
- `signOnDate` (DateTime): Sign-on date
- `contractEndDate` (DateTime): Contract end date
- `status` (ContractStatus, Default: active): Contract status
- `basicWage` (Float?): Basic wage
- `signOnPort` (String?): Sign-on port
- `signOffPort` (String?): Sign-off port
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewMaster`
- Many-to-one with `Vessel`
- One-to-many with `RestHourRecord`
- One-to-many with `CrewTravel`

**Indexes**:
- `crewId`: For filtering by crew member
- `vesselId`: For filtering by vessel
- `status`: For filtering by contract status
- `contractEndDate`: For contract expiry queries

---

### AgentMessage

**Table**: `agent_messages`

**Description**: Inter-agent communication messages

**Fields**:
- `id` (String, Primary Key, CUID): Unique message ID
- `agentId` (String): Agent ID
- `agentType` (AgentType): Type of agent
- `messageType` (AgentMessageType): Message type
- `priority` (AgentMessagePriority, Default: medium): Message priority
- `payload` (Json): Message payload (JSON)
- `requestingAgent` (String?): ID of requesting agent
- `status` (String, Default: "pending"): Message status
- `response` (Json?): Response payload (JSON)
- `createdAt` (DateTime): Creation timestamp
- `processedAt` (DateTime?): Processing timestamp
- `error` (String?): Error message if processing failed

**Relationships**: None

**Indexes**:
- `agentId`: For filtering by agent
- `agentType`: For filtering by agent type
- `messageType`: For filtering by message type
- `priority`: For filtering by priority
- `status`: For filtering by status
- `createdAt`: For chronological queries

---

### CrewAssignment

**Table**: `crew_assignments`

**Description**: AI-generated crew assignment recommendations

**Fields**:
- `id` (String, Primary Key, CUID): Unique assignment ID
- `crewId` (String, Foreign Key): Crew member ID
- `vesselId` (String, Foreign Key): Vessel ID
- `rank` (Rank): Required rank
- `requiredDate` (DateTime): Required date
- `port` (String): Port location
- `assignmentScore` (Float?): Overall assignment score
- `technicalScore` (Float?): Technical competency score
- `performanceScore` (Float?): Performance history score
- `costScore` (Float?): Cost efficiency score
- `preferenceScore` (Float?): Crew preference score
- `continuityScore` (Float?): Operational continuity score
- `riskAssessment` (Json?): Risk assessment data (JSON)
- `status` (String, Default: "pending"): Assignment status
- `assignedBy` (String?): Agent ID that created assignment
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewMaster`
- Many-to-one with `Vessel`

**Indexes**:
- `crewId`: For filtering by crew member
- `vesselId`: For filtering by vessel
- `status`: For filtering by status
- `requiredDate`: For date-based queries

---

### RotationPlan

**Table**: `rotation_plans`

**Description**: 6-month rotation planning data

**Fields**:
- `id` (String, Primary Key, CUID): Unique plan ID
- `vesselId` (String, Foreign Key): Vessel ID
- `planningPeriodStart` (DateTime): Planning period start
- `planningPeriodEnd` (DateTime): Planning period end
- `planData` (Json): Rotation schedule data (JSON)
- `costProjection` (Float?): Projected cost
- `confidenceLevel` (Float?): Confidence level (0-1)
- `riskAssessment` (Json?): Risk assessment data (JSON)
- `status` (String, Default: "draft"): Plan status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `Vessel`

**Indexes**:
- `vesselId`: For filtering by vessel
- `planningPeriodStart`: For date-based queries
- `status`: For filtering by status

---

### RestHourRecord

**Table**: `rest_hour_records`

**Description**: Daily rest hour tracking for MLC 2006 compliance

**Fields**:
- `id` (String, Primary Key, CUID): Unique record ID
- `contractId` (String, Foreign Key): Contract ID
- `crewId` (String): Crew member ID (denormalized)
- `recordDate` (DateTime): Record date
- `workHours` (Float): Work hours
- `restHours` (Float): Rest hours
- `restPeriods` (Json): Array of rest periods (JSON)
- `complianceStatus` (String, Default: "compliant"): Compliance status
- `violationType` (String?): Type of violation if non-compliant
- `fatigueRiskScore` (Float?): Fatigue risk score
- `masterApproved` (Boolean, Default: false): Master approval status
- `masterSignature` (String?): Master signature
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewContract`

**Indexes**:
- `contractId`: For filtering by contract
- `crewId`: For filtering by crew member
- `recordDate`: For date-based queries
- `complianceStatus`: For filtering by compliance status

---

### WeeklyRestSummary

**Table**: `weekly_rest_summaries`

**Description**: Weekly rest hour compliance summaries

**Fields**:
- `id` (String, Primary Key, CUID): Unique summary ID
- `contractId` (String): Contract ID
- `crewId` (String): Crew member ID
- `weekStartDate` (DateTime): Week start date
- `totalRestHours` (Float): Total rest hours for week
- `complianceStatus` (String): Compliance status
- `shortfallHours` (Float?): Hours short of requirement
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**: None (denormalized)

**Indexes**:
- `contractId`: For filtering by contract
- `crewId`: For filtering by crew member
- `weekStartDate`: For date-based queries

---

### CertificateRenewalPlan

**Table**: `certificate_renewal_plans`

**Description**: Certificate renewal planning

**Fields**:
- `id` (String, Primary Key, CUID): Unique plan ID
- `certificateId` (String, Foreign Key): Certificate ID
- `crewId` (String, Foreign Key): Crew member ID
- `renewalDate` (DateTime): Planned renewal date
- `trainingCenter` (String?): Training center name
- `trainingLocation` (String?): Training location
- `estimatedCost` (Float?): Estimated cost
- `travelCost` (Float?): Travel cost
- `status` (String, Default: "planned"): Plan status
- `bookedAt` (DateTime?): Booking timestamp
- `completedAt` (DateTime?): Completion timestamp
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewCertificate`
- Many-to-one with `CrewMaster`

**Indexes**:
- `certificateId`: For filtering by certificate
- `crewId`: For filtering by crew member
- `renewalDate`: For date-based queries
- `status`: For filtering by status

---

### CrewTravel

**Table**: `crew_travel`

**Description**: Travel arrangements for crew

**Fields**:
- `id` (String, Primary Key, CUID): Unique travel ID
- `contractId` (String?, Foreign Key): Contract ID (optional)
- `crewId` (String): Crew member ID
- `travelType` (String): Type (sign_on, sign_off, emergency, training)
- `origin` (String): Origin location
- `destination` (String): Destination location
- `departureDate` (DateTime): Departure date
- `arrivalDate` (DateTime?): Arrival date
- `flightDetails` (Json?): Flight details (JSON)
- `hotelDetails` (Json?): Hotel details (JSON)
- `visaStatus` (String?): Visa status
- `totalCost` (Float?): Total travel cost
- `bookingStatus` (String, Default: "pending"): Booking status
- `trackingUrl` (String?): Tracking URL
- `disruptions` (Json?): Disruption information (JSON)
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `CrewContract` (optional)

**Indexes**:
- `crewId`: For filtering by crew member
- `contractId`: For filtering by contract
- `travelType`: For filtering by travel type
- `bookingStatus`: For filtering by booking status
- `departureDate`: For date-based queries

---

### EmergencyReplacement

**Table**: `emergency_replacements`

**Description**: Emergency crew replacement records

**Fields**:
- `id` (String, Primary Key, CUID): Unique replacement ID
- `vesselId` (String, Foreign Key): Vessel ID
- `outgoingCrewId` (String): Outgoing crew member ID
- `outgoingRank` (Rank): Outgoing crew rank
- `emergencyType` (String): Type (medical, family, visa, behavioral, covid)
- `severity` (String): Severity (immediate, high, medium, low)
- `replacementCrewId` (String?): Replacement crew member ID
- `replacementRank` (Rank): Required replacement rank
- `requiredArrivalDate` (DateTime): Required arrival date
- `actualArrivalDate` (DateTime?): Actual arrival date
- `status` (String, Default: "active"): Replacement status
- `costPremium` (Float?): Additional cost premium
- `vesselDelayHours` (Float?): Vessel delay in hours
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships**:
- Many-to-one with `Vessel`

**Indexes**:
- `vesselId`: For filtering by vessel
- `outgoingCrewId`: For filtering by outgoing crew
- `status`: For filtering by status
- `severity`: For filtering by severity

---

## Relationships

### Entity Relationship Diagram

```
User
  └─ (no relationships)

CrewMaster
  ├─→ CrewCertificate (1:N)
  ├─→ CrewContract (1:N)
  ├─→ CrewAssignment (1:N)
  ├─→ CertificateRenewalPlan (1:N)
  └─→ CrewTravel (1:N)

CertificateType
  └─→ CrewCertificate (1:N)

CrewCertificate
  ├─→ CrewMaster (N:1)
  ├─→ CertificateType (N:1)
  └─→ CertificateRenewalPlan (1:N)

Vessel
  ├─→ CrewContract (1:N)
  ├─→ CrewAssignment (1:N)
  ├─→ RotationPlan (1:N)
  └─→ EmergencyReplacement (1:N)

CrewContract
  ├─→ CrewMaster (N:1)
  ├─→ Vessel (N:1)
  ├─→ RestHourRecord (1:N)
  └─→ CrewTravel (1:N)
```

---

## Indexes

### Performance Indexes

Indexes are defined for:
- Foreign keys (automatic in Prisma)
- Frequently queried fields (status, dates)
- Unique constraints (email, employeeId, IMO number)
- Composite indexes for common query patterns

### Query Optimization

Common query patterns optimized:
- Filtering by status (crew, certificates, contracts)
- Date range queries (expiry dates, contract dates)
- Lookups by unique identifiers (employee ID, IMO number)
- Agent message processing (by agent type, priority, status)

---

## Enums

### CrewStatus

- `active`: Active crew member
- `inactive`: Inactive crew member
- `on_leave`: On leave
- `terminated`: Terminated

### CertificateStatus

- `valid`: Certificate is valid
- `expiring_soon`: Expiring soon (within threshold)
- `expired`: Certificate expired
- `revoked`: Certificate revoked

### ContractStatus

- `active`: Active contract
- `completed`: Contract completed
- `terminated`: Contract terminated
- `pending`: Pending contract

### VesselStatus

- `operational`: Vessel operational
- `maintenance`: Under maintenance
- `laid_up`: Laid up
- `decommissioned`: Decommissioned

### Rank

- `master`: Master/Captain
- `chief_engineer`: Chief Engineer
- `chief_officer`: Chief Officer
- `second_officer`: Second Officer
- `third_officer`: Third Officer
- `chief_mate`: Chief Mate
- `second_mate`: Second Mate
- `third_mate`: Third Mate
- `able_seaman`: Able Seaman
- `ordinary_seaman`: Ordinary Seaman
- `oiler`: Oiler
- `wiper`: Wiper
- `cook`: Cook
- `steward`: Steward
- `cadet`: Cadet

### VerificationStatus

- `pending`: Verification pending
- `verified`: Verified
- `rejected`: Rejected

### AgentType

- `crew_match`: Crew matching agent
- `rotation_planner`: Rotation planning agent
- `fatigue_guardian`: Fatigue monitoring agent
- `cert_guardian`: Certificate guardian agent
- `travel_coordinator`: Travel coordination agent
- `emergency_crew`: Emergency crew agent

### AgentMessageType

- `request_assignment`: Assignment request
- `response_assignment`: Assignment response
- `alert`: Alert message
- `notification`: Notification message
- `status_update`: Status update

### AgentMessagePriority

- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority
- `critical`: Critical priority

---

## Migrations

### Running Migrations

```bash
# Create a new migration
pnpm --filter database prisma migrate dev --name migration_name

# Apply migrations
pnpm --filter database prisma migrate deploy

# Reset database (development only)
pnpm --filter database prisma migrate reset
```

### Migration History

Migrations are stored in `packages/database/prisma/migrations/`. Each migration includes:
- SQL schema changes
- Data migrations (if any)
- Rollback scripts

---

## Data Seeding

### Seed Script

Located at `packages/database/prisma/seed.ts`:

```bash
# Run seed script
pnpm --filter database prisma db seed
```

### Seed Data

- Sample users
- Sample crew members
- Sample certificates
- Sample vessels
- Sample contracts

---

## Database Maintenance

### Backup

Regular backups recommended:
- Daily automated backups
- Point-in-time recovery (if supported by provider)
- Export schema and data

### Monitoring

Monitor:
- Query performance
- Index usage
- Connection pool usage
- Database size

### Optimization

- Regular VACUUM and ANALYZE (PostgreSQL)
- Monitor slow queries
- Add indexes for slow queries
- Consider partitioning for large tables

---

**Last Updated**: November 2025
