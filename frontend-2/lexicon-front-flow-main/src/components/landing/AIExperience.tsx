import { motion } from 'framer-motion';

export function AIExperienceSection(){
  return (
    <section className="py-28 bg-muted/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.35),transparent_60%)]" />
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.6}} className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Your personal AI study companion</h2>
          <p className="text-lg text-muted-foreground max-w-xl">Ask questions, clarify concepts, and generate summaries on demand. Lexicon’s AI keeps context of your goals and adapts difficulty automatically.</p>
          <ul className="space-y-3 text-sm">
            {['Understands progress & gaps','Context-aware responses','Generates flashcards and quizzes','Continuously adapts plan'].map(b => <li key={b} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />{b}</li>)}
          </ul>
        </motion.div>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.65, delay:0.1}} className="relative">
          <div className="rounded-2xl p-6 bg-background/70 border shadow-xl backdrop-blur space-y-4">
            <MockChat />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/30 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

function MockChat(){
  return (
    <div className="space-y-4 text-sm leading-relaxed font-mono">
      <Bubble who="user">Explain closures in JavaScript like I know basic functions.</Bubble>
      <Bubble who="ai">A closure lets a function remember variables from its outer scope even after that outer function has finished. It’s like the function carries a backpack of references.</Bubble>
      <Bubble who="user">Flashcards please</Bubble>
      <Bubble who="ai">1. Definition: Function + preserved scope.<br/>2. Use: Encapsulation/data privacy.<br/>3. Common: Factories & callbacks.</Bubble>
    </div>
  );
}

function Bubble({ who, children }: { who: 'user' | 'ai'; children: any }) {
  const base = 'rounded-xl px-4 py-3 max-w-[420px] shadow-sm border';
  const cls = who === 'user' ? 'ml-auto bg-primary text-primary-foreground border-primary/40' : 'bg-card/70 backdrop-blur border-border';
  return <div className={base + ' ' + cls} dangerouslySetInnerHTML={{__html: String(children)}} />;
}
