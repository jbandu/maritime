import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const travelSchema = z.object({
  crewId: z.string().min(1),
  travelType: z.string(),
  departureLocation: z.string().min(1),
  departureDate: z.string(),
  arrivalLocation: z.string().min(1),
  arrivalDate: z.string(),
  flightNumber: z.string().optional(),
  flightDetails: z.string().optional(),
  hotelDetails: z.string().optional(),
  visaRequired: z.boolean().optional(),
  visaStatus: z.string().optional(),
  portAgent: z.string().optional(),
  costs: z.number().optional(),
  notes: z.string().optional(),
});

// GET /api/crew/travel - Get travel records
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const crewId = searchParams.get("crewId");
    const travelType = searchParams.get("travelType");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (crewId) where.crewId = crewId;
    if (travelType) where.travelType = travelType;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.OR = [];
      if (startDate && endDate) {
        where.OR.push(
          {
            departureDate: { lte: new Date(endDate) },
            arrivalDate: { gte: new Date(startDate) },
          }
        );
      } else if (startDate) {
        where.arrivalDate = { gte: new Date(startDate) };
      } else if (endDate) {
        where.departureDate = { lte: new Date(endDate) };
      }
    }

    const [travels, total] = await Promise.all([
      prisma.crewTravel.findMany({
        where,
        include: {
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
        orderBy: { departureDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.crewTravel.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        travels,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching travel records:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch travel records",
      },
      { status: 500 }
    );
  }
}

// POST /api/crew/travel - Create travel record
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = travelSchema.parse(body);

    // Validate dates
    const departureDate = new Date(validatedData.departureDate);
    const arrivalDate = new Date(validatedData.arrivalDate);

    if (arrivalDate <= departureDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Arrival date must be after departure date",
        },
        { status: 400 }
      );
    }

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

    const travel = await prisma.crewTravel.create({
      data: {
        crewId: validatedData.crewId,
        travelType: validatedData.travelType as any,
        departureLocation: validatedData.departureLocation,
        departureDate: departureDate,
        arrivalLocation: validatedData.arrivalLocation,
        arrivalDate: arrivalDate,
        flightNumber: validatedData.flightNumber,
        flightDetails: validatedData.flightDetails,
        hotelDetails: validatedData.hotelDetails,
        visaRequired: validatedData.visaRequired || false,
        visaStatus: validatedData.visaStatus,
        portAgent: validatedData.portAgent,
        costs: validatedData.costs,
        status: "planned",
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
          travel,
          message: "Travel record created successfully",
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

    console.error("Error creating travel record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create travel record",
      },
      { status: 500 }
    );
  }
}
