"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

// TypeScript interface for a single testimonial object
export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
}

// TypeScript interface for the component's props
interface TestimonialSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

/**
 * A responsive section component to display customer testimonials.
 * It features a title, subtitle, and a grid of animated testimonial cards.
 */
export const TestimonialSection = ({
  title,
  subtitle,
  testimonials,
}: TestimonialSectionProps) => {
  // Animation variants for the container to orchestrate staggered children animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for each testimonial card
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        {/* Section Header */}
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {subtitle}
        </p>

        {/* Testimonials Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              variants={itemVariants}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={testimonial.imageSrc}
                  alt={testimonial.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content within the card */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
                <Quote
                  className="mb-4 h-8 w-8 text-white/40"
                  aria-hidden="true"
                />
                <blockquote className="text-base font-medium leading-relaxed line-clamp-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-semibold">
                    &mdash; {testimonial.name}
                    <span className="ml-1 font-normal text-white/60">
                      , {testimonial.role}
                    </span>
                  </p>
                </figcaption>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Default testimonials data for demo
export const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Freepost has completely transformed how I manage my social media. I can schedule a week's worth of content in just 30 minutes!",
    name: "Sarah Chen",
    role: "Content Creator",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    quote:
      "The analytics dashboard is incredible. I finally understand what content resonates with my audience. Highly recommended!",
    name: "Marcus Johnson",
    role: "Marketing Manager",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    quote:
      "As a small business owner, Freepost saves me hours every week. The multi-platform scheduling is a game-changer.",
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop",
  },
];
