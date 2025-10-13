import { motion } from 'framer-motion';

/* HeroCardsCluster
 * Layered illustrative cards (chat, flashcard, quiz, progress) showing product breadth.
 * Purely decorative; aria-hidden so screen readers are not cluttered.
 */
export function HeroCardsCluster(){
  const container = {
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } }
  };
  const item = {
    hidden: { opacity:0, y:32, scale:.9 },
    show: { opacity:1, y:0, scale:1, transition:{ type:'spring', stiffness:120, damping:18 } }
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      aria-hidden
      className="relative w-full max-w-[680px] aspect-[16/9] mx-auto">
      {/* background glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 blur-2xl" />
      {/* Chat card */}
      <motion.div variants={item} className="absolute top-4 left-4 w-2/3 rounded-3xl bg-background/70 backdrop-blur border shadow-xl shadow-primary/10 p-5 flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground tracking-wide">chat.session</p>
        <div className="space-y-3 text-[12px] leading-relaxed font-mono">
          <Bubble>Explain transformers in one line.</Bubble>
          <Bubble ai>Sequence model using self‑attention to weigh token relationships in parallel.</Bubble>
        </div>
      </motion.div>
      {/* Flashcard */}
      <motion.div variants={item} className="absolute bottom-6 left-[8%] w-40 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/80 text-primary-foreground p-4 shadow-lg shadow-primary/30 rotate-[-6deg]">
        <p className="text-[10px] font-semibold mb-1 opacity-90">FLASHCARD</p>
        <p className="text-sm font-medium leading-snug">Backpropagation updates weights by minimizing loss gradients.</p>
      </motion.div>
      {/* Quiz result */}
      <motion.div variants={item} className="absolute top-8 right-6 w-48 rounded-2xl bg-background/80 backdrop-blur border p-4 shadow-md rotate-[5deg]">
        <p className="text-[10px] font-semibold mb-2 text-primary">QUIZ SCORE</p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">92%</div>
          <p className="text-[11px] text-muted-foreground leading-snug">Adaptive review scheduled in 3d.</p>
        </div>
      </motion.div>
      {/* Progress ring mock */}
      <motion.div variants={item} className="absolute bottom-4 right-[14%] w-44 rounded-2xl bg-background/70 backdrop-blur border p-4 shadow-lg">
        <p className="text-[10px] font-semibold mb-2">WEEK PROGRESS</p>
        <div className="flex items-end gap-4">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16">
              <path className="text-muted-foreground/20" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
              <path className="text-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="75 100" stroke="currentColor" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">75%</span>
          </div>
          <ul className="text-[10px] space-y-1">
            <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Sessions 9/12</li>
            <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Quizzes 4/5</li>
            <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Cards 120</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Bubble({ children, ai }: { children: React.ReactNode; ai?: boolean }){
  return (
    <div className={`px-3 py-2 rounded-xl max-w-[90%] shadow-sm text-[11px] sm:text-[12px] leading-snug ${ai ? 'bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/20' : 'bg-background/70 border'} backdrop-blur`}>{children}</div>
  );
}
