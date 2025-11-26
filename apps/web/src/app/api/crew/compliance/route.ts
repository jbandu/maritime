import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/crew/compliance - Get compliance dashboard data
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const vesselId = searchParams.get("vesselId");
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      recordDate: { gte: startDate },
    };

    if (vesselId) where.vesselId = vesselId;

    // Get all records
    const records = await prisma.workRestHours.findMany({
      where,
      include: {
        crew: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
      },
    });

    // Calculate compliance statistics
    const totalRecords = records.length;
    const violations = records.filter(
      (r) => r.complianceStatus === "violation"
    ).length;
    const warnings = records.filter(
      (r) => r.complianceStatus === "warning"
    ).length;
    const compliant = records.filter(
      (r) => r.complianceStatus === "compliant"
    ).length;

    // Group violations by type
    const violationsByType: Record<string, number> = {};
    records
      .filter((r) => r.violationType)
      .forEach((r) => {
        const type = r.violationType || "unknown";
        violationsByType[type] = (violationsByType[type] || 0) + 1;
      });

    // Get crew with most violations
    const crewViolations: Record<string, number> = {};
    records
      .filter((r) => r.complianceStatus === "violation")
      .forEach((r) => {
        const crewName = `${r.crew.firstName} ${r.crew.lastName}`;
        crewViolations[crewName] = (crewViolations[crewName] || 0) + 1;
      });

    const topViolators = Object.entries(crewViolations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate 7-day compliance for each crew member
    const crewIds = [...new Set(records.map((r) => r.crewId))];
    const sevenDayCompliance = await Promise.all(
      crewIds.map(async (id) => {
        const crewRecords = records.filter((r) => r.crewId === id);
        const vesselIds = [...new Set(crewRecords.map((r) => r.vesselId))];

        const complianceByVessel = await Promise.all(
          vesselIds.map(async (vid) => {
            const vesselRecords = crewRecords.filter((r) => r.vesselId === vid);
            const dates = vesselRecords.map((r) => r.recordDate).sort();

            let sevenDayViolations = 0;
            for (let i = 6; i < dates.length; i++) {
              const endDate = dates[i];
              const startDate = new Date(endDate);
              startDate.setDate(startDate.getDate() - 6);

              const weekRecords = vesselRecords.filter(
                (r) => r.recordDate >= startDate && r.recordDate <= endDate
              );

              const totalRest = weekRecords.reduce(
                (sum, r) => sum + r.restHours,
                0
              );

              if (totalRest < 77) {
                sevenDayViolations++;
              }
            }

            return {
              vesselId: vid,
              violations: sevenDayViolations,
              totalWeeks: Math.max(0, dates.length - 6),
            };
          })
        );

        return {
          crewId: id,
          crewName: `${crewRecords[0].crew.firstName} ${crewRecords[0].crew.lastName}`,
          complianceByVessel,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRecords,
          violations,
          warnings,
          compliant,
          complianceRate: totalRecords
            ? ((compliant / totalRecords) * 100).toFixed(2)
            : "0.00",
        },
        violationsByType,
        topViolators,
        sevenDayCompliance,
        recentViolations: records
          .filter((r) => r.complianceStatus === "violation")
          .sort(
            (a, b) =>
              new Date(b.recordDate).getTime() -
              new Date(a.recordDate).getTime()
          )
          .slice(0, 20)
          .map((r) => ({
            id: r.id,
            date: r.recordDate,
            crew: `${r.crew.firstName} ${r.crew.lastName}`,
            violationType: r.violationType,
            workHours: r.workHours,
            restHours: r.restHours,
          })),
      },
    });
  } catch (error: any) {
    console.error("Error fetching compliance data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch compliance data",
      },
      { status: 500 }
    );
  }
}
