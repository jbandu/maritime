"use client";

import { FileCheck, Clock, Shield, Ship, Calendar } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeatureGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need, All in One Place
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful features designed specifically for maritime professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={FileCheck}
            title="Never Miss a Renewal"
            description="Track all certificates, get alerts 90/60/30 days before expiry. Upload renewals from your phone. We track everything."
            stat="4,247 certificates tracked"
            badges={["Auto-alerts", "Mobile upload"]}
            delay={0}
          />
          <FeatureCard
            icon={Clock}
            title="2-Minute Daily Logging"
            description="Log work hours in seconds. Automatic MLC violation checks. Master approves digitally. 100% compliant."
            stat="100% MLC compliance rate"
            badges={["Auto-check", "Digital approval"]}
            delay={0.2}
          />
          <FeatureCard
            icon={Ship}
            title="Know Your Next Move"
            description="See sign-off dates, relief ports, flight details. Download contracts. Check leave balance."
            stat="95% on-time crew changes"
            badges={["Clear dates", "Travel details"]}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
