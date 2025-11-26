"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rank: string;
  vessel: string;
  vesselType?: string;
  years: number;
  flag: string;
  quote: string;
  rating: number;
  photo?: string;
  highlight?: string;
  delay?: number;
}

export function TestimonialCard({
  name,
  rank,
  vessel,
  vesselType,
  years,
  flag,
  quote,
  rating,
  photo,
  highlight,
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
      <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=160&background=1e3a8a&color=fff&bold=true`}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
            />
            <div className="flex-1">
              <div className="font-semibold text-white">{name}</div>
              <div className="text-sm text-blue-200">{rank}</div>
              {vesselType && (
                <div className="text-xs text-blue-300 mt-1">{vesselType}</div>
              )}
            </div>
            <div className="text-2xl">{flag}</div>
          </div>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-blue-100 text-lg italic mb-4">&quot;{quote}&quot;</p>
          {highlight && (
            <div className="mb-4">
              <span className="inline-block bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full text-sm font-semibold">
                {highlight}
              </span>
            </div>
          )}
          <div className="text-sm text-blue-300 flex items-center gap-2">
            <span>{vessel}</span>
            <span>•</span>
            <span>{years} years at sea</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
