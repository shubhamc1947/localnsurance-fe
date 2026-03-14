import { Heart, MessageCircle, Mail, Twitter, Phone } from "lucide-react";

const socials = [
  { icon: "fb", label: "Facebook" },
  { icon: "yt", label: "YouTube" },
  { icon: "g", label: "Google" },
  { icon: "li", label: "LinkedIn" },
  { icon: "x", label: "X" },
];

const OnboardingSidebar = () => {
  return (
    <div className="relative w-full h-full min-h-[700px] rounded-2xl overflow-hidden flex flex-col justify-between p-8"
      style={{
        background: "linear-gradient(135deg, hsl(217 91% 45%) 0%, hsl(217 91% 60%) 40%, hsl(25 95% 53%) 100%)",
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(25 95% 53% / 0.8) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <Heart className="w-6 h-6 text-accent" fill="hsl(var(--accent))" />
          <span className="text-xl font-display font-bold text-primary-foreground">
            <span className="font-extrabold">Local</span>surance
          </span>
        </div>

        {/* Chat with us */}
        <div className="mb-8">
          <h3 className="text-primary-foreground font-display font-bold text-lg mb-1">Chat with us:</h3>
          <p className="text-primary-foreground/70 text-sm mb-4">
            Speak to our friendly team via live chat
          </p>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-3 text-primary-foreground text-sm hover:underline">
              <MessageCircle className="w-4 h-4" /> Start a live chat
            </a>
            <a href="#" className="flex items-center gap-3 text-primary-foreground text-sm hover:underline">
              <Mail className="w-4 h-4" /> Shoot us an email
            </a>
            <a href="#" className="flex items-center gap-3 text-primary-foreground text-sm hover:underline">
              <Twitter className="w-4 h-4" /> Message us on Twitter
            </a>
          </div>
        </div>

        {/* Call us */}
        <div>
          <h3 className="text-accent font-display font-bold text-lg mb-1">Call us:</h3>
          <p className="text-primary-foreground/70 text-sm mb-3">
            Call our team Mon-Fri from 8am to 5pm
          </p>
          <a href="tel:+15550000000" className="flex items-center gap-3 text-primary-foreground text-sm">
            <Phone className="w-4 h-4" /> +1 (555) 000-0000
          </a>
        </div>
      </div>

      {/* Social icons */}
      <div className="relative z-10 flex items-center gap-4 mt-8">
        {socials.map((s) => (
          <button
            key={s.icon}
            className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            aria-label={s.label}
          >
            <span className="text-xs font-bold uppercase">{s.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingSidebar;
