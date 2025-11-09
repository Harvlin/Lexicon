import { useEffect, useMemo, useRef, useState } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { mockLessons } from '@/lib/mockData';
import type { LessonDTO } from '@/lib/types';
import { endpoints } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, CheckCircle2, Clock, Loader2, Trash2, CalendarDays, Settings, TrendingUp, Target, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

function formatWeekLabel(weekId: string) {
  return weekId.replace('-W', ' • Week ');
}

function minutesToHhMm(m: number) {
  const h = Math.floor(m/60); const mm = m % 60; return `${h}h${mm ? ' ' + mm + 'm' : ''}`;
}

function toISODate(d: Date) { return d.toISOString().substring(0,10); }

export default function SchedulePage() {
  const { user } = useAuth();
  // @ts-ignore source is an extra field for UI
  const { weekId, sessions, stats, addSession, deleteSession, setStatus, regenerateCurrentWeek, shiftWeek, source } = useSchedule();

  // Fetch real lessons from backend
  const [realLessons, setRealLessons] = useState<LessonDTO[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsFetched, setLessonsFetched] = useState(false);

  useEffect(() => {
    // Only fetch lessons if user is authenticated
    if (!user) {
      console.log('🔒 User not authenticated, using mock lessons');
      return;
    }
    
    if (lessonsFetched) return;
    
    setLessonsLoading(true);
    console.log('🔄 Fetching videos (lessons) from backend...');
    
    // Fetch real videos from study-materials endpoint
    fetch('http://localhost:8080/api/study-materials/videos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('lexigrain:authToken')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(response => {
        console.log('📥 Backend response:', response);
        
        if (response.videos && response.videos.length > 0) {
          // Transform videos to LessonDTO format
          const lessons = response.videos.map((video: any) => ({
            id: String(video.id),
            title: video.title,
            description: `${video.channelTitle} - ${video.topic}`,
            category: video.topic,
            difficulty: 'beginner',
            duration: video.duration || 30, // Use real duration from backend, fallback to 30
            progress: 0,
            thumbnail: '🎥',
            type: 'video',
            tags: [video.topic],
            isFavorite: false,
            videoUrl: video.videoUrl,
          }));
          
          console.log(`✅ Fetched ${lessons.length} videos from backend`);
          setRealLessons(lessons);
          try {
            localStorage.setItem('lexigrain:lessons:cache', JSON.stringify(lessons));
          } catch {}
        } else {
          console.warn('⚠️  Backend returned empty videos list, using mock data');
        }
      })
      .catch(err => {
        console.warn('⚠️  Could not fetch videos from backend, using mock data');
        console.warn('   Reason:', err.message);
        
        // Try loading from cache first
        try {
          const cached = localStorage.getItem('lexigrain:lessons:cache');
          if (cached) {
            const cachedLessons = JSON.parse(cached);
            if (cachedLessons.length > 0) {
              setRealLessons(cachedLessons);
              console.log(`📦 Loaded ${cachedLessons.length} lessons from cache`);
              return;
            }
          }
        } catch {}
        
        // Ultimate fallback: use mock lessons (will be used via availableLessons)
        console.log('📝 Using mock lessons as fallback');
      })
      .finally(() => {
        setLessonsLoading(false);
        setLessonsFetched(true);
      });
  }, [user, lessonsFetched]);

  // Helper to extract lesson number from "lesson-X" format
  const extractLessonNumber = (id: string): string => {
    if (id.startsWith('lesson-')) return id.substring(7);
    return id;
  };

  // Combine real lessons with mock fallback
  const availableLessons = useMemo(() => {
    if (realLessons.length > 0) return realLessons;
    return mockLessons;
  }, [realLessons]);

  // Create lesson lookup by both formats (ID and "lesson-ID")
  const lessonsById = useMemo(() => {
    const map: Record<string, LessonDTO> = {};
    availableLessons.forEach(l => {
      map[l.id] = l;
      map[`lesson-${l.id}`] = l;
      // Also support numeric extraction
      const num = extractLessonNumber(l.id);
      if (num !== l.id) {
        map[num] = l;
      }
    });
    return map;
  }, [availableLessons]);

  // Calendar + day focus
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try {
      const raw = localStorage.getItem('lexigrain:schedule:selectedDate');
      if (raw) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) return d;
      }
    } catch {}
    return new Date();
  });
  const selectedISO = toISODate(selectedDate);

  // Add session modal
  const [openAdd, setOpenAdd] = useState(false);
  const [lessonId, setLessonId] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(60);
  const [submitting, setSubmitting] = useState(false);

  // Preferences modal (compact)
  const [openPrefs, setOpenPrefs] = useState(false);
  const [schedulePreset, setSchedulePreset] = useState<string>('Evening');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Mon','Tue','Wed','Thu','Fri']);
  const [specificTime, setSpecificTime] = useState<string>('19:00');
  const [dailyHours, setDailyHours] = useState<number>(1);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  
  // Track completion changes to refresh the view
  const [completionRefresh, setCompletionRefresh] = useState(0);
  
  // Listen for localStorage changes to sync completion status
  useEffect(() => {
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'lexigrain:completedVideos') {
        setCompletionRefresh(prev => prev + 1);
      }
    };
    
    window.addEventListener('localStorageChange' as any, handleCustomStorageChange as any);
    return () => window.removeEventListener('localStorageChange' as any, handleCustomStorageChange as any);
  }, []);

  // Load onboarding preferences
  useEffect(() => {
    try {
      let raw = localStorage.getItem('lexigrain:onboarding') || localStorage.getItem('lexicon:onboarding');
      if (!raw) return;
      const p = JSON.parse(raw);
      setSchedulePreset(p.schedulePreset ?? p.preferredTime ?? 'Evening');
      setDaysOfWeek(Array.isArray(p.daysOfWeek) ? p.daysOfWeek : ['Mon','Tue','Wed','Thu','Fri']);
      setSpecificTime(p.specificTime ?? '19:00');
      setDailyHours(p.dailyHours ?? 1);
      setReminderEnabled(!!p.reminderEnabled);
    } catch {}
  }, []);

  const savePreferences = () => {
    try {
      const raw = localStorage.getItem('lexigrain:onboarding') || localStorage.getItem('lexicon:onboarding');
      const prev = raw ? JSON.parse(raw) : {};
      const next = { ...prev, schedulePreset, daysOfWeek, specificTime, dailyHours, reminderEnabled };
      try { localStorage.setItem('lexigrain:onboarding', JSON.stringify(next)); } catch {}
    } catch {}
  };

  const daySessions = useMemo(() => sessions.filter(s => s.date === selectedISO).sort((a,b) => a.createdAt.localeCompare(b.createdAt)), [sessions, selectedISO]);

  // Sync completion status from localStorage on component mount
  useEffect(() => {
    const completedVideos = JSON.parse(localStorage.getItem('lexigrain:completedVideos') || '{}');
    
    // For each completed video in localStorage, check if there's a session that should be marked as done
    Object.keys(completedVideos).forEach(videoId => {
      sessions.forEach(session => {
        if (session.lessonId === videoId && session.status !== 'done') {
          // Mark the session as done to sync with localStorage
          setStatus(session.id, 'done');
        }
      });
    });
  }, []); // Only run once on mount

  const hasSessionsDates = useMemo(() => new Set(sessions.map(s => s.date)), [sessions]);
  const completedDates = useMemo(() => new Set(sessions.filter(s => s.status==='done').map(s => s.date)), [sessions]);

  const handleAdd = async () => {
    if (!lessonId) return;
    setSubmitting(true);
    addSession({ lessonId, date: selectedISO, plannedMinutes: minutes });
    setSubmitting(false);
    setOpenAdd(false);
    setLessonId(''); setMinutes(60);
  };

  // Handle session completion with toast feedback
  const handleCompleteSession = (sessionId: string, currentStatus: string, lessonTitle: string, lessonId: string) => {
    const newStatus = currentStatus === 'done' ? 'planned' : 'done';
    setStatus(sessionId, newStatus);
    
    if (newStatus === 'done') {
      // Also update localStorage for consistency with Lesson page
      const completedVideos = JSON.parse(localStorage.getItem('lexigrain:completedVideos') || '{}');
      if (!completedVideos[lessonId]) {
        completedVideos[lessonId] = {
          completedAt: new Date().toISOString(),
          title: lessonTitle,
          duration: lessonsById[lessonId]?.duration || 0
        };
        localStorage.setItem('lexigrain:completedVideos', JSON.stringify(completedVideos));
        
        // Dispatch custom event for same-window sync
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key: 'lexigrain:completedVideos' }
        }));
      }
      
      toast.success("Session completed! 🎉", {
        description: `Great work on "${lessonTitle}"`,
        duration: 3000
      });
    } else {
      // Remove from localStorage when unmarking as complete
      const completedVideos = JSON.parse(localStorage.getItem('lexigrain:completedVideos') || '{}');
      delete completedVideos[lessonId];
      localStorage.setItem('lexigrain:completedVideos', JSON.stringify(completedVideos));
      
      // Dispatch custom event for same-window sync
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key: 'lexigrain:completedVideos' }
      }));
      
      toast.info("Session marked as planned", {
        description: `"${lessonTitle}" moved back to planned`,
        duration: 2000
      });
    }
  };

  // On initial load only: if starting on a day with no sessions, move to earliest session date once.
  const didInitialAutoFocus = useRef(false);
  useEffect(() => {
    if (didInitialAutoFocus.current) return;
    if (sessions.length > 0 && daySessions.length === 0) {
      const earliest = sessions.slice().sort((a,b) => a.date.localeCompare(b.date))[0];
      if (earliest) {
        const newDate = new Date(earliest.date);
        if (!Number.isNaN(newDate.getTime())) {
          setSelectedDate(newDate);
          didInitialAutoFocus.current = true;
        }
      }
    } else if (sessions.length > 0) {
      // If current day already has sessions, mark as done
      didInitialAutoFocus.current = true;
    }
  }, [sessions, daySessions.length]);

  // Persist selected date
  useEffect(() => {
    try { localStorage.setItem('lexigrain:schedule:selectedDate', selectedDate.toISOString()); } catch {}
  }, [selectedDate]);

  const completedCount = sessions.filter(s => s.status === 'done').length;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <h1 className="text-4xl font-heading font-bold tracking-tight">Your Schedule</h1>
                  {realLessons.length > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-green-400/90 text-green-900 px-3 py-1 text-xs font-bold tracking-wide uppercase shadow-lg">
                      {realLessons.length} Lessons Synced
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-400/90 text-yellow-900 px-3 py-1 text-xs font-bold tracking-wide uppercase shadow-lg">
                      Mock Data
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                    {formatWeekLabel(weekId)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Target className="h-4 w-4" />
                    {sessions.length} sessions
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4" />
                    {minutesToHhMm(stats.plannedMinutes)} planned
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    {Math.round(stats.completionRate*100)}% complete
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Primary actions: Add first, then regenerate, split, settings */}
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 shadow-lg order-1">
                      <Plus className="h-4 w-4"/> Add Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-heading">New Study Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Lesson</label>
                        <Select value={lessonId} onValueChange={v => setLessonId(v)}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Choose a lesson" /></SelectTrigger>
                          <SelectContent className="max-h-72">
                            {lessonsLoading ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                Loading lessons...
                              </div>
                            ) : availableLessons.length === 0 ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                No lessons available
                              </div>
                            ) : (
                              availableLessons.map(l => (
                                <SelectItem value={l.id} key={l.id}>{l.title}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Planned Duration</label>
                        <Input type="number" value={minutes} min={15} step={15} onChange={e => setMinutes(Number(e.target.value)||60)} className="h-11" />
                        <p className="text-xs text-muted-foreground">In minutes (e.g., 60 = 1 hour)</p>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button onClick={handleAdd} disabled={submitting || !lessonId} className="gap-2 bg-gradient-primary text-primary-foreground">
                          {submitting && <Loader2 className="h-4 w-4 animate-spin"/>}
                          Create Session
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="default" onClick={() => { savePreferences(); regenerateCurrentWeek(); }} className="gap-2 shadow-lg order-2">
                  <RefreshCcw className="h-4 w-4"/> Regenerate
                </Button>
                <Dialog open={openPrefs} onOpenChange={setOpenPrefs}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 shadow-lg order-3">
                      <Settings className="h-4 w-4"/> Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-heading flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Study Preferences
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid sm:grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Preset</label>
                        <Select value={schedulePreset} onValueChange={setSchedulePreset}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select preset"/></SelectTrigger>
                          <SelectContent>
                            {['Morning','Afternoon','Evening','Late Night','Custom'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Daily hours</label>
                        <Input type="number" min={0.5} step={0.5} max={12} value={dailyHours} onChange={e => setDailyHours(parseFloat(e.target.value)||1)} className="h-11" />
                      </div>
                      {schedulePreset === 'Custom' && (
                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Days of Week</label>
                          <div className="flex flex-wrap gap-2">
                            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
                              const active = daysOfWeek.includes(d);
                              return (
                                <button key={d} type="button" onClick={() => setDaysOfWeek(active ? daysOfWeek.filter(x=>x!==d) : [...daysOfWeek, d])} className={cn(
                                  'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                                  active 
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                )}>
                                  {d}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {schedulePreset === 'Custom' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Time</label>
                          <Input type="time" value={specificTime} onChange={e => setSpecificTime(e.target.value)} className="h-11" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 sm:col-span-2 p-4 rounded-lg bg-muted/50">
                        <Switch id="reminders2" checked={reminderEnabled} onCheckedChange={(v)=> setReminderEnabled(!!v)} />
                        <label htmlFor="reminders2" className="text-sm font-medium">Enable study reminders</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" onClick={savePreferences}>Save Changes</Button>
                      <Button onClick={() => { savePreferences(); regenerateCurrentWeek(); setOpenPrefs(false); }} className="bg-gradient-primary text-primary-foreground">
                        Apply to Week
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state when no sessions */}
        {sessions.length === 0 ? (
          <Card className="border-2 border-dashed shadow-xl">
            <CardContent className="py-16 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-[hsl(var(--primary)/0.12)] dark:bg-[hsl(var(--primary)/0.15)] rounded-2xl flex items-center justify-center">
                <CalendarDays className="h-10 w-10 text-[hsl(var(--primary))]" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-heading font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Plan Your First Study Session
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Use the calendar to pick a date and add a session, or let the app generate a balanced week from your preferences.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button size="lg" className="gap-2 bg-gradient-primary text-white shadow-lg hover:shadow-xl transition-all" onClick={() => setOpenAdd(true)}>
                  <Plus className="h-5 w-5"/> Add Session
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-2" onClick={() => { savePreferences(); regenerateCurrentWeek(); }}>
                  <RefreshCcw className="h-5 w-5"/> Generate Week
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 shadow-xl border-0 overflow-hidden bg-card">
            <CardHeader className="pb-3 border-b bg-muted">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                modifiers={{
                  hasSessions: (date) => hasSessionsDates.has(toISODate(date)),
                  completed: (date) => completedDates.has(toISODate(date)),
                }}
                modifiersClassNames={{
                  hasSessions: "font-semibold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary/60",
                  completed: "font-semibold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-success",
                }}
                className="rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Day agenda */}
          <Card className="lg:col-span-1 shadow-xl border-0 overflow-hidden bg-card">
            <CardHeader className="pb-3 border-b bg-muted">
              <CardTitle className="text-lg font-semibold">
                {selectedDate.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 max-h-[500px] overflow-y-auto">
              {daySessions.map((s, idx) => {
                const lesson = lessonsById[s.lessonId];
                return (
                  <div 
                    key={s.id} 
                    className={cn(
                      'rounded-xl border-2 p-4 group text-sm transition-all duration-300 hover:shadow-lg',
                      s.status==='done' 
                        ? 'bg-success/10 border-success/50' 
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="font-semibold leading-snug line-clamp-2 text-base">{lesson?.title || 'Lesson'}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant={s.status === 'done' ? 'default' : 'secondary'} className="text-[10px] font-medium">
                            {s.status}
                          </Badge>
                          {lesson?.duration && lesson.duration > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {minutesToHhMm(lesson.duration)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Button 
                          size="sm" 
                          variant={s.status==='done' ? 'default':'outline'} 
                          onClick={() => handleCompleteSession(s.id, s.status, lesson?.title || 'Lesson', s.lessonId)} 
                          className={cn(
                            'h-8 text-xs font-medium transition-all',
                            s.status === 'done' && 'bg-success hover:brightness-95 text-white'
                          )}
                        >
                          {s.status==='done' ? <><CheckCircle2 className="h-3 w-3 mr-1"/>Done</> : 'Complete'}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => deleteSession(s.id)} 
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-3.5 w-3.5"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {daySessions.length===0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">No sessions scheduled for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Week summary */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-xl border-0 overflow-hidden bg-gradient-primary text-primary-foreground">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  This Week's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-4xl font-heading font-bold mb-1">{minutesToHhMm(stats.plannedMinutes)}</div>
                  <div className="text-white/80 text-sm">Total planned time</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">{sessions.length}</div>
                    <div className="text-xs text-white/80">Sessions</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <div className="text-xs text-white/80">Completed</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/80">Completion</span>
                    <span className="font-bold">{Math.round(stats.completionRate*100)}%</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success transition-all duration-500 rounded-full"
                      style={{ width: `${Math.round(stats.completionRate*100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 overflow-hidden bg-card">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  All Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 max-h-[280px] overflow-y-auto">
                {sessions.map((s) => {
                  const lesson = lessonsById[s.lessonId];
                  const isSelected = s.date === selectedISO;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => setSelectedDate(new Date(s.date))} 
                      className={cn(
                        'w-full text-left rounded-lg border-2 px-3 py-2.5 text-xs hover:shadow-md transition-all duration-200',
                        isSelected 
                          ? 'border-primary bg-primary/10 dark:bg-primary/15 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{lesson?.title ?? 'Lesson'}</span>
                        {s.status === 'done' && <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />}
                      </div>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        <span>{new Date(s.date).toLocaleDateString(undefined,{ month:'short', day:'numeric'})}</span>
                        <span>•</span>
                        <Badge variant={s.status === 'done' ? 'default' : 'secondary'} className="text-[9px] h-4 px-1.5">
                          {s.status}
                        </Badge>
                        {lesson?.duration && lesson.duration > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {minutesToHhMm(lesson.duration)}
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
                {sessions.length===0 && (
                  <div className="text-center py-8 space-y-2">
                    <div className="text-sm text-muted-foreground">No sessions planned yet.</div>
                    <p className="text-xs text-muted-foreground">Add your first session to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
