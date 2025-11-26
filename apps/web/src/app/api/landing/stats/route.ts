import { NextResponse } from "next/server";

export async function GET() {
  // Return mock stats for now - can be replaced with real database queries
  const stats = {
    seafarers: 10000,
    certificates: 4247,
    complianceRate: 100,
    avgLoggingTime: 2,
    companies: 50,
  };

  return NextResponse.json(stats);
}
