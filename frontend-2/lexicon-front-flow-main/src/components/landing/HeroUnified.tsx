import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-banner.jpg';
import { HeroCardsCluster } from './HeroCardsCluster';
import { HeroOrbit } from './HeroOrbit';

// Unified hero merges animated background & CTA style from "the landing page" Hero
// with interactive illustrative cluster + orbit from existing implementation.
export function HeroUnified(){
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset:['start start','end start'] });
  const float = useTransform(scrollYProgress, [0,1],[0,-100]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness:120, damping:12 });
  const springY = useSpring(tiltY, { stiffness:120, damping:12 });

  function handlePointerMove(e: React.PointerEvent){
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 - 1
    const y = (e.clientY - rect.top) / rect.height;
    tiltY.set((x - 0.5) * 14); // rotateY
    tiltX.set(-(y - 0.5) * 14); // rotateX
  }
  function resetTilt(){ tiltX.set(0); tiltY.set(0); }

  return (
    <section ref={ref} id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 md:pt-32 pb-28">
      {/* Background gradient + image overlay */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,hsl(var(--primary)/0.30),transparent_65%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img src={heroBg} alt="Learning background" className="w-full h-full object-cover" />
        </div>
        {/* floating orbs */}
        <motion.div aria-hidden className="absolute top-1/4 left-[12%] w-[26rem] h-[26rem] bg-primary/25 rounded-full blur-3xl" animate={{scale:[1,1.15,1],opacity:[0.35,0.55,0.35]}} transition={{duration:9, repeat:Infinity, ease:'easeInOut'}} />
        <motion.div aria-hidden className="absolute bottom-1/5 right-[10%] w-[28rem] h-[28rem] bg-secondary/25 rounded-full blur-3xl" animate={{scale:[1,1.2,1],opacity:[0.25,0.45,0.25]}} transition={{duration:11, repeat:Infinity, ease:'easeInOut', delay:1}} />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
          {/* Badge */}
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 backdrop-blur border border-primary/30 text-xs font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Powered by adaptive AI cycles
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{duration:0.7, delay:0.05}} className="font-heading font-bold tracking-tight leading-[1.05] text-[2.6rem] md:text-6xl xl:text-7xl text-foreground">
            The Workspace Where Knowledge Compounds
          </motion.h1>

            {/* Subheadline */}
          <motion.p initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.65, delay:0.15}} className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Turn raw notes into distilled briefs, flashcards and adaptive quizzes—then review at the precise moment your memory needs it. Sustainable streaks, zero cram guilt.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.25}} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base md:text-lg px-8 py-5 bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:shadow-primary/50 group">
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg px-8 py-5 bg-background/60 backdrop-blur border-primary/30 hover:bg-primary/10 group" asChild>
              <a href="#features" className="flex items-center"><Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />Watch Demo</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.ul initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55, delay:0.35}} className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[13px] md:text-sm text-muted-foreground">
            {[
              ['92%','avg recall lift'],
              ['50K+','active learners'],
              ['47 days','median streak'],
              ['< 2 min','avg setup time']
            ].map(([metric,label]) => (
              <li key={metric+label} className="flex items-center gap-3">
                <span className="flex items-baseline gap-1"><span className="text-lg md:text-xl font-semibold text-foreground">{metric}</span></span>
                <span className="text-muted-foreground">{label}</span>
              </li>
            ))}
          </motion.ul>

          {/* Illustrative cluster & orbit */}
          <motion.div
            style={{ y: float, rotateX: springX, rotateY: springY, transformPerspective: 1200 }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="group relative w-full flex items-center justify-center pt-4 will-change-transform"
          >
            <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" />
            <HeroCardsCluster />
            <HeroOrbit />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export default HeroUnified;