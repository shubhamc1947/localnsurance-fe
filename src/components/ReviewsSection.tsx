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
];

const ReviewsSection = () => {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(reviews.length / perPage);

  const prev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const next = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
              <span className="text-accent">Customer</span> Reviews
            </h2>
          </div>
        </AnimatedSection>

        <div className="relative">
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {visible.map((review) => (
              <div key={review.name} className="bg-background rounded-2xl p-8 shadow-sm border border-border">
                {/* Orange quote marks */}
                <div className="text-accent font-display font-black text-5xl leading-none mb-4">"</div>
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
                  i === page ? "bg-primary ring-2 ring-primary/30" :
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
