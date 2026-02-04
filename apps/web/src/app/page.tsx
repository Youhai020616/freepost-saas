import dynamic from "next/dynamic";
import { NavbarHero } from "@/components/ui/hero-with-video";
import { AuroraSection } from "@/components/ui/aurora-section";

// 动态导入非首屏组件 - 提高首次加载性能
const FeaturesScrollDemo = dynamic(
  () => import("@/components/ui/features-scroll").then((mod) => mod.FeaturesScrollDemo),
  { ssr: true }
);
const AnalyticsScrollDemo = dynamic(
  () => import("@/components/ui/features-scroll").then((mod) => mod.AnalyticsScrollDemo),
  { ssr: true }
);
const SchedulingScrollDemo = dynamic(
  () => import("@/components/ui/features-scroll").then((mod) => mod.SchedulingScrollDemo),
  { ssr: true }
);
const FeaturesShowcase = dynamic(
  () => import("@/components/ui/features-showcase").then((mod) => mod.FeaturesShowcase),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import("@/components/ui/pricing-section").then((mod) => mod.PricingSection),
  { ssr: true }
);
const FreepostLogoCarousel = dynamic(
  () => import("@/components/ui/freepost-logo-carousel").then((mod) => mod.FreepostLogoCarousel),
  { ssr: true }
);
const TestimonialSection = dynamic(
  () => import("@/components/ui/testimonials").then((mod) => mod.TestimonialSection),
  { ssr: true }
);

// 用户证言数据
const testimonials = [
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

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Aurora Background - 首屏立即加载 */}
      <AuroraSection intensity="medium" className="min-h-screen">
        <NavbarHero
          brandName="freepost"
          heroTitle="Schedule Posts Across All Your Social Media"
          heroSubtitle="Join thousands of creators"
          heroDescription="Streamline your social media presence with our powerful scheduling and management platform. Save time, increase engagement, and grow your audience."
          emailPlaceholder="enter@email.com"
          backgroundImage="/images/freepost-hero.png"
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        />
      </AuroraSection>

      {/* Features Scroll Sections - 延迟加载 */}
      <div className="lazy-content">
        <FeaturesScrollDemo />
        <AnalyticsScrollDemo />
        <SchedulingScrollDemo />
      </div>

      {/* Features Showcase - 延迟加载 */}
      <div className="lazy-content">
        <FeaturesShowcase />
      </div>

      {/* Pricing Section - 延迟加载 */}
      <div className="lazy-content">
        <PricingSection />
      </div>

      {/* Testimonials Section - 用户证言 */}
      <div className="lazy-content">
        <TestimonialSection
          title="Loved by Creators Worldwide"
          subtitle="See what our users have to say about their experience with Freepost"
          testimonials={testimonials}
        />
      </div>

      {/* Logo Carousel CTA - 延迟加载 */}
      <div className="lazy-content">
        <FreepostLogoCarousel />
      </div>
    </div>
  );
}
