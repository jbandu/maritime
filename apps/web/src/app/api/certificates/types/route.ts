import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/certificates/types - Get all certificate types
export async function GET() {
  try {
    await requireAuth();

    const certificateTypes = await prisma.certificateType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: certificateTypes,
    });
  } catch (error: any) {
    console.error("Error fetching certificate types:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch certificate types",
      },
      { status: 500 }
    );
  }
}
