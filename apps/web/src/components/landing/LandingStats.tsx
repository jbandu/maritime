"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatedCounter } from "./AnimatedCounter";

interface LandingStatsProps {
  className?: string;
}

export function LandingStats({ className }: LandingStatsProps) {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["landing-stats"],
    queryFn: async () => {
      const res = await fetch("/api/landing/stats");
      const data = await res.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const stats = statsData || {
    seafarers: 10000,
    certificates: 4247,
    complianceRate: 100,
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 animate-pulse"
            >
              <div className="h-8 bg-white/20 rounded mb-2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <div className="text-3xl font-bold text-white mb-2">
            <AnimatedCounter value={stats.seafarers} suffix="+" />
          </div>
          <div className="text-blue-200">Seafarers Trust Us</div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <div className="text-3xl font-bold text-white mb-2">
            <AnimatedCounter value={stats.complianceRate} suffix="%" />
          </div>
          <div className="text-blue-200">MLC Compliance Rate</div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <div className="text-3xl font-bold text-white mb-2">
            <AnimatedCounter value={stats.certificates} />
          </div>
          <div className="text-blue-200">Certificates Tracked</div>
        </div>
      </div>
    </div>
  );
}
