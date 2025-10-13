import { motion } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';
import { Lightbulb, Brain, Rocket } from 'lucide-react';

const steps = [
  { icon: Lightbulb, title: '1. Capture & Generate', desc: 'Drop in raw notes or paste an article—Lexicon distills it and drafts flashcards automatically.' },
  { icon: Brain, title: '2. Adaptive Practice', desc: 'Smart spacing + evolving difficulty keep you in the productive struggle zone.' },
  { icon: Rocket, title: '3. Track & Compound', desc: 'Precision recall metrics & streak feedback turn small sessions into lasting gains.' },
];

export function HowItWorksSection(){
  return (
    <SectionWrapper id="how" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-5">How it works</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">A repeatable loop that transforms passive reading into active, durable memory.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((s,i)=>{
            const Icon = s.icon;
            return (
              <motion.div key={s.title} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-120px'}} transition={{duration:0.6, delay:i*0.08}} className="relative flex flex-col items-start">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 mb-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length -1 && (
                  <div className="hidden md:block absolute top-7 right-[-10%] w-[120%] h-px bg-gradient-to-r from-primary/40 via-secondary/30 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
