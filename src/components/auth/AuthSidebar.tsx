import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import authCrystal from "@/assets/auth-crystal.png";
import testimonialAvatar from "@/assets/testimonial-avatar.jpg";

const testimonials = [
  {
    text: "Localsurance plans for remote health has been a game-changer for me, offering seamless and convenient access to healthcare.",
    name: "Guy Hawkins",
    role: "Marketing Coordinator",
  },
  {
    text: "The coverage options are incredibly flexible. Our team across 5 countries all have excellent health insurance now.",
    name: "Sarah Chen",
    role: "HR Director",
  },
  {
    text: "Setting up insurance for our remote team used to take weeks. With Localsurance, it took less than a day.",
    name: "James Miller",
    role: "Operations Manager",
  },
  {
    text: "Best remote health insurance platform we've used. The dashboard makes managing everything so simple.",
    name: "Anna Rodriguez",
    role: "CEO & Founder",
  },
];

const socialIcons = [
  { name: "Facebook", path: "M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" },
  { name: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { name: "Google", path: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.8 4.133-1.147 1.147-2.933 2.4-6.04 2.4-4.813 0-8.573-3.88-8.573-8.693s3.76-8.693 8.573-8.693c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" },
  { name: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { name: "X", path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" },
];

const AuthSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex w-[380px] min-h-screen bg-gradient-to-b from-primary to-[hsl(217,91%,40%)] rounded-2xl m-4 p-8 flex-col justify-between relative overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-1 z-10">
        <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <span className="font-display font-bold text-primary-foreground text-xs">●</span>
        </div>
        <span className="font-display font-bold text-lg text-primary-foreground">
          <span className="text-primary-foreground">Local</span>
          <span className="text-primary-foreground/80">surance</span>
        </span>
      </div>

      {/* Hero Text */}
      <div className="z-10 mt-8">
        <h2 className="font-display text-3xl font-bold text-primary-foreground leading-tight mb-4">
          Start your<br />journey with us
        </h2>
        <p className="text-primary-foreground/70 text-sm leading-relaxed">
          Discover the world's best remote health insurance tailored for you and your team, ensuring optimal coverage and peace of mind wherever you are
        </p>
      </div>

      {/* Crystal Image */}
      <div className="flex justify-center z-10 my-6">
        <img src={authCrystal} alt="" className="w-48 h-48 object-contain" />
      </div>

      {/* Testimonial Card */}
      <div className="z-10">
        <div className="bg-primary-foreground/10 backdrop-blur-md rounded-xl p-5 border border-primary-foreground/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
                {testimonials[activeIndex].text}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonialAvatar}
                  alt={testimonials[activeIndex].name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-primary-foreground font-semibold text-sm">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-primary-foreground/60 text-xs">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-primary-foreground" : "bg-primary-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex gap-3 mt-6 z-10">
        {socialIcons.map((icon) => (
          <a
            key={icon.name}
            href="#"
            className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
          >
            <svg className="w-4 h-4 fill-primary-foreground" viewBox="0 0 24 24">
              <path d={icon.path} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AuthSidebar;
