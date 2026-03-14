import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import whyChooseDashboard from "@/assets/why-choose-dashboard.png";
import whyChoosePlatform from "@/assets/why-choose-platform.png";

const topFeatures = [
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31.25 45.8332C30.3958 45.8332 29.6875 45.1248 29.6875 44.2707V5.729C29.6875 4.87484 30.3958 4.1665 31.25 4.1665C32.1042 4.1665 32.8125 4.87484 32.8125 5.729V44.2707C32.8125 45.1248 32.1042 45.8332 31.25 45.8332Z" fill="#0066FF"/>
        <path opacity="0.4" d="M12.4993 41.6668H24.9994V8.3335H12.4993C7.89518 8.3335 4.16602 12.0627 4.16602 16.6668V33.3335C4.16602 37.9377 7.89518 41.6668 12.4993 41.6668Z" fill="#0066FF"/>
        <path opacity="0.4" d="M37.5 41.6668H31.25V8.3335H37.5C42.1042 8.3335 45.8333 12.0627 45.8333 16.6668V33.3335C45.8333 37.9377 42.1042 41.6668 37.5 41.6668Z" fill="#0066FF"/>
        <path d="M14.584 33.8543C13.7298 33.8543 13.0215 33.146 13.0215 32.2918V17.7085C13.0215 16.8543 13.7298 16.146 14.584 16.146C15.4382 16.146 16.1465 16.8543 16.1465 17.7085V32.2918C16.1465 33.146 15.4382 33.8543 14.584 33.8543Z" fill="#0066FF"/>
      </svg>
    ),
    title: "Instant Quotes and Easy Enrollment",
    description: "Forget waiting days for a quote. Our quick and simple process provides you with a detailed quote in under 2 minutes. Plus, enrolling your team is hassle-free with our streamlined platform.",
  },
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.3965 43.2502L43.8965 41.7502C44.6673 40.5835 45.1257 39.1668 45.1257 37.6668C45.1257 33.5418 41.7923 30.2085 37.6673 30.2085C33.5423 30.2085 30.209 33.5418 30.209 37.6668C30.209 41.7918 33.5423 45.1252 37.6673 45.1252C39.1882 45.1252 40.584 44.6668 41.7506 43.896L43.2506 45.396C43.5423 45.6877 43.9382 45.8335 44.3132 45.8335C44.709 45.8335 45.084 45.6877 45.3756 45.396C45.9798 44.7918 45.9798 43.8335 45.3965 43.2502Z" fill="#0066FF"/>
        <path opacity="0.4" d="M4.22918 30.479C4.22918 30.5415 4.1875 30.6248 4.1875 30.6873C6.10417 34.5207 9.22919 37.6665 13.0625 39.5623C13.125 39.5623 13.2083 39.5207 13.2708 39.5207C12.5625 37.104 12.0208 34.6248 11.625 32.1456C9.12502 31.729 6.64584 31.1873 4.22918 30.479Z" fill="#0066FF"/>
        <path opacity="0.4" d="M39.7292 13.3956C37.7708 9.29148 34.4583 5.979 30.375 4.0415C31.125 6.52067 31.75 9.06235 32.1667 11.604C34.7083 12.0207 37.25 12.6248 39.7292 13.3956Z" fill="#0066FF"/>
        <path opacity="0.4" d="M4.02148 13.396C6.52148 12.646 9.06318 12.021 11.6048 11.6044C12.0215 9.1252 12.5423 6.66687 13.2507 4.2502C13.1882 4.2502 13.1048 4.2085 13.0423 4.2085C9.12565 6.146 5.93815 9.41684 4.02148 13.396Z" fill="#0066FF"/>
        <path opacity="0.4" d="M28.7923 11.1667C28.2923 8.45832 27.6673 5.75002 26.7715 3.12502C26.7298 2.97919 26.7298 2.8542 26.709 2.68754C25.1673 2.31254 23.5423 2.0625 21.8757 2.0625C20.1882 2.0625 18.584 2.2917 17.0215 2.68754C17.0007 2.83337 17.0215 2.95835 16.9798 3.12502C16.1048 5.75002 15.459 8.45832 14.959 11.1667C19.5632 10.6667 24.1882 10.6667 28.7923 11.1667Z" fill="#0066FF"/>
        <path opacity="0.4" d="M11.1667 14.9585C8.43749 15.4585 5.74999 16.0835 3.12499 16.9793C2.97916 17.021 2.85414 17.021 2.68747 17.0418C2.31247 18.5835 2.0625 20.2085 2.0625 21.8752C2.0625 23.5627 2.29164 25.1668 2.68747 26.7293C2.83331 26.7501 2.95832 26.7294 3.12499 26.771C5.74999 27.646 8.43749 28.2919 11.1667 28.7919C10.6667 24.1877 10.6667 19.5627 11.1667 14.9585Z" fill="#0066FF"/>
        <path opacity="0.4" d="M41.0416 17.0418C40.8958 17.0418 40.7708 17.021 40.6042 16.9793C37.9792 16.1043 35.2708 15.4585 32.5625 14.9585C33.0833 19.5627 33.0833 24.1877 32.5625 28.771C35.2708 28.271 37.9792 27.646 40.6042 26.7502C40.75 26.7085 40.875 26.7294 41.0416 26.7085C41.4166 25.146 41.6667 23.5418 41.6667 21.8543C41.6667 20.2085 41.4375 18.6043 41.0416 17.0418Z" fill="#0066FF"/>
        <path opacity="0.4" d="M14.959 32.5835C15.459 35.3127 16.084 38.0001 16.9798 40.6251C17.0215 40.771 17.0007 40.8959 17.0215 41.0626C18.584 41.4376 20.1882 41.6877 21.8757 41.6877C23.5423 41.6877 25.1673 41.4584 26.709 41.0626C26.7298 40.9168 26.7298 40.7918 26.7715 40.6251C27.6465 38.0001 28.2923 35.3127 28.7923 32.5835C26.5007 32.8335 24.1882 33.021 21.8757 33.021C19.5632 33.0001 17.2507 32.8335 14.959 32.5835Z" fill="#0066FF"/>
        <path opacity="0.4" d="M14.4785 14.479C13.8535 19.3957 13.8535 24.354 14.4785 29.2915C19.3952 29.9165 24.3535 29.9165 29.291 29.2915C29.916 24.3748 29.916 19.4165 29.291 14.479C24.3535 13.854 19.3952 13.854 14.4785 14.479Z" fill="#0066FF"/>
      </svg>
    ),
    title: "Worldwide Coverage Tailored to Local Needs",
    description: "With coverage in over 180 countries, your employees are protected wherever they live and work. Our plans are designed to meet local healthcare standards, ensuring your team receives the best care possible.",
  },
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.6875 42.0836V42.6877C31.6042 44.6669 27.9167 45.8336 23.9583 45.8336C19.9375 45.8336 16.1875 44.6252 13.0625 42.5627V42.0836C13.0625 37.2294 17.9167 33.271 23.875 33.271C29.8542 33.271 34.6875 37.2294 34.6875 42.0836Z" fill="#0066FF"/>
        <path opacity="0.4" d="M43.7493 26.0417C43.7493 33.0208 40.1452 39.1458 34.6869 42.6875V42.0834C34.6869 37.2292 29.8535 33.2708 23.8743 33.2708C17.916 33.2708 13.0618 37.2292 13.0618 42.0834V42.5625C7.70768 39.0208 4.16602 32.9583 4.16602 26.0417C4.16602 15.1042 13.0202 6.25 23.9577 6.25C26.6868 6.25 29.291 6.79165 31.666 7.79165C31.3952 8.62498 31.2493 9.5 31.2493 10.4167C31.2493 11.9792 31.6869 13.4583 32.4577 14.7083C32.8744 15.4167 33.416 16.0624 34.041 16.6041C35.4993 17.9374 37.4368 18.75 39.5827 18.75C40.4993 18.75 41.3743 18.6041 42.1868 18.3125C43.1868 20.6875 43.7493 23.3125 43.7493 26.0417Z" fill="#0066FF"/>
        <path d="M45.7708 4.85436C44.2708 3.14603 42.0417 2.0835 39.5833 2.0835C37.25 2.0835 35.125 3.04188 33.6042 4.60438C32.7292 5.50021 32.0625 6.58348 31.6667 7.79181C31.3958 8.62514 31.25 9.50016 31.25 10.4168C31.25 11.9793 31.6875 13.4585 32.4583 14.7085C32.875 15.4168 33.4167 16.0626 34.0417 16.6043C35.5 17.9376 37.4375 18.7502 39.5833 18.7502C40.5 18.7502 41.375 18.6043 42.1875 18.3126C44.1042 17.7084 45.7083 16.396 46.7083 14.7085C47.1458 14.0002 47.4792 13.1876 47.6667 12.3543C47.8333 11.7293 47.9167 11.0835 47.9167 10.4168C47.9167 8.29183 47.1042 6.33353 45.7708 4.85436ZM42.6875 11.9376H41.1458V13.5627C41.1458 14.4168 40.4375 15.1252 39.5833 15.1252C38.7292 15.1252 38.0208 14.4168 38.0208 13.5627V11.9376H36.4792C35.625 11.9376 34.9167 11.2293 34.9167 10.3751C34.9167 9.52096 35.625 8.81262 36.4792 8.81262H38.0208V7.33354C38.0208 6.47937 38.7292 5.77104 39.5833 5.77104C40.4375 5.77104 41.1458 6.47937 41.1458 7.33354V8.81262H42.6875C43.5417 8.81262 44.25 9.52096 44.25 10.3751C44.25 11.2293 43.5625 11.9376 42.6875 11.9376Z" fill="#0066FF"/>
        <path d="M23.8756 30.6873C27.1088 30.6873 29.7298 28.0663 29.7298 24.8332C29.7298 21.6 27.1088 18.979 23.8756 18.979C20.6425 18.979 18.0215 21.6 18.0215 24.8332C18.0215 28.0663 20.6425 30.6873 23.8756 30.6873Z" fill="#0066FF"/>
      </svg>
    ),
    title: "Flexible Plans for Every Team Size",
    description: "Whether you have 5 employees or 500, we offer a range of customizable plans that grow with your business. Select from our Basic, Medium, or Pro plans, or customize your own to suit specific needs.",
  },
];

const bottomFeatures = [
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.8327 44.271H4.16602C3.31185 44.271 2.60352 44.9793 2.60352 45.8335C2.60352 46.6877 3.31185 47.396 4.16602 47.396H45.8327C46.6869 47.396 47.3952 46.6877 47.3952 45.8335C47.3952 44.9793 46.6869 44.271 45.8327 44.271Z" fill="#0066FF"/>
        <path opacity="0.4" d="M35.4167 4.1665H14.5833C8.33333 4.1665 6.25 7.89567 6.25 12.4998V45.8332H43.75V12.4998C43.75 7.89567 41.6667 4.1665 35.4167 4.1665Z" fill="#0066FF"/>
        <path d="M29.291 31.25H20.6868C19.6243 31.25 18.7285 32.125 18.7285 33.2083V45.8333H31.2285V33.2083C31.2493 32.125 30.3743 31.25 29.291 31.25Z" fill="#0066FF"/>
        <path d="M30.2077 16.1458H26.5618V12.5C26.5618 11.6458 25.8535 10.9375 24.9993 10.9375C24.1452 10.9375 23.4368 11.6458 23.4368 12.5V16.1458H19.791C18.9368 16.1458 18.2285 16.8542 18.2285 17.7083C18.2285 18.5625 18.9368 19.2708 19.791 19.2708H23.4368V22.9167C23.4368 23.7708 24.1452 24.4792 24.9993 24.4792C25.8535 24.4792 26.5618 23.7708 26.5618 22.9167V19.2708H30.2077C31.0618 19.2708 31.7702 18.5625 31.7702 17.7083C31.7702 16.8542 31.0618 16.1458 30.2077 16.1458Z" fill="#0066FF"/>
      </svg>

    ),
    title: "Comprehensive Health Benefits",
    description: "From routine check-ups and emergency medical care to dental, vision, and wellness programs, our plans cover a wide range of health services to keep your team healthy and productive.",
  },
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M38.1868 11.8123L13.7285 36.2706C12.8119 37.1873 11.2702 37.0623 10.5202 35.979C7.93685 32.2081 6.41602 27.7498 6.41602 23.1665V14.0207C6.41602 12.3123 7.70769 10.3748 9.29103 9.729L20.8952 4.979C23.5202 3.89567 26.4369 3.89567 29.0619 4.979L37.4785 8.41649C38.8744 8.97899 39.2285 10.7707 38.1868 11.8123Z" fill="#0066FF"/>
        <path d="M40.1462 14.6669C41.5003 13.521 43.5629 14.5002 43.5629 16.271V23.1669C43.5629 33.3544 36.167 42.896 26.0629 45.6877C25.3754 45.8752 24.6254 45.8752 23.917 45.6877C20.9587 44.8543 18.2087 43.4586 15.8545 41.6252C14.8545 40.8544 14.7504 39.3961 15.6254 38.5002C20.167 33.8544 33.4587 20.3127 40.1462 14.6669Z" fill="#0066FF"/>
      </svg>
    ),
    title: "Dependents Coverage Included",
    description: "Peace of mind goes beyond the individual. Our insurance plans include coverage for dependents, so your employees can rest easy knowing their loved ones are protected too.",
  },
  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M37.5 39.2916H35.9167C34.25 39.2916 32.6667 39.9374 31.5 41.1041L27.9375 44.6249C26.3125 46.2291 23.6667 46.2291 22.0417 44.6249L18.4792 41.1041C17.3125 39.9374 15.7083 39.2916 14.0625 39.2916H12.5C9.04167 39.2916 6.25 36.5208 6.25 33.1042V10.3749C6.25 6.95827 9.04167 4.1875 12.5 4.1875H37.5C40.9583 4.1875 43.75 6.95827 43.75 10.3749V33.1042C43.75 36.5 40.9583 39.2916 37.5 39.2916Z" fill="#0066FF"/>
        <path d="M21.625 30.229H16.0416C15.125 30.229 14.2708 29.7915 13.7291 29.0415C13.2083 28.3331 13.0833 27.4582 13.3333 26.6249C14.0625 24.3957 15.8541 23.1873 17.4375 22.1039C19.1041 20.9789 20.0416 20.2707 20.0416 19.0623C20.0416 17.979 19.1666 17.104 18.0833 17.104C17 17.104 16.125 17.979 16.125 19.0623C16.125 19.9165 15.4167 20.6248 14.5625 20.6248C13.7083 20.6248 13 19.9165 13 19.0623C13 16.2707 15.2708 13.979 18.0833 13.979C20.8958 13.979 23.1666 16.2498 23.1666 19.0623C23.1666 21.9998 20.9583 23.4998 19.1875 24.7081C18.0833 25.4581 17.0416 26.1665 16.5208 27.104H21.6041C22.4583 27.104 23.1666 27.8123 23.1666 28.6665C23.1666 29.5206 22.4792 30.229 21.625 30.229Z" fill="#0066FF"/>
        <path d="M33.4173 30.2291C32.5631 30.2291 31.8548 29.5208 31.8548 28.6666V27.2291H27.7715C27.7715 27.2291 27.7715 27.2291 27.7507 27.2291C26.7298 27.2291 25.7923 26.6875 25.2715 25.8125C24.7507 24.9166 24.7507 23.8125 25.2715 22.9375C26.6882 20.5 28.334 17.7291 29.834 15.3124C30.5007 14.2499 31.7715 13.7708 32.959 14.1042C34.1465 14.4583 34.9798 15.5416 34.959 16.7916V24.125H35.4173C36.2715 24.125 36.9798 24.8333 36.9798 25.6875C36.9798 26.5416 36.2715 27.25 35.4173 27.25H34.9798V28.6875C34.9798 29.5417 34.2923 30.2291 33.4173 30.2291ZM31.8548 18C30.6256 20 29.3548 22.1458 28.209 24.1041H31.8548V18Z" fill="#0066FF"/>
      </svg>
    ),
    title: "24/7 Customer Support and Health Assistance",
    description: "Our dedicated support team is available around the clock to assist with any questions or emergencies. We also provide 24/7 health assistance to help your team navigate healthcare needs anytime, anywhere.",
  },
];

const WhyChooseSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24  bg-[#F6F6F6]">
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
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-base mb-1 text-[#1F1F1F]">{feature.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    {index < topFeatures.length - 1 && (
                      <div className="mt-6 h-px" style={{ backgroundImage: "repeating-linear-gradient(90deg, #C0D9FF 0, #C0D9FF 5px, transparent 5px, transparent 10px)" }} />
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
                      <div className="w-10 h-10  flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-base mb-1 text-[#1F1F1F]">{feature.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    {index < bottomFeatures.length - 1 && (
                      <div className="mt-6 h-px" style={{ backgroundImage: "repeating-linear-gradient(90deg, #C0D9FF 0, #C0D9FF 5px, transparent 5px, transparent 10px)" }} />
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
          <div className="flex items-center mt-12">
            <div className="flex-1 h-px bg-[#C0D9FF]" />
            <div className="flex-shrink-0 rounded-full border border-[#C0D9FF] p-3 bg-[#F6F6F6]">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-3 text-base font-semibold">
                View Demo
              </Button>
            </div>
            <div className="flex-1 h-px bg-[#C0D9FF]" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyChooseSection;
