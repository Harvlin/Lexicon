import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Mail, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube,
  ArrowUp
} from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Library", href: "/library" },
    { name: "Pricing", href: "/pricing" },
    { name: "API Documentation", href: "/docs" },
    { name: "Roadmap", href: "/roadmap" }
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help" },
    { name: "Learning Guides", href: "/guides" },
    { name: "Community", href: "/community" },
    { name: "Webinars", href: "/webinars" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Press Kit", href: "/press" },
    { name: "Partners", href: "/partners" }
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Settings", href: "/cookies" },
    { name: "Security", href: "/security" },
    { name: "Compliance", href: "/compliance" }
  ]
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Lexicon
                </span>
              </Link>
              
              <p className="text-muted-foreground max-w-md">
                Transform your learning journey with AI-powered micro-lessons, 
                smart study tools, and personalized progress tracking.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h3 className="font-semibold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Get the latest learning tips and platform updates
                </p>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="flex-1"
                    type="email"
                  />
                  <Button className="bg-gradient-hero hover:opacity-90">
                    <Mail className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 lg:col-span-3 gap-8">
              {/* Product */}
              <div className="space-y-4">
                <h3 className="font-semibold">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href} 
                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="font-semibold">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href} 
                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href} 
                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2024 Lexicon Learning Platform. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Back to Top */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollToTop}
              className="p-2"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};