"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, CheckCircle, Clock, FileText, Shield } from "lucide-react";

const features = [
  { icon: CheckCircle, text: "Upload certificate in 10 seconds", time: "0:05" },
  { icon: Clock, text: "Log work hours in 2 minutes", time: "0:15" },
  { icon: FileText, text: "View contract details instantly", time: "0:22" },
  { icon: Shield, text: "Automatic MLC compliance check", time: "0:28" },
];

const screenshots = [
  { title: "Dashboard", image: "/screenshots/dashboard.png" },
  { title: "Certificates", image: "/screenshots/certificates.png" },
  { title: "Work Hours", image: "/screenshots/work-hours.png" },
];

export function DemoVideoSection() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);

  // Auto-cycle through screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It In Action - 30 Second Tour
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Watch how easy it is to manage your maritime career
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Video/Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden aspect-video relative">
              {/* Placeholder for video - using animated screenshots */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-cyan-900/50">
                <div className="text-center">
                  <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-2xl font-semibold">
                      {screenshots[currentScreen].title}
                    </div>
                    <div className="text-slate-300 mt-2">
                      Screenshot preview - Video coming soon
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </motion.div>
              </div>

              {/* Gradient Border */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-lg opacity-50 animate-pulse" />
            </Card>
          </motion.div>

          {/* Feature Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{feature.text}</div>
                    <div className="text-sm text-slate-400">{feature.time}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-6 h-auto text-lg"
            >
              Watch Full Demo
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-6 h-auto text-lg"
            >
              Skip to Login →
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
