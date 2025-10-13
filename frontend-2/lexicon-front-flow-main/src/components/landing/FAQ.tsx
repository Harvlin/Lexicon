import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface QA { q: string; a: string; }
const faqs: QA[] = [
  { q: 'What is Lexigrain?', a: 'Lexigrain is an AI‑guided micro‑learning platform combining flashcards, adaptive quizzes, and contextual AI chat to accelerate skill retention.' },
  { q: 'How does the AI help me learn?', a: 'It generates study plans, answers conceptual questions instantly, and adapts quiz difficulty based on your performance trends.' },
  { q: 'Is Lexigrain free?', a: 'Yes. Lexigrain is totally free—no subscriptions, no pricing tiers.' },
  { q: 'Do you offer team features?', a: 'Team and organization features are on the roadmap. For now, enjoy all core features for free.' },
  { q: 'Will my data be private?', a: 'We never sell learning data. Content is encrypted in transit and at rest. You control deletion at any time.' },
  { q: 'Do I need a credit card?', a: 'No. There are no paid tiers—just sign up and start learning.' },
];

export function FAQSection(){
  return (
    <section id="faq" className="py-40 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4">Frequently asked questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about getting started and growing with Lexigrain.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border rounded-xl mb-3 px-4 bg-card/60">
                <AccordionTrigger className="text-left py-4 hover:no-underline">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{i+1}</span>
                    <span className="font-medium leading-snug pr-6">{item.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-9 pr-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
