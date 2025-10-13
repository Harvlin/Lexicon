import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";

interface Tier {
  name: string;
  monthly: number; // base monthly price
  yearly: number; // effective monthly price when billed yearly
  highlight?: boolean;
  description: string;
  cta: string;
  features: string[];
  popular?: boolean;
  contact?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Get started with core learning features.",
    cta: "Get Started",
    features: [
      "Access to 5 starter courses",
      "Basic AI chatbot answers",
      "10 flashcard decks",
      "Weekly progress report",
    ],
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 12, // effective monthly (billed annually)
    highlight: true,
    popular: true,
    description: "Unlock full platform potential and personalization.",
    cta: "Start Pro Trial",
    features: [
      "Unlimited courses",
      "Advanced AI tutor (24/7)",
      "Unlimited flashcards & quizzes",
      "Custom learning paths",
      "Downloadable resources",
      "Priority support",
    ],
  },
  {
    name: "Teams",
    monthly: 79,
    yearly: 59,
    description: "Collaborative learning for teams & classrooms.",
    cta: "Contact Sales",
    contact: true,
    features: [
      "Everything in Pro",
      "Team analytics dashboard",
      "Group assignments & tracking",
      "Centralized billing",
      "SSO & advanced security",
      "Onboarding assistance",
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const discount = 100 - Math.round((tiers[1].yearly / tiers[1].monthly) * 100); // from pro tier
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">Pricing</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Simple <span className="text-primary">Transparent</span> Plans
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose a plan that matches your learning ambition.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-background/70 backdrop-blur px-3 py-2 rounded-full border shadow-sm">
            <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              type="button"
              aria-label={annual ? 'Switch to monthly billing' : 'Switch to annual billing'}
              aria-pressed={annual}
              onClick={() => setAnnual(a => !a)}
              className="relative h-6 w-11 rounded-full bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-gradient-primary transition-transform ${annual ? 'translate-x-5' : ''}`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual <span className="ml-1 inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Save {discount}%</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const activePrice = annual ? tier.yearly : tier.monthly;
            const billedNote = tier.monthly === 0 ? "" : annual ? `Billed yearly ($${(tier.yearly * 12).toLocaleString()}/yr)` : "Billed monthly";
            const showDiscount = annual && tier.monthly > 0 && tier.yearly < tier.monthly;
            return (
            <Card key={tier.name} className={`relative flex flex-col border-2 ${tier.highlight ? 'border-primary shadow-xl shadow-primary/20 bg-background/90 backdrop-blur' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-gradient-primary text-white px-4 py-1 text-xs font-semibold uppercase tracking-wide shadow">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-bold">{tier.name}</span>
                  {tier.highlight && <Zap className="h-5 w-5 text-primary animate-pulse" />}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-6 space-y-1">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-heading font-bold">{tier.monthly === 0 ? '$0' : `$${activePrice}`}</span>
                    {tier.monthly > 0 && <span className="text-muted-foreground ml-1 font-medium">/mo</span>}
                  </div>
                  {showDiscount && (
                    <div className="text-xs font-medium text-success flex items-center gap-1">
                      <span>Save {100 - Math.round((tier.yearly / tier.monthly) * 100)}%</span>
                    </div>
                  )}
                  {billedNote && <p className="text-xs text-muted-foreground mt-1">{billedNote}</p>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={tier.highlight ? 'default' : 'outline'} className={`w-full ${tier.highlight ? 'bg-primary hover:bg-primary-hover' : ''}`}>{tier.cta}</Button>
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
