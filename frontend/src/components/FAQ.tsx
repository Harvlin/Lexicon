import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Do I need any software installed?",
    answer: "No! Lexicon runs entirely in your web browser. You can access all features including video lessons, interactive code labs, and AI tools without downloading anything. We're also fully compatible with mobile devices."
  },
  {
    question: "Can I share my subscription with a team?",
    answer: "Yes! Our Team plan supports up to 5 members and includes team progress dashboards, shared study plans, and admin controls. For larger organizations, we offer custom enterprise solutions with bulk pricing."
  },
  {
    question: "What if I miss a day—will I lose my streak?",
    answer: "We understand life happens! You get one 'streak freeze' per week, and we offer gentle reminders rather than harsh penalties. Our goal is to support your learning journey, not stress you out."
  },
  {
    question: "How does the AI-powered learning work?",
    answer: "Our AI analyzes lesson content to generate personalized summaries, create practice quizzes, build flashcard decks, and answer your questions. It also tracks your progress to recommend the most relevant content for your learning goals."
  },
  {
    question: "What types of content can I learn from?",
    answer: "We offer video snippets (5-15 minutes), interactive code labs, text-based articles, and downloadable cheat sheets. All content is designed for micro-learning and can be consumed during short breaks in your day."
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Lexicon is web-based and fully responsive on mobile browsers. A dedicated mobile app is on our roadmap and will be available after we complete the web platform."
  },
  {
    question: "How do you recommend content to me?",
    answer: "Our recommendation engine uses collaborative filtering (similar learners), content-based similarity (topic matching), your role and goals, and trending content in your field to suggest the most relevant lessons."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about Lexicon's AI-powered learning platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 mb-4"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Support */}
        <div className="text-center space-y-6">
          <div className="bg-card p-8 rounded-2xl border border-border/50">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-accent text-accent-foreground mx-auto">
                <MessageCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-bold">Still have questions?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our support team is here to help! Get answers to your questions about features, 
                pricing, or technical issues.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                  Contact Support
                </Button>
                <Button size="lg" variant="outline">
                  View Help Center
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium mb-1">📚 Getting Started</p>
              <Button variant="link" className="p-0 h-auto text-accent">
                Quick Start Guide →
              </Button>
            </div>
            <div className="text-center">
              <p className="font-medium mb-1">💡 Feature Guides</p>
              <Button variant="link" className="p-0 h-auto text-accent">
                How-to Tutorials →
              </Button>
            </div>
            <div className="text-center">
              <p className="font-medium mb-1">🎯 Best Practices</p>
              <Button variant="link" className="p-0 h-auto text-accent">
                Learning Tips →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};