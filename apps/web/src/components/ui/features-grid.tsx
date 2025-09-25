"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Clock,
  TrendingUp,
  MessageSquare
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across all platforms with AI-powered optimal timing suggestions.",
    color: "bg-blue-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track engagement, reach, and performance with detailed insights and reports.",
    color: "bg-emerald-600"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team, assign roles, and manage content approval workflows.",
    color: "bg-purple-600"
  },
  {
    icon: Zap,
    title: "Bulk Actions",
    description: "Upload and schedule multiple posts at once to save time and streamline your workflow.",
    color: "bg-amber-500"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.",
    color: "bg-red-600"
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description: "Connect Twitter, Facebook, Instagram, LinkedIn, and more from a single dashboard.",
    color: "bg-indigo-600"
  },
  {
    icon: Clock,
    title: "Time Zone Support",
    description: "Schedule posts for different time zones to reach your global audience effectively.",
    color: "bg-teal-600"
  },
  {
    icon: TrendingUp,
    title: "Growth Insights",
    description: "Discover trending hashtags and optimal posting strategies to grow your audience.",
    color: "bg-orange-600"
  },
  {
    icon: MessageSquare,
    title: "Content Templates",
    description: "Use pre-built templates and customize them for consistent brand messaging.",
    color: "bg-pink-600"
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create, schedule, and analyze your social media content with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
