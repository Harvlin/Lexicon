import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  useEffect(() => {
    if (!headerRef.current || !cardsRef.current) return;

    // Animate header
    gsap.from(headerRef.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    // Animate accordion items with stagger
    const items = cardsRef.current.querySelectorAll('[data-faq-item]');
    gsap.from(items, {
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const faqs = [
    {
      question: "What is Lexicon and how does it work?",
      answer: "Lexicon is an AI-powered learning platform that helps you master any subject faster. Simply upload your study materials, and our AI automatically generates summaries, flashcards, and quizzes. You can also chat with our AI tutor for personalized explanations.",
    },
    {
      question: "Is Lexicon suitable for all learning levels?",
      answer: "Absolutely! Lexicon adapts to your learning level and pace. Whether you're a student, professional, or lifelong learner, our AI personalizes content to match your knowledge and goals. From beginners to advanced learners, everyone benefits from our intelligent study tools.",
    },
    {
      question: "How does the AI tutor compare to a human tutor?",
      answer: "Our AI tutor is available 24/7, responds instantly, and never gets tired. While it doesn't replace human connection, it provides consistent, personalized guidance at a fraction of the cost. It's perfect for quick questions, practice sessions, and reinforcing concepts between classes.",
    },
    {
      question: "Can I use Lexicon offline?",
      answer: "Currently, Lexicon requires an internet connection to leverage our AI capabilities. However, once generated, you can access your flashcards and summaries offline through our mobile app. We're working on expanding offline features in future updates.",
    },
    {
      question: "What subjects and topics does Lexicon support?",
      answer: "Lexicon supports virtually any subject! From programming and mathematics to languages, history, and professional skills, our AI can process and help you learn any text-based content. Simply upload your materials and start learning.",
    },
    {
      question: "How is my study data kept private and secure?",
      answer: "We take privacy seriously. All your study materials and data are encrypted and stored securely. We never share your personal information or learning data with third parties. You have full control to export or delete your data at any time.",
    },
    {
      question: "Can I try Lexicon for free?",
      answer: "Yes! We offer a free plan with core features including AI summaries, flashcards, and limited quiz generations. You can upgrade to Pro anytime for unlimited access to all features, including our AI tutor and advanced analytics.",
    },
    {
      question: "What makes Lexicon different from other learning apps?",
      answer: "Lexicon combines multiple learning tools in one platform—summaries, flashcards, quizzes, and an AI tutor. Our AI doesn't just quiz you; it understands your learning patterns and adapts. Plus, our modern interface makes studying actually enjoyable.",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-soft"
    >
      {/* Animated background elements */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            ref={headerRef}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider"
            >
              Got Questions?
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Frequently Asked{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Lexicon and how it can transform your learning journey
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div ref={cardsRef}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  data-faq-item
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border-2 border-primary/10 rounded-2xl px-6 shadow-card hover:shadow-elevated hover:border-primary/20 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold group">
                      <span className="flex-1 pr-4">{faq.question}</span>
                      <motion.div
                        className="text-primary"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                      </motion.div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 pt-2 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

          {/* CTA below FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block text-primary font-semibold text-lg hover:underline"
            >
              Get in touch with our team →
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
