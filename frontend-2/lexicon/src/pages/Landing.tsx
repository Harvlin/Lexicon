// New unified Landing page composed from heroPage prototype + existing sections.
// Integrated & themed for Lexicon brand tokens defined in `index.css`.
import { LandingNavbar } from '@/components/landing/Navbar';
import { LandingFooter } from '@/components/landing/Footer';
// Reused / enhanced sections
import { HeroSection } from '@/components/landing/Hero';
import { FeaturesSection } from '@/components/landing/Features';
import { HowItWorksSection } from '@/components/landing/HowItWorks';
import { AIExperienceSection } from '@/components/landing/AIExperience';
import { TestimonialsSection } from '@/components/landing/Testimonials';
import { FAQSection } from '@/components/landing/FAQ';
// New imported showcase / media / CTA sections (ported from heroPage)
import { ProductShowcaseSection } from '@/components/landing/ProductShowcase';
import { VideoDemoSection } from '@/components/landing/VideoDemo';
import { CTABannerSection } from '@/components/landing/CTABanner';
import { TrustLogos } from '@/components/landing/TrustLogos';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustLogos />
        <FeaturesSection />
        <ProductShowcaseSection />
        <HowItWorksSection />
        <VideoDemoSection />
        <AIExperienceSection />
        <TestimonialsSection />
  {/* Pricing removed: app is fully free */}
        <FAQSection />
        <CTABannerSection />
      </main>
      <LandingFooter />
    </div>
  );
}
