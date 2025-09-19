import { NavbarHero } from "@/components/ui/hero-with-video";

const DemoOne = () => {
  return (
    <NavbarHero
      brandName="TechFlow"
      heroTitle="Innovation Meets Simplicity"
      heroSubtitle="Early Access Available"
      heroDescription="Discover cutting-edge solutions designed for the modern digital landscape."
      emailPlaceholder="enter@email.com"
      backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
      videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    />
  );
};

export default DemoOne;
