import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Users, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for getting started",
    icon: Star,
    popular: false,
    features: [
      "Access limited number of lessons per week",
      "Basic AI tools (summarize only)",
      "Community support",
      "Basic progress tracking"
    ],
    limitations: [
      "Limited to 5 lessons per week",
      "No quiz or flashcard features",
      "No personalized study plans"
    ]
  },
  {
    name: "Pro",
    price: 2,
    period: "month",
    description: "Most popular for serious learners",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited access to all lessons",
      "Quizzes, flashcards, and study plans",
      "Full AI study tools suite",
      "Progress analytics",
      "Priority support"
    ],
    limitations: []
  },
  {
    name: "Elite",
    price: 5,
    period: "month",
    description: "Advanced features + AI coaching",
    icon: Crown,
    popular: false,
    features: [
      "Everything in Pro",
      "Advanced AI Q&A assistance",
      "Personalized coaching",
      "Early access to content",
      "Premium support"
    ],
    limitations: []
  }
];

const teamPlans = [
  { name: "Startup", price: 10, users: "up to 10 users", icon: Users },
  { name: "Growth", price: 50, users: "up to 50 users", icon: Building2 },
  { name: "Enterprise", price: "Custom", users: "unlimited", icon: Crown }
];

export const Pricing = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose your learning plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, upgrade when you're ready. All plans include access to our core learning platform.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-accent shadow-accent/20 scale-105' 
                  : 'hover:shadow-accent/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-accent text-accent-foreground' 
                    : 'bg-gradient-to-br from-muted to-muted/50'
                }`}>
                  <plan.icon className="h-8 w-8" />
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
                
                <div className="pt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  {plan.price === 1 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Then $5/month after trial
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-hero hover:opacity-90' 
                      : ''
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.price === 1 ? 'Start Free Trial' : `Get ${plan.name}`}
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">What's included:</p>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <hr className="border-border/50" />
                      <p className="font-semibold text-sm text-muted-foreground">Not included:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-3">
                          <div className="h-4 w-4 border border-muted-foreground/30 rounded-full mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center bg-card p-8 rounded-2xl border border-border/50">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Need something custom?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Looking for enterprise features, custom integrations, or volume discounts? 
              Let's build a plan that fits your organization's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
              <Button variant="link">
                View Enterprise Features →
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="text-center pt-16">
          <p className="text-muted-foreground mb-4">Have questions about our pricing?</p>
          <Button variant="link" className="text-accent hover:text-accent-light">
            View Pricing FAQ →
          </Button>
        </div>

        {/* Guarantee */}
        <div className="text-center pt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            ✨ 14-day money-back guarantee on all plans
          </p>
          <p className="text-sm text-muted-foreground">
            🔒 Cancel anytime, no questions asked
          </p>
        </div>
      </div>
    </section>
  );
};