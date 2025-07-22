import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhyChooseLexicon } from "@/components/WhyChooseLexicon";
import { HowItWorks } from "@/components/HowItWorks";
import { LearningFormats } from "@/components/LearningFormats";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhyChooseLexicon />
        <HowItWorks />
        <LearningFormats />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
