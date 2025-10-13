import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface FAQItem { q: string; a: string; }

const faqs: FAQItem[] = [
  {
  q: "What is Lexigrain?",
  a: "Lexigrain is an AI-powered learning platform that personalizes courses, quizzes, flashcards, and progress tracking to accelerate skill mastery.",
  },
  {
  q: "Can I use Lexigrain for free?",
    a: "Yes! Lexigrain is completely free. You get access to courses, flashcards, quizzes, and core AI assistance without any payments.",
  },
  {
    q: "How does the AI tutor work?",
    a: "The AI tutor uses context from your active course to provide targeted explanations, examples, and study strategies in real time.",
  },
  // Pricing and team billing removed – app is fully free
  {
    q: "Will I get a certificate?",
    a: "Yes. Completing eligible courses awards shareable certificates and achievement badges.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-20 md:py-32 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">FAQs</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">Fast answers to common questions about the platform.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <Card key={item.q} className={`border-2 transition-all ${open ? 'border-primary shadow-md' : ''}`}>
                <button
                  className="w-full text-left p-5 flex items-start gap-4"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  aria-expanded={open}
                  aria-controls={`faq-${idx}`}
                >
                  <span className={`mt-1 h-6 w-6 flex items-center justify-center rounded-full border text-xs font-semibold ${open ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted'}`}>{idx+1}</span>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-lg mb-1">{item.q}</p>
                    <div id={`faq-${idx}`} className={`overflow-hidden transition-[max-height] duration-500 ${open ? 'max-h-48' : 'max-h-0'}`}> 
                      <p className="text-muted-foreground leading-relaxed pr-4 pb-2 text-sm md:text-base">{item.a}</p>
                    </div>
                  </div>
                  {open ? <Minus className="h-5 w-5 text-primary mt-1" /> : <Plus className="h-5 w-5 text-muted-foreground mt-1" />}
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
