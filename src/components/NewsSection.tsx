import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

const articles = [
  {
    image: news1,
    date: "March 10, 2026",
    category: "Industry",
    title: "Remote Health Insurance Trends to Watch in 2026",
    excerpt: "Stay ahead of the curve with the latest trends shaping remote workforce health coverage.",
  },
  {
    image: news2,
    date: "March 5, 2026",
    category: "Family",
    title: "How Family Coverage is Evolving for Remote Workers",
    excerpt: "Discover how modern health plans are adapting to serve families of remote employees better.",
  },
  {
    image: news3,
    date: "Feb 28, 2026",
    category: "Healthcare",
    title: "Top Healthcare Facilities Partnered with Our Network",
    excerpt: "Explore our growing network of premium healthcare providers and hospitals.",
  },
];

const NewsSection = () => {
  return (
    <section id="resources" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
                Recent Health <span className="text-accent">Insurance News</span>
              </h2>
              <p className="text-muted-foreground mt-2">Stay informed with the latest in health coverage.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-primary font-medium text-sm hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <AnimatedSection key={article.title} delay={index * 0.1}>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border">
                <div className="overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{article.category}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
