"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function FeaturesScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Manage all your social media <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                in one place
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Schedule posts, track analytics, and engage with your audience across Twitter, Facebook, Instagram, and LinkedIn from a single dashboard.
            </p>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
          alt="Freepost Dashboard - Social Media Management Interface"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export function AnalyticsScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Track your performance with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                detailed analytics
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Get insights into your post performance, audience engagement, and optimal posting times to maximize your social media impact.
            </p>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
          alt="Analytics Dashboard - Social Media Performance Metrics"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export function SchedulingScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Schedule posts for <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                optimal timing
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Plan your content calendar weeks in advance. Our smart scheduling suggests the best times to post for maximum engagement.
            </p>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
          alt="Content Calendar - Social Media Post Scheduling"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
