import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

const articles = [
  {
    image: news1,
    date: "August 31, 2023, 10:00 AM",
    title: "Remote Health Insurance Plans and Their Benefits",
    excerpt:
      "Customize age groups, geographic locations, and coverage types to view real-time plan options and pricing based on your preferences.",
  },
  {
    image: news2,
    date: "August 31, 2023, 10:00 AM",
    title: "Remote Health Insurance Plans and Their Benefits",
    excerpt:
      "Customize age groups, geographic locations, and coverage types to view real-time plan options and pricing based on your preferences.",
  },
  {
    image: news3,
    date: "August 31, 2023, 10:00 AM",
    title: "Remote Health Insurance Plans and Their Benefits",
    excerpt:
      "Customize age groups, geographic locations, and coverage types to view real-time plan options and pricing based on your preferences.",
  },
];

const NewsSection = () => {
  return (
    <section id="resources" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-4">
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
              Remote Health <span className="text-primary">Insurance News</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Our most popular content on remote health insurance!
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {articles.map((article, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group">
                <div className="overflow-hidden rounded-2xl mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {article.date}
                </p>
                <h3 className="font-display font-bold text-foreground text-base md:text-lg mb-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {article.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
