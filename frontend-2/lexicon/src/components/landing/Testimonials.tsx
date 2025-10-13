import { motion } from 'framer-motion';
import { useState } from 'react';

interface Testimonial { name: string; role: string; quote: string; avatar: string; highlight?: boolean; }
const primary: Testimonial[] = [
  { name: 'Amira K.', role: 'Data Analyst', quote: 'Compresses an hour of skimming into a 5‑minute synthesis. The adaptive plan keeps me showing up.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira', highlight:true },
  { name: 'Jon L.', role: 'Frontend Developer', quote: 'Flashcards + adaptive quizzes feel like a coach surfacing blind spots I didn’t know I had.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jon' },
  { name: 'Sofia M.', role: 'Product Designer', quote: 'Micro sessions slot between meetings—less guilt, more steady progress.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
];

// Additional testimonials for grid expansion
const more: Testimonial[] = [
  { name: 'Priyanka R.', role: 'CS Student', quote: 'Daily streak nudges rebuilt my habit after years of inconsistent cram cycles.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priyanka' },
  { name: 'Mateo V.', role: 'Backend Engineer', quote: 'Spaced prompts hit right before forgetting. Recall in standups is sharper.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo' },
  { name: 'Grace H.', role: 'Marketing Lead', quote: 'Bite‑sized flows slot between context switches—no overwhelm spiral.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace' },
  { name: 'Leo A.', role: 'Bootcamp Grad', quote: 'Bridged the scary gap from tutorials to shipping. Less guessing, more doing.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
  { name: 'Nora S.', role: 'UX Researcher', quote: 'Exported flashcards → shared team knowledge base. Huge collaboration unlock.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora' },
  { name: 'Daniel P.', role: 'Data Scientist', quote: 'Adaptive quizzes surface weak edges before they become blockers.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel' },
];

export function TestimonialsSection(){
  const [index,setIndex] = useState(0);
  const next = () => setIndex((index+1)%primary.length);
  const prev = () => setIndex((index-1+primary.length)%primary.length);
  const focused = primary[index];
  return (
  <section className="py-44 bg-gradient-to-b from-background via-muted/30 to-background" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-5">What learners are experiencing</h2>
            <p className="text-muted-foreground max-w-lg leading-relaxed">Real outcomes from people weaving Lexicon into short, sustainable study loops.</p>
          </div>
          <div className="flex gap-2 self-start md:self-end">
            <button aria-label="Previous testimonial" onClick={prev} className="h-9 w-9 rounded-full bg-muted hover:bg-background border flex items-center justify-center text-sm">‹</button>
            <button aria-label="Next testimonial" onClick={next} className="h-9 w-9 rounded-full bg-muted hover:bg-background border flex items-center justify-center text-sm">›</button>
          </div>
        </div>

        {/* Focused carousel card */}
        <motion.div key={focused.name+index} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="max-w-4xl mb-28">
          <div className="rounded-3xl bg-gradient-to-br from-muted/70 to-muted/20 border shadow-xl p-10 md:p-14 backdrop-blur relative overflow-hidden">
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.55, delay:0.1}} className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
            <p className="text-2xl md:text-3xl font-medium leading-snug mb-10">“{focused.quote}”</p>
            <div className="flex items-center gap-5">
              <img src={focused.avatar} className="h-16 w-16 rounded-full ring-2 ring-primary/30" />
              <div>
                <p className="font-semibold text-lg">{focused.name}</p>
                <p className="text-sm text-muted-foreground">{focused.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Masonry-like grid of additional testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {more.map((t,i)=>(
            <motion.div key={t.name} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-60px'}} transition={{duration:0.55, delay:(i%3)*0.08}} className="rounded-2xl border bg-card/60 backdrop-blur p-6 flex flex-col shadow-sm hover:shadow-md transition">
              <p className="text-sm leading-relaxed mb-6 flex-1">“{t.quote}”</p>
              <div className="flex items-center gap-3 mt-auto">
                <img src={t.avatar} className="h-12 w-12 rounded-full" />
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
