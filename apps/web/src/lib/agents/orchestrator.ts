/**
 * Agent Orchestrator - Coordinates all agents in the Maritime Crew Operating System
 */

import { CrewMatchAgent } from "./crew-match-agent";
import { CertGuardianAgent } from "./cert-guardian-agent";
import { AgentType, AgentMessageType } from "./types";

export class AgentOrchestrator {
  private agents: Map<AgentType, any> = new Map();

  constructor() {
    // Initialize all agents
    this.agents.set(AgentType.CREW_MATCH, new CrewMatchAgent());
    this.agents.set(AgentType.CERT_GUARDIAN, new CertGuardianAgent());
    // Add other agents as they are implemented
  }

  /**
   * Get an agent by type
   */
  getAgent(agentType: AgentType): any {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not found`);
    }
    return agent;
  }

  /**
   * Process a crew assignment request
   */
  async processCrewAssignment(request: any): Promise<any> {
    const agent = this.getAgent(AgentType.CREW_MATCH);
    return await agent.findOptimalCrewAssignment(request);
  }

  /**
   * Process certificate expiry check
   */
  async processCertificateExpiryCheck(days: number = 180): Promise<any> {
    const agent = this.getAgent(AgentType.CERT_GUARDIAN);
    return await agent.checkExpiringCertificates(days);
  }

  /**
   * Generate certificate expiry alerts
   */
  async generateCertificateAlerts(): Promise<any> {
    const agent = this.getAgent(AgentType.CERT_GUARDIAN);
    return await agent.generateExpiryAlerts();
  }

  /**
   * Plan certificate renewal
   */
  async planCertificateRenewal(certificateId: string): Promise<any> {
    const agent = this.getAgent(AgentType.CERT_GUARDIAN);
    return await agent.planCertificateRenewal(certificateId);
  }

  /**
   * Get status of all agents
   */
  async getAllAgentStatuses(): Promise<any[]> {
    const statuses = await Promise.all(
      Array.from(this.agents.values()).map((agent) => agent.getStatus())
    );
    return statuses;
  }
}

// Singleton instance
let orchestratorInstance: AgentOrchestrator | null = null;

export function getOrchestrator(): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator();
  }
  return orchestratorInstance;
}
