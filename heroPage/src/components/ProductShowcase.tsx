import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aiBrain from "@/assets/ai-brain.png";
import flashcards from "@/assets/flashcards.png";
import chatInterface from "@/assets/chat-interface.png";

gsap.registerPlugin(ScrollTrigger);

const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  useEffect(() => {
    if (!imagesRef.current) return;

    const images = imagesRef.current.querySelectorAll('[data-showcase-image]');
    
    images.forEach((img, index) => {
      gsap.from(img, {
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        scale: 0.8,
        rotate: index % 2 === 0 ? -5 : 5,
        duration: 1,
        ease: "power3.out",
        delay: index * 0.2,
      });
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-4"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider"
          >
            Product Showcase
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Beautifully Designed{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              for Learning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every feature crafted with care to make your study experience smooth and delightful
          </p>
        </motion.div>

        {/* Staggered image layout */}
        <div ref={imagesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Image 1 - Large */}
          <motion.div
            data-showcase-image
            style={{ y: y1 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="lg:col-span-2 relative group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border-2 border-primary/10 bg-card">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <img
                src={chatInterface}
                alt="AI Chat Interface"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-bold mb-2">AI Chat Tutor</h3>
                <p className="text-muted-foreground">Get instant answers and explanations tailored to your learning style</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Image 2 - Medium */}
          <motion.div
            data-showcase-image
            style={{ y: y2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="relative group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border-2 border-secondary/10 bg-card">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <img
                src={flashcards}
                alt="Flashcards Feature"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-bold mb-1">Smart Flashcards</h3>
                <p className="text-sm text-muted-foreground">Auto-generated from your materials</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Image 3 - Medium */}
          <motion.div
            data-showcase-image
            style={{ y: y3 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="relative group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border-2 border-accent/10 bg-card">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <img
                src={aiBrain}
                alt="AI Brain Processing"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-bold mb-1">AI Processing</h3>
                <p className="text-sm text-muted-foreground">Intelligent content analysis</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Image 4 - Large bottom */}
          <motion.div
            data-showcase-image
            style={{ y: y1 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="lg:col-span-2 relative group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border-2 border-primary/10 bg-card">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <img
                src={aiBrain}
                alt="Learning Dashboard"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Track your progress and optimize your study patterns</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-28 h-28 bg-accent/20 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
