import { FileText, Globe, Users, HeartPulse, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import whyChooseDashboard from "@/assets/why-choose-dashboard.jpg";
import whyChoosePlatform from "@/assets/why-choose-platform.jpg";

const topFeatures = [
  {
    icon: FileText,
    title: "Instant Quotes and Easy Enrollment",
    description: "Forget waiting days for a quote. Our quick and simple process provides you with a detailed quote in under 2 minutes. Plus, enrolling your team is hassle-free with our streamlined platform.",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage Tailored to Local Needs",
    description: "With coverage in over 180 countries, your employees are protected wherever they live and work. Our plans are designed to meet local healthcare standards, ensuring your team receives the best care possible.",
  },
  {
    icon: Users,
    title: "Flexible Plans for Every Team Size",
    description: "Whether you have 5 employees or 500, we offer a range of customizable plans that grow with your business. Select from our Basic, Medium, or Pro plans, or customize your own to suit specific needs.",
  },
];

const bottomFeatures = [
  {
    icon: HeartPulse,
    title: "Comprehensive Health Benefits",
    description: "From routine check-ups and emergency medical care to dental, vision, and wellness programs, our plans cover a wide range of health services to keep your team healthy and productive.",
  },
  {
    icon: Shield,
    title: "Dependents Coverage Included",
    description: "Peace of mind goes beyond the individual. Our insurance plans include coverage for dependents, so your employees can rest easy knowing their loved ones are protected too.",
  },
  {
    icon: Clock,
    title: "24/7 Customer Support and Health Assistance",
    description: "Our dedicated support team is available around the clock to assist with any questions or emergencies. We also provide 24/7 health assistance to help your team navigate healthcare needs anytime, anywhere.",
  },
];

const WhyChooseSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
              Why <span className="text-accent">Choose</span> localsurance?
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm">
              Localsurance is designed to be more than just an insurance provider. We are your partner in ensuring the health and well-being of your global team. Here's what sets us apart:
            </p>
          </div>
        </AnimatedSection>

        {/* Top row: Image left, features right */}
        <AnimatedSection delay={0.1}>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
              <img
                src={whyChooseDashboard}
                alt="Insurance dashboard on tablet"
                className="w-full h-full object-cover min-h-[300px]"
              />
            </div>
            <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-sm flex flex-col justify-center">
              <div className="space-y-6">
                {topFeatures.map((feature, index) => (
                  <div key={feature.title}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-base mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    {index < topFeatures.length - 1 && (
                      <div className="border-b border-dashed border-border mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom row: Features left, image right */}
        <AnimatedSection delay={0.2}>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-sm flex flex-col justify-center">
              <div className="space-y-6">
                {bottomFeatures.map((feature, index) => (
                  <div key={feature.title}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-base mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    {index < bottomFeatures.length - 1 && (
                      <div className="border-b border-dashed border-border mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
              <img
                src={whyChoosePlatform}
                alt="Platform dashboard screenshots"
                className="w-full h-full object-cover min-h-[300px]"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* View Demo button */}
        <AnimatedSection delay={0.3}>
          <div className="text-center mt-12">
            <div className="border-t border-border pt-8">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-3 text-base font-semibold">
                View Demo
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyChooseSection;
