"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rank: string;
  vessel: string;
  years: number;
  flag: string;
  quote: string;
  rating: number;
  delay?: number;
}

export function TestimonialCard({
  name,
  rank,
  vessel,
  years,
  flag,
  quote,
  rating,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
              {name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-white">{name}</div>
              <div className="text-sm text-blue-200">{rank}</div>
            </div>
          </div>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-blue-100 text-lg italic mb-4">&quot;{quote}&quot;</p>
          <div className="text-sm text-blue-300">
            {vessel} • {years} years at sea • {flag}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
