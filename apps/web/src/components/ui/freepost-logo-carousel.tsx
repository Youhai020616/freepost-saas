"use client";

import React from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { 
  TwitterIcon, 
  FacebookIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  YouTubeIcon, 
  TikTokIcon, 
  PinterestIcon, 
  DiscordIcon 
} from "@/components/ui/social-logos";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// 社交媒体平台 Logo 数组
const socialPlatformLogos = [
  { name: "Twitter/X", id: 1, img: TwitterIcon },
  { name: "Facebook", id: 2, img: FacebookIcon },
  { name: "Instagram", id: 3, img: InstagramIcon },
  { name: "LinkedIn", id: 4, img: LinkedInIcon },
  { name: "YouTube", id: 5, img: YouTubeIcon },
  { name: "TikTok", id: 6, img: TikTokIcon },
  { name: "Pinterest", id: 7, img: PinterestIcon },
  { name: "Discord", id: 8, img: DiscordIcon },
];

export function FreepostLogoCarousel() {
  return (
    <section className="py-20 px-4 bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GradientHeading variant="secondary" size="sm" className="mb-4">
                Connect All Your Platforms
              </GradientHeading>
              <GradientHeading variant="default" size="xl" className="mb-6">
                One Dashboard, Every Platform
              </GradientHeading>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Manage your entire social media presence from a single, powerful dashboard. 
                Schedule, publish, and analyze across all major platforms seamlessly.
              </p>
            </motion.div>
          </div>

          {/* Logo Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border">
              <LogoCarousel columnCount={4} logos={socialPlatformLogos} />
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                AI-powered optimal timing for maximum engagement across all platforms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Unified Analytics</h3>
              <p className="text-muted-foreground">
                Track performance across all platforms with comprehensive insights
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with role-based permissions and workflows
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/sign-up"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </motion.a>

              <motion.a
                href="/features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Explore Features
              </motion.a>
            </div>
            
            <div className="mt-6 text-muted-foreground text-sm">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
