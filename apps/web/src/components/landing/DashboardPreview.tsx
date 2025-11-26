"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

export function DashboardPreview() {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See What You Get - Live Dashboard Preview
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need at a glance, beautifully organized
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700 p-8 overflow-hidden">
            {/* Mock Dashboard Preview */}
            <div className="bg-slate-900 rounded-lg p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Dashboard</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Certificates", value: "12", color: "blue" },
                  { label: "Work Hours", value: "168h", color: "green" },
                  { label: "Compliance", value: "100%", color: "cyan" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-slate-800 p-4 rounded-lg"
                  >
                    <div className="text-sm text-slate-400">{stat.label}</div>
                    <div className={`text-2xl font-bold text-${stat.color}-400`}>
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature Annotations */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="text-white font-semibold mb-2">
                      Your certificates at a glance
                    </div>
                    <div className="text-sm text-slate-400">
                      3 expiring soon
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="text-white font-semibold mb-2">
                      Quick work hour logging
                    </div>
                    <div className="text-sm text-slate-400">
                      Last logged: 2 min ago
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-cyan-500">
                    <div className="text-white font-semibold mb-2">
                      Upcoming travel details
                    </div>
                    <div className="text-sm text-slate-400">
                      Sign-off: Jan 15, 2025
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
                    <div className="text-white font-semibold mb-2">
                      Real-time compliance status
                    </div>
                    <div className="text-sm text-slate-400">
                      All systems green
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-6 h-auto text-lg"
            >
              View Full Dashboard →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
