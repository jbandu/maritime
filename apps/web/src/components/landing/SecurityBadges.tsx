"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, Lock, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const badges = [
  {
    icon: Shield,
    title: "MLC 2006 Compliant",
    description: "Fully compliant with Maritime Labour Convention",
  },
  {
    icon: FileCheck,
    title: "STCW Certified",
    description: "Meets all STCW requirements",
  },
  {
    icon: Lock,
    title: "Bank-level Encryption",
    description: "Your data is protected with AES-256 encryption",
  },
  {
    icon: CheckCircle,
    title: "GDPR Compliant",
    description: "Your privacy is our priority",
  },
];

export function SecurityBadges() {
  return (
    <section className="py-16 bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-700/50 border-slate-600 p-6 text-center hover:bg-slate-700 transition-colors">
                  <Icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2 text-sm">
                    {badge.title}
                  </h3>
                  <p className="text-slate-300 text-xs">{badge.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
