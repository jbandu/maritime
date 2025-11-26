"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "Is my data secure?",
    answer:
      "Yes, absolutely. We use bank-level encryption (AES-256) to protect your data. We're GDPR compliant and your information is stored securely. We never share your data with third parties.",
  },
  {
    question: "Do I need to pay?",
    answer:
      "No, the Maritime Crew Portal is completely free for all crew members. Your company covers the costs. There are no hidden fees or credit card required.",
  },
  {
    question: "What if I forget my password?",
    answer:
      "You can reset your password easily via email. Just click 'Forgot password?' on the login page, enter your email, and you'll receive a secure reset link within minutes.",
  },
  {
    question: "Can I use it offline?",
    answer:
      "Yes! The mobile app works offline. You can log work hours, view certificates, and check contracts even without internet. Your data syncs automatically when you're back online.",
  },
  {
    question: "Who do I contact for help?",
    answer:
      "Our 24/7 support team is always available. Email support@maritimecrewportal.com or use the in-app chat. We typically respond within 2 hours, even at sea.",
  },
  {
    question: "What certificates can I track?",
    answer:
      "You can track all maritime certificates including STCW, GMDSS, ECDIS, medical certificates, flag state endorsements, and more. Upload any certificate type and we'll track it.",
  },
  {
    question: "How do I upload a certificate?",
    answer:
      "It's simple! Take a photo of your certificate with your phone, or upload a PDF. The system automatically extracts expiry dates and sends you alerts. Takes less than 30 seconds.",
  },
  {
    question: "Is it MLC 2006 compliant?",
    answer:
      "Yes, 100% compliant. We automatically check your work-rest hours against MLC 2006 requirements and flag any violations before they happen. Masters can approve hours digitally.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="support" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about the Maritime Crew Portal
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-white font-semibold text-lg">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-slate-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
