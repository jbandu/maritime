import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const [activeCrew, expiringCertificates, activeContracts, totalCertificates, validCertificates] = await Promise.all([
      prisma.crewMaster.count({
        where: { status: "active" },
      }),
      prisma.crewCertificate.count({
        where: {
          expiryDate: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
          status: {
            not: "revoked",
          },
        },
      }),
      prisma.crewContract.count({
        where: { status: "active" },
      }),
      prisma.crewCertificate.count({
        where: {
          status: {
            not: "revoked",
          },
        },
      }),
      prisma.crewCertificate.count({
        where: {
          status: "valid",
        },
      }),
    ]);

    const mlcComplianceRate = totalCertificates > 0
      ? Math.round((validCertificates / totalCertificates) * 100)
      : 100;

    return NextResponse.json({
      success: true,
      data: {
        activeCrew,
        expiringCertificates,
        activeContracts,
        mlcComplianceRate,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
