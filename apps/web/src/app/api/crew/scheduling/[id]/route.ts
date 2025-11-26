import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const updateSchedulingSchema = z.object({
  assignedCrewId: z.string().optional().nullable(),
  assignmentStart: z.string().optional(),
  assignmentEnd: z.string().optional(),
  crewChangePort: z.string().optional(),
  status: z.string().optional(),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  travelItinerary: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/crew/scheduling/[id] - Get specific schedule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const schedule = await prisma.crewScheduling.findUnique({
      where: { id: params.id },
      include: {
        vessel: true,
        crew: {
          include: {
            certificates: {
              include: {
                certificateType: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error: any) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch schedule",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/crew/scheduling/[id] - Update schedule
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = updateSchedulingSchema.parse(body);

    // Check if schedule exists
    const existingSchedule = await prisma.crewScheduling.findUnique({
      where: { id: params.id },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found",
        },
        { status: 404 }
      );
    }

    // If updating assigned crew, check for overlaps
    if (validatedData.assignedCrewId !== undefined) {
      const assignmentStart =
        validatedData.assignmentStart
          ? new Date(validatedData.assignmentStart)
          : existingSchedule.assignmentStart;
      const assignmentEnd = validatedData.assignmentEnd
        ? new Date(validatedData.assignmentEnd)
        : existingSchedule.assignmentEnd;

      if (validatedData.assignedCrewId) {
        const overlapping = await prisma.crewScheduling.findFirst({
          where: {
            id: { not: params.id },
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
    }

    const updateData: any = {};
    if (validatedData.assignedCrewId !== undefined)
      updateData.assignedCrewId = validatedData.assignedCrewId;
    if (validatedData.assignmentStart)
      updateData.assignmentStart = new Date(validatedData.assignmentStart);
    if (validatedData.assignmentEnd)
      updateData.assignmentEnd = new Date(validatedData.assignmentEnd);
    if (validatedData.crewChangePort !== undefined)
      updateData.crewChangePort = validatedData.crewChangePort;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.estimatedCost !== undefined)
      updateData.estimatedCost = validatedData.estimatedCost;
    if (validatedData.actualCost !== undefined)
      updateData.actualCost = validatedData.actualCost;
    if (validatedData.travelItinerary !== undefined)
      updateData.travelItinerary = validatedData.travelItinerary;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    const schedule = await prisma.crewScheduling.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        message: "Schedule updated successfully",
      },
    });
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

    console.error("Error updating schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update schedule",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/crew/scheduling/[id] - Cancel schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const schedule = await prisma.crewScheduling.findUnique({
      where: { id: params.id },
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found",
        },
        { status: 404 }
      );
    }

    // Soft delete by updating status
    await prisma.crewScheduling.update({
      where: { id: params.id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({
      success: true,
      message: "Schedule cancelled successfully",
    });
  } catch (error: any) {
    console.error("Error cancelling schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to cancel schedule",
      },
      { status: 500 }
    );
  }
}
