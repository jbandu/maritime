import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const schedulingSchema = z.object({
  vesselId: z.string().min(1),
  rank: z.string(),
  assignedCrewId: z.string().optional().nullable(),
  assignmentStart: z.string(),
  assignmentEnd: z.string(),
  crewChangePort: z.string().optional(),
  estimatedCost: z.number().optional(),
  notes: z.string().optional(),
});

// GET /api/crew/scheduling - Get crew scheduling/rotation plans
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const vesselId = searchParams.get("vesselId");
    const rank = searchParams.get("rank");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const assignedCrewId = searchParams.get("assignedCrewId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (vesselId) where.vesselId = vesselId;
    if (rank) where.rank = rank;
    if (status) where.status = status;
    if (assignedCrewId) where.assignedCrewId = assignedCrewId;

    if (startDate || endDate) {
      where.OR = [];
      if (startDate && endDate) {
        // Overlapping date range
        where.OR.push(
          {
            assignmentStart: { lte: new Date(endDate) },
            assignmentEnd: { gte: new Date(startDate) },
          }
        );
      } else if (startDate) {
        where.assignmentEnd = { gte: new Date(startDate) };
      } else if (endDate) {
        where.assignmentStart = { lte: new Date(endDate) };
      }
    }

    const [schedules, total] = await Promise.all([
      prisma.crewScheduling.findMany({
        where,
        include: {
          vessel: {
            select: {
              id: true,
              vesselName: true,
              imoNumber: true,
              vesselType: true,
            },
          },
          crew: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              nationality: true,
            },
          },
        },
        orderBy: { assignmentStart: "asc" },
        skip,
        take: limit,
      }),
      prisma.crewScheduling.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        schedules,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching crew schedules:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch crew schedules",
      },
      { status: 500 }
    );
  }
}

// POST /api/crew/scheduling - Create new crew schedule/rotation plan
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = schedulingSchema.parse(body);

    // Validate dates
    const assignmentStart = new Date(validatedData.assignmentStart);
    const assignmentEnd = new Date(validatedData.assignmentEnd);

    if (assignmentEnd <= assignmentStart) {
      return NextResponse.json(
        {
          success: false,
          error: "Assignment end date must be after start date",
        },
        { status: 400 }
      );
    }

    // Validate vessel exists
    const vessel = await prisma.vessel.findUnique({
      where: { id: validatedData.vesselId },
    });

    if (!vessel) {
      return NextResponse.json(
        {
          success: false,
          error: "Vessel not found",
        },
        { status: 404 }
      );
    }

    // If crew is assigned, validate crew exists and check availability
    if (validatedData.assignedCrewId) {
      const crew = await prisma.crewMaster.findUnique({
        where: { id: validatedData.assignedCrewId },
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

      // Check for overlapping assignments
      const overlapping = await prisma.crewScheduling.findFirst({
        where: {
          assignedCrewId: validatedData.assignedCrewId,
          status: { not: "cancelled" },
          OR: [
            {
              assignmentStart: { lte: assignmentEnd },
              assignmentEnd: { gte: assignmentStart },
            },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          {
            success: false,
            error: "Crew member has overlapping assignment",
          },
          { status: 400 }
        );
      }
    }

    const schedule = await prisma.crewScheduling.create({
      data: {
        vesselId: validatedData.vesselId,
        rank: validatedData.rank as any,
        assignedCrewId: validatedData.assignedCrewId || null,
        assignmentStart,
        assignmentEnd,
        crewChangePort: validatedData.crewChangePort,
        estimatedCost: validatedData.estimatedCost,
        notes: validatedData.notes,
        status: "planned",
      },
      include: {
        vessel: {
          select: {
            id: true,
            vesselName: true,
            imoNumber: true,
          },
        },
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
          schedule,
          message: "Crew schedule created successfully",
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

    console.error("Error creating crew schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create crew schedule",
      },
      { status: 500 }
    );
  }
}
