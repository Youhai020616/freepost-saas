import { NavbarHero } from "@/components/ui/hero-with-video";

export default function Home() {
  return (
    <NavbarHero
      brandName="freepost"
      heroTitle="Schedule Posts Across All Your Social Media"
      heroSubtitle="Join thousands of creators"
      heroDescription="Streamline your social media presence with our powerful scheduling and management platform. Save time, increase engagement, and grow your audience."
      emailPlaceholder="enter@email.com"
      backgroundImage="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
      videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    />
  );
}
