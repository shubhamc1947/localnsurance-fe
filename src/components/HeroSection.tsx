import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import heroTeam from "@/assets/hero-team.png";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedSection>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
              <span className="text-[#0066FF]">Empower Your Workforce</span> with Comprehensive Remote Health Insurance
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
{/*         <AnimatedSection delay={0.3}>
          <div className="border-t border-border mb-10" />
        </AnimatedSection> */}

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
              <div className="absolute bottom-4 left-4 right-4 bg-foreground/70 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 w-[80%]"
                style={{
                  background: "linear-gradient(transparent, transparent) padding-box, linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 52%, rgba(255,255,255,0.3) 100%) border-box",
                  border: "1px solid transparent",
                  backdropFilter: "blur(50px)",
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 rounded"
                >
                {/*                   
                  <span className="text-primary-foreground text-xs">+</span>
                */}
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M55 21.25C55 30.225 47.725 37.5 38.75 37.5C38.325 37.5 37.875 37.475 37.45 37.45C36.825 29.525 30.475 23.175 22.55 22.55C22.525 22.125 22.5 21.675 22.5 21.25C22.5 12.275 29.775 5 38.75 5C47.725 5 55 12.275 55 21.25Z" fill="white"/>
                    <path opacity="0.4" d="M37.5 38.75C37.5 47.725 30.225 55 21.25 55C12.275 55 5 47.725 5 38.75C5 29.775 12.275 22.5 21.25 22.5C21.675 22.5 22.125 22.525 22.55 22.55C30.475 23.175 36.825 29.525 37.45 37.45C37.475 37.875 37.5 38.325 37.5 38.75Z" fill="white"/>
                    <path d="M19.05 36.55L21.25 32.5L23.45 36.55L27.5 38.75L23.45 40.95L21.25 45L19.05 40.95L15 38.75L19.05 36.55Z" fill="white"/>
                  </svg>
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
              <div className="absolute top-4 right-4 left-4 rounded-xl p-3 flex items-center gap-4 w-[80%] mx-auto"
                style={{
                      background: "linear-gradient(transparent, transparent) padding-box, linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 52%, rgba(255,255,255,0.3) 100%) border-box",
                      border: "1px solid transparent",
                      backdropFilter: "blur(50px)",
                    }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded flex items-center justify-center"
                  
                  >
                    <svg width="60" height="60" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.4" d="M41.7507 14.2088L29.7507 5.813C26.4798 3.52133 21.459 3.64633 18.3132 6.08383L7.87565 14.2297C5.79232 15.8547 4.14648 19.188 4.14648 21.813V36.188C4.14648 41.5005 8.45898 45.8338 13.7715 45.8338H36.2298C41.5423 45.8338 45.8548 41.5213 45.8548 36.2088V22.0838C45.8548 19.2713 44.0423 15.813 41.7507 14.2088Z" fill="white"/>
                      <path d="M35.0625 23.4779C34.9167 23.1237 34.625 22.832 34.2708 22.6862C34.0833 22.6029 33.8958 22.582 33.7083 22.582H29.8333C29.0208 22.582 28.375 23.2279 28.375 24.0404C28.375 24.8529 29.0208 25.4987 29.8333 25.4987H30.2083L25.8125 29.8945L23.6875 26.7279C23.4375 26.3737 23.0625 26.1237 22.625 26.082C22.1667 26.0404 21.7708 26.1862 21.4583 26.4987L15.25 32.707C14.6875 33.2695 14.6875 34.1862 15.25 34.7695C15.5417 35.0612 15.8958 35.1862 16.2708 35.1862C16.6458 35.1862 17.0208 35.0404 17.2917 34.7695L22.25 29.8112L24.375 32.9779C24.625 33.332 25 33.582 25.4375 33.6237C25.8958 33.6654 26.2917 33.5195 26.6042 33.207L32.2708 27.5404V27.9154C32.2708 28.7279 32.9167 29.3737 33.7292 29.3737C34.5417 29.3737 35.1875 28.7279 35.1875 27.9154V24.0404C35.1667 23.832 35.1458 23.6445 35.0625 23.4779Z" fill="white"/>
                      </svg>

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
