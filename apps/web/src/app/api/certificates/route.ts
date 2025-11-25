import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const certificateSchema = z.object({
  crewId: z.string().min(1),
  certificateTypeId: z.string().min(1),
  certificateNumber: z.string().min(1),
  issueDate: z.string(),
  expiryDate: z.string(),
  documentUrl: z.string().optional(),
});

// GET /api/certificates - List all certificates with filtering
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const crewId = searchParams.get("crewId");
    const certificateTypeId = searchParams.get("certificateTypeId");
    const status = searchParams.get("status");
    const expiryBefore = searchParams.get("expiryBefore");
    const expiryAfter = searchParams.get("expiryAfter");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (crewId) where.crewId = crewId;
    if (certificateTypeId) where.certificateTypeId = certificateTypeId;
    if (status) where.status = status;

    if (expiryBefore || expiryAfter) {
      where.expiryDate = {};
      if (expiryBefore) where.expiryDate.lte = new Date(expiryBefore);
      if (expiryAfter) where.expiryDate.gte = new Date(expiryAfter);
    }

    if (search) {
      where.OR = [
        { certificateNumber: { contains: search, mode: "insensitive" } },
        { crew: { firstName: { contains: search, mode: "insensitive" } } },
        { crew: { lastName: { contains: search, mode: "insensitive" } } },
        { crew: { employeeId: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [certificates, total] = await Promise.all([
      prisma.crewCertificate.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.crewCertificate.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        certificates,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch certificates",
      },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Create new certificate
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = certificateSchema.parse(body);

    // Validate expiry date is after issue date
    const issueDate = new Date(validatedData.issueDate);
    const expiryDate = new Date(validatedData.expiryDate);

    if (expiryDate <= issueDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Expiry date must be after issue date",
        },
        { status: 400 }
      );
    }

    // Check if crew exists
    const crew = await prisma.crewMaster.findUnique({
      where: { id: validatedData.crewId },
    });

    if (!crew) {
      return NextResponse.json(
        {
          success: false,
          error: "Crew member not found",
        },
        { status: 404 }
      );
    }

    // Check if certificate type exists
    const certificateType = await prisma.certificateType.findUnique({
      where: { id: validatedData.certificateTypeId },
    });

    if (!certificateType) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate type not found",
        },
        { status: 404 }
      );
    }

    // Determine status based on expiry date
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let status: "valid" | "expiring_soon" | "expired" = "valid";
    if (daysUntilExpiry < 0) {
      status = "expired";
    } else if (daysUntilExpiry <= 60) {
      status = "expiring_soon";
    }

    const certificate = await prisma.crewCertificate.create({
      data: {
        crewId: validatedData.crewId,
        certificateTypeId: validatedData.certificateTypeId,
        certificateNumber: validatedData.certificateNumber,
        issueDate: issueDate,
        expiryDate: expiryDate,
        documentUrl: validatedData.documentUrl,
        status: status,
        verificationStatus: "pending",
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
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          certificate,
          message: "Certificate created successfully",
        },
      },
      { status: 201 }
    );
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

    console.error("Error creating certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create certificate",
      },
      { status: 500 }
    );
  }
}
