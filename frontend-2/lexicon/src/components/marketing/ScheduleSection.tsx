import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Sparkles, ArrowRight, RefreshCcw } from 'lucide-react';

interface OnboardingData { dailyHours?: number; preferredTime?: string; goals?: string[]; skills?: string[]; }
const STORAGE_KEY = 'lexigrain:onboarding';

interface Session { id: string; day: string; start: string; end: string; focus: string; type: 'Lesson' | 'Review' | 'Practice'; }

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const FOCUS_TOPICS_FALLBACK = ['Foundations','Project Work','Deep Practice','Review','AI Chat','Quiz Set','Reflection'];

function generateSessions(data: OnboardingData, seed = 0): Session[] {
  const hours = data.dailyHours && data.dailyHours > 0 ? data.dailyHours : 1;
  const preferred = (data.preferredTime || 'Evening').toLowerCase();
  const baseHour = preferred.includes('morning') ? 8 : preferred.includes('afternoon') ? 14 : preferred.includes('late') ? 22 : 19;
  const topics = (data.skills && data.skills.length ? data.skills : data.goals && data.goals.length ? data.goals : FOCUS_TOPICS_FALLBACK).slice(0,7);
  const sessions: Session[] = [];
  for (let i=0;i<7;i++) {
    const startH = baseHour;
    const endH = baseHour + Math.min(2, hours); // cap visible block
    const topic = topics[i % topics.length];
    sessions.push({
      id: `${i}`,
      day: DAYS[i],
      start: `${startH}:00`,
      end: `${endH}:00`,
      focus: topic,
      type: i % 3 === 0 ? 'Review' : i % 2 === 0 ? 'Practice' : 'Lesson'
    });
  }
  return sessions;
}

export default function ScheduleSection() {
  const [data, setData] = useState<OnboardingData>({});
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacy = localStorage.getItem('lexicon:onboarding');
        if (legacy) {
          try { localStorage.setItem(STORAGE_KEY, legacy); } catch {}
          raw = legacy;
        }
      }
      if (raw) setData(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const sessions = useMemo(()=> generateSessions(data, seed), [data, seed]);

  return (
    <section id="schedule" className="py-24 md:py-32 relative" data-reveal>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.12),transparent_60%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.12),transparent_65%)]" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-primary/15 text-primary-foreground/90 dark:text-white border-primary/30">Smart Scheduling</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Your Week, Intentionally Structured</h2>
          <p className="text-lg md:text-xl text-muted-foreground">We adapt your preferred study time{data.preferredTime ? ` (${data.preferredTime})` : ''} and commitment{data.dailyHours ? ` (${data.dailyHours}h/day)` : ''} into a balanced plan mixing new lessons, review, and practice.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Week Grid */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5" /> Weekly Blueprint</CardTitle>
              <Button variant="ghost" size="sm" onClick={()=> setSeed(s=>s+1)} className="gap-2"><RefreshCcw className="h-4 w-4" /> Regenerate</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground mb-2">
                {DAYS.map(d => <div key={d} className="text-center tracking-wide">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {sessions.map(s => (
                  <div key={s.id} className="relative group">
                    <div className="p-3 rounded-xl border bg-card/70 backdrop-blur flex flex-col gap-2 shadow-soft hover:shadow-medium transition cursor-pointer">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                        <span>{s.type}</span>
                        <span>{s.start}</span>
                      </div>
                      <p className="text-sm font-medium leading-tight line-clamp-2">{s.focus}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80"><Clock className="h-3 w-3" /> {s.start}–{s.end}</div>
                      <span className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-primary/40 transition" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">Auto-generated from your onboarding preferences. Adjust anytime after you sign up.</p>
            </CardContent>
          </Card>

          {/* Summary / Actions */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Adaptive Focus</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>We balance difficulty and retention by alternating core lessons with review + applied practice. Your preferred time anchors the block.</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" /> Lesson = new structured content</li>
                  <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary mt-1" /> Practice = application & drills</li>
                  <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent mt-1" /> Review = spaced recall & quiz</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Commitment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>Daily target: <span className="font-medium text-foreground">{data.dailyHours || 1}h</span> • Preferred: <span className="font-medium text-foreground">{data.preferredTime || 'Evening'}</span></p>
                <p className="text-xs">This preview assumes up to 2h visible block for clarity; full schedule can subdivide internally.</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-secondary" /> Next Step</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>Create an account to lock in and personalize reminders, streak tracking, and adaptive adjustments.</p>
                <Button size="sm" className="w-full bg-accent hover:bg-accent-hover gap-2">Start Free <ArrowRight className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
