import { Badge } from "@/components/ui/badge";
import { getCertificateStatus } from "@/lib/types/certificate";

interface StatusBadgeProps {
  expiryDate: string;
  status?: string;
}

export function StatusBadge({ expiryDate, status }: StatusBadgeProps) {
  const { alertLevel, daysUntilExpiry } = getCertificateStatus(expiryDate);
  const displayStatus = status || alertLevel;

  const badgeVariants: Record<string, string> = {
    expired: "destructive",
    critical: "destructive",
    urgent: "default",
    warning: "secondary",
    valid: "outline",
  };

  const badgeLabels: Record<string, string> = {
    expired: "Expired",
    critical: `Critical (${daysUntilExpiry}d)`,
    urgent: `Urgent (${daysUntilExpiry}d)`,
    warning: `Warning (${daysUntilExpiry}d)`,
    valid: "Valid",
  };

  return (
    <Badge variant={badgeVariants[displayStatus] as any}>
      {badgeLabels[displayStatus] || displayStatus}
    </Badge>
  );
}
