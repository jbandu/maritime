"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Schedule {
  id: string;
  vessel: {
    vesselName: string;
    imoNumber: string;
  };
  rank: string;
  assignedCrew: {
    firstName: string;
    lastName: string;
    employeeId: string;
  } | null;
  assignmentStart: string;
  assignmentEnd: string;
  crewChangePort: string | null;
  status: string;
  estimatedCost: number | null;
}

export function CrewScheduling() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/crew/scheduling?limit=50");
      const data = await response.json();
      if (data.success) {
        setSchedules(data.data.schedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      planned: "outline",
      confirmed: "default",
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading schedules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Crew Scheduling</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage crew assignments and rotations
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vessel</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Assigned Crew</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Crew Change Port</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No schedules found. Create a new schedule to get started.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.vessel.vesselName}
                    <div className="text-xs text-muted-foreground">
                      IMO: {schedule.vessel.imoNumber}
                    </div>
                  </TableCell>
                  <TableCell>{schedule.rank}</TableCell>
                  <TableCell>
                    {schedule.assignedCrew ? (
                      <div>
                        {schedule.assignedCrew.firstName}{" "}
                        {schedule.assignedCrew.lastName}
                        <div className="text-xs text-muted-foreground">
                          {schedule.assignedCrew.employeeId}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(schedule.assignmentStart), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(schedule.assignmentEnd), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{schedule.crewChangePort || "-"}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    {schedule.estimatedCost
                      ? `$${schedule.estimatedCost.toLocaleString()}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
