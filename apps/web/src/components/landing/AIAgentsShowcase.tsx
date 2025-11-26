"use client";

import { Brain, Shield, Moon } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { useState } from "react";
import { AIAgentDemoModal } from "./AIAgentDemoModal";

export function AIAgentsShowcase() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("crew-match");

  const handleTryClick = (agent: string) => {
    setSelectedAgent(agent);
    setDemoOpen(true);
  };

  return (
    <>
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powered by AI, Built for Seafarers
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Our intelligent agents work 24/7 to keep your career on track
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgentCard
              icon={Brain}
              name="CrewMatchAI"
              description="Finds the perfect crew for every position. Matches based on certificates, performance, and preferences."
              badge="AI-Powered"
              delay={0}
              onTryClick={() => handleTryClick("crew-match")}
            />
            <AgentCard
              icon={Shield}
              name="CertGuardianAI"
              description="Never miss a certificate renewal. Automatic alerts, renewal planning, cost optimization."
              badge="Proactive Monitoring"
              delay={0.2}
              onTryClick={() => handleTryClick("cert-guardian")}
            />
            <AgentCard
              icon={Moon}
              name="FatigueGuardianAI"
              description="MLC 2006 compliance monitoring. Real-time rest hour checking, fatigue risk prediction."
              badge="24/7 Monitoring"
              delay={0.4}
              onTryClick={() => handleTryClick("fatigue-guardian")}
            />
          </div>
        </div>
      </section>

      <AIAgentDemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        defaultAgent={selectedAgent}
      />
    </>
  );
}
