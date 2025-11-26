import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const trainingSchema = z.object({
  crewId: z.string().min(1),
  courseName: z.string().min(1),
  courseCode: z.string().optional(),
  trainingProvider: z.string().optional(),
  trainingType: z.string().optional(),
  startDate: z.string(),
  completionDate: z.string().optional(),
  certificateUrl: z.string().optional(),
  certificateNumber: z.string().optional(),
  nextRenewalDate: z.string().optional(),
  status: z.string().optional(),
  score: z.number().optional(),
  passGrade: z.number().optional(),
  notes: z.string().optional(),
});

// GET /api/crew/training - Get training records
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const crewId = searchParams.get("crewId");
    const courseName = searchParams.get("courseName");
    const status = searchParams.get("status");
    const trainingType = searchParams.get("trainingType");
    const expiringSoon = searchParams.get("expiringSoon") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (crewId) where.crewId = crewId;
    if (courseName)
      where.courseName = { contains: courseName, mode: "insensitive" };
    if (status) where.status = status;
    if (trainingType) where.trainingType = trainingType;

    if (expiringSoon) {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      where.nextRenewalDate = {
        lte: threeMonthsFromNow,
        gte: new Date(),
      };
    }

    const [trainings, total] = await Promise.all([
      prisma.trainingRecord.findMany({
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
        },
        orderBy: { startDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.trainingRecord.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        trainings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching training records:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch training records",
      },
      { status: 500 }
    );
  }
}

// POST /api/crew/training - Create training record
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = trainingSchema.parse(body);

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

    // Validate dates
    const startDate = new Date(validatedData.startDate);
    let completionDate = validatedData.completionDate
      ? new Date(validatedData.completionDate)
      : null;

    if (completionDate && completionDate < startDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Completion date must be after start date",
        },
        { status: 400 }
      );
    }

    // Determine status if not provided
    let status: "scheduled" | "in_progress" | "completed" | "failed" | "cancelled" =
      validatedData.status as any || "scheduled";

    if (completionDate) {
      if (validatedData.score !== undefined && validatedData.passGrade !== undefined) {
        status = validatedData.score >= validatedData.passGrade ? "completed" : "failed";
      } else {
        status = "completed";
      }
    } else if (new Date() >= startDate) {
      status = "in_progress";
    }

    const training = await prisma.trainingRecord.create({
      data: {
        crewId: validatedData.crewId,
        courseName: validatedData.courseName,
        courseCode: validatedData.courseCode,
        trainingProvider: validatedData.trainingProvider,
        trainingType: validatedData.trainingType,
        startDate: startDate,
        completionDate: completionDate,
        certificateUrl: validatedData.certificateUrl,
        certificateNumber: validatedData.certificateNumber,
        nextRenewalDate: validatedData.nextRenewalDate
          ? new Date(validatedData.nextRenewalDate)
          : null,
        status: status,
        score: validatedData.score,
        passGrade: validatedData.passGrade,
        notes: validatedData.notes,
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          training,
          message: "Training record created successfully",
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

    console.error("Error creating training record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create training record",
      },
      { status: 500 }
    );
  }
}
