'use client';
import React from 'react';
import { Calendar, BarChart3, Users, Zap, Shield, Globe, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across all platforms with AI-powered optimal timing suggestions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track engagement, reach, and performance with detailed insights and reports.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team, assign roles, and manage content approval workflows.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    color: "from-purple-500 to-violet-400"
  },
  {
    icon: Zap,
    title: "Bulk Actions",
    description: "Upload and schedule multiple posts at once to save time and streamline your workflow.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80",
    color: "from-amber-500 to-orange-400"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80",
    color: "from-red-500 to-pink-400"
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description: "Connect Twitter, Facebook, Instagram, LinkedIn, and more from a single dashboard.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    color: "from-indigo-500 to-blue-400"
  }
];

export function FeaturesShowcase() {
  return (
    <section className='py-20 px-4 bg-background'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-3xl md:text-5xl font-bold text-foreground mb-4'
          >
            Powerful Features for
            <br />
            <span className='bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent'>
              Social Media Success
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-muted-foreground max-w-2xl mx-auto'
          >
            Discover how Freepost's comprehensive suite of tools can transform your social media strategy
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='group cursor-pointer'
            >
              <a href="/features" className='block relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-500'>
                {/* Arrow Icon */}
                <div className='absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg'>
                    <ArrowUpRight className='h-4 w-4 text-gray-700' />
                  </div>
                </div>

                {/* Image */}
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className='h-5 w-5 text-white' />
                    </div>
                    <h3 className='text-xl font-semibold text-foreground'>{feature.title}</h3>
                  </div>
                  <p className='text-muted-foreground text-sm leading-relaxed'>{feature.description}</p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <a 
            href="/features" 
            className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300'
          >
            Explore All Features
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
