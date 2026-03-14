import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import ctaPerson from "@/assets/cta-person.jpg";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-accent/5">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="bg-gradient-to-r from-accent to-accent/80 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={ctaPerson}
                alt="Get started today"
                className="rounded-2xl w-full max-w-xs mx-auto shadow-lg"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-accent-foreground mb-3">
                Interested in what we can do for you?
              </h2>
              <p className="text-accent-foreground/80 mb-6 max-w-lg">
                Contact our sales team for personalized health insurance solutions tailored to your remote workforce needs.
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 font-semibold shadow-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
