import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import dashboardMain from "@/assets/dashboard-main.jpg";

const featuresList = [
  "Real-time claims tracking and management",
  "Automated enrollment and onboarding",
  "Customizable benefit plans",
  "Integrated telehealth services",
  "Comprehensive reporting & analytics",
];

const FeaturesSection = () => {
  return (
    <section id="services" className="py-16 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimatedSection>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Platform</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mt-2 mb-4">
                Everything You Need in One <span className="text-accent">Dashboard</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Our intuitive platform gives you complete control over your team's health benefits with powerful tools and real-time insights.
              </p>
            </AnimatedSection>

            <div className="space-y-4 mb-8">
              {featuresList.map((item, index) => (
                <AnimatedSection key={item} delay={0.05 + index * 0.08}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{item}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.5}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                Learn More
              </Button>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="absolute -right-4 -top-4 w-full h-full rounded-2xl bg-primary/5 -z-10" />
              <img
                src={dashboardMain}
                alt="Platform dashboard"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
