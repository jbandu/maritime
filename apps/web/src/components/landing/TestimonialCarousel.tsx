"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Captain James Rodriguez",
    rank: "Chief Officer",
    vessel: "MV Pacific Voyager",
    vesselType: "Container Vessel",
    photo: "https://ui-avatars.com/api/?name=James+Rodriguez&size=160&background=1e3a8a&color=fff&bold=true",
    rating: 5,
    quote:
      "Before this system, I was tracking 12 certificates on Excel. Now it's automatic. I got an alert 60 days before my GMDSS expired - it literally saved my contract!",
    highlight: "Saved my contract",
    flag: "🇵🇭",
    years: 15,
  },
  {
    name: "Maria Santos",
    rank: "2nd Engineer",
    vessel: "MT Ocean Pride",
    vesselType: "Oil Tanker",
    photo: "https://ui-avatars.com/api/?name=Maria+Santos&size=160&background=0891b2&color=fff&bold=true",
    rating: 5,
    quote:
      "Work hours used to take 15 minutes every day writing everything. Now it's 2 minutes on my phone. Master approves instantly. No more paper logs cluttering my cabin!",
    highlight: "From 15 min to 2 min",
    flag: "🇵🇭",
    years: 8,
  },
  {
    name: "Ahmed Hassan",
    rank: "Able Seaman",
    vessel: "MV Iron Carrier",
    vesselType: "Bulk Carrier",
    photo: "https://ui-avatars.com/api/?name=Ahmed+Hassan&size=160&background=0d9488&color=fff&bold=true",
    rating: 5,
    quote:
      "I can see my contract end date, my next sign-on port, even my flight details. Before I had to email the office 5 times and wait days for replies. This is a total game-changer.",
    highlight: "No more waiting for replies",
    flag: "🇪🇬",
    years: 12,
  },
  {
    name: "Sven Andersson",
    rank: "Chief Engineer",
    vessel: "MV Nordic Star",
    vesselType: "RoRo Vessel",
    photo: "https://ui-avatars.com/api/?name=Sven+Andersson&size=160&background=f59e0b&color=fff&bold=true",
    rating: 5,
    quote:
      "The MLC compliance checking is brilliant. It automatically flags if we're close to violations. As Chief, I can monitor the whole engine room team's hours and catch issues early.",
    highlight: "Catch violations early",
    flag: "🇸🇪",
    years: 20,
  },
  {
    name: "Raj Kumar",
    rank: "2nd Officer",
    vessel: "MV Eastern Express",
    vesselType: "Container Vessel",
    photo: "https://ui-avatars.com/api/?name=Raj+Kumar&size=160&background=10b981&color=fff&bold=true",
    rating: 5,
    quote:
      "I renewed my ECDIS certificate last month. Got the reminder, uploaded the new cert from my phone in Singapore port, and it was approved by noon. So smooth!",
    highlight: "Renewed in port, approved by noon",
    flag: "🇮🇳",
    years: 6,
  },
  {
    name: "Carlos Mendoza",
    rank: "Bosun",
    vessel: "MV South Pacific",
    vesselType: "Bulk Carrier",
    photo: "https://ui-avatars.com/api/?name=Carlos+Mendoza&size=160&background=6366f1&color=fff&bold=true",
    rating: 5,
    quote:
      "Even as a rating, I love this. I can check my leave balance anytime. Know exactly when I'm signing off. My family knows my schedule now. Makes everything easier.",
    highlight: "Family knows my schedule",
    flag: "🇵🇭",
    years: 10,
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
        <div id="benefits" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Seafarers Love It (And So Will You)
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
                  <TestimonialCard
                    name={testimonials[currentIndex].name}
                    rank={testimonials[currentIndex].rank}
                    vessel={testimonials[currentIndex].vessel}
                    vesselType={testimonials[currentIndex].vesselType}
                    years={testimonials[currentIndex].years}
                    flag={testimonials[currentIndex].flag}
                    quote={testimonials[currentIndex].quote}
                    rating={testimonials[currentIndex].rating}
                    photo={testimonials[currentIndex].photo}
                    highlight={testimonials[currentIndex].highlight}
                  />
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
