import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Tier {
  name: string;
  monthly: number; // base monthly price numeric for calculation
  yearly?: number; // explicit yearly (total per year) optional allows custom discount beyond * 12 * discount
  highlight?: boolean;
  desc: string;
  features: string[];
  badge?: string;
}

const baseTiers: Tier[] = [
  { name: 'Free', monthly: 0, yearly: 0, desc:'Explore the core capture → practice loop.', features:['AI chat (limited)','Basic flashcards','5 quizzes / day','Community access'] },
  { name: 'Pro', monthly: 12, yearly: 108, highlight:true, desc:'Full adaptive engine + depth analytics.', features:['Unlimited AI chat','Unlimited flashcards','Adaptive quizzes','Smart study plan','Advanced analytics'], badge:'MOST POPULAR' },
  { name: 'Teams', monthly: 49, yearly: 470, desc:'Shared intelligence & coordinated progress.', features:['Everything in Pro','Team dashboards','Shared libraries','Priority support','Centralized billing'] },
];

export function PricingSectionLanding(){
  const [annual,setAnnual] = useState(true);
  const format = (tier: Tier) => {
    if(annual){
      const yearly = tier.yearly ?? tier.monthly * 12 * 0.85; // default 15% off if not explicitly provided
      return { price: tier.monthly === 0 ? '$0' : `$${yearly}`, period: 'year', effectiveMonthly: tier.monthly === 0 ? '$0' : `$${(yearly/12).toFixed(2)}` };
    }
    return { price: `$${tier.monthly}`, period: 'month', effectiveMonthly: `$${tier.monthly.toFixed(2)}` };
  };

  return (
  <section id="pricing" className="py-44 border-t relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-18">
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-6">Simple, scalable pricing</h2>
          <p className="text-muted-foreground text-lg mb-9">Grow into advanced features only when the habit is sticky. {annual ? 'Yearly saves up to 20%.' : 'Switch yearly & keep more budget.'}</p>
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted border">
            <button onClick={()=>setAnnual(false)} className={`px-4 py-1.5 text-sm rounded-full transition ${!annual ? 'bg-background shadow font-medium' : 'text-muted-foreground'}`}>Monthly</button>
            <button onClick={()=>setAnnual(true)} className={`px-4 py-1.5 text-sm rounded-full transition flex items-center gap-1 ${annual ? 'bg-background shadow font-medium' : 'text-muted-foreground'}`}>Annual <span className="hidden sm:inline text-[10px] font-semibold text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">Save</span></button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {baseTiers.map((t,i)=> {
            const pricing = format(t);
            const isFree = t.monthly === 0;
            return (
              <motion.div key={t.name+annual} initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.6, delay:i*0.07}} className={`relative rounded-2xl border p-8 flex flex-col bg-card/60 backdrop-blur ${t.highlight ? 'shadow-xl ring-2 ring-primary/50' : 'hover:shadow-lg'} transition-all`}>
                {t.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[11px] font-semibold shadow">{t.badge}</div>}
                {annual && !isFree && (
                  <div className="absolute top-4 right-4 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{pricing.effectiveMonthly}/mo</div>
                )}
                <h3 className="font-heading font-semibold text-xl mb-2">{t.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{t.desc}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-heading font-bold">{pricing.price}</span>
                  <span className="text-sm text-muted-foreground">/{pricing.period}</span>
                </div>
                <ul className="space-y-2 text-sm mb-8 flex-1">
                  {t.features.map(f => <li key={f} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />{f}</li>)}
                </ul>
                <Button variant={t.highlight ? 'default':'outline'} className="w-full mt-auto">{isFree ? 'Get Started' : `Choose ${t.name}`}</Button>
              </motion.div>
            )})}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-10">All prices shown in USD. Taxes may apply. You can switch plans or cancel anytime.</p>
      </div>
    </section>
  );
}
