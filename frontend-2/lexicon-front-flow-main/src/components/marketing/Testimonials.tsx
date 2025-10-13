import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial { name: string; role: string; content: string; avatar: string; rating: number; }

const testimonials: Testimonial[] = [
  {
    name: "Alex Chen",
    role: "Software Engineer",
    content: "Lexicon helped me transition into machine learning. The AI chatbot was invaluable for clarifying complex concepts.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    role: "Product Designer",
    content: "The interactive lessons and gamification kept me motivated. I completed 20 courses in 3 months!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Data Analyst",
    content: "Best learning platform I've used. The progress tracking and personalized recommendations are spot-on.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Loved by Learners <span className="text-secondary">Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground">See what our community has to say about their learning experience.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name} className="hover:shadow-card transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
