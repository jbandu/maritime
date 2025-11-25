import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/crew - Get all crew members
export async function GET() {
  try {
    await requireAuth();

    const crewMembers = await prisma.crewMaster.findMany({
      where: {
        status: "active",
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: { lastName: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: crewMembers,
    });
  } catch (error: any) {
    console.error("Error fetching crew members:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch crew members",
      },
      { status: 500 }
    );
  }
}
