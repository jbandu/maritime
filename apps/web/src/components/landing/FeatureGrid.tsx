"use client";

import { FileCheck, Clock, Shield, Ship, Calendar } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeatureGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div id="features" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful features designed specifically for maritime professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={FileCheck}
            title="Certificates That Manage Themselves"
            description="Get alerts 90, 60, 30 days before expiry. Upload renewals from your phone. View PDFs anytime. We track it all so you don't have to."
            stat="4,247 certificates tracked"
            badges={["Auto-alerts", "Mobile Upload", "Instant Access"]}
            delay={0}
          />
          <FeatureCard
            icon={Clock}
            title="MLC Compliance Made Simple"
            description="Log your daily work hours in seconds. Automatic violation checks. Master approves with one click. Zero paperwork, 100% compliant."
            stat="100% MLC compliance rate"
            badges={["2-min logging", "Auto-check", "Digital approval"]}
            delay={0.2}
          />
          <FeatureCard
            icon={Ship}
            title="Contract & Travel Info at Your Fingertips"
            description="See your sign-off date, relief port, flight details. Download your contract. Check your leave balance. Everything's clear and simple."
            stat="95% on-time crew changes"
            badges={["Clear dates", "Travel details", "Leave tracking"]}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
