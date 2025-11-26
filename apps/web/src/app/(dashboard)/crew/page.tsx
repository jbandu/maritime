"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrewList } from "@/components/crew/CrewList";
import { CrewScheduling } from "@/components/crew/CrewScheduling";
import { RotationPlanning } from "@/components/crew/RotationPlanning";
import { ComplianceDashboard } from "@/components/crew/ComplianceDashboard";
import { Users, Calendar, RotateCcw, Shield } from "lucide-react";

export default function CrewPage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Crew Management</h1>
        <p className="text-muted-foreground">
          Manage crew members, scheduling, rotations, and compliance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Crew List
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="rotation" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Rotation Planning
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <CrewList />
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <CrewScheduling />
        </TabsContent>

        <TabsContent value="rotation" className="mt-6">
          <RotationPlanning />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
