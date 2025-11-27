"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  WifiOff,
  Bell,
  Camera,
  Shield,
  Moon,
} from "lucide-react";

const mobileFeatures = [
  { icon: Smartphone, text: "iOS & Android", description: "Download for both platforms" },
  { icon: WifiOff, text: "Offline Mode", description: "Log hours even without internet" },
  { icon: Bell, text: "Push Notifications", description: "Get certificate alerts on your phone" },
  { icon: Camera, text: "Photo Upload", description: "Take photo of certificate, upload instantly" },
  { icon: Shield, text: "Biometric Login", description: "Face ID / Touch ID security" },
  { icon: Moon, text: "Dark Mode", description: "Easy on the eyes during night watch" },
];

const mobileScreens = [
  {
    title: "Dashboard",
    description: "Quick overview of certificates and hours",
  },
  {
    title: "Certificates",
    description: "All your certificates in your pocket",
  },
  {
    title: "Work Hours",
    description: "Log hours in 2 minutes from your phone",
  },
  {
    title: "Offline Mode",
    description: "Works even without internet at sea",
  },
];

export function MobileAppSection() {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % mobileScreens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Access From Anywhere - Vessel or Shore
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your maritime career management in your pocket
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-64 h-[500px] bg-slate-800 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-cyan-900 rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10" />
                  
                  {/* Screen Content */}
                  <div className="pt-8 px-4 h-full overflow-y-auto">
                    <motion.div
                      key={currentScreen}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center text-white"
                    >
                      <div className="text-4xl mb-4">📱</div>
                      <div className="text-xl font-semibold mb-2">
                        {mobileScreens[currentScreen].title}
                      </div>
                      <div className="text-sm text-blue-200">
                        {mobileScreens[currentScreen].description}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Animation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0"
              />
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              {mobileFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700 p-4 hover:bg-slate-800 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-1">
                            {feature.text}
                          </div>
                          <div className="text-sm text-slate-400">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Testimonial Snippet */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-cyan-500/30 p-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <p className="text-white italic mb-2">
                    &ldquo;I uploaded my renewed STCW cert from Singapore port using my phone. Took 2 minutes. Approved by the time I finished lunch.&rdquo;
                  </p>
                  <div className="text-sm text-blue-200">
                    - Maria, 2nd Engineer
                  </div>
                </div>
              </div>
            </Card>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 text-white hover:bg-slate-800 flex-1"
                disabled
              >
                <span className="text-xs">Coming Soon</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 text-white hover:bg-slate-800 flex-1"
                disabled
              >
                <span className="text-xs">Coming Soon</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
