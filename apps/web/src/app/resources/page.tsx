'use client';
import { ResourcesBentoGrid } from "@/components/ui/resources-bento-grid";
import { ArrowLeft, Home, BookOpen, Video, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const resourceCategories = [
  {
    icon: BookOpen,
    title: "Guides & Tutorials",
    description: "Step-by-step guides to master social media management",
    count: "25+ guides",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch and learn with our comprehensive video library",
    count: "50+ videos",
    color: "from-red-500 to-pink-400"
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other creators and share best practices",
    count: "10k+ members",
    color: "from-purple-500 to-violet-400"
  },
  {
    icon: Globe,
    title: "Templates",
    description: "Ready-to-use templates for all your social media needs",
    count: "100+ templates",
    color: "from-emerald-500 to-teal-400"
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <Link href="/" className='flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors'>
            <ArrowLeft className='h-5 w-5' />
            <span className='font-medium'>Back to Home</span>
          </Link>
          <div className='flex items-center gap-4'>
            <Link href="/" className='flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors'>
              <Home className='h-5 w-5' />
              <span className='font-medium'>freepost</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Resources & Learning
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Center
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to master social media management and grow your online presence
          </motion.p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {category.description}
                </p>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <ResourcesBentoGrid />
    </div>
  );
}
