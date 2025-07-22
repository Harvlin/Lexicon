import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, BookOpen, Brain, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up & set goals",
    description: "Create your profile, select your role, and define your learning objectives",
    details: ["Choose your career path", "Set weekly time commitment", "Define skill targets"],
    color: "text-primary"
  },
  {
    icon: BookOpen,
    title: "Pick a micro-lesson",
    description: "Browse our curated library of 5-15 minute bite-sized content",
    details: ["Video snippets", "Interactive code labs", "Quick text lessons"],
    color: "text-accent"
  },
  {
    icon: Brain,
    title: "Use AI tools",
    description: "Leverage AI to enhance your learning with smart study assistance",
    details: ["Auto-generated summaries", "Instant quizzes", "Smart flashcards"],
    color: "text-success"
  },
  {
    icon: TrendingUp,
    title: "Track progress & earn badges",
    description: "Monitor your growth and stay motivated with gamified achievements",
    details: ["Learning streaks", "Skill assessments", "Achievement badges"],
    color: "text-warning"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            How Lexicon works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform makes learning efficient and engaging through a proven 4-step process
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Arrow (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                </div>
              )}

              <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:shadow-accent/20">
                <CardContent className="p-6 text-center space-y-4">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted/50 text-sm font-bold mb-4">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center justify-center">
                        <Badge variant="outline" className="text-xs">
                          {detail}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready to start your learning journey?</h3>
            <p className="text-muted-foreground">
              Join thousands of learners who are already advancing their careers with Lexicon
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-hero hover:opacity-90">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              View Sample Lesson
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Average 15 min/day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>85% completion rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span>3x faster learning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};