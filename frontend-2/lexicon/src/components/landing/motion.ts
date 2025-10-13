import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25,0.1,0.25,1] } }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

export const slideIn: Variants = {
  hidden: (dir: 'left' | 'right' | 'up' | 'down' = 'up') => {
    switch(dir){
      case 'left': return { x: -40, opacity:0 };
      case 'right': return { x: 40, opacity:0 };
      case 'down': return { y: -40, opacity:0 };
      default: return { y: 40, opacity:0 };
    }
  },
  show: { x:0, y:0, opacity:1, transition: { duration:0.65, ease:[0.25,0.1,0.25,1] } }
};

export const staggerContainer = (stagger = 0.12, delayChildren=0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } }
});

export const zoomIn: Variants = {
  hidden: { scale:0.85, opacity:0 },
  show: { scale:1, opacity:1, transition:{ duration:0.5, ease:[0.4,0,0.2,1] } }
};

export const fadeListItem: Variants = {
  hidden: { opacity:0, y:16 },
  show: { opacity:1, y:0, transition:{ duration:0.45 } }
};
