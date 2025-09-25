'use client';
import AboutUsSection from "@/components/ui/about-us-section";
import { ArrowLeft, Home } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <a href="/" className='flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors'>
            <ArrowLeft className='h-5 w-5' />
            <span className='font-medium'>Back to Home</span>
          </a>
          <div className='flex items-center gap-4'>
            <a href="/" className='flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors'>
              <Home className='h-5 w-5' />
              <span className='font-medium'>freepost</span>
            </a>
          </div>
        </div>
      </nav>

      {/* About Us Section */}
      <div className="pt-20">
        <AboutUsSection />
      </div>
    </div>
  );
}
