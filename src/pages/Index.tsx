import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BannerSections from "@/components/home/BannerSections";
import TopMentorsSection from "@/components/home/TopMentorsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";
import MarketTicker from "@/components/MarketTicker";
import PropFirmsSection from "@/components/PropFirmsSection";
import PackagesSection from "@/components/PackagesSection";
import TeamBuildingSection from "@/components/home/TeamBuildingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MarketTicker />
      <StatsSection />
      <BannerSections />
      <FeaturesSection />
      <HowItWorksSection />
      <TopMentorsSection />
      <TestimonialsSection />
      <TeamBuildingSection />
      <PackagesSection />
      <PropFirmsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Index;
