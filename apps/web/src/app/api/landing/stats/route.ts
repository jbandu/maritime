import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public endpoint for landing page stats (no auth required)
export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const [
      activeCrew,
      expiringCertificates,
      activeContracts,
      totalCertificates,
      validCertificates,
    ] = await Promise.all([
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

    const mlcComplianceRate =
      totalCertificates > 0
        ? Math.round((validCertificates / totalCertificates) * 100)
        : 100;

    // Return stats suitable for landing page
    return NextResponse.json({
      success: true,
      data: {
        seafarers: activeCrew || 10000, // Fallback for demo
        certificates: totalCertificates || 4247, // Fallback for demo
        complianceRate: mlcComplianceRate,
        activeContracts: activeContracts || 0,
        expiringCertificates,
      },
    });
  } catch (error: any) {
    console.error("Error fetching landing page stats:", error);
    // Return fallback stats if database query fails
    return NextResponse.json({
      success: true,
      data: {
        seafarers: 10000,
        certificates: 4247,
        complianceRate: 100,
        activeContracts: 0,
        expiringCertificates: 0,
      },
    });
  }
}
