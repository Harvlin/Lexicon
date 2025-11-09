import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, Target, Brain, Timer, Clock } from "lucide-react";

interface OnboardingState {
  goals: string[];
  customGoal: string;
  skills: string[];
  customSkill: string;
  dailyHours: number;
  preferredTime: string; // kept for backwards-compat display/storage
  // New versatile scheduling fields
  schedulePreset: string; // One of TIME_OPTIONS or "Custom"
  daysOfWeek: string[];   // When schedulePreset === 'Custom'
  specificTime: string;   // HH:mm when schedulePreset === 'Custom'
  reminderEnabled?: boolean;
}

const GOAL_OPTIONS = [
  "Get a new job",
  "Career advancement",
  "Build a portfolio",
  "Master fundamentals",
  "Upskill quickly",
  "Exam preparation",
];

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Machine Learning",
  "UI/UX",
  "Cloud",
  "Data Analysis",
  "Cybersecurity",
];

const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Late Night"];
const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STORAGE_KEY = "lexigrain:onboarding";
import { endpoints, fetchWithFallback } from "@/lib/api";
import type { ProcessResponseDTO } from "@/lib/types";
import type { OnboardingDTO } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // if we navigated from a fresh signup we should not auto-redirect
  const freshOnboarding = (location.state as any)?.freshOnboarding === true;
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<OnboardingState>(() => ({
    goals: [],
    customGoal: "",
    skills: [],
    customSkill: "",
    dailyHours: 1,
    preferredTime: TIME_OPTIONS[2],
    schedulePreset: TIME_OPTIONS[2],
    daysOfWeek: [],
    specificTime: "19:00",
    reminderEnabled: false,
  }));

  // Handle redirect unless forced or restarting
  const search = location.search;
  const force = /[?&]force=1/.test(search);
  const restart = /[?&]restart=1/.test(search);
  const [existingData, setExistingData] = useState<any>(null);

  // Helper: read local draft (and migrate legacy key) as fallback
  const readLocalDraft = (): OnboardingDTO | null => {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('lexicon:onboarding');
      if (legacy) {
        try { localStorage.setItem(STORAGE_KEY, legacy); } catch {}
        raw = legacy;
      }
    }
    if (!raw) return null;
    try { return JSON.parse(raw) as OnboardingDTO; } catch { return null; }
  };

  // Normalize incoming DTO into local component state
  const hydrateFrom = (dto: OnboardingDTO) => {
    setState(prev => ({
      ...prev,
      goals: Array.isArray(dto.goals) ? dto.goals : [],
      customGoal: "",
      skills: Array.isArray(dto.skills) ? dto.skills : [],
      customSkill: "",
      dailyHours: typeof dto.dailyHours === 'number' && !isNaN(dto.dailyHours) ? dto.dailyHours : prev.dailyHours,
      preferredTime: dto.schedulePreset && dto.schedulePreset !== 'Custom' ? dto.schedulePreset : prev.preferredTime,
      schedulePreset: dto.schedulePreset || prev.schedulePreset,
      daysOfWeek: Array.isArray(dto.daysOfWeek) ? dto.daysOfWeek : [],
      specificTime: dto.specificTime || prev.specificTime,
      reminderEnabled: !!dto.reminderEnabled,
    }));
  };

  useEffect(() => {
    // Prefer backend onboarding with a timeout; fallback to local storage draft safely
    (async () => {
      const { data, source } = await fetchWithFallback<OnboardingDTO | null>(
        async () => {
          const server = await endpoints.onboarding.get();
          return server ?? null;
        },
        () => readLocalDraft()
      );

      if (data) {
        setExistingData(data);
        hydrateFrom(data);
        if (data.completedAt && !force && !restart && !freshOnboarding) {
          navigate("/");
          return;
        }
      }

      if (restart) {
        localStorage.removeItem(STORAGE_KEY);
        try { await endpoints.onboarding.save({} as OnboardingDTO); } catch {}
      }
    })();
  }, [navigate, force, restart, freshOnboarding]);

  const totalSteps = 5; // added conclusion step
  const progress = ((step + 1) / totalSteps) * 100;
  const HOURS_MIN = 0.5;
  const HOURS_MAX = 12;
  const HOURS_STEP = 0.5;

  // Step descriptors for stepper UI
  const stepsMeta = useMemo(
    () => [
      { title: "Goals", subtitle: "What brings you here?", icon: Target },
      { title: "Skills", subtitle: "Pick your focus", icon: Brain },
      { title: "Time", subtitle: "Daily hours", icon: Timer },
      { title: "Schedule", subtitle: "Preferred time", icon: Clock },
      { title: "Review", subtitle: "Confirm setup", icon: CheckCircle2 },
    ],
    []
  );

  const toggleListItem = (key: 'goals' | 'skills', value: string) => {
    setState(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value]
    }));
  };

  const next = () => setStep(s => Math.min(totalSteps - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  const canContinue = () => {
    switch (step) {
      case 0: return state.goals.length > 0 || !!state.customGoal.trim();
      case 1: return state.skills.length > 0 || !!state.customSkill.trim();
      case 2: return state.dailyHours >= HOURS_MIN && state.dailyHours <= HOURS_MAX;
      case 3: {
        if (state.schedulePreset !== 'Custom') return !!state.schedulePreset;
        return state.daysOfWeek.length > 0 && !!state.specificTime;
      }
      default: return true;
    }
  };

  const finish = async () => {
    setSaving(true);
    const payload = {
      goals: [...state.goals, ...(state.customGoal ? [state.customGoal] : [])],
      skills: [...state.skills, ...(state.customSkill ? [state.customSkill] : [])],
      dailyHours: state.dailyHours,
      preferredTime: state.schedulePreset !== 'Custom' ? state.schedulePreset : 'Custom',
      // Extended schedule details (non-breaking additions)
      schedulePreset: state.schedulePreset,
      daysOfWeek: state.daysOfWeek,
      specificTime: state.specificTime,
      reminderEnabled: !!state.reminderEnabled,
      completedAt: new Date().toISOString(),
    };
    let processCalled = false;
    try {
      await endpoints.onboarding.save(payload as OnboardingDTO);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
      // Build preference string for process endpoint (concise + goals + skills)
      const preferenceText = [
        ...payload.goals,
        ...payload.skills,
        `${payload.dailyHours}h/day`,
        payload.schedulePreset === 'Custom'
          ? `Custom ${payload.daysOfWeek.join(',')} @ ${payload.specificTime}`
          : payload.schedulePreset
      ].filter(Boolean).join("; ");

      // Save pending preference for post-login auto-processing
      try { localStorage.setItem('lexigrain:pendingPreference', preferenceText); } catch {}
      try {
        const processResult: ProcessResponseDTO = await endpoints.process.preference(preferenceText);
        processCalled = true;
        // Persist lightweight reference of processed videos for quick library rendering before auth refresh
        if (processResult.videos && processResult.videos.length) {
          try { localStorage.setItem('lexigrain:processedVideos', JSON.stringify(processResult.videos)); } catch {}
        }
        if (processResult.savedToDatabase) {
          try { localStorage.removeItem('lexigrain:pendingPreference'); } catch {}
        }
      } catch (e: any) {
        // Silent fallback (user might not be authenticated yet)
        console.warn('Process endpoint failed:', e?.message || e);
      }
    } catch {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
      toast({
        title: "Saved locally",
        description: "We’ll sync your onboarding once you’re online.",
      });
    }
    setSaving(false);
    navigate("/auth/signin", { replace: true, state: { fromOnboarding: true, processTriggered: processCalled } });
  };

  // Completion guards for stepper navigation
  const isStepComplete = (idx: number) => {
    switch (idx) {
      case 0:
        return state.goals.length > 0 || !!state.customGoal.trim();
      case 1:
        return state.skills.length > 0 || !!state.customSkill.trim();
      case 2:
        return state.dailyHours > 0;
      case 3:
        return !!state.preferredTime;
      default:
        return true;
    }
  };

  const maxReachableStep = useMemo(() => {
    let maxIdx = 0;
    for (let i = 0; i < totalSteps - 1; i++) {
      if (isStepComplete(i)) {
        maxIdx = i + 1;
      } else {
        break;
      }
    }
    return Math.min(maxIdx, totalSteps - 1);
  }, [state, totalSteps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-8 animate-slide-up">
        <div className="text-center space-y-4 relative">
          <div className="absolute right-0 -top-2 flex gap-3">
            {!!existingData?.completedAt && !restart && (
              <button
                type="button"
                onClick={() => navigate('/onboarding?restart=1')}
                className="text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >Restart</button>
            )}
            <button
              type="button"
              onClick={() => freshOnboarding ? navigate('/auth/signin', { replace: true, state: { fromOnboarding: true, skipped: true } }) : navigate('/')}
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >Skip</button>
          </div>
          <Badge className="inline-flex items-center gap-1"><Sparkles className="h-4 w-4" /> Personalized Setup</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            Let's Tailor Your <span className="text-primary">Learning</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Answer a few quick questions so we can craft a learning path just for you.</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          {/* Stepper */}
          <div className="hidden md:flex items-center gap-2">
            {stepsMeta.map((s, i) => {
              const Icon = s.icon;
              const complete = isStepComplete(i);
              const active = i === step;
              const reachable = i <= maxReachableStep;
              return (
                <div key={s.title} className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    type="button"
                    aria-current={active ? 'step' : undefined}
                    disabled={!reachable}
                    onClick={() => reachable && setStep(i)}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg border transition w-full ${
                      active ? 'border-accent bg-accent/10' : complete ? 'border-primary/40 bg-primary/5' : 'border-muted'
                    } ${!reachable ? 'opacity-60 cursor-not-allowed' : 'hover:border-foreground/30'}`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                      active ? 'border-accent text-accent' : complete ? 'border-primary text-primary' : 'border-muted-foreground/40 text-muted-foreground'
                    }`}>
                      {complete && i !== stepsMeta.length - 1 ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className="text-left truncate">
                      <span className={`block text-sm font-medium ${active ? 'text-foreground' : 'text-foreground/90'}`}>{s.title}</span>
                      <span className="block text-xs text-muted-foreground truncate">{s.subtitle}</span>
                    </span>
                    <Icon className={`ml-auto h-4 w-4 ${active ? 'text-accent' : complete ? 'text-primary' : 'text-muted-foreground'}`} />
                  </button>
                  {i < stepsMeta.length - 1 && (
                    <div className={`h-[2px] flex-1 ${i < step ? 'bg-primary/60' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              {step === 0 && "What are your primary goals?"}
              {step === 1 && "What skills do you want to learn?"}
              {step === 2 && "How many hours per day can you learn?"}
              {step === 3 && "When do you prefer to study?"}
              {step === 4 && "You're All Set!"}
            </CardTitle>
            {step === 0 && (
              <p className="text-sm text-muted-foreground">Choose as many as you like or add your own.</p>
            )}
            {step === 1 && (
              <p className="text-sm text-muted-foreground">Pick the areas you want to focus on first.</p>
            )}
            {step === 2 && (
              <p className="text-sm text-muted-foreground">Consistency beats intensity — start small and build momentum.</p>
            )}
            {step === 3 && (
              <p className="text-sm text-muted-foreground">We’ll use this to suggest reminders that fit your routine.</p>
            )}
          </CardHeader>
          <CardContent className="space-y-8">
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {GOAL_OPTIONS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleListItem('goals', g)}
                    aria-pressed={state.goals.includes(g)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent hover:border-primary/60 hover:bg-primary/5 ${state.goals.includes(g) ? 'border-primary bg-primary/10 ring-0' : 'border-muted'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border ${state.goals.includes(g) ? 'bg-primary/10 border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                        {state.goals.includes(g) && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="font-medium">{g}</span>
                    </div>
                  </button>
                ))}
                <div className="sm:col-span-2 space-y-2">
                  <Input
                    placeholder="Other goal..."
                    value={state.customGoal}
                    onChange={e => setState(p => ({ ...p, customGoal: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {SKILL_OPTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleListItem('skills', s)}
                    aria-pressed={state.skills.includes(s)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent hover:border-secondary/60 hover:bg-secondary/5 ${state.skills.includes(s) ? 'border-secondary bg-secondary/10 ring-0' : 'border-muted'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border ${state.skills.includes(s) ? 'bg-secondary/10 border-secondary text-secondary' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                        {state.skills.includes(s) && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="font-medium">{s}</span>
                    </div>
                  </button>
                ))}
                <div className="sm:col-span-2 space-y-2">
                  <Input
                    placeholder="Other skill..."
                    value={state.customSkill}
                    onChange={e => setState(p => ({ ...p, customSkill: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Daily Learning Time</span>
                  <span className="font-semibold text-lg">{state.dailyHours} {state.dailyHours === 1 ? 'hr' : 'hrs'}</span>
                </div>
                {/* Number input synced with slider */}
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    step={HOURS_STEP}
                    min={HOURS_MIN}
                    max={HOURS_MAX}
                    value={state.dailyHours}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const clamped = Math.min(HOURS_MAX, Math.max(HOURS_MIN, val));
                      setState(p => ({ ...p, dailyHours: Number((Math.round(clamped / HOURS_STEP) * HOURS_STEP).toFixed(1)) }));
                    }}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">hours per day</span>
                </div>
                <Slider
                  value={[state.dailyHours]}
                  min={HOURS_MIN}
                  max={HOURS_MAX}
                  step={HOURS_STEP}
                  onValueChange={v => setState(p => ({ ...p, dailyHours: Number(v[0].toFixed(1)) }))}
                />
                {/* Slider marks */}
                <div className="grid grid-cols-7 text-[10px] text-muted-foreground/80 select-none">
                  {[0.5, 2, 4, 6, 8, 10, 12].map((mark) => (
                    <div key={mark} className="text-center">{mark}</div>
                  ))}
                </div>
                {/* Quick presets */}
                <div className="flex flex-wrap gap-2">
                  {[0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12].map(v => (
                    <Button key={v} type="button" variant={state.dailyHours === v ? 'default' : 'outline'} className={state.dailyHours === v ? 'bg-accent hover:bg-accent-hover border-transparent' : ''} onClick={() => setState(p => ({ ...p, dailyHours: v }))}>
                      {v} {v === 1 ? 'hour' : 'hours'}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">You can adjust this later in settings.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Preset selector */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...TIME_OPTIONS, 'Custom'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setState(p => ({ ...p, schedulePreset: t, preferredTime: t !== 'Custom' ? t : p.preferredTime }))}
                      className={`p-4 rounded-xl border-2 transition-all hover:border-accent/60 hover:bg-accent/5 ${state.schedulePreset === t ? 'border-accent bg-accent/10' : 'border-muted'}`}
                    >
                      <span className="font-medium">{t}</span>
                    </button>
                  ))}
                </div>

                {/* Custom schedule controls */}
                {state.schedulePreset === 'Custom' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Days of the week</p>
                      <div className="flex flex-wrap gap-2">
                        {DAY_OPTIONS.map(d => {
                          const active = state.daysOfWeek.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() =>
                                setState(p => ({
                                  ...p,
                                  daysOfWeek: active ? p.daysOfWeek.filter(x => x !== d) : [...p.daysOfWeek, d],
                                }))
                              }
                              className={`px-3 py-1.5 rounded-md border text-sm transition ${active ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-foreground'} hover:border-foreground/40`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Preferred time</p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="time"
                          value={state.specificTime}
                          onChange={e => setState(p => ({ ...p, specificTime: e.target.value }))}
                          className="w-36"
                        />
                        <span className="text-xs text-muted-foreground">24h format</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 mt-2">
                  <Checkbox id="reminder" checked={!!state.reminderEnabled} onCheckedChange={(v) => setState(p => ({ ...p, reminderEnabled: !!v }))} className="mt-1" />
                  <label htmlFor="reminder" className="text-sm text-muted-foreground">Send me gentle reminders.</label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">Review your setup</h2>
                  <p className="text-muted-foreground">You can change these anytime in Settings.</p>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-xl border bg-card/60">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading font-semibold text-sm tracking-wide">Goals</h3>
                      <Badge variant="secondary" className="text-[10px] px-1.5">{[...state.goals, ...(state.customGoal? [state.customGoal]:[])].length || 0}</Badge>
                    </div>
                    <ul className="text-sm space-y-1 min-h-[88px]">
                      {([ ...state.goals, ...(state.customGoal? [state.customGoal]:[]) ].length === 0) && <li className="text-muted-foreground italic">No goals selected</li>}
                      {[...state.goals, ...(state.customGoal? [state.customGoal]:[])].map(g => (
                        <li key={g} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />{g}
                        </li>))}
                    </ul>
                    <button onClick={() => setStep(0)} className="mt-4 text-xs font-medium text-primary hover:underline">Edit Goals</button>
                  </div>
                  <div className="p-5 rounded-xl border bg-card/60">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading font-semibold text-sm tracking-wide">Skills</h3>
                      <Badge variant="secondary" className="text-[10px] px-1.5">{[...state.skills, ...(state.customSkill? [state.customSkill]:[])].length || 0}</Badge>
                    </div>
                    <ul className="text-sm space-y-1 min-h-[88px]">
                      {([ ...state.skills, ...(state.customSkill? [state.customSkill]:[]) ].length === 0) && <li className="text-muted-foreground italic">No skills selected</li>}
                      {[...state.skills, ...(state.customSkill? [state.customSkill]:[])].map(s => (
                        <li key={s} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />{s}
                        </li>))}
                    </ul>
                    <button onClick={() => setStep(1)} className="mt-4 text-xs font-medium text-primary hover:underline">Edit Skills</button>
                  </div>
                  <div className="p-5 rounded-xl border bg-card/60">
                    <h3 className="font-heading font-semibold mb-3 text-sm tracking-wide">Plan & Schedule</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Daily:</span> {state.dailyHours} {state.dailyHours === 1 ? 'hour' : 'hours'}</p>
                      <p>
                        <span className="font-medium">Schedule:</span> {state.schedulePreset !== 'Custom' ? state.schedulePreset : (
                          <>
                            Custom ({state.daysOfWeek.length > 0 ? state.daysOfWeek.join(', ') : 'No days'}) at {state.specificTime || '—'}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Reminders: {state.reminderEnabled ? 'On' : 'Off'}</p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setStep(2)} className="text-xs font-medium text-primary hover:underline">Adjust Hours</button>
                      <button onClick={() => setStep(3)} className="text-xs font-medium text-primary hover:underline">Adjust Schedule</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Button variant="outline" onClick={() => setStep(0)} className="min-w-[140px]">Edit Answers</Button>
                  <Button onClick={finish} disabled={saving} className="bg-accent hover:bg-accent-hover min-w-[200px] font-semibold">{saving ? 'Saving...' : 'Start Learning'}</Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" disabled={step === 0} onClick={prev}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < totalSteps - 1 && step !== 4 ? (
                <Button onClick={next} disabled={!canContinue()} className="bg-accent hover:bg-accent-hover">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : step !== 4 ? (
                <Button onClick={() => setStep(4)} disabled={!canContinue()} className="bg-primary hover:bg-primary-hover min-w-[140px]">Review</Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">Step {step + 1} of {totalSteps}</p>
      </div>
    </div>
  );
}
