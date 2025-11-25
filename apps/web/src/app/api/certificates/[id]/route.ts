import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";

const updateCertificateSchema = z.object({
  certificateNumber: z.string().min(1).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  documentUrl: z.string().optional(),
  status: z.enum(["valid", "expiring_soon", "expired", "revoked"]).optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).optional(),
});

// GET /api/certificates/[id] - Get single certificate
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const certificate = await prisma.crewCertificate.findUnique({
      where: { id: params.id },
      include: {
        crew: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
          },
        },
        certificateType: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { certificate },
    });
  } catch (error: any) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch certificate",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/certificates/[id] - Update certificate
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = updateCertificateSchema.parse(body);

    // Check if certificate exists
    const existing = await prisma.crewCertificate.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate not found",
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (validatedData.certificateNumber)
      updateData.certificateNumber = validatedData.certificateNumber;
    if (validatedData.issueDate)
      updateData.issueDate = new Date(validatedData.issueDate);
    if (validatedData.expiryDate)
      updateData.expiryDate = new Date(validatedData.expiryDate);
    if (validatedData.documentUrl !== undefined)
      updateData.documentUrl = validatedData.documentUrl;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.verificationStatus)
      updateData.verificationStatus = validatedData.verificationStatus;

    // If expiry date is updated, recalculate status
    if (validatedData.expiryDate) {
      const expiryDate = new Date(validatedData.expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        updateData.status = "expired";
      } else if (daysUntilExpiry <= 60) {
        updateData.status = "expiring_soon";
      } else {
        updateData.status = "valid";
      }
    }

    const certificate = await prisma.crewCertificate.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: {
        certificate,
        message: "Certificate updated successfully",
      },
    });
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

    console.error("Error updating certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update certificate",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates/[id] - Soft delete certificate
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const certificate = await prisma.crewCertificate.findUnique({
      where: { id: params.id },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate not found",
        },
        { status: 404 }
      );
    }

    // Soft delete by setting status to revoked
    await prisma.crewCertificate.update({
      where: { id: params.id },
      data: { status: "revoked" },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Certificate deleted successfully" },
    });
  } catch (error: any) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete certificate",
      },
      { status: 500 }
    );
  }
}
