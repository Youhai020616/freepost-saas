"use client";
import React from "react";
import { ExpandCards } from "@/components/ui/expand-cards";
import Image from "next/image";

export function FeaturesScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden py-20">
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl font-semibold text-black dark:text-white">
          Manage all your social media <br />
          <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
            in one place
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
          Schedule posts, track analytics, and engage with your audience across Twitter, Facebook, Instagram, and LinkedIn from a single dashboard.
        </p>
      </div>
      <ExpandCards />
    </div>
  );
}

export function AnalyticsScrollDemo() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full mb-6">
              Analytics
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Track your performance with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                detailed analytics
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Get insights into your post performance, audience engagement, and optimal posting times to maximize your social media impact.
            </p>
            <ul className="space-y-4 text-left">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Real-time engagement metrics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Cross-platform performance comparison</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Audience growth tracking</span>
              </li>
            </ul>
          </div>

          {/* Right: Image */}
          <div className="w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/analytics-section.png"
                alt="Analytics Dashboard - Social Media Performance Metrics"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SchedulingScrollDemo() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left: Image (on desktop) */}
          <div className="w-full order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/scheduling-section.png"
                alt="Content Calendar - Social Media Post Scheduling"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
            </div>
          </div>
          {/* Right: Text Content (on desktop) */}
          <div className="text-center md:text-left order-1 md:order-2">
            <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-6">
              Scheduling
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Schedule posts for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                optimal timing
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Plan your content calendar weeks in advance. Our smart scheduling suggests the best times to post for maximum engagement.
            </p>
            <ul className="space-y-4 text-left">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Visual content calendar</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">AI-powered best time suggestions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Bulk scheduling & queue management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
