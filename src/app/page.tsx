import { NavbarHero } from "@/components/ui/hero-with-video";
import { FeaturesScrollDemo, AnalyticsScrollDemo, SchedulingScrollDemo } from "@/components/ui/features-scroll";
import { FeaturesGrid } from "@/components/ui/features-grid";
import { PricingSection } from "@/components/ui/pricing-section";
import { CTASection } from "@/components/ui/cta-section";
import { AuroraSection } from "@/components/ui/aurora-section";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Aurora Background */}
      <AuroraSection intensity="medium" className="min-h-screen">
        <NavbarHero
          brandName="freepost"
          heroTitle="Schedule Posts Across All Your Social Media"
          heroSubtitle="Join thousands of creators"
          heroDescription="Streamline your social media presence with our powerful scheduling and management platform. Save time, increase engagement, and grow your audience."
          emailPlaceholder="enter@email.com"
          backgroundImage="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        />
      </AuroraSection>

      {/* Features Scroll Sections */}
      <FeaturesScrollDemo />
      <AnalyticsScrollDemo />
      <SchedulingScrollDemo />

      {/* Features Grid with Aurora Background */}
      <AuroraSection intensity="medium">
        <FeaturesGrid />
      </AuroraSection>

      {/* Pricing Section */}
      <PricingSection />

      {/* Call to Action with Aurora Background */}
      <AuroraSection intensity="strong">
        <CTASection />
      </AuroraSection>
    </div>
  );
}
