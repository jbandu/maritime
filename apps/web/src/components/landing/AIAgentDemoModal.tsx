"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AIAgentDemoModalProps {
  open: boolean;
  onClose: () => void;
  defaultAgent?: string;
}

export function AIAgentDemoModal({
  open,
  onClose,
  defaultAgent = "crew-match",
}: AIAgentDemoModalProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [results, setResults] = useState<any>(null);

  const streamMessage = async (message: string, delay: number = 30) => {
    let currentMessage = "";
    for (let i = 0; i < message.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      currentMessage += message[i];
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length === 0) {
          newMessages.push(currentMessage);
        } else {
          newMessages[newMessages.length - 1] = currentMessage;
        }
        return newMessages;
      });
    }
    setMessages((prev) => [...prev, ""]);
  };

  const runDemo = useCallback(async (agent: string) => {
    setIsThinking(true);
    setMessages([]);
    setResults(null);

    if (agent === "crew-match") {
      await streamMessage("🤖 CrewMatchAI activated...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("📊 Analyzing crew pool (400+ candidates)...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Try to call real API (will fail if not logged in, which is fine for demo)
      let candidates = [
        { id: 1, name: "John Smith", score: 95, rank: "Chief Engineer" },
        { id: 2, name: "Maria Garcia", score: 92, rank: "Chief Engineer" },
        { id: 3, name: "Ahmed Hassan", score: 90, rank: "Chief Engineer" },
      ];

      try {
        const response = await fetch("/api/agents/crew-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vessel_id: "demo-vessel",
            rank: "Chief Engineer",
            required_date: new Date().toISOString(),
            port: "Singapore",
            requirements: {
              certificates: ["STCW", "GMDSS"],
              experience_years: 5,
              vessel_type: "Container",
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.candidates) {
            candidates = data.data.candidates;
          }
        }
      } catch (error) {
        // Use demo data if API call fails (expected for non-logged-in users)
      }

      await streamMessage("✅ Found 23 qualified Chief Engineers");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("🔍 Checking certificates... 18 valid");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("📈 Scoring candidates...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      await streamMessage("   Technical Competency: 30%");
      await streamMessage("   Performance History: 25%");
      await streamMessage("   Cost Efficiency: 20%");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("🎯 Top candidates identified");
      setResults({ candidates });
    } else if (agent === "cert-guardian") {
      await streamMessage("🤖 CertGuardianAI scanning...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("📄 Checking 4,247 certificates...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      await streamMessage("⚠️  Found 12 expiring within 30 days");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("🔴 Critical: 2 expire in 14 days");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("📧 Sending alerts...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("✅ Renewal plans generated");
      setResults({
        expiring: [
          { id: 1, name: "STCW Basic Safety", days: 14 },
          { id: 2, name: "Medical Certificate", days: 18 },
        ],
      });
    } else if (agent === "fatigue-guardian") {
      await streamMessage("🤖 FatigueGuardianAI monitoring...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("⏱️  Checking work-rest hours...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      await streamMessage("✅ All crew compliant with MLC 2006");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("📊 Rest hours: 10.5h average");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await streamMessage("🟢 Fatigue risk: Low");
    }

    setIsThinking(false);
  }, [streamMessage]);

  useEffect(() => {
    if (open && defaultAgent) {
      setTimeout(() => runDemo(defaultAgent), 300);
    }
  }, [open, defaultAgent, runDemo]);

  const clearTerminal = () => {
    setMessages([]);
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Agent Interactive Demo</DialogTitle>
          <DialogDescription>
            See our AI agents in action with real-time processing
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultAgent} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crew-match">CrewMatchAI</TabsTrigger>
            <TabsTrigger value="cert-guardian">CertGuardianAI</TabsTrigger>
            <TabsTrigger value="fatigue-guardian">FatigueGuardianAI</TabsTrigger>
          </TabsList>

          <TabsContent value="crew-match" className="flex-1 flex flex-col">
            <div className="bg-slate-950 p-6 rounded-lg flex-1 overflow-y-auto font-mono text-sm mb-4">
              {messages.map((msg, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {msg}
                  {i === messages.length - 1 && isThinking && (
                    <span className="animate-pulse">▊</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => runDemo("crew-match")}>Run Demo</Button>
              <Button variant="outline" onClick={clearTerminal}>
                Clear
              </Button>
            </div>
            {results?.candidates && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {results.candidates.map((candidate: any) => (
                  <Card key={candidate.id} className="p-4">
                    <div className="font-semibold">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Score: {candidate.score}%
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cert-guardian" className="flex-1 flex flex-col">
            <div className="bg-slate-950 p-6 rounded-lg flex-1 overflow-y-auto font-mono text-sm mb-4">
              {messages.map((msg, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {msg}
                  {i === messages.length - 1 && isThinking && (
                    <span className="animate-pulse">▊</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => runDemo("cert-guardian")}>Run Demo</Button>
              <Button variant="outline" onClick={clearTerminal}>
                Clear
              </Button>
            </div>
            {results?.expiring && (
              <div className="mt-4 space-y-2">
                {results.expiring.map((cert: any) => (
                  <Card key={cert.id} className="p-4">
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Expires in {cert.days} days
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fatigue-guardian" className="flex-1 flex flex-col">
            <div className="bg-slate-950 p-6 rounded-lg flex-1 overflow-y-auto font-mono text-sm mb-4">
              {messages.map((msg, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {msg}
                  {i === messages.length - 1 && isThinking && (
                    <span className="animate-pulse">▊</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => runDemo("fatigue-guardian")}>
                Run Demo
              </Button>
              <Button variant="outline" onClick={clearTerminal}>
                Clear
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
