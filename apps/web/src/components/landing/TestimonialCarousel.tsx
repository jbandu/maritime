"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "John Smith",
    rank: "Chief Engineer",
    vessel: "MV Atlantic Star",
    years: 15,
    flag: "Liberia",
    quote:
      "This platform saved me from missing my STCW renewal. The alerts are perfect and the mobile upload makes everything so easy.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    rank: "Second Officer",
    vessel: "MV Pacific Wave",
    years: 8,
    flag: "Panama",
    quote:
      "Logging work hours used to take forever. Now it's literally 2 minutes. The MLC compliance checks give me peace of mind.",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    rank: "Master",
    vessel: "MV Indian Ocean",
    years: 20,
    flag: "Marshall Islands",
    quote:
      "As a Master, I love how easy it is to approve crew work hours digitally. No more paperwork headaches.",
    rating: 5,
  },
  {
    name: "Li Wei",
    rank: "Chief Cook",
    vessel: "MV Asia Express",
    years: 12,
    flag: "Singapore",
    quote:
      "Finally, a platform that understands seafarers. Everything I need is in one place. Highly recommend!",
    rating: 5,
  },
  {
    name: "James Wilson",
    rank: "Able Seaman",
    vessel: "MV Caribbean Dream",
    years: 6,
    flag: "Bahamas",
    quote:
      "The certificate tracking is a lifesaver. I never have to worry about expiry dates anymore.",
    rating: 5,
  },
  {
    name: "Sofia Petrov",
    rank: "Third Engineer",
    vessel: "MV Baltic Sea",
    years: 4,
    flag: "Malta",
    quote:
      "Clean interface, fast loading, and everything works perfectly. This is how maritime software should be.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Seafarers Worldwide
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See what your fellow crew members are saying
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-3xl mx-auto">
                  <TestimonialCard {...testimonials[currentIndex]} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={prev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={next}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-cyan-400 w-8" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
