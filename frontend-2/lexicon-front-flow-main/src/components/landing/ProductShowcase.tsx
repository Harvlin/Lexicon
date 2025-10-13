import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Reuse existing assets (fallback to hero assets path if later added)
import aiBrain from '@/assets/hero-banner.jpg';
// TODO: replace with dedicated product imagery when available

// Register plugin in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProductShowcaseSection(){
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end','end start'] });
  const y1 = useTransform(scrollYProgress,[0,1],[100,-100]);
  const y2 = useTransform(scrollYProgress,[0,1],[50,-50]);
  const y3 = useTransform(scrollYProgress,[0,1],[150,-150]);

  useEffect(()=>{
    if(!imagesRef.current) return;
    const images = imagesRef.current.querySelectorAll('[data-showcase-image]');
    images.forEach((img, index)=>{
      gsap.from(img, {
        scrollTrigger: { trigger: img, start: 'top 85%', end: 'bottom 15%', toggleActions: 'play none none reverse' },
        opacity: 0,
        scale: 0.85,
        rotate: index % 2 === 0 ? -4 : 4,
        duration: 0.9,
        ease: 'power3.out',
        delay: index * 0.15,
      });
    });
  },[]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden" id="showcase">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8}} className="text-center mb-20 space-y-4">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">Product Showcase</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">Designed for <span className="bg-gradient-hero bg-clip-text text-transparent">Deep Learning</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse at upcoming adaptive study surfaces. Visuals are placeholders until live data bindings land.</p>
        </motion.div>
        <div ref={imagesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <ShowcaseCard y={y1} size="lg" title="AI Chat Tutor" desc="Context aware explanations with source linking." />
          <ShowcaseCard y={y2} title="Smart Flashcards" desc="Auto generated spaced repetition cards." />
          <ShowcaseCard y={y3} title="Knowledge Graph" desc="Concept links that evolve with your mastery." />
          <ShowcaseCard y={y1} size="lg" title="Progress Analytics" desc="Retention curves & session quality metrics." />
        </div>
      </div>
    </section>
  );
}

interface ShowcaseCardProps { y: any; size?: 'lg'; title: string; desc: string; }
function ShowcaseCard({ y, size, title, desc }: ShowcaseCardProps){
  return (
    <motion.div data-showcase-image style={{ y }} whileHover={{ scale:1.04, rotate:0 }} className={`${size==='lg' ? 'lg:col-span-2' : ''} relative group cursor-pointer`}> 
      <div className="relative overflow-hidden rounded-3xl shadow-elevated border-2 border-primary/10 bg-card aspect-video flex items-center justify-center">
  <motion.div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img src={aiBrain} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
        <div className="relative z-10 bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductShowcaseSection;
