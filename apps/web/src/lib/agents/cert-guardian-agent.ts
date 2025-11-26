/**
 * Agent 4: Certificate Expiry Manager (CertGuardianAI)
 * Proactive certificate tracking and renewal planning
 */

import { BaseAgent } from "./base-agent";
import { AgentType, AgentMessageType, AgentMessagePriority, CertificateExpiryAlert } from "./types";
import { prisma } from "@/lib/db";

export class CertGuardianAgent extends BaseAgent {
  constructor() {
    super("cert_guardian_001", AgentType.CERT_GUARDIAN, "CertGuardianAI");
  }

  protected async handleMessage(payload: any): Promise<any> {
    const action = payload.action;

    switch (action) {
      case "check_expiring":
        return await this.checkExpiringCertificates(payload.days || 180);
      case "generate_alerts":
        return await this.generateExpiryAlerts();
      case "plan_renewal":
        return await this.planCertificateRenewal(payload.certificate_id);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Check for certificates expiring within specified days
   */
  async checkExpiringCertificates(days: number = 180): Promise<{
    expiring: CertificateExpiryAlert[];
    expired: CertificateExpiryAlert[];
  }> {
    await this.logActivity("Checking expiring certificates", { days });

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    // Get expiring certificates
    const expiringCertificates = await prisma.crewCertificate.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: futureDate,
        },
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: true,
        certificateType: true,
      },
    });

    // Get expired certificates
    const expiredCertificates = await prisma.crewCertificate.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: true,
        certificateType: true,
      },
    });

    const expiringAlerts = expiringCertificates.map((cert) =>
      this.createExpiryAlert(cert, false)
    );

    const expiredAlerts = expiredCertificates.map((cert) =>
      this.createExpiryAlert(cert, true)
    );

    return {
      expiring: expiringAlerts,
      expired: expiredAlerts,
    };
  }

  /**
   * Generate expiry alerts with appropriate severity levels
   */
  async generateExpiryAlerts(): Promise<CertificateExpiryAlert[]> {
    await this.logActivity("Generating expiry alerts");

    const now = new Date();
    const allCertificates = await prisma.crewCertificate.findMany({
      where: {
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: true,
        certificateType: true,
      },
    });

    const alerts: CertificateExpiryAlert[] = [];

    for (const cert of allCertificates) {
      const expiryDate = new Date(cert.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Generate alerts at specific thresholds
      const alertThresholds = [180, 90, 60, 30, 14, 0];
      const severityMap: Record<number, CertificateExpiryAlert["severity"]> = {
        180: "info",
        90: "low",
        60: "medium",
        30: "high",
        14: "critical",
        0: "blocker",
      };

      const actionMap: Record<number, string> = {
        180: "plan_renewal",
        90: "schedule_course",
        60: "confirm_booking",
        30: "urgent_action",
        14: "emergency_renewal",
        0: "unfit_for_service",
      };

      for (const threshold of alertThresholds) {
        if (daysUntilExpiry <= threshold && daysUntilExpiry > threshold - 7) {
          // Check if alert already exists for this threshold
          const existingPlan = await prisma.certificateRenewalPlan.findFirst({
            where: {
              certificateId: cert.id,
              status: {
                in: ["planned", "booked"],
              },
            },
          });

          if (!existingPlan || threshold <= 30) {
            // Generate alert
            alerts.push({
              crew_id: cert.crewId,
              certificate_id: cert.id,
              certificate_type: cert.certificateType.name,
              expiry_date: cert.expiryDate.toISOString(),
              days_remaining: daysUntilExpiry,
              severity: daysUntilExpiry < 0 ? "blocker" : severityMap[threshold],
              recommended_action: actionMap[threshold],
            });

            // Send notification if critical
            if (daysUntilExpiry <= 30) {
              await this.sendAlert(cert, daysUntilExpiry, severityMap[threshold] || "high");
            }
          }
          break;
        }
      }
    }

    return alerts;
  }

  /**
   * Plan certificate renewal - optimize timing and location
   */
  async planCertificateRenewal(certificateId: string): Promise<{
    renewal_plan_id: string;
    recommended_date: string;
    training_center?: string;
    estimated_cost: number;
  }> {
    await this.logActivity("Planning certificate renewal", { certificate_id: certificateId });

    const certificate = await prisma.crewCertificate.findUnique({
      where: { id: certificateId },
      include: {
        crew: {
          include: {
            contracts: {
              where: {
                status: "active",
              },
            },
          },
        },
        certificateType: true,
      },
    });

    if (!certificate) {
      throw new Error(`Certificate ${certificateId} not found`);
    }

    // Calculate optimal renewal date (before expiry, after current contract if applicable)
    const expiryDate = new Date(certificate.expiryDate);
    const now = new Date();
    
    let recommendedDate = new Date(expiryDate);
    recommendedDate.setDate(recommendedDate.getDate() - 30); // 30 days before expiry

    // If crew has active contract, plan renewal after contract ends
    if (certificate.crew.contracts.length > 0) {
      const activeContract = certificate.crew.contracts[0];
      const contractEndDate = new Date(activeContract.contractEndDate);
      
      if (contractEndDate < recommendedDate) {
        recommendedDate = new Date(contractEndDate);
        recommendedDate.setDate(recommendedDate.getDate() + 3); // 3 days after contract ends
      }
    }

    // Ensure renewal date is before expiry
    if (recommendedDate >= expiryDate) {
      recommendedDate = new Date(expiryDate);
      recommendedDate.setDate(recommendedDate.getDate() - 14); // At least 14 days before
    }

    // Estimate costs (simplified)
    const estimatedCost = this.estimateRenewalCost(certificate.certificateType.code);
    const travelCost = 0; // Would calculate based on crew location

    // Create renewal plan
    const renewalPlan = await prisma.certificateRenewalPlan.create({
      data: {
        certificateId: certificate.id,
        crewId: certificate.crewId,
        renewalDate: recommendedDate,
        estimatedCost: estimatedCost,
        travelCost: travelCost,
        status: "planned",
      },
    });

    return {
      renewal_plan_id: renewalPlan.id,
      recommended_date: recommendedDate.toISOString(),
      estimated_cost: estimatedCost + travelCost,
    };
  }

  /**
   * Create expiry alert object
   */
  private createExpiryAlert(cert: any, isExpired: boolean): CertificateExpiryAlert {
    const now = new Date();
    const expiryDate = new Date(cert.expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let severity: CertificateExpiryAlert["severity"] = "info";
    let recommendedAction = "plan_renewal";

    if (isExpired || daysUntilExpiry < 0) {
      severity = "blocker";
      recommendedAction = "unfit_for_service";
    } else if (daysUntilExpiry <= 14) {
      severity = "critical";
      recommendedAction = "emergency_renewal";
    } else if (daysUntilExpiry <= 30) {
      severity = "high";
      recommendedAction = "urgent_action";
    } else if (daysUntilExpiry <= 60) {
      severity = "medium";
      recommendedAction = "confirm_booking";
    } else if (daysUntilExpiry <= 90) {
      severity = "low";
      recommendedAction = "schedule_course";
    }

    return {
      crew_id: cert.crewId,
      certificate_id: cert.id,
      certificate_type: cert.certificateType.name,
      expiry_date: cert.expiryDate.toISOString(),
      days_remaining: daysUntilExpiry,
      severity,
      recommended_action: recommendedAction,
    };
  }

  /**
   * Send alert notification
   */
  private async sendAlert(cert: any, daysRemaining: number, severity: string): Promise<void> {
    await this.sendMessage(
      AgentMessageType.ALERT,
      {
        type: "certificate_expiry",
        crew_id: cert.crewId,
        certificate_id: cert.id,
        certificate_type: cert.certificateType.name,
        days_remaining: daysRemaining,
        severity,
      },
      severity === "critical" || severity === "blocker"
        ? AgentMessagePriority.CRITICAL
        : AgentMessagePriority.HIGH
    );
  }

  /**
   * Estimate renewal cost based on certificate type
   */
  private estimateRenewalCost(certificateCode: string): number {
    // Simplified cost estimation
    const costMap: Record<string, number> = {
      COC_CLASS_I: 2000,
      COC_CLASS_II: 1500,
      COC_CLASS_III: 1000,
      STCW_BASIC: 800,
      STCW_ADVANCED: 1200,
      MEDICAL: 200,
      TANKER_OIL: 1000,
      TANKER_CHEMICAL: 1000,
      TANKER_GAS: 1200,
    };

    return costMap[certificateCode] || 500;
  }
}
