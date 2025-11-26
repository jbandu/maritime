import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const performanceSchema = z.object({
  crewId: z.string().min(1),
  contractId: z.string().optional(),
  evaluatorId: z.string().min(1),
  evaluationDate: z.string(),
  technicalScore: z.number().min(1).max(5),
  softSkillsScore: z.number().min(1).max(5),
  safetyScore: z.number().min(1).max(5),
  comments: z.string().optional(),
  recommendations: z.string().optional(),
});

function calculateOverallRating(
  technical: number,
  softSkills: number,
  safety: number
): "excellent" | "good" | "satisfactory" | "needs_improvement" | "unsatisfactory" {
  const average = (technical + softSkills + safety) / 3;

  if (average >= 4.5) return "excellent";
  if (average >= 3.5) return "good";
  if (average >= 2.5) return "satisfactory";
  if (average >= 1.5) return "needs_improvement";
  return "unsatisfactory";
}

// GET /api/crew/performance - Get performance evaluations
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const crewId = searchParams.get("crewId");
    const contractId = searchParams.get("contractId");
    const overallRating = searchParams.get("overallRating");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (crewId) where.crewId = crewId;
    if (contractId) where.contractId = contractId;
    if (overallRating) where.overallRating = overallRating;

    if (startDate || endDate) {
      where.evaluationDate = {};
      if (startDate) where.evaluationDate.gte = new Date(startDate);
      if (endDate) where.evaluationDate.lte = new Date(endDate);
    }

    const [evaluations, total] = await Promise.all([
      prisma.crewPerformance.findMany({
        where,
        include: {
          crew: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
            },
          },
          contract: {
            include: {
              vessel: {
                select: {
                  id: true,
                  vesselName: true,
                  imoNumber: true,
                },
              },
            },
          },
        },
        orderBy: { evaluationDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.crewPerformance.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        evaluations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching performance evaluations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch performance evaluations",
      },
      { status: 500 }
    );
  }
}

// POST /api/crew/performance - Create performance evaluation
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = performanceSchema.parse(body);

    // Check if crew exists
    const crew = await prisma.crewMaster.findUnique({
      where: { id: validatedData.crewId },
    });

    if (!crew) {
      return NextResponse.json(
        {
          success: false,
          error: "Crew member not found",
        },
        { status: 404 }
      );
    }

    // If contractId provided, validate it
    if (validatedData.contractId) {
      const contract = await prisma.crewContract.findUnique({
        where: { id: validatedData.contractId },
      });

      if (!contract) {
        return NextResponse.json(
          {
            success: false,
            error: "Contract not found",
          },
          { status: 404 }
        );
      }

      if (contract.crewId !== validatedData.crewId) {
        return NextResponse.json(
          {
            success: false,
            error: "Contract does not belong to this crew member",
          },
          { status: 400 }
        );
      }
    }

    const overallRating = calculateOverallRating(
      validatedData.technicalScore,
      validatedData.softSkillsScore,
      validatedData.safetyScore
    );

    const evaluation = await prisma.crewPerformance.create({
      data: {
        crewId: validatedData.crewId,
        contractId: validatedData.contractId || null,
        evaluatorId: validatedData.evaluatorId,
        evaluationDate: new Date(validatedData.evaluationDate),
        technicalScore: validatedData.technicalScore,
        softSkillsScore: validatedData.softSkillsScore,
        safetyScore: validatedData.safetyScore,
        overallRating: overallRating,
        comments: validatedData.comments,
        recommendations: validatedData.recommendations,
      },
      include: {
        crew: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
          },
        },
        contract: {
          include: {
            vessel: {
              select: {
                id: true,
                vesselName: true,
                imoNumber: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          evaluation,
          message: "Performance evaluation created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    console.error("Error creating performance evaluation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create performance evaluation",
      },
      { status: 500 }
    );
  }
}
