import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Clock, 
  Target, 
  Zap, 
  BookOpen, 
  Code, 
  Video, 
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Micro-Learning",
      description: "5-15 minute bite-sized lessons that fit your busy schedule",
      color: "lesson-video"
    },
    {
      icon: Brain,
      title: "AI Study Tools",
      description: "Auto-generated summaries, quizzes, and flashcards powered by AI",
      color: "primary"
    },
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Custom study paths based on your goals and learning style",
      color: "accent"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn badges, track streaks, and level up your skills",
      color: "warning"
    }
  ];

  const learningTypes = [
    { icon: Video, title: "Video Lessons", count: "500+", color: "lesson-video" },
    { icon: BookOpen, title: "Text Content", count: "300+", color: "lesson-text" },
    { icon: Code, title: "Code Labs", count: "150+", color: "lesson-lab" },
    { icon: Zap, title: "Quick Quizzes", count: "1000+", color: "lesson-quiz" }
  ];

  const stats = [
    { label: "Active Learners", value: "50K+", icon: Users },
    { label: "Lessons Completed", value: "2M+", icon: BookOpen },
    { label: "Skills Mastered", value: "10K+", icon: TrendingUp },
    { label: "AI Interactions", value: "5M+", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">Lexicon</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 hero-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Learning
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Master Skills with{" "}
                  <span className="gradient-text">Micro-Learning</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Transform your career with bite-sized lessons, AI study tools, and 
                  personalized learning paths designed for busy professionals.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate('/register')}
                >
                  Start Learning
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/library')}
                >
                  Explore Content
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-learning rounded-3xl blur-3xl opacity-20" />
              <img 
                src={heroImage}
                alt="AI-powered learning platform"
                className="relative rounded-3xl shadow-learning w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Lexicon</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and schedule
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="lesson-card group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Diverse Learning Formats
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the format that works best for you
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningTypes.map((type, index) => (
              <div key={index} className={`lesson-card lesson-${type.color.split('-')[1]} group`}>
                <div className="flex items-center justify-between mb-4">
                  <type.icon className={`h-8 w-8 text-${type.color}`} />
                  <span className="text-2xl font-bold text-muted-foreground">{type.count}</span>
                </div>
                <h3 className="text-lg font-semibold">{type.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-learning relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are advancing their careers with Lexicon
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="success" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">Lexicon</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Lexicon. AI-powered learning for the future.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}