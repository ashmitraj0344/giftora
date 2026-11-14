import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { OccasionsSection } from '@/components/home/OccasionsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <BestsellersSection />
      <HowItWorksSection />
      <OccasionsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </div>
  );
}
