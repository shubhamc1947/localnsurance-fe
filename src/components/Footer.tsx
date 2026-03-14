const footerLinks = {
  Company: ["About Us", "Careers", "Press", "Contact"],
  Products: ["Health Insurance", "Dental Plans", "Vision Coverage", "Wellness Programs"],
  Resources: ["Blog", "Help Center", "API Docs", "Partner Program"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-xs">●</span>
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-primary">Local</span>
                <span>surance</span>
              </span>
            </div>
            <p className="text-background/60 text-sm">
              Empowering remote workforces with comprehensive health insurance solutions worldwide.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © 2026 Localsurance. All rights reserved. Health insurance plans are underwritten by licensed insurance partners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
