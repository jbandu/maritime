/**
 * Base Agent Class for Maritime Crew Operating System
 * All agents extend this base class
 */

import { AgentType, AgentMessage, AgentMessageType, AgentMessagePriority } from "./types";
import { prisma } from "@/lib/db";

export abstract class BaseAgent {
  protected agentId: string;
  protected agentType: AgentType;
  protected name: string;

  constructor(agentId: string, agentType: AgentType, name: string) {
    this.agentId = agentId;
    this.agentType = agentType;
    this.name = name;
  }

  /**
   * Send a message to another agent or the system
   */
  protected async sendMessage(
    messageType: AgentMessageType,
    payload: Record<string, any>,
    priority: AgentMessagePriority = AgentMessagePriority.MEDIUM,
    requestingAgent?: string
  ): Promise<string> {
    const message: AgentMessage = {
      agent_id: this.agentId,
      timestamp: new Date().toISOString(),
      message_type: messageType,
      payload,
      priority,
      requesting_agent: requestingAgent,
    };

    // Store message in database
    const stored = await prisma.agentMessage.create({
      data: {
        agentId: this.agentId,
        agentType: this.agentType,
        messageType: messageType,
        priority: priority,
        payload: payload as any,
        requestingAgent: requestingAgent,
        status: "pending",
      },
    });

    return stored.id;
  }

  /**
   * Process incoming messages
   */
  protected async processMessage(messageId: string): Promise<any> {
    const message = await prisma.agentMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error(`Message ${messageId} not found`);
    }

    try {
      const result = await this.handleMessage(message.payload as any);
      
      // Update message status
      await prisma.agentMessage.update({
        where: { id: messageId },
        data: {
          status: "processed",
          processedAt: new Date(),
          response: result as any,
        },
      });

      return result;
    } catch (error: any) {
      // Update message with error
      await prisma.agentMessage.update({
        where: { id: messageId },
        data: {
          status: "error",
          processedAt: new Date(),
          error: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * Abstract method to handle messages - must be implemented by subclasses
   */
  protected abstract handleMessage(payload: any): Promise<any>;

  /**
   * Get agent status
   */
  async getStatus(): Promise<{
    agentId: string;
    agentType: AgentType;
    name: string;
    status: "active" | "inactive" | "error";
    lastActivity?: Date;
    pendingMessages: number;
  }> {
    const pendingCount = await prisma.agentMessage.count({
      where: {
        agentType: this.agentType,
        status: "pending",
      },
    });

    const lastMessage = await prisma.agentMessage.findFirst({
      where: {
        agentType: this.agentType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      agentId: this.agentId,
      agentType: this.agentType,
      name: this.name,
      status: "active",
      lastActivity: lastMessage?.createdAt || undefined,
      pendingMessages: pendingCount,
    };
  }

  /**
   * Log agent activity
   */
  protected async logActivity(action: string, details?: Record<string, any>): Promise<void> {
    console.log(`[${this.name}] ${action}`, details || {});
    // Could also store in database for audit trail
  }
}
