"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function FinalCTA() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLoginClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Simplify Your Maritime Life?
          </h2>
          <p className="text-xl text-blue-100 mb-4">
            Join 10,000+ seafarers who've ditched the paperwork.
          </p>
          <p className="text-lg text-blue-200 mb-8">
            Your certificates, contracts, and compliance - all in one place. Access from anywhere. Free for all crew members.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8"
          >
            <Button
              size="lg"
              onClick={handleLoginClick}
              className="bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-8 h-auto animate-glow"
            >
              {session ? "Go to Your Dashboard →" : "Login to Your Dashboard →"}
            </Button>
          </motion.div>

          <p className="text-blue-200 mb-8">
            All crew members get free access. No credit card required.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Used by 50+ companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Bank-level Security</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
