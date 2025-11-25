"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FileSignature, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function fetchDashboardStats() {
  const response = await fetch("/api/dashboard/stats");
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
}

async function fetchRecentActivity() {
  const response = await fetch("/api/dashboard/activity");
  if (!response.ok) throw new Error("Failed to fetch recent activity");
  return response.json();
}

async function fetchAlerts() {
  const response = await fetch("/api/dashboard/alerts");
  if (!response.ok) throw new Error("Failed to fetch alerts");
  return response.json();
}

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  const { data: activity, isLoading: loadingActivity } = useQuery({
    queryKey: ["dashboardActivity"],
    queryFn: fetchRecentActivity,
  });

  const { data: alerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ["dashboardAlerts"],
    queryFn: fetchAlerts,
  });

  const kpiCards = [
    {
      title: "Total Active Crew",
      value: stats?.activeCrew || 0,
      icon: Users,
      description: "Currently active crew members",
      color: "text-blue-600",
    },
    {
      title: "Certificates Expiring",
      value: stats?.expiringCertificates || 0,
      icon: FileText,
      description: "Expiring in next 30 days",
      color: "text-orange-600",
      href: "/certificates/expiring",
    },
    {
      title: "Active Contracts",
      value: stats?.activeContracts || 0,
      icon: FileSignature,
      description: "Currently active contracts",
      color: "text-green-600",
    },
    {
      title: "MLC Compliance Rate",
      value: stats?.mlcComplianceRate
        ? `${stats.mlcComplianceRate}%`
        : "N/A",
      icon: TrendingUp,
      description: "Maritime Labour Convention compliance",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your maritime crew management system
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const content = (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );

          return kpi.href ? (
            <Link key={kpi.title} href={kpi.href}>
              {content}
            </Link>
          ) : (
            <div key={kpi.title}>{content}</div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest certificate uploads and crew changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading activity...
              </div>
            ) : activity?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="space-y-4">
                {activity?.slice(0, 5).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alerts
            </CardTitle>
            <CardDescription>
              Critical certificate expiries and upcoming sign-offs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading alerts...
              </div>
            ) : alerts?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No alerts at this time
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.slice(0, 5).map((alert: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border p-3"
                  >
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {alerts && alerts.length > 5 && (
              <div className="mt-4">
                <Link href="/certificates/expiring">
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
