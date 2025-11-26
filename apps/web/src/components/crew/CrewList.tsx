"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CrewMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string | null;
}

export function CrewList() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      const response = await fetch("/api/crew");
      const data = await response.json();
      if (data.success) {
        setCrew(data.data);
      }
    } catch (error) {
      console.error("Error fetching crew:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrew = crew.filter(
    (member) =>
      member.firstName.toLowerCase().includes(search.toLowerCase()) ||
      member.lastName.toLowerCase().includes(search.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Crew Members</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your crew roster
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Crew Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crew by name or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCrew.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No crew members found
                </TableCell>
              </TableRow>
            ) : (
              filteredCrew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.employeeId}
                  </TableCell>
                  <TableCell>
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>{member.email || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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
