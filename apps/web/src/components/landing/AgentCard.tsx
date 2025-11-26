"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface AgentCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  badge: string;
  delay?: number;
  onTryClick?: () => void;
}

export function AgentCard({
  icon: Icon,
  name,
  description,
  badge,
  delay = 0,
  onTryClick,
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-lg border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group relative overflow-hidden">
        {/* Terminal demo overlay on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm p-4 z-10"
          >
            <div className="font-mono text-xs text-green-400 space-y-1">
              <div>🤖 {name} activated...</div>
              <div>📊 Analyzing data...</div>
              <div>✅ Processing complete</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </motion.div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <motion.div
              animate={{
                rotate: isHovered ? [0, 360] : 0,
              }}
              transition={{ duration: 1 }}
            >
              <Icon className="w-10 h-10 text-cyan-400" />
            </motion.div>
            <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
              {badge}
            </Badge>
          </div>
          <CardTitle className="text-2xl text-white">{name}</CardTitle>
          <CardDescription className="text-blue-100">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onTryClick}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white"
          >
            Try It Live →
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
