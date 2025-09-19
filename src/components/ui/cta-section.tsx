"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to transform your social media strategy?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and businesses who trust Freepost to manage their social media presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/sign-up"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </motion.a>
          </div>
          
          <div className="mt-8 text-white/70">
            <p>✨ No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
