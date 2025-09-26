'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';
import { Calendar, BarChart3, Users, Zap, Shield, Globe, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    id: "scheduling",
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across all platforms with AI-powered optimal timing suggestions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track engagement, reach, and performance with detailed insights and reports.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    color: "from-emerald-500 to-teal-400"
  },
  {
    id: "collaboration",
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team, assign roles, and manage content approval workflows.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    color: "from-purple-500 to-violet-400"
  },
  {
    id: "bulk",
    icon: Zap,
    title: "Bulk Actions",
    description: "Upload and schedule multiple posts at once to save time and streamline your workflow.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80",
    color: "from-amber-500 to-orange-400"
  },
  {
    id: "security",
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80",
    color: "from-red-500 to-pink-400"
  },
  {
    id: "platforms",
    icon: Globe,
    title: "Multi-Platform",
    description: "Connect Twitter, Facebook, Instagram, LinkedIn, and more from a single dashboard.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    color: "from-indigo-500 to-blue-400"
  }
];

const FeaturesSticky = forwardRef<HTMLElement>((props, ref) => {
  return (
    <ReactLenis root>
      <main className='bg-background text-foreground' ref={ref}>
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

        <div className='wrapper'>
          {/* Hero Section */}
          <section className='h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background grid place-content-center sticky top-0 relative overflow-hidden pt-20'>
            {/* Grid Pattern Background */}
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)]'></div>

            <div className='relative z-10 text-center px-8 max-w-4xl mx-auto'>
              <h1 className='2xl:text-7xl text-5xl font-bold tracking-tight leading-[120%] mb-6'>
                Powerful Features for
                <br />
                <span className='bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent'>
                  Social Media Success
                </span>
                <br />
                <span className='text-2xl md:text-3xl font-normal text-muted-foreground'>
                  Scroll down to explore! 👇
                </span>
              </h1>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Discover how Freepost&apos;s comprehensive suite of tools can transform your social media strategy
              </p>
            </div>
          </section>
        </div>

        {/* Features Grid Section */}
        <section className='w-full bg-background min-h-screen py-20'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              {/* Left Column - Scrolling Features */}
              <div className='lg:col-span-4 space-y-8'>
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} id={feature.id} className='group scroll-mt-24'>
                    <div className='relative overflow-hidden rounded-2xl'>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className='w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                      <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent'>
                        <div className='flex items-center gap-3 mb-2'>
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                            <feature.icon className='h-5 w-5 text-white' />
                          </div>
                          <h3 className='text-xl font-semibold text-white'>{feature.title}</h3>
                        </div>
                        <p className='text-white/90 text-sm'>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Center Column - Sticky Content */}
              <div className='lg:col-span-4 sticky top-20 h-fit'>
                <div className='bg-card border border-border rounded-3xl p-8 shadow-lg'>
                  <div className='text-center mb-8'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
                      <Zap className='h-8 w-8 text-white' />
                    </div>
                    <h2 className='text-3xl font-bold mb-4'>All-in-One Platform</h2>
                    <p className='text-muted-foreground'>
                      Everything you need to manage, schedule, and analyze your social media presence in one powerful dashboard.
                    </p>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                      <div className='w-2 h-2 rounded-full bg-green-500'></div>
                      <span className='text-sm'>Real-time analytics</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                      <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                      <span className='text-sm'>Cross-platform posting</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                      <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                      <span className='text-sm'>Team collaboration</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                      <div className='w-2 h-2 rounded-full bg-orange-500'></div>
                      <span className='text-sm'>AI-powered insights</span>
                    </div>
                  </div>

                  <button className='w-full mt-6 bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300'>
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Right Column - Scrolling Features */}
              <div className='lg:col-span-4 space-y-8'>
                {features.slice(3, 6).map((feature, index) => (
                  <div key={index + 3} id={feature.id} className='group scroll-mt-24'>
                    <div className='relative overflow-hidden rounded-2xl'>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className='w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                      <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent'>
                        <div className='flex items-center gap-3 mb-2'>
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                            <feature.icon className='h-5 w-5 text-white' />
                          </div>
                          <h3 className='text-xl font-semibold text-white'>{feature.title}</h3>
                        </div>
                        <p className='text-white/90 text-sm'>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='bg-gray-100 dark:bg-gray-900 text-foreground py-20'>
          <div className='max-w-4xl mx-auto text-center px-8'>
            <h2 className='text-4xl md:text-6xl font-bold mb-6'>
              Ready to Get Started?
            </h2>
            <p className='text-xl mb-8 text-muted-foreground'>
              Join thousands of creators and businesses using Freepost
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors'>
                Start Free Trial
              </button>
              <button className='bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors'>
                Watch Demo
              </button>
            </div>
          </div>
        </footer>
      </main>
    </ReactLenis>
  );
});

FeaturesSticky.displayName = 'FeaturesSticky';

export default FeaturesSticky;
