import { motion } from 'framer-motion';

/* HeroOrbit
 * Circular orbiting feature pills around hero cluster.
 */
const pills = ['AI Summaries','Flashcards','Adaptive Quizzes','Chat Tutor','Study Plan','Analytics'];

export function HeroOrbit(){
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[640px] w-[640px] max-w-[80vw]">
        {pills.map((p,i) => {
          const angle = (i / pills.length) * Math.PI * 2;
          const radius = 250;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={p}
              initial={{opacity:0, scale:.4}}
              animate={{opacity:1, scale:1}}
              transition={{delay:0.55 + i*0.07, type:'spring', stiffness:120, damping:15}}
              className="absolute"
              style={{ left: '50%', top: '50%', transform: `translate(${x}px, ${y}px)`}}
            >
              <motion.div
                className="group px-3 py-1 rounded-full text-[10px] font-medium bg-background/70 border backdrop-blur shadow-sm hover:border-primary/40 transition relative overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15" />
                <span className="relative animate-[pulse_4s_ease-in-out_infinite] [animation-delay:0.4s]">
                  {p}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
