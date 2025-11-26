"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ComplianceData {
  summary: {
    totalRecords: number;
    violations: number;
    warnings: number;
    compliant: number;
    complianceRate: string;
  };
  violationsByType: Record<string, number>;
  topViolators: Array<{ name: string; count: number }>;
  recentViolations: Array<{
    id: string;
    date: string;
    crew: string;
    violationType: string | null;
    workHours: number;
    restHours: number;
  }>;
}

export function ComplianceDashboard() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const response = await fetch("/api/crew/compliance?days=30");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading compliance data...</div>;
  }

  if (!data) {
    return <div>No compliance data available</div>;
  }

  const { summary, violationsByType, topViolators, recentViolations } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {summary.compliant} compliant records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {summary.violations}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalRecords} total records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary.warnings}
            </div>
            <p className="text-xs text-muted-foreground">Near violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Compliant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.compliant}
            </div>
            <p className="text-xs text-muted-foreground">Fully compliant</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Violations by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(violationsByType).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No violations recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(violationsByType).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {type.replace(/_/g, " ").replace("MLC 2006", "MLC 2006:")}
                      </div>
                    </div>
                    <Badge variant="destructive">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Violators */}
        <Card>
          <CardHeader>
            <CardTitle>Top Violators</CardTitle>
          </CardHeader>
          <CardContent>
            {topViolators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No violations recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topViolators.map((violator, index) => (
                  <div
                    key={violator.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-bold">
                        {index + 1}
                      </div>
                      <div className="font-medium">{violator.name}</div>
                    </div>
                    <Badge variant="destructive">{violator.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentViolations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent violations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{violation.crew}</h4>
                      <Badge variant="destructive">Violation</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {violation.violationType
                        ? violation.violationType.replace(/_/g, " ")
                        : "Unknown violation"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(violation.date), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Work: {violation.workHours}h | Rest: {violation.restHours}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
