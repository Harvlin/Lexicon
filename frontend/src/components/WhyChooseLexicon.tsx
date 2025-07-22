import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Brain, Target, Trophy } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Micro-Learning",
    description: "5-15 minute bite-sized lessons that fit your busy schedule",
    gradient: "from-purple-500/20 to-blue-500/20"
  },
  {
    icon: Brain,
    title: "AI Study Tools",
    description: "Auto-generated summaries, quizzes, and flashcards powered by AI",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Target,
    title: "Personalized Plans",
    description: "Custom study paths based on your goals and learning style",
    gradient: "from-cyan-500/20 to-teal-500/20"
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn badges, track streaks, and level up your skills",
    gradient: "from-yellow-500/20 to-orange-500/20"
  }
];

export const WhyChooseLexicon = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">Lexicon</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform adapts to your learning style and schedule
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardContent className="p-6 h-full">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-105 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-foreground" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};