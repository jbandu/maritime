import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/crew/rotation - Get crew rotation plan analysis
// This endpoint provides insights for rotation planning
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const vesselId = searchParams.get("vesselId");
    const daysAhead = parseInt(searchParams.get("daysAhead") || "90");

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const where: any = {
      status: { in: ["active", "pending"] },
      contractEndDate: { lte: targetDate },
    };

    if (vesselId) where.vesselId = vesselId;

    // Get contracts expiring soon
    const expiringContracts = await prisma.crewContract.findMany({
      where,
      include: {
        crew: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            nationality: true,
            status: true,
            certificates: {
              where: {
                status: { in: ["valid", "expiring_soon"] },
              },
              include: {
                certificateType: true,
              },
            },
          },
        },
        vessel: {
          select: {
            id: true,
            vesselName: true,
            imoNumber: true,
            vesselType: true,
          },
        },
      },
      orderBy: { contractEndDate: "asc" },
    });

    // Get upcoming schedules
    const upcomingSchedules = await prisma.crewScheduling.findMany({
      where: {
        vesselId: vesselId || undefined,
        assignmentStart: { lte: targetDate },
        status: { in: ["planned", "confirmed"] },
      },
      include: {
        vessel: {
          select: {
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
      orderBy: { assignmentStart: "asc" },
    });

    // Get available crew (not on active contracts)
    const activeContractCrewIds = await prisma.crewContract
      .findMany({
        where: {
          status: "active",
          contractEndDate: { gt: new Date() },
        },
        select: { crewId: true },
      })
      .then((contracts) => contracts.map((c) => c.crewId));

    const availableCrew = await prisma.crewMaster.findMany({
      where: {
        status: "active",
        id: { notIn: activeContractCrewIds },
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        nationality: true,
        certificates: {
          where: {
            status: { in: ["valid", "expiring_soon"] },
          },
          include: {
            certificateType: true,
          },
        },
      },
    });

    // Group by rank
    const byRank: Record<string, any[]> = {};
    expiringContracts.forEach((contract) => {
      const rank = contract.rank;
      if (!byRank[rank]) byRank[rank] = [];
      byRank[rank].push(contract);
    });

    return NextResponse.json({
      success: true,
      data: {
        expiringContracts,
        upcomingSchedules,
        availableCrew,
        byRank,
        summary: {
          totalExpiring: expiringContracts.length,
          totalUpcomingSchedules: upcomingSchedules.length,
          totalAvailableCrew: availableCrew.length,
          byRankCount: Object.keys(byRank).reduce(
            (acc, rank) => {
              acc[rank] = byRank[rank].length;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching rotation plan:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch rotation plan",
      },
      { status: 500 }
    );
  }
}
