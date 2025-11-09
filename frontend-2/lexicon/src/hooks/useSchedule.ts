import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mockLessons } from '@/lib/mockData';
import { endpoints } from '@/lib/api';
import type { ScheduleSessionDTO, ScheduleWeekDTO, LessonDTO } from '@/lib/types';

/**
 * Schedule session domain model
 */
export interface ScheduleSession {
  id: string;              // uuid or DB id
  lessonId: string;        // reference to lesson (supports both mock IDs and "lesson-X" format)
  date: string;            // ISO date (yyyy-mm-dd)
  plannedMinutes: number;  // planned study duration
  actualMinutes?: number;  // real time spent
  status: 'planned' | 'in-progress' | 'done' | 'skipped';
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  focusTag?: string;       // optional tag (e.g. "review", "core", etc.)
}

interface WeekData { sessions: ScheduleSession[]; source?: 'onboarding' | 'mock' | 'api'; }

// Prefer new brand key; migrate legacy if present
const STORAGE_KEY = 'lexigrain:schedule:v1';
const LESSONS_CACHE_KEY = 'lexigrain:lessons:cache';

interface StoredShape { [weekId: string]: WeekData }

// Helper: normalize lesson ID for backend (ensure "lesson-X" format)
function normalizeLessonId(id: string): string {
  // If already in "lesson-X" format, return as-is
  if (id.startsWith('lesson-')) return id;
  // If numeric or other format, convert to "lesson-X"
  const numMatch = id.match(/^\d+$/);
  if (numMatch) return `lesson-${id}`;
  // Otherwise assume it's already a valid format
  return id;
}

// Helper: extract numeric ID from "lesson-X" format
function extractLessonNumber(id: string): string {
  if (id.startsWith('lesson-')) return id.substring(7);
  return id;
}

// Helper: get week id (ISO year-week)
export function getWeekId(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((target.getTime()-yearStart.getTime())/86400000)+1)/7);
  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}

function toISODate(d: Date) { return d.toISOString().substring(0,10); }

function safeUuid() {
  try {
    const g: any = (typeof globalThis !== 'undefined') ? globalThis : window;
    if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  } catch {}
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Parse week id (YYYY-Www) -> Monday date (UTC normalized but we return local date object at midnight)
function mondayFromWeekId(weekId: string): Date {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return startOfWeekISO(new Date());
  const year = Number(match[1]);
  const week = Number(match[2]);
  // ISO week 1: week containing Jan 4. Find Monday of week1
  const jan4 = new Date(Date.UTC(year,0,4));
  const day = jan4.getUTCDay() || 7; // 1..7
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() + (1 - day)); // Monday of week 1
  const mondayTarget = new Date(mondayWeek1);
  mondayTarget.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);
  // Convert to local midnight
  const local = new Date(mondayTarget.getUTCFullYear(), mondayTarget.getUTCMonth(), mondayTarget.getUTCDate());
  return local;
}

// Generate initial week based on onboarding preferences
function generateWeekFromOnboarding(weekId: string): WeekData {
  try {
    // Read onboarding from new key first, then legacy; migrate forward
    let raw = localStorage.getItem('lexigrain:onboarding');
    if (!raw) {
      const legacy = localStorage.getItem('lexicon:onboarding');
      if (legacy) {
        try { localStorage.setItem('lexigrain:onboarding', legacy); } catch {}
        raw = legacy;
      }
    }
    const parsed = raw ? JSON.parse(raw) : {};
    const dailyHours = parsed.dailyHours ?? 1; // default 1 hour
    const schedulePreset: string = parsed.schedulePreset ?? parsed.preferredTime ?? 'Evening';
    const customDays: string[] = Array.isArray(parsed.daysOfWeek) ? parsed.daysOfWeek : [];
    const splitPreferred: boolean = !!parsed.splitSessionsPreferred;
    const lessonsPool = [...mockLessons];

    const monday = mondayFromWeekId(weekId);
    const sessions: ScheduleSession[] = [];
    const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const isCustom = schedulePreset === 'Custom' && customDays.length > 0;
    const activeDays = isCustom ? customDays : ['Mon','Tue','Wed','Thu','Fri'];
    for (let i=0;i<7;i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate()+i);
      const dayName = DAY_NAMES[i % 7];
      if (!activeDays.includes(dayName)) continue;
      const dayMinutes = dailyHours * 60;
      // slice lessons cycling
      const lesson = lessonsPool[(i) % lessonsPool.length];
      const isoDate = toISODate(dayDate);
      const shouldSplit = splitPreferred && dayMinutes >= 120;
      if (shouldSplit) {
        // split into two sessions: first 60 min (or half if smaller), second remainder
        const first = Math.min(60, Math.floor(dayMinutes / 2));
        const second = Math.max(dayMinutes - first, 30);
        const lesson2 = lessonsPool[(i+1) % lessonsPool.length];
        sessions.push({
          id: safeUuid(),
          lessonId: normalizeLessonId(lesson.id),
          date: isoDate,
          plannedMinutes: first,
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusTag: 'part 1'
        });
        sessions.push({
          id: safeUuid(),
          lessonId: normalizeLessonId(lesson2.id),
          date: isoDate,
          plannedMinutes: second,
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusTag: 'part 2'
        });
      } else {
        sessions.push({
          id: safeUuid(),
          lessonId: normalizeLessonId(lesson.id),
          date: isoDate,
          plannedMinutes: dayMinutes,
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusTag: i === 6 ? 'review' : 'core'
        });
      }
    }
    return { sessions, source: 'onboarding' };
  } catch {
    return { sessions: [], source: 'mock' };
  }
}

function startOfWeekISO(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // adjust when day is sunday
  date.setDate(date.getDate()+diff);
  date.setHours(0,0,0,0);
  return date;
}

export interface UseScheduleApi {
  weekId: string;
  sessions: ScheduleSession[];
  refresh: () => void;
  addSession: (input: Omit<Partial<ScheduleSession>, 'id' | 'createdAt' | 'updatedAt'> & { lessonId: string; date: string; plannedMinutes: number }) => void;
  updateSession: (id: string, patch: Partial<ScheduleSession>) => void;
  deleteSession: (id: string) => void;
  setStatus: (id: string, status: ScheduleSession['status']) => void;
  getWeek: (weekId: string) => ScheduleSession[];
  goToWeek: (weekId: string) => void;
  regenerateCurrentWeek: () => void;
  shiftWeek: (delta: number) => void;
  splitWeekSessions: (thresholdMinutes?: number) => void;
  splitDaySessions: (date: string, thresholdMinutes?: number) => void;
  stats: {
    plannedMinutes: number;
    completedMinutes: number;
    completionRate: number;
    sessionsPlanned: number;
    sessionsCompleted: number;
  };
}

export function useSchedule(initialDate: Date = new Date()): UseScheduleApi {
  const [weekId, setWeekId] = useState(getWeekId(initialDate));
  const [store, setStore] = useState<StoredShape>(() => {
    // Try new key first; if missing, migrate legacy schedule key forward
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('lexicon:schedule:v1');
      if (legacy) {
        try { localStorage.setItem(STORAGE_KEY, legacy); } catch {}
        raw = legacy;
      }
    }
    if (raw) return JSON.parse(raw);
    return {} as StoredShape;
  });

  // Ensure week exists by trying backend first, then fallback generate/store
  useEffect(() => {
    (async () => {
      try {
        const serverWeek = await endpoints.schedule.getWeek(weekId);
        setStore(prev => ({ ...prev, [weekId]: { sessions: serverWeek.sessions as any, source: 'api' } }));
        return;
      } catch (err) {
        // Log warning but don't fail - fallback to local
        console.warn('Could not fetch week from backend, using local data:', (err as Error).message);
      }
      setStore(prev => {
        if (prev[weekId]) return prev;
        const generated = generateWeekFromOnboarding(weekId);
        const next = { ...prev, [weekId]: generated };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    })();
  }, [weekId]);

  const persist = useCallback((next: StoredShape) => {
    setStore(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    // Best-effort push current week to API
    const current = next[weekId];
    if (current) {
      const payload: ScheduleWeekDTO = { weekId, sessions: current.sessions as unknown as ScheduleSessionDTO[], source: 'onboarding' };
      endpoints.schedule.saveWeek(weekId, payload).catch((err) => {
        console.warn('Failed to sync week to backend:', (err as Error).message);
      });
    }
  }, [weekId]);

  const currentWeekSessions = useMemo(() => store[weekId]?.sessions ?? [], [store, weekId]);
  const currentWeekSource = store[weekId]?.source;

  const refresh = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setStore(JSON.parse(raw));
  }, []);

  const mutateWeek = useCallback((fn: (sessions: ScheduleSession[]) => ScheduleSession[]) => {
    const prev = store[weekId] ?? { sessions: [], source: 'mock' as WeekData['source'] };
    persist({ ...store, [weekId]: { ...prev, sessions: fn(currentWeekSessions) } });
  }, [persist, store, weekId, currentWeekSessions]);

  const addSession: UseScheduleApi['addSession'] = useCallback((input) => {
    const newSession: ScheduleSessionDTO = {
      id: safeUuid(),
      lessonId: normalizeLessonId(input.lessonId),
      date: input.date,
      plannedMinutes: input.plannedMinutes,
      status: (input as any).status ?? 'planned',
      actualMinutes: (input as any).actualMinutes,
      focusTag: (input as any).focusTag,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mutateWeek(sessions => [...sessions, newSession]);
    const payload = {
      lessonId: newSession.lessonId,
      date: newSession.date,
      plannedMinutes: newSession.plannedMinutes,
      status: newSession.status,
      actualMinutes: newSession.actualMinutes,
      focusTag: newSession.focusTag,
    } as Omit<ScheduleSessionDTO, 'id' | 'createdAt' | 'updatedAt'>;
    endpoints.schedule.addSession(weekId, payload).catch((err) => {
      console.warn('Failed to sync session to backend:', err.message);
    });
  }, [mutateWeek, weekId]);

  const updateSession: UseScheduleApi['updateSession'] = useCallback((id, patch) => {
    const withTs = { ...patch, updatedAt: new Date().toISOString() } as Partial<ScheduleSessionDTO>;
    mutateWeek(sessions => sessions.map(s => s.id === id ? { ...s, ...withTs } : s));
    endpoints.schedule.updateSession(weekId, id, withTs).catch((err) => {
      console.warn('Failed to sync session update to backend:', err.message);
    });
  }, [mutateWeek, weekId]);

  const deleteSession: UseScheduleApi['deleteSession'] = useCallback((id) => {
    mutateWeek(sessions => sessions.filter(s => s.id !== id));
    endpoints.schedule.deleteSession(weekId, id).catch((err) => {
      console.warn('Failed to sync session deletion to backend:', err.message);
    });
  }, [mutateWeek, weekId]);

  const setStatus: UseScheduleApi['setStatus'] = useCallback((id, status) => {
    updateSession(id, { status });
  }, [updateSession]);

  const getWeek: UseScheduleApi['getWeek'] = useCallback((targetWeekId) => {
    return store[targetWeekId]?.sessions ?? [];
  }, [store]);

  const goToWeek: UseScheduleApi['goToWeek'] = useCallback((targetWeekId) => {
    setWeekId(targetWeekId);
  }, []);

  const regenerateCurrentWeek = useCallback(() => {
    const regenerated = generateWeekFromOnboarding(weekId);
    persist({ ...store, [weekId]: regenerated });
  }, [persist, store, weekId]);

  // Shift current week by delta weeks
  const shiftWeek = useCallback((delta: number) => {
    const anchorMonday = mondayFromWeekId(weekId);
    anchorMonday.setDate(anchorMonday.getDate() + delta * 7);
    const newWeekId = getWeekId(anchorMonday);
    setWeekId(newWeekId);
  }, [weekId]);

  const splitLogic = useCallback((sessions: ScheduleSession[], date?: string, thresholdMinutes: number = 120) => {
    // Group by date and split any long single sessions
    const byDate = new Map<string, ScheduleSession[]>();
    sessions.forEach(s => {
      if (date && s.date !== date) return;
      const key = s.date;
      if (!byDate.has(key)) byDate.set(key, []);
      byDate.get(key)!.push(s);
    });
    const keep: ScheduleSession[] = [];
    const replace: ScheduleSession[] = [];
    // decide lessons rotation for part 2
    const lessonIndex = (id: string) => mockLessons.findIndex(l => l.id === id);
    sessions.forEach(s => {
      const group = byDate.get(s.date);
      const isTargeted = !date || s.date === date;
      if (!group || !isTargeted) {
        keep.push(s);
        return;
      }
      // only split when the day currently has exactly 1 session and it's long
      if (group.length === 1 && s.plannedMinutes >= thresholdMinutes) {
        const first = Math.min(60, Math.floor(s.plannedMinutes / 2));
        const second = Math.max(s.plannedMinutes - first, 30);
        const idx = Math.max(0, lessonIndex(s.lessonId));
        const alt = mockLessons[(idx + 1) % mockLessons.length];
        replace.push({
          ...s,
          id: safeUuid(),
          plannedMinutes: first,
          status: 'planned',
          focusTag: 'part 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        replace.push({
          ...s,
          id: safeUuid(),
          lessonId: normalizeLessonId(alt.id),
          plannedMinutes: second,
          status: 'planned',
          focusTag: 'part 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        keep.push(s);
      }
    });
    // merge: for targeted dates, remove originals and add replacements
    const targetedDates = date ? [date] : Array.from(byDate.keys());
    const filtered = keep.filter(s => !targetedDates.includes(s.date) || (byDate.get(s.date)?.length ?? 0) !== 1 || (byDate.get(s.date)![0].plannedMinutes < thresholdMinutes));
    return [...filtered, ...replace].sort((a,b) => (a.date.localeCompare(b.date)) || (a.createdAt.localeCompare(b.createdAt)));
  }, []);

  const splitWeekSessions = useCallback((thresholdMinutes: number = 120) => {
    mutateWeek(prev => splitLogic(prev, undefined, thresholdMinutes));
  }, [mutateWeek, splitLogic]);

  const splitDaySessions = useCallback((date: string, thresholdMinutes: number = 120) => {
    mutateWeek(prev => splitLogic(prev, date, thresholdMinutes));
  }, [mutateWeek, splitLogic]);

  const stats = useMemo(() => {
    const plannedMinutes = currentWeekSessions.reduce((acc, s) => acc + s.plannedMinutes, 0);
    const completedSessions = currentWeekSessions.filter(s => s.status === 'done');
    const completedMinutes = completedSessions.reduce((acc, s) => acc + (s.actualMinutes ?? s.plannedMinutes), 0);
    const sessionsPlanned = currentWeekSessions.length;
    const sessionsCompleted = completedSessions.length;
    const completionRate = sessionsPlanned ? sessionsCompleted / sessionsPlanned : 0;
    return { plannedMinutes, completedMinutes, completionRate, sessionsPlanned, sessionsCompleted };
  }, [currentWeekSessions]);

  // Auto mock fallback if still empty (future API can disable this by pre-populating)
  useEffect(() => {
    if ((store[weekId]?.sessions?.length ?? 0) === 0) {
      // create lightweight mock quick-fill using first 3 lessons if onboarding produced none
      const monday = mondayFromWeekId(weekId);
      const mock: ScheduleSession[] = mockLessons.slice(0,3).map((lesson, idx) => ({
        id: safeUuid(),
        lessonId: normalizeLessonId(lesson.id),
        date: toISODate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+idx)),
        plannedMinutes: 45,
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        focusTag: 'mock'
      }));
      persist({ ...store, [weekId]: { sessions: mock, source: 'mock' } });
    }
  }, [store, weekId, persist]);

  return {
    weekId,
    sessions: currentWeekSessions,
    refresh,
    addSession,
    updateSession,
    deleteSession,
    setStatus,
    getWeek,
    goToWeek,
    regenerateCurrentWeek,
    shiftWeek,
    splitWeekSessions,
    splitDaySessions,
    stats,
    // expose source for UI (cast to any to not break existing interface usage elsewhere)
    // @ts-expect-error add-on field for now
    source: currentWeekSource ?? 'mock'
  };
}
