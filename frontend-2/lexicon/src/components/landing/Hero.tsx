import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-banner.jpg';

export function HeroSection(){
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="hero">
      <div className="absolute inset-0 bg-gradient-soft">
        <div className="absolute inset-0 opacity-30">
          <img src={heroBg} alt="AI Learning Background" className="w-full h-full object-cover" />
        </div>
        <motion.div animate={{scale:[1,1.2,1],opacity:[0.3,0.5,0.3]}} transition={{duration:8, repeat:Infinity, ease:'easeInOut'}} className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <motion.div animate={{scale:[1,1.3,1],opacity:[0.2,0.4,0.2]}} transition={{duration:10, repeat:Infinity, ease:'easeInOut', delay:1}} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 text-sm font-medium shadow-card">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
              Powered by Advanced AI
            </span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.1}} className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Learn <span className="bg-gradient-hero bg-clip-text text-transparent">Smarter</span>
            <br/>
            Grow <span className="bg-gradient-hero bg-clip-text text-transparent">Faster</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.2}} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your AI-powered learning assistant that summarizes, quizzes, and personalizes your study path.
          </motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.3}} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-elevated group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-card/50 backdrop-blur-sm hover:bg-card border-2 border-primary/20 group" asChild>
              <a href="#features" className="flex items-center"><Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />Watch Demo</a>
            </Button>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.4}} className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="text-2xl font-bold text-foreground">10K+</span><span>Active Learners</span></div>
            <div className="flex items-center gap-2"><span className="text-2xl font-bold text-foreground">50K+</span><span>Study Sessions</span></div>
            <div className="flex items-center gap-2"><span className="text-2xl font-bold text-foreground">95%</span><span>Success Rate</span></div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export default HeroSection;
