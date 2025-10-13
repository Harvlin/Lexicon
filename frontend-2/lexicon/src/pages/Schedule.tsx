import { useEffect, useMemo, useState } from 'react';
import { useSchedule, getWeekId } from '@/hooks/useSchedule';
import { mockLessons } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, CheckCircle2, Clock, Loader2, Trash2, CalendarDays, Wand2, Info, SplitSquareHorizontal, ArrowRight, Target } from 'lucide-react';
import useScrollReveal from '@/hooks/useScrollReveal';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

function formatWeekLabel(weekId: string) {
  return weekId.replace('-W', ' • Week ');
}

function minutesToHhMm(m: number) {
  const h = Math.floor(m/60); const mm = m % 60; return `${h}h${mm ? ' ' + mm + 'm' : ''}`;
}

function startOfWeekISO(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate()+diff);
  date.setHours(0,0,0,0);
  return date;
}

export default function SchedulePage() {
  useScrollReveal();
  // @ts-ignore extended source field
  const { weekId, sessions, stats, addSession, deleteSession, setStatus, regenerateCurrentWeek, shiftWeek, splitWeekSessions, splitDaySessions, source } = useSchedule();
  const [tab, setTab] = useState('week');
  const [open, setOpen] = useState(false);
  const [lessonId, setLessonId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(60);
  const [submitting, setSubmitting] = useState(false);

  // Onboarding-aligned schedule preferences
  const [schedulePreset, setSchedulePreset] = useState<string>('Evening');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Mon','Tue','Wed','Thu','Fri']);
  const [specificTime, setSpecificTime] = useState<string>('19:00');
  const [dailyHours, setDailyHours] = useState<number>(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [mode, setMode] = useState<'easy' | 'advanced'>('easy');
  const { toast } = useToast();

  // Load onboarding preferences on mount
  useEffect(() => {
    try {
  let raw = localStorage.getItem('lexigrain:onboarding');
  if (!raw) raw = localStorage.getItem('lexicon:onboarding');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setSchedulePreset(parsed.schedulePreset ?? parsed.preferredTime ?? 'Evening');
      setDaysOfWeek(Array.isArray(parsed.daysOfWeek) ? parsed.daysOfWeek : []);
      setSpecificTime(parsed.specificTime ?? '19:00');
      setDailyHours(parsed.dailyHours ?? 1);
      setGoals(parsed.goals ?? []);
      setSkills(parsed.skills ?? []);
      setReminderEnabled(!!parsed.reminderEnabled);
    } catch (e) { }
  }, []);

  const DAY_OPTIONS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const lessonsById = useMemo(() => Object.fromEntries(mockLessons.map(l => [l.id, l])), []);

  const days = useMemo(() => {
    // Derive monday from current weekId
    const parts = weekId.split('-W');
    let currentMonday = startOfWeekISO(new Date());
    if (parts.length === 2) {
      // Reconstruct approximate monday by scanning dates nearby
      const year = Number(parts[0]);
      const week = Number(parts[1]);
      // Use helper: find Monday of week 1 then offset
      const jan4 = new Date(year,0,4);
      const day = jan4.getDay() || 7;
      const mondayWeek1 = new Date(jan4);
      mondayWeek1.setDate(jan4.getDate() + (1 - day));
      currentMonday = new Date(mondayWeek1);
      currentMonday.setDate(mondayWeek1.getDate() + (week - 1)*7);
    }
    const emptyDays: { date: string; sessions: typeof sessions }[] = [];
    for (let i=0;i<7;i++) {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate()+i);
      emptyDays.push({ date: d.toISOString().substring(0,10), sessions: [] });
    }
    const map: Record<string, ReturnType<typeof buildDay>> = Object.fromEntries(emptyDays.map(d => [d.date, { ...d }]));
    sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = buildDay(s.date);
      map[s.date].sessions.push(s);
    });
    return Object.values(map).sort((a,b) => a.date.localeCompare(b.date));
  }, [sessions]);

  function buildDay(date: string) { return { date, sessions: [] as typeof sessions } }

  // derive mini-week stats for glance panel
  const glance = useMemo(() => {
    const byDate: Record<string, number> = {};
    sessions.forEach(s => { byDate[s.date] = (byDate[s.date] ?? 0) + (s.status === 'done' ? 1 : 0); });
    const totalSessions = sessions.length;
    const done = sessions.filter(s => s.status === 'done').length;
    const remaining = totalSessions - done;
    return { byDate, totalSessions, done, remaining };
  }, [sessions]);

  // What next calculation: pick next planned session today or next day
  const nextSession = useMemo(() => {
    const now = new Date();
    const todayISO = new Date().toISOString().substring(0,10);
    const upcoming = sessions
      .filter(s => s.status !== 'done')
      .sort((a,b) => a.date.localeCompare(b.date));
    const today = upcoming.find(s => s.date === todayISO) ?? upcoming[0];
    return today;
  }, [sessions]);

  const handleAdd = async () => {
    if (!lessonId || !date) return;
    setSubmitting(true);
    addSession({ lessonId, date, plannedMinutes: minutes });
    setSubmitting(false);
    setOpen(false);
    setLessonId(''); setDate(''); setMinutes(60);
  };

  // Persist schedule preferences back to onboarding storage
  const savePreferences = () => {
    try {
  const raw = localStorage.getItem('lexigrain:onboarding') || localStorage.getItem('lexicon:onboarding');
      const prev = raw ? JSON.parse(raw) : {};
      const next = {
        ...prev,
        schedulePreset,
        daysOfWeek,
        specificTime,
        dailyHours,
        reminderEnabled,
      };
  try { localStorage.setItem('lexigrain:onboarding', JSON.stringify(next)); } catch {}
      toast({ title: 'Saved', description: 'Your schedule preferences have been saved.' });
    } catch (e) { }
  };

  // Simple AI-like suggestions (heuristic)
  const aiSuggestions = useMemo(() => {
    const suggestions: { title: string; description: string; apply: () => void }[] = [];
    if (goals.some(g => /career|exam/i.test(g))) {
      suggestions.push({
        title: 'Morning Focus (Weekdays)',
        description: 'Shift to weekday mornings to maximize focus and consistency.',
        apply: () => { setSchedulePreset('Custom'); setDaysOfWeek(['Mon','Tue','Wed','Thu','Fri']); setSpecificTime('07:30'); }
      });
    }
    if (dailyHours > 2) {
      suggestions.push({
        title: 'Split Sessions',
        description: 'Do two shorter sessions (60–90 min) on the same days for better retention.',
        apply: () => { setSchedulePreset('Custom'); if (daysOfWeek.length===0) setDaysOfWeek(['Mon','Wed','Fri']); setSpecificTime('10:00'); }
      });
    }
    if (skills.some(s => /machine learning|data/i.test(s))) {
      suggestions.push({
        title: 'Deep Work Blocks',
        description: 'Choose 2–3 days with longer blocks (2+ hours) for complex topics.',
        apply: () => { setSchedulePreset('Custom'); setDaysOfWeek(['Tue','Thu','Sat']); setSpecificTime('09:00'); setDailyHours(Math.max(dailyHours, 2)); }
      });
    }
    return suggestions;
  }, [goals, skills, dailyHours, daysOfWeek]);

  // shiftWeek now provided by hook

  return (
    <div className="space-y-8" data-reveal>
      {/* This week at a glance */}
      <Card className="bg-gradient-to-br from-card/70 to-background border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Target className="h-4 w-4 text-secondary"/> This week at a glance</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">{sessions.length} sessions</Badge>
              <Badge variant="outline" className="text-[10px]">{Math.round(stats.completionRate*100)}% complete</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative grid place-items-center h-16 w-16 rounded-full border">
              <div className="text-sm font-semibold">{Math.round(stats.completionRate*100)}%</div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">{minutesToHhMm(stats.plannedMinutes)}</span> planned</div>
              <div><span className="font-medium text-foreground">{glance.done}</span> done • <span className="font-medium text-foreground">{glance.remaining}</span> to go</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1">
              {days.map((d, idx) => {
                const doneCount = d.sessions.filter(s => s.status==='done').length;
                const total = d.sessions.length;
                const label = new Date(d.date).toLocaleDateString(undefined,{ weekday:'short'});
                return (
                  <div key={d.date} className={cn('rounded-md px-2 py-2 border text-center text-xs', total===0 ? 'text-muted-foreground border-dashed' : doneCount===total ? 'bg-success/10 border-success/40' : 'border-border')}
                       title={`${label}: ${doneCount}/${total}`}>
                    <div className="font-medium">{label[0]}</div>
                    <div className="text-[10px]">
                      {total>0 ? `${doneCount}/${total}` : '-'}
                    </div>
                    {/* per-day split quick action when day has exactly 1 long session */}
                    {total===1 && d.sessions[0].plannedMinutes>=120 && (
                      <button className="mt-1 inline-flex items-center gap-1 text-[10px] text-primary hover:underline" onClick={()=> splitDaySessions(d.date)}>
                        <SplitSquareHorizontal className="h-3 w-3"/> Split
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <Button variant="secondary" className="gap-2" onClick={() => splitWeekSessions()}>
              <SplitSquareHorizontal className="h-4 w-4"/> Split long sessions
            </Button>
            {nextSession && (
              <Button className="gap-2" onClick={() => setStatus(nextSession.id, 'in-progress')}>
                <ArrowRight className="h-4 w-4"/> Start next: {minutesToHhMm(nextSession.plannedMinutes)}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Intro & Preferences */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="flex items-center gap-2"><Info className="h-4 w-4 text-primary"/> Your Schedule Preferences</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className={mode==='easy' ? 'font-semibold' : 'text-muted-foreground'}>Easy Mode</span>
              <Switch checked={mode==='advanced'} onCheckedChange={(v)=> setMode(v ? 'advanced':'easy')} aria-label="Toggle advanced mode" />
              <span className={mode==='advanced' ? 'font-semibold' : 'text-muted-foreground'}>Advanced</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode==='easy' && (
            <div className="space-y-4">
              <ol className="text-sm text-muted-foreground list-decimal ml-5 space-y-1">
                <li>Choose your study days</li>
                <li>Select the time of day</li>
                <li>Pick how long you want to study</li>
              </ol>
              {/* Days presets */}
              <div>
                <p className="text-sm font-medium mb-2">Days</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Every Day', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
                    { label: 'Weekdays', days: ['Mon','Tue','Wed','Thu','Fri'] },
                    { label: 'Weekends', days: ['Sat','Sun'] },
                  ].map(opt => (
                    <Button key={opt.label} type="button" variant={daysOfWeek.join(',')===opt.days.join(',') ? 'default' : 'outline'} className={daysOfWeek.join(',')===opt.days.join(',') ? 'bg-accent hover:bg-accent-hover' : ''}
                      onClick={() => { setSchedulePreset('Custom'); setDaysOfWeek(opt.days); }}>
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Time presets */}
              <div>
                <p className="text-sm font-medium mb-2">Time of day</p>
                <div className="grid sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Morning', preset: 'Morning', time: '07:30' },
                    { label: 'Afternoon', preset: 'Afternoon', time: '13:00' },
                    { label: 'Evening', preset: 'Evening', time: '19:00' },
                    { label: 'Late Night', preset: 'Late Night', time: '21:00' },
                  ].map(opt => (
                    <Button key={opt.label} type="button" variant={schedulePreset===opt.preset ? 'default' : 'outline'} className={schedulePreset===opt.preset ? 'bg-primary hover:bg-primary-hover' : ''}
                      onClick={() => { setSchedulePreset(opt.preset); setSpecificTime(opt.time); }}>
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Duration presets */}
              <div>
                <p className="text-sm font-medium mb-2">Study time per day</p>
                <div className="flex flex-wrap gap-2">
                  {[0.5, 1, 1.5, 2].map(v => (
                    <Button key={v} type="button" variant={dailyHours===v ? 'default' : 'outline'} className={dailyHours===v ? 'bg-secondary hover:bg-secondary/80' : ''} onClick={() => setDailyHours(v)}>
                      {v === 0.5 ? '30 min' : `${v} ${v===1 ? 'hour' : 'hours'}`}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Reminders */}
              <div className="flex items-center gap-3">
                <Switch id="reminders" checked={reminderEnabled} onCheckedChange={(v)=> setReminderEnabled(!!v)} />
                <label htmlFor="reminders" className="text-sm">Send me gentle reminders</label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={savePreferences}>Save</Button>
                <Button className="gap-1" onClick={() => { savePreferences(); regenerateCurrentWeek(); toast({ title: 'Applied', description: 'This week has been updated.' }); }}>Apply to This Week</Button>
              </div>
              <p className="text-xs text-muted-foreground">You can always switch to Advanced for more control. Your choices follow the app’s color palette for clarity and consistency.</p>
            </div>
          )}
          {mode==='advanced' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Preset</label>
                  <Select value={schedulePreset} onValueChange={setSchedulePreset}>
                    <SelectTrigger><SelectValue placeholder="Select preset"/></SelectTrigger>
                    <SelectContent>
                      {['Morning','Afternoon','Evening','Late Night','Custom'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Daily Hours</label>
                  <Input type="number" min={0.5} step={0.5} max={12} value={dailyHours} onChange={e => setDailyHours(parseFloat(e.target.value)||1)} />
                </div>
                {schedulePreset === 'Custom' && (
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground">Days</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {DAY_OPTIONS.map(d => {
                        const active = daysOfWeek.includes(d);
                        return (
                          <button key={d} type="button" onClick={() => setDaysOfWeek(active ? daysOfWeek.filter(x=>x!==d) : [...daysOfWeek, d])} className={`px-3 py-1.5 rounded-md border text-sm transition ${active ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-foreground'} hover:border-foreground/40`}>
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {schedulePreset === 'Custom' && (
                  <div>
                    <label className="text-xs text-muted-foreground">Time</label>
                    <Input type="time" value={specificTime} onChange={e => setSpecificTime(e.target.value)} />
                  </div>
                )}
                <div className="flex items-center gap-3 md:col-span-4">
                  <Switch id="reminders2" checked={reminderEnabled} onCheckedChange={(v)=> setReminderEnabled(!!v)} />
                  <label htmlFor="reminders2" className="text-sm">Reminders</label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={savePreferences}>Save Preferences</Button>
                <Button className="gap-1" onClick={() => { savePreferences(); regenerateCurrentWeek(); toast({ title: 'Applied', description: 'This week has been updated.' }); }}><RefreshCcw className="h-4 w-4"/> Apply to This Week</Button>
              </div>
              {aiSuggestions.length > 0 && (
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 mb-2"><Wand2 className="h-4 w-4 text-secondary"/><span className="text-sm font-medium">AI Suggestions</span></div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {aiSuggestions.map(s => (
                      <Button key={s.title} variant="secondary" className="justify-start" onClick={() => { s.apply(); savePreferences(); toast({ title: 'Suggestion applied' }); }}>
                        {s.title}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">These suggestions use your goals, skills, and daily hours to propose better study times. No data leaves your device.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-heading font-bold">Study Schedule</h1>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap">{formatWeekLabel(weekId)} • {sessions.length} sessions • {minutesToHhMm(stats.plannedMinutes)} planned • {Math.round(stats.completionRate*100)}% done {source === 'mock' && <span className="inline-flex items-center rounded-full bg-warning/20 text-warning px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">Mock Data</span>}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => shiftWeek(-1)}><ChevronLeft className="h-4 w-4"/></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => shiftWeek(1)}><ChevronRight className="h-4 w-4"/></Button>
          </div>
          <Button variant="outline" onClick={() => { savePreferences(); regenerateCurrentWeek(); }} className="gap-1"><RefreshCcw className="h-4 w-4"/> Regenerate</Button>
          <Button variant="outline" onClick={() => splitWeekSessions()} className="gap-1"><SplitSquareHorizontal className="h-4 w-4"/> Split Sessions</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1"><Plus className="h-4 w-4"/> Add Session</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={lessonId} onValueChange={v => setLessonId(v)}>
                  <SelectTrigger><SelectValue placeholder="Select lesson" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {mockLessons.map(l => (
                      <SelectItem value={l.id} key={l.id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Planned Minutes</label>
                  <Input type="number" value={minutes} min={15} step={15} onChange={e => setMinutes(Number(e.target.value))} />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAdd} disabled={submitting || !lessonId || !date} className="gap-1">
                    {submitting && <Loader2 className="h-4 w-4 animate-spin"/>}
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="next">What next</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="mt-6">
          <div className="grid md:grid-cols-7 gap-4">
            {days.map(d => (
              <Card key={d.date} className="flex flex-col">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>{new Date(d.date).toLocaleDateString(undefined,{ weekday:'short', month:'short', day:'numeric'})}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 p-3">
                  {d.sessions.map(s => {
                    const lesson = lessonsById[s.lessonId];
                    return (
                      <div key={s.id} className={cn('rounded-md border p-2 group text-xs space-y-1', s.status==='done' && 'bg-success/10 border-success/40')}> 
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium leading-tight line-clamp-2">{lesson?.title || 'Lesson'}</span>
                          <button onClick={() => deleteSession(s.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"><Trash2 className="h-3 w-3"/></button>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{minutesToHhMm(s.plannedMinutes)}</span>
                          <div className="flex gap-1">
                            <Badge variant={s.status==='done' ? 'default':'outline'} className="px-1 py-0 text-[10px] cursor-pointer" onClick={() => setStatus(s.id, s.status==='done' ? 'planned' : 'done')}>
                              {s.status==='done' ? <CheckCircle2 className="h-3 w-3"/> : 'Mark'}
                            </Badge>
                            {s.focusTag && <Badge variant="secondary" className="px-1 py-0 text-[10px]">{s.focusTag}</Badge>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {d.sessions.length === 0 && <div className="text-muted-foreground text-xs italic border border-dashed rounded p-2 text-center">No sessions yet</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <div className="space-y-3">
            {sessions.map(s => {
              const lesson = lessonsById[s.lessonId];
              return (
                <Card key={s.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{lesson?.title}</p>
                      <p className="text-xs text-muted-foreground">{s.date} • {minutesToHhMm(s.plannedMinutes)} • {s.status}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button size="sm" variant={s.status==='done' ? 'secondary':'outline'} onClick={() => setStatus(s.id, s.status==='done' ? 'planned' : 'done')} className="h-7 text-xs">{s.status==='done' ? 'Undo':'Complete'}</Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteSession(s.id)} className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                </Card>
              );
            })}
            {sessions.length===0 && <div className="text-sm text-muted-foreground border border-dashed rounded p-6 text-center">No sessions planned yet. Use <span className="font-medium">Add Session</span> to get started.</div>}
          </div>
        </TabsContent>
        <TabsContent value="stats" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4"/> Planned Time</CardTitle></CardHeader>
              <CardContent className="text-3xl font-heading font-bold">{minutesToHhMm(stats.plannedMinutes)}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Completed</CardTitle></CardHeader>
              <CardContent className="text-3xl font-heading font-bold">{minutesToHhMm(stats.completedMinutes)}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2">Rate</CardTitle></CardHeader>
              <CardContent className="text-3xl font-heading font-bold">{Math.round(stats.completionRate*100)}%</CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="next" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2"><ArrowRight className="h-4 w-4"/> What next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextSession ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{lessonsById[nextSession.lessonId]?.title ?? 'Next session'}</div>
                    <div className="text-xs text-muted-foreground">{new Date(nextSession.date).toLocaleDateString()} • {minutesToHhMm(nextSession.plannedMinutes)} • {nextSession.focusTag ?? 'focus'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setStatus(nextSession.id, 'in-progress')} className="gap-1"><ArrowRight className="h-4 w-4"/> Start</Button>
                    <Button variant="outline" onClick={() => splitDaySessions(nextSession.date)} className="gap-1"><SplitSquareHorizontal className="h-4 w-4"/> Split</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">You're all caught up. Nice work!</p>
              )}
              <p className="text-xs text-muted-foreground">Tip: Split longer sessions to keep energy high. Apply your preferences to regenerate a better-balanced week.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
