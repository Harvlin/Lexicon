import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTABannerSection(){
  return (
    <section className="py-24 relative overflow-hidden" id="get-started">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <motion.div animate={{scale:[1,1.2,1], rotate:[0,90,0]}} transition={{duration:20, repeat:Infinity, ease:'linear'}} className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <motion.div animate={{scale:[1,1.3,1], rotate:[0,-90,0]}} transition={{duration:15, repeat:Infinity, ease:'linear'}} className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div animate={{rotate:[0,10,-10,0]}} transition={{duration:2, repeat:Infinity, ease:'easeInOut'}} className="inline-flex">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">Start Learning with Lexicon</h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">Your AI co‑pilot for mastering complex topics. Join thousands compounding knowledge daily.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-elevated group">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              See How It Works
            </Button>
          </div>
          <p className="text-white/70 text-sm">No credit card required • 14‑day free trial • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTABannerSection;
