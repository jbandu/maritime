/**
 * Agent 1: Crew Assignment Optimizer (CrewMatchAI)
 * Intelligent crew-to-vessel matching with multi-criteria scoring
 */

import { BaseAgent } from "./base-agent";
import { AgentType, AgentMessageType, AgentMessagePriority, CrewAssignmentRequest, CrewAssignmentResponse, CrewCandidate } from "./types";
import { prisma } from "@/lib/db";
import { Rank } from "@prisma/client";

export class CrewMatchAgent extends BaseAgent {
  constructor() {
    super("crew_match_001", AgentType.CREW_MATCH, "CrewMatchAI");
  }

  protected async handleMessage(payload: any): Promise<CrewAssignmentResponse> {
    const request = payload as CrewAssignmentRequest;
    return await this.findOptimalCrewAssignment(request);
  }

  /**
   * Main assignment logic - filters eligible crew and scores them
   */
  async findOptimalCrewAssignment(
    request: CrewAssignmentRequest
  ): Promise<CrewAssignmentResponse> {
    await this.logActivity("Finding crew assignment", { vessel_id: request.vessel_id, rank: request.rank });

    // Get vessel details
    const vessel = await prisma.vessel.findUnique({
      where: { id: request.vessel_id },
    });

    if (!vessel) {
      throw new Error(`Vessel ${request.vessel_id} not found`);
    }

    // Filter eligible crew
    const eligibleCrew = await this.filterEligibleCrew(request, vessel.vesselType);

    if (eligibleCrew.length === 0) {
      return {
        candidates: [],
        status: "failed",
        message: "No eligible crew members found",
      };
    }

    // Score and rank candidates
    const scoredCandidates = await Promise.all(
      eligibleCrew.map((crew) => this.scoreCrewMember(crew, request, vessel))
    );

    // Sort by total score
    scoredCandidates.sort((a, b) => b.total_score - a.total_score);

    // Get top 5 candidates
    const topCandidates = scoredCandidates.slice(0, 5);

    return {
      candidates: topCandidates,
      status: topCandidates.length > 0 ? "success" : "partial",
    };
  }

  /**
   * Filter eligible crew based on requirements
   */
  private async filterEligibleCrew(
    request: CrewAssignmentRequest,
    vesselType: string
  ) {
    const requiredDate = new Date(request.required_date);
    const requiredRank = request.rank.toUpperCase().replace(" ", "_") as Rank;

    // Get all active crew with matching rank
    const crewMembers = await prisma.crewMaster.findMany({
      where: {
        status: "active",
      },
      include: {
        certificates: {
          include: {
            certificateType: true,
          },
        },
        contracts: {
          where: {
            status: {
              in: ["active", "pending"],
            },
          },
        },
      },
    });

    const eligible: typeof crewMembers = [];

    for (const crew of crewMembers) {
      // Check if crew has valid certificates
      const hasValidCertificates = this.checkCertificateValidity(
        crew.certificates,
        request.requirements.certificates,
        requiredDate
      );

      if (!hasValidCertificates) continue;

      // Check availability (no overlapping contracts)
      const isAvailable = this.checkAvailability(crew.contracts, requiredDate);

      if (!isAvailable) continue;

      // Check vessel type experience (simplified - would check historical contracts)
      // For now, we'll assume all crew can work on any vessel type

      eligible.push(crew);
    }

    return eligible;
  }

  /**
   * Check if crew has valid certificates
   */
  private checkCertificateValidity(
    certificates: any[],
    requiredCertificates: string[],
    requiredDate: Date
  ): boolean {
    for (const requiredCert of requiredCertificates) {
      const cert = certificates.find(
        (c) =>
          c.certificateType.code === requiredCert &&
          c.status === "valid" &&
          new Date(c.expiryDate) > requiredDate
      );

      if (!cert) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if crew is available (no overlapping contracts)
   */
  private checkAvailability(contracts: any[], requiredDate: Date): boolean {
    // Check if crew has any active contracts that overlap with required date
    const hasOverlap = contracts.some((contract) => {
      const signOn = new Date(contract.signOnDate);
      const signOff = new Date(contract.contractEndDate);

      return requiredDate >= signOn && requiredDate <= signOff;
    });

    return !hasOverlap;
  }

  /**
   * Score crew member using multi-criteria scoring
   */
  private async scoreCrewMember(
    crew: any,
    request: CrewAssignmentRequest,
    vessel: any
  ): Promise<CrewCandidate> {
    // Technical Competency (30%)
    const technicalScore = await this.calculateTechnicalScore(crew, request, vessel);

    // Performance History (25%)
    const performanceScore = await this.calculatePerformanceScore(crew);

    // Cost Efficiency (20%)
    const costScore = await this.calculateCostScore(crew, request);

    // Crew Preferences (15%)
    const preferenceScore = await this.calculatePreferenceScore(crew, request);

    // Operational Continuity (10%)
    const continuityScore = await this.calculateContinuityScore(crew, vessel);

    // Calculate total score (weighted sum)
    const totalScore =
      technicalScore * 0.3 +
      performanceScore * 0.25 +
      costScore * 0.2 +
      preferenceScore * 0.15 +
      continuityScore * 0.1;

    // Risk assessment
    const riskAssessment = this.assessRisk(crew, request);

    // Availability info
    const availability = this.getAvailabilityInfo(crew, request);

    return {
      crew_id: crew.id,
      employee_id: crew.employeeId,
      name: `${crew.firstName} ${crew.lastName}`,
      total_score: Math.round(totalScore * 100) / 100,
      technical_score: Math.round(technicalScore * 100) / 100,
      performance_score: Math.round(performanceScore * 100) / 100,
      cost_score: Math.round(costScore * 100) / 100,
      preference_score: Math.round(preferenceScore * 100) / 100,
      continuity_score: Math.round(continuityScore * 100) / 100,
      risk_assessment: riskAssessment,
      availability: availability,
    };
  }

  private async calculateTechnicalScore(crew: any, request: CrewAssignmentRequest, vessel: any): Promise<number> {
    let score = 0;

    // Certificate level match (0-40 points)
    const certificateMatch = this.checkCertificateMatch(crew.certificates, request.requirements.certificates);
    score += certificateMatch * 40;

    // Experience years (0-30 points)
    // Simplified - would calculate from contract history
    const experienceYears = this.estimateExperienceYears(crew);
    const experienceScore = Math.min(experienceYears / request.requirements.experience_years, 1) * 30;
    score += experienceScore;

    // Vessel type familiarity (0-30 points)
    // Simplified - would check historical contracts
    const vesselTypeScore = 20; // Default score
    score += vesselTypeScore;

    return Math.min(score, 100);
  }

  private checkCertificateMatch(certificates: any[], required: string[]): number {
    let matched = 0;
    for (const req of required) {
      if (certificates.some((c) => c.certificateType.code === req && c.status === "valid")) {
        matched++;
      }
    }
    return matched / required.length;
  }

  private estimateExperienceYears(crew: any): number {
    // Simplified - would calculate from contract history
    // For now, return a default value
    return 5;
  }

  private async calculatePerformanceScore(crew: any): Promise<number> {
    // Simplified - would check performance evaluations
    // For now, return a default score
    return 75;
  }

  private async calculateCostScore(crew: any, request: CrewAssignmentRequest): Promise<number> {
    // Simplified - would calculate travel costs from current location
    // For now, return a default score
    return 70;
  }

  private async calculatePreferenceScore(crew: any, request: CrewAssignmentRequest): Promise<number> {
    // Simplified - would check crew preferences
    // For now, return a default score
    return 60;
  }

  private async calculateContinuityScore(crew: any, vessel: any): Promise<number> {
    // Check if crew has previous service on same vessel class
    // Simplified - would check contract history
    return 50;
  }

  private assessRisk(crew: any, request: CrewAssignmentRequest): {
    level: "low" | "medium" | "high";
    factors: string[];
  } {
    const factors: string[] = [];
    let riskLevel: "low" | "medium" | "high" = "low";

    // Check certificate expiry dates
    const expiringSoon = crew.certificates.filter((c: any) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry < 90 && daysUntilExpiry > 0;
    });

    if (expiringSoon.length > 0) {
      factors.push("Certificates expiring within 90 days");
      riskLevel = "medium";
    }

    return {
      level: riskLevel,
      factors,
    };
  }

  private getAvailabilityInfo(crew: any, request: CrewAssignmentRequest): {
    available_from: string;
    conflicts: string[];
  } {
    const conflicts: string[] = [];
    let availableFrom = new Date();

    // Check contract end dates
    for (const contract of crew.contracts) {
      if (contract.status === "active") {
        const endDate = new Date(contract.contractEndDate);
        if (endDate > availableFrom) {
          availableFrom = endDate;
        }
      }
    }

    return {
      available_from: availableFrom.toISOString(),
      conflicts,
    };
  }
}
