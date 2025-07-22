import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, FileText, Code, Zap, ArrowRight } from "lucide-react";

const formats = [
  {
    icon: Play,
    title: "Video Lessons",
    count: "500+",
    description: "Engaging video content with practical examples",
    color: "text-purple-500",
    borderColor: "border-purple-500/30"
  },
  {
    icon: FileText,
    title: "Text Content",
    count: "300+",
    description: "In-depth articles and written tutorials",
    color: "text-cyan-500",
    borderColor: "border-cyan-500/30"
  },
  {
    icon: Code,
    title: "Code Labs",
    count: "150+",
    description: "Hands-on coding exercises and projects",
    color: "text-yellow-500",
    borderColor: "border-yellow-500/30"
  },
  {
    icon: Zap,
    title: "Quick Quizzes",
    count: "1000+",
    description: "Test your knowledge with instant feedback",
    color: "text-red-500",
    borderColor: "border-red-500/30"
  }
];

export const LearningFormats = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Diverse Learning Formats
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the format that works best for you
          </p>
        </div>

        {/* Formats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {formats.map((format, index) => (
            <Card key={index} className={`group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2 ${format.borderColor}`}>
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/80 group-hover:scale-105 transition-transform">
                    <format.icon className={`h-8 w-8 ${format.color}`} />
                  </div>

                  {/* Count */}
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">{format.count}</p>
                    <h3 className="text-xl font-semibold">{format.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {format.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-hero rounded-3xl p-12 text-center text-primary-foreground">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-xl opacity-90">
              Join thousands of professionals who are advancing their careers with Lexicon
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                See Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};