"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ExpiringContract {
  id: string;
  contractEndDate: string;
  rank: string;
  crew: {
    firstName: string;
    lastName: string;
    employeeId: string;
    nationality: string;
  };
  vessel: {
    vesselName: string;
    imoNumber: string;
  };
}

interface RotationData {
  expiringContracts: ExpiringContract[];
  summary: {
    totalExpiring: number;
    totalUpcomingSchedules: number;
    totalAvailableCrew: number;
    byRankCount: Record<string, number>;
  };
}

export function RotationPlanning() {
  const [data, setData] = useState<RotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysAhead, setDaysAhead] = useState(90);

  useEffect(() => {
    fetchRotationData();
  }, [daysAhead]);

  const fetchRotationData = async () => {
    try {
      const response = await fetch(`/api/crew/rotation?daysAhead=${daysAhead}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching rotation data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading rotation planning data...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const { expiringContracts, summary } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalExpiring}</div>
            <p className="text-xs text-muted-foreground">
              Next {daysAhead} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalUpcomingSchedules}
            </div>
            <p className="text-xs text-muted-foreground">Planned rotations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Crew
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalAvailableCrew}
            </div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              By Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(summary.byRankCount).length}
            </div>
            <p className="text-xs text-muted-foreground">Different ranks</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Contracts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expiring Contracts</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Contracts expiring in the next {daysAhead} days
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={daysAhead === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setDaysAhead(30)}
              >
                30 days
              </Button>
              <Button
                variant={daysAhead === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setDaysAhead(90)}
              >
                90 days
              </Button>
              <Button
                variant={daysAhead === 180 ? "default" : "outline"}
                size="sm"
                onClick={() => setDaysAhead(180)}
              >
                180 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {expiringContracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contracts expiring in the selected period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expiringContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">
                        {contract.crew.firstName} {contract.crew.lastName}
                      </h4>
                      <Badge variant="outline">{contract.rank}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {contract.crew.employeeId}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <span>{contract.vessel.vesselName}</span>
                      <span className="mx-2">•</span>
                      <span>IMO: {contract.vessel.imoNumber}</span>
                      <span className="mx-2">•</span>
                      <span>{contract.crew.nationality}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(contract.contractEndDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.ceil(
                        (new Date(contract.contractEndDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days remaining
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Plan Relief
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rank Breakdown */}
      {Object.keys(summary.byRankCount).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expiring Contracts by Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summary.byRankCount).map(([rank, count]) => (
                <div key={rank} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {rank.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
