"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stat: string;
  badges: string[];
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
  badges,
  delay = 0,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card
        className="h-full bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
        style={{
          transform: isHovered
            ? "perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.02)"
            : "perspective(1000px) rotateX(0) rotateY(0) scale(1)",
        }}
      >
        <CardHeader>
          <motion.div
            animate={{
              rotate: isHovered ? [0, 10, -10, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Icon className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <CardTitle className="text-2xl text-white mb-2">{title}</CardTitle>
          <CardDescription className="text-blue-100 text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-4">{stat}</div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
