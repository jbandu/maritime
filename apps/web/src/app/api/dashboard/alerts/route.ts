import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();

    const now = new Date();
    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(now.getDate() + 14);

    // Get critical certificate expiries (<14 days)
    const criticalCertificates = await prisma.crewCertificate.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: fourteenDaysFromNow,
        },
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        certificateType: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      take: 10,
      orderBy: { expiryDate: "asc" },
    });

    // Get expired certificates
    const expiredCertificates = await prisma.crewCertificate.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        certificateType: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      take: 10,
      orderBy: { expiryDate: "desc" },
    });

    const alerts = [
      ...expiredCertificates.map((cert: typeof expiredCertificates[number]) => {
        const daysExpired = Math.ceil(
          (now.getTime() - new Date(cert.expiryDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          title: `Expired Certificate: ${cert.certificateType.name}`,
          description: `${cert.crew.firstName} ${cert.crew.lastName} (${cert.crew.employeeId}) - Expired ${daysExpired} day${daysExpired !== 1 ? "s" : ""} ago`,
          severity: "critical",
        };
      }),
      ...criticalCertificates.map((cert: typeof criticalCertificates[number]) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(cert.expiryDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          title: `Certificate Expiring Soon: ${cert.certificateType.name}`,
          description: `${cert.crew.firstName} ${cert.crew.lastName} (${cert.crew.employeeId}) - Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}`,
          severity: "critical",
        };
      }),
    ];

    return NextResponse.json({
      success: true,
      data: alerts.slice(0, 10),
    });
  } catch (error: any) {
    console.error("Error fetching dashboard alerts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch dashboard alerts",
      },
      { status: 500 }
    );
  }
}
