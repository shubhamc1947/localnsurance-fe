import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import DashboardsSection from "@/components/DashboardsSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhyChooseSection />
      <DashboardsSection />
      <ReviewsSection />
      <NewsSection/>
      <CTASection/>
      <Footer />
    </div>
  );
};

export default Index;
