import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const workRestHoursSchema = z.object({
  crewId: z.string().min(1),
  vesselId: z.string().min(1),
  recordDate: z.string(),
  workHours: z.number().min(0).max(24),
  restHours: z.number().min(0).max(24),
  overtimeHours: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// MLC 2006 Compliance Rules:
// - Minimum 10 hours rest in any 24-hour period
// - Minimum 77 hours rest in any 7-day period
// - Maximum 14 hours work in any 24-hour period
function checkMLCCompliance(
  workHours: number,
  restHours: number
): { compliant: boolean; status: string; violationType?: string } {
  if (restHours < 10) {
    return {
      compliant: false,
      status: "violation",
      violationType: "MLC_2006_MIN_REST_24H",
    };
  }
  if (workHours > 14) {
    return {
      compliant: false,
      status: "violation",
      violationType: "MLC_2006_MAX_WORK_24H",
    };
  }
  if (restHours >= 10 && restHours < 11) {
    return {
      compliant: true,
      status: "warning",
    };
  }
  return {
    compliant: true,
    status: "compliant",
  };
}

// GET /api/crew/work-rest-hours - Get work/rest hours records
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const crewId = searchParams.get("crewId");
    const vesselId = searchParams.get("vesselId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const complianceStatus = searchParams.get("complianceStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (crewId) where.crewId = crewId;
    if (vesselId) where.vesselId = vesselId;
    if (complianceStatus) where.complianceStatus = complianceStatus;

    if (startDate || endDate) {
      where.recordDate = {};
      if (startDate) where.recordDate.gte = new Date(startDate);
      if (endDate) where.recordDate.lte = new Date(endDate);
    }

    const [records, total] = await Promise.all([
      prisma.workRestHours.findMany({
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
        orderBy: { recordDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.workRestHours.count({ where }),
    ]);

    // Calculate 7-day compliance for each crew member
    const complianceAnalysis = await Promise.all(
      records.map(async (record) => {
        const sevenDaysAgo = new Date(record.recordDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const sevenDayRecords = await prisma.workRestHours.findMany({
          where: {
            crewId: record.crewId,
            vesselId: record.vesselId,
            recordDate: {
              gte: sevenDaysAgo,
              lte: record.recordDate,
            },
          },
        });

        const totalRestHours = sevenDayRecords.reduce(
          (sum, r) => sum + r.restHours,
          0
        );
        const sevenDayCompliant = totalRestHours >= 77;

        return {
          ...record,
          sevenDayRestHours: totalRestHours,
          sevenDayCompliant,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        records: complianceAnalysis,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching work/rest hours:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch work/rest hours",
      },
      { status: 500 }
    );
  }
}

// POST /api/crew/work-rest-hours - Create work/rest hours record
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = workRestHoursSchema.parse(body);

    // Validate work + rest = 24 hours
    const totalHours = validatedData.workHours + validatedData.restHours;
    if (Math.abs(totalHours - 24) > 0.1) {
      return NextResponse.json(
        {
          success: false,
          error: "Work hours + rest hours must equal 24 hours",
        },
        { status: 400 }
      );
    }

    // Check MLC compliance
    const compliance = checkMLCCompliance(
      validatedData.workHours,
      validatedData.restHours
    );

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

    const recordDate = new Date(validatedData.recordDate);
    recordDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if record already exists for this date
    const existing = await prisma.workRestHours.findUnique({
      where: {
        crewId_vesselId_recordDate: {
          crewId: validatedData.crewId,
          vesselId: validatedData.vesselId,
          recordDate: recordDate,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Record already exists for this date",
        },
        { status: 400 }
      );
    }

    const record = await prisma.workRestHours.create({
      data: {
        crewId: validatedData.crewId,
        vesselId: validatedData.vesselId,
        recordDate: recordDate,
        workHours: validatedData.workHours,
        restHours: validatedData.restHours,
        overtimeHours: validatedData.overtimeHours || 0,
        complianceStatus: compliance.status as any,
        violationType: compliance.violationType,
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
          record,
          compliance,
          message: "Work/rest hours record created successfully",
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

    console.error("Error creating work/rest hours record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create work/rest hours record",
      },
      { status: 500 }
    );
  }
}
