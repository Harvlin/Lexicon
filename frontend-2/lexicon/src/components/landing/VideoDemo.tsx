import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function VideoDemoSection(){
  const [isPlaying,setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end','end start'] });
  const y = useTransform(scrollYProgress,[0,1],[100,-100]);
  const opacity = useTransform(scrollYProgress,[0,0.3,0.7,1],[0,1,1,0]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-gradient-to-br from-accent/15 via-secondary/15 to-primary/15" id="demo">
      <motion.div style={{ y }} className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <motion.div style={{ y: useTransform(scrollYProgress,[0,1],[-50,50]) }} className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div style={{ opacity }} initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-120px'}} transition={{duration:0.8}} className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">See <span className="text-primary">Lexigrain</span> <span className="bg-gradient-hero bg-clip-text text-transparent">in Action</span></h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">A quick walkthrough of generating summaries, flashcards & adaptive quizzes in under 2 minutes.</p>
          </div>
          <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}} className="relative group">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-elevated bg-card border-2 border-primary/10">
              {!isPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div whileHover={{scale:1.1}} whileTap={{scale:0.95}} className="relative">
                      <motion.div animate={{scale:[1,1.2,1], opacity:[0.5,0,0.5]}} transition={{duration:2, repeat:Infinity, ease:'easeInOut'}} className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
                      <Button size="lg" onClick={()=>setIsPlaying(true)} className="relative bg-card/90 backdrop-blur-sm hover:bg-card text-foreground border-2 border-primary/20 shadow-elevated h-24 w-24 rounded-full group">
                        <Play className="h-10 w-10 fill-current group-hover:scale-110 transition-transform" />
                      </Button>
                    </motion.div>
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 text-base font-semibold shadow-card">
                      <Play className="h-5 w-5 fill-current" /> Take a quick tour
                    </span>
                  </div>
                </>
              ) : (
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Lexigrain Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              )}
            </div>
            <motion.div animate={{y:[0,-20,0], rotate:[0,5,0]}} transition={{duration:4, repeat:Infinity, ease:'easeInOut'}} className="absolute -top-6 -right-6 w-24 h-24 bg-accent/40 rounded-2xl opacity-30 blur-xl" />
            <motion.div animate={{y:[0,20,0], rotate:[0,-5,0]}} transition={{duration:5, repeat:Infinity, ease:'easeInOut', delay:0.5}} className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/30 rounded-2xl opacity-20 blur-xl" />
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6, delay:0.4}} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {[{value:'2x', label:'Faster Learning'},{value:'95%', label:'Retention Rate'},{value:'10K+', label:'Active Users'}].map((s,i)=>(
              <motion.div key={s.label} initial={{opacity:0, scale:0.85}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration:0.5, delay:0.5 + i*0.1}} className="text-center">
                <div className="text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-muted-foreground mt-1 text-sm md:text-base">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default VideoDemoSection;
