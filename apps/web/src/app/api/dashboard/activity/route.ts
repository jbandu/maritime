import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { format } from "date-fns";

export async function GET() {
  try {
    await requireAuth();

    // Get recent certificate uploads
    const recentCertificates = await prisma.crewCertificate.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
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
          },
        },
      },
    });

    const activity = recentCertificates.map((cert: typeof recentCertificates[0]) => ({
      title: `Certificate added for ${cert.crew.firstName} ${cert.crew.lastName}`,
      description: `${cert.certificateType.name} (${cert.certificateNumber})`,
      timestamp: format(new Date(cert.createdAt), "MMM dd, yyyy HH:mm"),
      type: "certificate",
    }));

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard activity:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch dashboard activity",
      },
      { status: 500 }
    );
  }
}
