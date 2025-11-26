/**
 * API Route for Crew Match Agent (Agent 1)
 * POST /api/agents/crew-match - Find optimal crew assignment
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrchestrator } from "@/lib/agents/orchestrator";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";

const crewAssignmentRequestSchema = z.object({
  vessel_id: z.string().min(1),
  rank: z.string().min(1),
  required_date: z.string(),
  port: z.string().min(1),
  requirements: z.object({
    certificates: z.array(z.string()),
    experience_years: z.number().min(0),
    vessel_type: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = crewAssignmentRequestSchema.parse(body);

    const orchestrator = getOrchestrator();
    const result = await orchestrator.processCrewAssignment(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error processing crew assignment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process crew assignment",
      },
      { status: 500 }
    );
  }
}
