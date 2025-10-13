import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Clock, BrainCircuit, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

/* Premium hero with balanced negative space, elevated media panel, and restrained motion */
export default function Hero() {
  const stats = [
    { value: '50K+', label: 'Active Learners' },
    { value: '120+', label: 'Expert Courses' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9/5', label: 'Avg Rating' },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-32 overflow-hidden">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,hsl(var(--accent)/0.25),transparent_55%),radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.3),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,hsl(var(--foreground)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.15)_1px,transparent_1px)] bg-[size:160px_160px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Copy */}
          <div className="relative">
            <Badge className="mb-8 bg-accent/15 dark:bg-accent/30 text-foreground dark:text-white border border-accent/40 dark:border-accent/55 backdrop-blur-sm gap-2 px-4 py-1.5 font-medium shadow-[0_0_0_1px_hsl(var(--background)/0.6)] dark:shadow-none">
              <Sparkles className="h-4 w-4" /> Crafted for relentless learners
            </Badge>
            <h1 className="font-heading font-semibold tracking-tight text-5xl md:text-6xl leading-[1.05] [text-wrap:balance]">
              Elevate Your <span className="bg-gradient-primary bg-clip-text text-transparent">Learning</span>
              <span className="block mt-2 text-[clamp(2.5rem,5vw,3.75rem)] font-heading font-medium text-foreground/70">with Precision & Clarity</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-foreground/70 max-w-xl font-body">
              A focused platform delivering AI‑guided paths, frictionless progress and immersive mastery—without the noise.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/auth/signup">
                <Button size="lg" className="group relative px-10 h-14 text-base font-semibold bg-accent hover:bg-accent-hover shadow-lg shadow-accent/25">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/library">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-medium backdrop-blur border-foreground/15 hover:bg-foreground/5">
                  <Play className="h-5 w-5 mr-2" /> Preview Library
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-8 text-sm relative">
              {stats.map((s, i) => (
                <div key={s.label} className="relative">
                  <div className="text-2xl font-heading font-semibold tracking-tight">{s.value}</div>
                  <div className="text-foreground/50">{s.label}</div>
                  {i < stats.length - 1 && (i % 2 === 0 || i < 2) && (
                    <span className="hidden sm:block absolute top-1/2 -right-4 h-10 w-px bg-foreground/10 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media Panel */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden ring-1 ring-foreground/10 bg-card/60 backdrop-blur-xl shadow-[0_8px_40px_-10px_hsl(var(--foreground)/0.25)]">
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/25 flex items-center justify-center">
                <button className="group h-24 w-24 rounded-full bg-background/70 backdrop-blur border border-foreground/15 flex items-center justify-center shadow-soft hover:shadow-medium transition">
                  <Play className="h-10 w-10 text-foreground/80 group-hover:text-foreground transition" />
                  <span className="sr-only">Play overview video</span>
                </button>
              </div>
              {/* Faux progress scrub bar */}
              <div className="h-1 bg-foreground/10">
                <div className="h-full w-1/3 bg-gradient-primary" />
              </div>
            </div>
            {/* Floating glass cards */}
            <Card className="absolute -left-8 -bottom-8 w-48 backdrop-blur bg-background/70 border-foreground/15 shadow-card animate-slide-up" style={{animationDelay:'120ms'}}>
              <CardContent className="p-4 flex items-start gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">Daily Focus</p>
                  <p className="text-xs text-muted-foreground">45 min streak</p>
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -right-6 top-1/3 w-48 backdrop-blur bg-background/70 border-foreground/15 shadow-card animate-slide-up" style={{animationDelay:'250ms'}}>
              <CardContent className="p-4 flex items-start gap-3">
                <BrainCircuit className="h-8 w-8 text-secondary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">Adaptive Path</p>
                  <p className="text-xs text-muted-foreground">AI optimizing</p>
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -left-4 top-8 w-48 backdrop-blur bg-background/70 border-foreground/15 shadow-card animate-slide-up" style={{animationDelay:'380ms'}}>
              <CardContent className="p-4 flex items-start gap-3">
                <Trophy className="h-8 w-8 text-accent" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">Milestone</p>
                  <p className="text-xs text-muted-foreground">Badge unlocked</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
