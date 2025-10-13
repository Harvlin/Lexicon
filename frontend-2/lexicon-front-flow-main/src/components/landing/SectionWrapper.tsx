import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/* SectionWrapper
 * Consistent vertical rhythm + optional framer-motion fade/slide reveal.
 */
interface Props { id?: string; className?: string; children: ReactNode; noMotion?: boolean; }
export function SectionWrapper({ id, className='', children, noMotion }: Props){
  if(noMotion){
    return <section id={id} className={`py-40 ${className}`}>{children}</section>;
  }
  return (
    <section id={id} className={`py-40 ${className}`}>
      <motion.div initial={{opacity:0, y:48}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin:'-140px'}} transition={{duration:0.75, ease:[0.25,0.1,0.25,1]}}>
        {children}
      </motion.div>
    </section>
  );
}
