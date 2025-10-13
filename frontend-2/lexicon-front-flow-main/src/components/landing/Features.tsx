import { Brain, FileText, Sparkles, ClipboardCheck } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { staggerContainer, fadeListItem } from './motion';

const featureData = [
  { icon: Sparkles, title: 'AI Summaries', desc: 'Condense dense material into crisp, scannable briefs in seconds.' },
  { icon: Brain, title: 'Instant Flashcards', desc: 'Spin any highlight into spaced‑repetition cards with one click.' },
  { icon: ClipboardCheck, title: 'Adaptive Quizzes', desc: 'Pinpoint weak recall with difficulty that shifts as you improve.' },
  { icon: FileText, title: 'Dynamic Study Plan', desc: 'Auto‑prioritized review slots that flex around your week.' },
];

export function FeaturesSection(){
  return (
  <section id="features" className="py-32 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-5">Tools that compound learning</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">Each feature reinforces the others—capture, transform, recall and refine in a tight feedback loop.</p>
        </div>
        <motion.div variants={staggerContainer(0.12,0.05)} initial="hidden" whileInView="show" viewport={{once:true, margin:'-120px'}} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((f)=>{
            const Icon = f.icon;
            return <TiltCard key={f.title} icon={<Icon className="h-5 w-5" />} title={f.title} desc={f.desc} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

interface TiltProps { icon: React.ReactNode; title: string; desc: string; }
function TiltCard({ icon, title, desc }: TiltProps){
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);

  function handleMove(e: React.MouseEvent){
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    x.set(dx);
    y.set(dy);
  }
  function handleLeave(){ x.set(0); y.set(0); }

  return (
    <motion.div
      variants={fadeListItem}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative rounded-xl border bg-card/60 backdrop-blur p-5 flex flex-col gap-4 hover:shadow-xl hover:border-primary/50 transition-all will-change-transform">
  <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shadow">{icon}</div>
      <h3 className="font-semibold text-base">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
      <span className="text-[11px] font-medium text-primary/70 group-hover:text-primary transition-colors">Learn more →</span>
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-primary/30 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent" />
    </motion.div>
  );
}
