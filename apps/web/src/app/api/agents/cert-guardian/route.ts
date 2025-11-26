/**
 * API Route for Certificate Guardian Agent (Agent 4)
 * GET /api/agents/cert-guardian/expiring - Check expiring certificates
 * GET /api/agents/cert-guardian/alerts - Generate expiry alerts
 * POST /api/agents/cert-guardian/renewal - Plan certificate renewal
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrchestrator } from "@/lib/agents/orchestrator";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";

// GET /api/agents/cert-guardian/expiring
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || "expiring";
    const days = parseInt(searchParams.get("days") || "180");

    const orchestrator = getOrchestrator();

    if (action === "alerts") {
      const alerts = await orchestrator.generateCertificateAlerts();
      return NextResponse.json({
        success: true,
        data: alerts,
      });
    } else {
      const result = await orchestrator.processCertificateExpiryCheck(days);
      return NextResponse.json({
        success: true,
        data: result,
      });
    }
  } catch (error: any) {
    console.error("Error processing certificate guardian request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/cert-guardian/renewal
const renewalPlanSchema = z.object({
  certificate_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = renewalPlanSchema.parse(body);

    const orchestrator = getOrchestrator();
    const result = await orchestrator.planCertificateRenewal(validatedData.certificate_id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error planning certificate renewal:", error);

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
        error: error.message || "Failed to plan certificate renewal",
      },
      { status: 500 }
    );
  }
}
