import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import slideQuote from "@/assets/dashboard-slider-1.png";
import slideInvoices from "@/assets/dashboard-slider-2.png";
import slidePlanTree from "@/assets/dashboard-slider-3.png";
import slideEmployees from "@/assets/dashboard-slider-4.png";
import dashboard1 from "@/assets/dashboard-slider-5.png";
import dashboard2 from "@/assets/dashboard-slider-6.png";

const slides = [
  {
    number: 1,
    title: "Quote Calculator",
    description: "Easily estimate the cost of health insurance for your remote team with our user-friendly Quote Calculator. Get a quick and accurate quote tailored to your specific needs in just a few clicks.",
    gradient: "from-primary to-primary/80",
    image: slideQuote,
    features: [
      { title: "Customizable Options:", description: "Adjust age groups, geographic locations, and plan types to see real-time pricing updates based on your selections.", color: "bg-primary/10" },
      { title: "Instant Cost Estimation:", description: "Enter team details and regions to receive an immediate quote, helping you budget effectively for your team's health coverage.", color: "bg-primary/10" },
    ],
  },
  {
    number: 2,
    title: "Company Insurance Plan",
    description: "View and manage your company's insurance plan details, track enrollments, and monitor coverage status across your entire organization.",
    gradient: "from-primary to-accent",
    image: dashboard1,
    features: [
      { title: "Plan Overview:", description: "Get a comprehensive view of all active plans, enrollment status, and coverage details in one dashboard.", color: "bg-accent/10" },
      { title: "Quick Actions:", description: "Easily add members, modify plans, or request changes directly from the plan management interface.", color: "bg-accent/10" },
    ],
  },
  {
    number: 3,
    title: "Invoices and Payments",
    description: "Manage all your insurance billing and payments effortlessly with our comprehensive Online Invoices system. Keep track of invoices, view payment schedules, and ensure transparency in your financial transactions.",
    gradient: "from-accent to-accent/70",
    image: slideInvoices,
    features: [
      { title: "Easy Invoice Management:", description: "Access, view, and manage all invoices directly through the platform. Track payment due dates, amounts, and status updates in one centralized location.", color: "bg-accent/10" },
      { title: "Multiple Payment Options:", description: "Pay invoices securely using various methods, including credit cards and direct debit. Enable recursive payments for automatic billing.", color: "bg-accent/10" },
    ],
  },
  {
    number: 4,
    title: "Company Insurance Tree",
    description: "Visualize your entire organization's insurance structure with our interactive plan tree. See coverage status at every level of your company hierarchy.",
    gradient: "from-accent via-accent/80 to-primary",
    image: dashboard2,
    features: [
      { title: "Hierarchical View:", description: "See your entire organization's insurance coverage in a tree format, helping you identify gaps and manage renewals.", color: "bg-primary/10" },
      { title: "Interactive Management:", description: "Assign plans, view documents, and manage renewals or cancellations directly through the interface.", color: "bg-primary/10" },
    ],
  },
  {
    number: 5,
    title: "Company Insurance Plan Tree",
    description: "Manage your entire insurance portfolio with our visual insurance plan tree. This feature allows you to view the status of each employee's insurance plan and make necessary adjustments with ease.",
    gradient: "from-accent to-accent/60",
    image: slidePlanTree,
    features: [
      { title: "Interactive Plan Management:", description: "Assign new plans, view detailed plan documents, and manage renewals or cancellations directly through the interactive interface.", color: "bg-accent/10" },
      { title: "Visual Hierarchical Structure:", description: "See your entire organization's insurance coverage in a tree format, helping you easily identify which employees are covered.", color: "bg-accent/10" },
    ],
  },
  {
    number: 6,
    title: "Employees Management",
    description: "Our platform simplifies the management of your team's insurance information. From adding new members to tracking dependents, the Member Management module provides all the tools you need.",
    gradient: "from-primary to-primary/70",
    image: slideEmployees,
    features: [
      { title: "Easy Member Addition and Updates:", description: "Quickly add new employees or update existing member information with a few clicks. The system supports bulk uploads for onboarding large teams.", color: "bg-primary/10" },
      { title: "Dependent Coverage Tracking:", description: "Keep track of dependents covered under each employee's plan, ensuring comprehensive coverage for all eligible family members.", color: "bg-primary/10" },
    ],
  },
];

const DashboardsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const slide = slides[current];

  return (
    <section id="products" className="py-16 lg:py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground">
              <span className="text-primary ">Localsurance</span> Internal Dashboard
            </h2>
            <p className="text-muted-foreground mt-2 font-semibold text-base">
              Streamline Your Insurance Management with Localsurance's Advanced Dashboard
            </p>
            <p className="text-muted-foreground mt-3 max-w-3xl mx-auto text-sm">
              Localsurance isn't just an insurance provider; it's a comprehensive platform designed to simplify and enhance your insurance management process. Our intuitive dashboard offers a suite of powerful tools that give you full control over your insurance policies and employee coverage. Here's how our technology can work for you:
            </p>
          </div>
        </AnimatedSection>

        {/* Carousel */}
        <div className="mt-12">
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 w-14 h-14 rounded-r-[50%] bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 z-10 w-14 h-14 rounded-l-[50%] bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          <div className="rounded-3xl overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[460px] relative">

              {/* Absolute gradient background — left 70% */}
              <div
                className={`absolute inset-y-0 left-0 w-[70%] rounded-3xl pointer-events-none z-0 bg-gradient-to-br ${slide.gradient}`}
              />

              {/* Left content */}
              <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary text-sm">{slide.number}.</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-2xl lg:text-3xl">{slide.title}</h3>
                </div>
                <p className="text-white/75 text-sm mb-8 leading-relaxed">{slide.description}</p>

                <div className="space-y-4">
                  {slide.features.map((feature) => (
                    <div key={feature.title} className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-sm">⚡</span>
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-foreground text-sm">{feature.title}</h4>
                          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right image */}
              <div className="w-full lg:w-[55%] flex items-end justify-center px-6 lg:px-10 pt-8 relative z-10">
                <div className="rounded-t-xl overflow-hidden shadow-2xl w-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === current ? "bg-primary w-3 h-3 ring-2 ring-primary/30" : 
                  i <= current ? "bg-primary/60" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardsSection;
