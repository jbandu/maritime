import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/certificates/expiring - Get certificates expiring within specified days
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "90");

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    // Get all certificates expiring within the specified period
    const certificates = await prisma.crewCertificate.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: futureDate,
        },
        status: {
          not: "revoked",
        },
      },
      include: {
        crew: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        certificateType: true,
      },
      orderBy: { expiryDate: "asc" },
    });

    // Also get expired certificates
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
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        certificateType: true,
      },
      orderBy: { expiryDate: "asc" },
    });

    // Group by alert level
    const grouped = {
      expired: [] as typeof certificates,
      critical: [] as typeof certificates,
      urgent: [] as typeof certificates,
      warning: [] as typeof certificates,
    };

    const allCertificates = [...expiredCertificates, ...certificates];

    allCertificates.forEach((cert) => {
      const expiryDate = new Date(cert.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        grouped.expired.push(cert);
      } else if (daysUntilExpiry <= 14) {
        grouped.critical.push(cert);
      } else if (daysUntilExpiry <= 30) {
        grouped.urgent.push(cert);
      } else if (daysUntilExpiry <= 60) {
        grouped.warning.push(cert);
      }
    });

    return NextResponse.json({
      success: true,
      data: grouped,
    });
  } catch (error: any) {
    console.error("Error fetching expiring certificates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch expiring certificates",
      },
      { status: 500 }
    );
  }
}
