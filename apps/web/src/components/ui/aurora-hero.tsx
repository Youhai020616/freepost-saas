"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowRight, Sparkles } from "lucide-react";

export function AuroraHeroDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <span className="text-sm font-medium text-muted-foreground">
            Powered by AI
          </span>
        </div>
        
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Schedule Posts Across
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            All Your Social Media
          </span>
        </div>
        
        <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4 text-center max-w-2xl">
          Streamline your social media presence with our powerful scheduling and management platform. 
          Save time, increase engagement, and grow your audience.
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <motion.a
            href="/sign-up"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-6 py-3 font-medium flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          
          <motion.a
            href="/demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-black/20 dark:border-white/20 rounded-full w-fit text-black dark:text-white px-6 py-3 font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Watch Demo
          </motion.a>
        </div>
        
        <div className="mt-8 text-xs text-muted-foreground">
          ✨ No credit card required • 14-day free trial • Cancel anytime
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
