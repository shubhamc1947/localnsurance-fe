import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import heroTeam from "@/assets/hero-team.jpg";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedSection>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
              <span className="text-accent">Empower Your Workforce</span> with Comprehensive Remote Health Insurance
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-2xl mx-auto">
              Instant coverage for your global team, available in over 180 countries. Get a quote in under 2 minutes and protect your employees wherever they are.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <Button
              onClick={() => navigate("/get-quote")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-3 text-base font-semibold shadow-lg"
            >
              Get A Quote
            </Button>
          </AnimatedSection>
        </div>

        {/* Divider line */}
        <AnimatedSection delay={0.3}>
          <div className="border-t border-border mb-10" />
        </AnimatedSection>

        <AnimatedSection delay={0.35}>
          <div className="flex flex-col md:flex-row gap-5 max-w-5xl mx-auto">
            {/* Large left image */}
            <div className="relative w-full md:w-[65%] rounded-2xl overflow-hidden shadow-xl h-72 md:h-96">
              <img
                src={heroTeam}
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              {/* Bottom overlay card */}
              <div className="absolute bottom-4 left-4 right-4 bg-foreground/70 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs">+</span>
                </div>
                <p className="text-primary-foreground text-xs leading-relaxed">
                  With Localsurance, you can provide reliable, comprehensive health insurance coverage to your employees and their dependents, no matter where they are located.
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-full md:w-[35%] rounded-2xl overflow-hidden shadow-xl h-72 md:h-96">
              <img
                src={heroDashboard}
                alt="Modern healthcare facility"
                className="w-full h-full object-cover"
              />
              {/* Top overlay card */}
              <div className="absolute top-4 right-4 left-4 bg-foreground/50 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded bg-primary/80 flex items-center justify-center">
                    <span className="text-primary-foreground text-[10px]">↗</span>
                  </div>
                </div>
                <p className="text-primary-foreground text-xs leading-relaxed">
                  Our plans are designed to adapt to your company's growth and meet diverse healthcare needs across borders.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
