import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const reviews = [
  {
    name: "James Madison Smith",
    role: "Chief Product Officer",
    text: "Localsurance is more than just an insurtech company—it's a complete platform built to simplify and elevate the way you manage your insurance.",
  },
  {
    name: "Cameron American",
    role: "General Manager",
    text: "Localsurance is more than just an insurtech company—it's a complete platform built to simplify and elevate the way you manage your insurance.",
  },
  {
    name: "Sarah Thompson",
    role: "HR Director",
    text: "The platform transformed how we handle health benefits for our distributed team. Setup was incredibly fast and the support is outstanding.",
  },
  {
    name: "Michael Park",
    role: "Operations Lead",
    text: "Managing insurance for 200+ employees across 15 countries used to be a nightmare. Localsurance made it seamless and transparent.",
  },
  {
    name: "Sarah Thompson",
    role: "HR Director",
    text: "The platform transformed how we handle health benefits for our distributed team. Setup was incredibly fast and the support is outstanding.",
  },
  {
    name: "Michael Park",
    role: "Operations Lead",
    text: "Managing insurance for 200+ employees across 15 countries used to be a nightmare. Localsurance made it seamless and transparent.",
  },
  {
    name: "Sarah Thompson",
    role: "HR Director",
    text: "The platform transformed how we handle health benefits for our distributed team. Setup was incredibly fast and the support is outstanding.",
  },
  {
    name: "Michael Park",
    role: "Operations Lead",
    text: "Managing insurance for 200+ employees across 15 countries used to be a nightmare. Localsurance made it seamless and transparent.",
  },
];

const ReviewsSection = () => {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(reviews.length / perPage);

  const prev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const next = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-16 lg:py-24 bg-[#F6F6F6] ">
      <div className="container mx-auto px-4 lg:px-16 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
              <span className="text-accent">Customer</span> Reviews
            </h2>
          </div>
        </AnimatedSection>

        <div >
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 w-14 h-14 rounded-r-[50%] bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 z-10 w-14 h-14 rounded-l-[50%] bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {visible.map((review) => (
              <div key={review.name} className="bg-background rounded-2xl p-10 shadow-sm border border-border relative">
                {/* Orange quote marks */}
                <div className="text-accent font-display font-black text-5xl leading-none mb-4 absolute -top-7 left-10 ">
                  <svg width="56" height="50" viewBox="0 0 56 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M56 0.479255L54.5567 10.5382C51.606 10.2802 49.2646 10.7961 47.5326 12.0857C45.8007 13.3108 44.614 15.084 43.9725 17.4053C43.3952 19.6621 43.299 22.2413 43.6838 25.1429H56V50H32.2337V24.1757C32.2337 15.7288 34.2222 9.34527 38.1993 5.02511C42.1764 0.640455 48.11 -0.87483 56 0.479255ZM23.7663 0.479255L22.323 10.5382C19.3723 10.2802 17.0309 10.7961 15.299 12.0857C13.567 13.3108 12.3803 15.084 11.7388 17.4053C11.1615 19.6621 11.0653 22.2413 11.4502 25.1429H23.7663V50H0V24.1757C0 15.7288 1.98855 9.34527 5.96564 5.02511C9.94273 0.640455 15.8763 -0.87483 23.7663 0.479255Z" fill="#FE6F07"/>
                  </svg>
                </div>
                <p className="text-foreground text-base leading-relaxed mb-8">
                  {review.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium text-sm">{review.name}</span>
                  <span className="text-muted-foreground text-sm">{review.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === page ? "bg-primary  ring-primary/30" :
                  i <= page ? "bg-primary/60" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
