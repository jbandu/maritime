/**
 * Maritime Crew Operating System - Agent Types & Communication Protocol
 * Based on the Multi-Agent Architecture Specification
 */

export enum AgentType {
  CREW_MATCH = "crew_match",
  ROTATION_PLANNER = "rotation_planner",
  FATIGUE_GUARDIAN = "fatigue_guardian",
  CERT_GUARDIAN = "cert_guardian",
  TRAVEL_COORDINATOR = "travel_coordinator",
  EMERGENCY_CREW = "emergency_crew",
}

export enum AgentMessageType {
  REQUEST_ASSIGNMENT = "request_assignment",
  RESPONSE_ASSIGNMENT = "response_assignment",
  ALERT = "alert",
  NOTIFICATION = "notification",
  STATUS_UPDATE = "status_update",
}

export enum AgentMessagePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface AgentMessage {
  agent_id: string;
  timestamp: string;
  message_type: AgentMessageType;
  payload: Record<string, any>;
  priority: AgentMessagePriority;
  requesting_agent?: string;
}

export interface CrewAssignmentRequest {
  vessel_id: string;
  rank: string;
  required_date: string;
  port: string;
  requirements: {
    certificates: string[];
    experience_years: number;
    vessel_type: string;
  };
}

export interface CrewAssignmentResponse {
  candidates: CrewCandidate[];
  assignment_id?: string;
  status: "success" | "partial" | "failed";
  message?: string;
}

export interface CrewCandidate {
  crew_id: string;
  employee_id: string;
  name: string;
  total_score: number;
  technical_score: number;
  performance_score: number;
  cost_score: number;
  preference_score: number;
  continuity_score: number;
  risk_assessment: {
    level: "low" | "medium" | "high";
    factors: string[];
  };
  availability: {
    available_from: string;
    conflicts: string[];
  };
}

export interface CertificateExpiryAlert {
  crew_id: string;
  certificate_id: string;
  certificate_type: string;
  expiry_date: string;
  days_remaining: number;
  severity: "info" | "low" | "medium" | "high" | "critical" | "blocker";
  recommended_action: string;
}

export interface RestHourViolation {
  crew_id: string;
  contract_id: string;
  violation_date: string;
  violation_type: "minimum_rest" | "excessive_split" | "minimum_continuous_rest" | "weekly_rest";
  severity: "high" | "medium" | "low";
  actual: number;
  required: number;
  shortfall?: number;
}

export interface FatigueRiskScore {
  crew_id: string;
  contract_id: string;
  score: number; // 0-100
  sleep_debt: number;
  circadian_disruption: number;
  lookback_days: number;
  risk_level: "low" | "medium" | "high" | "critical";
}

export interface RotationPlan {
  vessel_id: string;
  planning_period_start: string;
  planning_period_end: string;
  crew_changes: CrewChange[];
  total_cost: number;
  confidence_level: number;
  risk_assessment: {
    schedule_uncertainty: number;
    port_availability: number;
    crew_availability: number;
  };
}

export interface CrewChange {
  sign_off_crew_id: string;
  sign_on_crew_id: string;
  rank: string;
  sign_off_date: string;
  sign_on_date: string;
  port: string;
  estimated_cost: number;
  travel_arrangements?: TravelArrangement;
}

export interface TravelArrangement {
  origin: string;
  destination: string;
  departure_date: string;
  arrival_date: string;
  flights: FlightSegment[];
  hotels: HotelBooking[];
  total_cost: number;
  visa_status: string;
}

export interface FlightSegment {
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  airline: string;
  cabin_class: string;
}

export interface HotelBooking {
  hotel_name: string;
  location: string;
  check_in: string;
  check_out: string;
  cost: number;
}

export interface EmergencyReplacementRequest {
  vessel_id: string;
  outgoing_crew_id: string;
  outgoing_rank: string;
  emergency_type: "medical" | "family" | "visa" | "behavioral" | "covid" | "other";
  severity: "immediate" | "high" | "medium" | "low";
  vessel_position?: {
    latitude: number;
    longitude: number;
  };
  next_port?: string;
  required_arrival_date?: string;
}

export interface EmergencyReplacementResponse {
  replacement_crew_id: string;
  replacement_rank: string;
  travel_arrangements: TravelArrangement;
  estimated_arrival: string;
  cost_premium: number;
  status: "confirmed" | "pending" | "failed";
}
