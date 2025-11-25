import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";

// POST /api/certificates/upload - Handle file upload to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only PDF, JPG, and PNG files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 10MB limit",
        },
        { status: 400 }
      );
    }

    // TODO: Upload to Supabase Storage
    // For now, return a placeholder URL
    // In production, you would:
    // 1. Create a Supabase Storage client
    // 2. Upload the file to a bucket (e.g., "certificates")
    // 3. Return the public URL

    const filename = `${Date.now()}-${file.name}`;
    const placeholderUrl = `/uploads/certificates/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: placeholderUrl,
        filename: filename,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
