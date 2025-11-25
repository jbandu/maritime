export interface CrewCertificate {
  id: string;
  crewId: string;
  certificateTypeId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  documentUrl: string | null;
  verificationStatus: "pending" | "verified" | "rejected";
  status: "valid" | "expiring_soon" | "expired" | "revoked";
  createdAt: string;
  updatedAt: string;
  crew: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string | null;
  };
  certificateType: {
    id: string;
    code: string;
    name: string;
    category: string;
    validityPeriodMonths: number | null;
    mandatory: boolean;
  };
}

export interface CertificateFilters {
  crewId?: string;
  certificateTypeId?: string;
  status?: string;
  expiryBefore?: string;
  expiryAfter?: string;
  search?: string;
}

export interface CertificateFormData {
  crewId: string;
  certificateTypeId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
}

export interface CertificateType {
  id: string;
  code: string;
  name: string;
  category: string;
  validityPeriodMonths: number | null;
  mandatory: boolean;
}

export interface CrewMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string | null;
}

export function getCertificateStatus(expiryDate: string): {
  status: "valid" | "expiring_soon" | "expired" | "revoked";
  daysUntilExpiry: number;
  alertLevel: "expired" | "critical" | "urgent" | "warning" | "valid";
} {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status: "valid" | "expiring_soon" | "expired" | "revoked" = "valid";
  let alertLevel: "expired" | "critical" | "urgent" | "warning" | "valid" =
    "valid";

  if (daysUntilExpiry < 0) {
    status = "expired";
    alertLevel = "expired";
  } else if (daysUntilExpiry <= 14) {
    status = "expiring_soon";
    alertLevel = "critical";
  } else if (daysUntilExpiry <= 30) {
    status = "expiring_soon";
    alertLevel = "urgent";
  } else if (daysUntilExpiry <= 60) {
    status = "expiring_soon";
    alertLevel = "warning";
  }

  return { status, daysUntilExpiry, alertLevel };
}
