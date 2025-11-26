/**
 * API Route for Agent Status
 * GET /api/agents/status - Get status of all agents
 */

import { NextResponse } from "next/server";
import { getOrchestrator } from "@/lib/agents/orchestrator";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();

    const orchestrator = getOrchestrator();
    const statuses = await orchestrator.getAllAgentStatuses();

    return NextResponse.json({
      success: true,
      data: statuses,
    });
  } catch (error: any) {
    console.error("Error fetching agent statuses:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch agent statuses",
      },
      { status: 500 }
    );
  }
}
