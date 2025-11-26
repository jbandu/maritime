"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./AnimatedBackground";
import { AnimatedCounter } from "./AnimatedCounter";
import { useState } from "react";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Hero() {
  const router = useRouter();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main headline with typing effect */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your Maritime Career, Simplified{" "}
              <span className="inline-block animate-float">🚢</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Manage certificates, log work hours, view contracts - all in one
              secure platform
            </motion.p>

            {/* Statistics */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">
                  <AnimatedCounter value={10000} suffix="+" />
                </div>
                <div className="text-blue-200">Seafarers Trust Us</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">
                  <AnimatedCounter value={0} />
                </div>
                <div className="text-blue-200">Certificate Violations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">
                  <AnimatedCounter value={2} suffix=" min" />
                </div>
                <div className="text-blue-200">Work Hour Logging</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 h-auto animate-glow"
                onClick={() => router.push("/dashboard")}
              >
                Login to Dashboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                onClick={() => setDemoOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Platform Demo</DialogTitle>
            <DialogDescription>
              See how the Maritime Crew Portal simplifies your career management
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <p className="text-white">Demo video placeholder</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
