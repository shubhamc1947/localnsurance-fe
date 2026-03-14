import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AnimatedSection from "./AnimatedSection";
import ctaDashboard from "@/assets/why-choose-dashboard.png";

const CTASection = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
  };

  return (
    <section className="bg-background py-20 px-4" id="contact">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Still not sure which plan is right for you?
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Contact our sales team for personalized coverage!
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          {/* 
            Grid forces both columns to the same row height.
            The image uses object-cover + h-full to fill that height.
          */}
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl gap-3 lg:grid-cols-2">
            {/* Left — image fills entire grid cell */}
            <div className="relative min-h-[320px] bg-cta-bg">
              <img
                src={ctaDashboard}
                alt="Analytics dashboard preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Right — contact form, vertically centered */}
            <div className="flex items-center bg-background p-8 sm:p-12 border-1 ">
              <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-cta-text text-[#6C737E]">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="focus-visible:ring-cta-action bg-[#F6F6F6] broder-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-cta-text text-[#6C737E]">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="focus-visible:ring-cta-action bg-[#F6F6F6] broder-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-cta-text text-[#6C737E]">
                    Company domain email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="focus-visible:ring-cta-action bg-[#F6F6F6] broder-0"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-cta-text text-[#6C737E]">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="focus-visible:ring-cta-action bg-[#F6F6F6] broder-0"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full px-10 font-semibold"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
